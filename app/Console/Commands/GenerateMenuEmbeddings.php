<?php

namespace App\Console\Commands;

use App\Models\Menu;
use App\Services\GeminiEmbeddingService;
use Illuminate\Console\Command;

class GenerateMenuEmbeddings extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'menu:generate-embeddings 
                            {--force : Regenerate embeddings even if already exists}
                            {--id= : Generate embedding for specific menu ID only}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate vector embeddings for menu items using Gemini API';

    private GeminiEmbeddingService $embeddingService;

    public function __construct(GeminiEmbeddingService $embeddingService)
    {
        parent::__construct();
        $this->embeddingService = $embeddingService;
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting menu embeddings generation...');
        
        // Build query
        $query = Menu::query();
        
        // If specific ID is provided
        if ($menuId = $this->option('id')) {
            $query->where('id', $menuId);
        }
        
        // If not force, only process items without embeddings
        if (!$this->option('force')) {
            $query->whereNull('embedding');
        }
        
        $menus = $query->get();
        
        if ($menus->isEmpty()) {
            $this->warn('No menus to process.');
            return Command::SUCCESS;
        }
        
        $this->info("Found {$menus->count()} menu(s) to process.");
        
        $progressBar = $this->output->createProgressBar($menus->count());
        $progressBar->start();
        
        $successCount = 0;
        $errorCount = 0;
        
        foreach ($menus as $menu) {
            try {
                // Generate embedding
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
                
                // Convert array to PostgreSQL vector format
                $vectorString = '[' . implode(',', $embedding) . ']';
                
                // Update menu with embedding
                $menu->embedding = $vectorString;
                $menu->save();
                
                $successCount++;
                
                // Small delay to avoid rate limiting (Gemini free tier)
                usleep(100000); // 0.1 second
                
            } catch (\Exception $e) {
                $errorCount++;
                $this->newLine();
                $this->error(" to generate embedding for menu ID {$menu->id}: {$e->getMessage()}");
            }
            
            $progressBar->advance();
        }
        
        $progressBar->finish();
        $this->newLine(2);
        
        // Summary
        $this->info("✓ Successfully generated: {$successCount}");
        if ($errorCount > 0) {
            $this->error("✗ Failed: {$errorCount}");
        }
        
        $this->newLine();
        $this->info('Done!');
        
        return Command::SUCCESS;
    }
}
