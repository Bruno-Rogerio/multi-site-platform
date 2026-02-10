"use client";

import { Shield, User, Users } from "lucide-react";
import { DataTable } from "@/components/admin/data-table";

type UserRow = {
  id: string;
  email: string;
  role: string;
  site_id: string | null;
  created_at: string;
};

function RoleBadge({ role }: { role: string }) {
  const isAdmin = role === "admin";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] ${
        isAdmin
          ? "border border-purple-400/30 bg-purple-500/10 text-purple-300"
          : "border border-blue-400/30 bg-blue-500/10 text-blue-300"
      }`}
    >
      {isAdmin ? <Shield size={10} /> : <User size={10} />}
      {isAdmin ? "Admin" : "Cliente"}
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

export function UsersTable({
  users,
  sitesMap,
}: {
  users: UserRow[];
  sitesMap: Record<string, string>;
}) {
  return (
    <DataTable
      data={users}
      keyExtractor={(row) => row.id}
      searchPlaceholder="Buscar por email..."
      searchFilter={(row, query) => row.email.toLowerCase().includes(query)}
      emptyIcon={<Users size={40} className="text-[var(--platform-text)]/20" />}
      emptyMessage="Nenhum usuário encontrado."
      columns={[
        {
          key: "email",
          label: "Email",
          render: (row) => (
            <span className="font-medium">{row.email}</span>
          ),
        },
        {
          key: "role",
          label: "Perfil",
          render: (row) => <RoleBadge role={row.role} />,
        },
        {
          key: "site",
          label: "Site vinculado",
          render: (row) =>
            row.site_id ? (
              <span className="text-xs text-[var(--platform-text)]/70">
                {sitesMap[row.site_id] ?? row.site_id.slice(0, 8)}
              </span>
            ) : (
              <span className="text-xs text-[var(--platform-text)]/30">—</span>
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
      ]}
    />
  );
}
