'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {
  CheckCircleIcon,
  CrossIcon,
  WarningIcon,
  InfoIcon,
} from '@/components/Icons';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: number;
  type: ToastType;
  message: string;
}

interface ToastContextValue {
  notify: (type: ToastType, message: string) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  warning: (message: string) => void;
  info: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const STYLES: Record<
  ToastType,
  { container: string; icon: ReactNode; iconClass: string }
> = {
  success: {
    container:
      'border-green-200 bg-green-50 text-green-900 dark:border-green-800 dark:bg-green-950 dark:text-green-100',
    icon: <CheckCircleIcon className="h-5 w-5" />,
    iconClass: 'text-green-600 dark:text-green-400',
  },
  error: {
    container:
      'border-red-200 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950 dark:text-red-100',
    icon: <CrossIcon className="h-5 w-5" />,
    iconClass: 'text-red-600 dark:text-red-400',
  },
  warning: {
    container:
      'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-100',
    icon: <WarningIcon className="h-5 w-5" />,
    iconClass: 'text-amber-600 dark:text-amber-400',
  },
  info: {
    container:
      'border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-100',
    icon: <InfoIcon className="h-5 w-5" />,
    iconClass: 'text-blue-600 dark:text-blue-400',
  },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idRef = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const notify = useCallback(
    (type: ToastType, message: string) => {
      const id = ++idRef.current;
      setToasts((current) => [...current, { id, type, message }]);
      setTimeout(() => dismiss(id), 6000);
    },
    [dismiss],
  );

  const value = useMemo<ToastContextValue>(
    () => ({
      notify,
      success: (message) => notify('success', message),
      error: (message) => notify('error', message),
      warning: (message) => notify('warning', message),
      info: (message) => notify('info', message),
    }),
    [notify],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[100] flex flex-col items-center gap-2 px-4 sm:bottom-6 sm:right-6 sm:left-auto sm:items-end">
        {toasts.map((toast) => {
          const style = STYLES[toast.type];
          return (
            <div
              key={toast.id}
              role="alert"
              className={`pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border px-4 py-3 shadow-lg ${style.container}`}
            >
              <span className={`mt-0.5 flex-shrink-0 ${style.iconClass}`}>
                {style.icon}
              </span>
              <p className="flex-1 text-sm leading-snug">{toast.message}</p>
              <button
                type="button"
                aria-label="Dismiss notification"
                onClick={() => dismiss(toast.id)}
                className="flex-shrink-0 rounded-md p-1 text-current/70 transition hover:bg-black/5 hover:text-current dark:hover:bg-white/10"
              >
                <CrossIcon className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
