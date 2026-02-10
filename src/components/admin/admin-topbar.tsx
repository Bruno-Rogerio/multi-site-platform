"use client";

import { usePathname } from "next/navigation";
import { Bell, LogOut, Shield, User } from "lucide-react";
import type { AppRole } from "@/lib/auth/session";

type AdminTopbarProps = {
  email: string;
  role: AppRole;
};

const breadcrumbLabels: Record<string, string> = {
  "/admin/platform": "Dashboard",
  "/admin/platform/sites": "Sites",
  "/admin/platform/users": "Usuários",
  "/admin/platform/pipeline": "Pipeline",
  "/admin/platform/branding": "Branding",
  "/admin/client": "Dashboard",
  "/admin/client/editor": "Editor do site",
  "/admin/client/appearance": "Aparência",
  "/admin/client/messages": "Mensagens",
  "/admin/client/settings": "Configurações",
};

function getBreadcrumbs(pathname: string): { label: string; href: string }[] {
  const crumbs: { label: string; href: string }[] = [];

  if (pathname.startsWith("/admin/platform")) {
    crumbs.push({ label: "Plataforma", href: "/admin/platform" });
  } else if (pathname.startsWith("/admin/client")) {
    crumbs.push({ label: "Meu site", href: "/admin/client" });
  }

  const label = breadcrumbLabels[pathname];
  if (label && crumbs.length > 0 && pathname !== crumbs[0].href) {
    crumbs.push({ label, href: pathname });
  }

  return crumbs;
}

export function AdminTopbar({ email, role }: AdminTopbarProps) {
  const pathname = usePathname();
  const breadcrumbs = getBreadcrumbs(pathname);

  return (
    <header className="flex items-center justify-between border-b border-white/10 bg-[#0B1020]/80 px-6 py-3 backdrop-blur-sm">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm pl-12 md:pl-0">
        {breadcrumbs.map((crumb, index) => (
          <span key={crumb.href} className="flex items-center gap-2">
            {index > 0 && (
              <span className="text-[var(--platform-text)]/30">/</span>
            )}
            <span
              className={
                index === breadcrumbs.length - 1
                  ? "font-medium text-[var(--platform-text)]"
                  : "text-[var(--platform-text)]/50"
              }
            >
              {crumb.label}
            </span>
          </span>
        ))}
      </nav>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Notifications placeholder */}
        <button
          className="relative flex h-9 w-9 items-center justify-center rounded-lg text-[var(--platform-text)]/50 transition hover:bg-white/[0.04] hover:text-[var(--platform-text)]"
          title="Notificações (em breve)"
        >
          <Bell size={18} />
        </button>

        {/* User info */}
        <div className="hidden items-center gap-2 sm:flex">
          <span
            className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] ${
              role === "admin"
                ? "border border-purple-400/30 bg-purple-500/10 text-purple-300"
                : "border border-blue-400/30 bg-blue-500/10 text-blue-300"
            }`}
          >
            {role === "admin" ? <Shield size={10} /> : <User size={10} />}
            {role === "admin" ? "Admin" : "Cliente"}
          </span>
          <span className="text-xs text-[var(--platform-text)]/60 max-w-[160px] truncate">
            {email}
          </span>
        </div>

        {/* Logout */}
        <form action="/auth/signout" method="post">
          <button
            type="submit"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--platform-text)]/50 transition hover:bg-red-500/10 hover:text-red-400"
            title="Sair"
          >
            <LogOut size={18} />
          </button>
        </form>
      </div>
    </header>
  );
}
