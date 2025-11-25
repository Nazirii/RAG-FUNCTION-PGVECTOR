import { useState, useEffect, useRef } from 'react';
import api from '../api/api';
import { getSessionId, getSession } from '../utils/sessionManager';

const AIChat = ({ onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => getSessionId() || 'guest');
  const [sessionData] = useState(() => getSession());
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Load history from sessionStorage on mount
  useEffect(() => {
    const saved = sessionStorage.getItem(`chat_history_${sessionId}`);
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load chat history', e);
      }
    }
  }, [sessionId]);

  // Auto-save to sessionStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      sessionStorage.setItem(`chat_history_${sessionId}`, JSON.stringify(messages));
    }
  }, [messages, sessionId]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [input]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');

    // Add user message to UI
    const newUserMsg = {
      role: 'user',
      parts: [{ text: userMessage }],
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, newUserMsg]);

    setIsLoading(true);

    try {
      // Debug: log session ID yang dipakai
      console.log('🔍 Sending chat with session:', sessionId);
      console.log('📋 Session data:', sessionData);
      console.log('💬 User message:', userMessage);
      
      // Prepare conversation history for backend (Gemini format)
      // CRITICAL: Use exact parts from backend response, don't rebuild
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        parts: msg.parts, // Preserve exact parts structure from Gemini
      }));

      console.log('📜 Sending history count:', conversationHistory.length);

      const response = await api.chat(userMessage, sessionId, conversationHistory);
      
      console.log('✅ AI Response received:', response);

      // Add AI response to UI
      const aiMessage = {
        role: 'model',
        parts: response.parts || [{ text: response.ai_response }], // Use parts from backend
        timestamp: new Date().toISOString(),
        function_calls: response.function_calls || [],
        function_results: response.function_results || [],
        context_menus: response.context_menus || [],
        metadata: response.metadata || {},
      };

      setMessages(prev => {
        const newMessages = [...prev, aiMessage];
        
        // If there are function results, add them as separate message for next turn
        // This allows AI to access function results (like cart data) in conversation history
        if (response.function_results && response.function_results.length > 0) {
          const functionResultsMessage = {
            role: 'function',
            parts: response.function_results.map(fr => ({
              functionResponse: {
                name: fr.name,
                response: fr.response
              }
            })),
            timestamp: new Date().toISOString(),
            isHidden: true, // Don't display in UI
          };
          newMessages.push(functionResultsMessage);
        }
        
        return newMessages;
      });
    } catch (error) {
      console.error('❌ Chat error:', error);
      console.error('📊 Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText,
      });
      
      // Add error message
      const errorMsg = {
        role: 'model',
        parts: [{ text: `❌ ${error.response?.data?.message || error.message || 'Failed to get response. Please try again.'}` }],
        timestamp: new Date().toISOString(),
        isError: true,
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearHistory = () => {
    setMessages([]);
    sessionStorage.removeItem(`chat_history_${sessionId}`);
    setShowClearConfirm(false);
  };

  const handleClearClick = () => {
    setShowClearConfirm(true);
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center md:justify-end bg-black/30 animate-fadeIn">
      {/* Chat Container - Full height on mobile since navbar is hidden */}
      <div className="w-full md:w-[400px] h-[85vh] md:h-[600px] flex flex-col md:m-6 bg-white md:rounded-3xl shadow-2xl animate-slideUp md:animate-slideLeft border-t md:border border-gray-200 relative">
        {/* Header - Borneo Theme */}
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white px-6 py-4 rounded-t-3xl relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Clear Chat Button */}
          {messages.length > 0 && (
            <button
              onClick={handleClearClick}
              className="absolute top-4 right-14 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-all"
              title="Hapus riwayat chat"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
          
          <div className="flex items-center gap-3 mb-2">
            <div className="w-20 h-20  flex items-center  text-2xl ">
              <img src="/public/narsisssss.png" alt="Logo" className=" rounded-xl" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Naziri</h2>
              <p className="text-orange-100 text-sm">Warung Borneo Assistant</p>
            </div>
          </div>
          
          {sessionData && (
            <div className="mt-3 p-2  bg-white/10 rounded-lg backdrop-blur-md text-xs">
              <span className="text-white/90">
                {sessionData.customerName} • Meja {sessionData.tableNumber}
              </span>
            </div>
          )}
          {/* Session Info */}
        </div>

        {/* Messages Container - Scrollable with padding for input */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 pb-24">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 mt-12">
              {/* <div className=" mb-3"><img src="\public\oo.png" alt="" /></div> */}
              <p className="text-base font-medium text-gray-800">Halo dari Naziri!</p>
              <p className="text-sm mt-2 text-gray-600">Tanya menu, pesan makanan, atau minta rekomendasi</p>
            </div>
          )}

          {messages.map((msg, idx) => {
            // Skip hidden messages (like function results for history only)
            if (msg.isHidden) return null;
            
            return (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-md'
                    : msg.isError
                    ? 'bg-red-100 text-red-800 border border-red-300'
                    : 'bg-gray-50 text-gray-800 shadow-sm border border-gray-200'
                }`}
              >
                {/* Message Text */}
                <div className="whitespace-pre-wrap break-words">
                  {msg.parts[0]?.text}
                </div>

                {/* Action Notifications */}
                {msg.function_results && msg.function_results.length > 0 && (
                  <div className="mt-2 space-y-1.5">
                    {msg.function_results.map((result, rIdx) => {
                      const isSuccess = result.response.success;
                      const actionName = result.name;
                      
                      let actionIcon = '✓';
                      let actionText = '';
                      let bgColor = 'bg-green-50 border-green-200';
                      let textColor = 'text-green-700';
                      
                      if (!isSuccess) {
                        actionIcon = '✗';
                        bgColor = 'bg-red-50 border-red-200';
                        textColor = 'text-red-700';
                        actionText = result.response.error || result.response.message || 'Action failed';
                      } else {
                        switch(actionName) {
                          case 'add_to_cart':
                            actionIcon = '🛒';
                            actionText = result.response.message || 'Added to cart';
                            break;
                          case 'remove_from_cart':
                          case 'remove_multiple_from_cart':
                            actionIcon = '🗑️';
                            actionText = result.response.message || 'Removed from cart';
                            break;
                          case 'update_cart_item':
                            actionIcon = '✏️';
                            actionText = result.response.message || 'Cart updated';
                            break;
                          case 'checkout':
                            actionIcon = '✅';
                            actionText = `Order: ${result.response.order_number || ''}`;
                            bgColor = 'bg-blue-50 border-blue-200';
                            textColor = 'text-blue-700';
                            break;
                          case 'view_cart':
                            return null;
                          default:
                            actionText = result.response.message || 'Done';
                        }
                      }
                      
                      return actionText ? (
                        <div
                          key={rIdx}
                          className={`px-2.5 py-1.5 border rounded-lg text-xs ${bgColor}`}
                        >
                          <span className={`font-medium ${textColor}`}>
                            {actionIcon} {actionText}
                          </span>
                        </div>
                      ) : null;
                    })}
                  </div>
                )}

                {/* Timestamp */}
                <div
                  className={`text-xs mt-1.5 ${
                    msg.role === 'user' ? 'text-white/80' : 'text-gray-400'
                  }`}
                >
                  {formatTime(msg.timestamp)}
                </div>
              </div>
            </div>
            );
          })}

          {/* Typing Indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-50 rounded-2xl px-4 py-2.5 shadow-sm border border-gray-200">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-orange-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Form - Absolute positioned at bottom */}
        <form onSubmit={sendMessage} className="absolute bottom-10 left-0 right-0 px-4 py-3 bg-white border-t border-gray-200 safe-bottom">
          <div className="flex items-end gap-2">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage(e);
                }
              }}
              placeholder="Ketik pesan..."
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none max-h-24 transition-all bg-white"
              rows="1"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="px-4 py-2 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl font-medium hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md text-lg flex-shrink-0"
            >
              {isLoading ? '⏳' : '🚀'}
            </button>
          </div>
        </form>
      </div>

      {/* Floating Confirmation Dialog */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 animate-fadeIn" onClick={() => setShowClearConfirm(false)}>
          <div className="bg-white rounded-2xl p-6 m-4 max-w-sm shadow-2xl animate-slideUp" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Hapus Riwayat?</h3>
                <p className="text-sm text-gray-600">Tindakan ini tidak dapat dibatalkan</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-medium transition-all"
              >
                Batal
              </button>
              <button
                onClick={clearHistory}
                className="flex-1 px-4 py-3 bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-medium transition-all shadow-md"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .safe-bottom {
          padding-bottom: max(12px, env(safe-area-inset-bottom));
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        
        @keyframes slideLeft {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
        
        .animate-slideLeft {
          animation: slideLeft 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default AIChat;
