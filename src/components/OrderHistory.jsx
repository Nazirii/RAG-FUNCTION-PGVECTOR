import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ordersAPI } from '../api/api';

function OrderHistory() {
  const [selectedOrder, setSelectedOrder] = useState(null);

  const { data: ordersData, isLoading, error } = useQuery({
    queryKey: ['orders'],
    queryFn: () => ordersAPI.getAll().then(res => res.data),
  });

  const { data: orderDetail, isLoading: detailLoading } = useQuery({
    queryKey: ['order', selectedOrder],
    queryFn: () => ordersAPI.getByOrderNumber(selectedOrder).then(res => res.data),
    enabled: !!selectedOrder,
  });

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency', currency: 'IDR', minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">📜 Order History</h2>

        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            <p className="mt-4 text-gray-600">Loading orders...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
            ❌ Error: {error.message}
          </div>
        )}

        {ordersData && ordersData.data.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📜</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Belum Ada Order</h3>
            <p className="text-gray-500">Order history akan muncul setelah checkout</p>
          </div>
        )}

        {ordersData && ordersData.data.length > 0 && (
          <div className="space-y-4">
            {ordersData.data.map((order) => (
              <div 
                key={order.id} 
                onClick={() => setSelectedOrder(order.order_number)}
                className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all cursor-pointer hover:border-primary-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">Order #{order.order_number}</h3>
                    <p className="text-gray-600 text-sm">
                      <strong>Customer:</strong> {order.customer_name} | <strong>Table:</strong> {order.table_number}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[order.status]}`}>
                    {order.status.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">
                    📅 {formatDate(order.created_at)}
                  </span>
                  <span className="text-xl font-bold text-green-600">
                    {formatPrice(order.total)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedOrder(null)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white">
              <h2 className="text-2xl font-bold text-gray-800">📋 Order Detail</h2>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-gray-600 text-3xl leading-none"
              >
                ×
              </button>
            </div>

            {detailLoading && (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
                <p className="mt-4 text-gray-600">Loading detail...</p>
              </div>
            )}

            {orderDetail && (
              <div className="p-6 space-y-6">
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <h3 className="text-lg font-bold text-gray-800 mb-3">Order #{orderDetail.data.order_number}</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Customer:</span>
                      <p className="font-medium">{orderDetail.data.customer_name}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Phone:</span>
                      <p className="font-medium">{orderDetail.data.customer_phone}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Table:</span>
                      <p className="font-medium">{orderDetail.data.table_number}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Status:</span>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusColors[orderDetail.data.status]} ml-2`}>
                        {orderDetail.data.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-600">Date:</span>
                      <p className="font-medium">{formatDate(orderDetail.data.created_at)}</p>
                    </div>
                    {orderDetail.data.notes && (
                      <div className="col-span-2">
                        <span className="text-gray-600">Notes:</span>
                        <p className="font-medium italic">📝 {orderDetail.data.notes}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-4">🍽️ Order Items</h3>
                  <div className="space-y-3">
                    {orderDetail.data.items.map((item, index) => (
                      <div 
                        key={index}
                        className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-800 mb-1">{item.name}</h4>
                            <p className="text-gray-600 text-sm mb-2">
                              {formatPrice(item.price)} × {item.quantity} = <strong className="text-green-600">{formatPrice(item.price * item.quantity)}</strong>
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">📊 Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-gray-700">
                      <span>Subtotal:</span>
                      <span className="font-medium">{formatPrice(orderDetail.data.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>Tax (10%):</span>
                      <span className="font-medium">{formatPrice(orderDetail.data.tax)}</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t-2 border-gray-300">
                      <span>Total:</span>
                      <span className="text-green-600">{formatPrice(orderDetail.data.total)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button 
                    onClick={() => setSelectedOrder(null)}
                    className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-all"
                  >
                    ✅ Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderHistory;
