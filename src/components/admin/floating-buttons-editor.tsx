"use client";

import { useState } from "react";
import { Loader2, Radio } from "lucide-react";
import { useToast } from "@/components/admin/toast-provider";

type FloatingLink = {
  type: string;
  url: string;
  icon: string;
  label: string;
};

type Props = {
  siteId: string;
  enabled: boolean;
  floatingLinks: FloatingLink[];
  socialLinks: FloatingLink[];
};

const CHANNEL_COLORS: Record<string, string> = {
  whatsapp: "#25D366",
  instagram: "#E1306C",
  facebook: "#1877F2",
  linkedin: "#0A66C2",
  email: "#7C5CFF",
};

export function FloatingButtonsEditor({ siteId: _siteId, enabled, floatingLinks, socialLinks }: Props) {
  const [isEnabled, setIsEnabled] = useState(enabled);
  const [selected, setSelected] = useState<string[]>(floatingLinks.map(l => l.type));
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  function toggleChannel(type: string) {
    setSelected(prev => {
      if (prev.includes(type)) return prev.filter(id => id !== type);
      if (prev.length >= 2) return prev;
      return [...prev, type];
    });
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/floating-buttons", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: isEnabled, channels: isEnabled ? selected : [] }),
      });
      const data = await res.json().catch(() => null) as { ok?: boolean; error?: string } | null;
      if (res.ok && data?.ok) {
        toast("Botões flutuantes atualizados!", "success");
      } else {
        toast(data?.error ?? "Erro ao salvar.", "error");
      }
    } catch {
      toast("Erro ao salvar.", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-[var(--platform-text)]">Botões flutuantes</h3>
          <p className="text-xs text-[var(--platform-text)]/50">
            Botões fixos no canto da tela para contato rápido
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsEnabled(v => !v)}
          className={`relative h-6 w-11 rounded-full transition ${isEnabled ? "bg-[#22D3EE]" : "bg-white/10"}`}
        >
          <div
            className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all ${
              isEnabled ? "left-6" : "left-1"
            }`}
          />
        </button>
      </div>

      {/* Channel selector */}
      {isEnabled && (
        <div className="space-y-3">
          <p className="text-xs text-[var(--platform-text)]/50">
            Selecione até 2 canais para exibir como botão flutuante:
          </p>

          {socialLinks.length === 0 ? (
            <p className="text-xs text-[var(--platform-text)]/40 italic">
              Nenhum canal de contato configurado no site.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {socialLinks.map(link => {
                const isSelected = selected.includes(link.type);
                const canAdd = isSelected || selected.length < 2;
                const color = CHANNEL_COLORS[link.type] ?? "#22D3EE";

                return (
                  <button
                    key={link.type}
                    type="button"
                    onClick={() => canAdd && toggleChannel(link.type)}
                    className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs transition ${
                      isSelected
                        ? "border-[#22D3EE]/50 bg-[#22D3EE]/10 text-[#22D3EE]"
                        : canAdd
                        ? "border-white/10 text-[var(--platform-text)]/60 hover:border-white/20"
                        : "cursor-not-allowed border-white/5 text-[var(--platform-text)]/30"
                    }`}
                  >
                    <div
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: isSelected ? color : undefined, opacity: isSelected ? 1 : 0.3 }}
                    />
                    {link.label}
                  </button>
                );
              })}
            </div>
          )}

          {/* Preview */}
          {selected.length > 0 && (
            <div className="mt-1">
              <p className="mb-2 text-xs text-[var(--platform-text)]/40">Preview:</p>
              <div className="flex items-center gap-2">
                {selected.map(type => {
                  const link = socialLinks.find(l => l.type === type);
                  const color = CHANNEL_COLORS[type] ?? "#22D3EE";
                  return (
                    <div
                      key={type}
                      title={link?.label ?? type}
                      className="flex h-10 w-10 items-center justify-center rounded-full shadow-lg"
                      style={{ backgroundColor: color }}
                    >
                      <Radio size={16} className="text-white" />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Save button */}
      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="mt-5 flex items-center gap-2 rounded-xl bg-[linear-gradient(135deg,#3B82F6,#7C5CFF)] px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-50"
      >
        {saving && <Loader2 size={14} className="animate-spin" />}
        Salvar
      </button>
    </div>
  );
}
