<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GeminiChatService
{
    private string $apiKey;
    private string $baseUrl = 'https://generativelanguage.googleapis.com/v1beta';
    private string $model = 'models/gemini-2.5-flash:generateContent';
    private string $defaultSystemPrompt;
    
    public function __construct()
    {
        $this->apiKey = config('services.gemini.api_key');
        
        if (empty($this->apiKey)) {
            throw new \Exception('Gemini API key not configured. Please set GEMINI_API_KEY in .env');
        }
        
        // Default system prompt untuk consistency
        $this->defaultSystemPrompt = "You are a helpful restaurant assistant for an Eatery/restauran named Borneo Eatery with access to various tools.your name is naziri,you just talk english

IMPORTANT GUIDELINES FOR RECOMMENDATIONS:
- Use the provided menu context (from RAG) to give accurate, relevant recommendations
- Always explain WHY your recommendations match the customer's needs
- Include prices when mentioning menu items (format: Rp X,XXX)
- If customer asks about energy/alertness/staying awake, prioritize caffeinated drinks
- If customer asks about spicy food, recommend items with medium/hot spicy levels
- Suggest complementary items when appropriate

FUNCTION CALLING GUIDELINES:
- add_to_cart: Use when customer explicitly wants to order/add items
  IMPORTANT: Each menu item in the context has an ID field. You MUST use this ID when calling add_to_cart.
  Example: If context shows 'Latte (ID: 29)', use add_to_cart with menu_id: 29
  
- view_cart: Use when customer asks about their current order/cart
  IMPORTANT: Function results are AUTOMATICALLY saved to conversation history!
  Before calling view_cart again, CHECK conversation history for recent view_cart results
  If cart data exists in history (within last few turns), USE that data instead of calling view_cart again

- remove_multiple_from_cart: Remove items from cart using menu_ids
  
CRITICAL WORKFLOW FOR CART OPERATIONS:

SCENARIO 1 - User asks to view cart:
- Call view_cart
- Results are saved to conversation history automatically

SCENARIO 2 - User wants to modify cart (remove/switch/change):
STEP 1: Check conversation history
- Look for recent view_cart function results in history
- If found (within last 3-5 turns), extract cart items with their menu_ids
- If NOT found or data is old, call view_cart first

STEP 2: Execute modifications
- You CAN call MULTIPLE functions in ONE turn:
  Example: \"switch A with B and remove C\"
  * Call remove_multiple_from_cart([menu_id_A, menu_id_C])
  * Call add_to_cart(menu_id_B)
- All removals can be combined into one remove_multiple_from_cart call

IMPORTANT:
- Function results (especially view_cart) are in conversation history - USE THEM!
- Extract menu_ids from functionResponse parts in history
- Only call view_cart if no recent cart data exists in history
- Can call multiple remove/add functions together in one turn
  
- update_cart_item: Use when customer wants to change quantity or notes of specific items
  Must have cart_item_id from view_cart result (check history first!)
  
- checkout: Use when customer is ready to pay/complete order
  Required: customer_name (can extract from session or ask if needed)
  
- get_order_status: Use when customer asks about order status with order number

CRITICAL: 
- Menu information (with IDs) is provided via RAG context
- Function results are saved to conversation history - check history before calling functions again!
- When adding items to cart, extract the menu_id from the context
- NEVER ask user for IDs - extract them from context or function results in history

Be friendly, conversational, and helpful!";
    }
    
    /**
     * Unified chat with RAG context and function calling support
     * Gemini will decide when to use functions or just return text
     * 
     * @param string $userMessage User's message/question
     * @param array|null $conversationHistory Previous messages in conversation (FE manages this)
     * @param string|null $context Additional context from RAG (semantic search)
     * @param string|null $systemPrompt System instruction for AI behavior
     * @return array Response with text, function calls, and metadata
     */
    public function chatWithFunctions(string $userMessage, ?array $conversationHistory = null, ?string $context = null, ?string $systemPrompt = null): array
    {
        
        try {
            // Use default system prompt if not provided
            if (!$systemPrompt) {
                $systemPrompt = $this->defaultSystemPrompt;
            }

        
            $contents = [];
            
            // Add conversation history if provided (FE manages this)
            if ($conversationHistory && is_array($conversationHistory)) {
                // Removed logging to avoid exposing conversation data
                
                foreach ($conversationHistory as $msg) {
                    $contents[] = $msg; // Already in correct format from FE
                }
            }
            
            // Add current user message with RAG context
            $userPrompt = $userMessage;
          
            if ($context) {
                $userPrompt = "Here is the relevant menu information:\n{$context}\n\nCustomer question: {$userMessage}";
            }
            
            $contents[] = [
                'role' => 'user',
                'parts' => [['text' => $userPrompt]]
            ];
         

            // Define available tools/functions
            $tools = $this->getFunctionDefinitions();
            
            // Build request payload
            $payload = [
                'contents' => $contents,
                'system_instruction' => [
                    'parts' => [
                        ['text' => $systemPrompt]
                    ]
                ],
                'tools' => [$tools],
                'generationConfig' => [
                    'temperature' => 0.7,
                    'topK' => 40,
                    'topP' => 0.95,
                    'maxOutputTokens' => 2048,
                ],
            ];
            

            $response = Http::timeout(60)
                ->withQueryParameters(['key' => $this->apiKey])
                ->post("{$this->baseUrl}/{$this->model}", $payload);

            if ($response->failed()) {
                Log::error('Gemini function calling API error', [
                    'status' => $response->status(),
                    'body_preview' => substr($response->body(), 0, 200)
                ]);
                throw new \Exception('Failed to generate response with functions: ' . $response->body());
            }

            $data = $response->json();

            // Check if model wants to call a function
            $candidate = $data['candidates'][0] ?? null;
            if (!$candidate) {
                throw new \Exception('No candidate in response');
            }

            $parts = $candidate['content']['parts'] ?? [];
            $functionCalls = [];
            $textResponse = null;

            // Extract function calls and text
            foreach ($parts as $part) {
                if (isset($part['functionCall'])) {
                    $functionCalls[] = [
                        'name' => $part['functionCall']['name'],
                        'args' => $part['functionCall']['args'] ?? []
                    ];
                }
                if (isset($part['text'])) {
                    $textResponse = $part['text'];
                }
            }

            return [
                'text' => $textResponse,
                'parts' => $parts, // Return exact parts from Gemini for history preservation
                'function_calls' => $functionCalls,
                'has_function_calls' => !empty($functionCalls),
                'finish_reason' => $candidate['finishReason'] ?? null,
                'prompt_tokens' => $data['usageMetadata']['promptTokenCount'] ?? null,
                'response_tokens' => $data['usageMetadata']['candidatesTokenCount'] ?? null,
                'total_tokens' => $data['usageMetadata']['totalTokenCount'] ?? null,
            ];

        } catch (\Exception $e) {
            Log::error('Error in function calling', [
                'error' => $e->getMessage(),
                'message' => substr($userMessage, 0, 100)
            ]);
            throw $e;
        }
    }

    /**
     * Send function results back to model to get final response
     * 
     * @param array $conversationHistory Full conversation including function calls
     * @param array $functionResults Results from executed functions
     * @param string|null $systemPrompt System instruction
     * @return array Final response from model
     */
    public function continueWithFunctionResults(array $conversationHistory, array $functionResults, ?string $systemPrompt = null): array
    {
        try {
            // Build contents with function results
            $contents = [];
            
            // Add conversation history (already in correct Gemini format)
            $contents = $conversationHistory;

            // Add function responses (Turn 3)
            // For Gemini 2.0+, function responses go in user role with functionResponse
            $functionResponseParts = [];
            foreach ($functionResults as $result) {
                $functionResponseParts[] = [
                    'functionResponse' => [
                        'name' => $result['name'],
                        'response' => $result['response']  // Already an array/object
                    ]
                ];
            }

            // Add function responses as user role (Gemini spec)
            $contents[] = [
                'role' => 'function',
                'parts' => $functionResponseParts
            ];

            $payload = [
                'contents' => $contents,
                'system_instruction' => [
                    'parts' => [
                        ['text' => $systemPrompt ?? $this->defaultSystemPrompt]
                    ]
                ],
                'generationConfig' => [
                    'temperature' => 0.7,
                    'maxOutputTokens' => 2048,
                ],
            ];

            $response = Http::timeout(60)
                ->withQueryParameters(['key' => $this->apiKey])
                ->post("{$this->baseUrl}/{$this->model}", $payload);

            if ($response->failed()) {
                throw new \Exception('Failed to get final response: ' . $response->body());
            }

            $data = $response->json();
            $responseText = $data['candidates'][0]['content']['parts'][0]['text'] ?? '';

            return [
                'text' => $responseText,
                'finish_reason' => $data['candidates'][0]['finishReason'] ?? null,
                'total_tokens' => $data['usageMetadata']['totalTokenCount'] ?? null,
            ];

        } catch (\Exception $e) {
            Log::error('Error continuing with function results', [
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }

    /**
     * Get function/tool definitions for Gemini API
     */
    private function getFunctionDefinitions(): array
    {
        return [
            'function_declarations' => [
                [
                    'name' => 'add_to_cart',
                    'description' => 'Add menu item(s) to customer cart. Use this when customer wants to order or add items.',
                    'parameters' => [
                        'type' => 'object',
                        'properties' => [
                            'menu_id' => [
                                'type' => 'integer',
                                'description' => 'ID of the menu item to add'
                            ],
                            'quantity' => [
                                'type' => 'integer',
                                'description' => 'Quantity to add (default: 1)'
                            ],
                            'notes' => [
                                'type' => 'string',
                                'description' => 'Special notes or customization for the item'
                            ]
                        ],
                        'required' => ['menu_id']
                    ]
                ],
                [
                    'name' => 'view_cart',
                    'description' => 'View current cart contents and total. Use when customer asks about their order or cart.',
                    'parameters' => [
                        'type' => 'object',
                        'properties' => (object)[]
                    ]
                ],
                [
                    'name' => 'remove_multiple_from_cart',
                    'description' => 'Remove items from cart using menu_ids obtained from view_cart. IMPORTANT: You can only call this AFTER you have menu_ids from a previous view_cart call in conversation history. If customer asks to remove items and you don\'t have cart data, call view_cart first and confirm with user before removing.',
                    'parameters' => [
                        'type' => 'object',
                        'properties' => [
                            'menu_ids' => [
                                'type' => 'array',
                                'items' => ['type' => 'integer'],
                                'description' => 'Array of menu IDs to remove. Extract from view_cart response.'
                            ]
                        ],
                        'required' => ['menu_ids']
                    ]
                ],
                [
                    'name' => 'update_cart_item',
                    'description' => 'Update quantity or notes of an item in cart. Use when customer wants to change order.',
                    'parameters' => [
                        'type' => 'object',
                        'properties' => [
                            'cart_item_id' => [
                                'type' => 'integer',
                                'description' => 'ID of the cart item to update'
                            ],
                            'quantity' => [
                                'type' => 'integer',
                                'description' => 'New quantity'
                            ],
                            'notes' => [
                                'type' => 'string',
                                'description' => 'Updated notes'
                            ]
                        ],
                        'required' => ['cart_item_id']
                    ]
                ],
                [
                    'name' => 'remove_from_cart',
                    'description' => 'Remove ONE specific cart item by cart_item_id (not menu_id). Use only when you have the cart_item_id from view_cart response.',
                    'parameters' => [
                        'type' => 'object',
                        'properties' => [
                            'cart_item_id' => [
                                'type' => 'integer',
                                'description' => 'ID of the cart item to remove (get from view_cart)'
                            ]
                        ],
                        'required' => ['cart_item_id']
                    ]
                ],
                [
                    'name' => 'checkout',
                    'description' => 'Process checkout and create order. Use when customer is ready to pay/complete order.',
                    'parameters' => [
                        'type' => 'object',
                        'properties' => [
                            'customer_name' => [
                                'type' => 'string',
                                'description' => 'Customer name for the order'
                            ],
                            'customer_phone' => [
                                'type' => 'string',
                                'description' => 'Customer phone number (optional)'
                            ],
                            'table_number' => [
                                'type' => 'string',
                                'description' => 'Table number for dine-in orders (optional)'
                            ],
                            'notes' => [
                                'type' => 'string',
                                'description' => 'Order notes or special instructions'
                            ]
                        ],
                        'required' => ['customer_name']
                    ]
                ],
                [
                    'name' => 'get_order_status',
                    'description' => 'Check order status using order number. Use when customer asks about their order status.',
                    'parameters' => [
                        'type' => 'object',
                        'properties' => [
                            'order_number' => [
                                'type' => 'string',
                                'description' => 'Order number to check'
                            ]
                        ],
                        'required' => ['order_number']
                    ]
                ]
            ]
        ];
    }
}
