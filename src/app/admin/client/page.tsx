import Link from "next/link";
import {
  PenTool,
  Paintbrush,
  ExternalLink,
  Globe,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";

import { requireUserProfile } from "@/lib/auth/session";
import { createSupabaseServerAuthClient } from "@/lib/supabase/server";

type SiteInfo = {
  id: string;
  name: string;
  domain: string;
  plan: string;
};

const quickLinks = [
  { label: "Editar conteúdo", href: "/admin/client/editor", icon: PenTool },
  { label: "Mudar aparência", href: "/admin/client/appearance", icon: Paintbrush },
];

export default async function ClientAdminPage() {
  const profile = await requireUserProfile(["client"]);
  const supabase = await createSupabaseServerAuthClient();

  let site: SiteInfo | null = null;
  if (supabase && profile.site_id) {
    const { data } = await supabase
      .from("sites")
      .select("id,name,domain,plan")
      .eq("id", profile.site_id)
      .maybeSingle<SiteInfo>();
    site = data;
  }

  const planLabel = site?.plan === "pro" ? "Premium Full" : "Essencial";

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-8">
      {/* Welcome */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--platform-text)]">Painel do cliente</h1>
        <p className="mt-1 text-sm text-[var(--platform-text)]/60">
          Gerencie o conteúdo e a identidade do seu site.
        </p>
      </div>

      {/* Site health card */}
      {site ? (
        <section className="rounded-xl border border-white/10 bg-[#12182B] p-5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#22D3EE]/10">
                <Globe size={20} className="text-[#22D3EE]" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-[var(--platform-text)]">{site.name}</h2>
                <p className="text-xs text-[var(--platform-text)]/60">{site.domain}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Ativo
              </span>
              <span className="flex items-center gap-1 rounded-full border border-purple-400/30 bg-purple-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-purple-300">
                <Sparkles size={10} />
                {planLabel}
              </span>
            </div>
          </div>

          {/* View site link */}
          <a
            href={`https://${site.domain}`}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2 text-xs font-medium text-[var(--platform-text)]/70 transition hover:border-[#22D3EE]/30 hover:text-[var(--platform-text)]"
          >
            <ExternalLink size={14} className="text-[#22D3EE]" />
            Ver meu site
          </a>
        </section>
      ) : (
        <section className="rounded-xl border border-white/10 bg-[#12182B] p-8 text-center">
          <Globe size={40} className="mx-auto text-[var(--platform-text)]/20" />
          <p className="mt-3 text-sm text-[var(--platform-text)]/50">
            Nenhum site vinculado à sua conta.
          </p>
        </section>
      )}

      {/* Quick links */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {quickLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#12182B] p-5 transition hover:border-[#22D3EE]/30 hover:bg-[#22D3EE]/5"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#22D3EE]/10">
                <Icon size={20} className="text-[#22D3EE]" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-[var(--platform-text)]">{link.label}</p>
                <p className="text-xs text-[var(--platform-text)]/50">
                  {link.href === "/admin/client/editor"
                    ? "Textos, imagens e seções do site"
                    : "Cores, fontes e estilo visual"}
                </p>
              </div>
              <ArrowUpRight size={16} className="text-[var(--platform-text)]/30" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
