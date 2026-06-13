import Modal from './Modal';
import { AlertTriangle, Trash2, CheckCircle2 } from 'lucide-react';

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Aceptar',
  cancelText = 'Cancelar',
  type = 'danger'
}) {
  const iconMap = {
    danger: {
      icon: <Trash2 size={22} className="text-red-500" />,
      bg: 'bg-red-50 border-red-100',
      btn: 'bg-red-500 hover:bg-red-600 focus:ring-red-400'
    },
    warning: {
      icon: <AlertTriangle size={22} className="text-amber-500" />,
      bg: 'bg-amber-50 border-amber-100',
      btn: 'bg-amber-500 hover:bg-amber-600 focus:ring-amber-400'
    },
    info: {
      icon: <CheckCircle2 size={22} className="text-pink-500" />,
      bg: 'bg-pink-50 border-pink-100',
      btn: 'bg-pink-500 hover:bg-pink-600 focus:ring-pink-400'
    }
  };

  const currentType = iconMap[type] || iconMap.danger;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="flex flex-col items-center text-center space-y-4 py-2">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${currentType.bg} shadow-md`}>
          {currentType.icon}
        </div>
        <div className="text-gray-600 text-sm leading-relaxed max-w-xs px-2 whitespace-pre-line">
          {message}
        </div>
        <div className="flex gap-3 w-full pt-4 border-t border-rose-50">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-rose-100 text-gray-500 hover:bg-rose-50 text-sm font-medium transition-all"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`flex-1 px-4 py-2.5 rounded-xl text-white text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all ${currentType.btn}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}
