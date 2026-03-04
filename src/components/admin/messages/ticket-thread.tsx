"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Paperclip, Loader2, X, FileIcon, Lock, ChevronDown } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { SlaBadge } from "./sla-badge";

type Attachment = { url: string; name: string; size: number; type: string };

type Message = {
  id: string;
  ticket_id: string;
  sender_role: "client" | "admin";
  sender_id: string;
  body: string;
  attachments: Attachment[];
  created_at: string;
};

type Ticket = {
  id: string;
  subject: string;
  category: string;
  status: string;
  sla_deadline: string;
  sites?: { name: string } | null;
};

interface TicketThreadProps {
  ticketId: string;
  ticket: Ticket;
  initialMessages: Message[];
  userRole: "client" | "admin";
}

const STATUS_OPTIONS = [
  { value: "open",           label: "Aberto" },
  { value: "in_progress",    label: "Em andamento" },
  { value: "waiting_client", label: "Aguardando cliente" },
  { value: "resolved",       label: "Resolvido" },
];

const CATEGORY_LABELS: Record<string, string> = {
  suporte:     "Suporte técnico",
  duvida:      "Dúvida",
  faturamento: "Faturamento",
  sugestao:    "Sugestão",
};

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("pt-BR", {
    day: "2-digit", month: "short",
    hour: "2-digit", minute: "2-digit",
  });
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)}MB`;
}

export function TicketThread({ ticketId, ticket: initialTicket, initialMessages, userRole }: TicketThreadProps) {
  const [ticket, setTicket]     = useState(initialTicket);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [body, setBody]         = useState("");
  const [sending, setSending]   = useState(false);
  const [uploading, setUploading] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [statusDropdown, setStatusDropdown] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const fileRef   = useRef<HTMLInputElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Realtime subscription
  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    if (!supabase) return;

    const channel = supabase
      .channel(`ticket:${ticketId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "ticket_messages", filter: `ticket_id=eq.${ticketId}` },
        (payload: { new: unknown }) => {
          const newMsg = payload.new as Message;
          setMessages((prev) => {
            if (prev.some((m) => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });
        },
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "support_tickets", filter: `id=eq.${ticketId}` },
        (payload: { new: unknown }) => {
          setTicket((prev) => ({ ...prev, ...(payload.new as Partial<Ticket>) }));
        },
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [ticketId]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim() && pendingFiles.length === 0) return;
    if (ticket.status === "resolved") return;

    setSending(true);
    try {
      // Upload files first
      const attachments: Attachment[] = [];
      if (pendingFiles.length > 0) {
        setUploading(true);
        for (const file of pendingFiles) {
          const fd = new FormData();
          fd.append("file", file);
          fd.append("ticketId", ticketId);
          const res = await fetch("/api/admin/tickets/upload", { method: "POST", body: fd });
          const data = await res.json();
          if (res.ok) attachments.push(data as Attachment);
        }
        setUploading(false);
        setPendingFiles([]);
      }

      const res = await fetch(`/api/admin/tickets/${ticketId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: body.trim() || "📎 Anexo enviado", attachments }),
      });

      if (res.ok) {
        setBody("");
      }
    } finally {
      setSending(false);
      setUploading(false);
    }
  }

  async function handleStatusChange(newStatus: string) {
    setStatusDropdown(false);
    if (newStatus === ticket.status) return;
    setUpdatingStatus(true);
    try {
      await fetch(`/api/admin/tickets/${ticketId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      setTicket((prev) => ({ ...prev, status: newStatus }));
    } finally {
      setUpdatingStatus(false);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) return;
    setPendingFiles((prev) => [...prev, file]);
    if (fileRef.current) fileRef.current.value = "";
  }

  const isResolved = ticket.status === "resolved";

  return (
    <div className="flex h-full flex-col">
      {/* Thread header */}
      <div className="flex items-start justify-between border-b border-white/10 px-6 py-4">
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-sm font-semibold text-[var(--platform-text)]">{ticket.subject}</h2>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[9px] font-medium text-[var(--platform-text)]/50">
              {CATEGORY_LABELS[ticket.category] ?? ticket.category}
            </span>
            {ticket.sites?.name && (
              <span className="text-[10px] text-[#22D3EE]/70">{ticket.sites.name}</span>
            )}
            <SlaBadge slaDeadline={ticket.sla_deadline} status={ticket.status} />
          </div>
        </div>

        {/* Admin: status dropdown */}
        {userRole === "admin" && (
          <div className="relative ml-4 shrink-0">
            <button
              onClick={() => setStatusDropdown(!statusDropdown)}
              disabled={updatingStatus}
              className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-[var(--platform-text)] transition hover:bg-white/[0.07]"
            >
              {updatingStatus ? <Loader2 size={11} className="animate-spin" /> : null}
              {STATUS_OPTIONS.find((s) => s.value === ticket.status)?.label ?? ticket.status}
              <ChevronDown size={11} className="opacity-50" />
            </button>

            <AnimatePresence>
              {statusDropdown && (
                <motion.ul
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="absolute right-0 top-full z-20 mt-1 w-44 overflow-hidden rounded-xl border border-white/10 bg-[#12182B] shadow-2xl"
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <li key={opt.value}>
                      <button
                        onClick={() => handleStatusChange(opt.value)}
                        className={`w-full px-3 py-2.5 text-left text-xs font-medium transition hover:bg-white/[0.06] ${
                          ticket.status === opt.value ? "text-[#22D3EE]" : "text-[var(--platform-text)]/70"
                        }`}
                      >
                        {opt.label}
                      </button>
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 px-6 py-4">
        {messages.length === 0 && (
          <p className="text-center text-xs text-[var(--platform-text)]/30">Nenhuma mensagem.</p>
        )}

        <AnimatePresence initial={false}>
          {messages.map((msg) => {
            const isAdmin  = msg.sender_role === "admin";
            const isOwn    = (userRole === "admin" && isAdmin) || (userRole === "client" && !isAdmin);

            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                    isAdmin
                      ? "rounded-tl-sm bg-white/[0.05]"
                      : "rounded-tr-sm bg-[#22D3EE]/10"
                  }`}
                >
                  {/* Sender label */}
                  <p className={`mb-1 text-[9px] font-semibold uppercase tracking-wide ${isAdmin ? "text-violet-400" : "text-[#22D3EE]"}`}>
                    {isAdmin ? "Equipe BuildSphere" : "Você"}
                  </p>

                  {/* Body */}
                  <p className="whitespace-pre-wrap text-sm text-[var(--platform-text)]">{msg.body}</p>

                  {/* Attachments */}
                  {msg.attachments?.length > 0 && (
                    <ul className="mt-2 space-y-1">
                      {msg.attachments.map((att, i) => (
                        <li key={i}>
                          <a
                            href={att.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 rounded-lg bg-white/[0.06] px-3 py-1.5 text-xs text-[var(--platform-text)]/70 transition hover:bg-white/10"
                          >
                            <FileIcon size={11} className="shrink-0" />
                            <span className="truncate">{att.name}</span>
                            <span className="ml-auto shrink-0 text-[9px] text-[var(--platform-text)]/40">{formatFileSize(att.size)}</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Timestamp */}
                  <p className="mt-1.5 text-[9px] text-[var(--platform-text)]/30">{formatTime(msg.created_at)}</p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Composer */}
      <div className="border-t border-white/10 px-6 py-4">
        {isResolved ? (
          <div className="flex items-center justify-center gap-2 rounded-xl bg-white/[0.04] py-4 text-sm text-[var(--platform-text)]/40">
            <Lock size={14} />
            Chamado encerrado — abra um novo chamado para continuar
          </div>
        ) : (
          <form onSubmit={handleSend} className="space-y-2">
            {/* Pending files list */}
            {pendingFiles.length > 0 && (
              <ul className="flex flex-wrap gap-2">
                {pendingFiles.map((f, i) => (
                  <li key={i} className="flex items-center gap-1.5 rounded-lg bg-white/[0.06] px-2.5 py-1 text-xs text-[var(--platform-text)]/70">
                    <span className="max-w-[120px] truncate">{f.name}</span>
                    <button type="button" onClick={() => setPendingFiles((p) => p.filter((_, idx) => idx !== i))}>
                      <X size={11} className="text-[var(--platform-text)]/40 hover:text-red-400" />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <div className="flex items-end gap-2">
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(e); }
                }}
                placeholder="Digite sua mensagem… (Enter para enviar)"
                rows={2}
                className="flex-1 resize-none rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-[var(--platform-text)] placeholder-[var(--platform-text)]/30 outline-none focus:border-[#22D3EE]/40 focus:ring-1 focus:ring-[#22D3EE]/20"
              />
              <div className="flex gap-1.5">
                <input ref={fileRef} type="file" onChange={handleFileChange} className="hidden" />
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-[var(--platform-text)]/50 transition hover:bg-white/[0.06] hover:text-[var(--platform-text)]"
                  title="Anexar arquivo"
                >
                  <Paperclip size={15} />
                </button>
                <button
                  type="submit"
                  disabled={sending || uploading || (!body.trim() && pendingFiles.length === 0)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#3B82F6] to-[#7C5CFF] text-white transition hover:opacity-90 disabled:opacity-40"
                  title="Enviar"
                >
                  {(sending || uploading) ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
