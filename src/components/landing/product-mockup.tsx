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

// ─── Shared helpers ───────────────────────────────────────────────────────────

function NavBar({ bg, border, logo, links, ctaLabel, ctaColor }: {
  bg: string; border: string; logo: React.ReactNode;
  links: string[]; ctaLabel: string; ctaColor: string;
}) {
  return (
    <div style={{ background: bg, borderBottom: `1px solid ${border}`, padding: "10px 18px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      {logo}
      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
        {links.map((l) => <span key={l} style={{ fontSize: "9px", color: "rgba(128,128,128,0.7)" }}>{l}</span>)}
        <span style={{ background: ctaColor, color: "#fff", fontSize: "9px", fontWeight: "700", padding: "4px 9px", borderRadius: "6px" }}>{ctaLabel}</span>
      </div>
    </div>
  );
}

function StatRow({ items, accent, bg, border }: { items: [string, string][]; accent: string; bg: string; border: string }) {
  return (
    <div style={{ display: "flex", borderTop: `1px solid ${border}`, borderBottom: `1px solid ${border}`, background: bg }}>
      {items.map(([n, l]) => (
        <div key={l} style={{ flex: 1, textAlign: "center", padding: "10px 4px" }}>
          <p style={{ margin: 0, fontSize: "14px", fontWeight: "900", color: accent }}>{n}</p>
          <p style={{ margin: 0, fontSize: "8px", color: "rgba(128,128,128,0.8)" }}>{l}</p>
        </div>
      ))}
    </div>
  );
}

function ServiceGrid({ items, accent, cardBg, cardBorder, textColor }: {
  items: [string, string, string][]; accent: string;
  cardBg: string; cardBorder: string; textColor: string;
}) {
  return (
    <div style={{ padding: "14px 18px" }}>
      <p style={{ margin: "0 0 10px", fontSize: "9px", fontWeight: "700", letterSpacing: "0.15em", textTransform: "uppercase", color: accent }}>Serviços</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
        {items.map(([icon, name, desc]) => (
          <div key={name} style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: "10px", padding: "10px 8px", textAlign: "center" }}>
            <div style={{ fontSize: "16px", marginBottom: "5px" }}>{icon}</div>
            <p style={{ margin: "0 0 3px", fontSize: "9px", fontWeight: "700", color: textColor }}>{name}</p>
            <p style={{ margin: 0, fontSize: "8px", color: "rgba(128,128,128,0.7)", lineHeight: "1.4" }}>{desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function CtaBar({ gradient, title, sub, btnBg, btnText, btnTextColor }: {
  gradient: string; title: string; sub: string;
  btnBg: string; btnText: string; btnTextColor: string;
}) {
  return (
    <div style={{ background: gradient, padding: "16px 18px", textAlign: "center" }}>
      <p style={{ margin: "0 0 3px", fontSize: "12px", fontWeight: "800", color: "#fff" }}>{title}</p>
      <p style={{ margin: "0 0 10px", fontSize: "9px", color: "rgba(255,255,255,0.7)" }}>{sub}</p>
      <span style={{ background: btnBg, color: btnTextColor, fontSize: "10px", fontWeight: "700", padding: "7px 16px", borderRadius: "8px", display: "inline-block" }}>{btnText}</span>
    </div>
  );
}

function SiteFooter({ bg, left, right }: { bg: string; left: string; right: string }) {
  return (
    <div style={{ background: bg, padding: "10px 18px", display: "flex", justifyContent: "space-between" }}>
      <p style={{ margin: 0, fontSize: "9px", color: "rgba(255,255,255,0.4)" }}>{left}</p>
      <p style={{ margin: 0, fontSize: "9px", color: "rgba(255,255,255,0.25)" }}>{right}</p>
    </div>
  );
}

// ─── Site content definitions ─────────────────────────────────────────────────

type Site = { id: string; label: string; url: string; content: React.ReactNode };

const SITES: Site[] = [
  // ── Psicóloga ──────────────────────────────────────────────────────────────
  {
    id: "psicologa",
    label: "Psicóloga",
    url: "dra-ana-silva.bsph.com.br",
    content: (
      <div style={{ fontFamily: "system-ui, sans-serif", background: "#FAFAF9", minHeight: `${CONTENT_H}px` }}>
        <NavBar
          bg="#fff" border="#E7E5E4"
          logo={
            <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
              <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "linear-gradient(135deg,#7C3AED,#A78BFA)" }} />
              <div>
                <p style={{ margin: 0, fontSize: "11px", fontWeight: "800", color: "#1C1917" }}>Dra. Ana Silva</p>
                <p style={{ margin: 0, fontSize: "8px", color: "#7C3AED" }}>Psicóloga · CRP 06/123456</p>
              </div>
            </div>
          }
          links={["Serviços", "Sobre", "Contato"]} ctaLabel="Agendar" ctaColor="#7C3AED"
        />
        {/* Hero */}
        <div style={{ padding: "20px 18px 16px", background: "linear-gradient(180deg,#FAFAF9,#F5F0FF)" }}>
          <div style={{ display: "inline-block", background: "#EDE9FE", color: "#7C3AED", fontSize: "8px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", padding: "3px 8px", borderRadius: "20px", marginBottom: "8px" }}>Psicologia Clínica</div>
          <p style={{ margin: "0 0 7px", fontSize: "18px", fontWeight: "900", color: "#1C1917", lineHeight: "1.2", letterSpacing: "-0.5px" }}>Cuidado emocional<br />para uma vida plena</p>
          <p style={{ margin: "0 0 14px", fontSize: "10px", color: "#78716C", lineHeight: "1.6" }}>Atendimento humanizado para adultos e adolescentes. Presencial em São Paulo e online para todo o Brasil.</p>
          <div style={{ display: "flex", gap: "8px" }}>
            <span style={{ background: "linear-gradient(135deg,#7C3AED,#A78BFA)", color: "#fff", fontSize: "10px", fontWeight: "700", padding: "7px 14px", borderRadius: "8px" }}>Agendar consulta</span>
            <span style={{ border: "1px solid #E7E5E4", color: "#44403C", fontSize: "10px", padding: "7px 14px", borderRadius: "8px" }}>Saiba mais</span>
          </div>
        </div>
        <StatRow items={[["12+", "Anos exp."], ["800+", "Pacientes"], ["4.9★", "Avaliação"]]} accent="#7C3AED" bg="#fff" border="#F0EBF8" />
        <ServiceGrid
          items={[["💆", "Terapia Individual", "Autoconhecimento e saúde emocional"], ["💑", "Terapia de Casal", "Comunicação e vínculos"], ["👨‍👩‍👧", "Orient. Parental", "Suporte para pais"]]}
          accent="#7C3AED" cardBg="#FAFAF9" cardBorder="#E7E5E4" textColor="#1C1917"
        />
        {/* Sobre */}
        <div style={{ padding: "12px 18px 14px", background: "#F5F0FF", borderTop: "1px solid #EDE9FE" }}>
          <p style={{ margin: "0 0 6px", fontSize: "9px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", color: "#7C3AED" }}>Sobre a profissional</p>
          <p style={{ margin: 0, fontSize: "9px", color: "#78716C", lineHeight: "1.6" }}>Formada pela USP com especialização em TCC e Mindfulness. 12 anos acompanhando adultos, adolescentes e casais em busca de bem-estar emocional e qualidade de vida.</p>
        </div>
        {/* Depoimento */}
        <div style={{ padding: "12px 18px", background: "#fff", borderTop: "1px solid #F0EBF8" }}>
          <div style={{ background: "#FAFAF9", border: "1px solid #EDE9FE", borderRadius: "10px", padding: "10px 12px" }}>
            <p style={{ margin: "0 0 5px", fontSize: "9px", color: "#44403C", lineHeight: "1.6", fontStyle: "italic" }}>"A Dra. Ana transformou minha relação comigo mesma. Seis meses e sou outra pessoa."</p>
            <p style={{ margin: 0, fontSize: "8px", fontWeight: "700", color: "#7C3AED" }}>Mariana L. — paciente há 1 ano</p>
          </div>
        </div>
        <CtaBar gradient="linear-gradient(135deg,#7C3AED,#A78BFA)" title="Pronta para dar o próximo passo?" sub="Primeira sessão com desconto especial" btnBg="#fff" btnText="Agendar agora" btnTextColor="#7C3AED" />
        <SiteFooter bg="#1C1917" left="Dra. Ana Silva · CRP 06/123456" right="São Paulo, SP" />
      </div>
    ),
  },

  // ── Restaurante ────────────────────────────────────────────────────────────
  {
    id: "restaurante",
    label: "Restaurante",
    url: "brasa-co.bsph.com.br",
    content: (
      <div style={{ fontFamily: "system-ui, sans-serif", background: "#0D0600", minHeight: `${CONTENT_H}px` }}>
        <NavBar
          bg="rgba(13,6,0,0.98)" border="rgba(245,158,11,0.15)"
          logo={
            <div>
              <p style={{ margin: 0, fontSize: "13px", fontWeight: "900" }}>
                <span style={{ color: "#F59E0B" }}>Brasa</span>
                <span style={{ color: "rgba(245,158,11,0.35)", fontWeight: "300" }}> & Co.</span>
              </p>
              <p style={{ margin: 0, fontSize: "8px", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(245,158,11,0.4)" }}>Gastronomia · Desde 2018</p>
            </div>
          }
          links={["Cardápio", "Reservas", "Contato"]} ctaLabel="Reservar" ctaColor="#D97706"
        />
        {/* Hero */}
        <div style={{ padding: "22px 18px 18px", background: "linear-gradient(160deg,#1A0D00 0%,#2C1500 60%,#1A0800 100%)" }}>
          <div style={{ display: "inline-block", border: "1px solid rgba(245,158,11,0.35)", color: "#F59E0B", fontSize: "8px", fontWeight: "700", letterSpacing: "0.12em", textTransform: "uppercase", padding: "3px 8px", borderRadius: "4px", marginBottom: "8px" }}>Gastronomia contemporânea · SP</div>
          <p style={{ margin: "0 0 7px", fontSize: "20px", fontWeight: "900", color: "#FEF3C7", lineHeight: "1.1", letterSpacing: "-0.5px" }}>Sabor que<br />conta histórias</p>
          <p style={{ margin: "0 0 14px", fontSize: "10px", color: "rgba(254,243,199,0.55)", lineHeight: "1.6" }}>Ingredientes selecionados, brasa real e uma experiência gastronômica que vai além do prato.</p>
          <div style={{ display: "flex", gap: "8px" }}>
            <span style={{ background: "linear-gradient(135deg,#F59E0B,#D97706)", color: "#1A0D00", fontSize: "10px", fontWeight: "800", padding: "7px 14px", borderRadius: "7px" }}>Reservar mesa</span>
            <span style={{ border: "1px solid rgba(245,158,11,0.3)", color: "#F59E0B", fontSize: "10px", padding: "7px 14px", borderRadius: "7px" }}>Ver cardápio</span>
          </div>
        </div>
        <StatRow items={[["15k+", "Refeições"], ["4.8★", "No Google"], ["6 anos", "De história"]]} accent="#F59E0B" bg="rgba(245,158,11,0.04)" border="rgba(245,158,11,0.1)" />
        {/* Menu */}
        <div style={{ padding: "14px 18px" }}>
          <p style={{ margin: "0 0 10px", fontSize: "9px", fontWeight: "700", letterSpacing: "0.15em", textTransform: "uppercase", color: "#F59E0B" }}>Destaques do cardápio</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
            {([["🥩", "Picanha Brasa", "R$ 89", "Corte nobre com ervas"], ["🦐", "Camarão Grelhado", "R$ 74", "Alho e limão siciliano"], ["🍮", "Pudim da Casa", "R$ 28", "Caramelo artesanal"]] as [string,string,string,string][]).map(([icon, name, price, desc]) => (
              <div key={name} style={{ background: "rgba(245,158,11,0.04)", border: "1px solid rgba(245,158,11,0.12)", borderRadius: "10px", padding: "10px 8px", textAlign: "center" }}>
                <div style={{ fontSize: "16px", marginBottom: "4px" }}>{icon}</div>
                <p style={{ margin: "0 0 2px", fontSize: "9px", fontWeight: "700", color: "#FEF3C7" }}>{name}</p>
                <p style={{ margin: "0 0 3px", fontSize: "9px", fontWeight: "800", color: "#F59E0B" }}>{price}</p>
                <p style={{ margin: 0, fontSize: "8px", color: "rgba(254,243,199,0.4)", lineHeight: "1.4" }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
        {/* Sobre */}
        <div style={{ padding: "12px 18px 14px", background: "rgba(245,158,11,0.04)", borderTop: "1px solid rgba(245,158,11,0.1)" }}>
          <p style={{ margin: "0 0 6px", fontSize: "9px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", color: "#F59E0B" }}>Nossa história</p>
          <p style={{ margin: 0, fontSize: "9px", color: "rgba(254,243,199,0.5)", lineHeight: "1.6" }}>Fundado em 2018 no coração de Pinheiros, o Brasa & Co. nasceu do amor pela gastronomia artesanal. Cada prato é criado pelo Chef Ricardo Alves com ingredientes locais e sazonais.</p>
        </div>
        {/* Horários */}
        <div style={{ padding: "12px 18px", background: "#0D0600", borderTop: "1px solid rgba(245,158,11,0.08)" }}>
          <p style={{ margin: "0 0 8px", fontSize: "9px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", color: "#F59E0B" }}>Horário de funcionamento</p>
          <div style={{ display: "flex", gap: "20px" }}>
            {[["Ter–Sex", "12h–15h · 19h–23h"], ["Sab–Dom", "12h–16h · 19h–00h"]].map(([d, h]) => (
              <div key={d}>
                <p style={{ margin: 0, fontSize: "9px", fontWeight: "700", color: "rgba(254,243,199,0.7)" }}>{d}</p>
                <p style={{ margin: 0, fontSize: "9px", color: "rgba(254,243,199,0.4)" }}>{h}</p>
              </div>
            ))}
          </div>
        </div>
        <CtaBar gradient="linear-gradient(135deg,#F59E0B,#D97706)" title="Reserve sua mesa agora" sub="Disponível para almoço e jantar" btnBg="#1A0D00" btnText="Reservar" btnTextColor="#F59E0B" />
        <SiteFooter bg="#080400" left="Brasa & Co. · Pinheiros" right="São Paulo, SP" />
      </div>
    ),
  },

  // ── Personal Trainer ───────────────────────────────────────────────────────
  {
    id: "personal",
    label: "Personal Trainer",
    url: "diego-martins.bsph.com.br",
    content: (
      <div style={{ fontFamily: "system-ui, sans-serif", background: "#030803", minHeight: `${CONTENT_H}px` }}>
        <NavBar
          bg="#050A05" border="rgba(34,197,94,0.15)"
          logo={
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "6px", height: "26px", background: "linear-gradient(180deg,#22C55E,#16A34A)", borderRadius: "3px" }} />
              <div>
                <p style={{ margin: 0, fontSize: "11px", fontWeight: "900", color: "#F0FDF4", textTransform: "uppercase", letterSpacing: "-0.3px" }}>Diego Martins</p>
                <p style={{ margin: 0, fontSize: "8px", color: "rgba(34,197,94,0.6)" }}>Personal Trainer · CREF 012345</p>
              </div>
            </div>
          }
          links={["Programas", "Resultados", "Contato"]} ctaLabel="Começar agora" ctaColor="#16A34A"
        />
        {/* Hero */}
        <div style={{ padding: "20px 18px 16px" }}>
          <div style={{ display: "inline-block", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)", color: "#22C55E", fontSize: "8px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", padding: "3px 8px", borderRadius: "6px", marginBottom: "8px" }}>Personal Trainer Certificado</div>
          <p style={{ margin: "0 0 7px", fontSize: "19px", fontWeight: "900", color: "#F0FDF4", lineHeight: "1.15", textTransform: "uppercase", letterSpacing: "-0.5px" }}>Resultados reais,<br /><span style={{ color: "#22C55E" }}>sem desculpas</span></p>
          <p style={{ margin: "0 0 14px", fontSize: "10px", color: "rgba(240,253,244,0.5)", lineHeight: "1.6" }}>500+ alunos transformados com método exclusivo de alta performance. Acompanhamento próximo e resultados duradouros.</p>
          <span style={{ background: "linear-gradient(135deg,#22C55E,#16A34A)", color: "#fff", fontSize: "10px", fontWeight: "800", padding: "7px 16px", borderRadius: "8px", display: "inline-block" }}>Quero começar agora</span>
        </div>
        <StatRow items={[["500+", "Alunos"], ["4.9★", "Avaliação"], ["8 anos", "Experiência"]]} accent="#22C55E" bg="rgba(34,197,94,0.04)" border="rgba(34,197,94,0.1)" />
        <ServiceGrid
          items={[["🏋️", "Musculação", "Força e definição muscular"], ["🏃", "Emagrecimento", "Queima de gordura"], ["⚡", "Condicionamento", "Alta performance"]]}
          accent="#22C55E" cardBg="rgba(34,197,94,0.05)" cardBorder="rgba(34,197,94,0.15)" textColor="#F0FDF4"
        />
        {/* Sobre */}
        <div style={{ padding: "12px 18px 14px", background: "rgba(34,197,94,0.03)", borderTop: "1px solid rgba(34,197,94,0.08)" }}>
          <p style={{ margin: "0 0 6px", fontSize: "9px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", color: "#22C55E" }}>Sobre o profissional</p>
          <p style={{ margin: 0, fontSize: "9px", color: "rgba(240,253,244,0.45)", lineHeight: "1.6" }}>Graduado em Educação Física com 8 anos de experiência. Especialista em composição corporal e treinamento funcional de alta intensidade para todos os níveis.</p>
        </div>
        {/* Depoimento */}
        <div style={{ padding: "12px 18px", borderTop: "1px solid rgba(34,197,94,0.08)" }}>
          <div style={{ background: "rgba(34,197,94,0.04)", border: "1px solid rgba(34,197,94,0.12)", borderRadius: "10px", padding: "10px 12px" }}>
            <p style={{ margin: "0 0 5px", fontSize: "9px", color: "rgba(240,253,244,0.65)", lineHeight: "1.6", fontStyle: "italic" }}>"Em 4 meses perdi 14kg. O Diego é mais que personal, é um transformador de vidas."</p>
            <p style={{ margin: 0, fontSize: "8px", fontWeight: "700", color: "#22C55E" }}>Fernanda R. — Programa Emagrecimento</p>
          </div>
        </div>
        <CtaBar gradient="linear-gradient(135deg,rgba(34,197,94,0.18),rgba(22,163,74,0.1))" title="Sua transformação começa hoje" sub="Primeira semana gratuita — sem compromisso" btnBg="#22C55E" btnText="Começar agora" btnTextColor="#fff" />
        <SiteFooter bg="#020602" left="Diego Martins · CREF 012345-G/SP" right="São Paulo, SP" />
      </div>
    ),
  },

  // ── Advogado ───────────────────────────────────────────────────────────────
  {
    id: "advogado",
    label: "Advogado",
    url: "dr-carlos-mendes.bsph.com.br",
    content: (
      <div style={{ fontFamily: "system-ui, sans-serif", background: "#080E1A", minHeight: `${CONTENT_H}px` }}>
        <NavBar
          bg="#0B1628" border="rgba(201,168,76,0.18)"
          logo={
            <div>
              <p style={{ margin: 0, fontSize: "11px", fontWeight: "800", color: "#C9A84C", letterSpacing: "0.05em" }}>DR. CARLOS MENDES</p>
              <p style={{ margin: 0, fontSize: "8px", color: "rgba(201,168,76,0.45)", letterSpacing: "0.08em" }}>OAB/SP 123.456 · Advocacia</p>
            </div>
          }
          links={["Áreas", "Sobre", "Contato"]} ctaLabel="Consulta gratuita" ctaColor="#B8963E"
        />
        {/* Hero */}
        <div style={{ padding: "20px 18px 16px", background: "linear-gradient(160deg,#0B1628,#0E1E38)" }}>
          <div style={{ display: "inline-block", border: "1px solid rgba(201,168,76,0.3)", color: "#C9A84C", fontSize: "8px", fontWeight: "700", letterSpacing: "0.12em", textTransform: "uppercase", padding: "3px 8px", borderRadius: "3px", marginBottom: "8px" }}>20 anos de experiência</div>
          <p style={{ margin: "0 0 7px", fontSize: "18px", fontWeight: "800", color: "#F1F5F9", lineHeight: "1.2", letterSpacing: "-0.5px" }}>Seus direitos,<br />nossa missão</p>
          <p style={{ margin: "0 0 14px", fontSize: "10px", color: "rgba(241,245,249,0.45)", lineHeight: "1.6" }}>Defesa especializada em Direito Civil, Trabalhista e Empresarial. Atuação em todo o território nacional.</p>
          <div style={{ display: "flex", gap: "8px" }}>
            <span style={{ background: "linear-gradient(135deg,#C9A84C,#B8963E)", color: "#080E1A", fontSize: "10px", fontWeight: "800", padding: "7px 14px", borderRadius: "6px" }}>Consulta gratuita</span>
            <span style={{ border: "1px solid rgba(201,168,76,0.25)", color: "#C9A84C", fontSize: "10px", padding: "7px 14px", borderRadius: "6px" }}>Nossas áreas</span>
          </div>
        </div>
        <StatRow items={[["20+", "Anos carreira"], ["500+", "Casos ganhos"], ["4.9★", "Avaliação"]]} accent="#C9A84C" bg="rgba(201,168,76,0.04)" border="rgba(201,168,76,0.1)" />
        <ServiceGrid
          items={[["📄", "Direito Civil", "Contratos e obrigações"], ["🏢", "Dir. Empresarial", "Empresas e sociedades"], ["👷", "Dir. Trabalhista", "CLT e relações de trabalho"]]}
          accent="#C9A84C" cardBg="rgba(201,168,76,0.04)" cardBorder="rgba(201,168,76,0.12)" textColor="#F1F5F9"
        />
        {/* Sobre */}
        <div style={{ padding: "12px 18px 14px", background: "rgba(201,168,76,0.03)", borderTop: "1px solid rgba(201,168,76,0.08)" }}>
          <p style={{ margin: "0 0 6px", fontSize: "9px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", color: "#C9A84C" }}>Sobre o profissional</p>
          <p style={{ margin: 0, fontSize: "9px", color: "rgba(241,245,249,0.4)", lineHeight: "1.6" }}>Formado pela FGV Direito com pós-graduação em Direito Empresarial. Membro da Comissão de Direito do Trabalho da OAB/SP e autor de artigos sobre legislação trabalhista.</p>
        </div>
        {/* Depoimento */}
        <div style={{ padding: "12px 18px", borderTop: "1px solid rgba(201,168,76,0.07)" }}>
          <div style={{ background: "rgba(201,168,76,0.04)", border: "1px solid rgba(201,168,76,0.1)", borderRadius: "10px", padding: "10px 12px" }}>
            <p style={{ margin: "0 0 5px", fontSize: "9px", color: "rgba(241,245,249,0.6)", lineHeight: "1.6", fontStyle: "italic" }}>"O Dr. Carlos resolveu em 3 meses uma questão trabalhista que eu achava que nunca terminaria. Recomendo muito."</p>
            <p style={{ margin: 0, fontSize: "8px", fontWeight: "700", color: "#C9A84C" }}>Roberto M. — cliente desde 2022</p>
          </div>
        </div>
        <CtaBar gradient="linear-gradient(135deg,#C9A84C,#B8963E)" title="Fale com um especialista hoje" sub="Primeira consulta gratuita e sem compromisso" btnBg="#fff" btnText="Agendar consulta" btnTextColor="#080E1A" />
        <SiteFooter bg="#04080F" left="Dr. Carlos Mendes · OAB/SP 123.456" right="São Paulo, SP" />
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
