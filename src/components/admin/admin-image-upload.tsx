"use client";

import { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";

/* ─── Focal point picker (arraste livre) ─── */

function parsePos(val: string): { x: number; y: number } {
  if (!val) return { x: 50, y: 50 };
  const named = (s: string) => {
    if (s === "left" || s === "top") return 0;
    if (s === "right" || s === "bottom") return 100;
    if (s === "center") return 50;
    const n = parseFloat(s);
    return isNaN(n) ? 50 : n;
  };
  const parts = val.trim().split(/\s+/);
  return { x: named(parts[0] ?? "50%"), y: named(parts[1] ?? "50%") };
}

function ImageFocalPointPicker({
  imageUrl,
  value,
  onChange,
}: {
  imageUrl: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const pos = parsePos(value);

  function updateFromClient(clientX: number, clientY: number) {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.round(Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100)));
    const y = Math.round(Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100)));
    onChange(`${x}% ${y}%`);
  }

  function handleMouseDown(e: React.MouseEvent) {
    e.preventDefault();
    dragging.current = true;
    updateFromClient(e.clientX, e.clientY);
    const onMove = (ev: MouseEvent) => { if (dragging.current) updateFromClient(ev.clientX, ev.clientY); };
    const onUp = () => { dragging.current = false; window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }

  function handleTouchStart(e: React.TouchEvent) {
    const t = e.touches[0];
    updateFromClient(t.clientX, t.clientY);
    const onMove = (ev: TouchEvent) => { const t2 = ev.touches[0]; if (t2) updateFromClient(t2.clientX, t2.clientY); };
    const onEnd = () => { window.removeEventListener("touchmove", onMove); window.removeEventListener("touchend", onEnd); };
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("touchend", onEnd);
  }

  return (
    <div>
      <p className="mb-1 text-[10px] text-[var(--platform-text)]/40">Posição — arraste para reposicionar</p>
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        className="relative h-28 w-full overflow-hidden rounded-lg cursor-crosshair select-none"
        style={{ border: "1px solid rgba(255,255,255,0.12)" }}
      >
        <img
          src={imageUrl}
          alt="focal point"
          draggable={false}
          className="pointer-events-none h-full w-full object-cover"
          style={{ objectPosition: value || "50% 50%" }}
        />
        {/* Linhas de mira */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 bottom-0 w-px" style={{ left: `${pos.x}%`, background: "rgba(255,255,255,0.35)" }} />
          <div className="absolute left-0 right-0 h-px" style={{ top: `${pos.y}%`, background: "rgba(255,255,255,0.35)" }} />
        </div>
        {/* Ponto focal */}
        <div
          className="pointer-events-none absolute h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white"
          style={{ left: `${pos.x}%`, top: `${pos.y}%`, background: "rgba(34,211,238,0.5)", boxShadow: "0 0 0 1.5px rgba(0,0,0,0.6), 0 2px 8px rgba(0,0,0,0.5)" }}
        />
        <div className="pointer-events-none absolute bottom-1.5 right-2 rounded bg-black/50 px-1.5 py-0.5 text-[9px] text-white/70">
          arraste
        </div>
      </div>
    </div>
  );
}

interface AdminImageUploadProps {
  label: string;
  currentUrl: string;
  onFileSelect: (file: File) => void;
  onRemove: () => void;
  disabled?: boolean;
  recommendedText?: string;
  aspectRatio?: string;
  objectPosition?: string;
  onPositionChange?: (pos: string) => void;
}

export function AdminImageUpload({
  label,
  currentUrl,
  onFileSelect,
  onRemove,
  disabled = false,
  recommendedText,
  aspectRatio = "16/9",
  objectPosition = "center center",
  onPositionChange,
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
            style={{ aspectRatio, objectPosition }}
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

        {/* Focal point picker — only when position change is enabled */}
        {onPositionChange && (
          <div className="mt-2">
            <ImageFocalPointPicker
              imageUrl={currentUrl}
              value={objectPosition}
              onChange={onPositionChange}
            />
          </div>
        )}

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
