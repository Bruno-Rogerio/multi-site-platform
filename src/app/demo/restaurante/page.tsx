export default function DemoRestaurante() {
  return (
    <main style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", background: "#0D0600", minHeight: "100vh", color: "#FEF3C7" }}>
      {/* Nav */}
      <nav style={{ background: "rgba(13,6,0,0.95)", borderBottom: "1px solid rgba(245,158,11,0.15)", padding: "16px 48px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: "33px", zIndex: 10, backdropFilter: "blur(8px)" }}>
        <div>
          <p style={{ margin: 0, fontSize: "22px", fontWeight: "900", letterSpacing: "-0.5px" }}>
            <span style={{ color: "#F59E0B" }}>Brasa</span>
            <span style={{ color: "rgba(245,158,11,0.4)", fontWeight: "300" }}> & Co.</span>
          </p>
          <p style={{ margin: 0, fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(245,158,11,0.4)" }}>Gastronomia Contemporânea</p>
        </div>
        <div style={{ display: "flex", gap: "32px", alignItems: "center" }}>
          {["Cardápio", "Ambiente", "Sobre", "Contato"].map(l => (
            <a key={l} href="#" style={{ fontSize: "14px", color: "rgba(254,243,199,0.5)", textDecoration: "none", fontWeight: "500" }}>{l}</a>
          ))}
          <a href="#" style={{ background: "linear-gradient(135deg,#F59E0B,#D97706)", color: "#1A0D00", padding: "10px 22px", borderRadius: "8px", fontSize: "13px", fontWeight: "800", textDecoration: "none" }}>Reservar mesa</a>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ position: "relative", height: "520px", display: "flex", alignItems: "center", overflow: "hidden", background: "linear-gradient(160deg,#1A0D00 0%,#2C1500 50%,#1A0800 100%)" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 60% 50%, rgba(245,158,11,0.12) 0%, transparent 65%)" }} />
        <div style={{ position: "relative", zIndex: 1, padding: "0 48px", maxWidth: "600px" }}>
          <div style={{ display: "inline-block", border: "1px solid rgba(245,158,11,0.35)", color: "#F59E0B", fontSize: "11px", fontWeight: "700", letterSpacing: "0.14em", textTransform: "uppercase", padding: "5px 12px", borderRadius: "4px", marginBottom: "20px" }}>Desde 2018 · São Paulo</div>
          <h1 style={{ margin: "0 0 16px", fontSize: "52px", fontWeight: "900", lineHeight: "1.05", color: "#FEF3C7", letterSpacing: "-1.5px" }}>
            Sabor que<br/>conta histórias
          </h1>
          <p style={{ margin: "0 0 32px", fontSize: "17px", color: "rgba(254,243,199,0.6)", lineHeight: "1.7" }}>
            Ingredientes selecionados, brasa real e uma experiência gastronômica que vai além do prato. Cada visita é uma memória.
          </p>
          <div style={{ display: "flex", gap: "12px" }}>
            <a href="#" style={{ background: "linear-gradient(135deg,#F59E0B,#D97706)", color: "#1A0D00", padding: "14px 28px", borderRadius: "8px", fontSize: "15px", fontWeight: "800", textDecoration: "none" }}>Reservar mesa</a>
            <a href="#" style={{ border: "1px solid rgba(245,158,11,0.3)", color: "#F59E0B", padding: "14px 28px", borderRadius: "8px", fontSize: "15px", fontWeight: "600", textDecoration: "none" }}>Ver cardápio</a>
          </div>
        </div>
        <div style={{ position: "absolute", right: "48px", top: "50%", transform: "translateY(-50%)", fontSize: "120px", opacity: 0.1 }}>🔥</div>
      </section>

      {/* Menu highlights */}
      <section style={{ padding: "72px 48px", maxWidth: "1100px", margin: "0 auto" }}>
        <p style={{ margin: "0 0 6px", fontSize: "11px", fontWeight: "700", letterSpacing: "0.15em", textTransform: "uppercase", color: "#F59E0B" }}>Destaques</p>
        <h2 style={{ margin: "0 0 48px", fontSize: "32px", fontWeight: "800", color: "#FEF3C7" }}>Do nosso cardápio</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "24px" }}>
          {[
            ["🥩", "Picanha na Brasa", "Corte nobre grelhado na brasa com manteiga de ervas e farofa especial.", "R$ 89"],
            ["🦐", "Camarão Grelhado", "Camarões grandes temperados com alho, limão siciliano e azeite extra virgem.", "R$ 74"],
            ["🍮", "Pudim de Leite", "Receita da casa, cremoso, com calda de caramelo artesanal.", "R$ 28"],
          ].map(([icon, name, desc, price]) => (
            <div key={name} style={{ background: "rgba(245,158,11,0.04)", border: "1px solid rgba(245,158,11,0.12)", borderRadius: "16px", padding: "28px 24px" }}>
              <div style={{ fontSize: "36px", marginBottom: "16px" }}>{icon}</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "10px" }}>
                <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "#FEF3C7" }}>{name}</h3>
                <span style={{ fontSize: "16px", fontWeight: "800", color: "#F59E0B" }}>{price}</span>
              </div>
              <p style={{ margin: 0, fontSize: "13px", color: "rgba(254,243,199,0.5)", lineHeight: "1.6" }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Experience */}
      <section style={{ background: "rgba(245,158,11,0.04)", borderTop: "1px solid rgba(245,158,11,0.1)", borderBottom: "1px solid rgba(245,158,11,0.1)", padding: "64px 48px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", gap: "64px", justifyContent: "center" }}>
          {[["15.000+", "refeições servidas"], ["4.8★", "no Google"], ["6 anos", "de história"]].map(([num, label]) => (
            <div key={label} style={{ textAlign: "center" }}>
              <p style={{ margin: "0 0 4px", fontSize: "36px", fontWeight: "900", color: "#F59E0B" }}>{num}</p>
              <p style={{ margin: 0, fontSize: "14px", color: "rgba(254,243,199,0.5)" }}>{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Reservation CTA */}
      <section style={{ padding: "72px 48px", textAlign: "center" }}>
        <h2 style={{ margin: "0 0 12px", fontSize: "36px", fontWeight: "900", color: "#FEF3C7", letterSpacing: "-1px" }}>Reserve sua mesa</h2>
        <p style={{ margin: "0 0 32px", fontSize: "17px", color: "rgba(254,243,199,0.5)" }}>Disponível para almoço e jantar. Domingos fechamos às 17h.</p>
        <a href="#" style={{ background: "linear-gradient(135deg,#F59E0B,#D97706)", color: "#1A0D00", padding: "16px 40px", borderRadius: "10px", fontSize: "16px", fontWeight: "800", textDecoration: "none", display: "inline-block" }}>Reservar agora</a>
      </section>

      {/* Footer */}
      <footer style={{ background: "#080400", padding: "32px 48px", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(245,158,11,0.1)" }}>
        <p style={{ margin: 0, fontSize: "14px", fontWeight: "800", color: "#F59E0B" }}>Brasa & Co.</p>
        <p style={{ margin: 0, fontSize: "12px", color: "rgba(254,243,199,0.25)" }}>Rua das Flores, 420 · Pinheiros · São Paulo, SP</p>
      </footer>
    </main>
  );
}
