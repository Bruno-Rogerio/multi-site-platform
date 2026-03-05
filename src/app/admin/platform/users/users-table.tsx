"use client";

import { useEffect, useRef, useState } from "react";
import { MailCheck, MoreVertical, Shield, Trash2, User, Users, X } from "lucide-react";

import { DataTable } from "@/components/admin/data-table";
import { useToast } from "@/components/admin/toast-provider";

type UserRow = {
  id: string;
  email: string;
  role: string;
  site_id: string | null;
  created_at: string;
};

type Tab = "all" | "admin" | "client";

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

function UserActionsDropdown({
  user,
  onDelete,
  onResetSent,
}: {
  user: UserRow;
  onDelete: (user: UserRow) => void;
  onResetSent: (email: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  async function handleResetPassword() {
    setLoading(true);
    setOpen(false);
    try {
      const res = await fetch(`/api/admin/users/${user.id}/reset-password`, { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        onResetSent(data.email ?? user.email);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        disabled={loading}
        className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--platform-text)]/40 transition hover:bg-white/[0.06] hover:text-[var(--platform-text)] disabled:opacity-40"
      >
        <MoreVertical size={14} />
      </button>
      {open && (
        <div className="absolute right-0 z-20 mt-1 w-52 overflow-hidden rounded-xl border border-white/10 bg-[#12182B] shadow-xl">
          <button
            onClick={handleResetPassword}
            className="flex w-full items-center gap-2.5 px-4 py-2.5 text-xs text-[var(--platform-text)]/70 transition hover:bg-white/[0.04] hover:text-[var(--platform-text)]"
          >
            <MailCheck size={13} className="text-blue-400" />
            Enviar reset de senha
          </button>
          <button
            onClick={() => { setOpen(false); onDelete(user); }}
            className="flex w-full items-center gap-2.5 px-4 py-2.5 text-xs text-rose-400/80 transition hover:bg-rose-500/10 hover:text-rose-300"
          >
            <Trash2 size={13} />
            Excluir usuário
          </button>
        </div>
      )}
    </div>
  );
}

function DeleteModal({
  user,
  onClose,
  onDeleted,
}: {
  user: UserRow;
  onClose: () => void;
  onDeleted: (userId: string) => void;
}) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  async function handleDelete() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, { method: "DELETE" });
      if (res.ok) {
        onDeleted(user.id);
        toast("Usuário excluído com sucesso.", "success");
        onClose();
      } else {
        const data = await res.json();
        toast(data.error ?? "Não foi possível excluir o usuário.", "error");
        onClose();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#12182B] p-6 shadow-2xl">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-[var(--platform-text)]">Excluir usuário</h3>
            <p className="mt-1 text-xs text-[var(--platform-text)]/60">
              Esta ação é irreversível. O usuário perderá acesso imediatamente.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[var(--platform-text)]/40 transition hover:text-[var(--platform-text)]"
          >
            <X size={16} />
          </button>
        </div>

        <div className="mb-5 rounded-xl border border-white/[0.06] bg-[#0B1020] px-4 py-3">
          <p className="text-sm font-medium text-[var(--platform-text)]">{user.email}</p>
          <p className="text-xs capitalize text-[var(--platform-text)]/40">{user.role}</p>
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-lg border border-white/10 px-4 py-2 text-xs font-medium text-[var(--platform-text)]/70 transition hover:bg-white/[0.04]"
          >
            Cancelar
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="rounded-lg bg-rose-500/80 px-4 py-2 text-xs font-semibold text-white transition hover:bg-rose-500 disabled:opacity-60"
          >
            {loading ? "Excluindo..." : "Excluir"}
          </button>
        </div>
      </div>
    </div>
  );
}

export function UsersTable({
  users: initialUsers,
  sitesMap,
}: {
  users: UserRow[];
  sitesMap: Record<string, string>;
}) {
  const { toast } = useToast();
  const [users, setUsers] = useState(initialUsers);
  const [tab, setTab] = useState<Tab>("all");
  const [confirmDelete, setConfirmDelete] = useState<UserRow | null>(null);

  const filtered = tab === "all" ? users : users.filter((u) => u.role === tab);

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "all",    label: "Todos",    count: users.length },
    { key: "admin",  label: "Admins",   count: users.filter((u) => u.role === "admin").length },
    { key: "client", label: "Clientes", count: users.filter((u) => u.role === "client").length },
  ];

  function handleDeleted(userId: string) {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
  }

  function handleResetSent(email: string) {
    toast(`Email de reset enviado para ${email}.`, "success");
  }

  return (
    <>
      {confirmDelete && (
        <DeleteModal
          user={confirmDelete}
          onClose={() => setConfirmDelete(null)}
          onDeleted={handleDeleted}
        />
      )}

      {/* Role tabs */}
      <div className="mb-4 flex gap-1">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
              tab === t.key
                ? "bg-[#22D3EE]/10 text-[#22D3EE]"
                : "text-[var(--platform-text)]/50 hover:bg-white/[0.04] hover:text-[var(--platform-text)]"
            }`}
          >
            {t.label}
            <span
              className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold ${
                tab === t.key ? "bg-[#22D3EE]/20 text-[#22D3EE]" : "bg-white/[0.06] text-[var(--platform-text)]/50"
              }`}
            >
              {t.count}
            </span>
          </button>
        ))}
      </div>

      <DataTable
        data={filtered}
        keyExtractor={(row) => row.id}
        searchPlaceholder="Buscar por email..."
        searchFilter={(row, query) => row.email.toLowerCase().includes(query)}
        emptyIcon={<Users size={40} className="text-[var(--platform-text)]/20" />}
        emptyMessage="Nenhum usuário encontrado."
        columns={[
          {
            key: "email",
            label: "Email",
            render: (row) => <span className="font-medium">{row.email}</span>,
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
          {
            key: "actions",
            label: "",
            render: (row) => (
              <UserActionsDropdown
                user={row}
                onDelete={setConfirmDelete}
                onResetSent={handleResetSent}
              />
            ),
          },
        ]}
      />
    </>
  );
}
