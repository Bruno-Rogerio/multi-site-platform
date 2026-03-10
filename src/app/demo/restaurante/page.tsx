import type { CSSProperties } from "react";

// Demo: Restaurante — hero centralizado com tipografia fina, serviços em 2 cols largas,
// depoimentos com linha vertical dourada, header com logo e tagline separados

const PRIMARY = "#F59E0B";
const ACCENT = "#D97706";
const BG = "#0A0500";
const TEXT = "#FEF3C7";
const MUTED = "rgba(254,243,199,0.48)";
const BORDER = "rgba(245,158,11,0.15)";

const page: CSSProperties = {
  fontFamily: "'Sora', system-ui, sans-serif",
  background: BG,
  color: TEXT,
  minHeight: "100vh",
};

const menuCategories = [
  {
    icon: "🥩",
    title: "Carnes & Brasa",
    desc: "Cortes nobres grelhados na brasa com ervas frescas e molhos artesanais. Ingredientes selecionados diariamente de produtores locais.",
    tag: "Carro-chefe",
  },
  {
    icon: "🦐",
    title: "Frutos do Mar",
    desc: "Camarões, lulas e peixes frescos preparados com técnica e simplicidade. Do mar direto para o seu prato.",
    tag: "Especialidade",
  },
  {
    icon: "🥗",
    title: "Entradas & Saladas",
    desc: "Combinações leves com folhas orgânicas, queijos artesanais e molhos da casa para abrir o apetite.",
    tag: "",
  },
  {
    icon: "🍮",
    title: "Sobremesas da Casa",
    desc: "Doces artesanais feitos diariamente em nossa cozinha. Receitas exclusivas que encerram a experiência com leveza.",
    tag: "",
  },
];

