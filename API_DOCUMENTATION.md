# Restaurant Menu API

API untuk katalog menu restaurant dengan fitur lengkap untuk RAG dan function calling.

## Setup

1. **Install dependencies**
```bash
composer install
```

2. **Setup database MySQL**
Edit file `.env` dan ubah konfigurasi database:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=resto_db
DB_USERNAME=root
DB_PASSWORD=
```

3. **Jalankan migration dan seeder**
```bash
php artisan migrate
php artisan db:seed --class=MenuSeeder
```

4. **Jalankan server**
```bash
php artisan serve
```

API akan berjalan di `http://localhost:8000`

## Database Schema

Tabel `menus` memiliki kolom:
- `id` - Primary key
- `name` - Nama menu
- `category` - Kategori (food, drinks, appetizer, dessert)
- `calories` - Kalori
- `price` - Harga
- `ingredients` - JSON array bahan-bahan
- `description` - Deskripsi lengkap menu
- `image_url` - URL gambar menu
- `is_available` - Status ketersediaan
- `preparation_time` - Waktu persiapan (menit)
- `spicy_level` - Level pedas (none, mild, medium, hot, extra_hot)
- `allergens` - JSON array alergen (peanuts, dairy, gluten, dll)
- `nutritional_info` - JSON object info nutrisi (protein, carbs, fat, fiber)
- `created_at` - Timestamp dibuat
- `updated_at` - Timestamp diupdate

## API Endpoints

### 1. List Menu
**GET** `/api/menu`

Query parameters:
- `q` - Pencarian full-text (nama, deskripsi, ingredients)
- `category` - Filter berdasarkan kategori
- `min_price` - Filter harga minimum
- `max_price` - Filter harga maksimum
- `max_cal` - Filter kalori maksimum
- `page` - Halaman (default: 1)
- `per_page` - Item per halaman (default: 10)
- `sort` - Sorting (format: field:order, contoh: price:asc)

Response:
```json
{
  "data": [...],
  "pagination": {
    "total": 15,
    "page": 1,
    "per_page": 10,
    "total_pages": 2
  }
}
```

### 2. Get Menu by ID
**GET** `/api/menu/{id}`

Response:
```json
{
  "data": {
    "id": 1,
    "name": "Nasi Goreng Special",
    "category": "food",
    "calories": 650,
    "price": 35000.00,
    "ingredients": ["rice", "chicken", "egg", "vegetables", "spices"],
    "description": "Traditional Indonesian fried rice...",
    "image_url": null,
    "is_available": true,
    "preparation_time": 15,
    "spicy_level": "medium",
    "allergens": ["egg", "soy"],
    "nutritional_info": {
      "protein": 25,
      "carbs": 80,
      "fat": 20,
      "fiber": 5
    },
    "created_at": "2024-01-01T00:00:00.000000Z",
    "updated_at": "2024-01-01T00:00:00.000000Z"
  }
}
```

### 3. Create Menu
**POST** `/api/menu`

Body:
```json
{
  "name": "Es Kopi Susu",
  "category": "drinks",
  "calories": 180,
  "price": 25000.00,
  "ingredients": ["coffee", "milk", "ice", "sugar"],
  "description": "Classic iced coffee with milk",
  "image_url": "https://example.com/image.jpg",
  "is_available": true,
  "preparation_time": 5,
  "spicy_level": "none",
  "allergens": ["dairy"],
  "nutritional_info": {
    "protein": 4,
    "carbs": 25,
    "fat": 6,
    "fiber": 0
  }
}
```

Response:
```json
{
  "message": "Menu created successfully",
  "data": {...}
}
```

### 4. Update Menu
**PUT** `/api/menu/{id}`

Body: (sama dengan create)

Response:
```json
{
  "message": "Menu updated successfully",
  "data": {...}
}
```

### 5. Delete Menu
**DELETE** `/api/menu/{id}`

Response:
```json
{
  "message": "Menu deleted successfully"
}
```

### 6. Group by Category
**GET** `/api/menu/group-by-category`

