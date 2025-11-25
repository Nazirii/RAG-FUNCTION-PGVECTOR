import { useEffect } from 'react';

function Toast({ message, type = 'success', onClose, duration = 3000 }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const colors = {
    success: 'from-green-500 to-green-600',
    error: 'from-red-500 to-red-600',
    info: 'from-blue-500 to-blue-600',
  };

  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
  };

  return (
    <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-2xl shadow-2xl z-50 flex items-center gap-3 animate-slide-up max-w-md">
      <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${colors[type]} flex items-center justify-center flex-shrink-0`}>
        <span className="text-xl font-bold">{icons[type]}</span>
      </div>
      <div className="flex-1">
        <p className="text-sm leading-relaxed">{message}</p>
      </div>
      <button 
        onClick={onClose}
        className="text-gray-400 hover:text-white transition-colors"
      >
        ✕
      </button>
    </div>
  );
}

export default Toast;
