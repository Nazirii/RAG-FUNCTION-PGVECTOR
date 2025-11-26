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
    <div className="fixed inset-0 bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 flex items-center justify-center z-[100] p-4 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-10 animate-slide-up relative z-10">
        {/* Logo/Icon */}
        <div className="text-center mb-8">
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-orange-200 rounded-full blur-2xl animate-pulse"></div>
            <div className="relative w-28 h-28 mx-auto bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center shadow-2xl ring-4 ring-orange-100">
              <span className="text-5xl">🍽️</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">Selamat Datang!</h2>
          <p className="text-gray-600 text-base">Silakan isi data untuk memulai pesanan</p>
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
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-5 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all mt-8 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
          >
            <span>Mulai Pesan</span>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </form>

        {/* Info */}
        <div className="mt-8 p-5 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl border border-orange-200">
          <p className="text-sm text-gray-700 text-center font-medium">
            Data Anda akan disimpan selama 24 jam untuk kemudahan pemesanan
          </p>
        </div>
      </div>
    </div>
  );
}

export default SessionModal;
