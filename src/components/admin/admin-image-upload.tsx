"use client";

import { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";

interface AdminImageUploadProps {
  label: string;
  currentUrl: string;
  onFileSelect: (file: File) => void;
  onRemove: () => void;
  disabled?: boolean;
  recommendedText?: string;
  aspectRatio?: string;
}

export function AdminImageUpload({
  label,
  currentUrl,
  onFileSelect,
  onRemove,
  disabled = false,
  recommendedText,
  aspectRatio = "16/9",
}: AdminImageUploadProps) {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
    e.target.value = "";
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      onFileSelect(file);
    }
  }

  const hiddenInput = (
    <input
      ref={inputRef}
      type="file"
      accept="image/*"
      onChange={handleFileChange}
      className="hidden"
      disabled={disabled}
    />
  );

  if (currentUrl) {
    return (
      <div>
        <label className="text-xs font-semibold uppercase tracking-wide text-[var(--platform-text)]/60">
          {label}
        </label>
        <div className="mt-1 group relative overflow-hidden rounded-xl border border-white/15 bg-[#0B1020]">
          <img
            src={currentUrl}
            alt={label}
            className="w-full object-cover"
            style={{ aspectRatio }}
          />
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 opacity-0 transition group-hover:opacity-100">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={disabled}
              className="rounded-lg bg-white/20 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur transition hover:bg-white/30 disabled:opacity-50"
            >
              Alterar
            </button>
            <button
              type="button"
              onClick={onRemove}
              disabled={disabled}
              className="rounded-lg bg-red-500/30 px-3 py-1.5 text-xs font-semibold text-red-200 backdrop-blur transition hover:bg-red-500/50 disabled:opacity-50"
            >
              <X size={14} />
            </button>
          </div>
        </div>
        {recommendedText && (
          <p className="mt-1 text-[11px] text-[var(--platform-text)]/45">{recommendedText}</p>
        )}
        {hiddenInput}
      </div>
    );
  }

  return (
    <div>
      <label className="text-xs font-semibold uppercase tracking-wide text-[var(--platform-text)]/60">
        {label}
      </label>
      <div
        onClick={() => !disabled && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`mt-1 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-6 transition ${
          dragOver
            ? "border-[#22D3EE] bg-[#22D3EE]/10"
            : "border-white/15 bg-[#0B1020] hover:border-white/30"
        } ${disabled ? "pointer-events-none opacity-50" : ""}`}
      >
        {disabled ? (
          <Loader2 size={20} className="animate-spin text-[var(--platform-text)]/40" />
        ) : (
          <Upload size={20} className="text-[var(--platform-text)]/40" />
        )}
        <span className="text-xs text-[var(--platform-text)]/50">
          {disabled ? "Enviando..." : "Clique ou arraste uma imagem"}
        </span>
      </div>
      {recommendedText && (
        <p className="mt-1 text-[11px] text-[var(--platform-text)]/45">{recommendedText}</p>
      )}
      {hiddenInput}
    </div>
  );
}
