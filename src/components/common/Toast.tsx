import { useEffect, useState } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

let toastListeners: ((toast: ToastMessage) => void)[] = [];

export const toast = {
  success: (message: string, duration = 3000) => {
    showToast({ type: 'success', message, duration });
  },
  error: (message: string, duration = 5000) => {
    showToast({ type: 'error', message, duration });
  },
  info: (message: string, duration = 3000) => {
    showToast({ type: 'info', message, duration });
  },
  warning: (message: string, duration = 4000) => {
    showToast({ type: 'warning', message, duration });
  },
};

function showToast({ type, message, duration = 3000 }: Omit<ToastMessage, 'id'>) {
  const id = Math.random().toString(36).substring(7);
  const toastMessage: ToastMessage = { id, type, message, duration };
  toastListeners.forEach((listener) => listener(toastMessage));
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const listener = (toast: ToastMessage) => {
      setToasts((prev) => [...prev, toast]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id));
      }, toast.duration);
    };

    toastListeners.push(listener);

    return () => {
      toastListeners = toastListeners.filter((l) => l !== listener);
    };
  }, []);

  const getToastStyles = (type: ToastType) => {
    switch (type) {
      case 'success':
        return 'bg-green-500 text-white';
      case 'error':
        return 'bg-red-500 text-white';
      case 'warning':
        return 'bg-yellow-500 text-yellow-900';
      case 'info':
        return 'bg-blue-500 text-white';
    }
  };

  const getToastIcon = (type: ToastType) => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
        return 'ℹ';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`${getToastStyles(toast.type)} p-4 rounded-lg shadow-lg flex items-center gap-3 animate-in slide-in-from-right pointer-events-auto`}
        >
          <span className="text-xl">{getToastIcon(toast.type)}</span>
          <span className="flex-1 text-sm font-medium">{toast.message}</span>
        </div>
      ))}
    </div>
  );
}
