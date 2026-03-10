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

/* ── Billing / Payments ──────────────────────────────────────────────────── */

/**
 * Sent right after a successful payment (checkout.session.completed).
 * Simple receipt — NOT a fiscal document.
 */
export async function sendReceiptEmail(
  email: string,
  fullName: string,
  amountBRL: number,
  planName: string,
  referenceId: string,
  paymentDate: string,
): Promise<void> {
  const firstName = fullName.trim().split(" ")[0] || "usuário";
  const dateFormatted = new Date(paymentDate).toLocaleDateString("pt-BR", {
    day: "2-digit", month: "2-digit", year: "numeric",
  });
  const amountFormatted = amountBRL.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const html = emailWrapper(`
    <h1 style="margin:0 0 6px;font-size:26px;font-weight:800;color:#0f172a;letter-spacing:-0.5px;">
      Pagamento confirmado ✓
    </h1>
    <p style="margin:0 0 24px;font-size:15px;color:#64748b;line-height:1.6;">
      Olá, <strong style="color:#1e293b;">${firstName}</strong>! Recebemos seu pagamento. Aqui está o seu comprovante.
    </p>

    <!-- Receipt box -->
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;margin-bottom:24px;">
      <tr>
        <td style="background:#f8fafc;padding:20px 24px;border-bottom:1px solid #e2e8f0;">
          <p style="margin:0;font-size:13px;color:#94a3b8;text-transform:uppercase;letter-spacing:0.05em;">Valor pago</p>
          <p style="margin:4px 0 0;font-size:32px;font-weight:800;color:#15803d;">${amountFormatted}</p>
        </td>
      </tr>
      <tr>
        <td style="padding:0;">
          <table cellpadding="0" cellspacing="0" border="0" width="100%">
            <tr>
              <td style="padding:14px 24px;border-bottom:1px solid #f1f5f9;">
                <span style="font-size:12px;color:#94a3b8;display:block;">Plano</span>
                <span style="font-size:14px;font-weight:600;color:#1e293b;">${planName}</span>
              </td>
            </tr>
            <tr>
              <td style="padding:14px 24px;border-bottom:1px solid #f1f5f9;">
                <span style="font-size:12px;color:#94a3b8;display:block;">Data</span>
                <span style="font-size:14px;font-weight:600;color:#1e293b;">${dateFormatted}</span>
              </td>
            </tr>
            <tr>
              <td style="padding:14px 24px;">
                <span style="font-size:12px;color:#94a3b8;display:block;">Referência</span>
                <span style="font-size:14px;font-weight:600;color:#1e293b;font-family:monospace;">#${referenceId}</span>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    ${ctaButton("Acessar meu painel", "https://bsph.com.br/admin/client")}

    <p style="margin:24px 0 0;font-size:12px;color:#94a3b8;line-height:1.5;">
      Este comprovante não é um documento fiscal. Para solicitar nota fiscal, acesse
      <strong>Configurações → Dados fiscais</strong> no seu painel.
    </p>
  `);

  await sendEmail(email, `Comprovante de pagamento — ${amountFormatted} — BuildSphere`, html);
}

/**
 * Sent when a subscription is cancelled (customer.subscription.deleted webhook).
 */
export async function sendCancellationEmail(
  email: string,
  fullName: string,
  siteDomain: string,
): Promise<void> {
  const firstName = fullName.trim().split(" ")[0] || "usuário";

  const html = emailWrapper(`
    <h1 style="margin:0 0 10px;font-size:26px;font-weight:800;color:#0f172a;letter-spacing:-0.5px;">
      Assinatura cancelada
    </h1>
    <p style="margin:0 0 20px;font-size:15px;color:#64748b;line-height:1.6;">
      Olá, <strong style="color:#1e293b;">${firstName}</strong>. Sua assinatura BuildSphere foi cancelada
      e seu site foi temporariamente desativado.
    </p>

    ${siteDomain ? infoBox("🌐", `Site: <strong>${siteDomain}</strong>`, "#fef2f2", "#fecaca", "#b91c1c") : ""}

    ${infoBox("💡", "Quer reativar? Basta acessar seu painel e escolher um novo plano. Todo o seu conteúdo está preservado.", "#eff6ff", "#bfdbfe", "#1d4ed8")}

    ${ctaButton("Reativar meu site", "https://bsph.com.br/admin/client/settings?tab=plano")}

    <p style="margin:24px 0 0;font-size:12px;color:#94a3b8;line-height:1.5;">
      Se tiver dúvidas, abra um chamado no painel ou responda este e-mail.
    </p>
  `);

  await sendEmail(email, "Sua assinatura BuildSphere foi cancelada", html);
}

