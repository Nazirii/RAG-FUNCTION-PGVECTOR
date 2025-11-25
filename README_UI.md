# 🍽️ Restaurant API Testing UI

UI React yang powerful untuk testing Laravel Restaurant API tanpa Postman! Lengkap dengan fitur menu management, cart, dan order history.

## ✨ Fitur Lengkap

### 📋 Menu Management
- ✅ **CRUD Operations** - Create, Read, Update, Delete menu
- 🔍 **Search & Filter** - Cari berdasarkan keyword, kategori, harga, kalori
- 📊 **Pagination** - Navigasi halaman untuk data besar
- 🏷️ **Rich Data** - Support ingredients, allergens, nutritional info, spicy level
- ⚡ **Real-time Update** - Auto refresh setelah operasi

### 🛒 Cart & Checkout
- 🛍️ **Add to Cart** - Tambah menu dengan quantity dan notes
- ✏️ **Update Cart** - Edit quantity dan catatan
- 🗑️ **Remove Items** - Hapus item atau kosongkan cart
- 💰 **Summary** - Lihat subtotal, tax (10%), dan total
- ✅ **Checkout** - Checkout dengan info customer dan table

### 📜 Order History
- 📋 **List Orders** - Semua order history
- 🔍 **Order Detail** - Detail lengkap per order
- 📊 **Status Tracking** - Status pending/processing/completed/cancelled
- 💳 **Order Summary** - Detail items, pricing, dan customer info

## 🚀 Cara Menjalankan

### 1. Setup Backend (Laravel)
```bash
cd c:\laragon\www\RESTO
php artisan serve
# API running at http://localhost:8000
```

### 2. Setup Frontend (React)
```bash
cd c:\laragon\www\resto-frontend
npm install
npm run dev
# Frontend running at http://localhost:5173
```

### 3. Buka Browser
Buka `http://localhost:5173` dan mulai testing API!

## 🎯 Quick Start Guide

### Test Menu API
1. Klik tab **"Menu Management"**
2. Klik **"Tambah Menu Baru"** untuk create
3. Gunakan filter bar untuk search & filter
4. Klik **"Edit"** atau **"Delete"** pada menu card

### Test Cart & Checkout API
1. Klik tab **"Cart & Checkout"**
2. Scroll ke bawah untuk lihat available menus
3. Klik **"Add to Cart"** pada menu
4. Update quantity atau notes di cart
5. Klik **"Checkout"** untuk checkout
6. Isi form customer dan confirm

### Test Orders API
1. Klik tab **"Order History"**
2. Lihat semua orders
3. Klik order untuk lihat detail lengkap

## 🔧 Konfigurasi

API base URL di `src/api/api.js`:
```javascript
const API_BASE_URL = 'http://localhost:8000/api';
```

Ubah sesuai backend Laravel Anda.

## 📡 API Endpoints Supported

### Menu API
- `GET /api/menu` - List menu (with filters)
- `GET /api/menu/{id}` - Get menu detail
- `POST /api/menu` - Create menu
- `PUT /api/menu/{id}` - Update menu
- `DELETE /api/menu/{id}` - Delete menu
- `GET /api/menu/search` - Search menu
- `GET /api/menu/group-by-category` - Group by category

### Cart API
- `GET /api/cart` - Get cart
- `POST /api/cart` - Add to cart
- `PUT /api/cart/{id}` - Update cart item
- `DELETE /api/cart/{id}` - Remove item
- `DELETE /api/cart` - Clear cart
- `POST /api/cart/checkout` - Checkout

### Orders API
- `GET /api/orders` - Get all orders
- `GET /api/orders/{order_number}` - Get order detail

## 🎨 Tech Stack

- **React 19** - UI Framework
- **React Query (TanStack Query)** - Data fetching & caching
- **Axios** - HTTP client
- **Vite** - Build tool
- **CSS3** - Styling (no framework, custom design)

## 💡 Tips

1. **Session Management** - Session ID auto-generated dan disimpan di localStorage
2. **Auto Refresh** - Data auto refresh setelah create/update/delete
3. **Error Handling** - Error dari API ditampilkan dengan alert
4. **Responsive** - UI responsive untuk berbagai screen size
5. **Fast** - React Query caching untuk performa optimal

## 🐛 Troubleshooting

### CORS Error?
Pastikan Laravel backend sudah configure CORS. Add di `config/cors.php`:
```php
'paths' => ['api/*'],
'allowed_origins' => ['http://localhost:5173'],
```

### API Not Found?
Pastikan:
- Laravel server running di `http://localhost:8000`
- Route API sudah benar di `routes/api.php`
- Database migration sudah running

### Session Issues?
Clear localStorage di browser:
```javascript
localStorage.removeItem('resto_session_id');
```

## 📝 Notes

- Session ID format: `user-{timestamp}-{random}`
- Tax calculated as 10% of subtotal
- Order number format: `ORD-YYYYMMDD-XXXXXX`
- Cart auto cleared after successful checkout

## 🎉 Selamat Testing!

Sekarang Anda bisa testing Laravel API dengan cepat dan mudah tanpa Postman! 🚀

---

Made with ❤️ for faster API testing
