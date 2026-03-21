"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import {
  Loader2, Globe, ExternalLink, Clock, CheckCircle2, ChevronRight, Sparkles,
  Eye, EyeOff, User, Lock, Mail, RefreshCw,
} from "lucide-react";
import { useWizard } from "../wizard-context";
import { formatPrice } from "@/lib/onboarding/pricing";
import { validatePassword } from "@/lib/onboarding/validation";

function resolveRootDomain(): string {
  return process.env.NEXT_PUBLIC_PLATFORM_ROOT_DOMAIN ?? "bsph.com.br";
}

function buildPublishUrl(siteId: string): string {
  return `https://${resolveRootDomain()}/publicar/${siteId}`;
}

function slugFromName(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 25);
}

type Phase = "summary" | "register" | "creating" | "verify-email" | "ready";

export function FinalizeStep() {
  const { state, dispatch, monthlyTotal } = useWizard();
  const {
    selectedPlan, businessName, businessSegment, preferredSubdomain,
    ownerEmail, selectedTemplateSlug, paletteId, customColors,
    fontFamily, heroVariant, servicesVariant, ctaVariant, motionStyle,
    headerStyle, dividerStyle, buttonStyle, content, serviceCards,
    heroImage, logoUrl, addonsSelected, ctaConfig, selectedCtaTypes,
    contactSelectedLinks, enabledSections, floatingCtaEnabled, floatingCtaChannels,
    testimonialsVariant, galleryVariant, faqVariant, blogVariant, eventsVariant,
    contactVariant,
  } = state;

  const [phase, setPhase] = useState<Phase>("summary");
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const [previewUrl, setPreviewUrl] = useState("");
  const [siteId, setSiteId] = useState("");
  const [finalSubdomain, setFinalSubdomain] = useState(preferredSubdomain);
  const [error, setError] = useState<string | null>(null);

  // Registration fields
  const [fullName, setFullName] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [ownerId, setOwnerId] = useState("");

  // Resend state
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  // Email correction state (verify-email phase)
  const [editingEmail, setEditingEmail] = useState(false);
  const [emailDraft, setEmailDraft] = useState("");

  const passwordValidation = validatePassword(regPassword);
  const canRegister =
    fullName.trim().length >= 2 &&
    passwordValidation.valid &&
    !isRegistering;

  const planLabel = selectedPlan === "basico" ? "Básico" : "Premium";

  const planPrice = formatPrice(monthlyTotal);

  function deriveCreationMode(): "template" | "builder-premium" {
    if (selectedPlan === "basico") return "template";
    return "builder-premium";
  }

  async function handleRegister() {
    if (!canRegister) return;
    setIsRegistering(true);
    setError(null);

    try {
      const res = await fetch("/api/onboarding/register-owner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: ownerEmail,
          password: regPassword,
          fullName: fullName.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 409) {
          // E-mail já cadastrado — cria o rascunho sem vincular (usuário pode logar depois)
          await handleCreateDemo("");
          return;
        }
        setError(data.error || "Erro ao criar conta.");
        return;
      }
      const userId = data.userId ?? "";
      setOwnerId(userId);

      // Create the draft (doesn't require user to be signed in — uses admin client)
      await handleCreateDemo(userId);
    } catch {
      setError("Falha de conexão. Tente novamente.");
    } finally {
      setIsRegistering(false);
    }
  }

  async function handleCreateDemo(ownerUserIdOverride?: string) {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    setPhase("creating");
    setError(null);

    const mergedContent = {
      ...content,
      servicesItems: serviceCards
        .map((c) => c.title)
        .filter((t) => t?.trim())
        .join("\n"),
      serviceCardsJson: JSON.stringify(
        serviceCards.map((c) => ({
          title: c.title || "",
          description: c.description || "",
          iconName: c.iconName || c.icon || "",
          imageUrl: c.imageUrl || "",
          imageObjectPosition: (c as Record<string, unknown>).objectPosition as string || "50% 50%",
        }))
      ),
      contactSelectedLinks: JSON.stringify(contactSelectedLinks),
    };

    const subdomain = preferredSubdomain || slugFromName(businessName);

    const draftPayload = {
      creationMode: deriveCreationMode(),
      siteStyle: paletteId,
      paletteId,
      customColors,
      fontFamily,
      headerStyle,
      dividerStyle,
      heroStyle: heroVariant,
      servicesStyle: servicesVariant,
      ctaStyle: ctaVariant,
      motionStyle,
      buttonStyle,
      addonsSelected,
      businessName,
      businessSegment,
      preferredSubdomain: subdomain,
      selectedPlan: selectedPlan ?? "",
      ownerEmail,
      ownerUserId: ownerUserIdOverride ?? ownerId,
      content: mergedContent,
      heroImage,
      logoUrl,
      ctaConfig,
      selectedCtaTypes,
      floatingCtaEnabled,
      floatingCtaChannels,
      enabledSections,
      testimonialsVariant,
      galleryVariant,
      faqVariant,
      blogVariant,
      eventsVariant,
      contactVariant,
    };

    try {
      const res = await fetch("/api/onboarding/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draftPayload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erro ao criar demonstração.");
        setPhase("summary");
        return;
      }

      const rootDomain = resolveRootDomain();
      const domainUsed = data.domain || `${subdomain}.${rootDomain}`;
      const url = `https://${domainUsed}`;

      setSiteId(data.siteId);
      setFinalSubdomain(domainUsed.split(".")[0]);
      setPreviewUrl(url);

      dispatch({ type: "SET_DRAFT", siteId: data.siteId, url });

      // Email verification required before accessing admin
      setPhase("verify-email");
    } catch {
      setError("Falha de conexão. Verifique sua internet e tente novamente.");
      setPhase("register");
    }
  }

  async function handleResendVerification(emailOverride?: string) {
    if (isResending) return;
    setIsResending(true);
    setResendSuccess(false);
    try {
      await fetch("/api/onboarding/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailOverride ?? ownerEmail }),
      });
      setResendSuccess(true);
    } catch {
      // Silent — UI already shows the instruction
    } finally {
      setIsResending(false);
    }
  }

  function handleConfirmEmailChange() {
    const trimmed = emailDraft.trim().toLowerCase();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return;
    dispatch({ type: "SET_CHECKOUT_FIELD", key: "ownerEmail", value: trimmed });
    setEditingEmail(false);
    setResendSuccess(false);
    void handleResendVerification(trimmed);
  }

  // ─── Verify-email phase ──────────────────────────────────────────────────
  if (phase === "verify-email") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="mx-auto w-full max-w-lg"
      >
        {/* Header */}
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#22D3EE]/10">
            <Mail size={28} className="text-[#22D3EE]" />
          </div>
          <h1 className="text-2xl font-bold text-[#EAF0FF]">Confirme seu e-mail</h1>
          <p className="mt-2 text-sm leading-relaxed text-[#EAF0FF]/60">
            Enviamos um link de verificação para
            <br />
            <strong className="text-[#22D3EE]">{ownerEmail}</strong>
          </p>
          {editingEmail ? (
            <div className="mt-3 flex items-center gap-2">
              <input
                type="email"
                value={emailDraft}
                onChange={(e) => setEmailDraft(e.target.value)}
                placeholder="novo@email.com"
                autoFocus
                className="flex-1 rounded-lg border border-white/10 bg-white/[0.05] px-3 py-1.5 text-sm text-[#EAF0FF] outline-none focus:border-[#22D3EE]/50"
              />
              <button
                onClick={handleConfirmEmailChange}
                className="rounded-lg bg-[#22D3EE] px-3 py-1.5 text-xs font-bold text-[#0B1020] transition hover:bg-[#06B6D4]"
              >
                Confirmar
              </button>
              <button
                onClick={() => setEditingEmail(false)}
                className="text-xs text-[#EAF0FF]/40 transition hover:text-[#EAF0FF]"
              >
                Cancelar
              </button>
            </div>
          ) : (
            <button
              onClick={() => { setEmailDraft(ownerEmail); setEditingEmail(true); }}
              className="mt-2 text-xs text-[#EAF0FF]/40 underline transition hover:text-[#EAF0FF]/70"
            >
              E-mail incorreto? Alterar
            </button>
          )}
        </div>

        {/* Preview URL card */}
        <div className="mb-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
          <div className="flex items-center gap-2 mb-3">
            <Globe size={14} className="text-emerald-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              Sua demonstração está pronta
            </span>
          </div>
          <div className="flex items-center gap-3">
            <code className="flex-1 truncate rounded-lg bg-[#0B1020]/60 px-3 py-2 text-sm text-[#22D3EE]">
              {previewUrl}
            </code>
            <a
              href={previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex shrink-0 items-center gap-1.5 rounded-lg bg-emerald-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-400"
            >
              <ExternalLink size={13} />
              Abrir
            </a>
          </div>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-[#EAF0FF]/40">
            <Clock size={11} />
            <span>Demonstração expira em 48 horas após a publicação.</span>
          </div>
        </div>

        {/* Verification instructions */}
        <div className="rounded-2xl border border-[#22D3EE]/20 bg-[#22D3EE]/5 p-5">
          <p className="text-sm font-semibold text-[#EAF0FF] mb-2">
            Próximo passo: verificar seu e-mail
          </p>
          <ol className="space-y-2 text-sm text-[#EAF0FF]/60 list-decimal list-inside">
            <li>Abra sua caixa de entrada (ou a pasta de spam)</li>
            <li>Clique em <strong className="text-[#EAF0FF]/80">"Confirmar e-mail e acessar painel"</strong></li>
            <li>Você será redirecionado ao seu painel automaticamente</li>
          </ol>

          <div className="mt-4 border-t border-white/10 pt-4">
            <p className="text-xs text-[#EAF0FF]/40 mb-2">Não recebeu o e-mail?</p>
            {resendSuccess ? (
              <div className="flex items-center gap-2 text-xs text-emerald-400">
                <CheckCircle2 size={13} />
                Novo link enviado para {ownerEmail}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => void handleResendVerification()}
                disabled={isResending}
                className="flex items-center gap-2 text-xs font-semibold text-[#22D3EE] transition hover:text-[#06B6D4] disabled:opacity-50"
              >
                <RefreshCw size={13} className={isResending ? "animate-spin" : ""} />
                {isResending ? "Enviando..." : "Reenviar e-mail de verificação"}
              </button>
            )}
          </div>
        </div>

        {/* Publish CTA */}
        {siteId && (
          <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
            <p className="mb-2 text-xs text-[#EAF0FF]/50">
              Pronto para publicar? Você pode ir diretamente ao pagamento:
            </p>
            <a
              href={buildPublishUrl(siteId)}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#3B82F6] to-[#7C5CFF] px-6 py-3 text-sm font-bold text-white transition hover:opacity-90"
            >
              <Sparkles size={14} />
              Publicar agora — {planPrice}/mês
              <ChevronRight size={14} />
            </a>
          </div>
        )}
      </motion.div>
    );
  }

  if (phase === "ready") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="mx-auto w-full max-w-lg"
      >
        {/* Success header */}
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15">
            <CheckCircle2 size={28} className="text-emerald-400" />
          </div>
          <h1 className="text-2xl font-bold text-[#EAF0FF]">Seu site está no ar!</h1>
          <p className="mt-1.5 text-sm text-[#EAF0FF]/60">
            Você tem <strong className="text-[#22D3EE]">48 horas</strong> para publicar antes de expirar.
          </p>
        </div>

        {/* Preview URL card */}
        <div className="mb-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
          <div className="flex items-center gap-2 mb-3">
            <Globe size={14} className="text-emerald-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              Endereço da demonstração
            </span>
          </div>
          <div className="flex items-center gap-3">
            <code className="flex-1 truncate rounded-lg bg-[#0B1020]/60 px-3 py-2 text-sm text-[#22D3EE]">
              {previewUrl}
            </code>
            <a
              href={previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex shrink-0 items-center gap-1.5 rounded-lg bg-emerald-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-400"
            >
              <ExternalLink size={13} />
              Abrir
            </a>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-[#EAF0FF]/40">
            <Clock size={11} />
            <span>Demonstração gratuita — expira em 48 horas. O site mostrará um timer para o visitante.</span>
          </div>
        </div>

        {/* Next step */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <p className="mb-3 text-sm font-semibold text-[#EAF0FF]">Pronto para publicar?</p>
          <p className="mb-4 text-xs text-[#EAF0FF]/50">
            Acesse a demonstração e clique em <strong className="text-[#EAF0FF]/80">"Publicar meu site"</strong> no banner do topo,
            ou clique abaixo para ir direto ao pagamento.
          </p>
          <a
            href={buildPublishUrl(siteId)}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#3B82F6] to-[#7C5CFF] px-6 py-3.5 text-sm font-bold text-white transition hover:opacity-90"
          >
            <Sparkles size={15} />
            Publicar meu site — {planPrice}/mês
            <ChevronRight size={15} />
          </a>
        </div>
      </motion.div>
    );
  }

  // Creating phase — spinner while API call runs
  if (phase === "creating") {
    if (!mounted) return null;
    return createPortal(
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-[200] flex items-center justify-center bg-[#06080F]"
      >
        {/* Background orbs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-[10%] top-[15%] h-[400px] w-[400px] rounded-full bg-[#22D3EE]/8 blur-[120px]" />
          <div className="absolute right-[5%] bottom-[10%] h-[500px] w-[500px] rounded-full bg-[#7C5CFF]/8 blur-[140px]" />
        </div>
        <div className="relative z-10 flex flex-col items-center px-6 text-center">
          {/* Animated ring */}
          <div className="relative flex h-20 w-20 items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-[#22D3EE]/10 animate-ping" style={{ animationDuration: "1.5s" }} />
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-[#22D3EE]/10">
              <Loader2 size={36} className="animate-spin text-[#22D3EE]" />
            </div>
          </div>
          <p className="mt-6 text-xl font-bold text-[#EAF0FF]">Construindo seu site…</p>
          <p className="mt-2 text-sm text-[#EAF0FF]/50 max-w-xs">
            Estamos montando as seções, configurando o visual e preparando sua demonstração.
          </p>
          <div className="mt-8 flex flex-col items-center gap-2">
            {["Configurando visual", "Criando seções", "Gerando demonstração"].map((step, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.5, duration: 0.3 }}
                className="flex items-center gap-2 text-xs text-[#EAF0FF]/40"
              >
                <div className="h-1.5 w-1.5 rounded-full bg-[#22D3EE]/60" />
                {step}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>,
      document.body
    );
  }

  // Register phase
  if (phase === "register") {
    return (
      <RegisterPhase
        ownerEmail={ownerEmail}
        fullName={fullName}
        setFullName={setFullName}
        regPassword={regPassword}
        setRegPassword={setRegPassword}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        canRegister={canRegister}
        isRegistering={isRegistering}
        error={error}
        onBack={() => { setError(null); setPhase("summary"); }}
        onSubmit={handleRegister}
      />
    );
  }

  // Summary phase
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="mx-auto w-full max-w-lg"
    >
      {/* Header */}
      <div className="mb-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#22D3EE]">
          Quase lá
        </p>
        <h1 className="mt-2 text-2xl font-black text-[#EAF0FF]">
          Confirme e crie sua demonstração
        </h1>
        <p className="mt-2 text-sm text-[#EAF0FF]/60">
          Veja seu site online em segundos — sem precisar pagar agora.
        </p>
      </div>

      {/* Summary */}
      <div className="mb-5 space-y-2">
        <SummaryRow label="Negócio" value={businessName || "—"} />
        <SummaryRow label="Subdomínio" value={
          preferredSubdomain ? `${preferredSubdomain}.${resolveRootDomain()}` : `auto-gerado`
        } />
        <SummaryRow label="Plano" value={`${planLabel} — ${planPrice}/mês`} />
        {selectedTemplateSlug && <SummaryRow label="Template" value={selectedTemplateSlug} />}
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Continue to register */}
      <button
        onClick={() => { setError(null); setPhase("register"); }}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#22D3EE] px-6 py-4 text-sm font-bold text-[#0B1020] transition hover:bg-[#06B6D4]"
      >
        <Globe size={16} />
        Criar minha conta e demonstração
        <ChevronRight size={15} />
      </button>

      <p className="mt-3 text-center text-xs text-[#EAF0FF]/30">
        Nenhum pagamento necessário agora. Você tem 48h para ver e publicar.
      </p>
    </motion.div>
  );
}

// Registration phase
function RegisterPhase({
  ownerEmail,
  fullName,
  setFullName,
  regPassword,
  setRegPassword,
  showPassword,
  setShowPassword,
  canRegister,
  isRegistering,
  error,
  onBack,
  onSubmit,
}: {
  ownerEmail: string;
  fullName: string;
  setFullName: (v: string) => void;
  regPassword: string;
  setRegPassword: (v: string) => void;
  showPassword: boolean;
  setShowPassword: (v: boolean) => void;
  canRegister: boolean;
  isRegistering: boolean;
  error: string | null;
  onBack: () => void;
  onSubmit: () => void;
}) {
  const pw = validatePassword(regPassword);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mx-auto w-full max-w-lg"
    >
      <div className="mb-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#22D3EE]">
          Crie sua conta
        </p>
        <h1 className="mt-2 text-2xl font-black text-[#EAF0FF]">
          Um cadastro rápido para salvar seu site
        </h1>
        <p className="mt-2 text-sm text-[#EAF0FF]/60">
          Seu site ficará vinculado a esta conta. Só você poderá acessar a demonstração.
        </p>
      </div>

      <div className="space-y-4">
        {/* Email (readonly) */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#EAF0FF]/50">
            E-mail
          </label>
          <input
            type="email"
            value={ownerEmail}
            readOnly
            className="w-full rounded-lg border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-[#EAF0FF]/60 outline-none"
          />
        </div>

        {/* Full name */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#EAF0FF]/50">
            Seu nome
          </label>
          <div className="relative">
            <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#EAF0FF]/30" />
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Como você se chama?"
              autoFocus
              className="w-full rounded-lg border border-white/10 bg-white/[0.04] py-3 pl-9 pr-4 text-sm text-[#EAF0FF] placeholder-white/20 outline-none transition focus:border-[#3B82F6]/60 focus:bg-white/[0.07]"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#EAF0FF]/50">
            Crie uma senha
          </label>
          <div className="relative">
            <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#EAF0FF]/30" />
            <input
              type={showPassword ? "text" : "password"}
              value={regPassword}
              onChange={(e) => setRegPassword(e.target.value)}
              placeholder="Mín. 10 caracteres"
              className="w-full rounded-lg border border-white/10 bg-white/[0.04] py-3 pl-9 pr-10 text-sm text-[#EAF0FF] placeholder-white/20 outline-none transition focus:border-[#3B82F6]/60 focus:bg-white/[0.07]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#EAF0FF]/40 hover:text-[#EAF0FF]/70"
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          {regPassword && !pw.valid && (
            <p className="mt-1 text-xs text-red-400">
              Use 10+ caracteres com maiúscula, minúscula, número e símbolo
            </p>
          )}
        </div>

        {/* Verification notice */}
        <div className="rounded-lg border border-[#22D3EE]/20 bg-[#22D3EE]/5 px-4 py-3">
          <p className="flex items-center gap-2 text-xs text-[#22D3EE]">
            <Mail size={13} />
            Um link de verificação será enviado para <strong>{ownerEmail}</strong>
          </p>
        </div>

        {error && (
          <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <button
          onClick={onSubmit}
          disabled={!canRegister}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#3B82F6] to-[#7C5CFF] px-6 py-4 text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isRegistering ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Criando conta e site...
            </>
          ) : (
            <>
              <CheckCircle2 size={16} />
              Criar conta e ver demonstração
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onBack}
          className="w-full text-center text-xs text-[#EAF0FF]/40 transition hover:text-[#EAF0FF]/70"
        >
          ← Voltar ao resumo
        </button>
      </div>
    </motion.div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-white/8 bg-white/[0.02] px-4 py-2.5">
      <span className="text-xs text-[#EAF0FF]/50">{label}</span>
      <span className="text-xs font-medium text-[#EAF0FF]">{value}</span>
    </div>
  );
}