export default function RestauranteDemo() {
  return (
    <div style={page}>

      {/* ─── Header: logotipo com tagline + nav à direita ─── */}
      <header style={{
        position: "sticky", top: 0, zIndex: 20,
        borderBottom: `1px solid ${BORDER}`,
        background: `${BG}f2`,
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
      }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 32px", height: 68, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* logo com separador vertical */}
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div>
              <p style={{ margin: 0, fontSize: 20, fontWeight: 900, letterSpacing: "-0.5px", lineHeight: 1 }}>
                <span style={{ color: PRIMARY }}>Brasa</span>
                <span style={{ color: MUTED, fontWeight: 300 }}> & Co.</span>
              </p>
              <p style={{ margin: 0, fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: MUTED, marginTop: 2 }}>Gastronomia · Desde 2018</p>
            </div>
          </div>

          <nav style={{ display: "flex", gap: 28, alignItems: "center" }}>
            {["Cardápio", "Nossa história", "Horários", "Reservar"].map((l, i) => (
              i === 3
                ? <a key={l} href="https://wa.me/5511999999999" style={{ fontSize: 13, color: "#1A0D00", background: PRIMARY, fontWeight: 700, padding: "8px 18px", borderRadius: 4, textDecoration: "none" }}>{l}</a>
                : <a key={l} href={`#${l.toLowerCase().replace(" ", "-")}`} style={{ fontSize: 13, color: MUTED, textDecoration: "none" }}>{l}</a>
            ))}
          </nav>
        </div>
      </header>

      {/* ─── Hero: centralizado, headline fina com espaçamento largo ─── */}
      <section style={{ padding: "96px 24px 88px", textAlign: "center", background: "linear-gradient(180deg, #150A00 0%, #0A0500 100%)" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          {/* linha decorativa */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginBottom: 28 }}>
            <span style={{ flex: "0 0 40px", height: 1, background: `rgba(245,158,11,0.4)` }} />
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", color: MUTED }}>Pinheiros · São Paulo</span>
            <span style={{ flex: "0 0 40px", height: 1, background: `rgba(245,158,11,0.4)` }} />
          </div>

          <h1 style={{
            fontSize: "clamp(36px,5.5vw,68px)",
            fontWeight: 300,                  /* headline fina — contraste com o personal */
            color: TEXT,
            lineHeight: 1.15,
            letterSpacing: "0.02em",
            marginBottom: 24,
          }}>
            Sabor que<br />
            <em style={{ fontStyle: "italic", fontWeight: 700, color: PRIMARY }}>conta histórias</em>
          </h1>

          <p style={{ fontSize: 16, color: MUTED, lineHeight: 1.75, marginBottom: 40, maxWidth: 520, margin: "0 auto 40px" }}>
            Ingredientes selecionados, brasa real e uma experiência gastronômica que vai além do prato.
            Gastronomia contemporânea desde 2018.
          </p>

          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="https://wa.me/5511999999999" style={{
              background: `linear-gradient(135deg, ${PRIMARY}, ${ACCENT})`,
              color: "#1A0D00", fontSize: 15, fontWeight: 800,
              padding: "15px 32px", borderRadius: 6, textDecoration: "none",
            }}>Reservar mesa</a>
            <a href="#cardápio" style={{
              border: `1px solid rgba(245,158,11,0.35)`,
              color: PRIMARY, fontSize: 15,
              padding: "15px 32px", borderRadius: 6, textDecoration: "none",
            }}>Ver cardápio</a>
          </div>
        </div>
      </section>

      {/* ─── Stats: elegant centered ─── */}
      <div style={{ borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, background: "rgba(245,158,11,0.04)" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", display: "flex" }}>
          {[["6 anos", "de história"], ["4.8★", "avaliação no Google"], ["Pinheiros", "São Paulo, SP"]].map(([n, l], i) => (
            <div key={l} style={{ flex: 1, textAlign: "center", padding: "28px 16px", borderLeft: i > 0 ? `1px solid ${BORDER}` : "none" }}>
              <p style={{ margin: 0, fontSize: 11, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: MUTED, marginBottom: 6 }}>{l}</p>
              <p style={{ margin: 0, fontSize: 22, fontWeight: 700, color: PRIMARY }}>{n}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Cardápio: grid 2 colunas com tag ─── */}
      <section id="cardápio" style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: PRIMARY, marginBottom: 12 }}>Cardápio</p>
            <h2 style={{ fontSize: 30, fontWeight: 700, color: TEXT }}>O que você vai encontrar</h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 20 }}>
            {menuCategories.map(m => (
              <div key={m.title} style={{
                background: "rgba(245,158,11,0.04)",
                border: `1px solid ${BORDER}`,
                borderRadius: 12,
                padding: "28px 24px",
                display: "flex", gap: 18, alignItems: "flex-start",
              }}>
                <span style={{ fontSize: 32, flexShrink: 0 }}>{m.icon}</span>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: TEXT, margin: 0 }}>{m.title}</h3>
                    {m.tag && (
                      <span style={{ fontSize: 10, fontWeight: 700, color: "#1A0D00", background: PRIMARY, padding: "2px 7px", borderRadius: 4 }}>{m.tag}</span>
                    )}
                  </div>
                  <p style={{ fontSize: 14, color: MUTED, lineHeight: 1.65, margin: 0 }}>{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Sobre ─── */}
      <section id="nossa-história" style={{ padding: "72px 24px", background: "rgba(245,158,11,0.04)", borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: PRIMARY, marginBottom: 12 }}>Nossa história</p>
          <h2 style={{ fontSize: 26, fontWeight: 700, color: TEXT, marginBottom: 20 }}>Brasa & Co.</h2>
          <p style={{ fontSize: 15, color: MUTED, lineHeight: 1.85, maxWidth: 580, margin: "0 auto" }}>
            Fundado em 2018 no coração de Pinheiros, o Brasa & Co. nasceu do amor pela gastronomia artesanal.
            Cada prato é elaborado com ingredientes locais e sazonais, preparados com técnica e muito cuidado —
            um espaço aconchegante onde a comida de verdade encontra o ambiente ideal para criar memórias.
          </p>
        </div>
      </section>

      {/* ─── Horários ─── */}
      <section id="horários" style={{ padding: "56px 24px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: PRIMARY, marginBottom: 32 }}>Horários de funcionamento</p>
          <div style={{ display: "flex", justifyContent: "center", gap: 48, flexWrap: "wrap" }}>
            {[["Terça a Sexta", "Almoço: 12h–15h", "Jantar: 19h–23h"], ["Sábado e Domingo", "Almoço: 12h–16h", "Jantar: 19h–00h"], ["Segunda-feira", "Fechado", ""]].map(([d, h1, h2]) => (
              <div key={d} style={{ textAlign: "center" }}>
                <p style={{ margin: "0 0 6px", fontSize: 13, fontWeight: 700, color: TEXT, opacity: 0.8 }}>{d}</p>
                <p style={{ margin: 0, fontSize: 13, color: MUTED }}>{h1}</p>
                {h2 && <p style={{ margin: "2px 0 0", fontSize: 13, color: MUTED }}>{h2}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Depoimentos: linha vertical dourada ─── */}
      <section style={{ padding: "72px 24px", background: "rgba(245,158,11,0.03)", borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: PRIMARY, marginBottom: 12 }}>Depoimentos</p>
            <h2 style={{ fontSize: 28, fontWeight: 700, color: TEXT }}>O que nossos clientes dizem</h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 28 }}>
            {[
              { quote: "Uma experiência gastronômica incrível. Ambiente aconchegante, atendimento impecável e comida de altíssima qualidade. Com certeza voltarei.", author: "Patricia A.", detail: "Cliente frequente" },
              { quote: "O melhor frango ao molho que já comi na vida. Ingredientes frescos e um cuidado no preparo que faz toda a diferença.", author: "Ricardo S.", detail: "Cliente desde 2021" },
            ].map(t => (
              <div key={t.author} style={{ display: "flex", gap: 16 }}>
                {/* linha vertical dourada */}
                <div style={{ width: 3, background: `linear-gradient(180deg, ${PRIMARY}, ${ACCENT})`, borderRadius: 3, flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: 15, color: TEXT, opacity: 0.65, lineHeight: 1.8, fontStyle: "italic", marginBottom: 16 }}>
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: PRIMARY }}>{t.author}</p>
                  <p style={{ margin: "3px 0 0", fontSize: 12, color: MUTED }}>{t.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Contato ─── */}
      <section id="reservar" style={{ padding: "72px 24px", background: `linear-gradient(135deg, ${PRIMARY}, ${ACCENT})`, textAlign: "center" }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(26,13,0,0.55)", marginBottom: 12 }}>Reservas</p>
        <h2 style={{ fontSize: 28, fontWeight: 700, color: "#1A0D00", marginBottom: 12 }}>Reserve sua mesa agora</h2>
        <p style={{ fontSize: 15, color: "rgba(26,13,0,0.58)", marginBottom: 32 }}>Disponível para almoço e jantar. Fale com a gente pelo WhatsApp.</p>
        <a href="https://wa.me/5511999999999" style={{
          display: "inline-block", background: "#1A0D00", color: PRIMARY,
          fontSize: 15, fontWeight: 700, padding: "15px 36px",
          borderRadius: 6, textDecoration: "none",
        }}>Reservar pelo WhatsApp</a>
      </section>

      {/* ─── Footer ─── */}
      <footer style={{ borderTop: `1px solid ${BORDER}`, padding: "20px 32px", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8, fontSize: 12, color: TEXT, opacity: 0.35 }}>
        <span>Brasa & Co. · Pinheiros · São Paulo, SP</span>
        <span>Powered by BuildSphere</span>
      </footer>
    </div>
  );
}
