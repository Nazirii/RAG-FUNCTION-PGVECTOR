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
