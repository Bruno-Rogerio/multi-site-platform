"use client";

import { FormEvent, useMemo, useState } from "react";

type SiteOption = {
  id: string;
  name: string;
  domain: string;
  plan: string;
};

type FormStatus =
  | { type: "success"; message: string }
  | { type: "error"; message: string }
  | null;

type CreateUserFormProps = {
  sites: SiteOption[];
  mode?: "all" | "internal";
};

export function CreateUserForm({ sites, mode = "all" }: CreateUserFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<FormStatus>(null);
  const [role, setRole] = useState<"admin" | "client">(mode === "internal" ? "admin" : "client");
  const [siteId, setSiteId] = useState<string>(sites[0]?.id ?? "");

  const isClientRole = role === "client";
  const canSubmit = !isLoading && (!isClientRole || Boolean(siteId));

  const orderedSites = useMemo(
    () => [...sites].sort((a, b) => a.name.localeCompare(b.name)),
    [sites],
  );

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(null);
    const formElement = event.currentTarget;

    const formData = new FormData(formElement);
    const email = String(formData.get("email") ?? "").trim().toLowerCase();

    if (!email) {
      setStatus({ type: "error", message: "Informe o e-mail do usuário." });
      return;
    }

    if (isClientRole && !siteId) {
      setStatus({ type: "error", message: "Selecione um site para o cliente." });
      return;
    }

    setIsLoading(true);

    const response = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        role,
        siteId: isClientRole ? siteId : null,
      }),
    });

    const payload = (await response.json().catch(() => null)) as
      | {
          error?: string;
          details?: string;
          message?: string;
          temporaryPassword?: string;
          provisionMode?: "invite" | "password";
        }
      | null;

    setIsLoading(false);

    if (!response.ok) {
      const fallbackMessage = "Não foi possível convidar o usuário.";
      const detail = payload?.details ? ` ${payload.details}` : "";
      setStatus({ type: "error", message: `${payload?.error ?? fallbackMessage}${detail}`.trim() });
      return;
    }

    formElement.reset();
    setRole(mode === "internal" ? "admin" : "client");
    setSiteId(orderedSites[0]?.id ?? "");
    setStatus({
      type: "success",
      message:
        payload?.temporaryPassword
          ? `${payload?.message ?? "Usuário criado."} Senha temporária: ${payload.temporaryPassword}`
          : payload?.message ??
            "Convite enviado com sucesso. O usuário receberá email para definir senha.",
    });
  }

  return (
    <form className="mt-4 space-y-3" onSubmit={onSubmit}>
      {status && (
        <p
          className={`rounded-lg px-3 py-2 text-xs ${
            status.type === "error"
              ? "border border-red-300/40 bg-red-500/10 text-red-200"
              : "border border-emerald-300/40 bg-emerald-500/10 text-emerald-200"
          }`}
        >
          {status.message}
        </p>
      )}

      <div>
        <label className="text-xs font-semibold uppercase tracking-wide text-[var(--platform-text)]/60" htmlFor="invite-email">
          E-mail
        </label>
        <input
          id="invite-email"
          name="email"
          type="email"
          required
          className="mt-1 w-full rounded-xl border border-white/15 bg-[#0B1020] px-3 py-2 text-sm text-[var(--platform-text)] outline-none transition focus:border-[#22D3EE]"
          placeholder="novo.usuario@cliente.com"
        />
      </div>

      <div className={`grid gap-3 ${mode === "internal" ? "md:grid-cols-1" : "md:grid-cols-2"}`}>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-[var(--platform-text)]/60" htmlFor="invite-role">
            Perfil
          </label>
          {mode === "internal" ? (
            <input
              value="Admin da plataforma"
              disabled
              className="mt-1 w-full rounded-xl border border-white/15 bg-[#0B1020]/60 px-3 py-2 text-sm text-[var(--platform-text)]/70 outline-none"
            />
          ) : (
            <select
              id="invite-role"
              value={role}
              onChange={(event) => setRole(event.target.value as "admin" | "client")}
              className="mt-1 w-full rounded-xl border border-white/15 bg-[#0B1020] px-3 py-2 text-sm text-[var(--platform-text)] outline-none transition focus:border-[#22D3EE]"
            >
              <option value="client">Cliente</option>
              <option value="admin">Admin da plataforma</option>
            </select>
          )}
        </div>

        {mode !== "internal" ? (
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-[var(--platform-text)]/60" htmlFor="invite-site">
              Site do cliente
            </label>
            <select
              id="invite-site"
              value={siteId}
              onChange={(event) => setSiteId(event.target.value)}
              disabled={!isClientRole}
              className="mt-1 w-full rounded-xl border border-white/15 bg-[#0B1020] px-3 py-2 text-sm text-[var(--platform-text)] outline-none transition focus:border-[#22D3EE] disabled:cursor-not-allowed disabled:bg-[#0B1020]/60"
            >
              {orderedSites.length === 0 ? (
                <option value="">Nenhum site disponível</option>
              ) : (
                orderedSites.map((site) => (
                  <option key={site.id} value={site.id}>
                    {site.name} - {site.domain}
                  </option>
                ))
              )}
            </select>
          </div>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={!canSubmit}
        className="w-full rounded-lg bg-[linear-gradient(135deg,#3B82F6,#7C5CFF,#22D3EE)] px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? "Enviando convite..." : "Convidar usuário"}
      </button>
    </form>
  );
}
