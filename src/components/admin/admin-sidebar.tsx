"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Globe,
  Users,
  Kanban,
  Palette,
  PenTool,
  Paintbrush,
  MessageSquare,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import type { AppRole } from "@/lib/auth/session";

type NavItem = {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
  badge?: number;
};

const platformNav: NavItem[] = [
  { label: "Dashboard", href: "/admin/platform", icon: LayoutDashboard },
  { label: "Sites", href: "/admin/platform/sites", icon: Globe },
  { label: "Usuários", href: "/admin/platform/users", icon: Users },
  { label: "Pipeline", href: "/admin/platform/pipeline", icon: Kanban },
  { label: "Branding", href: "/admin/platform/branding", icon: Palette },
];

const clientNav: NavItem[] = [
  { label: "Dashboard", href: "/admin/client", icon: LayoutDashboard },
  { label: "Editor do site", href: "/admin/client/editor", icon: PenTool },
  { label: "Aparência", href: "/admin/client/appearance", icon: Paintbrush },
  { label: "Mensagens", href: "/admin/client/messages", icon: MessageSquare },
  { label: "Configurações", href: "/admin/client/settings", icon: Settings },
];

type AdminSidebarProps = {
  role: AppRole;
  brandName: string;
  logoUrl: string;
  pendingDrafts?: number;
};

export function AdminSidebar({ role, brandName, logoUrl, pendingDrafts }: AdminSidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = role === "admin" ? platformNav : clientNav;

  // Add badge for pipeline if there are pending drafts
  const itemsWithBadges = navItems.map((item) => {
    if (item.href === "/admin/platform/pipeline" && pendingDrafts && pendingDrafts > 0) {
      return { ...item, badge: pendingDrafts };
    }
    return item;
  });

  function isActive(href: string) {
    if (href === "/admin/platform" || href === "/admin/client") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  }

  const sidebarContent = (
    <nav className="flex h-full flex-col">
      {/* Brand */}
      <div className={`flex items-center gap-3 border-b border-white/10 px-4 py-5 ${collapsed ? "justify-center" : ""}`}>
        {logoUrl ? (
          <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full border border-white/25 shadow-[0_0_12px_rgba(59,130,246,0.3)]">
            <Image src={logoUrl} alt={brandName} fill sizes="32px" className="object-cover" />
          </div>
        ) : (
          <div className="relative h-8 w-8 shrink-0 rounded-full bg-[radial-gradient(circle_at_35%_30%,#22D3EE,#3B82F6_45%,#7C5CFF_80%)] shadow-[0_0_12px_rgba(59,130,246,0.4)]">
            <div className="absolute inset-[1.5px] rounded-full border border-white/30" />
          </div>
        )}
        {!collapsed && (
          <span className="text-sm font-semibold tracking-tight bg-[linear-gradient(135deg,#EAF0FF,#3B82F6,#7C5CFF,#22D3EE)] bg-clip-text text-transparent">
            {brandName}
          </span>
        )}
      </div>

      {/* Nav items */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {itemsWithBadges.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                active
                  ? "bg-[#22D3EE]/10 text-[#22D3EE]"
                  : "text-[var(--platform-text)]/60 hover:bg-white/[0.04] hover:text-[var(--platform-text)]"
              } ${collapsed ? "justify-center" : ""}`}
              title={collapsed ? item.label : undefined}
            >
              <Icon size={18} className={active ? "text-[#22D3EE]" : "text-[var(--platform-text)]/50 group-hover:text-[var(--platform-text)]/80"} />
              {!collapsed && (
                <>
                  <span className="flex-1">{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#22D3EE]/20 px-1.5 text-[10px] font-bold text-[#22D3EE]">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </Link>
          );
        })}
      </div>

      {/* Collapse toggle (desktop only) */}
      <div className="hidden border-t border-white/10 p-3 md:block">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs text-[var(--platform-text)]/50 transition hover:bg-white/[0.04] hover:text-[var(--platform-text)]"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          {!collapsed && <span>Recolher</span>}
        </button>
      </div>
    </nav>
  );

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-40 flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-[#12182B] text-[var(--platform-text)] md:hidden"
        aria-label="Abrir menu"
      >
        <Menu size={20} />
      </button>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-y-0 left-0 z-50 w-[260px] border-r border-white/10 bg-[#0B1020] md:hidden"
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute right-3 top-4 text-[var(--platform-text)]/50 hover:text-[var(--platform-text)]"
                aria-label="Fechar menu"
              >
                <X size={20} />
              </button>
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <aside
        className={`hidden md:flex flex-col border-r border-white/10 bg-[#0B1020] transition-all duration-300 ${
          collapsed ? "w-[72px]" : "w-[240px]"
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
