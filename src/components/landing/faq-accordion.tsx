"use client";

import { useState } from "react";
import { LazyMotion, domAnimation, m, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

export type FaqItem = {
  question: string;
  answer: string;
};

type FaqAccordionProps = {
  items: FaqItem[];
};

function FaqRow({ item, index }: { item: FaqItem; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`border-b border-white/[0.07] last:border-b-0 transition-colors duration-300 ${
        open ? "bg-[linear-gradient(135deg,rgba(59,130,246,0.04),rgba(124,92,255,0.04))]" : ""
      }`}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-start justify-between gap-4 px-6 py-5 text-left"
        aria-expanded={open}
      >
        <div className="flex items-start gap-4">
          {/* Number badge */}
          <span
            className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-black transition-all duration-300"
            style={{
              background: open
                ? "linear-gradient(135deg, #3B82F6, #7C5CFF)"
                : "rgba(255,255,255,0.05)",
              color: open ? "#fff" : "rgba(234,240,255,0.25)",
              boxShadow: open ? "0 0 12px rgba(124,92,255,0.35)" : "none",
            }}
          >
            {String(index + 1).padStart(2, "0")}
          </span>

          {/* Question */}
          <span
            className={`text-sm font-semibold leading-relaxed transition-colors duration-200 ${
              open ? "text-[#EAF0FF]" : "text-[#EAF0FF]/65"
            }`}
          >
            {item.question}
          </span>
        </div>

        {/* Chevron */}
        <LazyMotion features={domAnimation}>
          <m.span
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className={`mt-0.5 shrink-0 transition-colors duration-200 ${
              open ? "text-[#22D3EE]" : "text-[#EAF0FF]/20"
            }`}
          >
            <ChevronDown size={16} />
          </m.span>
        </LazyMotion>
      </button>

      <LazyMotion features={domAnimation}>
        <AnimatePresence initial={false}>
          {open && (
            <m.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-6 pl-16">
                {/* Accent left bar */}
                <div className="relative border-l-2 border-[#3B82F6]/30 pl-4">
                  <p className="text-sm leading-relaxed text-[#EAF0FF]/55">{item.answer}</p>
                </div>
              </div>
            </m.div>
          )}
        </AnimatePresence>
      </LazyMotion>
    </div>
  );
}

export function FaqAccordion({ items }: FaqAccordionProps) {
  return (
    <div className="mx-auto mt-12 max-w-3xl">
      {/* Gradient border wrapper */}
      <div className="rounded-2xl bg-[linear-gradient(135deg,rgba(59,130,246,0.2),rgba(124,92,255,0.15),rgba(34,211,238,0.1))] p-px">
        <div className="overflow-hidden rounded-2xl bg-[#0D1323]">
          {items.map((item, i) => (
            <FaqRow key={item.question} item={item} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
