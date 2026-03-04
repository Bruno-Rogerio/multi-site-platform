"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { TicketList, type TicketItem } from "@/components/admin/messages/ticket-list";
import { TicketThread } from "@/components/admin/messages/ticket-thread";
import { NewTicketModal } from "@/components/admin/messages/new-ticket-modal";

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

interface MessagesClientViewProps {
  tickets: unknown[];
}

export function MessagesClientView({ tickets: initialTickets }: MessagesClientViewProps) {
  const [tickets, setTickets]         = useState<TicketItem[]>(initialTickets as TicketItem[]);
  const [selectedId, setSelectedId]   = useState<string | null>(null);
  const [fullTicket, setFullTicket]   = useState<FullTicket | null>(null);
  const [messages, setMessages]       = useState<Message[]>([]);
  const [loadingThread, setLoadingThread] = useState(false);
  const [newTicketOpen, setNewTicketOpen] = useState(false);

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

  function handleCreated(ticket: TicketItem) {
    setTickets((prev) => [ticket, ...prev]);
    handleSelect(ticket.id);
  }

  return (
    <div className="flex h-[calc(100vh-56px)] overflow-hidden">
      {/* Sidebar — ticket list */}
      {/* Mobile: show list OR thread */}
      <div className={`flex w-full flex-col border-r border-white/10 md:w-[300px] md:shrink-0 ${selectedId ? "hidden md:flex" : "flex"}`}>
        <TicketList
          tickets={tickets}
          selectedId={selectedId ?? undefined}
          onSelect={handleSelect}
          onNewTicket={() => setNewTicketOpen(true)}
          isAdmin={false}
        />
      </div>

      {/* Thread panel */}
      <div className={`flex-1 flex-col ${selectedId ? "flex" : "hidden md:flex"}`}>
        {/* Mobile back button */}
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
            userRole="client"
          />
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
            <p className="text-sm text-[var(--platform-text)]/30">Selecione um chamado para ver a conversa</p>
          </div>
        )}
      </div>

      {/* New ticket modal */}
      <NewTicketModal
        open={newTicketOpen}
        onClose={() => setNewTicketOpen(false)}
        onCreated={handleCreated}
      />
    </div>
  );
}
