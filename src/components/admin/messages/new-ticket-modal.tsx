"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Paperclip, AlertCircle } from "lucide-react";
import type { TicketItem } from "./ticket-list";

interface NewTicketModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: (ticket: TicketItem) => void;
  sitePlan?: string;
}

const CATEGORIES = [
  { value: "suporte",     label: "Suporte técnico" },
  { value: "duvida",      label: "Dúvida" },
  { value: "faturamento", label: "Faturamento" },
  { value: "sugestao",    label: "Sugestão" },
];

type Attachment = { url: string; name: string; size: number; type: string };

export function NewTicketModal({ open, onClose, onCreated, sitePlan = "landing" }: NewTicketModalProps) {
  const isPro = sitePlan === "pro";
  const slaHours = isPro ? 2 : 24;
  const slaLabel = isPro ? "Resposta garantida em até 2h" : "Prazo de resposta: até 24h";
  const [subject, setSubject]     = useState("");
  const [category, setCategory]   = useState("suporte");
  const [body, setBody]           = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]         = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  // We need a temp ticketId for upload — we'll upload after ticket is created
  // instead, collect files locally and upload in one pass
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);

  function handleClose() {
    if (submitting) return;
    setSubject(""); setCategory("suporte"); setBody("");
    setAttachments([]); setPendingFiles([]); setError(null);
    onClose();
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setError("Arquivo muito grande. Máximo 10MB.");
      return;
    }
    setPendingFiles((prev) => [...prev, file]);
    if (fileRef.current) fileRef.current.value = "";
  }

  function removeFile(index: number) {
    setPendingFiles((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (subject.trim().length < 3) { setError("Assunto deve ter pelo menos 3 caracteres."); return; }
    if (body.trim().length < 10)   { setError("Mensagem deve ter pelo menos 10 caracteres."); return; }

    setSubmitting(true);
    try {
      // 1. Create ticket to get ticketId
      const createRes = await fetch("/api/admin/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject: subject.trim(), category, body: body.trim(), attachments: [] }),
      });
      const createData = await createRes.json();
      if (!createRes.ok) throw new Error(createData.error ?? "Erro ao criar chamado.");

      const ticketId: string = createData.ticketId;
      const slaDeadlineFromApi: string = createData.sla_deadline ?? new Date(Date.now() + slaHours * 3_600_000).toISOString();

      // 2. Upload pending files
      const uploadedAttachments: Attachment[] = [];
      if (pendingFiles.length > 0) {
        setUploading(true);
        for (const file of pendingFiles) {
          const fd = new FormData();
          fd.append("file", file);
          fd.append("ticketId", ticketId);
          const upRes = await fetch("/api/admin/tickets/upload", { method: "POST", body: fd });
          const upData = await upRes.json();
          if (upRes.ok) uploadedAttachments.push(upData as Attachment);
        }
        setUploading(false);
      }

      // 3. If attachments, patch the first message (or just refresh — simpler: pass attachments to onCreated)
      const minimalTicket: TicketItem = {
        id: ticketId,
        subject: subject.trim(),
        category,
        status: "open",
        sla_deadline: slaDeadlineFromApi,
        updated_at: new Date().toISOString(),
        ticket_messages: [{ count: 1 }],
      };

      onCreated(minimalTicket);
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido.");
    } finally {
      setSubmitting(false);
      setUploading(false);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ type: "spring", damping: 25, stiffness: 320 }}
            className="fixed inset-x-4 top-[10vh] z-50 mx-auto max-w-lg rounded-2xl border border-white/10 bg-[#0B1020] shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
              <div>
                <h2 className="text-base font-semibold text-[var(--platform-text)]">Novo chamado</h2>
                <span className={`mt-0.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                  isPro
                    ? "bg-[#22D3EE]/10 text-[#22D3EE]"
                    : "bg-white/[0.06] text-[var(--platform-text)]/50"
                }`}>
                  {slaLabel}
                </span>
              </div>
              <button
                onClick={handleClose}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--platform-text)]/50 transition hover:bg-white/[0.06] hover:text-[var(--platform-text)]"
              >
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Subject */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-[var(--platform-text)]/60">
                  Assunto
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Descreva brevemente o problema..."
                  maxLength={120}
                  className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-[var(--platform-text)] placeholder-[var(--platform-text)]/30 outline-none focus:border-[#22D3EE]/50 focus:ring-1 focus:ring-[#22D3EE]/20"
                />
              </div>

              {/* Category */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-[var(--platform-text)]/60">
                  Categoria
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-[#12182B] px-3 py-2.5 text-sm text-[var(--platform-text)] outline-none focus:border-[#22D3EE]/50 focus:ring-1 focus:ring-[#22D3EE]/20"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>

              {/* Message */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-[var(--platform-text)]/60">
                  Mensagem
                </label>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Descreva o problema com o máximo de detalhes possível..."
                  rows={5}
                  className="w-full resize-none rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-[var(--platform-text)] placeholder-[var(--platform-text)]/30 outline-none focus:border-[#22D3EE]/50 focus:ring-1 focus:ring-[#22D3EE]/20"
                />
              </div>

              {/* Attachments */}
              <div>
                <input ref={fileRef} type="file" onChange={handleFileChange} className="hidden" />
                {pendingFiles.length > 0 && (
                  <ul className="mb-2 space-y-1">
                    {pendingFiles.map((f, i) => (
                      <li key={i} className="flex items-center justify-between rounded-lg bg-white/[0.04] px-3 py-2 text-xs text-[var(--platform-text)]/70">
                        <span className="truncate">{f.name}</span>
                        <button type="button" onClick={() => removeFile(i)} className="ml-2 text-[var(--platform-text)]/40 hover:text-red-400">
                          <X size={12} />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="flex items-center gap-1.5 text-xs text-[var(--platform-text)]/50 transition hover:text-[var(--platform-text)]"
                >
                  <Paperclip size={13} />
                  Adicionar anexo
                </button>
              </div>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 rounded-lg bg-red-500/10 px-3 py-2.5 text-xs text-red-400"
                  >
                    <AlertCircle size={13} />
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="rounded-lg px-4 py-2 text-sm text-[var(--platform-text)]/60 transition hover:text-[var(--platform-text)]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting || uploading}
                  className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#3B82F6] to-[#7C5CFF] px-5 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
                >
                  {(submitting || uploading) && <Loader2 size={14} className="animate-spin" />}
                  {submitting ? "Enviando…" : uploading ? "Enviando arquivos…" : "Abrir chamado"}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
