function ConfirmDialog({ title, message, onConfirm, onCancel, confirmText = 'Ya', cancelText = 'Batal', type = 'danger' }) {
  const colors = {
    danger: 'from-red-500 to-red-600 hover:from-red-600 hover:to-red-700',
    warning: 'from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700',
    success: 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
  };

  const icons = {
    danger: '⚠️',
    warning: '❓',
    success: '✓',
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4 animate-fade-in" onClick={onCancel}>
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full animate-slide-up" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <span className="text-4xl">{icons[type]}</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600 mb-6">{message}</p>
          <div className="flex gap-3">
            <button 
              onClick={onCancel}
              className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-2xl font-medium transition-all"
            >
              {cancelText}
            </button>
            <button 
              onClick={onConfirm}
              className={`flex-1 px-6 py-3 bg-gradient-to-r ${colors[type]} text-white rounded-2xl font-bold transition-all shadow-lg`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
