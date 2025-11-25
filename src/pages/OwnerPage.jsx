import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MenuManager from '../components/MenuManager'
import OrderHistory from '../components/OrderHistory'

function OwnerPage() {
  const [activeTab, setActiveTab] = useState('menu')
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Profile */}
      <header className="bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full  flex items-center justify-center text-3xl shadow-lg">
                <img src="\public\narsisssss.png" alt="" className="rounded-full w-14 border-gray-700 border-2" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Owner Dashboard</h1>
                <p className="text-orange-100 text-sm">Kelola restoran Anda</p>
              </div>
            </div>
            <button 
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-xl font-medium transition-all backdrop-blur-sm"
            >
              ← Keluar
            </button>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto">
          <div className="flex">
            <button 
              className={`flex-1 py-4 px-6 font-medium transition-all border-b-3 ${
                activeTab === 'menu'
                  ? 'text-orange-600 border-b-orange-600 bg-orange-50'
                  : 'text-gray-600 border-b-transparent hover:bg-gray-50 hover:text-gray-800'
              }`}
              onClick={() => setActiveTab('menu')}
            >
              📋 Menu Management
            </button>
            <button 
              className={`flex-1 py-4 px-6 font-medium transition-all border-b-3 ${
                activeTab === 'orders'
                  ? 'text-orange-600 border-b-orange-600 bg-orange-50'
                  : 'text-gray-600 border-b-transparent hover:bg-gray-50 hover:text-gray-800'
              }`}
              onClick={() => setActiveTab('orders')}
            >
              📜 Order History
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