Query parameters:
- `mode` - count (hitung per kategori) atau list (list menu per kategori)
- `per_category` - Jumlah item per kategori (untuk mode list, default: 5)

Response (mode=count):
```json
{
  "data": {
    "food": 10,
    "drinks": 5,
    "appetizer": 3,
    "dessert": 2
  }
}
```

Response (mode=list):
```json
{
  "data": {
    "food": [...],
    "drinks": [...],
    "appetizer": [...],
    "dessert": [...]
  }
}
```

### 7. Search Menu
**GET** `/api/menu/search`

Query parameters:
- `q` - Keyword pencarian (required)
- `page` - Halaman
- `per_page` - Item per halaman

Response:
```json
{
  "data": [...],
  "pagination": {...}
}
```

## Fitur untuk RAG & Function Calling

API ini dirancang dengan struktur data yang kaya untuk mendukung:

1. **Full-text search** - Pencarian di nama, deskripsi, dan ingredients
2. **Rich metadata** - Info nutrisi, alergen, waktu persiapan, level pedas
3. **Flexible filtering** - Filter berdasarkan kategori, harga, kalori
4. **Structured data** - JSON fields untuk ingredients, allergens, nutritional_info
5. **Comprehensive descriptions** - Deskripsi lengkap untuk context

Contoh use case dengan AI:
- "Carikan menu vegetarian dengan kalori di bawah 300"
- "Menu apa saja yang mengandung kacang?"
- "Rekomendasikan menu yang tidak pedas untuk anak-anak"
- "Berapa total kalori jika saya makan Nasi Goreng dan Es Teh?"
- "Menu apa yang bisa disiapkan dalam 10 menit?"

## Error Responses

### 404 Not Found
```json
{
  "message": "Menu not found"
}
```

### 422 Validation Error
```json
{
  "message": "Validation error",
  "errors": {
    "name": ["The name field is required."],
    "price": ["The price must be a number."]
  }
}
```

## Testing dengan Postman

Import file `gdgoc-studycase-postman.json` ke Postman dan update variable `BASE_URL` menjadi `http://localhost:8000/api`

---

## Cart & Checkout API

### 1. Get Cart
**GET** `/api/cart`

Headers:
- `X-Session-ID` - Session ID untuk tracking cart (opsional, akan auto-generate)

Response:
```json
{
  "data": {
    "items": [
      {
        "id": 1,
        "menu": {
          "id": 1,
          "name": "Nasi Goreng Special",
          "price": 35000.00,
          "category": "food",
          "image_url": null
        },
        "quantity": 2,
        "notes": "Pedas sedang",
        "subtotal": 70000.00,
        "created_at": "2024-01-01T00:00:00.000000Z"
      }
    ],
    "summary": {
      "subtotal": 70000.00,
      "tax": 7000.00,
      "total": 77000.00,
      "total_items": 1,
      "total_quantity": 2
    }
  }
}
```

### 2. Add to Cart
**POST** `/api/cart`

Headers:
- `X-Session-ID` - Session ID (opsional)

Body:
```json
{
  "menu_id": 1,
  "quantity": 2,
  "notes": "Pedas sedang"
}
```

Response:
```json
{
  "message": "Item added to cart successfully",
  "data": {
    "id": 1,
    "menu": {
      "id": 1,
      "name": "Nasi Goreng Special",
      "price": 35000.00
    },
    "quantity": 2,
    "notes": "Pedas sedang",
    "subtotal": 70000.00
  }
}
```

### 3. Update Cart Item
**PUT** `/api/cart/{id}`

Headers:
- `X-Session-ID` - Session ID

Body:
```json
{
  "quantity": 3,
  "notes": "Extra pedas"
}
```

Response:
```json
{
  "message": "Cart item updated successfully",
  "data": {
    "id": 1,
    "quantity": 3,
    "notes": "Extra pedas",
    "subtotal": 105000.00
  }
}
```

### 4. Remove Cart Item
**DELETE** `/api/cart/{id}`

Headers:
- `X-Session-ID` - Session ID

Response:
```json
{
  "message": "Item removed from cart successfully"
}
```