/**
 * Sent when an invoice payment fails (invoice.payment_failed webhook).
 */
export async function sendPaymentFailedEmail(
  email: string,
  fullName: string,
  amountBRL: number,
): Promise<void> {
  const firstName = fullName.trim().split(" ")[0] || "usuário";
  const amountFormatted = amountBRL.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const html = emailWrapper(`
    <h1 style="margin:0 0 10px;font-size:26px;font-weight:800;color:#0f172a;letter-spacing:-0.5px;">
      Falha no pagamento ⚠️
    </h1>
    <p style="margin:0 0 20px;font-size:15px;color:#64748b;line-height:1.6;">
      Olá, <strong style="color:#1e293b;">${firstName}</strong>. Não conseguimos processar o pagamento
      de <strong>${amountFormatted}</strong> da sua assinatura BuildSphere.
    </p>

    ${infoBox("⚠️", "Seu site permanece ativo por enquanto. Atualize seu meio de pagamento para evitar a interrupção do serviço.", "#fefce8", "#fde047", "#a16207")}

    ${ctaButton("Atualizar método de pagamento", "https://bsph.com.br/admin/client/settings?tab=plano")}

    <p style="margin:24px 0 0;font-size:12px;color:#94a3b8;line-height:1.5;">
      Se o pagamento não for regularizado, sua assinatura poderá ser cancelada automaticamente.
      Em caso de dúvidas, entre em contato com nosso suporte.
    </p>
  `);

  await sendEmail(email, "Falha no pagamento — ação necessária — BuildSphere", html);
}

/* ── Support Tickets ─────────────────────────────────────────────────────── */

const CATEGORY_LABELS: Record<string, string> = {
  suporte:     "Suporte técnico",
  duvida:      "Dúvida",
  faturamento: "Faturamento",
  sugestao:    "Sugestão",
};

/**
 * Sent to the platform admin when a client opens a new ticket.
 */
export async function sendNewTicketEmail(
  adminEmail: string,
  ticket: { id: string; subject: string; category: string; businessName: string },
  panelUrl = "https://bsph.com.br/admin/platform/messages",
): Promise<void> {
  const categoryLabel = CATEGORY_LABELS[ticket.category] ?? ticket.category;

  const html = emailWrapper(`
    <h1 style="margin:0 0 10px;font-size:22px;font-weight:800;color:#0f172a;letter-spacing:-0.5px;">
      Novo chamado aberto 🎫
    </h1>
    <p style="margin:0 0 20px;font-size:15px;color:#64748b;line-height:1.6;">
      <strong style="color:#1e293b;">${ticket.businessName}</strong> abriu um novo chamado de suporte.
    </p>

    ${infoBox("📋", `<strong>Assunto:</strong> ${ticket.subject}<br/><strong>Categoria:</strong> ${categoryLabel}`, "#f8fafc", "#e2e8f0", "#475569")}

    ${ctaButton("Ver chamado no painel", `${panelUrl}?ticket=${ticket.id}`)}

    <p style="margin:24px 0 0;font-size:12px;color:#94a3b8;">
      Responda dentro do prazo de SLA para manter a qualidade do atendimento.
    </p>
  `);

  await sendEmail(adminEmail, `Novo chamado: ${ticket.subject} — BuildSphere`, html);
}

/**
 * Sent to the client when the admin replies to their ticket.
 */
export async function sendTicketReplyToClientEmail(
  clientEmail: string,
  ticket: { id: string; subject: string },
  preview: string,
  panelUrl = "https://bsph.com.br/admin/client/messages",
): Promise<void> {
  const safePreview = preview.length > 180 ? preview.slice(0, 177) + "…" : preview;

  const html = emailWrapper(`
    <h1 style="margin:0 0 10px;font-size:22px;font-weight:800;color:#0f172a;letter-spacing:-0.5px;">
      Resposta ao seu chamado 💬
    </h1>
    <p style="margin:0 0 20px;font-size:15px;color:#64748b;line-height:1.6;">
      A equipe BuildSphere respondeu ao seu chamado
      <strong style="color:#1e293b;">&ldquo;${ticket.subject}&rdquo;</strong>.
    </p>

    ${infoBox("💬", safePreview, "#f0f9ff", "#bae6fd", "#0369a1")}

    ${ctaButton("Ver resposta completa", `${panelUrl}?ticket=${ticket.id}`)}

    <p style="margin:24px 0 0;font-size:12px;color:#94a3b8;">
      Você pode responder diretamente pelo painel do cliente.
    </p>
  `);

  await sendEmail(clientEmail, `Resposta ao chamado: ${ticket.subject} — BuildSphere`, html);
}

