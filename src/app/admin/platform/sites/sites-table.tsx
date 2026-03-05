"use client";

import { useEffect, useRef, useState } from "react";
import { Copy, ExternalLink, Globe, Hash, MoreVertical } from "lucide-react";

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

function StatusBadge({ billing_status }: { billing_status: string | null }) {
  if (billing_status === "active") {
    return (
      <span className="inline-flex rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
        Ativo
      </span>
    );
  }
  if (!billing_status || billing_status === "trial") {
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

function SiteActionsDropdown({ row }: { row: SiteRow }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
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

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--platform-text)]/40 transition hover:bg-white/[0.06] hover:text-[var(--platform-text)]"
      >
        <MoreVertical size={14} />
      </button>
      {open && (
        <div className="absolute right-0 z-20 mt-1 w-48 overflow-hidden rounded-xl border border-white/10 bg-[#12182B] shadow-xl">
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
        </div>
      )}
    </div>
  );
}

export function SitesTable({ sites }: { sites: SiteRow[] }) {
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
          render: (row) => <StatusBadge billing_status={row.billing_status} />,
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
          render: (row) => <SiteActionsDropdown row={row} />,
        },
      ]}
    />
  );
}
