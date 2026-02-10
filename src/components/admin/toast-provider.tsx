"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";

type ToastVariant = "success" | "error" | "info";

type Toast = {
  id: string;
  message: string;
  variant: ToastVariant;
};

type ToastContextValue = {
  toast: (message: string, variant?: ToastVariant) => void;
};

const ToastContext = createContext<ToastContextValue>({
  toast: () => {},
});

export function useToast() {
  return useContext(ToastContext);
}

const TOAST_DURATION = 4000;

const variantStyles: Record<ToastVariant, { border: string; bg: string; text: string; icon: typeof CheckCircle2 }> = {
  success: {
    border: "border-emerald-400/30",
    bg: "bg-emerald-500/10",
    text: "text-emerald-200",
    icon: CheckCircle2,
  },
  error: {
    border: "border-red-400/30",
    bg: "bg-red-500/10",
    text: "text-red-200",
    icon: XCircle,
  },
  info: {
    border: "border-blue-400/30",
    bg: "bg-blue-500/10",
    text: "text-blue-200",
    icon: Info,
  },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (message: string, variant: ToastVariant = "success") => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setToasts((prev) => [...prev, { id, message, variant }]);
      setTimeout(() => removeToast(id), TOAST_DURATION);
    },
    [removeToast],
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}

      {/* Toast stack */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        <AnimatePresence mode="popLayout">
          {toasts.map((t) => {
            const style = variantStyles[t.variant];
            const Icon = style.icon;
            return (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, x: 80, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 80, scale: 0.95 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className={`pointer-events-auto flex items-start gap-3 rounded-xl border ${style.border} ${style.bg} px-4 py-3 shadow-lg backdrop-blur-sm min-w-[280px] max-w-[400px]`}
              >
                <Icon size={18} className={`mt-0.5 shrink-0 ${style.text}`} />
                <p className={`flex-1 text-sm ${style.text}`}>{t.message}</p>
                <button
                  onClick={() => removeToast(t.id)}
                  className={`shrink-0 mt-0.5 ${style.text} opacity-60 hover:opacity-100 transition`}
                >
                  <X size={14} />
                </button>

                {/* Progress bar */}
                <motion.div
                  className={`absolute bottom-0 left-0 h-0.5 ${style.text.replace("text-", "bg-")} opacity-30 rounded-b-xl`}
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{ duration: TOAST_DURATION / 1000, ease: "linear" }}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
