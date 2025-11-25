import { useState } from 'react';

function SessionModal({ onSessionStart }) {
  const [formData, setFormData] = useState({
    tableNumber: '',
    customerName: '',
    customerPhone: '',
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.tableNumber || formData.tableNumber.trim() === '') {
      newErrors.tableNumber = 'Nomor meja wajib diisi';
    }
    
    if (!formData.customerName || formData.customerName.trim() === '') {
      newErrors.customerName = 'Nama wajib diisi';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSessionStart(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-slide-up">
        {/* Logo/Icon */}
        <div className="text-center mb-6">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
            <span className="text-4xl">🍽️</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Selamat Datang!</h2>
          <p className="text-gray-600 text-sm">Silakan isi data untuk memulai pesanan</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nomor Meja *
            </label>
            <input
              type="text"
              value={formData.tableNumber}
              onChange={(e) => setFormData({ ...formData, tableNumber: e.target.value })}
              placeholder="Contoh: 5"
              className={`w-full px-4 py-3 border ${
                errors.tableNumber ? 'border-red-500' : 'border-gray-300'
              } rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all`}
            />
            {errors.tableNumber && (
              <p className="text-red-500 text-xs mt-1">{errors.tableNumber}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nama Anda *
            </label>
            <input
              type="text"
              value={formData.customerName}
              onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
              placeholder="Masukkan nama Anda"
              className={`w-full px-4 py-3 border ${
                errors.customerName ? 'border-red-500' : 'border-gray-300'
              } rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all`}
            />
            {errors.customerName && (
              <p className="text-red-500 text-xs mt-1">{errors.customerName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              No. Telepon <span className="text-gray-400">(Opsional)</span>
            </label>
            <input
              type="tel"
              value={formData.customerPhone}
              onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
              placeholder="08xx xxxx xxxx"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all mt-6"
          >
            Mulai Pesan 🚀
          </button>
        </form>

        {/* Info */}
        <div className="mt-6 p-4 bg-orange-50 rounded-2xl">
          <p className="text-xs text-gray-600 text-center">
            💡 Data Anda akan disimpan selama 24 jam untuk kemudahan pemesanan
          </p>
        </div>
      </div>
    </div>
  );
}

export default SessionModal;
