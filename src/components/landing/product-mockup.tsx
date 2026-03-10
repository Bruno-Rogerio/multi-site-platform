"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

// Total display time per site (ms): ~7% fade-in, ~81% scroll, ~12% fade-out
const DURATION_MS = 9000;
// Pixels scrolled within the frame per site
const SCROLL_PX = 370;
// Visible frame height
const FRAME_H = 292;
// Full content height per site
const CONTENT_H = FRAME_H + SCROLL_PX;

// ─── Shared minimal helpers ───────────────────────────────────────────────────

function MiniFooter({ bg, left, right, lightText }: { bg: string; left: string; right: string; lightText?: boolean }) {
  const c = lightText ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.3)";
  return (
    <div style={{ background: bg, padding: "10px 18px", display: "flex", justifyContent: "space-between" }}>
      <p style={{ margin: 0, fontSize: "8px", color: c }}>{left}</p>
      <p style={{ margin: 0, fontSize: "8px", color: c, opacity: 0.7 }}>{right}</p>
    </div>
  );
}

// ─── Site content definitions ─────────────────────────────────────────────────

type Site = { id: string; label: string; url: string; content: React.ReactNode };

const SITES: Site[] = [
  // ── Psicóloga — tema claro, header minimal centrado, botões pill, cards com ícone em círculo ──
  {
    id: "psicologa",
    label: "Psicóloga",
    url: "dra-ana-silva.bsph.com.br",
    content: (
      <div style={{ fontFamily: "system-ui, sans-serif", background: "#FAFAF9", minHeight: `${CONTENT_H}px` }}>
        {/* Header: minimal — nome centrado, nav abaixo */}
        <div style={{ background: "#ffffffee", borderBottom: "1px solid rgba(124,58,237,0.1)", padding: "10px 18px 8px", textAlign: "center" }}>
          <p style={{ margin: "0 0 6px", fontSize: "13px", fontWeight: "800", color: "#1C1917" }}>Dra. Ana Silva</p>
          <div style={{ display: "flex", justifyContent: "center", gap: "14px" }}>
            {["Serviços", "Sobre", "Depoimentos", "Contato"].map(l => (
              <span key={l} style={{ fontSize: "8px", color: "rgba(28,25,23,0.5)" }}>{l}</span>
            ))}
          </div>
        </div>
        {/* Hero: centralizado */}
        <div style={{ padding: "20px 18px 16px", background: "linear-gradient(180deg,#FAFAF9,#F5F0FF)", textAlign: "center" }}>
          <span style={{ display: "inline-block", background: "#EDE9FE", color: "#7C3AED", fontSize: "7px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", padding: "3px 10px", borderRadius: "999px", marginBottom: "9px" }}>Psicologia Clínica · CRP 06/123456</span>
          <p style={{ margin: "0 0 8px", fontSize: "17px", fontWeight: "900", color: "#1C1917", lineHeight: "1.2", letterSpacing: "-0.5px" }}>Cuidado emocional<br />para uma vida plena</p>
          <p style={{ margin: "0 0 14px", fontSize: "9px", color: "#78716C", lineHeight: "1.65" }}>Atendimento humanizado para adultos e adolescentes. Presencial em São Paulo e online para todo o Brasil.</p>
          <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
            <span style={{ background: "linear-gradient(135deg,#7C3AED,#A78BFA)", color: "#fff", fontSize: "9px", fontWeight: "700", padding: "6px 14px", borderRadius: "999px", boxShadow: "0 4px 12px rgba(124,58,237,0.35)" }}>Agendar consulta</span>
            <span style={{ border: "1.5px solid rgba(124,58,237,0.2)", color: "#7C3AED", fontSize: "9px", padding: "6px 14px", borderRadius: "999px" }}>Saiba mais</span>
          </div>
        </div>
        {/* Stats: centralizados com separadores */}
        <div style={{ display: "flex", borderTop: "1px solid rgba(124,58,237,0.1)", borderBottom: "1px solid rgba(124,58,237,0.1)", background: "#fff" }}>
          {[["12+", "Anos exp."], ["800+", "Pacientes"], ["4.9★", "Avaliação"]].map(([n, l], i) => (
            <div key={l} style={{ flex: 1, textAlign: "center", padding: "10px 4px", borderLeft: i > 0 ? "1px solid rgba(124,58,237,0.08)" : "none" }}>
              <p style={{ margin: 0, fontSize: "13px", fontWeight: "900", color: "#7C3AED" }}>{n}</p>
              <p style={{ margin: 0, fontSize: "7px", color: "rgba(28,25,23,0.5)" }}>{l}</p>
            </div>
          ))}
        </div>
        {/* Serviços: cards centrados com ícone em círculo colorido */}
        <div style={{ padding: "14px 18px" }}>
          <p style={{ margin: "0 0 10px", fontSize: "8px", fontWeight: "700", letterSpacing: "0.15em", textTransform: "uppercase", color: "#7C3AED", textAlign: "center" }}>Serviços</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
            {[["🧠","#EDE9FE","Terapia Individual","Autoconhecimento e saúde emocional"],["💑","#F3E8FF","Terapia de Casal","Comunicação e vínculos"],["👨‍👩‍👧","#EDE9FE","Orient. Parental","Suporte para pais"]].map(([icon, circleBg, name, desc]) => (
              <div key={name as string} style={{ background: "#fff", border: "1px solid rgba(124,58,237,0.1)", borderRadius: "14px", padding: "12px 8px", textAlign: "center", boxShadow: "0 2px 8px rgba(124,58,237,0.05)" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: circleBg as string, fontSize: "14px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 7px" }}>{icon}</div>
                <p style={{ margin: "0 0 3px", fontSize: "8px", fontWeight: "700", color: "#1C1917" }}>{name as string}</p>
                <p style={{ margin: 0, fontSize: "7px", color: "rgba(28,25,23,0.55)", lineHeight: "1.4" }}>{desc as string}</p>
              </div>
            ))}
          </div>
        </div>
        {/* Sobre */}
        <div style={{ padding: "12px 18px 14px", background: "#F5F0FF", borderTop: "1px solid #EDE9FE", textAlign: "center" }}>
          <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "linear-gradient(135deg,#7C3AED,#A78BFA)", margin: "0 auto 8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px" }}>👩‍⚕️</div>
          <p style={{ margin: "0 0 5px", fontSize: "8px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", color: "#7C3AED" }}>Sobre a profissional</p>
          <p style={{ margin: 0, fontSize: "8px", color: "#78716C", lineHeight: "1.6" }}>Formada pela USP com especialização em TCC e Mindfulness. 12 anos acompanhando adultos, adolescentes e casais.</p>
        </div>
        {/* Depoimento: aspas decorativas + avatar com inicial */}
        <div style={{ padding: "12px 18px", background: "#fff", borderTop: "1px solid #F0EBF8", position: "relative" }}>
          <span style={{ position: "absolute", top: "8px", left: "18px", fontSize: "40px", color: "#7C3AED", opacity: 0.08, lineHeight: 1, fontFamily: "Georgia,serif", pointerEvents: "none" }}>&ldquo;</span>
          <p style={{ margin: "0 0 8px", fontSize: "8px", color: "#44403C", lineHeight: "1.65", fontStyle: "italic", paddingTop: "4px" }}>&ldquo;A Dra. Ana transformou minha relação comigo mesma. Seis meses e sou outra pessoa.&rdquo;</p>
          <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
            <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "linear-gradient(135deg,#7C3AED,#A78BFA)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "9px", fontWeight: "700", flexShrink: 0 }}>M</div>
            <p style={{ margin: 0, fontSize: "8px", fontWeight: "700", color: "#7C3AED" }}>Mariana L. — paciente há 1 ano</p>
          </div>
        </div>
        {/* CTA */}
        <div style={{ background: "linear-gradient(135deg,#7C3AED,#A78BFA)", padding: "16px 18px", textAlign: "center" }}>
          <p style={{ margin: "0 0 3px", fontSize: "11px", fontWeight: "800", color: "#fff" }}>Pronta para o próximo passo?</p>
          <p style={{ margin: "0 0 10px", fontSize: "8px", color: "rgba(255,255,255,0.7)" }}>Agende sua primeira consulta</p>
          <span style={{ background: "#fff", color: "#7C3AED", fontSize: "9px", fontWeight: "700", padding: "6px 16px", borderRadius: "999px", display: "inline-block" }}>Falar no WhatsApp</span>
        </div>
        <MiniFooter bg="#1C1917" left="Dra. Ana Silva · CRP 06/123456" right="Powered by BuildSphere" lightText />
      </div>
    ),
  },

  // ── Restaurante — hero centrado com headline fina/itálica, cardápio 2-col, depoimento com linha vertical ──
  {
    id: "restaurante",
    label: "Restaurante",
    url: "brasa-co.bsph.com.br",
    content: (
      <div style={{ fontFamily: "system-ui, sans-serif", background: "#0A0500", minHeight: `${CONTENT_H}px` }}>
        {/* Header: logo + tagline + botão "Reservar" no nav */}
        <div style={{ background: "rgba(10,5,0,0.96)", borderBottom: "1px solid rgba(245,158,11,0.14)", padding: "10px 18px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <p style={{ margin: 0, fontSize: "13px", fontWeight: "900", lineHeight: 1.1 }}>
              <span style={{ color: "#F59E0B" }}>Brasa</span>
              <span style={{ color: "rgba(245,158,11,0.35)", fontWeight: "300" }}> & Co.</span>
            </p>
            <p style={{ margin: "2px 0 0", fontSize: "7px", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(245,158,11,0.38)" }}>Gastronomia · Desde 2018</p>
          </div>
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            {["Cardápio", "Nossa história", "Horários"].map(l => (
              <span key={l} style={{ fontSize: "8px", color: "rgba(254,243,199,0.45)" }}>{l}</span>
            ))}
            <span style={{ background: "#D97706", color: "#1A0D00", fontSize: "8px", fontWeight: "800", padding: "4px 9px", borderRadius: "4px" }}>Reservar</span>
          </div>
        </div>
        {/* Hero: centralizado, headline fina + itálico */}
        <div style={{ padding: "22px 18px 18px", background: "linear-gradient(180deg,#150A00,#0A0500)", textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "10px" }}>
            <span style={{ width: "20px", height: "1px", background: "rgba(245,158,11,0.4)", display: "inline-block" }} />
            <span style={{ fontSize: "7px", fontWeight: "600", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(254,243,199,0.45)" }}>Pinheiros · São Paulo</span>
            <span style={{ width: "20px", height: "1px", background: "rgba(245,158,11,0.4)", display: "inline-block" }} />
          </div>
          <p style={{ margin: "0 0 8px", fontSize: "20px", fontWeight: "300", color: "#FEF3C7", lineHeight: "1.15", letterSpacing: "0.01em" }}>
            Sabor que<br />
            <em style={{ fontStyle: "italic", fontWeight: "700", color: "#F59E0B" }}>conta histórias</em>
          </p>
          <p style={{ margin: "0 0 14px", fontSize: "9px", color: "rgba(254,243,199,0.48)", lineHeight: "1.65" }}>Ingredientes selecionados, brasa real e uma experiência gastronômica que vai além do prato.</p>
          <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
            <span style={{ background: "linear-gradient(135deg,#F59E0B,#D97706)", color: "#1A0D00", fontSize: "9px", fontWeight: "800", padding: "6px 13px", borderRadius: "5px" }}>Reservar mesa</span>
            <span style={{ border: "1px solid rgba(245,158,11,0.3)", color: "#F59E0B", fontSize: "9px", padding: "6px 13px", borderRadius: "5px" }}>Ver cardápio</span>
          </div>
        </div>
        {/* Stats: label acima do número */}
        <div style={{ display: "flex", borderTop: "1px solid rgba(245,158,11,0.12)", borderBottom: "1px solid rgba(245,158,11,0.12)", background: "rgba(245,158,11,0.04)" }}>
          {[["6 anos","de história"],["4.8★","no Google"],["Pinheiros","São Paulo"]].map(([n, l], i) => (
            <div key={l} style={{ flex: 1, textAlign: "center", padding: "10px 4px", borderLeft: i > 0 ? "1px solid rgba(245,158,11,0.1)" : "none" }}>
              <p style={{ margin: "0 0 2px", fontSize: "7px", fontWeight: "600", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(254,243,199,0.4)" }}>{l}</p>
              <p style={{ margin: 0, fontSize: "12px", fontWeight: "700", color: "#F59E0B" }}>{n}</p>
            </div>
          ))}
        </div>
        {/* Cardápio: 2 colunas com ícone lateral + tag */}
        <div style={{ padding: "13px 18px" }}>
          <p style={{ margin: "0 0 9px", fontSize: "8px", fontWeight: "700", letterSpacing: "0.15em", textTransform: "uppercase", color: "#F59E0B" }}>Cardápio</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "7px" }}>
            {([["🥩","Carnes & Brasa","Carro-chefe","Cortes nobres na brasa com ervas"],["🦐","Frutos do Mar","Especialidade","Camarões e peixes frescos"],["🥗","Entradas","","Saladas e combinações leves"],["🍮","Sobremesas","","Doces artesanais da casa"]] as [string,string,string,string][]).map(([icon, name, tag, desc]) => (
              <div key={name} style={{ background: "rgba(245,158,11,0.04)", border: "1px solid rgba(245,158,11,0.12)", borderRadius: "9px", padding: "9px 10px", display: "flex", gap: "9px", alignItems: "flex-start" }}>
                <span style={{ fontSize: "16px", flexShrink: 0 }}>{icon}</span>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "3px" }}>
                    <p style={{ margin: 0, fontSize: "8px", fontWeight: "700", color: "#FEF3C7" }}>{name}</p>
                    {tag && <span style={{ fontSize: "6px", fontWeight: "700", color: "#1A0D00", background: "#F59E0B", padding: "1px 5px", borderRadius: "3px" }}>{tag}</span>}
                  </div>
                  <p style={{ margin: 0, fontSize: "7px", color: "rgba(254,243,199,0.45)", lineHeight: "1.4" }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Sobre */}
        <div style={{ padding: "11px 18px 12px", background: "rgba(245,158,11,0.04)", borderTop: "1px solid rgba(245,158,11,0.1)", textAlign: "center" }}>
          <p style={{ margin: "0 0 5px", fontSize: "8px", fontWeight: "700", letterSpacing: "0.12em", textTransform: "uppercase", color: "#F59E0B" }}>Nossa história</p>
          <p style={{ margin: 0, fontSize: "8px", color: "rgba(254,243,199,0.48)", lineHeight: "1.6" }}>Fundado em 2018 em Pinheiros, o Brasa & Co. nasceu do amor pela gastronomia artesanal com ingredientes locais e sazonais.</p>
        </div>
        {/* Depoimento: linha vertical dourada */}
        <div style={{ padding: "11px 18px", borderTop: "1px solid rgba(245,158,11,0.08)", display: "flex", gap: "10px" }}>
          <div style={{ width: "3px", background: "linear-gradient(180deg,#F59E0B,#D97706)", borderRadius: "3px", flexShrink: 0 }} />
          <div>
            <p style={{ margin: "0 0 6px", fontSize: "8px", color: "rgba(254,243,199,0.6)", lineHeight: "1.65", fontStyle: "italic" }}>&ldquo;Uma experiência incrível. Ambiente aconchegante e comida de altíssima qualidade.&rdquo;</p>
            <p style={{ margin: 0, fontSize: "8px", fontWeight: "700", color: "#F59E0B" }}>Patricia A. — cliente frequente</p>
          </div>
        </div>
        {/* CTA */}
        <div style={{ background: "linear-gradient(135deg,#F59E0B,#D97706)", padding: "16px 18px", textAlign: "center" }}>
          <p style={{ margin: "0 0 3px", fontSize: "11px", fontWeight: "800", color: "#1A0D00" }}>Reserve sua mesa agora</p>
          <p style={{ margin: "0 0 10px", fontSize: "8px", color: "rgba(26,13,0,0.58)" }}>Disponível para almoço e jantar</p>
          <span style={{ background: "#1A0D00", color: "#F59E0B", fontSize: "9px", fontWeight: "700", padding: "6px 14px", borderRadius: "5px", display: "inline-block" }}>Reservar pelo WhatsApp</span>
        </div>
        <MiniFooter bg="#060300" left="Brasa & Co. · Pinheiros · SP" right="Powered by BuildSphere" lightText />
      </div>
    ),
  },

  // ── Personal Trainer — header sólido, hero uppercase bold com outline, serviços em linhas numeradas, botão quadrado ──
  {
    id: "personal",
    label: "Personal Trainer",
    url: "diego-martins.bsph.com.br",
    content: (
      <div style={{ fontFamily: "system-ui, sans-serif", background: "#020802", minHeight: `${CONTENT_H}px` }}>
        {/* Header: sólido na cor primária */}
        <div style={{ background: "#16A34A", padding: "10px 18px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <p style={{ margin: 0, fontSize: "12px", fontWeight: "900", color: "#fff", textTransform: "uppercase", letterSpacing: "0.04em" }}>Diego Martins</p>
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            {["Programas", "Sobre", "Resultados"].map(l => (
              <span key={l} style={{ fontSize: "8px", color: "rgba(255,255,255,0.7)" }}>{l}</span>
            ))}
          </div>
        </div>
        {/* Hero: left-aligned, uppercase, texto outline */}
        <div style={{ padding: "18px 18px 14px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "10px" }}>
            <span style={{ width: "18px", height: "2px", background: "#22C55E", display: "inline-block", borderRadius: "2px" }} />
            <span style={{ fontSize: "7px", fontWeight: "700", letterSpacing: "0.15em", textTransform: "uppercase", color: "#22C55E" }}>Personal Trainer · CREF 012345-G/SP</span>
          </div>
          <p style={{ margin: "0 0 8px", fontSize: "22px", fontWeight: "900", color: "#F0FDF4", lineHeight: "1.0", textTransform: "uppercase", letterSpacing: "-1px" }}>
            Resultados<br />
            <span style={{ WebkitTextStroke: "1.5px #22C55E", WebkitTextFillColor: "transparent" }}>reais.</span> Sem<br />desculpas.
          </p>
          <p style={{ margin: "0 0 13px", fontSize: "9px", color: "rgba(240,253,244,0.45)", lineHeight: "1.6" }}>500+ alunos transformados com método exclusivo. Acompanhamento próximo e resultados duradouros.</p>
          <span style={{ display: "inline-block", background: "#22C55E", color: "#fff", fontSize: "9px", fontWeight: "800", padding: "7px 14px", borderRadius: "0px", textTransform: "uppercase", letterSpacing: "0.06em", boxShadow: "3px 3px 0 #16A34A" }}>Quero começar →</span>
        </div>
        {/* Stats: barra com 4 itens */}
        <div style={{ display: "flex", borderTop: "1px solid rgba(34,197,94,0.14)", borderBottom: "1px solid rgba(34,197,94,0.14)", background: "rgba(34,197,94,0.05)" }}>
          {[["500+","Alunos"],["4.9★","Avaliação"],["8 anos","Exp."],["100%","Dedicação"]].map(([n, l], i) => (
            <div key={l} style={{ flex: 1, padding: "8px 4px", borderLeft: i > 0 ? "1px solid rgba(34,197,94,0.12)" : "none" }}>
              <p style={{ margin: 0, fontSize: "11px", fontWeight: "900", color: "#22C55E" }}>{n}</p>
              <p style={{ margin: 0, fontSize: "7px", color: "rgba(240,253,244,0.4)" }}>{l}</p>
            </div>
          ))}
        </div>
        {/* Serviços: linhas horizontais numeradas */}
        <div style={{ padding: "12px 18px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
            <p style={{ margin: 0, fontSize: "8px", fontWeight: "700", letterSpacing: "0.15em", textTransform: "uppercase", color: "#22C55E" }}>Programas</p>
            <div style={{ flex: 1, height: "1px", background: "rgba(34,197,94,0.15)" }} />
          </div>
          {[["01","🏋️","Musculação","Força e definição com protocolo semanal ajustado"],["02","🏃","Emagrecimento","Queima de gordura com exercícios e orientação"],["03","⚡","Condicionamento","Alta performance e resistência para todos os níveis"]].map(([n, icon, title, desc]) => (
            <div key={title as string} style={{ display: "flex", gap: "10px", alignItems: "flex-start", padding: "9px 0", borderBottom: "1px solid rgba(34,197,94,0.08)" }}>
              <span style={{ fontSize: "16px", fontWeight: "900", color: "#22C55E", opacity: 0.2, lineHeight: 1, flexShrink: 0, minWidth: "18px" }}>{n}</span>
              <span style={{ fontSize: "14px", flexShrink: 0 }}>{icon}</span>
              <div>
                <p style={{ margin: "0 0 2px", fontSize: "9px", fontWeight: "800", color: "#F0FDF4", textTransform: "uppercase", letterSpacing: "-0.2px" }}>{title as string}</p>
                <p style={{ margin: 0, fontSize: "8px", color: "rgba(240,253,244,0.45)", lineHeight: "1.4" }}>{desc as string}</p>
              </div>
            </div>
          ))}
        </div>
        {/* Sobre */}
        <div style={{ padding: "11px 18px 12px", background: "rgba(34,197,94,0.04)", borderTop: "1px solid rgba(34,197,94,0.08)", display: "flex", gap: "12px", alignItems: "flex-start" }}>
          <div style={{ border: "1.5px solid #22C55E", padding: "6px 10px", flexShrink: 0 }}>
            <p style={{ margin: 0, fontSize: "18px", fontWeight: "900", color: "#22C55E", lineHeight: 1 }}>8</p>
            <p style={{ margin: "2px 0 0", fontSize: "6px", color: "rgba(240,253,244,0.5)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Anos</p>
          </div>
          <div>
            <p style={{ margin: "0 0 4px", fontSize: "8px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", color: "#22C55E" }}>Sobre</p>
            <p style={{ margin: 0, fontSize: "8px", color: "rgba(240,253,244,0.45)", lineHeight: "1.6" }}>Graduado em Ed. Física. Especialista em composição corporal e treinamento funcional para todos os níveis.</p>
          </div>
        </div>
        {/* Depoimento: borda esquerda */}
        <div style={{ padding: "11px 18px", borderTop: "1px solid rgba(34,197,94,0.08)", display: "flex", gap: "0" }}>
          <div style={{ width: "3px", background: "#22C55E", borderRadius: "3px", marginRight: "10px", flexShrink: 0 }} />
          <div>
            <p style={{ margin: "0 0 5px", fontSize: "8px", color: "rgba(240,253,244,0.6)", lineHeight: "1.65", fontStyle: "italic" }}>&ldquo;Em 4 meses perdi 14kg com saúde. O Diego motiva demais e ajusta o treino quando preciso.&rdquo;</p>
            <p style={{ margin: 0, fontSize: "8px", fontWeight: "700", color: "#22C55E" }}>Fernanda R. — Programa Emagrecimento</p>
          </div>
        </div>
        {/* CTA: horizontal full-width */}
        <div style={{ background: "#16A34A", padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "3px solid #22C55E" }}>
          <div>
            <p style={{ margin: 0, fontSize: "11px", fontWeight: "900", color: "#fff", textTransform: "uppercase" }}>Sua transformação começa hoje.</p>
            <p style={{ margin: "2px 0 0", fontSize: "8px", color: "rgba(255,255,255,0.65)" }}>Fale pelo WhatsApp e montamos seu plano.</p>
          </div>
          <span style={{ background: "#fff", color: "#16A34A", fontSize: "8px", fontWeight: "800", padding: "7px 12px", borderRadius: "0px", flexShrink: 0, textTransform: "uppercase" }}>Falar →</span>
        </div>
        <MiniFooter bg="#010601" left="Diego Martins · CREF 012345-G/SP" right="Powered by BuildSphere" lightText />
      </div>
    ),
  },

  // ── Advogado — header navy+gold, hero centrado formal, serviços em lista vertical, depoimento com aspas gold ──
  {
    id: "advogado",
    label: "Advogado",
    url: "dr-carlos-mendes.bsph.com.br",
    content: (
      <div style={{ fontFamily: "system-ui, sans-serif", background: "#080E1A", minHeight: `${CONTENT_H}px` }}>
        {/* Header: solid navy com gold border bottom */}
        <div style={{ background: "#0B1628", borderBottom: "2px solid rgba(201,168,76,0.35)", padding: "10px 18px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <p style={{ margin: 0, fontSize: "11px", fontWeight: "800", color: "#C9A84C", letterSpacing: "0.06em" }}>DR. CARLOS MENDES</p>
            <p style={{ margin: 0, fontSize: "7px", letterSpacing: "0.1em", color: "rgba(201,168,76,0.45)" }}>OAB/SP 123.456 · Advocacia</p>
          </div>
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            {["Áreas", "Sobre", "Contato"].map(l => (
              <span key={l} style={{ fontSize: "8px", color: "rgba(241,245,249,0.4)" }}>{l}</span>
            ))}
            <span style={{ border: "1px solid rgba(201,168,76,0.5)", color: "#C9A84C", fontSize: "8px", fontWeight: "700", padding: "3px 8px", borderRadius: "3px" }}>Consulta gratuita</span>
          </div>
        </div>
        {/* Hero: centralizado, formal */}
        <div style={{ padding: "20px 18px 16px", background: "linear-gradient(160deg,#0B1628,#0E1E38)", textAlign: "center" }}>
          <span style={{ display: "inline-block", border: "1px solid rgba(201,168,76,0.35)", color: "#C9A84C", fontSize: "7px", fontWeight: "700", letterSpacing: "0.14em", textTransform: "uppercase", padding: "3px 10px", borderRadius: "2px", marginBottom: "10px" }}>20 anos de experiência · FGV Direito</span>
          <p style={{ margin: "0 0 8px", fontSize: "18px", fontWeight: "800", color: "#F1F5F9", lineHeight: "1.2", letterSpacing: "-0.5px" }}>Seus direitos,<br />nossa missão</p>
          <p style={{ margin: "0 0 14px", fontSize: "9px", color: "rgba(241,245,249,0.45)", lineHeight: "1.65" }}>Defesa especializada em Direito Civil, Trabalhista e Empresarial. Atuação em todo o território nacional.</p>
          <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
            <span style={{ background: "linear-gradient(135deg,#C9A84C,#B8963E)", color: "#080E1A", fontSize: "9px", fontWeight: "800", padding: "6px 13px", borderRadius: "4px" }}>Consulta gratuita</span>
            <span style={{ border: "1px solid rgba(201,168,76,0.25)", color: "#C9A84C", fontSize: "9px", padding: "6px 13px", borderRadius: "4px" }}>Nossas áreas</span>
          </div>
        </div>
        {/* Stats: linha com separador */}
        <div style={{ display: "flex", borderTop: "1px solid rgba(201,168,76,0.1)", borderBottom: "1px solid rgba(201,168,76,0.1)", background: "rgba(201,168,76,0.04)" }}>
          {[["20+","Anos de carreira"],["500+","Casos ganhos"],["4.9★","Avaliação"]].map(([n, l], i) => (
            <div key={l} style={{ flex: 1, textAlign: "center", padding: "10px 4px", borderLeft: i > 0 ? "1px solid rgba(201,168,76,0.1)" : "none" }}>
              <p style={{ margin: 0, fontSize: "13px", fontWeight: "900", color: "#C9A84C" }}>{n}</p>
              <p style={{ margin: 0, fontSize: "7px", color: "rgba(241,245,249,0.4)" }}>{l}</p>
            </div>
          ))}
        </div>
        {/* Áreas: lista vertical com linha horizontal entre items */}
        <div style={{ padding: "12px 18px" }}>
          <p style={{ margin: "0 0 9px", fontSize: "8px", fontWeight: "700", letterSpacing: "0.15em", textTransform: "uppercase", color: "#C9A84C" }}>Áreas de atuação</p>
          {[["📄","Direito Civil","Contratos, propriedade e responsabilidade civil"],["🏢","Direito Empresarial","Empresas, sócios e operações societárias"],["👷","Direito Trabalhista","CLT, demissões e relações de trabalho"]].map(([icon, title, desc], i) => (
            <div key={title as string} style={{ display: "flex", gap: "10px", alignItems: "flex-start", padding: "9px 0", borderBottom: i < 2 ? "1px solid rgba(201,168,76,0.08)" : "none" }}>
              <span style={{ fontSize: "14px", flexShrink: 0, marginTop: "1px" }}>{icon}</span>
              <div>
                <p style={{ margin: "0 0 2px", fontSize: "9px", fontWeight: "700", color: "#F1F5F9" }}>{title as string}</p>
                <p style={{ margin: 0, fontSize: "8px", color: "rgba(241,245,249,0.4)", lineHeight: "1.4" }}>{desc as string}</p>
              </div>
            </div>
          ))}
        </div>
        {/* Sobre */}
        <div style={{ padding: "11px 18px 12px", background: "rgba(201,168,76,0.03)", borderTop: "1px solid rgba(201,168,76,0.08)" }}>
          <p style={{ margin: "0 0 5px", fontSize: "8px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", color: "#C9A84C" }}>Sobre o profissional</p>
          <p style={{ margin: 0, fontSize: "8px", color: "rgba(241,245,249,0.42)", lineHeight: "1.6" }}>Formado pela FGV Direito com pós-graduação em Direito Empresarial. Membro da Comissão de Direito do Trabalho da OAB/SP.</p>
        </div>
        {/* Depoimento: aspas gold grandes */}
        <div style={{ padding: "11px 18px", borderTop: "1px solid rgba(201,168,76,0.07)", position: "relative" }}>
          <span style={{ position: "absolute", top: "6px", left: "15px", fontSize: "36px", color: "#C9A84C", opacity: 0.12, lineHeight: 1, fontFamily: "Georgia,serif", pointerEvents: "none" }}>&ldquo;</span>
          <p style={{ margin: "0 0 6px", fontSize: "8px", color: "rgba(241,245,249,0.58)", lineHeight: "1.65", fontStyle: "italic", paddingTop: "2px" }}>&ldquo;O Dr. Carlos resolveu em 3 meses uma questão trabalhista que eu achava que nunca terminaria.&rdquo;</p>
          <p style={{ margin: 0, fontSize: "8px", fontWeight: "700", color: "#C9A84C" }}>Roberto M. — cliente desde 2022</p>
        </div>
        {/* CTA */}
        <div style={{ background: "linear-gradient(135deg,#C9A84C,#B8963E)", padding: "16px 18px", textAlign: "center" }}>
          <p style={{ margin: "0 0 3px", fontSize: "11px", fontWeight: "800", color: "#080E1A" }}>Fale com um especialista hoje</p>
          <p style={{ margin: "0 0 10px", fontSize: "8px", color: "rgba(8,14,26,0.58)" }}>Primeira consulta gratuita e sem compromisso</p>
          <span style={{ background: "#fff", color: "#080E1A", fontSize: "9px", fontWeight: "700", padding: "6px 14px", borderRadius: "4px", display: "inline-block" }}>Agendar consulta</span>
        </div>
        <MiniFooter bg="#04080F" left="Dr. Carlos Mendes · OAB/SP 123.456" right="Powered by BuildSphere" lightText />
      </div>
    ),
  },
];

// ─── Main component ───────────────────────────────────────────────────────────

export function ProductMockup() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [30, -30]);

  const [active, setActive] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-advance after each full scroll cycle
  useEffect(() => {
    if (isPaused) return;
    const t = setTimeout(() => setActive((prev) => (prev + 1) % SITES.length), DURATION_MS);
    return () => clearTimeout(t);
  }, [active, isPaused]);

  const site = SITES[active];

  return (
    <div ref={ref} className="relative mt-12">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute -left-20 -top-20 h-80 w-80 rounded-full bg-[#7C5CFF]/10 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-[#22D3EE]/10 blur-[100px]" />

      {/* Tab selector */}
      <div className="mb-5 flex flex-wrap justify-center gap-2">
        {SITES.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => { setActive(i); setIsPaused(false); }}
            className={`rounded-full px-4 py-1.5 text-[12px] font-semibold transition-all duration-300 ${
              i === active
                ? "bg-white/12 text-white ring-1 ring-white/20"
                : "text-[var(--platform-text)]/40 hover:text-[var(--platform-text)]/70"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <motion.div
        style={{ y }}
        className="relative mx-auto max-w-2xl"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Browser chrome */}
        <div className="rounded-2xl border border-white/15 bg-[#0A0F1E] p-1 shadow-[0_30px_80px_rgba(0,0,0,0.5),0_0_60px_rgba(59,130,246,0.10)]">
          <div className="flex items-center gap-2 rounded-t-xl bg-[#0D1325] px-5 py-3">
            <span className="h-3 w-3 rounded-full bg-[#FF5F56]" />
            <span className="h-3 w-3 rounded-full bg-[#FFBD2E]" />
            <span className="h-3 w-3 rounded-full bg-[#27C93F]" />
            <span className="ml-4 flex-1 rounded-lg bg-white/[0.06] px-4 py-1.5 text-xs text-[var(--platform-text)]/40">
              {site.url}
            </span>
          </div>

          {/* Scrolling viewport — overflow hidden simulates the browser window */}
          <div className="overflow-hidden rounded-b-xl" style={{ height: `${FRAME_H}px` }}>
            <motion.div
              key={`${site.id}-${active}`}
              animate={{
                y: [0, 0, -SCROLL_PX, -SCROLL_PX],
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration: DURATION_MS / 1000,
                times: [0, 0.07, 0.88, 1],
                ease: "linear",
              }}
            >
              {site.content}
            </motion.div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4 h-0.5 overflow-hidden rounded-full bg-white/10">
          {!isPaused && (
            <motion.div
              key={`bar-${site.id}-${active}`}
              className="h-full rounded-full bg-[#22D3EE]"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: DURATION_MS / 1000, ease: "linear" }}
            />
          )}
        </div>
      </motion.div>

      {/* Navigation dots */}
      <div className="mt-4 flex justify-center gap-2">
        {SITES.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => { setActive(i); setIsPaused(false); }}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              i === active ? "w-6 bg-[#22D3EE]" : "w-1.5 bg-white/20"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
