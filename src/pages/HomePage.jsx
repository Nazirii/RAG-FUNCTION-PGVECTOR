import { useNavigate } from 'react-router-dom'

function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 mx-auto mb-6 bg-white rounded-full flex items-center justify-center shadow-2xl">
            <span className="text-5xl">🍽️</span>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            Restaurant POS
          </h1>
          <p className="text-xl text-orange-100">
            Sistem Pemesanan & Manajemen Restaurant Modern
          </p>
        </div>

        {/* Selection Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Owner Card */}
          <button
            onClick={() => navigate('/owner')}
            className="group bg-white rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-2"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <span className="text-4xl">👨‍💼</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Owner Dashboard</h2>
            <p className="text-gray-600 mb-4">
              Kelola menu, lihat order history, dan atur restoran Anda
            </p>
            <div className="flex items-center justify-center gap-2 text-purple-600 font-semibold">
              <span>Masuk sebagai Owner</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
          </button>

          {/* Customer Card */}
          <button
            onClick={() => navigate('/customer')}
            className="group bg-white rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-2"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <span className="text-4xl">👥</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Customer Menu</h2>
            <p className="text-gray-600 mb-4">
              Browse menu, pesan makanan, dan kelola cart Anda
            </p>
            <div className="flex items-center justify-center gap-2 text-orange-600 font-semibold">
              <span>Lihat Menu & Pesan</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
          </button>
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-white text-sm opacity-90">
            💡 Pilih mode sesuai kebutuhan Anda
          </p>
        </div>
      </div>
    </div>
  )
}

export default HomePage
