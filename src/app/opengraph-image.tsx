import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "BuildSphere — Crie seu site profissional em minutos";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0B1020",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background glow blobs */}
        <div
          style={{
            position: "absolute",
            top: "-80px",
            right: "-80px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "rgba(124,92,255,0.18)",
            filter: "blur(100px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-100px",
            left: "-60px",
            width: "450px",
            height: "450px",
            borderRadius: "50%",
            background: "rgba(59,130,246,0.15)",
            filter: "blur(120px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "600px",
            height: "300px",
            borderRadius: "50%",
            background: "rgba(34,211,238,0.06)",
            filter: "blur(80px)",
          }}
        />

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "0",
            zIndex: 1,
            padding: "0 80px",
            textAlign: "center",
          }}
        >
          {/* Badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(34,211,238,0.1)",
              border: "1px solid rgba(34,211,238,0.25)",
              borderRadius: "999px",
              padding: "6px 18px",
              marginBottom: "28px",
            }}
          >
            <div
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "#22D3EE",
              }}
            />
            <span
              style={{
                color: "#22D3EE",
                fontSize: "13px",
                fontWeight: "700",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
              }}
            >
              Plataforma de sites profissionais
            </span>
          </div>

          {/* Brand name */}
          <div
            style={{
              fontSize: "90px",
              fontWeight: "900",
              letterSpacing: "-2px",
              background: "linear-gradient(135deg, #3B82F6, #7C5CFF, #22D3EE)",
              backgroundClip: "text",
              color: "transparent",
              lineHeight: "1",
              marginBottom: "24px",
            }}
          >
            BuildSphere
          </div>

          {/* Tagline */}
          <div
            style={{
              fontSize: "26px",
              fontWeight: "500",
              color: "rgba(234,240,255,0.75)",
              lineHeight: "1.4",
              maxWidth: "720px",
            }}
          >
            Crie seu site profissional em menos de 5 minutos
          </div>

          {/* Price pill */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginTop: "36px",
            }}
          >
            <div
              style={{
                background: "linear-gradient(135deg, #3B82F6, #7C5CFF)",
                borderRadius: "12px",
                padding: "10px 24px",
                color: "white",
                fontSize: "16px",
                fontWeight: "700",
              }}
            >
              A partir de R$ 59,90/mês
            </div>
            <div
              style={{
                color: "rgba(234,240,255,0.40)",
                fontSize: "15px",
              }}
            >
              Sem taxa de setup · Cancele quando quiser
            </div>
          </div>
        </div>

        {/* Bottom domain */}
        <div
          style={{
            position: "absolute",
            bottom: "28px",
            color: "rgba(234,240,255,0.25)",
            fontSize: "14px",
            letterSpacing: "0.08em",
          }}
        >
          bsph.com.br
        </div>
      </div>
    ),
    { ...size },
  );
}
