"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  MessageSquare,
  RefreshCw,
  AlertTriangle,
  Ticket,
  CheckCheck,
  X,
} from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import type { AppRole } from "@/lib/auth/session";

type NotificationType = "ticket_new" | "ticket_message" | "ticket_status_changed" | "sla_warning";

type Notification = {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  body: string;
  ticket_id: string | null;
  read: boolean;
  created_at: string;
};

interface NotificationBellProps {
  userId: string;
  role: AppRole;
}

const TYPE_META: Record<NotificationType, { icon: typeof Bell; color: string }> = {
  ticket_new:            { icon: Ticket,        color: "text-orange-400" },
  ticket_message:        { icon: MessageSquare,  color: "text-[#22D3EE]" },
  ticket_status_changed: { icon: RefreshCw,      color: "text-violet-400" },
  sla_warning:           { icon: AlertTriangle,  color: "text-red-400" },
};

function timeAgo(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60)   return "agora mesmo";
  if (diff < 3600) return `${Math.floor(diff / 60)}min atrás`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h atrás`;
  return `${Math.floor(diff / 86400)}d atrás`;
}

export function NotificationBell({ userId, role }: NotificationBellProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen]                   = useState(false);
  const [loading, setLoading]             = useState(true);
  const dropdownRef                       = useRef<HTMLDivElement>(null);
  const router                            = useRouter();

  const unreadCount = notifications.filter((n) => !n.read).length;
  const messagesBase = role === "admin" ? "/admin/platform/messages" : "/admin/client/messages";

  // Fetch unread notifications on mount
  useEffect(() => {
    fetch("/api/admin/notifications")
      .then((r) => r.json())
      .then((d) => setNotifications(d.notifications ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Supabase Realtime: listen for new notifications
  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    if (!supabase) return;

    const channel = supabase
      .channel(`my-notifs-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        (payload: { new: unknown }) => {
          const notif = payload.new as Notification;
          setNotifications((prev) => [notif, ...prev]);
        },
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [userId]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  async function markAllRead() {
    setNotifications([]);
    await fetch("/api/admin/notifications", { method: "PATCH" }).catch(() => {});
  }

  function handleNotifClick(notif: Notification) {
    // Mark as read locally
    setNotifications((prev) => prev.filter((n) => n.id !== notif.id));
    setOpen(false);

    if (notif.ticket_id) {
      router.push(`${messagesBase}?ticket=${notif.ticket_id}`);
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell button */}
      <button
        onClick={() => setOpen(!open)}
        className="relative flex h-9 w-9 items-center justify-center rounded-lg text-[var(--platform-text)]/50 transition hover:bg-white/[0.04] hover:text-[var(--platform-text)]"
        title="Notificações"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-2xl border border-white/10 bg-[#0B1020] shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <h3 className="text-sm font-semibold text-[var(--platform-text)]">
                Notificações
                {unreadCount > 0 && (
                  <span className="ml-2 rounded-full bg-red-500/20 px-1.5 py-0.5 text-[10px] font-bold text-red-400">
                    {unreadCount}
                  </span>
                )}
              </h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="flex items-center gap-1 text-[10px] text-[var(--platform-text)]/50 transition hover:text-[#22D3EE]"
                    title="Marcar todas como lidas"
                  >
                    <CheckCheck size={12} />
                    Marcar todas
                  </button>
                )}
                <button
                  onClick={() => setOpen(false)}
                  className="text-[var(--platform-text)]/40 transition hover:text-[var(--platform-text)]"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* List */}
            <div className="max-h-[360px] overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center py-10">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-[#22D3EE]" />
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 py-10">
                  <Bell size={24} className="text-[var(--platform-text)]/20" />
                  <p className="text-xs text-[var(--platform-text)]/40">Nenhuma notificação</p>
                </div>
              ) : (
                <ul className="divide-y divide-white/[0.05]">
                  <AnimatePresence initial={false}>
                    {notifications.map((notif) => {
                      const meta = TYPE_META[notif.type] ?? TYPE_META.ticket_message;
                      const Icon = meta.icon;
                      return (
                        <motion.li
                          key={notif.id}
                          initial={{ opacity: 0, x: 8 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -8 }}
                          transition={{ duration: 0.15 }}
                        >
                          <button
                            onClick={() => handleNotifClick(notif)}
                            className="flex w-full items-start gap-3 px-4 py-3 text-left transition hover:bg-white/[0.04]"
                          >
                            <div className={`mt-0.5 shrink-0 ${meta.color}`}>
                              <Icon size={15} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-xs font-semibold text-[var(--platform-text)]">
                                {notif.title}
                              </p>
                              <p className="mt-0.5 line-clamp-2 text-[11px] text-[var(--platform-text)]/55">
                                {notif.body}
                              </p>
                              <p className="mt-1 text-[10px] text-[var(--platform-text)]/30">
                                {timeAgo(notif.created_at)}
                              </p>
                            </div>
                            <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#22D3EE]" />
                          </button>
                        </motion.li>
                      );
                    })}
                  </AnimatePresence>
                </ul>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
