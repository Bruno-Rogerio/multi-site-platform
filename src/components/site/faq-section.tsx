"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

type FaqItem = {
  question: string;
  answer: string;
};

type FaqSectionProps = {
  title?: string;
  subtitle?: string;
  items?: FaqItem[];
  variant?: string;
};

export function FaqSection({ title = "Perguntas frequentes", subtitle, items = [], variant = "accordion" }: FaqSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (items.length === 0) return null;

  // ── NUMBERED ──
  if (variant === "numbered") {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="mb-10 text-center">
            {title && <h2 className="text-3xl font-black" style={{ color: "var(--site-text)" }}>{title}</h2>}
            {subtitle && <p className="mt-3 text-base leading-relaxed" style={{ color: "var(--site-text)", opacity: 0.6 }}>{subtitle}</p>}
          </div>
          <div className="space-y-6">
            {items.map((item, i) => {
              const isOpen = openIndex === i;
              return (
                <div key={i} className="flex gap-5">
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-xl font-black text-white"
                    style={{ backgroundColor: "var(--site-primary)" }}
                  >
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <button
                      onClick={() => setOpenIndex(isOpen ? null : i)}
                      className="flex w-full items-start justify-between gap-3 text-left"
                    >
                      <span className="font-bold leading-snug text-base" style={{ color: "var(--site-text)" }}>
                        {item.question}
                      </span>
                      <ChevronDown
                        size={18}
                        className="mt-0.5 shrink-0 transition-transform duration-300"
                        style={{
                          color: "var(--site-primary)",
                          transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                        }}
                      />
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          key="answer"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                        >
                          <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--site-text)", opacity: 0.7 }}>
                            {item.answer}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  // ── TWO-COL ──
  if (variant === "two-col") {
    const half = Math.ceil(items.length / 2);
    const col1 = items.slice(0, half);
    const col2 = items.slice(half);
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 text-center">
            {title && <h2 className="text-3xl font-black" style={{ color: "var(--site-text)" }}>{title}</h2>}
            {subtitle && <p className="mt-3 text-base leading-relaxed" style={{ color: "var(--site-text)", opacity: 0.6 }}>{subtitle}</p>}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[col1, col2].map((col, colIdx) => (
              <div key={colIdx} className="space-y-3">
                {col.map((item, i) => {
                  const globalIdx = colIdx === 0 ? i : half + i;
                  const isOpen = openIndex === globalIdx;
                  return (
                    <div
                      key={i}
                      className="overflow-hidden rounded-xl border transition-all"
                      style={{
                        borderColor: isOpen
                          ? "color-mix(in srgb, var(--site-primary) 40%, transparent)"
                          : "color-mix(in srgb, var(--site-text) 12%, transparent)",
                        backgroundColor: isOpen
                          ? "color-mix(in srgb, var(--site-primary) 6%, transparent)"
                          : "color-mix(in srgb, var(--site-text) 3%, transparent)",
                      }}
                    >
                      <button
                        onClick={() => setOpenIndex(isOpen ? null : globalIdx)}
                        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                      >
                        <span className="font-semibold leading-snug text-sm" style={{ color: isOpen ? "var(--site-primary)" : "var(--site-text)" }}>
                          {item.question}
                        </span>
                        <ChevronDown
                          size={16}
                          className="shrink-0 transition-transform duration-300"
                          style={{
                            color: isOpen ? "var(--site-primary)" : "var(--site-text)",
                            opacity: isOpen ? 1 : 0.5,
                            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                          }}
                        />
                      </button>
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            key="answer"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: "easeInOut" }}
                          >
                            <div className="px-5 pb-5 text-sm leading-relaxed" style={{ color: "var(--site-text)", opacity: 0.75 }}>
                              {item.answer}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // ── ACCORDION (default) ──
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10 text-center">
          {title && <h2 className="text-3xl font-black" style={{ color: "var(--site-text)" }}>{title}</h2>}
          {subtitle && <p className="mt-3 text-base leading-relaxed" style={{ color: "var(--site-text)", opacity: 0.6 }}>{subtitle}</p>}
        </div>
        <div className="space-y-3">
          {items.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className="overflow-hidden rounded-xl border transition-all"
                style={{
                  borderColor: isOpen
                    ? "color-mix(in srgb, var(--site-primary) 40%, transparent)"
                    : "color-mix(in srgb, var(--site-text) 12%, transparent)",
                  backgroundColor: isOpen
                    ? "color-mix(in srgb, var(--site-primary) 6%, transparent)"
                    : "color-mix(in srgb, var(--site-text) 3%, transparent)",
                }}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="font-semibold leading-snug" style={{ color: isOpen ? "var(--site-primary)" : "var(--site-text)", fontSize: "0.9375rem" }}>
                    {item.question}
                  </span>
                  <ChevronDown
                    size={18}
                    className="shrink-0 transition-transform duration-300"
                    style={{
                      color: isOpen ? "var(--site-primary)" : "var(--site-text)",
                      opacity: isOpen ? 1 : 0.5,
                      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="answer"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <div className="px-5 pb-5 text-sm leading-relaxed" style={{ color: "var(--site-text)", opacity: 0.75 }}>
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
