<<<<<<< HEAD
<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>

<p align="center">
<a href="https://github.com/laravel/framework/actions"><img src="https://github.com/laravel/framework/workflows/tests/badge.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p>

## About Laravel

Laravel is a web application framework with expressive, elegant syntax. We believe development must be an enjoyable and creative experience to be truly fulfilling. Laravel takes the pain out of development by easing common tasks used in many web projects, such as:

- [Simple, fast routing engine](https://laravel.com/docs/routing).
- [Powerful dependency injection container](https://laravel.com/docs/container).
- Multiple back-ends for [session](https://laravel.com/docs/session) and [cache](https://laravel.com/docs/cache) storage.
- Expressive, intuitive [database ORM](https://laravel.com/docs/eloquent).
- Database agnostic [schema migrations](https://laravel.com/docs/migrations).
- [Robust background job processing](https://laravel.com/docs/queues).
- [Real-time event broadcasting](https://laravel.com/docs/broadcasting).

Laravel is accessible, powerful, and provides tools required for large, robust applications.

## Learning Laravel

Laravel has the most extensive and thorough [documentation](https://laravel.com/docs) and video tutorial library of all modern web application frameworks, making it a breeze to get started with the framework. You can also check out [Laravel Learn](https://laravel.com/learn), where you will be guided through building a modern Laravel application.

If you don't feel like reading, [Laracasts](https://laracasts.com) can help. Laracasts contains thousands of video tutorials on a range of topics including Laravel, modern PHP, unit testing, and JavaScript. Boost your skills by digging into our comprehensive video library.

## Laravel Sponsors

We would like to extend our thanks to the following sponsors for funding Laravel development. If you are interested in becoming a sponsor, please visit the [Laravel Partners program](https://partners.laravel.com).

### Premium Partners

- **[Vehikl](https://vehikl.com)**
- **[Tighten Co.](https://tighten.co)**
- **[Kirschbaum Development Group](https://kirschbaumdevelopment.com)**
- **[64 Robots](https://64robots.com)**
- **[Curotec](https://www.curotec.com/services/technologies/laravel)**
- **[DevSquad](https://devsquad.com/hire-laravel-developers)**
- **[Redberry](https://redberry.international/laravel-development)**
- **[Active Logic](https://activelogic.com)**

## Contributing

Thank you for considering contributing to the Laravel framework! The contribution guide can be found in the [Laravel documentation](https://laravel.com/docs/contributions).

## Code of Conduct

In order to ensure that the Laravel community is welcoming to all, please review and abide by the [Code of Conduct](https://laravel.com/docs/contributions#code-of-conduct).

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
=======
# ✨ Restaurant API Testing UI - Tailwind Edition

UI React yang modern dan powerful dengan **Tailwind CSS** untuk testing Laravel Restaurant API. Dilengkapi dengan **debounced search (250ms)** untuk performa optimal!

## 🎨 Features

### ⚡ Tailwind CSS Integration
- Modern utility-first CSS framework
- Responsive design (mobile-first)
- Custom color palette (#667eea primary)
- Smooth animations & transitions

### 🔍 Debounced Search (250ms)
- Smart search dengan delay 250ms sebelum query API
- Reduced API calls & better performance
- Smooth typing experience tanpa lag
- Auto-cancel previous requests

### 📋 Complete CRUD
- **Menu Management** - Create, Read, Update, Delete
- **Cart System** - Add, update, remove items
- **Order History** - View orders dengan detail lengkap

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

Buka browser: `http://localhost:5173`

**Backend Laravel harus running di**: `http://localhost:8000`

## 📦 Tech Stack

- **React 19** - UI Library
- **Tailwind CSS 3** - Styling
- **React Query** - Data fetching & caching
- **Axios** - HTTP client
- **Lodash** - Debounce utility
- **Vite** - Build tool

## 🔍 Debounced Search

Search di Menu Management menggunakan debounce 250ms untuk mengurangi API calls:

```javascript
// Debounced search implementation
const debouncedSearch = useCallback(
  debounce((value) => {
    setFilters(prev => ({ ...prev, q: value, page: 1 }));
  }, 250), // 250ms delay
  []
);
```

### Benefits:
- ✅ Reduced API calls (tidak request setiap keystroke)
- ✅ Better server performance
- ✅ Smooth user experience
- ✅ Auto-cancel previous requests

## 🎯 Pages

1. **📋 Menu Management** - CRUD menu dengan debounced search & filters
2. **🛒 Cart & Checkout** - Kelola cart dan checkout orders
3. **📜 Order History** - Lihat order history dengan detail

## 🎨 Tailwind Config

Custom colors di `tailwind.config.js`:

```javascript
colors: {
  primary: {
    500: '#667eea', // Main
    600: '#5568d3', // Hover
    // ... more shades
  },
}
```

## 📱 Responsive Design

- Mobile: 1 column
- Tablet (md): 2 columns
- Laptop (lg): 3 columns  
- Desktop (xl): 4 columns

## 🚀 Performance

- React Query caching
- Debounced search (250ms)
- Lazy loading
- Optimistic updates
- HMR with Vite

## 📝 API Endpoints

✅ Menu: GET, POST, PUT, DELETE `/api/menu`  
✅ Cart: GET, POST, PUT, DELETE `/api/cart`  
✅ Checkout: POST `/api/cart/checkout`  
✅ Orders: GET `/api/orders`

---

**Ready to test!** 🎉 Built with React + Tailwind + Vite
>>>>>>> c4a68451e9a0c407179c443cd49706ced56e31fe
