"use client";

import { Clock, CreditCard, CheckCircle2, Kanban } from "lucide-react";

type DraftRow = {
  id: string;
  status: string;
  created_at: string;
  payload: Record<string, unknown> | null;
};

type PipelineColumn = {
  status: string;
  label: string;
  icon: typeof Clock;
  color: string;
  borderColor: string;
};

const columns: PipelineColumn[] = [
  {
    status: "draft",
    label: "Rascunho",
    icon: Clock,
    color: "text-amber-300",
    borderColor: "border-amber-400/20",
  },
  {
    status: "checkout_pending",
    label: "Checkout pendente",
    icon: CreditCard,
    color: "text-blue-300",
    borderColor: "border-blue-400/20",
  },
  {
    status: "active",
    label: "Ativo",
    icon: CheckCircle2,
    color: "text-emerald-300",
    borderColor: "border-emerald-400/20",
  },
];

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function formatRelative(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return "agora";
  if (hours < 24) return `há ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "há 1 dia";
  return `há ${days} dias`;
}

export function PipelineBoard({ drafts }: { drafts: DraftRow[] }) {
  const grouped = columns.map((col) => ({
    ...col,
    items: drafts.filter((d) => d.status === col.status),
  }));

  // Drafts with unknown status
  const otherDrafts = drafts.filter(
    (d) => !columns.some((c) => c.status === d.status),
  );

  if (drafts.length === 0) {
    return (
      <div className="rounded-xl border border-white/10 bg-[#12182B] p-12 text-center">
        <Kanban size={40} className="mx-auto text-[var(--platform-text)]/20" />
        <p className="mt-3 text-sm text-[var(--platform-text)]/50">
          Nenhum onboarding em andamento.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {grouped.map((col) => {
        const Icon = col.icon;
        return (
          <div key={col.status} className={`rounded-xl border ${col.borderColor} bg-[#12182B] p-4`}>
            {/* Column header */}
            <div className="mb-4 flex items-center gap-2">
              <Icon size={16} className={col.color} />
              <h3 className={`text-sm font-semibold ${col.color}`}>
                {col.label}
              </h3>
              <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-white/10 px-1.5 text-[10px] font-bold text-[var(--platform-text)]/60">
                {col.items.length}
              </span>
            </div>

            {/* Cards */}
            <div className="space-y-2">
              {col.items.length === 0 ? (
                <p className="py-4 text-center text-xs text-[var(--platform-text)]/30">
                  Nenhum item
                </p>
              ) : (
                col.items.map((draft) => {
                  const businessName = asString(
                    draft.payload?.businessName ?? draft.payload?.business_name,
                    "Sem nome",
                  );
                  const subdomain = asString(
                    draft.payload?.preferredSubdomain ?? draft.payload?.preferred_subdomain,
                  );
                  const plan = asString(draft.payload?.selectedPlan ?? draft.payload?.plan);

                  return (
                    <article
                      key={draft.id}
                      className="rounded-lg border border-white/10 bg-[#0B1020] p-3"
                    >
                      <p className="text-sm font-medium text-[var(--platform-text)]">
                        {businessName}
                      </p>
                      {subdomain && (
                        <p className="mt-0.5 font-mono text-[11px] text-[#22D3EE]">
                          {subdomain}.{process.env.NEXT_PUBLIC_PLATFORM_ROOT_DOMAIN || "bsph.com.br"}
                        </p>
                      )}
                      <div className="mt-2 flex items-center justify-between">
                        {plan && (
                          <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-medium text-[var(--platform-text)]/60">
                            {plan}
                          </span>
                        )}
                        <span className="text-[10px] text-[var(--platform-text)]/40">
                          {formatRelative(draft.created_at)}
                        </span>
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
