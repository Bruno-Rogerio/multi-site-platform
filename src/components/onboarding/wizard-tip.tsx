"use client";

import { useState, useEffect } from "react";
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

const STORAGE_KEY = (id: string) => `wizard_tip_shown_${id}`;

export function WizardTip({ id, message, delay = 1600, duration = 7000 }: WizardTipProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof sessionStorage !== "undefined" && sessionStorage.getItem(STORAGE_KEY(id))) return;

    const showTimer = setTimeout(() => {
      setVisible(true);
      if (typeof sessionStorage !== "undefined") {
        sessionStorage.setItem(STORAGE_KEY(id), "1");
      }
    }, delay);

    return () => clearTimeout(showTimer);
  }, [id, delay]);

  useEffect(() => {
    if (!visible) return;
    const dismissTimer = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(dismissTimer);
  }, [visible, duration]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
          className="fixed bottom-6 left-4 z-40 max-w-[260px] overflow-hidden rounded-xl border border-white/10 bg-[#0E1628]/95 shadow-xl backdrop-blur-sm md:left-6"
        >
          <div className="flex items-start gap-2.5 px-3.5 py-3">
            <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#22D3EE]/15">
              <Lightbulb size={11} className="text-[#22D3EE]" />
            </div>
            <p className="flex-1 text-[11px] leading-relaxed text-[var(--platform-text)]/80">
              {message}
            </p>
            <button
              onClick={() => setVisible(false)}
              className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[var(--platform-text)]/30 transition hover:text-[var(--platform-text)]/70"
            >
              <X size={10} />
            </button>
          </div>

          {/* Progress bar */}
          <motion.div
            className="h-[2px] origin-left bg-[#22D3EE]/50"
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            transition={{ duration: duration / 1000, ease: "linear" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
