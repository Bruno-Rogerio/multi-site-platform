export default function DemoPersonal() {
  return (
    <main style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", background: "#030803", minHeight: "100vh", color: "#F0FDF4" }}>
      {/* Nav */}
      <nav style={{ background: "rgba(3,8,3,0.95)", borderBottom: "1px solid rgba(34,197,94,0.15)", padding: "16px 48px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: "33px", zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "8px", height: "32px", background: "linear-gradient(180deg,#22C55E,#16A34A)", borderRadius: "4px" }} />
          <div>
            <p style={{ margin: 0, fontSize: "15px", fontWeight: "900", color: "#F0FDF4", letterSpacing: "-0.5px", textTransform: "uppercase" }}>Diego Martins</p>
            <p style={{ margin: 0, fontSize: "10px", color: "rgba(34,197,94,0.6)", letterSpacing: "0.1em" }}>Personal Trainer · CREF 012345-G/SP</p>
          </div>
        </div>
        <div style={{ display: "flex", gap: "32px", alignItems: "center" }}>
          {["Programas", "Resultados", "Sobre", "Contato"].map(l => (
            <a key={l} href="#" style={{ fontSize: "12px", color: "rgba(240,253,244,0.4)", textDecoration: "none", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em" }}>{l}</a>
          ))}
          <a href="#" style={{ background: "linear-gradient(135deg,#22C55E,#16A34A)", color: "#fff", padding: "10px 22px", borderRadius: "8px", fontSize: "13px", fontWeight: "800", textDecoration: "none" }}>Começar agora</a>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: "80px 48px 72px", maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr auto", gap: "64px", alignItems: "center" }}>
        <div>
          <div style={{ display: "inline-block", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)", color: "#22C55E", fontSize: "11px", fontWeight: "700", letterSpacing: "0.12em", textTransform: "uppercase", padding: "5px 12px", borderRadius: "6px", marginBottom: "20px" }}>Personal Trainer Certificado</div>
          <h1 style={{ margin: "0 0 16px", fontSize: "52px", fontWeight: "900", lineHeight: "1.05", color: "#F0FDF4", letterSpacing: "-1.5px", textTransform: "uppercase" }}>
            Resultados reais,<br/><span style={{ color: "#22C55E" }}>sem desculpas</span>
          </h1>
          <p style={{ margin: "0 0 36px", fontSize: "17px", color: "rgba(240,253,244,0.5)", lineHeight: "1.7" }}>
            Mais de 500 alunos transformados com método exclusivo de alta performance. Treino personalizado, acompanhamento próximo e resultados que duram.
          </p>
          <div style={{ display: "flex", gap: "12px" }}>
            <a href="#" style={{ background: "linear-gradient(135deg,#22C55E,#16A34A)", color: "#fff", padding: "14px 32px", borderRadius: "10px", fontSize: "15px", fontWeight: "800", textDecoration: "none", boxShadow: "0 8px 32px rgba(34,197,94,0.3)" }}>Quero começar agora</a>
            <a href="#" style={{ border: "1px solid rgba(34,197,94,0.25)", color: "#22C55E", padding: "14px 28px", borderRadius: "10px", fontSize: "15px", fontWeight: "600", textDecoration: "none" }}>Ver programas</a>
          </div>
        </div>
        <div style={{ display: "grid", gap: "16px" }}>
          {[["500+", "Alunos transformados"], ["4.9★", "Avaliação média"], ["8 anos", "De experiência"], ["100%", "Foco no resultado"]].map(([num, label]) => (
            <div key={label} style={{ background: "rgba(34,197,94,0.05)", border: "1px solid rgba(34,197,94,0.15)", borderRadius: "12px", padding: "16px 24px", minWidth: "180px" }}>
              <p style={{ margin: "0 0 2px", fontSize: "24px", fontWeight: "900", color: "#22C55E" }}>{num}</p>
              <p style={{ margin: 0, fontSize: "12px", color: "rgba(240,253,244,0.4)" }}>{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Programs */}
      <section style={{ background: "rgba(34,197,94,0.03)", borderTop: "1px solid rgba(34,197,94,0.08)", padding: "72px 48px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <p style={{ margin: "0 0 6px", fontSize: "11px", fontWeight: "700", letterSpacing: "0.15em", textTransform: "uppercase", color: "#22C55E" }}>Programas</p>
          <h2 style={{ margin: "0 0 48px", fontSize: "32px", fontWeight: "800", color: "#F0FDF4" }}>Escolha seu objetivo</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "24px" }}>
            {[
              ["🏋️", "Musculação & Força", "Ganho de massa, força e definição muscular com periodização científica.", "3x/semana", "R$ 320/mês"],
              ["🏃", "Emagrecimento Total", "Protocolo completo para queima de gordura com acompanhamento nutricional.", "5x/semana", "R$ 420/mês"],
              ["⚡", "Performance Atlética", "Para atletas e esportistas que buscam o próximo nível de rendimento.", "4x/semana", "R$ 520/mês"],
            ].map(([icon, name, desc, freq, price]) => (
              <div key={name} style={{ background: "#050D05", border: "1px solid rgba(34,197,94,0.15)", borderRadius: "16px", padding: "28px 24px", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, right: 0, width: "60px", height: "60px", background: "radial-gradient(circle,rgba(34,197,94,0.08),transparent)", borderRadius: "0 16px 0 60px" }} />
                <div style={{ fontSize: "32px", marginBottom: "16px" }}>{icon}</div>
                <h3 style={{ margin: "0 0 8px", fontSize: "17px", fontWeight: "700", color: "#F0FDF4" }}>{name}</h3>
                <p style={{ margin: "0 0 16px", fontSize: "13px", color: "rgba(240,253,244,0.45)", lineHeight: "1.6" }}>{desc}</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "12px", color: "rgba(34,197,94,0.6)", fontWeight: "600" }}>{freq}</span>
                  <span style={{ fontSize: "16px", fontWeight: "800", color: "#22C55E" }}>{price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section style={{ padding: "72px 48px", maxWidth: "1100px", margin: "0 auto" }}>
        <p style={{ margin: "0 0 6px", fontSize: "11px", fontWeight: "700", letterSpacing: "0.15em", textTransform: "uppercase", color: "#22C55E" }}>Resultados reais</p>
        <h2 style={{ margin: "0 0 40px", fontSize: "32px", fontWeight: "800", color: "#F0FDF4" }}>O que dizem os alunos</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
          {[
            ["Em 4 meses perdi 14kg e ganhei disposição que não tinha há anos. O Diego é mais que um personal, é um transformador de vidas.", "Fernanda R.", "Programa Emagrecimento · 4 meses"],
            ["Eu já treinei com vários profissionais. Nenhum teve tanto impacto quanto o método do Diego. Em 6 meses bati meu recorde no supino.", "Marcos A.", "Programa Força · 6 meses"],
          ].map(([quote, name, label]) => (
            <div key={name} style={{ background: "rgba(34,197,94,0.04)", border: "1px solid rgba(34,197,94,0.12)", borderRadius: "16px", padding: "28px 24px" }}>
              <p style={{ margin: "0 0 16px", fontSize: "15px", color: "rgba(240,253,244,0.7)", lineHeight: "1.7", fontStyle: "italic" }}>&ldquo;{quote}&rdquo;</p>
              <div>
                <p style={{ margin: 0, fontSize: "14px", fontWeight: "700", color: "#F0FDF4" }}>{name}</p>
                <p style={{ margin: 0, fontSize: "12px", color: "rgba(34,197,94,0.6)" }}>{label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "linear-gradient(135deg,rgba(34,197,94,0.15),rgba(22,163,74,0.08))", border: "1px solid rgba(34,197,94,0.15)", margin: "0 48px 48px", borderRadius: "24px", padding: "64px 48px", textAlign: "center" }}>
        <h2 style={{ margin: "0 0 12px", fontSize: "36px", fontWeight: "900", color: "#F0FDF4", letterSpacing: "-1px" }}>Sua transformação começa hoje</h2>
        <p style={{ margin: "0 0 32px", fontSize: "17px", color: "rgba(240,253,244,0.5)" }}>Primeira semana gratuita. Sem compromisso, sem desculpas.</p>
        <a href="#" style={{ background: "linear-gradient(135deg,#22C55E,#16A34A)", color: "#fff", padding: "16px 40px", borderRadius: "12px", fontSize: "16px", fontWeight: "800", textDecoration: "none", display: "inline-block", boxShadow: "0 8px 32px rgba(34,197,94,0.35)" }}>Começar agora — grátis</a>
      </section>

      {/* Footer */}
      <footer style={{ padding: "28px 48px", borderTop: "1px solid rgba(34,197,94,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <p style={{ margin: 0, fontSize: "14px", fontWeight: "900", color: "#22C55E", textTransform: "uppercase" }}>Diego Martins</p>
        <p style={{ margin: 0, fontSize: "12px", color: "rgba(240,253,244,0.2)" }}>CREF 012345-G/SP · São Paulo, SP</p>
      </footer>
    </main>
  );
}
