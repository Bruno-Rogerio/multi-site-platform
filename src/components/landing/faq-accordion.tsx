"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

export type FaqItem = {
  question: string;
  answer: string;
};

type FaqAccordionProps = {
  items: FaqItem[];
};

function FaqRow({ item }: { item: FaqItem }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-white/10 last:border-b-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 py-5 text-left text-base font-semibold text-[var(--platform-text)] transition hover:text-[#22D3EE]"
      >
        <span>{item.question}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="shrink-0 text-[var(--platform-text)]/50"
        >
          <ChevronDown size={18} />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-5 pt-1 text-sm leading-relaxed text-[var(--platform-text)]/65">
              {item.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FaqAccordion({ items }: FaqAccordionProps) {
  return (
    <div className="mx-auto mt-12 max-w-3xl rounded-2xl border border-white/10 bg-[#12182B]/60 px-6 md:px-8">
      {items.map((item) => (
        <FaqRow key={item.question} item={item} />
      ))}
    </div>
  );
}
