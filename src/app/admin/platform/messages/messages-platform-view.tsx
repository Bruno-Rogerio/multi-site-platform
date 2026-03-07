"use client";

import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { TicketList, type TicketItem } from "@/components/admin/messages/ticket-list";
import { TicketThread } from "@/components/admin/messages/ticket-thread";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

type Message = {
  id: string;
  ticket_id: string;
  sender_role: "client" | "admin";
  sender_id: string;
  body: string;
  attachments: { url: string; name: string; size: number; type: string }[];
  created_at: string;
};

type FullTicket = {
  id: string;
  subject: string;
  category: string;
  status: string;
  sla_deadline: string;
  sites?: { name: string } | null;
};

interface MessagesPlatformViewProps {
  tickets: unknown[];
}

export function MessagesPlatformView({ tickets: initialTickets }: MessagesPlatformViewProps) {
  const [tickets, setTickets]         = useState<TicketItem[]>(initialTickets as TicketItem[]);
  const [selectedId, setSelectedId]   = useState<string | null>(null);
  const [fullTicket, setFullTicket]   = useState<FullTicket | null>(null);
  const [messages, setMessages]       = useState<Message[]>([]);
  const [loadingThread, setLoadingThread] = useState(false);

  // Realtime: new ticket_messages in the selected thread
  useEffect(() => {
    if (!selectedId) return;
    const supabase = createSupabaseBrowserClient();
    if (!supabase) return;

    const channel = supabase
      .channel(`platform-thread-${selectedId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "ticket_messages",
          filter: `ticket_id=eq.${selectedId}`,
        },
        (payload: { new: unknown }) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        },
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [selectedId]);

  // Realtime: new support_tickets appearing in the list
  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    if (!supabase) return;

    const channel = supabase
      .channel("platform-ticket-list")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "support_tickets" },
        (payload: { new: unknown }) => {
          setTickets((prev) => [payload.new as TicketItem, ...prev]);
        },
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  async function handleSelect(id: string) {
    setSelectedId(id);
    setLoadingThread(true);
    try {
      const res = await fetch(`/api/admin/tickets/${id}`);
      if (res.ok) {
        const data = await res.json();
        setFullTicket(data.ticket);
        setMessages(data.messages);
      }
    } finally {
      setLoadingThread(false);
    }
  }

  return (
    <div className="flex h-[calc(100vh-56px)] overflow-hidden">
      {/* Sidebar */}
      <div className={`flex w-full flex-col border-r border-white/10 md:w-[320px] md:shrink-0 ${selectedId ? "hidden md:flex" : "flex"}`}>
        <TicketList
          tickets={tickets}
          selectedId={selectedId ?? undefined}
          onSelect={handleSelect}
          isAdmin={true}
        />
      </div>

      {/* Thread */}
      <div className={`flex-1 flex-col ${selectedId ? "flex" : "hidden md:flex"}`}>
        {selectedId && (
          <button
            onClick={() => { setSelectedId(null); setFullTicket(null); setMessages([]); }}
            className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5 text-sm text-[var(--platform-text)]/60 transition hover:text-[var(--platform-text)] md:hidden"
          >
            <ArrowLeft size={14} />
            Voltar
          </button>
        )}

        {loadingThread ? (
          <div className="flex flex-1 items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-[#22D3EE]" />
          </div>
        ) : fullTicket && selectedId ? (
          <TicketThread
            ticketId={selectedId}
            ticket={fullTicket}
            initialMessages={messages}
            userRole="admin"
          />
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
            <p className="text-sm text-[var(--platform-text)]/30">Selecione um chamado para responder</p>
          </div>
        )}
      </div>
    </div>
  );
}
