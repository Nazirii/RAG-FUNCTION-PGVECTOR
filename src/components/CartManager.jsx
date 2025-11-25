import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { menuAPI, cartAPI } from '../api/api';
import Toast from './Toast';
import ConfirmDialog from './ConfirmDialog';
import { getSession } from '../utils/sessionManager';

function CartManager() {
  const queryClient = useQueryClient();
  const [showCheckout, setShowCheckout] = useState(false);
  const [toast, setToast] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null);
  const [checkoutData, setCheckoutData] = useState({
    customer_name: '',
    customer_phone: '',
    table_number: '',
    notes: '',
  });

  // Auto-fill checkout data from session
  useEffect(() => {
    const session = getSession();
    if (session) {
      setCheckoutData({
        customer_name: session.customerName || '',
        customer_phone: session.customerPhone || '',
        table_number: session.tableNumber || '',
        notes: '',
      });
    }
  }, []);

  const { data: cartData, isLoading: cartLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: () => cartAPI.get().then(res => res.data),
  });

  // Listen for refresh cart event from AI Chat
  useEffect(() => {
    const handleRefreshCart = () => {
      queryClient.invalidateQueries(['cart']);
    };
    window.addEventListener('refreshCart', handleRefreshCart);
    return () => window.removeEventListener('refreshCart', handleRefreshCart);
  }, [queryClient]);

  const { data: menusData } = useQuery({
    queryKey: ['menus-for-cart'],
    queryFn: () => menuAPI.getAll({ per_page: 100 }).then(res => res.data),
  });

  const addToCartMutation = useMutation({
    mutationFn: cartAPI.add,
    onSuccess: () => {
      queryClient.invalidateQueries(['cart']);
      setToast({ message: 'Item ditambahkan ke cart!', type: 'success' });
    },
    onError: (error) => {
      setToast({ message: error.response?.data?.message || 'Gagal menambah item', type: 'error' });
    },
  });

  const updateCartMutation = useMutation({
    mutationFn: ({ id, data }) => cartAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['cart']);
    },
  });

  const removeCartMutation = useMutation({
    mutationFn: cartAPI.remove,
    onSuccess: () => {
      queryClient.invalidateQueries(['cart']);
      setToast({ message: 'Item dihapus dari cart!', type: 'success' });
    },
  });

  const clearCartMutation = useMutation({
    mutationFn: cartAPI.clear,
    onSuccess: () => {
      queryClient.invalidateQueries(['cart']);
      setToast({ message: 'Cart dikosongkan!', type: 'success' });
    },
  });

  const checkoutMutation = useMutation({
    mutationFn: cartAPI.checkout,
    onSuccess: (response) => {
      queryClient.invalidateQueries(['cart']);
      queryClient.invalidateQueries(['orders']);
      setToast({ 
        message: `Checkout berhasil! Order Number: ${response.data.data.order_number}`, 
        type: 'success' 
      });
      setShowCheckout(false);
      setCheckoutData({ customer_name: '', customer_phone: '', table_number: '', notes: '' });
    },
    onError: (error) => {
      setToast({ message: error.response?.data?.message || 'Checkout gagal', type: 'error' });
    },
  });

  const handleAddToCart = (menuId) => {
    const quantity = prompt('Jumlah item:', '1');
    if (quantity && parseInt(quantity) > 0) {
      const notes = prompt('Catatan (opsional):', '');
      addToCartMutation.mutate({
        menu_id: menuId,
        quantity: parseInt(quantity),
        notes: notes || '',
      });
    }
  };

  const handleUpdateQuantity = (itemId, currentQuantity) => {
    const newQuantity = prompt('Ubah jumlah:', currentQuantity);
    if (newQuantity && parseInt(newQuantity) > 0) {
      updateCartMutation.mutate({
        id: itemId,
        data: { quantity: parseInt(newQuantity) },
      });
    }
  };

  const handleUpdateNotes = (itemId, currentNotes) => {
    const newNotes = prompt('Ubah catatan:', currentNotes || '');
    if (newNotes !== null) {
      updateCartMutation.mutate({
        id: itemId,
        data: { notes: newNotes },
      });
    }
  };

  const handleCheckout = (e) => {
    e.preventDefault();
    setConfirmDialog({
      title: 'Konfirmasi Checkout',
      message: 'Yakin ingin melanjutkan checkout?',
      type: 'success',
      onConfirm: () => {
        checkoutMutation.mutate(checkoutData);
        setConfirmDialog(null);
      },
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency', currency: 'IDR', minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="space-y-4 px-4 py-4 max-w-4xl mx-auto">
      {/* Cart Section */}
      <div className="bg-white rounded-3xl shadow-lg p-6">
        {cartLoading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            <p className="mt-4 text-gray-600">Loading cart...</p>
          </div>
        )}

        {cartData && cartData.data.items.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🛒</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Cart Kosong</h3>
            <p className="text-gray-500">Tambahkan menu ke cart dari menu</p>
          </div>
        )}

        {cartData && cartData.data.items.length > 0 && (
          <>
            {/* Order Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Order</h2>
              </div>
              
              <div className="flex items-center gap-3 bg-gray-50 rounded-2xl p-3 border border-gray-200">
                <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center">
                  <span className="text-lg">🪑</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Meja 05</p>
                </div>
                {/* <button className="px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-full text-sm font-medium transition-all">
                  Ganti Meja
                </button> */}
              </div>
            </div>

            {/* Pesanan Items */}
            <div className="mb-6">
              <h3 className="font-bold text-gray-900 mb-3">Pesanan</h3>
              <div className="space-y-3">
                {cartData.data.items.map((item) => (
                  <div key={item.id} className="bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3">
                      {/* Image */}
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {item.menu.image_url ? (
                          <img src={item.menu.image_url} alt={item.menu.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-2xl">🍽️</span>
                        )}
                      </div>
                      
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-900 text-sm mb-0.5 truncate">{item.menu.name}</h4>
                        <p className="text-xs text-gray-500 mb-1">
                          {item.menu.category === 'food' ? 'Keju/Abon/Pedas' : 
                           item.menu.category === 'drinks' ? 'Minuman' : 
                           item.menu.category}
                        </p>
                        <p className="text-sm font-bold text-gray-900">{formatPrice(item.menu.price)}</p>
                      </div>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button 
                          onClick={() => {
                            if (item.quantity > 1) {
                              updateCartMutation.mutate({
                                id: item.id,
                                data: { quantity: item.quantity - 1 },
                              });
                            } else {
                              removeCartMutation.mutate(item.id);
                            }
                          }}
                          className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all"
                        >
                          <span className="text-sm font-bold">−</span>
                        </button>
                        <span className="text-sm font-bold w-6 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => updateCartMutation.mutate({
                            id: item.id,
                            data: { quantity: item.quantity + 1 },
                          })}
                          className="w-7 h-7 rounded-full bg-gray-900 hover:bg-gray-800 text-white flex items-center justify-center transition-all"
                        >
                          <span className="text-sm font-bold">+</span>
                        </button>
                      </div>
                    </div>
                    
                    {item.notes && (
                      <p className="text-xs text-gray-500 italic mt-2 pl-19">📝 {item.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Total Pesanan */}
            <div className="bg-gray-50 rounded-2xl p-4 mb-6">
              <h3 className="font-bold text-gray-900 mb-3">Total Pesanan</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium">{formatPrice(cartData.data.summary.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Pajak</span>
                  <span className="font-medium">{formatPrice(cartData.data.summary.tax)}</span>
                </div>
                <div className="h-px bg-gray-200 my-2"></div>
                <div className="flex justify-between text-base font-bold text-gray-900">
                  <span>Total</span>
                  <span>{formatPrice(cartData.data.summary.total)}</span>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <button 
              onClick={() => setShowCheckout(true)}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <span>Proses Order ({cartData.data.summary.total_items} item)</span>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>

            <button 
              onClick={() => {
                setConfirmDialog({
                  title: 'Kosongkan Cart',
                  message: 'Yakin ingin menghapus semua item dari cart?',
                  type: 'danger',
                  onConfirm: () => {
                    clearCartMutation.mutate();
                    setConfirmDialog(null);
                  },
                });
              }}
              className="w-full mt-3 bg-white border-2 border-red-200 hover:bg-red-50 text-red-600 py-3 rounded-2xl font-medium transition-all"
            >
              🗑️ Kosongkan Cart
            </button>
          </>
        )}
      </div>

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowCheckout(false)}>
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-800">✅ Konfirmasi Order</h2>
              <button 
                onClick={() => setShowCheckout(false)}
                className="text-gray-400 hover:text-gray-600 text-3xl leading-none"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleCheckout} className="p-6 space-y-4">
              {/* Info Customer dari Session */}
              <div className="bg-orange-50 rounded-2xl p-4 mb-4">
                <h3 className="font-bold text-gray-900 mb-2">Informasi Pemesan</h3>
                <div className="space-y-1 text-sm">
                  <p className="text-gray-700">
                    <span className="font-medium">Nama:</span> {checkoutData.customer_name}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Meja:</span> {checkoutData.table_number}
                  </p>
                  {checkoutData.customer_phone && (
                    <p className="text-gray-700">
                      <span className="font-medium">Telepon:</span> {checkoutData.customer_phone}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Catatan Tambahan</label>
                <textarea
                  value={checkoutData.notes}
                  onChange={(e) => setCheckoutData({ ...checkoutData, notes: e.target.value })}
                  placeholder="Catatan tambahan untuk pesanan..."
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-y"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowCheckout(false)}
                  className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl font-medium transition-all"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  disabled={checkoutMutation.isPending}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  Konfirmasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Available Menus - Removed as per Figma design */}
      
      {/* Toast Notification */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      {/* Confirm Dialog */}
      {confirmDialog && (
        <ConfirmDialog
          title={confirmDialog.title}
          message={confirmDialog.message}
          type={confirmDialog.type}
          onConfirm={confirmDialog.onConfirm}
          onCancel={() => setConfirmDialog(null)}
        />
      )}
    </div>
  );
}

export default CartManager;
