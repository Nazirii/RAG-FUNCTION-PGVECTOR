<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('menus', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('category'); // drinks, food, appetizer, dessert, etc
            $table->integer('calories')->nullable();
            $table->decimal('price', 10, 2);
            $table->json('ingredients')->nullable(); // array of ingredients
            $table->text('description')->nullable();
            $table->string('image_url')->nullable();
            $table->boolean('is_available')->default(true);
            $table->integer('preparation_time')->nullable(); // in minutes
            $table->enum('spicy_level', ['none', 'mild', 'medium', 'hot', 'extra_hot'])->default('none');
            $table->json('allergens')->nullable(); // array of allergens (peanuts, dairy, etc)
            $table->json('nutritional_info')->nullable(); // protein, carbs, fat, etc
            
            // Vector embedding for RAG (768 dimensions for Gemini embedding-001)
            // Stores vector representation of menu for semantic search
            $table->vector('embedding', 768)->nullable();
            
            $table->timestamps();
            
            // Indexes for better query performance
            $table->index('category');
            $table->index('price');
            $table->index('is_available');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('menus');
    }
};
