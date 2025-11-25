<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class UpdateMenuImages extends Command
{
    protected $signature = 'menu:update-images';
    protected $description = 'Update menu image URLs with Unsplash placeholders';

    public function handle()
    {
        $this->info('Updating menu images...');

        $updates = [
            // Foods
            ['name' => 'Nasi Goreng Special', 'url' => 'https://images.unsplash.com/photo-1603073540986-39b8ab19568d?w=500'],
            ['name' => 'Rendang Sapi', 'url' => 'https://images.unsplash.com/photo-1595777216528-73c9b8896017?w=500'],
            ['name' => 'Sate Ayam', 'url' => 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=500'],
            ['name' => 'Gado-Gado', 'url' => 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=500'],
            ['name' => 'Ayam Bakar', 'url' => 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=500'],
            ['name' => 'Mie Goreng', 'url' => 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500'],
            ['name' => 'Bakso', 'url' => 'https://images.unsplash.com/photo-1582169296194-e4d644c48063?w=500'],
            ['name' => 'Soto Ayam', 'url' => 'https://images.unsplash.com/photo-1588566565463-180a5b2090d2?w=500'],
            ['name' => 'Nasi Uduk', 'url' => 'https://images.unsplash.com/photo-1603073540986-39b8ab19568d?w=500'],
            ['name' => 'Capcay', 'url' => 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500'],
            ['name' => 'Ikan Bakar', 'url' => 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500'],
            ['name' => 'Nasi Kuning', 'url' => 'https://images.unsplash.com/photo-1603073540986-39b8ab19568d?w=500'],
            ['name' => 'Rawon', 'url' => 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500'],
            ['name' => 'Ayam Penyet', 'url' => 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=500'],
            ['name' => 'Pecel Lele', 'url' => 'https://images.unsplash.com/photo-1547424450-77563bd75eb7?w=500'],
            
            // Appetizers
            ['name' => 'Lumpia Goreng', 'url' => 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=500'],
            ['name' => 'Tahu Isi', 'url' => 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500'],
            ['name' => 'Perkedel Jagung', 'url' => 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=500'],
            ['name' => 'Risoles Mayo', 'url' => 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=500'],
            ['name' => 'Martabak Telur', 'url' => 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500'],
            
            // Drinks (Coffee & Caffeinated)
            ['name' => 'Es Kopi Susu', 'url' => 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=500'],
            ['name' => 'Cappuccino', 'url' => 'https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?w=500'],
            ['name' => 'Latte', 'url' => 'https://images.unsplash.com/photo-1561047029-3000c68339ca?w=500'],
            ['name' => 'Matcha Latte', 'url' => 'https://images.unsplash.com/photo-1536337005238-94b997371b40?w=500'],
            ['name' => 'Es Teh Manis', 'url' => 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=500'],
            ['name' => 'Teh Tarik', 'url' => 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500'],
            ['name' => 'Lemon Tea', 'url' => 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500'],
            ['name' => 'Thai Tea', 'url' => 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500'],
            
            // Drinks (Juices & Fresh)
            ['name' => 'Jus Alpukat', 'url' => 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=500'],
            ['name' => 'Jus Mangga', 'url' => 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=500'],
            ['name' => 'Jus Strawberry', 'url' => 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=500'],
            ['name' => 'Es Jeruk', 'url' => 'https://images.unsplash.com/photo-1582103839754-386e3f82924e?w=500'],
            ['name' => 'Es Kelapa Muda', 'url' => 'https://images.unsplash.com/photo-1556910585-6e569e5b1f37?w=500'],
            ['name' => 'Chocolate Milkshake', 'url' => 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=500'],
            ['name' => 'Es Cincau', 'url' => 'https://images.unsplash.com/photo-1569231969-41c35e4fab98?w=500'],
            
            // Desserts
            ['name' => 'Pisang Goreng', 'url' => 'https://images.unsplash.com/photo-1587241321921-91a834d82e38?w=500'],
            ['name' => 'Es Campur', 'url' => 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500'],
            ['name' => 'Klepon', 'url' => 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=500'],
            ['name' => 'Martabak Manis', 'url' => 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500'],
            ['name' => 'Puding Coklat', 'url' => 'https://images.unsplash.com/photo-1582203479451-7f33e0bdb6f1?w=500'],
            ['name' => 'Es Krim Goreng', 'url' => 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500'],
            ['name' => 'Kue Lapis', 'url' => 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=500'],
            ['name' => 'Dadar Gulung', 'url' => 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=500'],
            ['name' => 'Kolak Pisang', 'url' => 'https://images.unsplash.com/photo-1587241321921-91a834d82e38?w=500'],
            ['name' => 'Brownies', 'url' => 'https://images.unsplash.com/photo-1607920591413-4ec007e70023?w=500'],
            ['name' => 'Cheese Cake', 'url' => 'https://images.unsplash.com/photo-1533134486753-c833f0ed4866?w=500'],
            ['name' => 'Tiramisu', 'url' => 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500'],
            ['name' => 'Es Doger', 'url' => 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500'],
            ['name' => 'Bubur Sum Sum', 'url' => 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=500'],
            ['name' => 'Onde-Onde', 'url' => 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=500'],
        ];

        $count = 0;
        foreach ($updates as $update) {
            $affected = DB::table('menus')
                ->where('name', $update['name'])
                ->update(['image_url' => $update['url']]);
            
            if ($affected > 0) {
                $this->info("✓ Updated: {$update['name']}");
                $count++;
            }
        }

        $this->info("\n✅ Updated {$count} menu images!");
        return Command::SUCCESS;
    }
}
