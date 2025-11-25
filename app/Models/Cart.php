<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    use HasFactory;

    protected $fillable = [
        'session_id',
        'menu_id',
        'quantity',
        'notes',
    ];

    protected $casts = [
        'quantity' => 'integer',
    ];

    // Relasi ke Menu
    public function menu()
    {
        return $this->belongsTo(Menu::class);
    }

    // Get total price for this cart item
    public function getTotalPriceAttribute()
    {
        return $this->menu->price * $this->quantity;
    }
}
