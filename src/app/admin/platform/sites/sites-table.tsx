"use client";

import { useEffect, useRef, useState } from "react";
import { Copy, ExternalLink, Globe, Hash, MoreVertical, PauseCircle, PlayCircle, AlertTriangle } from "lucide-react";

import { DataTable } from "@/components/admin/data-table";
import { useToast } from "@/components/admin/toast-provider";

const PLAN_LABELS: Record<string, string> = {
  basico:         "Básico",
  construir:      "Construir",
  "premium-full": "Premium",
  landing:        "Landing",
  pro:            "Pro",
};

type SiteRow = {
  id: string;
  name: string;
  domain: string;
  plan: string;
  theme_settings: Record<string, unknown> | null;
  billing_status: string | null;
  created_at: string;
};

function isSuspended(row: SiteRow) {
  return row.theme_settings?.suspended === true;
}

function StatusBadge({ row }: { row: SiteRow }) {
  if (isSuspended(row)) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-red-400/30 bg-red-500/10 px-2 py-0.5 text-[10px] font-semibold text-red-300">
        <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
        Suspenso
      </span>
    );
  }
  if (row.billing_status === "active") {
    return (
      <span className="inline-flex rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
        Ativo
      </span>
    );
  }
  if (!row.billing_status || row.billing_status === "trial") {
    return (
      <span className="inline-flex rounded-full border border-amber-400/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-300">
        Trial
      </span>
    );
  }
  return (
    <span className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10px] font-semibold text-[var(--platform-text)]/40">
      Inativo
    </span>
  );
}

