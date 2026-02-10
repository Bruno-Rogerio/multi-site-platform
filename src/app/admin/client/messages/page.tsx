import { MessageSquare } from "lucide-react";

import { requireUserProfile } from "@/lib/auth/session";

export default async function ClientMessagesPage() {
  await requireUserProfile(["client"]);

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--platform-text)]">Mensagens</h1>
        <p className="mt-1 text-sm text-[var(--platform-text)]/60">
          Acompanhe as mensagens enviadas pelos visitantes do seu site.
        </p>
      </div>

      <section className="rounded-xl border border-white/10 bg-[#12182B] p-12 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#22D3EE]/10">
          <MessageSquare size={32} className="text-[#22D3EE]" />
        </div>
        <h2 className="mt-4 text-lg font-semibold text-[var(--platform-text)]">
          Em breve
        </h2>
        <p className="mx-auto mt-2 max-w-sm text-sm text-[var(--platform-text)]/50">
          Receba e gerencie as mensagens dos visitantes diretamente aqui.
          Esse recurso está em desenvolvimento.
        </p>
      </section>
    </div>
  );
}
