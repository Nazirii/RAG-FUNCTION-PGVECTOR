<?php

namespace Database\Seeders;

use App\Models\Menu;
use App\Services\GeminiEmbeddingService;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MenuSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $embeddingService = new GeminiEmbeddingService();
        
        $menus = [
            // Indonesian Main Dishes
            [
                'name' => 'Nasi Goreng Special',
                'category' => 'food',
                'calories' => 650,
                'price' => 35000.00,
                'ingredients' => ['rice', 'chicken', 'egg', 'vegetables', 'spices'],
                'description' => 'Traditional Indonesian fried rice with chicken, egg, and special spices',
                'image_url' => 'https://images.unsplash.com/photo-1603073540986-39b8ab19568d?w=500',
                'is_available' => true,
                'preparation_time' => 15,
                'spicy_level' => 'medium',
                'allergens' => ['egg', 'soy'],
                'nutritional_info' => [
                    'protein' => 25,
                    'carbs' => 80,
                    'fat' => 20,
                    'fiber' => 5
                ]
            ],
            [
                'name' => 'Rendang Sapi',
                'category' => 'food',
                'calories' => 520,
                'price' => 55000.00,
                'ingredients' => ['beef', 'coconut milk', 'spices', 'chili'],
                'description' => 'Slow-cooked beef in coconut milk and spices',
                'image_url' => 'https://images.unsplash.com/photo-1595777216528-73c9b8896017?w=500',
                'is_available' => true,
                'preparation_time' => 30,
                'spicy_level' => 'hot',
                'allergens' => [],
                'nutritional_info' => [
                    'protein' => 42,
                    'carbs' => 12,
                    'fat' => 35,
                    'fiber' => 2
                ]
            ],
            [
                'name' => 'Sate Ayam',
                'category' => 'food',
                'calories' => 320,
                'price' => 40000.00,
                'ingredients' => ['chicken', 'peanut sauce', 'soy sauce', 'spices'],
                'description' => 'Grilled chicken skewers with peanut sauce',
                'image_url' => 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=500',
                'is_available' => true,
                'preparation_time' => 20,
                'spicy_level' => 'mild',
                'allergens' => ['peanuts', 'soy'],
                'nutritional_info' => [
                    'protein' => 35,
                    'carbs' => 15,
                    'fat' => 18,
                    'fiber' => 3
                ]
            ],
            [
                'name' => 'Gado-Gado',
                'category' => 'food',
                'calories' => 280,
                'price' => 28000.00,
                'ingredients' => ['vegetables', 'tofu', 'tempeh', 'peanut sauce', 'egg'],
                'description' => 'Indonesian salad with vegetables and peanut sauce',
                'image_url' => 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=500',
                'is_available' => true,
                'preparation_time' => 12,
                'spicy_level' => 'mild',
                'allergens' => ['peanuts', 'egg', 'soy'],
                'nutritional_info' => [
                    'protein' => 15,
                    'carbs' => 30,
                    'fat' => 12,
                    'fiber' => 8
                ]
            ],
            [
                'name' => 'Ayam Bakar',
                'category' => 'food',
                'calories' => 380,
                'price' => 42000.00,
                'ingredients' => ['chicken', 'soy sauce', 'spices', 'lime'],
                'description' => 'Grilled chicken with special marinade',
                'image_url' => 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=500',
                'is_available' => true,
                'preparation_time' => 25,
                'spicy_level' => 'medium',
                'allergens' => ['soy'],
                'nutritional_info' => [
                    'protein' => 38,
                    'carbs' => 8,
                    'fat' => 22,
                    'fiber' => 1
                ]
            ],
            [
                'name' => 'Mie Goreng',
                'category' => 'food',
                'calories' => 580,
                'price' => 32000.00,
                'ingredients' => ['noodles', 'vegetables', 'egg', 'soy sauce', 'spices'],
                'description' => 'Indonesian style fried noodles',
                'image_url' => 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500',
                'is_available' => true,
                'preparation_time' => 12,
                'spicy_level' => 'medium',
                'allergens' => ['gluten', 'egg', 'soy'],
                'nutritional_info' => [
                    'protein' => 18,
                    'carbs' => 72,
                    'fat' => 22,
                    'fiber' => 5
                ]
            ],
            [
                'name' => 'Bakso',
                'category' => 'food',
                'calories' => 420,
                'price' => 25000.00,
                'ingredients' => ['meatballs', 'noodles', 'broth', 'vegetables'],
                'description' => 'Indonesian meatball soup',
                'image_url' => 'https://images.unsplash.com/photo-1582169296194-e4d644c48063?w=500',
                'is_available' => true,
                'preparation_time' => 18,
                'spicy_level' => 'mild',
                'allergens' => ['gluten'],
                'nutritional_info' => [
                    'protein' => 28,
                    'carbs' => 45,
                    'fat' => 12,
                    'fiber' => 3
                ]
            ],
            [
                'name' => 'Soto Ayam',
                'category' => 'food',
                'calories' => 350,
                'price' => 30000.00,
                'ingredients' => ['chicken', 'turmeric', 'lemongrass', 'rice vermicelli', 'vegetables'],
                'description' => 'Traditional Indonesian chicken soup with aromatic spices',
                'image_url' => null,
                'is_available' => true,
                'preparation_time' => 20,
                'spicy_level' => 'mild',
                'allergens' => ['gluten'],
                'nutritional_info' => [
                    'protein' => 30,
                    'carbs' => 35,
                    'fat' => 10,
                    'fiber' => 4
                ]
            ],
            [
                'name' => 'Nasi Uduk',
                'category' => 'food',
                'calories' => 480,
                'price' => 28000.00,
                'ingredients' => ['coconut rice', 'fried chicken', 'tempeh', 'egg', 'sambal'],
                'description' => 'Coconut rice with various side dishes',
                'image_url' => null,
                'is_available' => true,
                'preparation_time' => 18,
                'spicy_level' => 'medium',
                'allergens' => ['egg', 'soy'],
                'nutritional_info' => [
                    'protein' => 22,
                    'carbs' => 65,
                    'fat' => 18,
                    'fiber' => 4
                ]
            ],
            [
                'name' => 'Capcay',
                'category' => 'food',
                'calories' => 220,
                'price' => 30000.00,
                'ingredients' => ['vegetables', 'mushroom', 'sauce', 'garlic'],
                'description' => 'Stir-fried mixed vegetables',
                'image_url' => null,
                'is_available' => true,
                'preparation_time' => 15,
                'spicy_level' => 'none',
                'allergens' => ['soy'],
                'nutritional_info' => [
                    'protein' => 8,
                    'carbs' => 25,
                    'fat' => 10,
                    'fiber' => 7
                ]
            ],
            [
                'name' => 'Ikan Bakar',
                'category' => 'food',
                'calories' => 320,
                'price' => 48000.00,
                'ingredients' => ['fish', 'spices', 'lime', 'sambal'],
                'description' => 'Grilled fish with spicy sambal',
                'image_url' => null,
                'is_available' => true,
                'preparation_time' => 22,
                'spicy_level' => 'hot',
                'allergens' => [],
                'nutritional_info' => [
                    'protein' => 40,
                    'carbs' => 5,
                    'fat' => 15,
                    'fiber' => 1
                ]
            ],
            [
                'name' => 'Nasi Kuning',
                'category' => 'food',
                'calories' => 450,
                'price' => 32000.00,
                'ingredients' => ['turmeric rice', 'chicken', 'egg', 'peanuts', 'anchovies'],
                'description' => 'Yellow rice with various toppings',
                'image_url' => null,
                'is_available' => true,
                'preparation_time' => 20,
                'spicy_level' => 'mild',
                'allergens' => ['egg', 'peanuts'],
                'nutritional_info' => [
                    'protein' => 20,
                    'carbs' => 68,
                    'fat' => 16,
                    'fiber' => 3
                ]
            ],
            [
                'name' => 'Rawon',
                'category' => 'food',
                'calories' => 480,
                'price' => 38000.00,
                'ingredients' => ['beef', 'keluak', 'spices', 'bean sprouts'],
                'description' => 'East Javanese beef black soup',
                'image_url' => null,
                'is_available' => true,
                'preparation_time' => 35,
                'spicy_level' => 'medium',
                'allergens' => [],
                'nutritional_info' => [
                    'protein' => 35,
                    'carbs' => 25,
                    'fat' => 28,
                    'fiber' => 4
                ]
            ],
            [
                'name' => 'Ayam Penyet',
                'category' => 'food',
                'calories' => 520,
                'price' => 35000.00,
                'ingredients' => ['fried chicken', 'sambal', 'tempeh', 'tofu', 'vegetables'],
                'description' => 'Smashed fried chicken with hot sambal',
                'image_url' => null,
                'is_available' => true,
                'preparation_time' => 18,
                'spicy_level' => 'hot',
                'allergens' => ['soy'],
                'nutritional_info' => [
                    'protein' => 38,
                    'carbs' => 45,
                    'fat' => 25,
                    'fiber' => 5
                ]
            ],
            [
                'name' => 'Pecel Lele',
                'category' => 'food',
                'calories' => 380,
                'price' => 22000.00,
                'ingredients' => ['catfish', 'sambal', 'vegetables', 'tempeh'],
                'description' => 'Fried catfish with spicy sambal',
                'image_url' => null,
                'is_available' => true,
                'preparation_time' => 15,
                'spicy_level' => 'hot',
                'allergens' => ['soy'],
                'nutritional_info' => [
                    'protein' => 32,
                    'carbs' => 20,
                    'fat' => 22,
                    'fiber' => 3
                ]
            ],
            
            // Appetizers
            [
                'name' => 'Lumpia Goreng',
                'category' => 'appetizer',
                'calories' => 250,
                'price' => 22000.00,
                'ingredients' => ['vegetables', 'wrapper', 'oil', 'spices'],
                'description' => 'Crispy fried spring rolls',
                'image_url' => null,
                'is_available' => true,
                'preparation_time' => 10,
                'spicy_level' => 'none',
                'allergens' => ['gluten'],
                'nutritional_info' => [
                    'protein' => 8,
                    'carbs' => 28,
                    'fat' => 12,
                    'fiber' => 4
                ]
            ],
            [
                'name' => 'Tahu Isi',
                'category' => 'appetizer',
                'calories' => 180,
                'price' => 18000.00,
                'ingredients' => ['tofu', 'vegetables', 'flour', 'spices'],
                'description' => 'Stuffed tofu with vegetables',
                'image_url' => null,
                'is_available' => true,
                'preparation_time' => 12,
                'spicy_level' => 'mild',
                'allergens' => ['gluten', 'soy'],
                'nutritional_info' => [
                    'protein' => 10,
                    'carbs' => 20,
                    'fat' => 8,
                    'fiber' => 3
                ]
            ],
            [
                'name' => 'Perkedel Jagung',
                'category' => 'appetizer',
                'calories' => 160,
                'price' => 15000.00,
                'ingredients' => ['corn', 'egg', 'flour', 'spices'],
                'description' => 'Corn fritters',
                'image_url' => null,
                'is_available' => true,
                'preparation_time' => 10,
                'spicy_level' => 'none',
                'allergens' => ['egg', 'gluten'],
                'nutritional_info' => [
                    'protein' => 6,
                    'carbs' => 22,
                    'fat' => 7,
                    'fiber' => 3
                ]
            ],
            [
                'name' => 'Risoles Mayo',
                'category' => 'appetizer',
                'calories' => 220,
                'price' => 20000.00,
                'ingredients' => ['flour wrapper', 'chicken', 'vegetables', 'mayonnaise'],
                'description' => 'Fried pastries filled with chicken and mayo',
                'image_url' => null,
                'is_available' => true,
                'preparation_time' => 15,
                'spicy_level' => 'none',
                'allergens' => ['gluten', 'egg', 'dairy'],
                'nutritional_info' => [
                    'protein' => 12,
                    'carbs' => 24,
                    'fat' => 10,
                    'fiber' => 2
                ]
            ],
            [
                'name' => 'Martabak Telur',
                'category' => 'appetizer',
                'calories' => 380,
                'price' => 25000.00,
                'ingredients' => ['flour', 'egg', 'meat', 'onion', 'spices'],
                'description' => 'Savory stuffed pancake',
                'image_url' => null,
                'is_available' => true,
                'preparation_time' => 18,
                'spicy_level' => 'mild',
                'allergens' => ['gluten', 'egg'],
                'nutritional_info' => [
                    'protein' => 18,
                    'carbs' => 35,
                    'fat' => 18,
                    'fiber' => 2
                ]
            ],
            
            // Drinks
            [
                'name' => 'Es Kopi Susu',
                'category' => 'drinks',
                'calories' => 180,
                'price' => 25000.00,
                'ingredients' => ['coffee', 'milk', 'ice', 'sugar'],
                'description' => 'Classic iced coffee with milk. Perfect for staying awake and boosting energy during late night work or study sessions. Contains caffeine to help you stay alert and focused.',
                'image_url' => null,
                'is_available' => true,
                'preparation_time' => 5,
                'spicy_level' => 'none',
                'allergens' => ['dairy'],
                'nutritional_info' => [
                    'protein' => 4,
                    'carbs' => 25,
                    'fat' => 6,
                    'fiber' => 0
                ]
            ],
            [
                'name' => 'Es Teh Manis',
                'category' => 'drinks',
                'calories' => 120,
                'price' => 8000.00,
                'ingredients' => ['tea', 'sugar', 'ice'],
                'description' => 'Sweet iced tea with mild caffeine content. Refreshing beverage that helps you stay awake and alert. Good for concentration and focus.',
                'image_url' => null,
                'is_available' => true,
                'preparation_time' => 3,
                'spicy_level' => 'none',
                'allergens' => [],
                'nutritional_info' => [
                    'protein' => 0,
                    'carbs' => 30,
                    'fat' => 0,
                    'fiber' => 0
                ]
            ],
            [
                'name' => 'Jus Alpukat',
                'category' => 'drinks',
                'calories' => 220,
                'price' => 18000.00,
                'ingredients' => ['avocado', 'milk', 'sugar', 'ice'],
                'description' => 'Creamy avocado juice',
                'image_url' => null,
                'is_available' => true,
                'preparation_time' => 5,
                'spicy_level' => 'none',
                'allergens' => ['dairy'],
                'nutritional_info' => [
                    'protein' => 5,
                    'carbs' => 28,
                    'fat' => 15,
                    'fiber' => 7
                ]
            ],
            [
                'name' => 'Teh Tarik',
                'category' => 'drinks',
                'calories' => 150,
                'price' => 15000.00,
                'ingredients' => ['tea', 'condensed milk', 'evaporated milk'],
                'description' => 'Pulled tea with condensed milk',
                'image_url' => null,
                'is_available' => true,
                'preparation_time' => 5,
                'spicy_level' => 'none',
                'allergens' => ['dairy'],
                'nutritional_info' => [
                    'protein' => 4,
                    'carbs' => 22,
                    'fat' => 5,
                    'fiber' => 0
                ]
            ],
            [
                'name' => 'Es Jeruk',
                'category' => 'drinks',
                'calories' => 100,
                'price' => 12000.00,
                'ingredients' => ['orange', 'sugar', 'ice'],
                'description' => 'Fresh orange juice',
                'image_url' => null,
                'is_available' => true,
                'preparation_time' => 5,
                'spicy_level' => 'none',
                'allergens' => [],
                'nutritional_info' => [
                    'protein' => 1,
                    'carbs' => 24,
                    'fat' => 0,
                    'fiber' => 1
                ]
            ],
            [
                'name' => 'Jus Mangga',
                'category' => 'drinks',
                'calories' => 130,
                'price' => 15000.00,
                'ingredients' => ['mango', 'sugar', 'ice'],
                'description' => 'Sweet mango juice',
                'image_url' => null,
                'is_available' => true,
                'preparation_time' => 5,
                'spicy_level' => 'none',
                'allergens' => [],
                'nutritional_info' => [
                    'protein' => 1,
                    'carbs' => 32,
                    'fat' => 0,
                    'fiber' => 2
                ]
            ],
            [
                'name' => 'Es Kelapa Muda',
                'category' => 'drinks',
                'calories' => 90,
                'price' => 18000.00,
                'ingredients' => ['young coconut', 'ice', 'syrup'],
                'description' => 'Fresh young coconut water',
                'image_url' => null,
                'is_available' => true,
                'preparation_time' => 5,
                'spicy_level' => 'none',
                'allergens' => [],
                'nutritional_info' => [
                    'protein' => 2,
                    'carbs' => 18,
                    'fat' => 1,
                    'fiber' => 0
                ]
            ],
            [
                'name' => 'Cappuccino',
                'category' => 'drinks',
                'calories' => 120,
                'price' => 28000.00,
                'ingredients' => ['espresso', 'steamed milk', 'milk foam'],
                'description' => 'Italian coffee with steamed milk. Perfect caffeine boost to keep you energized and focused during work or study.',
                'image_url' => null,
                'is_available' => true,
                'preparation_time' => 7,
                'spicy_level' => 'none',
                'allergens' => ['dairy'],
                'nutritional_info' => [
                    'protein' => 6,
                    'carbs' => 12,
                    'fat' => 4,
                    'fiber' => 0
                ]
            ],
            [
                'name' => 'Latte',
                'category' => 'drinks',
                'calories' => 150,
                'price' => 30000.00,
                'ingredients' => ['espresso', 'steamed milk'],
                'description' => 'Smooth coffee with lots of milk. Great for staying alert during late night work sessions with a milder caffeine kick.',
                'image_url' => null,
                'is_available' => true,
                'preparation_time' => 7,
                'spicy_level' => 'none',
                'allergens' => ['dairy'],
                'nutritional_info' => [
                    'protein' => 8,
                    'carbs' => 15,
                    'fat' => 6,
                    'fiber' => 0
                ]
            ],
            [
                'name' => 'Matcha Latte',
                'category' => 'drinks',
                'calories' => 140,
                'price' => 32000.00,
                'ingredients' => ['matcha powder', 'milk', 'sugar'],
                'description' => 'Green tea latte with natural caffeine for sustained energy and focus',
                'image_url' => null,
                'is_available' => true,
                'preparation_time' => 6,
                'spicy_level' => 'none',
                'allergens' => ['dairy'],
                'nutritional_info' => [
                    'protein' => 5,
                    'carbs' => 20,
                    'fat' => 5,
                    'fiber' => 1
                ]
            ],
            [
                'name' => 'Chocolate Milkshake',
                'category' => 'drinks',
                'calories' => 320,
                'price' => 28000.00,
                'ingredients' => ['chocolate', 'milk', 'ice cream', 'ice'],
                'description' => 'Thick and creamy chocolate shake',
                'image_url' => null,
                'is_available' => true,
                'preparation_time' => 5,
                'spicy_level' => 'none',
                'allergens' => ['dairy'],
                'nutritional_info' => [
                    'protein' => 8,
                    'carbs' => 45,
                    'fat' => 12,
                    'fiber' => 2
                ]
            ],
            [
                'name' => 'Thai Tea',
                'category' => 'drinks',
                'calories' => 180,
                'price' => 20000.00,
                'ingredients' => ['thai tea', 'condensed milk', 'evaporated milk', 'ice'],
                'description' => 'Sweet and creamy Thai tea',
                'image_url' => null,
                'is_available' => true,
                'preparation_time' => 5,
                'spicy_level' => 'none',
                'allergens' => ['dairy'],
                'nutritional_info' => [
                    'protein' => 4,
                    'carbs' => 32,
                    'fat' => 5,
                    'fiber' => 0
                ]
            ],
            [
                'name' => 'Jus Strawberry',
                'category' => 'drinks',
                'calories' => 120,
                'price' => 18000.00,
                'ingredients' => ['strawberry', 'sugar', 'ice', 'milk'],
                'description' => 'Fresh strawberry juice with milk',
                'image_url' => null,
                'is_available' => true,
                'preparation_time' => 5,
                'spicy_level' => 'none',
                'allergens' => ['dairy'],
                'nutritional_info' => [
                    'protein' => 3,
                    'carbs' => 25,
                    'fat' => 2,
                    'fiber' => 2
                ]
            ],
            [
                'name' => 'Lemon Tea',
                'category' => 'drinks',
                'calories' => 80,
                'price' => 12000.00,
                'ingredients' => ['tea', 'lemon', 'sugar', 'ice'],
                'description' => 'Refreshing lemon iced tea',
                'image_url' => null,
                'is_available' => true,
                'preparation_time' => 5,
                'spicy_level' => 'none',
                'allergens' => [],
                'nutritional_info' => [
                    'protein' => 0,
                    'carbs' => 20,
                    'fat' => 0,
                    'fiber' => 0
                ]
            ],
            [
                'name' => 'Es Cincau',
                'category' => 'drinks',
                'calories' => 110,
                'price' => 10000.00,
                'ingredients' => ['grass jelly', 'sugar', 'ice', 'coconut milk'],
                'description' => 'Grass jelly drink with coconut milk',
                'image_url' => null,
                'is_available' => true,
                'preparation_time' => 5,
                'spicy_level' => 'none',
                'allergens' => [],
                'nutritional_info' => [
                    'protein' => 1,
                    'carbs' => 25,
                    'fat' => 2,
                    'fiber' => 1
                ]
            ],
            
            // Desserts
            [
                'name' => 'Pisang Goreng',
                'category' => 'dessert',
                'calories' => 200,
                'price' => 15000.00,
                'ingredients' => ['banana', 'flour', 'sugar', 'oil'],
                'description' => 'Fried banana fritters',
                'image_url' => null,
                'is_available' => true,
                'preparation_time' => 8,
                'spicy_level' => 'none',
                'allergens' => ['gluten'],
                'nutritional_info' => [
                    'protein' => 3,
                    'carbs' => 32,
                    'fat' => 8,
                    'fiber' => 3
                ]
            ],
            [
                'name' => 'Es Campur',
                'category' => 'dessert',
                'calories' => 280,
                'price' => 20000.00,
                'ingredients' => ['jelly', 'fruits', 'coconut', 'ice', 'syrup'],
                'description' => 'Mixed ice dessert with fruits and jelly',
                'image_url' => null,
                'is_available' => true,
                'preparation_time' => 7,
                'spicy_level' => 'none',
                'allergens' => [],
                'nutritional_info' => [
                    'protein' => 2,
                    'carbs' => 45,
                    'fat' => 5,
                    'fiber' => 4
                ]
            ],
            [
                'name' => 'Klepon',
                'category' => 'dessert',
                'calories' => 180,
                'price' => 12000.00,
                'ingredients' => ['rice flour', 'palm sugar', 'coconut', 'pandan'],
                'description' => 'Sweet rice balls with palm sugar filling',
                'image_url' => null,
                'is_available' => true,
                'preparation_time' => 12,
                'spicy_level' => 'none',
                'allergens' => [],
                'nutritional_info' => [
                    'protein' => 2,
                    'carbs' => 35,
                    'fat' => 4,
                    'fiber' => 2
                ]
            ],
            [
                'name' => 'Martabak Manis',
                'category' => 'dessert',
                'calories' => 450,
                'price' => 35000.00,
                'ingredients' => ['flour', 'chocolate', 'cheese', 'condensed milk', 'butter'],
                'description' => 'Sweet thick pancake with various toppings',
                'image_url' => null,
                'is_available' => true,
                'preparation_time' => 15,
                'spicy_level' => 'none',
                'allergens' => ['gluten', 'dairy', 'egg'],
                'nutritional_info' => [
                    'protein' => 10,
                    'carbs' => 55,
                    'fat' => 22,
                    'fiber' => 2
                ]
            ],
            [
                'name' => 'Puding Coklat',
                'category' => 'dessert',
                'calories' => 220,
                'price' => 18000.00,
                'ingredients' => ['chocolate', 'milk', 'sugar', 'gelatin'],
                'description' => 'Chocolate pudding',
                'image_url' => null,
                'is_available' => true,
                'preparation_time' => 10,
                'spicy_level' => 'none',
                'allergens' => ['dairy'],
                'nutritional_info' => [
                    'protein' => 5,
                    'carbs' => 38,
                    'fat' => 7,
                    'fiber' => 1
                ]
            ],
            [
                'name' => 'Es Krim Goreng',
                'category' => 'dessert',
                'calories' => 280,
                'price' => 25000.00,
                'ingredients' => ['ice cream', 'bread', 'egg', 'oil'],
                'description' => 'Fried ice cream',
                'image_url' => null,
                'is_available' => true,
                'preparation_time' => 8,
                'spicy_level' => 'none',
                'allergens' => ['dairy', 'egg', 'gluten'],
                'nutritional_info' => [
                    'protein' => 6,
                    'carbs' => 35,
                    'fat' => 14,
                    'fiber' => 1
                ]
            ],
            [
                'name' => 'Kue Lapis',
                'category' => 'dessert',
                'calories' => 160,
                'price' => 15000.00,
                'ingredients' => ['rice flour', 'coconut milk', 'sugar', 'pandan'],
                'description' => 'Layered steamed cake',
                'image_url' => null,
                'is_available' => true,
                'preparation_time' => 20,
                'spicy_level' => 'none',
                'allergens' => [],
                'nutritional_info' => [
                    'protein' => 3,
                    'carbs' => 30,
                    'fat' => 5,
                    'fiber' => 1
                ]
            ],
            [
                'name' => 'Dadar Gulung',
                'category' => 'dessert',
                'calories' => 140,
                'price' => 12000.00,
                'ingredients' => ['flour', 'coconut', 'palm sugar', 'pandan'],
                'description' => 'Pandan crepes with coconut filling',
                'image_url' => null,
                'is_available' => true,
                'preparation_time' => 15,
                'spicy_level' => 'none',
                'allergens' => ['gluten'],
                'nutritional_info' => [
                    'protein' => 3,
                    'carbs' => 25,
                    'fat' => 5,
                    'fiber' => 2
                ]
            ],
            [
                'name' => 'Kolak Pisang',
                'category' => 'dessert',
                'calories' => 200,
                'price' => 15000.00,
                'ingredients' => ['banana', 'coconut milk', 'palm sugar', 'jackfruit'],
                'description' => 'Banana in sweet coconut milk',
                'image_url' => null,
                'is_available' => true,
                'preparation_time' => 12,
                'spicy_level' => 'none',
                'allergens' => [],
                'nutritional_info' => [
                    'protein' => 2,
                    'carbs' => 38,
                    'fat' => 6,
                    'fiber' => 3
                ]
            ],
            [
                'name' => 'Brownies',
                'category' => 'dessert',
                'calories' => 250,
                'price' => 20000.00,
                'ingredients' => ['chocolate', 'flour', 'butter', 'egg', 'sugar'],
                'description' => 'Rich chocolate brownies',
                'image_url' => null,
                'is_available' => true,
                'preparation_time' => 10,
                'spicy_level' => 'none',
                'allergens' => ['gluten', 'egg', 'dairy'],
                'nutritional_info' => [
                    'protein' => 4,
                    'carbs' => 32,
                    'fat' => 12,
                    'fiber' => 2
                ]
            ],
            [
                'name' => 'Cheese Cake',
                'category' => 'dessert',
                'calories' => 320,
                'price' => 32000.00,
                'ingredients' => ['cream cheese', 'sugar', 'egg', 'graham crackers', 'butter'],
                'description' => 'Classic creamy cheesecake',
                'image_url' => null,
                'is_available' => true,
                'preparation_time' => 15,
                'spicy_level' => 'none',
                'allergens' => ['dairy', 'egg', 'gluten'],
                'nutritional_info' => [
                    'protein' => 6,
                    'carbs' => 35,
                    'fat' => 18,
                    'fiber' => 1
                ]
            ],
            [
                'name' => 'Tiramisu',
                'category' => 'dessert',
                'calories' => 300,
                'price' => 38000.00,
                'ingredients' => ['ladyfingers', 'coffee', 'mascarpone', 'cocoa powder', 'egg'],
                'description' => 'Italian coffee-flavored dessert',
                'image_url' => null,
                'is_available' => true,
                'preparation_time' => 12,
                'spicy_level' => 'none',
                'allergens' => ['dairy', 'egg', 'gluten'],
                'nutritional_info' => [
                    'protein' => 7,
                    'carbs' => 32,
                    'fat' => 16,
                    'fiber' => 1
                ]
            ],
            [
                'name' => 'Es Doger',
                'category' => 'dessert',
                'calories' => 250,
                'price' => 18000.00,
                'ingredients' => ['coconut milk', 'tape', 'bread', 'avocado', 'syrup'],
                'description' => 'Traditional Indonesian ice dessert',
                'image_url' => null,
                'is_available' => true,
                'preparation_time' => 8,
                'spicy_level' => 'none',
                'allergens' => ['gluten'],
                'nutritional_info' => [
                    'protein' => 3,
                    'carbs' => 42,
                    'fat' => 8,
                    'fiber' => 3
                ]
            ],
            [
                'name' => 'Bubur Sum Sum',
                'category' => 'dessert',
                'calories' => 180,
                'price' => 12000.00,
                'ingredients' => ['rice flour', 'pandan', 'coconut milk', 'palm sugar'],
                'description' => 'Green rice porridge with sweet coconut sauce',
                'image_url' => null,
                'is_available' => true,
                'preparation_time' => 10,
                'spicy_level' => 'none',
                'allergens' => [],
                'nutritional_info' => [
                    'protein' => 2,
                    'carbs' => 35,
                    'fat' => 5,
                    'fiber' => 1
                ]
            ],
            [
                'name' => 'Onde-Onde',
                'category' => 'dessert',
                'calories' => 150,
                'price' => 10000.00,
                'ingredients' => ['glutinous rice flour', 'mung bean', 'sesame seeds', 'sugar'],
                'description' => 'Sesame balls with sweet mung bean filling',
                'image_url' => null,
                'is_available' => true,
                'preparation_time' => 12,
                'spicy_level' => 'none',
                'allergens' => [],
                'nutritional_info' => [
                    'protein' => 4,
                    'carbs' => 28,
                    'fat' => 4,
                    'fiber' => 2
                ]
            ]
        ];

        echo "Generating embeddings and seeding menus...\n";
        $count = 0;
        
        foreach ($menus as $menuData) {
            try {
                // Generate embedding
                $embedding = $embeddingService->generateMenuEmbedding($menuData);
                
                // Convert embedding array to PostgreSQL vector format string
                $vectorString = '[' . implode(',', $embedding) . ']';
                
                // Create menu with raw query to handle vector type
                $menu = new Menu();
                $menu->name = $menuData['name'];
                $menu->category = $menuData['category'];
                $menu->calories = $menuData['calories'];
                $menu->price = $menuData['price'];
                $menu->ingredients = $menuData['ingredients'];
                $menu->description = $menuData['description'];
                $menu->image_url = $menuData['image_url'];
                $menu->is_available = $menuData['is_available'];
                $menu->preparation_time = $menuData['preparation_time'];
                $menu->spicy_level = $menuData['spicy_level'];
                $menu->allergens = $menuData['allergens'];
                $menu->nutritional_info = $menuData['nutritional_info'];
                $menu->save();
                
                // Update embedding separately using raw query
                DB::statement("UPDATE menus SET embedding = ?::vector WHERE id = ?", [$vectorString, $menu->id]);
                
                $count++;
                echo "✓ Created: {$menuData['name']} ({$count}/50)\n";
                
                // Small delay to avoid rate limiting
                usleep(200000); // 200ms delay
                
            } catch (\Exception $e) {
                echo "✗ Failed to create {$menuData['name']}: {$e->getMessage()}\n";
            }
        }
        
        echo "\nSeeding completed! Total menus created: {$count}/50\n";
    }
}
