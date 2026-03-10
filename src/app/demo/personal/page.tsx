import type { CSSProperties } from "react";

// Demo: Personal Trainer — header sólido, hero left-aligned bold uppercase,
// serviços como linhas horizontais numeradas, botões quadrados, cantos duros

const PRIMARY = "#22C55E";
const ACCENT = "#16A34A";
const BG = "#020802";
const TEXT = "#F0FDF4";
const MUTED = "rgba(240,253,244,0.45)";
const BORDER = "rgba(34,197,94,0.16)";

const page: CSSProperties = {
  fontFamily: "'Sora', system-ui, sans-serif",
  background: BG,
  color: TEXT,
  minHeight: "100vh",
};

const services = [
  { n: "01", icon: "🏋️", title: "Musculação", desc: "Treino individualizado para ganho de força e definição muscular. Protocolo ajustado a cada semana conforme evolução." },
  { n: "02", icon: "🏃", title: "Emagrecimento", desc: "Protocolo focado em queima de gordura com exercícios funcionais, cardio e orientação nutricional básica." },
  { n: "03", icon: "⚡", title: "Condicionamento Físico", desc: "Melhore resistência, mobilidade e desempenho esportivo com treinos de alta intensidade e periodização." },
];

export default function PersonalDemo() {
  return (
    <div style={page}>

      {/* ─── Header: sólido na cor primária ─── */}
      <header style={{ position: "sticky", top: 0, zIndex: 20, background: ACCENT }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 24px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <a href="#" style={{ fontWeight: 900, fontSize: 17, color: "#fff", textDecoration: "none", textTransform: "uppercase", letterSpacing: "0.04em" }}>
            Diego Martins
          </a>
          <nav style={{ display: "flex", gap: 28, alignItems: "center" }}>
            {["Programas", "Sobre", "Resultados", "Contato"].map(l => (
              <a key={l} href={`#${l.toLowerCase()}`} style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", textDecoration: "none" }}>{l}</a>
            ))}
          </nav>
        </div>
      </header>

      {/* ─── Hero: left-aligned, tipografia gigante uppercase ─── */}
      <section style={{ padding: "80px 24px 72px" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
            <span style={{ width: 32, height: 3, background: PRIMARY, display: "inline-block", borderRadius: 2 }} />
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: PRIMARY }}>
              Personal Trainer · CREF 012345-G/SP
            </span>
          </div>

          <h1 style={{ fontSize: "clamp(36px,6vw,72px)", fontWeight: 900, color: TEXT, lineHeight: 1.0, textTransform: "uppercase", letterSpacing: "-2px", marginBottom: 24 }}>
            Resultados<br />
            <span style={{ color: PRIMARY, WebkitTextStroke: "2px " + PRIMARY, WebkitTextFillColor: "transparent" }}>reais.</span>
            <span style={{ color: TEXT }}> Sem</span>
            <br />desculpas.
          </h1>

          <p style={{ fontSize: 16, color: MUTED, lineHeight: 1.7, marginBottom: 36, maxWidth: 520 }}>
            Mais de 500 alunos transformados com método exclusivo de alta performance.
            Acompanhamento próximo, planilhas individualizadas e resultados duradouros.
          </p>

          <a href="https://wa.me/5511999999999" style={{
            display: "inline-block",
            background: PRIMARY, color: "#fff",
            fontSize: 15, fontWeight: 800,
            padding: "16px 36px",
            borderRadius: 0,              /* botão quadrado */
            textDecoration: "none",
            textTransform: "uppercase", letterSpacing: "0.08em",
            boxShadow: `4px 4px 0 ${ACCENT}`,
          }}>Quero começar →</a>
        </div>
      </section>

      {/* ─── Stats: barra horizontal com linha divisória ─── */}
      <div style={{ borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, background: "rgba(34,197,94,0.05)" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", display: "flex" }}>
          {[["500+", "Alunos"], ["4.9★", "Avaliação"], ["8 anos", "Experiência"], ["100%", "Online ou presencial"]].map(([n, l], i) => (
            <div key={l} style={{ flex: 1, padding: "20px 16px", borderLeft: i > 0 ? `1px solid ${BORDER}` : "none" }}>
              <p style={{ margin: 0, fontSize: 22, fontWeight: 900, color: PRIMARY }}>{n}</p>
              <p style={{ margin: "3px 0 0", fontSize: 12, color: MUTED }}>{l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Serviços: linhas horizontais numeradas ─── */}
      <section id="programas" style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 48 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: PRIMARY, margin: 0 }}>Programas</p>
            <div style={{ flex: 1, height: 1, background: BORDER }} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {services.map((s, i) => (
              <div key={s.title} style={{
                display: "flex", gap: 32, alignItems: "flex-start",
                padding: "32px 0",
                borderBottom: i < services.length - 1 ? `1px solid ${BORDER}` : "none",
              }}>
                {/* número */}
                <span style={{ fontSize: 42, fontWeight: 900, color: PRIMARY, opacity: 0.2, lineHeight: 1, flexShrink: 0, minWidth: 56, fontVariantNumeric: "tabular-nums" }}>{s.n}</span>
                {/* ícone */}
                <span style={{ fontSize: 28, marginTop: 4, flexShrink: 0 }}>{s.icon}</span>
                {/* texto */}
                <div>
                  <h3 style={{ fontSize: 20, fontWeight: 800, color: TEXT, marginBottom: 8, textTransform: "uppercase", letterSpacing: "-0.3px" }}>{s.title}</h3>
                  <p style={{ fontSize: 14, color: MUTED, lineHeight: 1.65, margin: 0, maxWidth: 520 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Sobre ─── */}
      <section id="sobre" style={{ padding: "72px 24px", background: "rgba(34,197,94,0.04)", borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", display: "flex", gap: 64, flexWrap: "wrap", alignItems: "center" }}>
          {/* bloco de destaque */}
          <div style={{ flexShrink: 0, border: `2px solid ${PRIMARY}`, padding: "20px 28px", borderRadius: 0, maxWidth: 200 }}>
            <p style={{ margin: 0, fontSize: 42, fontWeight: 900, color: PRIMARY, lineHeight: 1 }}>8</p>
            <p style={{ margin: "4px 0 0", fontSize: 12, color: MUTED, textTransform: "uppercase", letterSpacing: "0.1em" }}>Anos de<br />mercado</p>
          </div>
          <div style={{ flex: 1, minWidth: 240 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: PRIMARY, marginBottom: 12 }}>Sobre</p>
            <h2 style={{ fontSize: 26, fontWeight: 800, color: TEXT, marginBottom: 16 }}>Diego Martins</h2>
            <p style={{ fontSize: 15, color: MUTED, lineHeight: 1.75, margin: 0 }}>
              Graduado em Educação Física com 8 anos de experiência no mercado. Especialista em composição corporal
              e treinamento funcional de alta intensidade para todos os níveis. Atende presencialmente em São Paulo
              e de forma online para todo o Brasil, com planilhas individualizadas e acompanhamento por WhatsApp.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Depoimentos: cards com borda esquerda colorida ─── */}
      <section id="resultados" style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 48 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: PRIMARY, margin: 0 }}>Resultados</p>
            <div style={{ flex: 1, height: 1, background: BORDER }} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 20 }}>
            {[
              { quote: "Em 4 meses perdi 14kg com saúde. O Diego ajusta o treino quando preciso e motiva demais. Recomendo muito.", author: "Fernanda R.", detail: "Programa Emagrecimento" },
              { quote: "Treinei com vários personais e o Diego é diferente. O acompanhamento é muito mais próximo e os resultados aparecem rápido.", author: "Lucas M.", detail: "Programa Musculação" },
            ].map(t => (
              <div key={t.author} style={{
                background: "rgba(34,197,94,0.04)",
                borderLeft: `4px solid ${PRIMARY}`,
                borderTop: `1px solid ${BORDER}`,
                borderRight: `1px solid ${BORDER}`,
                borderBottom: `1px solid ${BORDER}`,
                borderRadius: "0 8px 8px 0",
                padding: "24px 20px",
              }}>
                <p style={{ fontSize: 14, color: TEXT, opacity: 0.65, lineHeight: 1.7, fontStyle: "italic", marginBottom: 16 }}>
                  &ldquo;{t.quote}&rdquo;
                </p>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: PRIMARY }}>{t.author}</p>
                <p style={{ margin: "3px 0 0", fontSize: 12, color: MUTED }}>{t.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Contato ─── */}
      <section id="contato" style={{ padding: "64px 24px", background: ACCENT, borderTop: `4px solid ${PRIMARY}` }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 24 }}>
          <div>
            <h2 style={{ fontSize: 28, fontWeight: 900, color: "#fff", margin: "0 0 8px", textTransform: "uppercase" }}>Sua transformação começa hoje.</h2>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.65)", margin: 0 }}>Fale comigo pelo WhatsApp e montamos seu plano agora.</p>
          </div>
          <a href="https://wa.me/5511999999999" style={{
            display: "inline-block", background: "#fff", color: ACCENT,
            fontSize: 15, fontWeight: 800, padding: "16px 36px",
            borderRadius: 0, textDecoration: "none",
            textTransform: "uppercase", letterSpacing: "0.06em", flexShrink: 0,
          }}>Falar no WhatsApp →</a>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer style={{ borderTop: `1px solid ${BORDER}`, padding: "20px 24px", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8, fontSize: 12, color: TEXT, opacity: 0.35 }}>
        <span>Diego Martins · Personal Trainer · CREF 012345-G/SP · São Paulo, SP</span>
        <span>Powered by BuildSphere</span>
      </footer>
    </div>
  );
}
