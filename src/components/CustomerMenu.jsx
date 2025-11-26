import { useState, useCallback, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { debounce } from 'lodash';
import { menuAPI, cartAPI } from '../api/api';
import MenuDetailModal from './MenuDetailModal';
import Toast from './Toast';

function CustomerMenu({ onCartUpdate, onShowSearch }) {
  const queryClient = useQueryClient();
  const [searchInput, setSearchInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [showCartToast, setShowCartToast] = useState(false);
  const [lastAddedItem, setLastAddedItem] = useState(null);
  const [toast, setToast] = useState(null);
  const [filters, setFilters] = useState({
    q: '',
    category: '',
    page: 1,
    per_page: 100,
  });

  // Debounced search - 250ms
  const debouncedSearch = useCallback(
    debounce((value) => {
      setFilters(prev => ({ ...prev, q: value, page: 1 }));
    }, 250),
    []
  );

  useEffect(() => {
    debouncedSearch(searchInput);
    return () => debouncedSearch.cancel();
  }, [searchInput, debouncedSearch]);

  // Fetch menus
  const { data, isLoading, error } = useQuery({
    queryKey: ['menus', filters],
    queryFn: () => menuAPI.getAll(filters).then(res => res.data),
  });

  // Fetch cart to update count
  const { data: cartData } = useQuery({
    queryKey: ['cart'],
    queryFn: () => cartAPI.get().then(res => res.data),
  });

  // Update cart count when cart data changes
  useEffect(() => {
    if (cartData && onCartUpdate) {
      onCartUpdate(cartData.data.summary.total_items || 0);
    }
  }, [cartData, onCartUpdate]);

  const addToCartMutation = useMutation({
    mutationFn: cartAPI.add,
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries(['cart']);
      // Show toast with item info
      const menuItem = data?.data?.find(m => m.id === variables.menu_id);
      if (menuItem) {
        setLastAddedItem({ name: menuItem.name, quantity: variables.quantity });
        setShowCartToast(true);
        setTimeout(() => setShowCartToast(false), 3000);
      }
    },
    onError: (error) => {
      setToast({ message: error.response?.data?.message || 'Gagal menambah item', type: 'error' });
    },
  });

  const handleAddToCart = (menu, e) => {
    if (e) e.stopPropagation();
    addToCartMutation.mutate({
      menu_id: menu.id,
      quantity: 1,
      notes: '',
    });
  };

  const categories = [
    { id: 'food', name: 'Food', icon: '🍔', color: 'from-orange-400 to-orange-600' },
    { id: 'drinks', name: 'Drinks', icon: '🥤', color: 'from-blue-400 to-blue-600' },
    { id: 'dessert', name: 'Dessert', icon: '🍰', color: 'from-pink-400 to-pink-600' },
    { id: 'appetizer', name: 'Appetizer', icon: '🥗', color: 'from-green-400 to-green-600' },
  ];

  const handleCategoryClick = (categoryId) => {
    if (selectedCategory === categoryId) {
      setSelectedCategory('');
      setFilters({ ...filters, category: '', page: 1 });
    } else {
      setSelectedCategory(categoryId);
      setFilters({ ...filters, category: categoryId, page: 1 });
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency', currency: 'IDR', minimumFractionDigits: 0,
    }).format(price);
  };

  const availableMenus = data?.data?.filter(menu => menu.is_available) || [];

  return (
    <div className="space-y-5 px-4 py-5 pb-56 md:pb-32">
      {/* Search Bar */}
      <div className="bg-white rounded-2xl shadow-lg p-4 border border-gray-100 hover:shadow-xl transition-shadow">
        <div className="flex items-center gap-3">
          <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Cari menu favorit Anda..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="flex-1 outline-none text-base font-medium text-gray-800 placeholder:text-gray-400"
          />
          {searchInput && (
            <button
              onClick={() => setSearchInput('')}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Kategori Icons */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4 tracking-tight">Kategori</h3>
        <div className="grid grid-cols-4 gap-3">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl transition-all transform hover:scale-105 active:scale-95 ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-500 shadow-lg'
                  : 'bg-white border-2 border-gray-200 hover:border-orange-300 hover:shadow-md'
              }`}
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-3xl shadow-lg`}>
                {cat.icon}
              </div>
              <span className={`text-xs font-bold ${
                selectedCategory === cat.id ? 'text-orange-600' : 'text-gray-700'
              }`}>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Loading & Error States */}
      {isLoading && (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          <p className="mt-4 text-gray-600">Memuat menu...</p>
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
          ❌ Error: {error.message}
        </div>
      )}

      {/* Menu Grid - Responsive: 2 cols mobile, 3-5 cols desktop */}
      {!isLoading && !error && (
        <>
          {availableMenus.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <div className="text-6xl mb-4">🍽️</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Menu tidak ditemukan</h3>
              <p className="text-gray-500">Coba ubah pencarian atau kategori Anda</p>
            </div>
          ) : (
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 tracking-tight">
                {selectedCategory ? `Menu ${categories.find(c => c.id === selectedCategory)?.name}` : 'Semua Menu'}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5">
                {availableMenus.map((menu) => (
                  <div
                    key={menu.id}
                    onClick={() => setSelectedMenu(menu)}
                    className="bg-white rounded-3xl p-5 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer relative group hover:scale-105 active:scale-95 border border-gray-100"
                  >
                    {/* Fire Badge for popular items */}
                    {menu.is_popular && (
                      <div className="absolute top-2 right-2 w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center shadow-md z-10">
                      </div>
                    )}
                    
                    {/* Image Circle */}
                    <div className="w-full aspect-square rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mb-3 overflow-hidden">
                      {menu.image_url ? (
                        <img src={menu.image_url} alt={menu.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-4xl md:text-5xl">🍽️</span>
                      )}
                    </div>
                    
                    <h4 className="font-bold text-gray-900 text-sm mb-1 text-center line-clamp-1">
                      {menu.name}
                    </h4>
                    
                    {/* Quick Info */}
                    <div className="flex items-center justify-center gap-2 mb-2 text-xs text-gray-500">
                      {menu.calories && (
                        <span className="flex items-center gap-0.5">
                          🔥 {menu.calories}
                        </span>
                      )}
                      {menu.preparation_time && (
                        <span className="flex items-center gap-0.5">
                          ⏱️ {menu.preparation_time}m
                        </span>
                      )}
                      {menu.spicy_level && menu.spicy_level !== 'none' && (
                        <span className="flex items-center gap-0.5">
                          🌶️
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <p className="text-green-600 font-bold text-sm">{formatPrice(menu.price)}</p>
                      <button 
                        onClick={(e) => handleAddToCart(menu, e)}
                        disabled={addToCartMutation.isPending}
                        className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white flex items-center justify-center transition-all shadow-md hover:shadow-lg disabled:opacity-50"
                      >
                        <span className="text-lg">+</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Cart Toast Notification */}
      {showCartToast && lastAddedItem && (
        <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-2xl shadow-2xl z-50 flex items-center gap-3 animate-slide-up">
          <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
            <span className="text-xl">✓</span>
          </div>
          <div className="flex-1">
            <p className="font-bold text-sm">{lastAddedItem.name}</p>
            <p className="text-xs text-gray-300">Ditambahkan ke cart</p>
          </div>
          <button 
            onClick={() => setShowCartToast(false)}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      {/* Floating Cart Button */}
      {cartData && cartData.data.items.length > 0 && (
        <div className="fixed bottom-24 right-4 z-40">
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('switchToCart'))}
            className="bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-2xl shadow-2xl p-4 flex items-center gap-3 transition-all hover:scale-105 animate-slide-up"
          >
            <div className="relative">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {cartData.data.summary.total_items}
              </span>
            </div>
            <div className="text-left">
              <p className="text-xs font-medium opacity-90">Lihat Cart</p>
              <p className="text-sm font-bold">{formatPrice(cartData.data.summary.total)}</p>
            </div>
          </button>
        </div>
      )}

      {/* Menu Detail Modal */}
      {selectedMenu && (
        <MenuDetailModal 
          menu={selectedMenu} 
          onClose={() => setSelectedMenu(null)} 
        />
      )}
      
      {/* Toast Notification for Errors */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

export default CustomerMenu;