/**
 * Sent to the platform admin when the client replies to a ticket.
 */
export async function sendTicketReplyToAdminEmail(
  adminEmail: string,
  ticket: { id: string; subject: string; businessName: string },
  preview: string,
  panelUrl = "https://bsph.com.br/admin/platform/messages",
): Promise<void> {
  const safePreview = preview.length > 180 ? preview.slice(0, 177) + "…" : preview;

  const html = emailWrapper(`
    <h1 style="margin:0 0 10px;font-size:22px;font-weight:800;color:#0f172a;letter-spacing:-0.5px;">
      Cliente respondeu ao chamado 🔔
    </h1>
    <p style="margin:0 0 20px;font-size:15px;color:#64748b;line-height:1.6;">
      <strong style="color:#1e293b;">${ticket.businessName}</strong> respondeu ao chamado
      <strong style="color:#1e293b;">&ldquo;${ticket.subject}&rdquo;</strong>.
    </p>

    ${infoBox("💬", safePreview, "#f8fafc", "#e2e8f0", "#475569")}

    ${ctaButton("Responder no painel", `${panelUrl}?ticket=${ticket.id}`)}
  `);

  await sendEmail(adminEmail, `Resposta do cliente: ${ticket.subject} — BuildSphere`, html);
}

/**
 * Sent to the client when the admin changes the ticket status.
 */
export async function sendTicketStatusChangedEmail(
  clientEmail: string,
  fullName: string,
  ticket: { id: string; subject: string },
  newStatus: string,
  panelUrl = "https://bsph.com.br/admin/client/messages",
): Promise<void> {
  const firstName = fullName.trim().split(" ")[0] || "usuário";

  const STATUS_LABELS: Record<string, { label: string; color: string; bg: string; border: string }> = {
    open:           { label: "Aberto",                   color: "#1d4ed8", bg: "#eff6ff", border: "#bfdbfe" },
    in_progress:    { label: "Em andamento",              color: "#a16207", bg: "#fefce8", border: "#fde047" },
    waiting_client: { label: "Aguardando sua resposta",   color: "#b45309", bg: "#fff7ed", border: "#fed7aa" },
    resolved:       { label: "Resolvido ✓",               color: "#15803d", bg: "#f0fdf4", border: "#86efac" },
  };

  const statusInfo = STATUS_LABELS[newStatus] ?? { label: newStatus, color: "#475569", bg: "#f8fafc", border: "#e2e8f0" };

  const html = emailWrapper(`
    <h1 style="margin:0 0 10px;font-size:22px;font-weight:800;color:#0f172a;letter-spacing:-0.5px;">
      Atualização no seu chamado
    </h1>
    <p style="margin:0 0 20px;font-size:15px;color:#64748b;line-height:1.6;">
      Olá, <strong style="color:#1e293b;">${firstName}</strong>! O status do seu chamado foi atualizado.
    </p>

    ${infoBox("📋", `<strong>Chamado:</strong> ${ticket.subject}`, "#f8fafc", "#e2e8f0", "#475569")}

    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:16px 0;">
      <tr>
        <td style="background:${statusInfo.bg};border:1px solid ${statusInfo.border};border-radius:10px;padding:14px 18px;text-align:center;">
          <p style="margin:0;font-size:11px;color:#94a3b8;text-transform:uppercase;letter-spacing:0.08em;">Novo status</p>
          <p style="margin:6px 0 0;font-size:18px;font-weight:800;color:${statusInfo.color};">${statusInfo.label}</p>
        </td>
      </tr>
    </table>

    ${ctaButton("Ver chamado no painel", `${panelUrl}?ticket=${ticket.id}`)}

    <p style="margin:24px 0 0;font-size:12px;color:#94a3b8;">
      Se tiver mais dúvidas, responda diretamente pelo painel.
    </p>
  `);

  await sendEmail(clientEmail, `Chamado atualizado: ${ticket.subject} — BuildSphere`, html);
}
