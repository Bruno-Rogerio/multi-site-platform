"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Loader2, Globe, ExternalLink, Clock, CheckCircle2, ChevronRight, Sparkles,
  Eye, EyeOff, User, Lock,
} from "lucide-react";
import { useWizard } from "../wizard-context";
import { PLAN_PRICE_IDS } from "@/lib/onboarding/plans";
import { formatPrice } from "@/lib/onboarding/pricing";
import { validatePassword } from "@/lib/onboarding/validation";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

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

type Phase = "summary" | "register" | "creating" | "ready";

export function FinalizeStep() {
  const { state, dispatch, monthlyTotal } = useWizard();
  const {
    selectedPlan, businessName, businessSegment, preferredSubdomain,
    ownerEmail, selectedTemplateSlug, paletteId, customColors,
    fontFamily, heroVariant, servicesVariant, ctaVariant, motionStyle,
    headerStyle, dividerStyle, buttonStyle, content, serviceCards,
    heroImage, logoUrl, addonsSelected, ctaConfig, selectedCtaTypes,
    contactSelectedLinks,
  } = state;

  const [phase, setPhase] = useState<Phase>("summary");
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

  const passwordValidation = validatePassword(regPassword);
  const canRegister =
    fullName.trim().length >= 2 &&
    passwordValidation.valid &&
    !isRegistering;

  const planLabel =
    selectedPlan === "basico" ? "Básico" :
    selectedPlan === "construir" ? "Construir" : "Premium Full";

  const planPrice = formatPrice(monthlyTotal);

  function deriveCreationMode(): "template" | "builder" | "builder-premium" {
    if (selectedPlan === "basico") return "template";
    if (selectedPlan === "premium-full") return "builder-premium";
    return "builder";
  }

  async function handleRegister() {
    if (!canRegister) return;
    setIsRegistering(true);
    setError(null);

    try {
      const res = await fetch("/api/onboarding/register-owner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: ownerEmail, password: regPassword, fullName: fullName.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Erro ao criar conta.");
        return;
      }
      setOwnerId(data.userId ?? "");

      // Sign in automatically after registration
      const supabase = createSupabaseBrowserClient();
      if (supabase) {
        await supabase.auth.signInWithPassword({ email: ownerEmail, password: regPassword });
      }

      // Proceed to create draft
      await handleCreateDemo(data.userId ?? "");
    } catch {
      setError("Falha de conexão. Tente novamente.");
    } finally {
      setIsRegistering(false);
    }
  }

  async function handleCreateDemo(ownerUserIdOverride?: string) {
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
      setPhase("ready");
    } catch {
      setError("Falha de conexão. Verifique sua internet e tente novamente.");
      setPhase("register");
    }
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

          {/* Timer info */}
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
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mx-auto flex w-full max-w-lg flex-col items-center py-16 text-center"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#22D3EE]/10">
          <Loader2 size={30} className="animate-spin text-[#22D3EE]" />
        </div>
        <p className="mt-5 text-lg font-semibold text-[#EAF0FF]">Criando seu site...</p>
        <p className="mt-2 text-sm text-[#EAF0FF]/50">Aguarde enquanto preparamos sua demonstração</p>
      </motion.div>
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
