export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div
        style={{
          background: "linear-gradient(135deg,#3B82F6,#7C5CFF)",
          padding: "8px 20px",
          textAlign: "center",
          fontSize: "12px",
          fontWeight: "600",
          color: "#fff",
          fontFamily: "system-ui, sans-serif",
          letterSpacing: "0.01em",
        }}
      >
        🎯 Site demonstrativo BuildSphere — Quer um site assim?{" "}
        <a
          href="https://bsph.com.br/quero-comecar"
          style={{ color: "#fff", textDecoration: "underline", fontWeight: "700" }}
        >
          Comece agora
        </a>
      </div>
      {children}
    </>
  );
}
