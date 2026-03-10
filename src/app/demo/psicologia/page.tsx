import type { CSSProperties } from "react";

// Demo: Psicóloga — fiel ao que a plataforma entrega
// Seções: Header · Hero · Serviços · Sobre · Depoimento · Contato · Footer

const PRIMARY = "#7C3AED";
const ACCENT = "#A78BFA";
const BG = "#FAFAF9";
const TEXT = "#1C1917";
const BORDER = "rgba(11,16,32,0.10)";
const SURFACE = "rgba(255,255,255,0.9)";

const vars = {
  "--site-primary": PRIMARY,
  "--site-accent": ACCENT,
  "--site-background": BG,
  "--site-text": TEXT,
  "--site-border": BORDER,
  "--site-surface": SURFACE,
  "--site-radius": "12px",
  "--site-shadow": "0 2px 12px rgba(0,0,0,0.08)",
  fontFamily: "'Sora', system-ui, sans-serif",
  background: BG,
  color: TEXT,
  minHeight: "100vh",
} as CSSProperties;

const services = [
  {
    icon: "🧠",
    title: "Terapia Individual",
    description: "Espaço seguro para autoconhecimento, equilíbrio emocional e desenvolvimento pessoal.",
  },
  {
    icon: "💑",
    title: "Terapia de Casal",
    description: "Melhore a comunicação e fortaleça os vínculos do seu relacionamento.",
  },
  {
    icon: "👨‍👩‍👧",
    title: "Orientação Parental",
    description: "Suporte especializado para pais no desenvolvimento saudável dos filhos.",
  },
];

