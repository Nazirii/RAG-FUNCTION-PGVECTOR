import { useNavigate } from 'react-router-dom'

function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-5xl w-full relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="relative inline-block mb-8">
            <div className="absolute inset-0 bg-white/20 rounded-full blur-2xl animate-pulse"></div>
            <div className="relative w-28 h-28 mx-auto bg-white rounded-full flex items-center justify-center shadow-2xl">
              <span className="text-6xl">🍽️</span>
            </div>
          </div>
          <h1 className="text-6xl md:text-7xl font-extrabold text-white mb-6 tracking-tight drop-shadow-lg">
            Restaurant POS
          </h1>
          <p className="text-xl md:text-2xl text-orange-50 font-medium">
            Sistem Pemesanan & Manajemen Restaurant Modern
          </p>
        </div>

        {/* Selection Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Owner Card */}
          <button
            onClick={() => navigate('/owner')}
            className="group relative bg-white rounded-3xl p-10 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-3 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                <span className="text-5xl">👨‍💼</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Owner Dashboard</h2>
              <p className="text-gray-600 mb-6 text-base leading-relaxed">
                Kelola menu, lihat order history, dan atur restoran Anda dengan mudah
              </p>
              <div className="flex items-center justify-center gap-2 text-slate-700 font-bold text-lg">
                <span>Masuk sebagai Owner</span>
                <svg className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </div>
          </button>

          {/* Customer Card */}
          <button
            onClick={() => navigate('/customer')}
            className="group relative bg-white rounded-3xl p-10 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-3 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                <span className="text-5xl">👥</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Customer Menu</h2>
              <p className="text-gray-600 mb-6 text-base leading-relaxed">
                Browse menu, pesan makanan favorit, dan kelola cart Anda
              </p>
              <div className="flex items-center justify-center gap-2 text-orange-600 font-bold text-lg">
                <span>Lihat Menu & Pesan</span>
                <svg className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </div>
          </button>
        </div>

        {/* Footer */}
        <div className="text-center mt-16">
          <p className="text-white text-base font-medium opacity-90 drop-shadow-md">
            Pilih mode sesuai kebutuhan Anda
          </p>
        </div>
      </div>
    </div>
  )
}

export default HomePage
