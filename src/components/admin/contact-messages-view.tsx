"use client";

import { useState } from "react";
import { Inbox, Mail, MailOpen, User, Clock } from "lucide-react";
import type { ContactMessage } from "@/app/admin/client/contacts/page";

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  const diff = Math.floor((Date.now() - d.getTime()) / 1000);
  if (diff < 60) return "agora mesmo";
  if (diff < 3600) return `${Math.floor(diff / 60)}min atrás`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h atrás`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d atrás`;
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

export function ContactMessagesView({ messages: initialMessages }: { messages: ContactMessage[] }) {
  const [messages, setMessages] = useState(initialMessages);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = messages.find((m) => m.id === selectedId) ?? null;
  const unreadCount = messages.filter((m) => !m.read).length;

  async function selectMessage(msg: ContactMessage) {
    setSelectedId(msg.id);
    if (msg.read) return;
    setMessages((prev) => prev.map((m) => m.id === msg.id ? { ...m, read: true } : m));
    await fetch("/api/admin/contact-messages", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: msg.id }),
    }).catch(() => {});
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--platform-text)]">Formulários de contato</h1>
          <p className="mt-1 text-sm text-[var(--platform-text)]/60">
            Mensagens enviadas pelo formulário do seu site.
          </p>
        </div>
        {unreadCount > 0 && (
          <span className="rounded-full bg-[#22D3EE]/15 px-3 py-1 text-xs font-semibold text-[#22D3EE]">
            {unreadCount} não lida{unreadCount !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-[#12182B] py-20">
          <Inbox size={40} className="text-[var(--platform-text)]/20" />
          <p className="mt-4 text-sm font-medium text-[var(--platform-text)]/50">Nenhuma mensagem ainda</p>
          <p className="mt-1 text-xs text-[var(--platform-text)]/30">
            As mensagens do formulário do seu site aparecerão aqui.
          </p>
        </div>
      ) : (
        <div
          className="flex rounded-2xl border border-white/10 bg-[#12182B] overflow-hidden"
          style={{ minHeight: 520 }}
        >
          {/* List */}
          <div className="w-[300px] shrink-0 overflow-y-auto border-r border-white/10">
            {messages.map((msg) => (
              <button
                key={msg.id}
                type="button"
                onClick={() => selectMessage(msg)}
                className={`w-full border-b border-white/[0.06] px-4 py-3.5 text-left transition hover:bg-white/[0.03] ${
                  selectedId === msg.id ? "bg-white/[0.05]" : ""
                }`}
              >
                <div className="flex items-start gap-2.5">
                  {/* Unread dot — always takes space so layout stays stable */}
                  <div
                    className="mt-1.5 h-2 w-2 shrink-0 rounded-full transition"
                    style={{ backgroundColor: msg.read ? "transparent" : "#22D3EE" }}
                  />
                  <div className="min-w-0">
                    <p
                      className={`truncate text-sm ${
                        msg.read
                          ? "font-medium text-[var(--platform-text)]/70"
                          : "font-semibold text-[var(--platform-text)]"
                      }`}
                    >
                      {msg.name}
                    </p>
                    <p className="truncate text-xs text-[var(--platform-text)]/40">{msg.email}</p>
                    <p className="mt-1 line-clamp-2 text-xs text-[var(--platform-text)]/50 leading-relaxed">
                      {msg.message}
                    </p>
                    <p className="mt-1.5 text-[10px] text-[var(--platform-text)]/30">
                      {formatDate(msg.created_at)}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Detail */}
          <div className="flex-1 overflow-y-auto p-6">
            {selected ? (
              <div>
                <div className="mb-6 flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#3B82F6]/15">
                      <User size={18} className="text-[#3B82F6]" />
                    </div>
                    <div>
                      <p className="font-semibold text-[var(--platform-text)]">{selected.name}</p>
                      <a
                        href={`mailto:${selected.email}`}
                        className="text-xs text-[#22D3EE] hover:underline"
                      >
                        {selected.email}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-[var(--platform-text)]/40 shrink-0">
                    <Clock size={12} />
                    {new Date(selected.created_at).toLocaleString("pt-BR", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>

                <div className="rounded-xl border border-white/10 bg-[#0B1020] p-5">
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--platform-text)]/80">
                    {selected.message}
                  </p>
                </div>

                <a
                  href={`mailto:${selected.email}?subject=Re: Mensagem do site`}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[linear-gradient(135deg,#3B82F6,#7C5CFF)] px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
                >
                  <Mail size={14} />
                  Responder por e-mail
                </a>
              </div>
            ) : (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <MailOpen size={32} className="text-[var(--platform-text)]/20" />
                <p className="mt-3 text-sm text-[var(--platform-text)]/40">Selecione uma mensagem para ler</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
