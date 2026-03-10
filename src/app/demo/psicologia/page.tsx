export default function DemoPsicologia() {
  return (
    <main style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", background: "#FAFAF9", minHeight: "100vh", color: "#1C1917" }}>
      {/* Nav */}
      <nav style={{ background: "#fff", borderBottom: "1px solid #E7E5E4", padding: "14px 48px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: "33px", zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "linear-gradient(135deg,#7C3AED,#A78BFA)" }} />
          <div>
            <p style={{ margin: 0, fontSize: "15px", fontWeight: "800", color: "#1C1917" }}>Dra. Ana Silva</p>
            <p style={{ margin: 0, fontSize: "11px", color: "#7C3AED" }}>Psicóloga Clínica — CRP 06/123456</p>
          </div>
        </div>
        <div style={{ display: "flex", gap: "32px", alignItems: "center" }}>
          {["Sobre", "Serviços", "Depoimentos", "Contato"].map(l => (
            <a key={l} href="#" style={{ fontSize: "14px", color: "#78716C", textDecoration: "none", fontWeight: "500" }}>{l}</a>
          ))}
          <a href="#" style={{ background: "linear-gradient(135deg,#7C3AED,#A78BFA)", color: "#fff", padding: "10px 20px", borderRadius: "10px", fontSize: "13px", fontWeight: "700", textDecoration: "none" }}>Agendar consulta</a>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: "72px 48px 64px", maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "64px", alignItems: "center" }}>
        <div>
          <div style={{ display: "inline-block", background: "#EDE9FE", color: "#7C3AED", fontSize: "11px", fontWeight: "700", letterSpacing: "0.12em", textTransform: "uppercase", padding: "5px 12px", borderRadius: "20px", marginBottom: "16px" }}>Psicologia Clínica</div>
          <h1 style={{ margin: "0 0 16px", fontSize: "42px", fontWeight: "900", lineHeight: "1.15", color: "#1C1917", letterSpacing: "-1px" }}>
            Cuidado emocional para viver com mais clareza
          </h1>
          <p style={{ margin: "0 0 32px", fontSize: "17px", color: "#78716C", lineHeight: "1.7" }}>
            Atendimento humanizado para adultos e adolescentes. Terapia individual, de casal e orientação parental, presencial em São Paulo e online para todo o Brasil.
          </p>
          <div style={{ display: "flex", gap: "12px" }}>
            <a href="#" style={{ background: "linear-gradient(135deg,#7C3AED,#A78BFA)", color: "#fff", padding: "14px 28px", borderRadius: "12px", fontSize: "15px", fontWeight: "700", textDecoration: "none", boxShadow: "0 8px 24px rgba(124,58,237,0.35)" }}>Agendar consulta</a>
            <a href="#" style={{ border: "2px solid #E7E5E4", color: "#44403C", padding: "14px 28px", borderRadius: "12px", fontSize: "15px", fontWeight: "600", textDecoration: "none" }}>Conhecer mais</a>
          </div>
          <div style={{ marginTop: "32px", display: "flex", gap: "32px" }}>
            {[["12+", "anos de experiência"], ["800+", "pacientes atendidos"], ["4.9★", "avaliação média"]].map(([num, label]) => (
              <div key={label}>
                <p style={{ margin: 0, fontSize: "24px", fontWeight: "900", color: "#7C3AED" }}>{num}</p>
                <p style={{ margin: 0, fontSize: "12px", color: "#78716C" }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
        <div style={{ background: "linear-gradient(160deg,#EDE9FE 0%,#DDD6FE 40%,#C4B5FD 100%)", borderRadius: "24px", height: "420px", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "20px", right: "20px", background: "#fff", borderRadius: "12px", padding: "12px 16px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
            <p style={{ margin: 0, fontSize: "11px", color: "#78716C" }}>Próxima vaga disponível</p>
            <p style={{ margin: 0, fontSize: "13px", fontWeight: "700", color: "#7C3AED" }}>Hoje, 15h00</p>
          </div>
          <div style={{ fontSize: "80px", opacity: 0.3 }}>🧠</div>
        </div>
      </section>

      {/* Services */}
      <section style={{ background: "#fff", padding: "64px 48px", borderTop: "1px solid #E7E5E4" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <p style={{ margin: "0 0 6px", fontSize: "11px", fontWeight: "700", letterSpacing: "0.15em", textTransform: "uppercase", color: "#7C3AED" }}>Serviços</p>
          <h2 style={{ margin: "0 0 48px", fontSize: "32px", fontWeight: "800", color: "#1C1917" }}>Como posso ajudar você</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "24px" }}>
            {[
              ["💆", "Terapia Individual", "Espaço seguro para autoconhecimento, gestão de emoções e superação de desafios pessoais."],
              ["💑", "Terapia de Casal", "Melhore a comunicação e reforce os vínculos afetivos com a sua parceria."],
              ["👨‍👩‍👧", "Orientação Parental", "Suporte especializado para pais que desejam fortalecer a relação com os filhos."],
            ].map(([icon, title, desc]) => (
              <div key={title} style={{ background: "#FAFAF9", border: "1px solid #E7E5E4", borderRadius: "16px", padding: "28px 24px" }}>
                <div style={{ fontSize: "32px", marginBottom: "16px" }}>{icon}</div>
                <h3 style={{ margin: "0 0 10px", fontSize: "17px", fontWeight: "700", color: "#1C1917" }}>{title}</h3>
                <p style={{ margin: 0, fontSize: "14px", color: "#78716C", lineHeight: "1.6" }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section style={{ padding: "64px 48px", maxWidth: "1100px", margin: "0 auto" }}>
        <p style={{ margin: "0 0 6px", fontSize: "11px", fontWeight: "700", letterSpacing: "0.15em", textTransform: "uppercase", color: "#7C3AED" }}>Depoimentos</p>
        <h2 style={{ margin: "0 0 40px", fontSize: "32px", fontWeight: "800", color: "#1C1917" }}>O que dizem os pacientes</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
          {[
            ["A Dra. Ana transformou minha relação comigo mesma. Após 6 meses de terapia, me sinto mais inteira e capaz de enfrentar qualquer desafio.", "Mariana L.", "Paciente há 1 ano"],
            ["Nunca pensei que terapia de casal pudesse mudar tanto nossa relação. Hoje nos comunicamos de um jeito completamente diferente.", "Roberto e Patrícia S.", "Pacientes há 8 meses"],
          ].map(([quote, name, label]) => (
            <div key={name} style={{ background: "#fff", border: "1px solid #E7E5E4", borderRadius: "16px", padding: "28px 24px" }}>
              <p style={{ margin: "0 0 16px", fontSize: "15px", color: "#44403C", lineHeight: "1.7", fontStyle: "italic" }}>&ldquo;{quote}&rdquo;</p>
              <div>
                <p style={{ margin: 0, fontSize: "14px", fontWeight: "700", color: "#1C1917" }}>{name}</p>
                <p style={{ margin: 0, fontSize: "12px", color: "#78716C" }}>{label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "linear-gradient(135deg,#7C3AED,#A78BFA)", padding: "64px 48px", textAlign: "center" }}>
        <h2 style={{ margin: "0 0 12px", fontSize: "32px", fontWeight: "900", color: "#fff" }}>Pronta para dar o próximo passo?</h2>
        <p style={{ margin: "0 0 32px", fontSize: "17px", color: "rgba(255,255,255,0.8)" }}>Agende sua primeira sessão. As primeiras vagas deste mês têm 20% de desconto.</p>
        <a href="#" style={{ background: "#fff", color: "#7C3AED", padding: "16px 36px", borderRadius: "12px", fontSize: "16px", fontWeight: "800", textDecoration: "none", display: "inline-block" }}>Agendar agora</a>
      </section>

      {/* Footer */}
      <footer style={{ background: "#1C1917", padding: "32px 48px", textAlign: "center" }}>
        <p style={{ margin: 0, fontSize: "13px", color: "rgba(255,255,255,0.4)" }}>© 2026 Dra. Ana Silva · CRP 06/123456 · São Paulo, SP</p>
      </footer>
    </main>
  );
}
