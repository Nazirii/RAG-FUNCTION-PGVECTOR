<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Menu;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class CartController extends Controller
{
    /**
     * Get session ID from request or generate new one
     */
    private function getSessionId(Request $request)
    {
        return $request->header('X-Session-ID') ?? $request->session()->getId();
    }

    /**
     * Get cart items
     * GET /cart
     */
    public function index(Request $request)
    {
        $sessionId = $this->getSessionId($request);
        
        $cartItems = Cart::with('menu')
            ->where('session_id', $sessionId)
            ->get();

        $subtotal = $cartItems->sum(function ($item) {
            return $item->menu->price * $item->quantity;
        });

        $tax = $subtotal * 0.1; // 10% tax
        $total = $subtotal + $tax;

        return response()->json([
            'data' => [
                'items' => $cartItems->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'menu' => [
                            'id' => $item->menu->id,
                            'name' => $item->menu->name,
                            'price' => $item->menu->price,
                            'category' => $item->menu->category,
                            'image_url' => $item->menu->image_url,
                        ],
                        'quantity' => $item->quantity,
                        'notes' => $item->notes,
                        'subtotal' => $item->menu->price * $item->quantity,
                        'created_at' => $item->created_at,
                    ];
                }),
                'summary' => [
                    'subtotal' => round($subtotal, 2),
                    'tax' => round($tax, 2),
                    'total' => round($total, 2),
                    'total_items' => $cartItems->count(),
                    'total_quantity' => $cartItems->sum('quantity'),
                ]
            ]
        ]);
    }

    /**
     * Add item to cart
     * POST /cart
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'menu_id' => 'required|exists:menus,id',
            'quantity' => 'required|integer|min:1',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $sessionId = $this->getSessionId($request);
        
        // Check if menu exists and available
        $menu = Menu::find($request->menu_id);
        if (!$menu->is_available) {
            return response()->json([
                'message' => 'Menu is not available'
            ], 400);
        }

        // Check if item already in cart
        $cartItem = Cart::where('session_id', $sessionId)
            ->where('menu_id', $request->menu_id)
            ->first();

        if ($cartItem) {
            // Update quantity if already exists
            $cartItem->quantity += $request->quantity;
            if ($request->has('notes')) {
                $cartItem->notes = $request->notes;
            }
            $cartItem->save();
        } else {
            // Create new cart item
            $cartItem = Cart::create([
                'session_id' => $sessionId,
                'menu_id' => $request->menu_id,
                'quantity' => $request->quantity,
                'notes' => $request->notes,
            ]);
        }

        $cartItem->load('menu');

        return response()->json([
            'message' => 'Item added to cart successfully',
            'data' => [
                'id' => $cartItem->id,
                'menu' => [
                    'id' => $cartItem->menu->id,
                    'name' => $cartItem->menu->name,
                    'price' => $cartItem->menu->price,
                ],
                'quantity' => $cartItem->quantity,
                'notes' => $cartItem->notes,
                'subtotal' => $cartItem->menu->price * $cartItem->quantity,
            ]
        ], 201);
    }

    /**
     * Update cart item quantity
     * PUT /cart/{id}
     */
    public function update(Request $request, string $id)
    {
        $validator = Validator::make($request->all(), [
            'quantity' => 'required|integer|min:1',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $sessionId = $this->getSessionId($request);
        
        $cartItem = Cart::where('id', $id)
            ->where('session_id', $sessionId)
            ->first();

        if (!$cartItem) {
            return response()->json([
                'message' => 'Cart item not found'
            ], 404);
        }

        $cartItem->update([
            'quantity' => $request->quantity,
            'notes' => $request->notes ?? $cartItem->notes,
        ]);

        $cartItem->load('menu');

        return response()->json([
            'message' => 'Cart item updated successfully',
            'data' => [
                'id' => $cartItem->id,
                'quantity' => $cartItem->quantity,
                'notes' => $cartItem->notes,
                'subtotal' => $cartItem->menu->price * $cartItem->quantity,
            ]
        ]);
    }

    /**
     * Remove item from cart
     * DELETE /cart/{id}
     */
    public function destroy(Request $request, string $id)
    {
        $sessionId = $this->getSessionId($request);
        
        $cartItem = Cart::where('id', $id)
            ->where('session_id', $sessionId)
            ->first();

        if (!$cartItem) {
            return response()->json([
                'message' => 'Cart item not found'
            ], 404);
        }

        $cartItem->delete();

        return response()->json([
            'message' => 'Item removed from cart successfully'
        ]);
    }

    /**
     * Clear all cart items
     * DELETE /cart
     */
    public function clear(Request $request)
    {
        $sessionId = $this->getSessionId($request);
        
        Cart::where('session_id', $sessionId)->delete();

        return response()->json([
            'message' => 'Cart cleared successfully'
        ]);
    }

    /**
     * Checkout - Create transaction
     * POST /cart/checkout
     */
    public function checkout(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'customer_name' => 'nullable|string|max:255',
            'customer_phone' => 'nullable|string|max:20',
            'table_number' => 'nullable|string|max:10',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $sessionId = $this->getSessionId($request);
        
        // Get cart items
        $cartItems = Cart::with('menu')
            ->where('session_id', $sessionId)
            ->get();

        if ($cartItems->isEmpty()) {
            return response()->json([
                'message' => 'Cart is empty'
            ], 400);
        }

        // Calculate totals
        $subtotal = $cartItems->sum(function ($item) {
            return $item->menu->price * $item->quantity;
        });

        $tax = $subtotal * 0.1; // 10% tax
        $total = $subtotal + $tax;

        // Prepare items data
        $items = $cartItems->map(function ($item) {
            return [
                'menu_id' => $item->menu->id,
                'menu_name' => $item->menu->name,
                'category' => $item->menu->category,
                'price' => $item->menu->price,
                'quantity' => $item->quantity,
                'notes' => $item->notes,
                'subtotal' => $item->menu->price * $item->quantity,
            ];
        })->toArray();

        // Create transaction
        DB::beginTransaction();
        try {
            $transaction = Transaction::create([
                'order_number' => Transaction::generateOrderNumber(),
                'session_id' => $sessionId,
                'customer_name' => $request->customer_name,
                'customer_phone' => $request->customer_phone,
                'table_number' => $request->table_number,
                'items' => $items,
                'subtotal' => $subtotal,
                'tax' => $tax,
                'total' => $total,
                'status' => 'pending',
                'notes' => $request->notes,
            ]);

            // Clear cart after successful checkout
            Cart::where('session_id', $sessionId)->delete();

            DB::commit();

            return response()->json([
                'message' => 'Checkout successful',
                'data' => [
                    'order_number' => $transaction->order_number,
                    'customer_name' => $transaction->customer_name,
                    'table_number' => $transaction->table_number,
                    'items' => $transaction->items,
                    'subtotal' => $transaction->subtotal,
                    'tax' => $transaction->tax,
                    'total' => $transaction->total,
                    'status' => $transaction->status,
                    'created_at' => $transaction->created_at,
                ]
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Checkout failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get transaction by order number
     * GET /orders/{order_number}
     */
    public function getOrder(string $orderNumber)
    {
        $transaction = Transaction::where('order_number', $orderNumber)->first();

        if (!$transaction) {
            return response()->json([
                'message' => 'Order not found'
            ], 404);
        }

        return response()->json([
            'data' => $transaction
        ]);
    }

    /**
     * Get all orders for a session
     * GET /orders
     */
    public function getOrders(Request $request)
    {
        $sessionId = $this->getSessionId($request);
        
        $transactions = Transaction::where('session_id', $sessionId)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'data' => $transactions
        ]);
    }
}