export default function PsicologiaDemo() {
  return (
    <div style={vars}>
      {/* ─── Header ─── */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 20,
          borderBottom: `1px solid ${BORDER}`,
          background: `${BG}ee`,
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      >
        <div
          style={{
            maxWidth: 1120,
            margin: "0 auto",
            padding: "0 24px",
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <a href="#" style={{ fontWeight: 800, fontSize: 18, color: TEXT, textDecoration: "none" }}>
            Dra. Ana Silva
          </a>
          <nav style={{ display: "flex", gap: 28, alignItems: "center" }}>
            {["Serviços", "Sobre", "Depoimentos", "Contato"].map((l) => (
              <a
                key={l}
                href={`#${l.toLowerCase()}`}
                style={{ fontSize: 14, color: TEXT, opacity: 0.65, textDecoration: "none" }}
              >
                {l}
              </a>
            ))}
          </nav>
        </div>
      </header>

      {/* ─── Hero ─── */}
      <section
        style={{
          background: `linear-gradient(160deg, ${BG} 0%, #F5F0FF 100%)`,
          padding: "80px 24px 72px",
        }}
      >
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <span
            style={{
              display: "inline-block",
              background: "#EDE9FE",
              color: PRIMARY,
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              padding: "4px 12px",
              borderRadius: 20,
              marginBottom: 20,
            }}
          >
            Psicologia Clínica · CRP 06/123456
          </span>

          <h1
            style={{
              fontSize: "clamp(32px, 5vw, 52px)",
              fontWeight: 900,
              color: TEXT,
              lineHeight: 1.15,
              letterSpacing: "-1px",
              marginBottom: 20,
            }}
          >
            Cuidado emocional para<br />uma vida mais plena
          </h1>

          <p style={{ fontSize: 17, color: TEXT, opacity: 0.6, lineHeight: 1.7, marginBottom: 32, maxWidth: 560 }}>
            Atendimento humanizado para adultos e adolescentes. Presencial em São Paulo e online para todo o Brasil.
          </p>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <a
              href="https://wa.me/5511999999999"
              style={{
                background: `linear-gradient(135deg, ${PRIMARY}, ${ACCENT})`,
                color: "#fff",
                fontSize: 15,
                fontWeight: 700,
                padding: "14px 28px",
                borderRadius: 10,
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              Agendar consulta
            </a>
            <a
              href="#sobre"
              style={{
                border: `1px solid ${BORDER}`,
                color: TEXT,
                fontSize: 15,
                padding: "14px 28px",
                borderRadius: 10,
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              Saiba mais
            </a>
          </div>
        </div>
      </section>

      {/* ─── Serviços ─── */}
      <section id="serviços" style={{ padding: "72px 24px" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <p
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: PRIMARY,
              marginBottom: 12,
            }}
          >
            Serviços
          </p>
          <h2 style={{ fontSize: 30, fontWeight: 800, color: TEXT, marginBottom: 40 }}>
            Como posso te ajudar
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
            {services.map((s) => (
              <div
                key={s.title}
                style={{
                  background: SURFACE,
                  border: `1px solid ${BORDER}`,
                  borderRadius: 16,
                  padding: "28px 24px",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                }}
              >
                <div style={{ fontSize: 32, marginBottom: 14 }}>{s.icon}</div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: TEXT, marginBottom: 8 }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: TEXT, opacity: 0.6, lineHeight: 1.65 }}>{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Sobre ─── */}
      <section
        id="sobre"
        style={{ padding: "72px 24px", background: "#F5F0FF", borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}
      >
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: PRIMARY,
              marginBottom: 12,
            }}
          >
            Sobre a profissional
          </p>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: TEXT, marginBottom: 20 }}>Dra. Ana Silva</h2>
          <p style={{ fontSize: 15, color: TEXT, opacity: 0.65, lineHeight: 1.75 }}>
            Formada em Psicologia pela USP, com especialização em Terapia Cognitivo-Comportamental (TCC) e Mindfulness.
            Com mais de 12 anos de experiência, acompanha adultos, adolescentes e casais em seu processo de
            autoconhecimento e bem-estar emocional. Atende de forma presencial em São Paulo e também online.
          </p>
        </div>
      </section>

      {/* ─── Depoimentos ─── */}
      <section id="depoimentos" style={{ padding: "72px 24px" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <p
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: PRIMARY,
              marginBottom: 12,
            }}
          >
            Depoimentos
          </p>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: TEXT, marginBottom: 36 }}>O que dizem os pacientes</h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            {[
              { quote: "A Dra. Ana transformou minha relação comigo mesma. Em seis meses de acompanhamento, aprendi a lidar com a ansiedade de um jeito que nunca imaginei possível.", author: "Mariana L.", detail: "Paciente há 1 ano" },
              { quote: "Profissional incrível, atenciosa e muito competente. O atendimento online funciona muito bem e me deu a flexibilidade que precisava.", author: "Carlos F.", detail: "Paciente há 8 meses" },
            ].map((t) => (
              <div
                key={t.author}
                style={{
                  background: SURFACE,
                  border: `1px solid ${BORDER}`,
                  borderRadius: 16,
                  padding: "28px 24px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                }}
              >
                <p style={{ fontSize: 14, color: TEXT, opacity: 0.7, lineHeight: 1.7, fontStyle: "italic", marginBottom: 16 }}>
                  &ldquo;{t.quote}&rdquo;
                </p>
                <p style={{ fontSize: 13, fontWeight: 700, color: PRIMARY, margin: 0 }}>{t.author}</p>
                <p style={{ fontSize: 12, color: TEXT, opacity: 0.5, margin: "2px 0 0" }}>{t.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Contato ─── */}
      <section
        id="contato"
        style={{
          padding: "64px 24px",
          background: `linear-gradient(135deg, ${PRIMARY}, ${ACCENT})`,
          textAlign: "center",
        }}
      >
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.65)", marginBottom: 12 }}>
          Contato
        </p>
        <h2 style={{ fontSize: 28, fontWeight: 800, color: "#fff", marginBottom: 12 }}>Pronta para dar o próximo passo?</h2>
        <p style={{ fontSize: 15, color: "rgba(255,255,255,0.7)", marginBottom: 28 }}>
          Entre em contato pelo WhatsApp para agendar sua primeira consulta.
        </p>
        <a
          href="https://wa.me/5511999999999"
          style={{
            display: "inline-block",
            background: "#fff",
            color: PRIMARY,
            fontSize: 15,
            fontWeight: 700,
            padding: "14px 32px",
            borderRadius: 10,
            textDecoration: "none",
          }}
        >
          Falar no WhatsApp
        </a>
      </section>

      {/* ─── Footer ─── */}
      <footer
        style={{
          borderTop: `1px solid ${BORDER}`,
          padding: "20px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 8,
          fontSize: 12,
          opacity: 0.6,
        }}
      >
        <span>Dra. Ana Silva · Psicóloga · CRP 06/123456 · São Paulo, SP</span>
        <span>Powered by BuildSphere</span>
      </footer>
    </div>
  );
}
