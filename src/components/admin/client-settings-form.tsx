"use client";

import { Globe, Mail, Lock, Building2, MessageCircle, Check, AlertCircle } from "lucide-react";
import { useState } from "react";

import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

type Props = {
  email: string;
  siteName: string;
  siteDomain: string;
  siteId: string;
};

type FieldStatus = { type: "success" | "error"; message: string } | null;

export function ClientSettingsForm({ email, siteName, siteDomain, siteId }: Props) {
  /* ── Password ── */
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStatus, setPasswordStatus] = useState<FieldStatus>(null);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  /* ── Site name ── */
  const [name, setName] = useState(siteName);
  const [nameStatus, setNameStatus] = useState<FieldStatus>(null);
  const [isSavingName, setIsSavingName] = useState(false);

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
