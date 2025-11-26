import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cartAPI } from '../api/api';
import { useState } from 'react';
import Toast from './Toast';

function MenuDetailModal({ menu, onClose }) {
  const queryClient = useQueryClient();
  const [quantity, setQuantity] = useState(1);
  const [toast, setToast] = useState(null);

  const addToCartMutation = useMutation({
    mutationFn: cartAPI.add,
    onSuccess: () => {
      queryClient.invalidateQueries(['cart']);
      setToast({ message: 'Item ditambahkan ke cart!', type: 'success' });
      setTimeout(() => onClose(), 1500);
    },
    onError: (error) => {
      setToast({ message: error.response?.data?.message || 'Gagal menambah item', type: 'error' });
    },
  });

  const handleAddToCart = () => {
    addToCartMutation.mutate({
      menu_id: menu.id,
      quantity: quantity,
      notes: '',
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency', currency: 'IDR', minimumFractionDigits: 0,
    }).format(price);
  };

  if (!menu) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-[60] p-0 animate-fadeIn" onClick={onClose}>
      <div className="bg-white rounded-t-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slide-up shadow-2xl" onClick={(e) => e.stopPropagation()}>
        {/* Back Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 left-6 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-all z-10"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Image */}
        <div className="relative bg-gradient-to-br from-gray-200 to-gray-300 h-64 flex items-center justify-center">
          {menu.image_url ? (
            <img src={menu.image_url} alt={menu.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-48 h-48 rounded-full bg-white shadow-2xl flex items-center justify-center">
              <span className="text-6xl">🍽️</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="bg-white rounded-t-3xl -mt-6 relative px-6 pt-6 pb-56">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">{menu.name}</h2>
              <p className="text-sm text-gray-500">
                {menu.category === 'food' ? 'Keju/Abon/Pedas' : 
                 menu.category === 'drinks' ? 'Minuman' : 
                 menu.category}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-orange-500">{formatPrice(menu.price)}</p>
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-1 bg-orange-50 px-3 py-1 rounded-full">
              <span className="text-orange-500">⭐</span>
              <span className="text-sm font-semibold text-gray-800">4.9</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-600 text-sm leading-relaxed mb-6">
            {menu.description || `${menu.name} adalah makanan ringan tradisional yang terbuat dari adonan tepung yang kemudian digoreng. Nama ${menu.name.toLowerCase()} adalah singkatan dari 'aci digoreng'. Ciri khasnya adalah tekstur yang kenyal di dalam dan garing di luar setelah digoreng.`}
          </p>

          {/* Info Cards */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <div className="text-2xl mb-1">🔥</div>
              <p className="text-xs text-gray-500">Kalori</p>
              <p className="text-sm font-bold text-gray-800">{menu.calories}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <div className="text-2xl mb-1">⏱️</div>
              <p className="text-xs text-gray-500">Waktu</p>
              <p className="text-sm font-bold text-gray-800">{menu.preparation_time}m</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <div className="text-2xl mb-1">🌶️</div>
              <p className="text-xs text-gray-500">Pedas</p>
              <p className="text-sm font-bold text-gray-800">{menu.spicy_level}</p>
            </div>
          </div>

          {/* Nutritional Information */}
          {menu.nutritional_info && (
            <div className="mb-6">
              <h3 className="font-bold text-gray-800 mb-3">Informasi Nutrisi (per sajian):</h3>
              <div className="grid grid-cols-4 gap-3">
                <div className="bg-blue-50 rounded-xl p-3 text-center">
                  <p className="text-xs text-gray-500 mb-1">Protein</p>
                  <p className="text-lg font-bold text-blue-600">{menu.nutritional_info.protein}g</p>
                </div>
                <div className="bg-orange-50 rounded-xl p-3 text-center">
                  <p className="text-xs text-gray-500 mb-1">Carbs</p>
                  <p className="text-lg font-bold text-orange-600">{menu.nutritional_info.carbs}g</p>
                </div>
                <div className="bg-yellow-50 rounded-xl p-3 text-center">
                  <p className="text-xs text-gray-500 mb-1">Fat</p>
                  <p className="text-lg font-bold text-yellow-600">{menu.nutritional_info.fat}g</p>
                </div>
                <div className="bg-green-50 rounded-xl p-3 text-center">
                  <p className="text-xs text-gray-500 mb-1">Fiber</p>
                  <p className="text-lg font-bold text-green-600">{menu.nutritional_info.fiber}g</p>
                </div>
              </div>
            </div>
          )}

          {/* Ingredients */}
          {menu.ingredients && menu.ingredients.length > 0 && (
            <div className="mb-6">
              <h3 className="font-bold text-gray-800 mb-2">Bahan-bahan:</h3>
              <div className="flex flex-wrap gap-2">
                {menu.ingredients.map((ingredient, idx) => (
                  <span key={idx} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                    {ingredient}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Allergens Warning */}
          {menu.allergens && menu.allergens.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-6">
              <p className="text-sm text-red-700">
                <strong>⚠️ Perhatian Alergen:</strong> {menu.allergens.join(', ')}
              </p>
            </div>
          )}
        </div>

        {/* Fixed Bottom CTA with safe area */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-[70] safe-area-bottom">
          <div className="max-w-2xl mx-auto">
            <button 
              onClick={handleAddToCart}
              disabled={addToCartMutation.isPending || !menu.is_available}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {!menu.is_available ? (
                '❌ Tidak Tersedia'
              ) : (
                <>
                  <span>Tambah ke Keranjang</span>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Toast Notification */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <style jsx>{`
        .safe-area-bottom {
          padding-bottom: max(16px, env(safe-area-inset-bottom));
        }
      `}</style>
    </div>
  );
}

export default MenuDetailModal;
