"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, X } from "lucide-react";

interface WizardTipProps {
  id: string;
  message: string;
  /** Delay in ms before showing. Default: 1600 */
  delay?: number;
  /** Auto-dismiss duration in ms. Default: 7000 */
  duration?: number;
}

const STORAGE_KEY = (id: string) => `wizard_tip_v2_shown_${id}`;

export function WizardTip({ id, message, delay = 1600, duration = 7000 }: WizardTipProps) {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (sessionStorage.getItem(STORAGE_KEY(id))) return;

    const t = setTimeout(() => {
      setVisible(true);
      sessionStorage.setItem(STORAGE_KEY(id), "1");
    }, delay);

    return () => clearTimeout(t);
  }, [id, delay, mounted]);

  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(t);
  }, [visible, duration]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.93 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 340, damping: 28 }}
          className="fixed z-[200] overflow-hidden rounded-2xl border border-[#22D3EE]/20 bg-[#0B1525]/95 shadow-2xl backdrop-blur-md"
          style={{
            bottom: "24px",
            left: "50%",
            transform: "translateX(-50%)",
            maxWidth: "320px",
            width: "calc(100vw - 32px)",
            boxShadow: "0 0 0 1px rgba(34,211,238,0.12), 0 8px 32px rgba(0,0,0,0.5), 0 0 20px rgba(34,211,238,0.08)",
          }}
        >
          <div className="flex items-start gap-3 px-4 py-3.5">
            {/* Icon */}
            <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#22D3EE]/15 ring-1 ring-[#22D3EE]/20">
              <Lightbulb size={12} className="text-[#22D3EE]" />
            </div>

            {/* Text */}
            <p className="flex-1 text-[12px] leading-relaxed text-[#EAF0FF]/80">
              {message}
            </p>

            {/* Dismiss */}
            <button
              onClick={() => setVisible(false)}
              className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[#EAF0FF]/30 transition hover:bg-white/10 hover:text-[#EAF0FF]/70"
              aria-label="Fechar dica"
            >
              <X size={11} />
            </button>
          </div>

          {/* Progress bar */}
          <motion.div
            className="h-[2px] origin-left"
            style={{ background: "linear-gradient(90deg, #22D3EE, #7C5CFF)" }}
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            transition={{ duration: duration / 1000, ease: "linear" }}
          />
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
