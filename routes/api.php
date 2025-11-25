<?php

use App\Http\Controllers\AIController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\MenuController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Menu API Routes
Route::prefix('menu')->group(function () {
    // Special routes (must be before resource routes)
    Route::get('/group-by-category', [MenuController::class, 'groupByCategory']);
    Route::get('/search', [MenuController::class, 'search']);
    
    // Standard CRUD routes
    Route::get('/', [MenuController::class, 'index']);
    Route::post('/', [MenuController::class, 'store']);
    Route::get('/{id}', [MenuController::class, 'show']);
    Route::put('/{id}', [MenuController::class, 'update']);
    Route::delete('/{id}', [MenuController::class, 'destroy']);
});

// Cart & Checkout Routes
Route::prefix('cart')->group(function () {
    Route::get('/', [CartController::class, 'index']);
    Route::post('/', [CartController::class, 'store']);
    Route::put('/{id}', [CartController::class, 'update']);
    Route::delete('/{id}', [CartController::class, 'destroy']);
    Route::delete('/', [CartController::class, 'clear']);
    Route::post('/checkout', [CartController::class, 'checkout']);
});

// Orders Routes
Route::prefix('orders')->group(function () {
    Route::get('/', [CartController::class, 'getOrders']);
    Route::get('/{order_number}', [CartController::class, 'getOrder']);
});

// AI & RAG Routes
Route::prefix('ai')->group(function () {
    Route::post('/search', [AIController::class, 'semanticSearch']); // Pure semantic search
    Route::post('/chat', [AIController::class, 'chat']); // Unified: RAG + Function Calling (AI decides)
});
