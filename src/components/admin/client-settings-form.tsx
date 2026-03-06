"use client";

import { Globe, Mail, Lock, Building2, MessageCircle, Check, AlertCircle, Search, Eye, Receipt } from "lucide-react";
import { useState } from "react";

import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

type BillingProfile = {
  legal_name: string | null;
  address: string | null;
  postal_code: string | null;
  city: string | null;
  state: string | null;
};

type Props = {
  email: string;
  siteName: string;
  siteDomain: string;
  siteId: string;
  selectedPlan?: string;
  themeSettings?: Record<string, unknown>;
  billingProfile?: BillingProfile;
};

type FieldStatus = { type: "success" | "error"; message: string } | null;

export function ClientSettingsForm({ email, siteName, siteDomain, siteId, selectedPlan = "basico", themeSettings = {}, billingProfile }: Props) {
  const isPremium = selectedPlan === "premium-full";

  /* ── Password ── */
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStatus, setPasswordStatus] = useState<FieldStatus>(null);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  /* ── Site name ── */
  const [name, setName] = useState(siteName);
  const [nameStatus, setNameStatus] = useState<FieldStatus>(null);
  const [isSavingName, setIsSavingName] = useState(false);

  /* ── SEO ── */
  const [seoTitle, setSeoTitle] = useState((themeSettings.seoTitle as string) ?? "");
  const [seoDescription, setSeoDescription] = useState((themeSettings.seoDescription as string) ?? "");
  const [seoStatus, setSeoStatus] = useState<FieldStatus>(null);
  const [isSavingSeo, setIsSavingSeo] = useState(false);

  /* ── Footer text ── */
  const [footerText, setFooterText] = useState((themeSettings.footerText as string) ?? "");
  const [footerStatus, setFooterStatus] = useState<FieldStatus>(null);
  const [isSavingFooter, setIsSavingFooter] = useState(false);

  /* ── Branding ── */
  const [hideBranding, setHideBranding] = useState((themeSettings.hideBranding as boolean) ?? false);
  const [brandingStatus, setBrandingStatus] = useState<FieldStatus>(null);
  const [isSavingBranding, setIsSavingBranding] = useState(false);

  /* ── Fiscal data ── */
  const [fiscalLegalName, setFiscalLegalName] = useState(billingProfile?.legal_name ?? "");
  const [fiscalAddress, setFiscalAddress] = useState(billingProfile?.address ?? "");
  const [fiscalPostalCode, setFiscalPostalCode] = useState(billingProfile?.postal_code ?? "");
  const [fiscalCity, setFiscalCity] = useState(billingProfile?.city ?? "");
  const [fiscalState, setFiscalState] = useState(billingProfile?.state ?? "");
  const [fiscalStatus, setFiscalStatus] = useState<FieldStatus>(null);
  const [isSavingFiscal, setIsSavingFiscal] = useState(false);

  async function onSavePassword() {
    setPasswordStatus(null);
    if (!newPassword || newPassword.length < 8) {
      setPasswordStatus({ type: "error", message: "Senha deve ter ao menos 8 caracteres." });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordStatus({ type: "error", message: "As senhas não coincidem." });
      return;
    }
    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      setPasswordStatus({ type: "error", message: "Supabase não configurado." });
      return;
    }
    setIsSavingPassword(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setIsSavingPassword(false);
    if (error) {
      setPasswordStatus({ type: "error", message: error.message });
      return;
    }
    setNewPassword("");
    setConfirmPassword("");
    setPasswordStatus({ type: "success", message: "Senha alterada com sucesso!" });
  }

  async function onSaveName() {
    setNameStatus(null);
    const trimmed = name.trim();
    if (!trimmed || trimmed.length < 2) {
      setNameStatus({ type: "error", message: "Nome deve ter ao menos 2 caracteres." });
      return;
    }
    setIsSavingName(true);
    const res = await fetch("/api/admin/site-settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: trimmed }),
    });
    const payload = (await res.json().catch(() => null)) as
      | { ok?: boolean; error?: string }
      | null;
    setIsSavingName(false);
    if (!res.ok) {
      setNameStatus({ type: "error", message: payload?.error ?? "Erro ao salvar." });
      return;
    }
    setNameStatus({ type: "success", message: "Nome atualizado com sucesso!" });
  }

  async function patchTheme(patch: Record<string, unknown>) {
    // GET current, merge, PATCH
    const getRes = await fetch("/api/admin/site-theme");
    const current = getRes.ok ? ((await getRes.json()) as { themeSettings?: Record<string, unknown> }).themeSettings ?? {} : {};
    const merged = { ...current, ...patch };
    const res = await fetch("/api/admin/site-theme", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ themeSettings: merged }),
    });
    return res;
  }

  async function onSaveSeo() {
    setSeoStatus(null);
    setIsSavingSeo(true);
    const res = await patchTheme({ seoTitle: seoTitle.trim(), seoDescription: seoDescription.trim() });
    setIsSavingSeo(false);
    if (!res.ok) {
      setSeoStatus({ type: "error", message: "Erro ao salvar SEO." });
      return;
    }
    setSeoStatus({ type: "success", message: "SEO atualizado!" });
  }

  async function onSaveFooter() {
    setFooterStatus(null);
    setIsSavingFooter(true);
    const res = await patchTheme({ footerText: footerText.trim() });
    setIsSavingFooter(false);
    if (!res.ok) {
      setFooterStatus({ type: "error", message: "Erro ao salvar." });
      return;
    }
    setFooterStatus({ type: "success", message: "Texto do rodapé salvo!" });
  }

  async function onSaveBranding(value: boolean) {
    setBrandingStatus(null);
    setHideBranding(value);
    setIsSavingBranding(true);
    const res = await patchTheme({ hideBranding: value });
    setIsSavingBranding(false);
    if (!res.ok) {
      setBrandingStatus({ type: "error", message: "Erro ao salvar." });
      return;
    }
    setBrandingStatus({ type: "success", message: value ? "Branding removido!" : "Branding reativado." });
  }

  async function onSaveFiscal() {
    setFiscalStatus(null);
    setIsSavingFiscal(true);
    const res = await fetch("/api/admin/fiscal-profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        legalName: fiscalLegalName.trim(),
        address: fiscalAddress.trim(),
        postalCode: fiscalPostalCode.trim(),
        city: fiscalCity.trim(),
        state: fiscalState.trim(),
      }),
    });
    const payload = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
    setIsSavingFiscal(false);
    if (!res.ok) {
      setFiscalStatus({ type: "error", message: payload?.error ?? "Erro ao salvar." });
      return;
    }
    setFiscalStatus({ type: "success", message: "Dados fiscais atualizados!" });
  }

  const whatsappText = encodeURIComponent(
    `Olá! Quero solicitar a troca do meu subdomínio. Site atual: ${siteDomain} (ID: ${siteId})`,
  );

  return (
    <div className="space-y-5">
      {/* ── Account ── */}
      <section className="rounded-2xl border border-white/10 bg-[#12182B] p-5">
        <div className="flex items-center gap-2 mb-4">
          <Mail size={16} className="text-[var(--platform-text)]/40" />
          <h2 className="text-sm font-semibold text-[var(--platform-text)]">Conta</h2>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#0B1020] px-3 py-2.5">
          <Mail size={14} className="text-[var(--platform-text)]/40 shrink-0" />
          <div>
            <p className="text-[10px] uppercase tracking-wide text-[var(--platform-text)]/40">
              E-mail
            </p>
            <p className="text-sm text-[var(--platform-text)]">{email}</p>
          </div>
        </div>
      </section>

      {/* ── Password ── */}
      <section className="rounded-2xl border border-white/10 bg-[#12182B] p-5">
        <div className="flex items-center gap-2 mb-4">
          <Lock size={16} className="text-[var(--platform-text)]/40" />
          <h2 className="text-sm font-semibold text-[var(--platform-text)]">Alterar senha</h2>
        </div>

        <div className="space-y-3">
          <div>
            <label
              className="text-xs font-semibold uppercase tracking-wide text-[var(--platform-text)]/60"
              htmlFor="new-password"
            >
              Nova senha
            </label>
            <input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Mínimo 8 caracteres"
              className="mt-1 w-full rounded-xl border border-white/15 bg-[#0B1020] px-3 py-2 text-sm text-[var(--platform-text)] outline-none transition focus:border-[#22D3EE]"
            />
          </div>
          <div>
            <label
              className="text-xs font-semibold uppercase tracking-wide text-[var(--platform-text)]/60"
              htmlFor="confirm-password"
            >
              Confirmar nova senha
            </label>
            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repita a nova senha"
              className="mt-1 w-full rounded-xl border border-white/15 bg-[#0B1020] px-3 py-2 text-sm text-[var(--platform-text)] outline-none transition focus:border-[#22D3EE]"
            />
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <button
            type="button"
            onClick={() => void onSavePassword()}
            disabled={isSavingPassword}
            className="rounded-xl bg-[linear-gradient(135deg,#3B82F6,#7C5CFF,#22D3EE)] px-5 py-2 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSavingPassword ? "Salvando..." : "Alterar senha"}
          </button>
          <StatusHint status={passwordStatus} />
        </div>
      </section>

      {/* ── Site name ── */}
      <section className="rounded-2xl border border-white/10 bg-[#12182B] p-5">
        <div className="flex items-center gap-2 mb-4">
          <Building2 size={16} className="text-[var(--platform-text)]/40" />
          <h2 className="text-sm font-semibold text-[var(--platform-text)]">Nome do negócio</h2>
        </div>

        <div>
          <label
            className="text-xs font-semibold uppercase tracking-wide text-[var(--platform-text)]/60"
            htmlFor="site-name"
          >
            Nome exibido no site
          </label>
          <input
            id="site-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={100}
            className="mt-1 w-full rounded-xl border border-white/15 bg-[#0B1020] px-3 py-2 text-sm text-[var(--platform-text)] outline-none transition focus:border-[#22D3EE]"
          />
        </div>

        <div className="mt-4 flex items-center gap-3">
          <button
            type="button"
            onClick={() => void onSaveName()}
            disabled={isSavingName || name.trim() === siteName}
            className="rounded-xl bg-[linear-gradient(135deg,#3B82F6,#7C5CFF,#22D3EE)] px-5 py-2 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSavingName ? "Salvando..." : "Salvar nome"}
          </button>
          <StatusHint status={nameStatus} />
        </div>

        <div className="mt-4 border-t border-white/10 pt-4">
          <label
            className="text-xs font-semibold uppercase tracking-wide text-[var(--platform-text)]/60"
            htmlFor="footer-text"
          >
            Texto do rodapé
          </label>
          <input
            id="footer-text"
            type="text"
            value={footerText}
            onChange={(e) => setFooterText(e.target.value)}
            maxLength={120}
            placeholder={`Ex: © 2025 ${siteName}. Todos os direitos reservados.`}
            className="mt-1 w-full rounded-xl border border-white/15 bg-[#0B1020] px-3 py-2 text-sm text-[var(--platform-text)] outline-none transition focus:border-[#22D3EE]"
          />
          <div className="mt-3 flex items-center gap-3">
            <button
              type="button"
              onClick={() => void onSaveFooter()}
              disabled={isSavingFooter}
              className="rounded-xl bg-[linear-gradient(135deg,#3B82F6,#7C5CFF,#22D3EE)] px-5 py-2 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSavingFooter ? "Salvando..." : "Salvar rodapé"}
            </button>
            <StatusHint status={footerStatus} />
          </div>
        </div>
      </section>

      {/* ── SEO (premium only) ── */}
      {isPremium && (
        <section className="rounded-2xl border border-white/10 bg-[#12182B] p-5">
          <div className="flex items-center gap-2 mb-4">
            <Search size={16} className="text-[var(--platform-text)]/40" />
            <div>
              <h2 className="text-sm font-semibold text-[var(--platform-text)]">SEO — Mecanismos de busca</h2>
              <p className="text-xs text-[var(--platform-text)]/50">Aparece no Google e redes sociais</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-[var(--platform-text)]/60" htmlFor="seo-title">
                Título da página
              </label>
              <input
                id="seo-title"
                type="text"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                maxLength={70}
                placeholder="Ex: Clínica Dra. Ana — Psicologia em SP"
                className="mt-1 w-full rounded-xl border border-white/15 bg-[#0B1020] px-3 py-2 text-sm text-[var(--platform-text)] outline-none transition focus:border-[#22D3EE]"
              />
              <p className="mt-1 text-right text-[10px] text-[var(--platform-text)]/30">{seoTitle.length}/70</p>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-[var(--platform-text)]/60" htmlFor="seo-desc">
                Descrição
              </label>
              <textarea
                id="seo-desc"
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                maxLength={160}
                rows={3}
                placeholder="Uma frase que resume o que você oferece e para quem."
                className="mt-1 w-full resize-none rounded-xl border border-white/15 bg-[#0B1020] px-3 py-2 text-sm text-[var(--platform-text)] outline-none transition focus:border-[#22D3EE]"
              />
              <p className="mt-1 text-right text-[10px] text-[var(--platform-text)]/30">{seoDescription.length}/160</p>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <button
              type="button"
              onClick={() => void onSaveSeo()}
              disabled={isSavingSeo}
              className="rounded-xl bg-[linear-gradient(135deg,#3B82F6,#7C5CFF,#22D3EE)] px-5 py-2 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-60"
            >
              {isSavingSeo ? "Salvando..." : "Salvar SEO"}
            </button>
            <StatusHint status={seoStatus} />
          </div>
        </section>
      )}

      {/* ── Branding (premium only) ── */}
      {isPremium && (
        <section className="rounded-2xl border border-white/10 bg-[#12182B] p-5">
          <div className="flex items-center gap-2 mb-4">
            <Eye size={16} className="text-[var(--platform-text)]/40" />
            <div>
              <h2 className="text-sm font-semibold text-[var(--platform-text)]">Branding</h2>
              <p className="text-xs text-[var(--platform-text)]/50">Rodapé do seu site</p>
            </div>
          </div>

          <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-white/10 bg-[#0B1020] px-4 py-3">
            <div>
              <p className="text-sm font-medium text-[var(--platform-text)]">
                Remover crédito &quot;Powered by BuildSphere&quot;
              </p>
              <p className="text-xs text-[var(--platform-text)]/50 mt-0.5">
                Oculta o link do rodapé do seu site
              </p>
            </div>
            <button
              type="button"
              onClick={() => void onSaveBranding(!hideBranding)}
              disabled={isSavingBranding}
              className={`relative h-6 w-11 shrink-0 rounded-full transition ${hideBranding ? "bg-[#22D3EE]" : "bg-white/10"}`}
            >
              <div className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all ${hideBranding ? "left-6" : "left-1"}`} />
            </button>
          </label>
          {brandingStatus && (
            <div className="mt-2">
              <StatusHint status={brandingStatus} />
            </div>
          )}
        </section>
      )}

      {/* ── Fiscal data ── */}
      <section className="rounded-2xl border border-white/10 bg-[#12182B] p-5">
        <div className="flex items-center gap-2 mb-4">
          <Receipt size={16} className="text-[var(--platform-text)]/40" />
          <div>
            <h2 className="text-sm font-semibold text-[var(--platform-text)]">Dados fiscais</h2>
            <p className="text-xs text-[var(--platform-text)]/50">Para emissão de nota fiscal de serviços</p>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-[var(--platform-text)]/60" htmlFor="fiscal-legal-name">
              Razão social / Nome completo
            </label>
            <input
              id="fiscal-legal-name"
              type="text"
              value={fiscalLegalName}
              onChange={(e) => setFiscalLegalName(e.target.value)}
              placeholder="Ex: João Silva ou Empresa LTDA"
              className="mt-1 w-full rounded-xl border border-white/15 bg-[#0B1020] px-3 py-2 text-sm text-[var(--platform-text)] outline-none transition focus:border-[#22D3EE]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-[var(--platform-text)]/60" htmlFor="fiscal-postal">
                CEP
              </label>
              <input
                id="fiscal-postal"
                type="text"
                value={fiscalPostalCode}
                onChange={(e) => setFiscalPostalCode(e.target.value.replace(/\D/g, "").replace(/^(\d{5})(\d)/, "$1-$2").slice(0, 9))}
                placeholder="00000-000"
                className="mt-1 w-full rounded-xl border border-white/15 bg-[#0B1020] px-3 py-2 text-sm text-[var(--platform-text)] outline-none transition focus:border-[#22D3EE]"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-[var(--platform-text)]/60" htmlFor="fiscal-state">
                UF
              </label>
              <input
                id="fiscal-state"
                type="text"
                value={fiscalState}
                onChange={(e) => setFiscalState(e.target.value.toUpperCase().slice(0, 2))}
                placeholder="SP"
                maxLength={2}
                className="mt-1 w-full rounded-xl border border-white/15 bg-[#0B1020] px-3 py-2 text-sm text-[var(--platform-text)] outline-none transition focus:border-[#22D3EE]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-[var(--platform-text)]/60" htmlFor="fiscal-address">
              Endereço
            </label>
            <input
              id="fiscal-address"
              type="text"
              value={fiscalAddress}
              onChange={(e) => setFiscalAddress(e.target.value)}
              placeholder="Rua, número, complemento"
              className="mt-1 w-full rounded-xl border border-white/15 bg-[#0B1020] px-3 py-2 text-sm text-[var(--platform-text)] outline-none transition focus:border-[#22D3EE]"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-[var(--platform-text)]/60" htmlFor="fiscal-city">
              Cidade
            </label>
            <input
              id="fiscal-city"
              type="text"
              value={fiscalCity}
              onChange={(e) => setFiscalCity(e.target.value)}
              placeholder="São Paulo"
              className="mt-1 w-full rounded-xl border border-white/15 bg-[#0B1020] px-3 py-2 text-sm text-[var(--platform-text)] outline-none transition focus:border-[#22D3EE]"
            />
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <button
            type="button"
            onClick={() => void onSaveFiscal()}
            disabled={isSavingFiscal}
            className="rounded-xl bg-[linear-gradient(135deg,#3B82F6,#7C5CFF,#22D3EE)] px-5 py-2 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSavingFiscal ? "Salvando..." : "Salvar dados fiscais"}
          </button>
          <StatusHint status={fiscalStatus} />
        </div>
      </section>

      {/* ── Subdomain ── */}
      <section className="rounded-2xl border border-white/10 bg-[#12182B] p-5">
        <div className="flex items-center gap-2 mb-4">
          <Globe size={16} className="text-[var(--platform-text)]/40" />
          <h2 className="text-sm font-semibold text-[var(--platform-text)]">Subdomínio</h2>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#0B1020] px-3 py-2.5">
          <Globe size={14} className="text-[#22D3EE] shrink-0" />
          <div>
            <p className="text-[10px] uppercase tracking-wide text-[var(--platform-text)]/40">
              Endereço atual
            </p>
            <p className="font-mono text-sm text-[#22D3EE]">{siteDomain}</p>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-violet-400/20 bg-violet-500/5 p-4">
          <p className="text-sm font-semibold text-violet-200">
            Trocar subdomínio — R$&nbsp;19,90
          </p>
          <p className="mt-1 text-xs text-[var(--platform-text)]/50">
            A troca de subdomínio é feita manualmente pela nossa equipe. Entre em
            contato pelo WhatsApp com o novo subdomínio desejado.
          </p>
          <a
            href={`https://wa.me/5511999999999?text=${whatsappText}`}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex items-center gap-2 rounded-lg bg-[#25D366]/10 border border-[#25D366]/30 px-4 py-2 text-sm font-semibold text-[#25D366] transition hover:bg-[#25D366]/20"
          >
            <MessageCircle size={15} />
            Solicitar via WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
}

function StatusHint({ status }: { status: FieldStatus }) {
  if (!status) return null;
  if (status.type === "success") {
    return (
      <span className="flex items-center gap-1.5 text-xs text-emerald-300">
        <Check size={13} />
        {status.message}
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1.5 text-xs text-red-300">
      <AlertCircle size={13} />
      {status.message}
    </span>
  );
}
