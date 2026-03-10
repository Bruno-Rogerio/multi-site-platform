import type { CSSProperties } from "react";

// Demo: Restaurante — fiel ao que a plataforma entrega
// Seções: Header · Hero · Serviços (como categorias) · Sobre · Depoimento · Contato · Footer

const PRIMARY = "#F59E0B";
const ACCENT = "#D97706";
const BG = "#0D0600";
const TEXT = "#FEF3C7";
const BORDER = "rgba(245,158,11,0.14)";
const SURFACE = "rgba(245,158,11,0.04)";

const vars = {
  "--site-primary": PRIMARY,
  "--site-accent": ACCENT,
  "--site-background": BG,
  "--site-text": TEXT,
  "--site-border": BORDER,
  "--site-surface": SURFACE,
  "--site-radius": "8px",
  "--site-shadow": "0 2px 16px rgba(0,0,0,0.4)",
  fontFamily: "'Sora', system-ui, sans-serif",
  background: BG,
  color: TEXT,
  minHeight: "100vh",
} as CSSProperties;

// Serviços aqui representa categorias do cardápio (sem preços individuais)
const services = [
  {
    icon: "🥩",
    title: "Pratos Principais",
    description: "Carnes e frutos do mar preparados na brasa com ingredientes frescos e selecionados diariamente.",
  },
  {
    icon: "🥗",
    title: "Entradas e Saladas",
    description: "Combinações leves e saborosas para abrir o apetite antes do prato principal.",
  },
  {
    icon: "🍮",
    title: "Sobremesas",
    description: "Doces artesanais feitos na casa para encerrar a experiência com chave de ouro.",
  },
];