function PlanBadge({ theme_settings, plan }: { theme_settings: Record<string, unknown> | null; plan: string }) {
  const selectedPlan = theme_settings?.selectedPlan as string | undefined;
  const label = PLAN_LABELS[selectedPlan ?? ""] ?? PLAN_LABELS[plan] ?? plan;
  const isPremium = selectedPlan === "premium-full" || plan === "pro";
  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] ${
        isPremium
          ? "border border-purple-400/30 bg-purple-500/10 text-purple-300"
          : "border border-blue-400/30 bg-blue-500/10 text-blue-300"
      }`}
    >
      {label}
    </span>
  );
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function SiteActionsDropdown({
  row,
  onSuspendToggle,
}: {
  row: SiteRow;
  onSuspendToggle: (siteId: string, suspend: boolean) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const suspended = isSuspended(row);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setConfirming(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function copy(text: string, label: string) {
    navigator.clipboard.writeText(text).then(() => {
      toast(`${label} copiado!`, "success");
      setOpen(false);
    });
  }

  async function handleSuspendToggle() {
    setLoading(true);
    try {
      await onSuspendToggle(row.id, !suspended);
      toast(suspended ? `${row.name} reativado.` : `${row.name} suspenso.`, "success");
    } catch {
      toast("Não foi possível alterar o status.", "error");
    } finally {
      setLoading(false);
      setConfirming(false);
      setOpen(false);
    }
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => { setOpen(!open); setConfirming(false); }}
        className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--platform-text)]/40 transition hover:bg-white/[0.06] hover:text-[var(--platform-text)]"
      >
        <MoreVertical size={14} />
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-1 w-52 overflow-hidden rounded-xl border border-white/10 bg-[#12182B] shadow-xl">
          <a
            href={`https://${row.domain}`}
            target="_blank"
            rel="noreferrer"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-[var(--platform-text)]/70 transition hover:bg-white/[0.04] hover:text-[var(--platform-text)]"
          >
            <ExternalLink size={13} className="text-[#22D3EE]" />
            Ver site
          </a>
          <button
            onClick={() => copy(row.domain, "Domínio")}
            className="flex w-full items-center gap-2.5 px-4 py-2.5 text-xs text-[var(--platform-text)]/70 transition hover:bg-white/[0.04] hover:text-[var(--platform-text)]"
          >
            <Copy size={13} className="text-[var(--platform-text)]/50" />
            Copiar domínio
          </button>
          <button
            onClick={() => copy(row.id, "ID")}
            className="flex w-full items-center gap-2.5 px-4 py-2.5 text-xs text-[var(--platform-text)]/70 transition hover:bg-white/[0.04] hover:text-[var(--platform-text)]"
          >
            <Hash size={13} className="text-[var(--platform-text)]/50" />
            Copiar ID
          </button>

          <div className="my-1 border-t border-white/[0.06]" />

          {/* Suspend / Reactivate */}
          {!confirming ? (
            <button
              onClick={() => setConfirming(true)}
              className={`flex w-full items-center gap-2.5 px-4 py-2.5 text-xs transition ${
                suspended
                  ? "text-emerald-400 hover:bg-emerald-500/10"
                  : "text-red-400 hover:bg-red-500/10"
              }`}
            >
              {suspended ? <PlayCircle size={13} /> : <PauseCircle size={13} />}
              {suspended ? "Reativar site" : "Suspender site"}
            </button>
          ) : (
            <div className="px-4 py-3">
              <div className="mb-2 flex items-center gap-1.5 text-[10px] text-amber-300">
                <AlertTriangle size={11} />
                {suspended ? "Reativar este site?" : "Suspender este site?"}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => void handleSuspendToggle()}
                  disabled={loading}
                  className={`flex-1 rounded-lg py-1.5 text-[10px] font-semibold text-white transition disabled:opacity-50 ${
                    suspended ? "bg-emerald-600 hover:bg-emerald-500" : "bg-red-600 hover:bg-red-500"
                  }`}
                >
                  {loading ? "..." : "Confirmar"}
                </button>
                <button
                  onClick={() => setConfirming(false)}
                  className="flex-1 rounded-lg border border-white/10 py-1.5 text-[10px] text-[var(--platform-text)]/60 hover:text-[var(--platform-text)]"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function SitesTable({ sites: initialSites }: { sites: SiteRow[] }) {
  const [sites, setSites] = useState<SiteRow[]>(initialSites);

  async function handleSuspendToggle(siteId: string, suspend: boolean) {
    const res = await fetch(`/api/admin/sites/${siteId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ suspended: suspend }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      throw new Error((data as { error?: string } | null)?.error ?? "Erro ao alterar status.");
    }
    // Optimistic update
    setSites((prev) =>
      prev.map((s) =>
        s.id === siteId
          ? { ...s, theme_settings: { ...(s.theme_settings ?? {}), suspended: suspend } }
          : s,
      ),
    );
  }

  return (
    <DataTable
      data={sites}
      keyExtractor={(row) => row.id}
      searchPlaceholder="Buscar por nome ou domínio..."
      searchFilter={(row, query) =>
        row.name.toLowerCase().includes(query) ||
        row.domain.toLowerCase().includes(query)
      }
      emptyIcon={<Globe size={40} className="text-[var(--platform-text)]/20" />}
      emptyMessage="Nenhum site encontrado."
      columns={[
        {
          key: "name",
          label: "Nome",
          render: (row) => <span className="font-medium">{row.name}</span>,
        },
        {
          key: "domain",
          label: "Domínio",
          render: (row) => (
            <span className="font-mono text-xs text-[#22D3EE]">{row.domain}</span>
          ),
        },
        {
          key: "status",
          label: "Status",
          render: (row) => <StatusBadge row={row} />,
        },
        {
          key: "plan",
          label: "Plano",
          render: (row) => (
            <PlanBadge theme_settings={row.theme_settings} plan={row.plan} />
          ),
        },
        {
          key: "created_at",
          label: "Criado em",
          render: (row) => (
            <span className="text-xs text-[var(--platform-text)]/60">
              {formatDate(row.created_at)}
            </span>
          ),
        },
        {
          key: "actions",
          label: "",
          render: (row) => (
            <SiteActionsDropdown row={row} onSuspendToggle={handleSuspendToggle} />
          ),
        },
      ]}
    />
  );
}
