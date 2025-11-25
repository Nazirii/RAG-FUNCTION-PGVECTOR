<?php

namespace App\Http\Controllers;

use App\Models\Menu;
use App\Services\GeminiEmbeddingService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class MenuController extends Controller
{
    private GeminiEmbeddingService $embeddingService;

    public function __construct(GeminiEmbeddingService $embeddingService)
    {
        $this->embeddingService = $embeddingService;
    }

    /**
     * Display a listing of the resource.
     * GET /menu
     */
    public function index(Request $request)
    {
        // Clean empty params from query string
        // $cleanedQuery = array_filter($request->query(), function($value) {
        //     return $value !== '' && $value !== null && $value !== 'null';
        // });
        // // Replace request query with cleaned version
        // $request->query->replace($cleanedQuery);

        // Check price filters after cleaning
        // $hasPriceFilter = $request->filled('min_price') || $request->filled('max_price');

        // Sorting
        $sortParts = explode(':', $request->get('sort', 'created_at:desc'));
        $sortField = $sortParts[0] ?? 'created_at';
        $sortOrder = $sortParts[1] ?? 'desc';

        // Pagination
        $perPage = $request->get('per_page', 10);
        
        $query = Menu::query()
            ->when($request->filled('q'), fn($q) => $q->search($request->q))
            ->when($request->filled('category'), fn($q) => $q->category($request->category))
            // ->when($hasPriceFilter, fn($q) => $q->priceRange($request->min_price, $request->max_price))
            ->when($request->filled('min_price') || $request->filled('max_price'),  fn($q) => 
            $q->priceRange($request->min_price, $request->max_price))
            ->when($request->filled('max_cal'), fn($q) => $q->maxCalories($request->max_cal))
            ->orderBy($sortField, $sortOrder);
        
        // Debug SQL
        $sql = $query->toSql();
        $bindings = $query->getBindings();
        
        $menus = $query->paginate($perPage);

        $response = [
            'data' => $menus->items(),
            'pagination' => [
                'total' => $menus->total(),
                'page' => $menus->currentPage(),
                'per_page' => $menus->perPage(),
                'total_pages' => $menus->lastPage(),
            ],
            'debug' => [
                'url' => $request->fullUrl(),
                'params' => $request->query(),
                'method' => $request->method(),
                'sql' => $sql,
                'bindings' => $bindings,
            ]
        ];

        return response()->json($response);
    }

    /**
     * Store a newly created resource in storage.
     * POST /menu
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'calories' => 'nullable|integer|min:0',
            'price' => 'required|numeric|min:0',
            'ingredients' => 'nullable|array',
            'description' => 'nullable|string',
            'image_url' => 'nullable|url',
            'is_available' => 'nullable|boolean',
            'preparation_time' => 'nullable|integer|min:0',
            'spicy_level' => 'nullable|in:none,mild,medium,hot,extra_hot',
            'allergens' => 'nullable|array',
            'nutritional_info' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $menu = Menu::create($request->all());

        // Generate embedding for the new menu
        try {
            $embedding = $this->embeddingService->generateMenuEmbedding([
                'name' => $menu->name,
                'category' => $menu->category,
                'description' => $menu->description,
                'ingredients' => $menu->ingredients,
                'calories' => $menu->calories,
                'price' => $menu->price,
                'preparation_time' => $menu->preparation_time,
                'spicy_level' => $menu->spicy_level,
                'allergens' => $menu->allergens,
                'nutritional_info' => $menu->nutritional_info,
            ]);

            $menu->embedding = '[' . implode(',', $embedding) . ']';
            $menu->save();
        } catch (\Exception $e) {
            Log::error('Failed to generate embedding for menu', [
                'menu_id' => $menu->id,
                'error' => $e->getMessage()
            ]);
            // Continue without embedding - non-blocking error
        }

        return response()->json([
            'message' => 'Menu created successfully',
            'data' => $menu
        ], 201);
    }

    /**
     * Display the specified resource.
     * GET /menu/{id}
     */
    public function show(string $id)
    {
        $menu = Menu::find($id);

        if (!$menu) {
            return response()->json([
                'message' => 'Menu not found'
            ], 404);
        }

        return response()->json([
            'data' => $menu
        ]);
    }

    /**
     * Update the specified resource in storage.
     * PUT /menu/{id}
     */
    public function update(Request $request, string $id)
    {
        $menu = Menu::find($id);

        if (!$menu) {
            return response()->json([
                'message' => 'Menu not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'calories' => 'nullable|integer|min:0',
            'price' => 'required|numeric|min:0',
            'ingredients' => 'nullable|array',
            'description' => 'nullable|string',
            'image_url' => 'nullable|url',
            'is_available' => 'nullable|boolean',
            'preparation_time' => 'nullable|integer|min:0',
            'spicy_level' => 'nullable|in:none,mild,medium,hot,extra_hot',
            'allergens' => 'nullable|array',
            'nutritional_info' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $menu->update($request->all());

        // Regenerate embedding after update
        try {
            $embedding = $this->embeddingService->generateMenuEmbedding([
                'name' => $menu->name,
                'category' => $menu->category,
                'description' => $menu->description,
                'ingredients' => $menu->ingredients,
                'calories' => $menu->calories,
                'price' => $menu->price,
                'preparation_time' => $menu->preparation_time,
                'spicy_level' => $menu->spicy_level,
                'allergens' => $menu->allergens,
                'nutritional_info' => $menu->nutritional_info,
            ]);

            $menu->embedding = '[' . implode(',', $embedding) . ']';
            $menu->save();
        } catch (\Exception $e) {
            Log::error('Failed to regenerate embedding for menu', [
                'menu_id' => $menu->id,
                'error' => $e->getMessage()
            ]);
            // Continue without embedding - non-blocking error
        }

        return response()->json([
            'message' => 'Menu updated successfully',
            'data' => $menu
        ]);
    }

    /**
     * Remove the specified resource from storage.
     * DELETE /menu/{id}
     */
    public function destroy(string $id)
    {
        $menu = Menu::find($id);

        if (!$menu) {
            return response()->json([
                'message' => 'Menu not found'
            ], 404);
        }

        $menu->delete();

        return response()->json([
            'message' => 'Menu deleted successfully'
        ]);
    }

    /**
     * Group menus by category
     * GET /menu/group-by-category
     */
    public function groupByCategory(Request $request)
    {
        $mode = $request->get('mode', 'count');

        if ($mode === 'count') {
            // Return count per category
            $categories = Menu::selectRaw('category, COUNT(*) as count')
                ->groupBy('category')
                ->pluck('count', 'category');

            return response()->json([
                'data' => $categories
            ]);
        } else {
            // Return list of menus per category
            $perCategory = $request->get('per_category', 5);
            
            $categories = Menu::all()->groupBy('category')->map(function ($items) use ($perCategory) {
                return $items->take($perCategory)->values();
            });

            return response()->json([
                'data' => $categories
            ]);
        }
    }

    /**
     * Search menus (convenience endpoint)
     * GET /menu/search
     */
    public function search(Request $request)
    {
        $query = Menu::query();

        if ($request->has('q') && $request->q) {
            $query->search($request->q);
        }

        $perPage = $request->get('per_page', 10);
        $menus = $query->paginate($perPage);

        return response()->json([
            'data' => $menus->items(),
            'pagination' => [
                'total' => $menus->total(),
                'page' => $menus->currentPage(),
                'per_page' => $menus->perPage(),
                'total_pages' => $menus->lastPage(),
            ]
        ]);
    }
}
