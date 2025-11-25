import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import CustomerMenu from '../components/CustomerMenu'
import CartManager from '../components/CartManager'
import AIChat from '../components/AIChat'
import SessionModal from '../components/SessionModal'
import ConfirmDialog from '../components/ConfirmDialog'
import { hasActiveSession, getSession, startSession, clearSession } from '../utils/sessionManager'

function CustomerPage() {
  const [activeView, setActiveView] = useState('menu') // menu or cart only
  const [showAIChat, setShowAIChat] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [cartItemCount, setCartItemCount] = useState(0)
  const [sessionData, setSessionData] = useState(null)
  const [showSessionModal, setShowSessionModal] = useState(false)
  const [confirmDialog, setConfirmDialog] = useState(null)
  const navigate = useNavigate()

  // Check session on mount
  useEffect(() => {
    if (hasActiveSession()) {
      setSessionData(getSession())
    } else {
      setShowSessionModal(true)
    }
  }, [])

  // Handle session start
  const handleSessionStart = ({ tableNumber, customerName, customerPhone }) => {
    const session = startSession(tableNumber, customerName, customerPhone)
    setSessionData(session)
    setShowSessionModal(false)
  }

  // Listen for custom event to switch to cart
  useEffect(() => {
    const handleSwitchToCart = () => setActiveView('cart')
    window.addEventListener('switchToCart', handleSwitchToCart)
    return () => window.removeEventListener('switchToCart', handleSwitchToCart)
  }, [])

  // Show session modal if no active session
  if (showSessionModal) {
    return <SessionModal onSessionStart={handleSessionStart} />
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header with Borneo Branding */}
      <header className="bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg px-4 py-4 sticky top-0 z-50">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-orange-600 text-xl font-bold shadow-md">
              {sessionData?.customerName?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <p className="text-xs font-bold text-orange-100">🏝️ Warung Borneo</p>
              <p className="text-sm text-white">Meja {sessionData?.tableNumber} • {sessionData?.customerName}</p>
            </div>
          </div>
          <button 
            onClick={() => {
              setConfirmDialog({
                title: 'Keluar dari Session',
                message: 'Yakin ingin keluar? Session dan cart Anda akan dihapus.',
                type: 'warning',
                confirmText: 'Ya, Keluar',
                onConfirm: () => {
                  clearSession()
                  navigate('/')
                  setConfirmDialog(null)
                },
              })
            }}
            className="w-10 h-10 rounded-full border-2 border-white/30 flex items-center justify-center hover:bg-white/20 transition-all text-white"
          >
            <span className="text-xl">🚪</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto">
        {activeView === 'menu' && <CustomerMenu onCartUpdate={setCartItemCount} onShowSearch={() => setShowSearch(true)} />}
        {activeView === 'cart' && <CartManager />}
      </main>

      {/* Floating AI Chat Widget */}
      {showAIChat && <AIChat onClose={() => setShowAIChat(false)} />}

      {/* Bottom Navigation - Hidden when AI Chat is open */}
      {!showAIChat && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 z-50">
        <div className="flex items-center justify-around max-w-7xl mx-auto">
          <button 
            className={`flex flex-col items-center py-3 px-8 transition-all ${
              activeView === 'menu' ? 'text-orange-500' : 'text-gray-400'
            }`}
            onClick={() => setActiveView('menu')}
          >
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-xs font-medium">Menu</span>
          </button>
          
          <button 
            className={`flex flex-col items-center py-3 px-8 transition-all relative ${
              activeView === 'cart' ? 'text-orange-500' : 'text-gray-400'
            }`}
            onClick={() => setActiveView('cart')}
          >
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {cartItemCount > 0 && (
              <span className="absolute top-1 right-3 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
            <span className="text-xs font-medium">Cart</span>
          </button>
        </div>
      </nav>
      )}

      {/* Floating AI Chat Button */}
      {!showAIChat && (
        <button
          onClick={() => setShowAIChat(true)}
          className="fixed bottom-20 left-4 md:bottom-6 md:left-6 w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 rounded-full shadow-2xl flex items-center justify-center text-white text-2xl transition-all hover:scale-110 z-40"
        >
          <span className="animate-pulse">🌴</span>
        </button>
      )}

      {/* Search Modal */}
      {showSearch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20" onClick={() => setShowSearch(false)}>
          <div className="bg-white rounded-3xl p-6 w-full max-w-2xl mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <input
                type="text"
                placeholder="Cari menu..."
                autoFocus
                className="flex-1 px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <button 
                onClick={() => setShowSearch(false)}
                className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-2xl font-medium transition-all"
              >
                Batal
              </button>
            </div>
            <p className="text-sm text-gray-500 text-center">Ketik untuk mencari menu...</p>
          </div>
        </div>
      )}
      
      {/* Confirm Dialog */}
      {confirmDialog && (
        <ConfirmDialog
          title={confirmDialog.title}
          message={confirmDialog.message}
          type={confirmDialog.type}
          confirmText={confirmDialog.confirmText}
          onConfirm={confirmDialog.onConfirm}
          onCancel={() => setConfirmDialog(null)}
        />
      )}
    </div>
  )
}

export default CustomerPage
