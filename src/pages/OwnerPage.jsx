import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MenuManager from '../components/MenuManager'
import OrderHistory from '../components/OrderHistory'

function OwnerPage() {
  const [activeTab, setActiveTab] = useState('menu')
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100">
      {/* Header with Profile */}
      <header className="bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="relative">
                <div className="absolute inset-0 bg-white/20 rounded-full blur-xl"></div>
                <div className="relative w-20 h-20 rounded-full flex items-center justify-center text-3xl shadow-2xl ring-4 ring-white/30">
                  <img src="\public\narsisssss.png" alt="" className="rounded-full w-20 border-white border-4" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">Owner Dashboard</h1>
                <p className="text-orange-50 text-base font-medium mt-1">Kelola restoran Anda dengan mudah</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-2xl font-bold transition-all backdrop-blur-md shadow-lg hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="bg-white/80 backdrop-blur-xl shadow-lg sticky top-0 z-40 border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex">
            <button
              className={`flex-1 py-5 px-8 font-bold text-lg transition-all border-b-4 relative ${
                activeTab === 'menu'
                  ? 'text-orange-600 border-b-orange-600 bg-orange-50/50'
                  : 'text-gray-600 border-b-transparent hover:bg-gray-50 hover:text-gray-800'
              }`}
              onClick={() => setActiveTab('menu')}
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Menu Management
              </span>
            </button>
            <button
              className={`flex-1 py-5 px-8 font-bold text-lg transition-all border-b-4 relative ${
                activeTab === 'orders'
                  ? 'text-orange-600 border-b-orange-600 bg-orange-50/50'
                  : 'text-gray-600 border-b-transparent hover:bg-gray-50 hover:text-gray-800'
              }`}
              onClick={() => setActiveTab('orders')}
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Order History
              </span>
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'menu' && <MenuManager />}
        {activeTab === 'orders' && <OrderHistory />}
      </main>
    </div>
  )
}

export default OwnerPage
