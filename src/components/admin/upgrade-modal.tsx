"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  Sparkles,
  Palette,
  Type,
  MousePointer,
  Layout,
  Minus,
  Droplets,
} from "lucide-react";

const FEATURES = [
  { icon: Palette, text: "13 paletas de cores e temas prontos" },
  { icon: Type, text: "7+ fontes profissionais com preview em tempo real" },
  { icon: Droplets, text: "Cores individuais: primária, destaque, fundo, texto" },
  { icon: MousePointer, text: "Estilo de botões: arredondado, pílula, quadrado" },
  { icon: Layout, text: "Header: vidro desfocado, sólido ou minimalista" },
  { icon: Minus, text: "Separadores entre seções com 5 estilos diferentes" },
];

type UpgradeModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function UpgradeModal({ isOpen, onClose }: UpgradeModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
          />

          {/* Modal wrapper — centers the card */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.90, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.93, y: 12 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#0d1426] shadow-[0_0_100px_rgba(124,92,255,0.35)]"
            >
              {/* Gradient top-border line */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-[#3B82F6] via-[#7C5CFF] to-[#22D3EE]" />

              {/* Ambient glow blobs */}
              <div
                className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full opacity-20"
                style={{ background: "radial-gradient(circle, #7C5CFF, transparent 70%)" }}
              />
              <div
                className="pointer-events-none absolute -bottom-12 -right-12 h-40 w-40 rounded-full opacity-15"
                style={{ background: "radial-gradient(circle, #22D3EE, transparent 70%)" }}
              />

              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-white/40 transition hover:bg-white/10 hover:text-white/80"
                aria-label="Fechar"
              >
                <X size={15} />
              </button>

              {/* Content */}
              <div className="px-8 pb-8 pt-10">
                {/* Badge */}
                <div className="mb-5 flex justify-center">
                  <span className="flex items-center gap-1.5 rounded-full border border-[#7C5CFF]/40 bg-gradient-to-r from-[#3B82F6]/15 to-[#7C5CFF]/15 px-4 py-1 text-[11px] font-bold uppercase tracking-[0.15em] text-[#a78bfa]">
                    <Sparkles size={10} />
                    Plano Premium
                  </span>
                </div>

                {/* Icon */}
                <div className="mb-4 flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#3B82F6] via-[#7C5CFF] to-[#22D3EE] shadow-[0_0_36px_rgba(124,92,255,0.50)]">
                    <Palette size={28} className="text-white" />
                  </div>
                </div>

                {/* Title */}
                <h2 className="text-center text-[22px] font-extrabold tracking-tight text-white">
                  Personalização total
                </h2>
                <p className="mt-2 text-center text-sm text-white/45">
                  Controle cada detalhe visual do seu site com o plano Premium.
                </p>

                {/* Feature list */}
                <ul className="mt-6 space-y-2.5">
                  {FEATURES.map(({ icon: Icon, text }) => (
                    <li key={text} className="flex items-center gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#7C5CFF]/25 bg-gradient-to-br from-[#3B82F6]/15 to-[#7C5CFF]/15">
                        <Icon size={11} className="text-[#a78bfa]" />
                      </span>
                      <span className="text-sm text-white/65">{text}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <div className="mt-8 flex flex-col gap-2.5">
                  <a
                    href="https://wa.me/5511999999999?text=Ol%C3%A1%2C+gostaria+de+fazer+upgrade+do+meu+plano+na+BuildSphere"
                    target="_blank"
                    rel="noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#3B82F6] via-[#7C5CFF] to-[#22D3EE] py-3.5 text-sm font-bold text-white shadow-[0_6px_28px_rgba(124,92,255,0.40)] transition hover:brightness-110 active:scale-[0.98]"
                  >
                    <Sparkles size={14} />
                    Fazer upgrade agora
                  </a>
                  <button
                    onClick={onClose}
                    className="w-full py-2 text-sm text-white/25 transition hover:text-white/55"
                  >
                    Agora não
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
