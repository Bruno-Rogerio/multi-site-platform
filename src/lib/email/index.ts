/* ─────────────────────────────────────────────────────────────────────────────
   BuildSphere — Email utility
   Central module for all transactional emails sent via Resend.
   ─────────────────────────────────────────────────────────────────────────── */

const FROM = "BuildSphere <ola@bsph.com.br>";

/* ── Base layout ────────────────────────────────────────────────────────── */
function emailWrapper(body: string): string {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>BuildSphere</title>
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f1f5f9;">
  <tr>
    <td align="center" style="padding:40px 16px;">
      <!-- Card -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 32px rgba(15,23,42,0.10);">

        <!-- Header gradient -->
        <tr>
          <td style="background:linear-gradient(135deg,#3B82F6 0%,#7C5CFF 55%,#22D3EE 100%);padding:28px 36px;">
            <span style="color:#ffffff;font-size:22px;font-weight:800;letter-spacing:-0.5px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
              Build<span style="opacity:0.65">Sphere</span>
            </span>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:36px 36px 28px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#1e293b;font-size:15px;line-height:1.6;">
            ${body}
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:20px 36px;text-align:center;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
            <p style="margin:0;font-size:12px;color:#94a3b8;">
              BuildSphere &middot; Feito no Brasil &middot;
              <a href="https://bsph.com.br" style="color:#94a3b8;text-decoration:none;">bsph.com.br</a>
            </p>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
</body>
</html>`;
}

function ctaButton(label: string, href: string): string {
  return `
    <table cellpadding="0" cellspacing="0" border="0" style="margin-top:28px;">
      <tr>
        <td align="left">
          <a href="${href}"
            style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#3B82F6,#7C5CFF);color:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:15px;font-weight:700;text-decoration:none;border-radius:10px;letter-spacing:-0.2px;">
            ${label} →
          </a>
        </td>
      </tr>
    </table>`;
}

function infoBox(icon: string, text: string, bgColor: string, borderColor: string, textColor: string): string {
  return `
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:20px 0;">
      <tr>
        <td style="background:${bgColor};border:1px solid ${borderColor};border-radius:10px;padding:14px 18px;">
          <p style="margin:0;font-size:13px;color:${textColor};line-height:1.5;">${icon} ${text}</p>
        </td>
      </tr>
    </table>`;
}

/* ── Core send helper ───────────────────────────────────────────────────── */
async function sendEmail(to: string, subject: string, html: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[Email] RESEND_API_KEY not set — skipping email to", to);
    return;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: FROM, to, subject, html }),
  }).catch((err: unknown) => {
    console.error("[Resend] Network error:", err);
    return null;
  });

  if (res && !res.ok) {
    const body = await res.json().catch(() => null);
    console.error("[Resend] API error:", res.status, body);
  } else if (res?.ok) {
    console.log("[Resend] Email sent to", to, "— subject:", subject);
  }
}

/* ── Public API ─────────────────────────────────────────────────────────── */

/**
 * Sent after the user creates their account in the wizard.
 * Includes the email verification link from Supabase (generateLink).
 */
export async function sendVerificationEmail(
  email: string,
  fullName: string,
  verificationUrl: string,
): Promise<void> {
  const firstName = fullName.trim().split(" ")[0] || "usuário";

  const html = emailWrapper(`
    <h1 style="margin:0 0 10px;font-size:26px;font-weight:800;color:#0f172a;letter-spacing:-0.5px;">
      Confirme seu e-mail
    </h1>
    <p style="margin:0 0 4px;font-size:16px;color:#475569;">
      Olá, <strong style="color:#1e293b;">${firstName}</strong>!
    </p>
    <p style="margin:0 0 20px;font-size:15px;color:#64748b;line-height:1.6;">
      Sua conta foi criada com sucesso. Clique no botão abaixo para confirmar seu e-mail
      e acessar seu painel — sua demonstração está te esperando!
    </p>

    ${infoBox("🔒", "Este link expira em <strong>24 horas</strong> e pode ser usado apenas uma vez.", "#eff6ff", "#bfdbfe", "#1d4ed8")}

    ${ctaButton("Confirmar e-mail e acessar painel", verificationUrl)}

    <p style="margin:24px 0 0;font-size:12px;color:#94a3b8;line-height:1.5;">
      Se o botão não funcionar, copie e cole este link no navegador:<br/>
      <span style="color:#64748b;word-break:break-all;">${verificationUrl}</span>
    </p>
    <p style="margin:16px 0 0;font-size:12px;color:#cbd5e1;">
      Se não foi você que criou esta conta, ignore este e-mail com segurança.
    </p>
  `);

  await sendEmail(email, "Confirme seu e-mail — BuildSphere", html);
}

/**
 * Sent after the user's lead data is captured (step 1 of wizard).
 * Warm, encouraging — no account created yet.
 */
export async function sendLeadConfirmationEmail(
  email: string,
  businessName: string,
): Promise<void> {
  const html = emailWrapper(`
    <h1 style="margin:0 0 10px;font-size:26px;font-weight:800;color:#0f172a;letter-spacing:-0.5px;">
      Ótimo começo! 🚀
    </h1>
    <p style="margin:0 0 20px;font-size:15px;color:#64748b;line-height:1.6;">
      Guardamos seu lugar. Continue construindo o site de
      <strong style="color:#1e40af;">${businessName}</strong>
      — você está a poucos passos de estar online.
    </p>

    ${infoBox("✅", "Seus dados foram salvos. Continue de onde parou a qualquer momento.", "#f0fdf4", "#86efac", "#15803d")}

    <p style="margin:24px 0 0;font-size:13px;color:#94a3b8;">
      Este e-mail foi enviado porque você iniciou a criação de um site na BuildSphere.
      Nenhuma conta foi criada ainda — isso só acontece na última etapa.
    </p>
  `);

  await sendEmail(
    email,
    `Seu site para ${businessName} está sendo criado! — BuildSphere`,
    html,
  );
}

/**
 * Optional welcome email sent separately (e.g., post-verification webhook or trigger).
 * Currently not used in the main flow but available for future use.
 */
export async function sendWelcomeEmail(
  email: string,
  fullName: string,
  dashboardUrl = "https://bsph.com.br/admin/client",
): Promise<void> {
  const firstName = fullName.trim().split(" ")[0] || "usuário";

  const html = emailWrapper(`
    <h1 style="margin:0 0 10px;font-size:26px;font-weight:800;color:#0f172a;letter-spacing:-0.5px;">
      Bem-vindo(a), ${firstName}! 🎉
    </h1>
    <p style="margin:0 0 20px;font-size:15px;color:#64748b;line-height:1.6;">
      Seu e-mail foi confirmado e sua conta na BuildSphere está ativa.
      Acesse o painel para visualizar, editar e publicar seu site.
    </p>

    ${infoBox("💡", "Você tem <strong>48 horas</strong> de demonstração gratuita antes do prazo de publicação.", "#fefce8", "#fde047", "#a16207")}

    ${ctaButton("Acessar meu painel", dashboardUrl)}

    <p style="margin:24px 0 0;font-size:12px;color:#94a3b8;">
      Acesse com o e-mail <strong style="color:#64748b;">${email}</strong> e a senha que você criou.
    </p>
  `);

  await sendEmail(email, "Bem-vindo(a) à BuildSphere! Seu site está pronto.", html);
}