export default function RestauranteDemo() {
  return (
    <div style={vars}>
      {/* ─── Header ─── */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 20,
          borderBottom: `1px solid ${BORDER}`,
          background: `${BG}f0`,
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
          <a href="#" style={{ textDecoration: "none" }}>
            <span style={{ fontWeight: 900, fontSize: 20, color: PRIMARY }}>Brasa</span>
            <span style={{ fontWeight: 300, fontSize: 20, color: "rgba(245,158,11,0.4)" }}> & Co.</span>
          </a>
          <nav style={{ display: "flex", gap: 28, alignItems: "center" }}>
            {["Cardápio", "Sobre", "Horários", "Contato"].map((l) => (
              <a
                key={l}
                href={`#${l.toLowerCase()}`}
                style={{ fontSize: 14, color: TEXT, opacity: 0.55, textDecoration: "none" }}
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
          padding: "88px 24px 80px",
          background: "linear-gradient(160deg, #1A0D00 0%, #2C1500 60%, #1A0800 100%)",
        }}
      >
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <span
            style={{
              display: "inline-block",
              border: `1px solid rgba(245,158,11,0.35)`,
              color: PRIMARY,
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              padding: "4px 12px",
              borderRadius: 4,
              marginBottom: 20,
            }}
          >
            Gastronomia contemporânea · Pinheiros, SP
          </span>

          <h1
            style={{
              fontSize: "clamp(32px, 5vw, 52px)",
              fontWeight: 900,
              color: TEXT,
              lineHeight: 1.1,
              letterSpacing: "-1px",
              marginBottom: 20,
            }}
          >
            Sabor que<br />conta histórias
          </h1>

          <p style={{ fontSize: 17, color: TEXT, opacity: 0.5, lineHeight: 1.7, marginBottom: 32, maxWidth: 520 }}>
            Ingredientes selecionados, brasa real e uma experiência gastronômica que vai muito além do prato.
            Desde 2018 no coração de Pinheiros.
          </p>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <a
              href="https://wa.me/5511999999999"
              style={{
                background: `linear-gradient(135deg, ${PRIMARY}, ${ACCENT})`,
                color: "#1A0D00",
                fontSize: 15,
                fontWeight: 800,
                padding: "14px 28px",
                borderRadius: 8,
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              Reservar mesa
            </a>
            <a
              href="#cardápio"
              style={{
                border: `1px solid rgba(245,158,11,0.3)`,
                color: PRIMARY,
                fontSize: 15,
                padding: "14px 28px",
                borderRadius: 8,
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              Ver cardápio
            </a>
          </div>
        </div>
      </section>

      {/* ─── Stats ─── */}
      <div
        style={{
          borderTop: `1px solid ${BORDER}`,
          borderBottom: `1px solid ${BORDER}`,
          display: "flex",
          flexWrap: "wrap",
        }}
      >
        {[["6 anos", "de história"], ["4.8★", "no Google"], ["Pinheiros", "São Paulo, SP"]].map(([n, l]) => (
          <div
            key={l}
            style={{ flex: "1 1 160px", textAlign: "center", padding: "24px 16px" }}
          >
            <p style={{ margin: 0, fontSize: 24, fontWeight: 900, color: PRIMARY }}>{n}</p>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: TEXT, opacity: 0.45 }}>{l}</p>
          </div>
        ))}
      </div>

      {/* ─── Cardápio (seção de serviços) ─── */}
      <section id="cardápio" style={{ padding: "72px 24px" }}>
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
            Cardápio
          </p>
          <h2 style={{ fontSize: 30, fontWeight: 800, color: TEXT, marginBottom: 40 }}>
            O que você vai encontrar
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
            {services.map((s) => (
              <div
                key={s.title}
                style={{
                  background: SURFACE,
                  border: `1px solid ${BORDER}`,
                  borderRadius: 14,
                  padding: "28px 24px",
                }}
              >
                <div style={{ fontSize: 32, marginBottom: 14 }}>{s.icon}</div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: TEXT, marginBottom: 8 }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: TEXT, opacity: 0.5, lineHeight: 1.65 }}>{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Sobre ─── */}
      <section
        id="sobre"
        style={{
          padding: "72px 24px",
          background: "rgba(245,158,11,0.04)",
          borderTop: `1px solid ${BORDER}`,
          borderBottom: `1px solid ${BORDER}`,
        }}
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
            Nossa história
          </p>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: TEXT, marginBottom: 20 }}>Brasa & Co.</h2>
          <p style={{ fontSize: 15, color: TEXT, opacity: 0.55, lineHeight: 1.75 }}>
            Fundado em 2018 no coração de Pinheiros, o Brasa & Co. nasceu do amor pela gastronomia artesanal.
            Cada prato é criado com ingredientes locais e sazonais, preparados com técnica e muito cuidado.
            Um espaço aconchegante onde a comida de verdade encontra o ambiente ideal para criar memórias.
          </p>
        </div>
      </section>

      {/* ─── Horários ─── */}
      <section
        id="horários"
        style={{ padding: "56px 24px" }}
      >
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: PRIMARY,
              marginBottom: 16,
            }}
          >
            Horários de funcionamento
          </p>
          <div style={{ display: "flex", gap: 40, flexWrap: "wrap" }}>
            {[
              ["Terça a Sexta", "Almoço: 12h–15h · Jantar: 19h–23h"],
              ["Sábado e Domingo", "Almoço: 12h–16h · Jantar: 19h–00h"],
              ["Segunda-feira", "Fechado"],
            ].map(([d, h]) => (
              <div key={d}>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: TEXT, opacity: 0.8 }}>{d}</p>
                <p style={{ margin: "4px 0 0", fontSize: 14, color: TEXT, opacity: 0.45 }}>{h}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Depoimentos ─── */}
      <section
        style={{
          padding: "72px 24px",
          background: "rgba(245,158,11,0.03)",
          borderTop: `1px solid ${BORDER}`,
          borderBottom: `1px solid ${BORDER}`,
        }}
      >
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
          <h2 style={{ fontSize: 28, fontWeight: 800, color: TEXT, marginBottom: 36 }}>O que nossos clientes dizem</h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            {[
              { quote: "Uma experiência gastronômica incrível. Ambiente aconchegante, atendimento impecável e comida de altíssima qualidade. Com certeza voltarei.", author: "Patricia A.", detail: "Cliente frequente" },
              { quote: "O melhor frango ao molho que já comi na vida. Ingredientes frescos e um cuidado no preparo que faz toda a diferença.", author: "Ricardo S.", detail: "Cliente desde 2021" },
            ].map((t) => (
              <div
                key={t.author}
                style={{
                  background: SURFACE,
                  border: `1px solid ${BORDER}`,
                  borderRadius: 14,
                  padding: "28px 24px",
                }}
              >
                <p style={{ fontSize: 14, color: TEXT, opacity: 0.65, lineHeight: 1.7, fontStyle: "italic", marginBottom: 16 }}>
                  &ldquo;{t.quote}&rdquo;
                </p>
                <p style={{ fontSize: 13, fontWeight: 700, color: PRIMARY, margin: 0 }}>{t.author}</p>
                <p style={{ fontSize: 12, color: TEXT, opacity: 0.4, margin: "2px 0 0" }}>{t.detail}</p>
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
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(26,13,0,0.6)", marginBottom: 12 }}>
          Contato
        </p>
        <h2 style={{ fontSize: 28, fontWeight: 800, color: "#1A0D00", marginBottom: 12 }}>Reserve sua mesa agora</h2>
        <p style={{ fontSize: 15, color: "rgba(26,13,0,0.6)", marginBottom: 28 }}>
          Disponível para almoço e jantar. Fale com a gente pelo WhatsApp.
        </p>
        <a
          href="https://wa.me/5511999999999"
          style={{
            display: "inline-block",
            background: "#1A0D00",
            color: PRIMARY,
            fontSize: 15,
            fontWeight: 700,
            padding: "14px 32px",
            borderRadius: 8,
            textDecoration: "none",
          }}
        >
          Reservar pelo WhatsApp
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
          color: TEXT,
          opacity: 0.4,
        }}
      >
        <span>Brasa & Co. · Pinheiros · São Paulo, SP</span>
        <span>Powered by BuildSphere</span>
      </footer>
    </div>
  );
}
