"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";

const SITES = [
  {
    id: "psicologia",
    label: "Psicóloga",
    url: "dra-ana-silva.bsph.com.br",
    bg: "#FAFAF9",
    headerBg: "#FFFFFF",
    accentColor: "#7C3AED",
    accentLight: "#EDE9FE",
    textDark: "#1C1917",
    textMid: "#78716C",
    content: (
      <div style={{ fontFamily: "system-ui, sans-serif", color: "#1C1917", background: "#FAFAF9", borderRadius: "0 0 12px 12px", overflow: "hidden" }}>
        {/* Header */}
        <div style={{ background: "#fff", borderBottom: "1px solid #E7E5E4", padding: "10px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "linear-gradient(135deg,#7C3AED,#A78BFA)" }} />
            <span style={{ fontSize: "13px", fontWeight: "700", color: "#1C1917" }}>Dra. Ana Silva</span>
          </div>
          <div style={{ display: "flex", gap: "14px" }}>
            {["Sobre", "Serviços", "Agenda"].map(l => <span key={l} style={{ fontSize: "11px", color: "#78716C" }}>{l}</span>)}
          </div>
        </div>
        {/* Hero */}
        <div style={{ padding: "20px 20px 14px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", alignItems: "center" }}>
          <div>
            <div style={{ display: "inline-block", background: "#EDE9FE", color: "#7C3AED", fontSize: "9px", fontWeight: "700", letterSpacing: "0.12em", textTransform: "uppercase", padding: "3px 8px", borderRadius: "20px", marginBottom: "8px" }}>Psicologia Clínica</div>
            <p style={{ margin: "0 0 6px", fontSize: "16px", fontWeight: "800", lineHeight: "1.3", color: "#1C1917" }}>Cuidado emocional para viver com mais clareza</p>
            <p style={{ margin: "0 0 12px", fontSize: "10px", color: "#78716C", lineHeight: "1.5" }}>Atendimento humanizado para adultos e adolescentes, presencial e online.</p>
            <div style={{ display: "inline-block", background: "linear-gradient(135deg,#7C3AED,#A78BFA)", color: "#fff", fontSize: "10px", fontWeight: "700", padding: "7px 14px", borderRadius: "8px" }}>Agendar consulta</div>
          </div>
          <div style={{ background: "linear-gradient(160deg,#EDE9FE 0%,#DDD6FE 50%,#C4B5FD 100%)", borderRadius: "12px", height: "90px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "linear-gradient(135deg,#7C3AED,#A78BFA)", opacity: 0.5 }} />
          </div>
        </div>
        {/* Services */}
        <div style={{ padding: "0 20px 16px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
          {[["💆", "Terapia Individual"], ["👥", "Terapia de Casal"], ["👨‍👩‍👧", "Orientação Parental"]].map(([icon, name]) => (
            <div key={name} style={{ background: "#fff", border: "1px solid #E7E5E4", borderRadius: "10px", padding: "10px 8px", textAlign: "center" }}>
              <div style={{ fontSize: "16px", marginBottom: "4px" }}>{icon}</div>
              <p style={{ margin: 0, fontSize: "9px", fontWeight: "600", color: "#44403C" }}>{name}</p>
            </div>
          ))}
        </div>
        {/* CTA strip */}
        <div style={{ background: "linear-gradient(135deg,#7C3AED,#A78BFA)", padding: "12px 20px", textAlign: "center" }}>
          <p style={{ margin: 0, fontSize: "11px", fontWeight: "700", color: "#fff" }}>Primeira sessão com 20% de desconto</p>
          <p style={{ margin: "2px 0 0", fontSize: "9px", color: "rgba(255,255,255,0.75)" }}>Vagas limitadas para este mês</p>
        </div>
      </div>
    ),
  },
  {
    id: "restaurante",
    label: "Restaurante",
    url: "brasa-co.bsph.com.br",
    content: (
      <div style={{ fontFamily: "system-ui, sans-serif", background: "#120800", borderRadius: "0 0 12px 12px", overflow: "hidden" }}>
        {/* Header */}
        <div style={{ background: "#1A0D00", borderBottom: "1px solid rgba(245,158,11,0.2)", padding: "10px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <span style={{ fontSize: "14px", fontWeight: "800", color: "#F59E0B", letterSpacing: "-0.3px" }}>Brasa</span>
            <span style={{ fontSize: "14px", fontWeight: "400", color: "#78350F" }}> & Co.</span>
          </div>
          <div style={{ display: "flex", gap: "14px" }}>
            {["Cardápio", "Reservas", "Sobre"].map(l => <span key={l} style={{ fontSize: "11px", color: "rgba(245,158,11,0.6)" }}>{l}</span>)}
          </div>
        </div>
        {/* Hero */}
        <div style={{ background: "linear-gradient(160deg,#1A0D00 0%,#2C1500 60%,#3D1F00 100%)", padding: "18px 20px 14px" }}>
          <div style={{ display: "inline-block", border: "1px solid rgba(245,158,11,0.4)", color: "#F59E0B", fontSize: "9px", fontWeight: "700", letterSpacing: "0.14em", textTransform: "uppercase", padding: "3px 8px", borderRadius: "20px", marginBottom: "8px" }}>Gastronomia Contemporânea</div>
          <p style={{ margin: "0 0 6px", fontSize: "18px", fontWeight: "800", color: "#FEF3C7", lineHeight: "1.2" }}>Sabor que<br/>conta histórias</p>
          <p style={{ margin: "0 0 14px", fontSize: "10px", color: "rgba(254,243,199,0.55)", lineHeight: "1.5" }}>Ingredientes selecionados, brasa real, experiência única desde 2018.</p>
          <div style={{ display: "flex", gap: "8px" }}>
            <div style={{ background: "linear-gradient(135deg,#F59E0B,#D97706)", color: "#1A0D00", fontSize: "10px", fontWeight: "800", padding: "7px 14px", borderRadius: "8px" }}>Reservar mesa</div>
            <div style={{ border: "1px solid rgba(245,158,11,0.4)", color: "#F59E0B", fontSize: "10px", fontWeight: "600", padding: "7px 14px", borderRadius: "8px" }}>Ver cardápio</div>
          </div>
        </div>
        {/* Dishes */}
        <div style={{ padding: "14px 20px 16px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
          {[["🥩", "Picanha na Brasa", "R$ 89"], ["🦐", "Camarão Grelhado", "R$ 74"], ["🍷", "Seleção do Dia", "R$ 52"]].map(([icon, name, price]) => (
            <div key={name} style={{ background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.15)", borderRadius: "10px", padding: "10px 8px", textAlign: "center" }}>
              <div style={{ fontSize: "18px", marginBottom: "4px" }}>{icon}</div>
              <p style={{ margin: "0 0 3px", fontSize: "9px", fontWeight: "600", color: "#FEF3C7" }}>{name}</p>
              <p style={{ margin: 0, fontSize: "9px", color: "#F59E0B", fontWeight: "700" }}>{price}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "personal",
    label: "Personal",
    url: "diego-martins.bsph.com.br",
    content: (
      <div style={{ fontFamily: "system-ui, sans-serif", background: "#050A05", borderRadius: "0 0 12px 12px", overflow: "hidden" }}>
        {/* Header */}
        <div style={{ background: "#080D08", borderBottom: "1px solid rgba(34,197,94,0.2)", padding: "10px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: "13px", fontWeight: "900", color: "#22C55E", letterSpacing: "-0.5px", textTransform: "uppercase" }}>Diego Martins</span>
          <div style={{ display: "flex", gap: "12px" }}>
            {["Programas", "Resultados", "Contato"].map(l => <span key={l} style={{ fontSize: "11px", color: "rgba(34,197,94,0.5)" }}>{l}</span>)}
          </div>
        </div>
        {/* Hero */}
        <div style={{ padding: "18px 20px 14px", display: "grid", gridTemplateColumns: "1fr auto", gap: "14px", alignItems: "center" }}>
          <div>
            <div style={{ display: "inline-block", background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.3)", color: "#22C55E", fontSize: "9px", fontWeight: "700", letterSpacing: "0.12em", textTransform: "uppercase", padding: "3px 8px", borderRadius: "20px", marginBottom: "8px" }}>Personal Trainer Certificado</div>
            <p style={{ margin: "0 0 6px", fontSize: "17px", fontWeight: "900", color: "#F0FDF0", lineHeight: "1.2", textTransform: "uppercase", letterSpacing: "-0.5px" }}>Resultados reais,<br/>sem desculpas</p>
            <p style={{ margin: "0 0 12px", fontSize: "10px", color: "rgba(240,253,240,0.5)", lineHeight: "1.5" }}>Mais de 500 alunos transformados. Método exclusivo de alta performance.</p>
            <div style={{ background: "linear-gradient(135deg,#22C55E,#16A34A)", color: "#fff", fontSize: "10px", fontWeight: "800", padding: "7px 14px", borderRadius: "8px", display: "inline-block" }}>Quero começar agora</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "6px" }}>
            {[["500+", "Alunos"], ["4.9★", "Avaliação"], ["8 anos", "Experiência"]].map(([num, label]) => (
              <div key={label} style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: "8px", padding: "6px 10px", textAlign: "center" }}>
                <p style={{ margin: 0, fontSize: "12px", fontWeight: "800", color: "#22C55E" }}>{num}</p>
                <p style={{ margin: 0, fontSize: "8px", color: "rgba(240,253,240,0.5)" }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
        {/* Programs */}
        <div style={{ padding: "0 20px 16px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
          {[["🏋️", "Musculação & Força", "3x/semana · R$320/mês"], ["🏃", "Emagrecimento Total", "5x/semana · R$420/mês"]].map(([icon, name, sub]) => (
            <div key={name} style={{ background: "rgba(34,197,94,0.05)", border: "1px solid rgba(34,197,94,0.18)", borderRadius: "10px", padding: "12px 10px" }}>
              <div style={{ fontSize: "18px", marginBottom: "5px" }}>{icon}</div>
              <p style={{ margin: "0 0 2px", fontSize: "10px", fontWeight: "700", color: "#F0FDF0" }}>{name}</p>
              <p style={{ margin: 0, fontSize: "9px", color: "rgba(34,197,94,0.7)" }}>{sub}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "advogado",
    label: "Advogado",
    url: "dr-carlos-mendes.bsph.com.br",
    content: (
      <div style={{ fontFamily: "system-ui, sans-serif", background: "#080E1A", borderRadius: "0 0 12px 12px", overflow: "hidden" }}>
        {/* Header */}
        <div style={{ background: "#0B1628", borderBottom: "1px solid rgba(201,168,76,0.2)", padding: "10px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <span style={{ fontSize: "12px", fontWeight: "800", color: "#C9A84C", letterSpacing: "0.05em" }}>DR. CARLOS MENDES</span>
            <span style={{ display: "block", fontSize: "8px", color: "rgba(201,168,76,0.5)", letterSpacing: "0.1em" }}>OAB/SP 123.456 · Advocacia</span>
          </div>
          <div style={{ display: "flex", gap: "14px" }}>
            {["Áreas", "Sobre", "Contato"].map(l => <span key={l} style={{ fontSize: "11px", color: "rgba(201,168,76,0.5)" }}>{l}</span>)}
          </div>
        </div>
        {/* Hero */}
        <div style={{ padding: "18px 20px 14px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", alignItems: "center" }}>
          <div>
            <div style={{ display: "inline-block", border: "1px solid rgba(201,168,76,0.35)", color: "#C9A84C", fontSize: "9px", fontWeight: "700", letterSpacing: "0.12em", textTransform: "uppercase", padding: "3px 8px", borderRadius: "4px", marginBottom: "8px" }}>20 anos de experiência</div>
            <p style={{ margin: "0 0 6px", fontSize: "16px", fontWeight: "800", color: "#F1F5F9", lineHeight: "1.3" }}>Seus direitos,<br/>nossa missão</p>
            <p style={{ margin: "0 0 12px", fontSize: "10px", color: "rgba(241,245,249,0.45)", lineHeight: "1.5" }}>Defesa especializada em Direito Civil, Trabalhista e Empresarial.</p>
            <div style={{ background: "linear-gradient(135deg,#C9A84C,#B8963E)", color: "#080E1A", fontSize: "10px", fontWeight: "800", padding: "7px 14px", borderRadius: "6px", display: "inline-block" }}>Consulta gratuita</div>
          </div>
          <div style={{ background: "linear-gradient(160deg,rgba(201,168,76,0.08),rgba(201,168,76,0.03))", border: "1px solid rgba(201,168,76,0.12)", borderRadius: "10px", height: "90px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: "28px", opacity: 0.5 }}>⚖️</span>
          </div>
        </div>
        {/* Practice areas */}
        <div style={{ padding: "0 20px 16px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
          {[["📄", "Direito Civil"], ["🏢", "Direito Empresarial"], ["👷", "Direito Trabalhista"]].map(([icon, name]) => (
            <div key={name} style={{ background: "rgba(201,168,76,0.05)", border: "1px solid rgba(201,168,76,0.15)", borderRadius: "8px", padding: "10px 8px", textAlign: "center" }}>
              <div style={{ fontSize: "14px", marginBottom: "4px" }}>{icon}</div>
              <p style={{ margin: 0, fontSize: "9px", fontWeight: "600", color: "rgba(241,245,249,0.8)" }}>{name}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
] as const;

export function ProductMockup() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActive((prev) => (prev + 1) % SITES.length), 4000);
    return () => clearInterval(id);
  }, []);

  const site = SITES[active];

  return (
    <div ref={ref} className="relative mt-12">
      <div className="pointer-events-none absolute -left-20 -top-20 h-80 w-80 rounded-full bg-[#7C5CFF]/10 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-[#22D3EE]/10 blur-[100px]" />

      {/* Tab selector */}
      <div className="mb-4 flex justify-center gap-2">
        {SITES.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setActive(i)}
            className={`rounded-full px-3 py-1.5 text-[11px] font-semibold transition-all duration-300 ${
              i === active
                ? "bg-white/15 text-white shadow-[0_0_12px_rgba(255,255,255,0.1)]"
                : "text-[var(--platform-text)]/40 hover:text-[var(--platform-text)]/70"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <motion.div
        style={{ y }}
        className="relative mx-auto max-w-2xl rounded-2xl border border-white/15 bg-[#0A0F1E] p-1 shadow-[0_30px_80px_rgba(0,0,0,0.5),0_0_60px_rgba(59,130,246,0.12)]"
      >
        {/* Browser chrome */}
        <div className="flex items-center gap-2 rounded-t-xl bg-[#0D1325] px-5 py-3">
          <span className="h-3 w-3 rounded-full bg-[#FF5F56]" />
          <span className="h-3 w-3 rounded-full bg-[#FFBD2E]" />
          <span className="h-3 w-3 rounded-full bg-[#27C93F]" />
          <span className="ml-4 flex-1 rounded-lg bg-white/[0.06] px-4 py-1.5 text-xs text-[var(--platform-text)]/40">
            {site.url}
          </span>
        </div>

        {/* Animated site content */}
        <div className="relative overflow-hidden rounded-b-xl" style={{ minHeight: "260px" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={site.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: [0.25, 0.4, 0.25, 1] }}
            >
              {site.content}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Progress dots */}
      <div className="mt-4 flex justify-center gap-2">
        {SITES.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActive(i)}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              i === active ? "w-6 bg-[#22D3EE]" : "w-1.5 bg-white/20"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
