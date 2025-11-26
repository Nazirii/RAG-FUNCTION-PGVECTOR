<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GeminiEmbeddingService
{
    private ?string $apiKey = null;
    private string $baseUrl = 'https://generativelanguage.googleapis.com/v1beta';
    
    public function __construct()
    {
        // Don't throw exception during construction (allows Laravel to boot)
        // API key will be validated when methods are actually called
    }
    
    /**
     * Get API key (lazy loading with validation)
     */
    private function getApiKey(): string
    {
        if ($this->apiKey === null) {
            $this->apiKey = config('services.gemini.api_key');
            
            if (empty($this->apiKey)) {
                throw new \Exception('Gemini API key not configured. Please set GEMINI_API_KEY in .env');
            }
        }
        
        return $this->apiKey;
    }
    
    /**
     * Generate embedding vector from text using Gemini API
     * 
     * @param string $text Text to generate embedding for
     * @return array Vector array with 768 dimensions
     */
    public function generateEmbedding(string $text): array
    {
        try {
            $response = Http::timeout(30)
            ->withQueryParameters([
                'key' => $this->getApiKey(), 
            ])
            ->withHeaders([
                'Content-Type' => 'application/json',
            ])
            ->post("{$this->baseUrl}/models/text-embedding-004:embedContent", [

                'content' => [ 
                    'parts' => [
                        ['text' => $text]
                    ]
                ]
    ]);

            if ($response->failed()) {
                Log::error('Gemini API error', [
                    'status' => $response->status(),
                    'body' => $response->body()
                ]);
                throw new \Exception('Failed to generate embedding: ' . $response->body());
            }
            
            $data = $response->json();
            
            // Gemini returns embedding in 'embedding.values' field
            if (!isset($data['embedding']['values'])) {
                throw new \Exception('Invalid response format from Gemini API');
            }
            
            return $data['embedding']['values'];
            
        } catch (\Exception $e) {
            Log::error('Error generating embedding', [
                'error' => $e->getMessage(),
                'text' => substr($text, 0, 100)
            ]);
            throw $e;
        }
    }
    
    /**
     * Generate embedding for a menu item
     * Combines name, description, ingredients, and category into searchable text
     * 
     * @param array $menuData Menu data array
     * @return array Vector array
     */
    public function generateMenuEmbedding(array $menuData): array
    {
        // Create rich text representation of menu for better semantic search
        $textParts = [
            "Menu: {$menuData['name']}",
            "Category: {$menuData['category']}",
        ];
        
        if (!empty($menuData['description'])) {
            $textParts[] = "Description: {$menuData['description']}";
        }
        
        if (!empty($menuData['ingredients']) && is_array($menuData['ingredients'])) {
            $ingredients = implode(', ', $menuData['ingredients']);
            $textParts[] = "Ingredients: {$ingredients}";
        }
        
        if (!empty($menuData['calories'])) {
            $textParts[] = "Calories: {$menuData['calories']} kcal";
        }
        
        if (!empty($menuData['price'])) {
            $textParts[] = "Price: Rp {$menuData['price']}";
        }
        
        if (!empty($menuData['preparation_time'])) {
            $textParts[] = "Preparation time: {$menuData['preparation_time']} minutes";
        }
        
        if (!empty($menuData['spicy_level']) && $menuData['spicy_level'] !== 'none') {
            $textParts[] = "Spicy level: {$menuData['spicy_level']}";
        }
        
        if (!empty($menuData['allergens']) && is_array($menuData['allergens'])) {
            $allergens = implode(', ', $menuData['allergens']);
            $textParts[] = "Allergens: {$allergens}";
        }
        
        if (!empty($menuData['nutritionals_info']) && is_array($menuData['nutritional_info'])) {
            $nutrition = [];
            if (isset($menuData['nutritional_info']['protein'])) {
                $nutrition[] = "protein {$menuData['nutritional_info']['protein']}g";
            }
            if (isset($menuData['nutritional_info']['carbs'])) {
                $nutrition[] = "carbs {$menuData['nutritional_info']['carbs']}g";
            }
            if (isset($menuData['nutritional_info']['fat'])) {
                $nutrition[] = "fat {$menuData['nutritional_info']['fat']}g";
            }
            if (isset($menuData['nutritional_info']['fiber'])) {
                $nutrition[] = "fiber {$menuData['nutritional_info']['fiber']}g";
            }
            
            if (!empty($nutrition)) {
                $textParts[] = "Nutritional info: " . implode(', ', $nutrition);
            }
        }
        
        $text = implode("\n", $textParts);
        
        return $this->generateEmbedding($text);
    }
}
