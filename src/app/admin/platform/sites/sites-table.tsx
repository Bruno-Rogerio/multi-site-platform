"use client";

import { Globe, ExternalLink } from "lucide-react";
import { DataTable } from "@/components/admin/data-table";

type SiteRow = {
  id: string;
  name: string;
  domain: string;
  plan: string;
  created_at: string;
};

function PlanBadge({ plan }: { plan: string }) {
  const isPro = plan === "pro";
  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] ${
        isPro
          ? "border border-purple-400/30 bg-purple-500/10 text-purple-300"
          : "border border-blue-400/30 bg-blue-500/10 text-blue-300"
      }`}
    >
      {isPro ? "Pro" : "Landing"}
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
          render: (row) => (
            <span className="font-medium">{row.name}</span>
          ),
        },
        {
          key: "domain",
          label: "Domínio",
          render: (row) => (
            <span className="font-mono text-xs text-[#22D3EE]">{row.domain}</span>
          ),
        },
        {
          key: "plan",
          label: "Plano",
          render: (row) => <PlanBadge plan={row.plan} />,
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
          label: "Ações",
          render: (row) => (
            <a
              href={`https://${row.domain}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-xs text-[#22D3EE] hover:underline"
            >
              <ExternalLink size={12} />
              Ver site
            </a>
          ),
        },
      ]}
    />
  );
}