### 5. Clear Cart
**DELETE** `/api/cart`

Headers:
- `X-Session-ID` - Session ID

Response:
```json
{
  "message": "Cart cleared successfully"
}
```

### 6. Checkout
**POST** `/api/cart/checkout`

Headers:
- `X-Session-ID` - Session ID

Body:
```json
{
  "customer_name": "John Doe",
  "customer_phone": "081234567890",
  "table_number": "A5",
  "notes": "Mohon diantar secepatnya"
}
```

Response:
```json
{
  "message": "Checkout successful",
  "data": {
    "order_number": "ORD-20241201-A1B2C3",
    "customer_name": "John Doe",
    "table_number": "A5",
    "items": [
      {
        "menu_id": 1,
        "menu_name": "Nasi Goreng Special",
        "category": "food",
        "price": 35000.00,
        "quantity": 2,
        "notes": "Pedas sedang",
        "subtotal": 70000.00
      }
    ],
    "subtotal": 70000.00,
    "tax": 7000.00,
    "total": 77000.00,
    "status": "pending",
    "created_at": "2024-01-01T00:00:00.000000Z"
  }
}
```

### 7. Get Order by Order Number
**GET** `/api/orders/{order_number}`

Response:
```json
{
  "data": {
    "id": 1,
    "order_number": "ORD-20241201-A1B2C3",
    "session_id": "abc123",
    "customer_name": "John Doe",
    "customer_phone": "081234567890",
    "table_number": "A5",
    "items": [...],
    "subtotal": 70000.00,
    "tax": 7000.00,
    "total": 77000.00,
    "status": "pending",
    "notes": "Mohon diantar secepatnya",
    "created_at": "2024-01-01T00:00:00.000000Z",
    "updated_at": "2024-01-01T00:00:00.000000Z"
  }
}
```

### 8. Get All Orders (History)
**GET** `/api/orders`

Headers:
- `X-Session-ID` - Session ID

Response:
```json
{
  "data": [
    {
      "id": 1,
      "order_number": "ORD-20241201-A1B2C3",
      "customer_name": "John Doe",
      "table_number": "A5",
      "total": 77000.00,
      "status": "pending",
      "created_at": "2024-01-01T00:00:00.000000Z"
    }
  ]
}
```

## Flow Penggunaan

### 1. Browse Menu & Add to Cart
```
1. GET /api/menu → Browse semua menu
2. POST /api/cart → Tambah menu ke cart
   Body: { "menu_id": 1, "quantity": 2, "notes": "Pedas sedang" }
3. GET /api/cart → Lihat isi cart
```

### 2. Update Cart
```
1. PUT /api/cart/{id} → Update quantity atau notes
   Body: { "quantity": 3, "notes": "Extra pedas" }
2. DELETE /api/cart/{id} → Hapus item dari cart
```

### 3. Checkout
```
1. POST /api/cart/checkout → Checkout & create order
   Body: {
     "customer_name": "John Doe",
     "customer_phone": "081234567890",
     "table_number": "A5",
     "notes": "Mohon diantar secepatnya"
   }
2. Response akan berisi order_number
3. Cart akan otomatis dikosongkan setelah checkout berhasil
```

### 4. Check Order Status
```
1. GET /api/orders/{order_number} → Cek detail order
2. GET /api/orders → Lihat semua order history
```

## Session Management

API menggunakan `X-Session-ID` header untuk tracking cart per user:
- Jika header tidak dikirim, akan menggunakan session ID dari Laravel session
- Untuk testing, bisa generate random string sebagai session ID
- Contoh header: `X-Session-ID: user123-abc-xyz`

## Notes

- Tax dihitung 10% dari subtotal
- Order number auto-generate dengan format: `ORD-YYYYMMDD-XXXXXX`
- Cart akan otomatis clear setelah checkout berhasil
- Status order default: `pending` (bisa dikembangkan menjadi `processing`, `completed`, `cancelled`)

## Testing dengan Postman

Import file `gdgoc-studycase-postman.json` ke Postman dan update variable `BASE_URL` menjadi `http://localhost:8000/api`
