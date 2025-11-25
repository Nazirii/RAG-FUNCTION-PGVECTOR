<?php

namespace App\Http\Controllers;

use App\Models\Menu;
use App\Services\GeminiChatService;
use App\Services\GeminiEmbeddingService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class AIController extends Controller
{
    private GeminiEmbeddingService $embeddingService;
    private GeminiChatService $chatService;

    public function __construct(
        GeminiEmbeddingService $embeddingService,
        GeminiChatService $chatService
    ) {
        $this->embeddingService = $embeddingService;
        $this->chatService = $chatService;
    }

    /**
     * Semantic search for menus using natural language query
     * POST /api/ai/search
     */
    public function semanticSearch(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'query' => 'required|string|min:3',
            'limit' => 'nullable|integer|min:1|max:50',
            'threshold' => 'nullable|numeric|min:0|max:1',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $query = $request->input('query');
        $limit = $request->input('limit', 15);
        $threshold = $request->input('threshold', 0.5);

        try {
            // Generate embedding for user query
            $queryEmbedding = $this->embeddingService->generateEmbedding($query);

            // Perform semantic search
            $results = Menu::semanticSearch($queryEmbedding, $limit, $threshold)->get();

            return response()->json([
                'query' => $query,
                'results_count' => $results->count(),
                'results' => $results,
            ]);

        } catch (\Exception $e) {
            Log::error('Semantic search error', [
                'query' => $query,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'message' => 'Failed to perform semantic search',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get relevant context (menus) for AI chat
     * POST /api/ai/context
     */
 

    /**
     * Build context string from menu items for AI consumption
     */
    private function buildContextString($menus): string
    {
        if ($menus->isEmpty()) {
            return "No relevant menu items found.";
        }

        $contextParts = ["Available menu items:"];

        foreach ($menus as $menu) {
            $parts = array_filter([
                "- {$menu->name} ({$menu->category})",
                "  ID: {$menu->id}",  // ← CRITICAL: Untuk function calling
                "  Price: Rp " . number_format($menu->price, 0, ',', '.'),
                $menu->description ? "  Description: {$menu->description}" : null,
                $menu->calories ? "  Calories: {$menu->calories} kcal" : null,
                $menu->ingredients ? "  Ingredients: " . implode(', ', $menu->ingredients) : null,
                $menu->spicy_level && $menu->spicy_level !== 'none' ? "  Spicy: {$menu->spicy_level}" : null,
                $menu->allergens ? "  Allergens: " . implode(', ', $menu->allergens) : null,
                $menu->preparation_time ? "  Prep time: {$menu->preparation_time} minutes" : null,
                $this->formatNutrition($menu->nutritional_info),
                "  Available: " . ($menu->is_available ? 'Yes' : 'No'),
            ]);

            $contextParts[] = implode("\n", $parts);
        }

        return implode("\n\n", $contextParts);
    }

    /**
     * Format nutritional info for context
     */
    private function formatNutrition($nutritionalInfo): ?string
    {
        if (!$nutritionalInfo || !is_array($nutritionalInfo)) {
            return null;
        }

        $nutrition = array_filter([
            isset($nutritionalInfo['protein']) ? "protein {$nutritionalInfo['protein']}g" : null,
            isset($nutritionalInfo['carbs']) ? "carbs {$nutritionalInfo['carbs']}g" : null,
            isset($nutritionalInfo['fat']) ? "fat {$nutritionalInfo['fat']}g" : null,
            isset($nutritionalInfo['fiber']) ? "fiber {$nutritionalInfo['fiber']}g" : null,
        ]);

        return !empty($nutrition) ? "  Nutrition: " . implode(', ', $nutrition) : null;
    }



    /**
     * Unified AI Chat - Combines RAG and Function Calling
     * Gemini decides when to use functions or just text response
     * Frontend manages conversation history
     * 
     * POST /api/ai/chat
     */
    public function chat(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'message' => 'required|string|min:1',
            'session_id' => 'required|string', // For cart/checkout functions
            'conversation_history' => 'nullable|array', // FE manages history
            'context_limit' => 'nullable|integer|min:1|max:15',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $userMessage = $request->input('message');
        $sessionId = $request->input('session_id');
        $conversationHistory = $request->input('conversation_history', []);
        $contextLimit = $request->input('context_limit', 8);

        // Validate and sanitize conversation history
        $conversationHistory = array_values(array_filter($conversationHistory, function($msg) {
            // Must have role and parts
            if (!isset($msg['role']) || !isset($msg['parts']) || !is_array($msg['parts'])) {
                return false;
            }
            // Filter out empty parts
            $msg['parts'] = array_values(array_filter($msg['parts'], function($part) {
                return is_array($part) && (
                    isset($part['text']) || 
                    isset($part['functionCall']) || 
                    isset($part['functionResponse'])
                );
            }));
            return !empty($msg['parts']);
        }));

        // Log incoming history structure for debugging
        Log::info('Incoming Conversation History', [
            'history_count' => count($conversationHistory),
            'history_sample' => count($conversationHistory) > 0 
                ? json_encode(array_slice($conversationHistory, -2), JSON_PRETTY_PRINT)
                : 'empty',
        ]);

        // Log basic info (removed sensitive data for production)
        Log::info('AI Chat Request', [
            'history_count' => count($conversationHistory),
        ]);

        try {
            // Always get RAG context from semantic search
            $queryEmbedding = $this->embeddingService->generateEmbedding($userMessage);
            $relevantMenus = Menu::semanticSearch($queryEmbedding, $contextLimit, 0.3)->get();
            
            $context = null;
            if ($relevantMenus->isNotEmpty()) {
                $context = $this->buildContextString($relevantMenus);
            }

            // Call Gemini with tools definition (biar AI yang decide)
            $response = $this->chatService->chatWithFunctions(
                $userMessage,
                $conversationHistory,
                $context
            );

            // Debug: Log AI response structure
            Log::info('AI Response Structure', [
                'has_function_calls' => $response['has_function_calls'],
                'text' => substr($response['text'] ?? 'null', 0, 100),
                'parts_count' => count($response['parts'] ?? []),
                'function_calls_count' => count($response['function_calls'] ?? []),
            ]);

            // If AI wants to call functions, execute them
            if ($response['has_function_calls']) {
                $functionResults = [];
                
                foreach ($response['function_calls'] as $functionCall) {
                    $result = $this->executeFunctionCall(
                        $functionCall['name'],
                        $functionCall['args'],
                        $sessionId
                    );
                    
                    $functionResults[] = [
                        'name' => $functionCall['name'],
                        'response' => $result
                    ];
                }

                // Build conversation for function result
                // CRITICAL: DO NOT include the model's functionCall response
                // Just send: previous history + current user message + function results
                $fullHistory = $conversationHistory;
                
                // Add user message with context
                $userPrompt = $userMessage;
                if ($context) {
                    $userPrompt = "Here is the relevant menu information:\n{$context}\n\nCustomer question: {$userMessage}";
                }
                
                $fullHistory[] = [
                    'role' => 'user',
                    'parts' => [['text' => $userPrompt]]
                ];
                
                // DO NOT add model's functionCall response here!
                // continueWithFunctionResults will handle function results directly

                // Send function results back for final response
                $finalResponse = $this->chatService->continueWithFunctionResults(
                    $fullHistory,
                    $functionResults
                );

                return response()->json([
                    'user_message' => $userMessage,
                    'ai_response' => $finalResponse['text'],
                    'parts' => [['text' => $finalResponse['text']]], // For history
                    'function_calls' => $response['function_calls'],
                    'function_results' => $functionResults,
                    'metadata' => [
                        'context_menus_count' => $relevantMenus->count(),
                        'total_tokens' => $response['total_tokens'] + ($finalResponse['total_tokens'] ?? 0),
                    ],
                    'context_menus' => $relevantMenus->map(fn($m) => [
                        'id' => $m->id,
                        'name' => $m->name,
                        'category' => $m->category,
                        'price' => $m->price,
                    ]),
                ]);
            }

            // No function calls, return direct text response
            return response()->json([
                'user_message' => $userMessage,
                'ai_response' => $response['text'],
                'parts' => [['text' => $response['text']]], // For history
                'function_calls' => [],
                'metadata' => [
                    'context_menus_count' => $relevantMenus->count(),
                    'total_tokens' => $response['total_tokens'],
                ],
                // 'context_menus' => $relevantMenus->map(fn($m) => [
                //     'id' => $m->id,
                //     'name' => $m->name,
                //     'category' => $m->category,
                //     'price' => $m->price,
                // ]),
            ]);

        } catch (\Exception $e) {
            Log::error('❌ AI chat error', [
                'session_id' => $sessionId ?? 'N/A',
                'message' => $userMessage,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);

            return response()->json([
                'message' => 'Failed to generate AI response',
                'error' => $e->getMessage(),
                'debug' => config('app.debug') ? [
                    'file' => $e->getFile(),
                    'line' => $e->getLine(),
                    'trace' => explode("\n", $e->getTraceAsString()),
                ] : null,
            ], 500);
        }
    }



    /**
     * Execute function call from AI
     */
    private function executeFunctionCall(string $functionName, array $args, string $sessionId): array
    {
        try {
            switch ($functionName) {
                case 'add_to_cart':
                    return $this->handleAddToCart($args, $sessionId);

                case 'view_cart':
                    return $this->handleViewCart($sessionId);

                case 'remove_multiple_from_cart':
                    return $this->handleRemoveMultipleFromCart($args, $sessionId);

                case 'update_cart_item':
                    return $this->handleUpdateCartItem($args, $sessionId);

                case 'remove_from_cart':
                    return $this->handleRemoveFromCart($args, $sessionId);

                case 'checkout':
                    return $this->handleCheckout($args, $sessionId);

                case 'get_order_status':
                    return $this->handleGetOrderStatus($args);

                default:
                    return [
                        'success' => false,
                        'error' => "Unknown function: {$functionName}"
                    ];
            }
        } catch (\Exception $e) {
            Log::error("Function execution error: {$functionName}", [
                'args' => $args,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }

    private function handleAddToCart(array $args, string $sessionId): array
    {
        $menu = Menu::find($args['menu_id']);
        
        if (!$menu) {
            return ['success' => false, 'error' => 'Menu not found'];
        }

        if (!$menu->is_available) {
            return ['success' => false, 'error' => 'Menu is not available'];
        }

        $cart = \App\Models\Cart::create([
            'session_id' => $sessionId,
            'menu_id' => $args['menu_id'],
            'quantity' => $args['quantity'] ?? 1,
            'price' => $menu->price,
            'notes' => $args['notes'] ?? null,
        ]);

        return [
            'success' => true,
            'cart_item_id' => $cart->id,
            'message' => "{$menu->name} added to cart"
        ];
    }

    private function handleViewCart(string $sessionId): array
    {
        $cartItems = \App\Models\Cart::with('menu')
            ->where('session_id', $sessionId)
            ->get();

        // Use menu price, not cart price (cart table doesn't have price column)
        $subtotal = $cartItems->sum(fn($item) => $item->menu->price * $item->quantity);

        return [
            'success' => true,
            'items' => $cartItems->map(fn($item) => [
                'cart_item_id' => $item->id,
                'menu_id' => $item->menu_id,
                'menu_name' => $item->menu->name,
                'quantity' => $item->quantity,
                'price' => $item->menu->price, // Get price from menu relation
                'subtotal' => $item->menu->price * $item->quantity,
                'notes' => $item->notes,
            ])->toArray(),
            'total_items' => $cartItems->count(),
            'subtotal' => $subtotal
        ];
    }

    private function handleRemoveMultipleFromCart(array $args, string $sessionId): array
    {
        if (empty($args['menu_ids'])) {
            return [
                'success' => false,
                'error' => 'No menu_ids provided'
            ];
        }

        $deleted = \App\Models\Cart::where('session_id', $sessionId)
            ->whereIn('menu_id', $args['menu_ids'])
            ->delete();

        return [
            'success' => true,
            'items_removed' => $deleted,
            'message' => "Removed {$deleted} item(s) from cart"
        ];
    }

    private function handleUpdateCartItem(array $args, string $sessionId): array
    {
        $cartItem = \App\Models\Cart::where('id', $args['cart_item_id'])
            ->where('session_id', $sessionId)
            ->first();

        if (!$cartItem) {
            return ['success' => false, 'error' => 'Cart item not found'];
        }

        if (isset($args['quantity'])) {
            $cartItem->quantity = $args['quantity'];
        }

        if (isset($args['notes'])) {
            $cartItem->notes = $args['notes'];
        }

        $cartItem->save();

        return [
            'success' => true,
            'message' => 'Cart item updated'
        ];
    }

    private function handleRemoveFromCart(array $args, string $sessionId): array
    {
        $deleted = \App\Models\Cart::where('id', $args['cart_item_id'])
            ->where('session_id', $sessionId)
            ->delete();

        if (!$deleted) {
            return ['success' => false, 'error' => 'Cart item not found'];
        }

        return [
            'success' => true,
            'message' => 'Item removed from cart'
        ];
    }

    private function handleCheckout(array $args, string $sessionId): array
    {
        $cartItems = \App\Models\Cart::with('menu')
            ->where('session_id', $sessionId)
            ->get();

        if ($cartItems->isEmpty()) {
            return ['success' => false, 'error' => 'Cart is empty'];
        }

        $subtotal = $cartItems->sum(fn($item) => $item->menu->price * $item->quantity);
        $tax = $subtotal * 0.10; // 10% tax
        $total = $subtotal + $tax;

        $transaction = \App\Models\Transaction::create([
            'session_id' => $sessionId, // ← FIX: Tambah session_id!
            'order_number' => 'ORD-' . strtoupper(uniqid()),
            'customer_name' => $args['customer_name'],
            'customer_phone' => $args['customer_phone'] ?? null,
            'table_number' => $args['table_number'] ?? null,
            'items' => $cartItems->map(fn($item) => [
                'menu_id' => $item->menu_id,
                'name' => $item->menu->name,
                'quantity' => $item->quantity,
                'price' => $item->menu->price, // ← FIX: Ambil dari menu, bukan cart!
            ])->toArray(),
            'subtotal' => $subtotal,
            'tax' => $tax,
            'total' => $total,
            'status' => 'pending',
            'notes' => $args['notes'] ?? null,
        ]);

        // Clear cart
        \App\Models\Cart::where('session_id', $sessionId)->delete();

        return [
            'success' => true,
            'order_number' => $transaction->order_number,
            'total' => $transaction->total,
            'message' => 'Order created successfully'
        ];
    }

    private function handleGetOrderStatus(array $args): array
    {
        $order = \App\Models\Transaction::where('order_number', $args['order_number'])->first();

        if (!$order) {
            return ['success' => false, 'error' => 'Order not found'];
        }

        return [
            'success' => true,
            'order' => [
                'order_number' => $order->order_number,
                'customer_name' => $order->customer_name,
                'status' => $order->status,
                'total' => $order->total,
                'created_at' => $order->created_at->toDateTimeString(),
                'items_count' => count($order->items),
            ]
        ];
    }
}
