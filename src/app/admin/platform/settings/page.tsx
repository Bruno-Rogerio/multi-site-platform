import { Settings, UserPlus, KeyRound, ShieldCheck } from "lucide-react";

import { requireUserProfile } from "@/lib/auth/session";
import { createSupabaseServerAuthClient } from "@/lib/supabase/server";
import { CreateUserForm } from "@/components/admin/create-user-form";
import { MfaEnrollment } from "@/components/admin/mfa-enrollment";

type SiteOption = {
  id: string;
  name: string;
  domain: string;
  plan: string;
};

export default async function PlatformSettingsPage() {
  await requireUserProfile(["admin"]);

  const supabase = await createSupabaseServerAuthClient();
  let sites: SiteOption[] = [];

  if (supabase) {
    const { data } = await supabase
      .from("sites")
      .select("id,name,domain,plan")
      .order("name", { ascending: true });
    sites = (data as SiteOption[] | null) ?? [];
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--platform-text)]">Configurações</h1>
        <p className="mt-1 text-sm text-[var(--platform-text)]/60">
          Gerenciamento de usuários e configurações da plataforma.
        </p>
      </div>

      {/* 2FA / MFA */}
      <section className="rounded-2xl border border-white/10 bg-[#12182B] p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10">
            <ShieldCheck size={18} className="text-emerald-400" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-[var(--platform-text)]">Segurança da conta</h2>
            <p className="text-xs text-[var(--platform-text)]/50">
              Configure a autenticação de dois fatores para proteger o acesso de admin.
            </p>
          </div>
        </div>
        <MfaEnrollment />
      </section>

      {/* Create user */}
      <section className="rounded-2xl border border-white/10 bg-[#12182B] p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#22D3EE]/10">
            <UserPlus size={18} className="text-[#22D3EE]" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-[var(--platform-text)]">Convidar usuário</h2>
            <p className="text-xs text-[var(--platform-text)]/50">
              Crie acesso para admins da operação ou clientes vinculados a um site.
            </p>
          </div>
        </div>
        <CreateUserForm sites={sites} mode="all" />
      </section>

      {/* Password / Security info */}
      <section className="rounded-2xl border border-white/10 bg-[#12182B] p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/10">
            <KeyRound size={18} className="text-violet-400" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-[var(--platform-text)]">Recuperação de senha</h2>
            <p className="text-xs text-[var(--platform-text)]/50">
              Como funciona o fluxo de "esqueceu a senha".
            </p>
          </div>
        </div>

        <div className="space-y-3 text-sm text-[var(--platform-text)]/70">
          <div className="flex items-start gap-3 rounded-xl bg-white/[0.03] px-4 py-3">
            <span className="mt-0.5 text-[#22D3EE]">1.</span>
            <p>O usuário acessa <strong className="text-[var(--platform-text)]">/login</strong> e clica em <strong className="text-[var(--platform-text)]">"Recuperar senha"</strong> após digitar o email.</p>
          </div>
          <div className="flex items-start gap-3 rounded-xl bg-white/[0.03] px-4 py-3">
            <span className="mt-0.5 text-[#22D3EE]">2.</span>
            <p>O Supabase envia um email com link seguro de recuperação.</p>
          </div>
          <div className="flex items-start gap-3 rounded-xl bg-white/[0.03] px-4 py-3">
            <span className="mt-0.5 text-[#22D3EE]">3.</span>
            <p>O link redireciona para <strong className="text-[var(--platform-text)]">/auth/callback</strong> → <strong className="text-[var(--platform-text)]">/reset-password</strong> onde o usuário define a nova senha.</p>
          </div>
          <div className="mt-2 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-xs text-amber-300">
            <strong>Configuração necessária no Supabase Dashboard:</strong><br />
            Authentication → URL Configuration → Site URL: <code className="rounded bg-white/10 px-1">https://bsph.com.br</code><br />
            Redirect URLs adicionar: <code className="rounded bg-white/10 px-1">https://bsph.com.br/auth/callback</code>
          </div>
        </div>

        <p className="mt-4 text-xs text-[var(--platform-text)]/40">
          Para resetar a senha de um usuário diretamente, acesse <strong className="text-[var(--platform-text)]/60">Usuários</strong> → menu de ações → "Enviar reset de senha".
        </p>
      </section>
    </div>
  );
}
