import type { CSSProperties } from "react";

// Demo: Psicóloga — layout centralizado, cantos arredondados, botões pill, tons suaves
// Header minimal (nome centrado + nav horizontal abaixo)

const PRIMARY = "#7C3AED";
const ACCENT = "#A78BFA";
const BG = "#FAFAF9";
const TEXT = "#1C1917";
const BORDER = "rgba(124,58,237,0.12)";

const page: CSSProperties = {
  fontFamily: "'Sora', system-ui, sans-serif",
  background: BG,
  color: TEXT,
  minHeight: "100vh",
};

const services = [
  { icon: "🧠", color: "#EDE9FE", title: "Terapia Individual", desc: "Espaço seguro para autoconhecimento, equilíbrio emocional e desenvolvimento pessoal." },
  { icon: "💑", color: "#F3E8FF", title: "Terapia de Casal", desc: "Melhore a comunicação e fortaleça os vínculos do seu relacionamento." },
  { icon: "👨‍👩‍👧", color: "#EDE9FE", title: "Orientação Parental", desc: "Suporte especializado para pais no desenvolvimento saudável dos filhos." },
];

export default function PsicologiaDemo() {
  return (
    <div style={page}>

      {/* ─── Header: minimal — nome + nav centralizados ─── */}
      <header style={{
        position: "sticky", top: 0, zIndex: 20,
        borderBottom: `1px solid ${BORDER}`,
        background: `${BG}f0`,
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "12px 24px 0", textAlign: "center" }}>
          <a href="#" style={{ fontWeight: 800, fontSize: 18, color: TEXT, textDecoration: "none", display: "block", marginBottom: 8 }}>
            Dra. Ana Silva
          </a>
          <nav style={{ display: "flex", justifyContent: "center", gap: 28, paddingBottom: 12 }}>
            {["Serviços", "Sobre", "Depoimentos", "Contato"].map(l => (
              <a key={l} href={`#${l.toLowerCase()}`} style={{ fontSize: 13, color: TEXT, opacity: 0.55, textDecoration: "none" }}>{l}</a>
            ))}
          </nav>
        </div>
      </header>

      {/* ─── Hero: centralizado ─── */}
      <section style={{ padding: "88px 24px 80px", textAlign: "center", background: `linear-gradient(180deg, ${BG} 0%, #F5F0FF 100%)` }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <span style={{
            display: "inline-block", background: "#EDE9FE", color: PRIMARY,
            fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
            padding: "5px 16px", borderRadius: 999, marginBottom: 24,
          }}>Psicologia Clínica · CRP 06/123456</span>

          <h1 style={{ fontSize: "clamp(30px,5vw,50px)", fontWeight: 900, color: TEXT, lineHeight: 1.15, letterSpacing: "-1px", marginBottom: 20 }}>
            Cuidado emocional para<br />uma vida mais plena
          </h1>
          <p style={{ fontSize: 16, color: TEXT, opacity: 0.58, lineHeight: 1.75, marginBottom: 36, maxWidth: 500, margin: "0 auto 36px" }}>
            Atendimento humanizado para adultos e adolescentes. Presencial em São Paulo e online para todo o Brasil.
          </p>

          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="https://wa.me/5511999999999" style={{
              background: `linear-gradient(135deg, ${PRIMARY}, ${ACCENT})`,
              color: "#fff", fontSize: 15, fontWeight: 700,
              padding: "14px 32px", borderRadius: 999, textDecoration: "none",
              boxShadow: `0 8px 24px rgba(124,58,237,0.35)`,
            }}>Agendar consulta</a>
            <a href="#sobre" style={{
              border: `1.5px solid ${BORDER}`, color: PRIMARY,
              fontSize: 15, padding: "14px 32px", borderRadius: 999, textDecoration: "none",
            }}>Saiba mais</a>
          </div>
        </div>
      </section>

      {/* ─── Stats: linha com separadores ─── */}
      <div style={{ borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, background: "#fff" }}>
        <div style={{ maxWidth: 640, margin: "0 auto", display: "flex", justifyContent: "center" }}>
          {[["12+", "Anos de experiência"], ["800+", "Pacientes atendidos"], ["4.9★", "Avaliação média"]].map(([n, l], i) => (
            <div key={l} style={{ flex: 1, textAlign: "center", padding: "24px 16px", borderLeft: i > 0 ? `1px solid ${BORDER}` : "none" }}>
              <p style={{ margin: 0, fontSize: 26, fontWeight: 900, color: PRIMARY }}>{n}</p>
              <p style={{ margin: "5px 0 0", fontSize: 12, color: TEXT, opacity: 0.5 }}>{l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Serviços: cards com ícone em círculo colorido ─── */}
      <section id="serviços" style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: PRIMARY, marginBottom: 12 }}>Serviços</p>
          <h2 style={{ fontSize: 30, fontWeight: 800, color: TEXT, marginBottom: 48 }}>Como posso te ajudar</h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 24 }}>
            {services.map(s => (
              <div key={s.title} style={{
                background: "#fff", border: `1px solid ${BORDER}`,
                borderRadius: 24, padding: "32px 24px",
                boxShadow: "0 4px 20px rgba(124,58,237,0.06)",
                textAlign: "center",
              }}>
                {/* ícone em círculo colorido */}
                <div style={{
                  width: 56, height: 56, borderRadius: "50%",
                  background: s.color, fontSize: 24,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 18px",
                }}>{s.icon}</div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: TEXT, marginBottom: 10 }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: TEXT, opacity: 0.58, lineHeight: 1.65, margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Sobre ─── */}
      <section id="sobre" style={{ padding: "72px 24px", background: "#F5F0FF", borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: `linear-gradient(135deg, ${PRIMARY}, ${ACCENT})`, margin: "0 auto 24px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>👩‍⚕️</div>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: PRIMARY, marginBottom: 12 }}>Sobre a profissional</p>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: TEXT, marginBottom: 20 }}>Dra. Ana Silva</h2>
          <p style={{ fontSize: 15, color: TEXT, opacity: 0.65, lineHeight: 1.8, margin: 0 }}>
            Formada em Psicologia pela USP, com especialização em Terapia Cognitivo-Comportamental (TCC) e Mindfulness.
            Com mais de 12 anos de experiência, acompanha adultos, adolescentes e casais em seu processo de
            autoconhecimento e bem-estar emocional.
          </p>
        </div>
      </section>

      {/* ─── Depoimentos: aspas decorativas gigantes ─── */}
      <section id="depoimentos" style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: PRIMARY, marginBottom: 12, textAlign: "center" }}>Depoimentos</p>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: TEXT, marginBottom: 44, textAlign: "center" }}>O que dizem os pacientes</h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 24 }}>
            {[
              { quote: "A Dra. Ana transformou minha relação comigo mesma. Em seis meses aprendi a lidar com a ansiedade de um jeito que nunca imaginei possível.", author: "Mariana L.", detail: "Paciente há 1 ano" },
              { quote: "Profissional incrível, atenciosa e muito competente. O atendimento online funciona muito bem e me deu a flexibilidade que precisava.", author: "Carlos F.", detail: "Paciente há 8 meses" },
            ].map(t => (
              <div key={t.author} style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 20, padding: "36px 28px", position: "relative", overflow: "hidden" }}>
                {/* aspas decorativas */}
                <span style={{ position: "absolute", top: 12, left: 20, fontSize: 72, color: PRIMARY, opacity: 0.08, lineHeight: 1, fontFamily: "Georgia, serif", pointerEvents: "none" }}>&ldquo;</span>
                <p style={{ fontSize: 15, color: TEXT, opacity: 0.7, lineHeight: 1.75, fontStyle: "italic", marginBottom: 20, position: "relative" }}>
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg, ${PRIMARY}, ${ACCENT})`, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 14, fontWeight: 700 }}>
                    {t.author[0]}
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: PRIMARY }}>{t.author}</p>
                    <p style={{ margin: 0, fontSize: 12, color: TEXT, opacity: 0.45 }}>{t.detail}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Contato ─── */}
      <section id="contato" style={{ padding: "72px 24px", background: `linear-gradient(135deg, ${PRIMARY}, ${ACCENT})`, textAlign: "center" }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, color: "#fff", marginBottom: 12 }}>Pronta para o próximo passo?</h2>
        <p style={{ fontSize: 15, color: "rgba(255,255,255,0.72)", marginBottom: 32 }}>
          Entre em contato pelo WhatsApp e agende sua primeira consulta.
        </p>
        <a href="https://wa.me/5511999999999" style={{
          display: "inline-block", background: "#fff", color: PRIMARY,
          fontSize: 15, fontWeight: 700, padding: "14px 36px",
          borderRadius: 999, textDecoration: "none",
          boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
        }}>Falar no WhatsApp</a>
      </section>

      {/* ─── Footer ─── */}
      <footer style={{ borderTop: `1px solid ${BORDER}`, padding: "20px 24px", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8, fontSize: 12, opacity: 0.55, textAlign: "center" }}>
        <span>Dra. Ana Silva · Psicóloga · CRP 06/123456 · São Paulo, SP</span>
        <span>Powered by BuildSphere</span>
      </footer>
    </div>
  );
}
