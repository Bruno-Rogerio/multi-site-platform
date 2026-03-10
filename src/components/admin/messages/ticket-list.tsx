"use client";

import { Plus, MessageSquare, ShieldAlert } from "lucide-react";
import { SlaBadge } from "./sla-badge";

export type TicketItem = {
  id: string;
  subject: string;
  category: string;
  status: string;
  sla_deadline: string;
  sla_breached?: boolean;
  updated_at: string;
  sites?: { name: string } | null;
  ticket_messages?: { count: number }[];
};

const CATEGORY_LABELS: Record<string, string> = {
  suporte:     "Suporte técnico",
  duvida:      "Dúvida",
  faturamento: "Faturamento",
  sugestao:    "Sugestão",
};

const STATUS_STYLES: Record<string, string> = {
  open:           "bg-blue-500/10 text-blue-400",
  in_progress:    "bg-violet-500/10 text-violet-400",
  waiting_client: "bg-yellow-500/10 text-yellow-400",
  resolved:       "bg-white/[0.06] text-[var(--platform-text)]/40",
};

const STATUS_LABELS: Record<string, string> = {
  open:           "Aberto",
  in_progress:    "Em andamento",
  waiting_client: "Aguardando resposta",
  resolved:       "Resolvido",
};

interface TicketListProps {
  tickets: TicketItem[];
  selectedId?: string;
  onSelect: (id: string) => void;
  onNewTicket?: () => void;
  isAdmin?: boolean;
}

export function TicketList({ tickets, selectedId, onSelect, onNewTicket, isAdmin }: TicketListProps) {
  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <h2 className="text-sm font-semibold text-[var(--platform-text)]">
          Chamados
          {tickets.length > 0 && (
            <span className="ml-2 text-xs font-normal text-[var(--platform-text)]/40">
              ({tickets.length})
            </span>
          )}
        </h2>
        {!isAdmin && onNewTicket && (
          <button
            onClick={onNewTicket}
            className="flex items-center gap-1.5 rounded-lg bg-[#22D3EE]/10 px-3 py-1.5 text-xs font-medium text-[#22D3EE] transition hover:bg-[#22D3EE]/20"
          >
            <Plus size={13} />
            Novo
          </button>
        )}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {tickets.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <MessageSquare size={28} className="text-[var(--platform-text)]/20" />
            <p className="text-sm text-[var(--platform-text)]/40">Nenhum chamado ainda.</p>
            {!isAdmin && onNewTicket && (
              <button
                onClick={onNewTicket}
                className="mt-1 text-xs font-medium text-[#22D3EE] hover:underline"
              >
                Abrir primeiro chamado
              </button>
            )}
          </div>
        ) : (
          <ul className="divide-y divide-white/[0.05]">
            {tickets.map((ticket) => {
              const msgCount = ticket.ticket_messages?.[0]?.count ?? 0;
              const isSelected = ticket.id === selectedId;
              const isSlaUrgent = ticket.status !== "resolved" && new Date(ticket.sla_deadline).getTime() - Date.now() < 2 * 3_600_000;

              return (
                <li key={ticket.id}>
                  <button
                    onClick={() => onSelect(ticket.id)}
                    className={`w-full px-4 py-3 text-left transition hover:bg-white/[0.04] ${
                      isSelected ? "bg-[#22D3EE]/[0.06] border-l-2 border-[#22D3EE]" : "border-l-2 border-transparent"
                    } ${isSlaUrgent ? "bg-red-500/[0.03]" : ""}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className={`flex-1 text-xs font-semibold leading-tight ${isSelected ? "text-[#22D3EE]" : "text-[var(--platform-text)]"}`}>
                        {ticket.subject}
                      </p>
                      {msgCount > 0 && (
                        <span className="flex shrink-0 items-center gap-1 text-[10px] text-[var(--platform-text)]/40">
                          <MessageSquare size={9} />
                          {msgCount}
                        </span>
                      )}
                    </div>

                    {/* Site name (admin only) */}
                    {isAdmin && ticket.sites?.name && (
                      <p className="mt-0.5 text-[10px] text-[#22D3EE]/70">{ticket.sites.name}</p>
                    )}

                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                      <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[9px] font-medium text-[var(--platform-text)]/50">
                        {CATEGORY_LABELS[ticket.category] ?? ticket.category}
                      </span>
                      <span className={`rounded-full px-2 py-0.5 text-[9px] font-medium ${STATUS_STYLES[ticket.status] ?? "bg-white/5 text-white/40"}`}>
                        {STATUS_LABELS[ticket.status] ?? ticket.status}
                      </span>
                    </div>

                    <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                      <SlaBadge slaDeadline={ticket.sla_deadline} status={ticket.status} />
                      {ticket.status !== "resolved" && new Date(ticket.sla_deadline) < new Date() && (
                        <span className="flex animate-pulse items-center gap-1 rounded-full bg-red-500/20 px-2 py-0.5 text-[9px] font-semibold text-red-400">
                          <ShieldAlert size={9} />
                          SLA violado
                        </span>
                      )}
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
