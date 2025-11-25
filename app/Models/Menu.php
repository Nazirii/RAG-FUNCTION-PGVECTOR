<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Menu extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'category',
        'calories',
        'price',
        'ingredients',
        'description',
        'image_url',
        'is_available',
        'preparation_time',
        'spicy_level',
        'allergens',
        'nutritional_info',
    ];

    protected $hidden = [
        'embedding', // Hide large embedding vector from JSON response
    ];

    protected $casts = [
        'ingredients' => 'array',
        'allergens' => 'array',
        'nutritional_info' => 'array',
        'price' => 'decimal:2',
        'is_available' => 'boolean',
        'calories' => 'integer',
        'preparation_time' => 'integer',
    ];

    // Append similarity when it exists (from semantic search)
    // Note: This is dynamically added by selectRaw in scopeSemanticSearch
    // Laravel will automatically recognize it as an attribute
    protected $appends = [];

    // Temporary attribute for storing similarity score
    private $similarityScore = null;

    public function setSimilarityScore($score)
    {
        $this->similarityScore = $score;
        return $this;
    }

    public function getSimilarityScoreAttribute()
    {
        return $this->similarityScore;
    }

    // Scope for available menus
    public function scopeAvailable($query)
    {
        return $query->where('is_available', true);
    }

    // Scope for category filter
    public function scopeCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    // Scope for price range
    public function scopePriceRange($query, $min = null, $max = null)
    {
      
        if ($min !== null) {
            
            $query->where('price', '>=', $min);
        }
        if ($max !== null) {
            $query->where('price', '<=', $max);
        }
        return $query;
    }

    // Scope for max calories
    public function scopeMaxCalories($query, $maxCal)
    {
        return $query->where('calories', '<=', $maxCal);
    }

    // Scope for search
    // public function scopeSearch($query, $search)
    // {
    //     return $query->where(function($q) use ($search) {
    //         $q->where('name', 'LIKE', "%{$search}%")
    //           ->orWhere('description', 'LIKE', "%{$search}%")
    //           ->orWhereRaw('CAST(ingredients AS TEXT) ILIKE ?', ["%{$search}%"]);
    //     });
    // }
    public function scopeSearch($query, $search)
    {
        $search = strtolower(trim($search));

        return $query->where(function($q) use ($search) {
            $q->whereRaw('LOWER(name) LIKE ?', ["%{$search}%"])
              ->orWhereRaw('LOWER(description) LIKE ?', ["%{$search}%"])
              ->orWhereRaw("LOWER(ingredients::text) LIKE ?", ["%{$search}%"]);
        });
    }

    /**
     * Semantic search using vector similarity (cosine distance)
     * 
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param array $embedding Vector embedding to search with (768 dimensions)
     * @param int $limit Maximum number of results
     * @param float $threshold Minimum similarity threshold (0-1, default 0.5)
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeSemanticSearch($query, array $embedding, int $limit = 15, float $threshold = 0.5)
    {
        // Convert embedding array to PostgreSQL vector format
        $vectorString = '[' . implode(',', $embedding) . ']';
        
        // Calculate cosine similarity: 1 - cosine_distance
        // Using pgvector's <=> operator for cosine distance
        // Lower distance = more similar
        return $query
            ->selectRaw('menus.*, (1 - (embedding <=> ?::vector)) as similarity', [$vectorString])
            ->whereNotNull('embedding') // Only search items with embeddings
            ->whereRaw('(1 - (embedding <=> ?::vector)) >= ?', [$vectorString, $threshold])
            ->orderByRaw('embedding <=> ?::vector', [$vectorString]) // Order by distance (closest first)
            ->limit($limit);
    }

}
