"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, Loader2, ImageIcon } from "lucide-react";

interface ImageUploadProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  slot: string;
  aspectRatio?: string;
  description?: string;
}

export function ImageUpload({
  label,
  value,
  onChange,
  slot,
  aspectRatio = "16/9",
  description,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(file: File) {
    if (!file.type.startsWith("image/")) {
      setError("Apenas imagens sao permitidas");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Arquivo muito grande. Maximo 5MB");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("slot", slot);

      const response = await fetch("/api/onboarding/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro no upload");
      }

      onChange(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro no upload");
    } finally {
      setIsUploading(false);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleUpload(file);
    }
  }

  function handleRemove() {
    onChange("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  return (
    <div>
      <label className="text-xs font-medium text-[var(--platform-text)]/60 mb-2 block">
        {label}
      </label>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`relative rounded-xl border-2 border-dashed transition-all overflow-hidden ${
          dragOver
            ? "border-[#22D3EE] bg-[#22D3EE]/10"
            : "border-white/20 bg-white/[0.02]"
        }`}
        style={{ aspectRatio }}
      >
        {value ? (
          // Preview
          <div className="relative h-full">
            <img
              src={value}
              alt={label}
              className="h-full w-full object-cover"
            />
            <button
              onClick={handleRemove}
              className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/80"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          // Upload area
          <div
            onClick={() => inputRef.current?.click()}
            className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer"
          >
            {isUploading ? (
              <Loader2 size={24} className="animate-spin text-[#22D3EE]" />
            ) : (
              <>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 mb-2">
                  {slot === "logoUrl" ? (
                    <ImageIcon size={20} className="text-[var(--platform-text)]/50" />
                  ) : (
                    <Upload size={20} className="text-[var(--platform-text)]/50" />
                  )}
                </div>
                <p className="text-sm font-medium text-[var(--platform-text)]/70">
                  Clique ou arraste
                </p>
                {description && (
                  <p className="text-xs text-[var(--platform-text)]/40 mt-1">
                    {description}
                  </p>
                )}
              </>
            )}
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="mt-2 text-xs text-red-400"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
