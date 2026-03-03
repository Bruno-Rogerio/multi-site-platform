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
};

export function FaqSection({ title = "Perguntas frequentes", subtitle, items = [] }: FaqSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (items.length === 0) return null;

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-10 text-center">
          <h2
            className="text-3xl font-black"
            style={{ color: "var(--site-text)" }}
          >
            {title}
          </h2>
          {subtitle && (
            <p
              className="mt-3 text-base leading-relaxed"
              style={{ color: "var(--site-text)", opacity: 0.6 }}
            >
              {subtitle}
            </p>
          )}
        </div>

        {/* Accordion */}
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
                  <span
                    className="font-semibold leading-snug"
                    style={{
                      color: isOpen ? "var(--site-primary)" : "var(--site-text)",
                      fontSize: "0.9375rem",
                    }}
                  >
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
                      <div
                        className="px-5 pb-5 text-sm leading-relaxed"
                        style={{ color: "var(--site-text)", opacity: 0.75 }}
                      >
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
