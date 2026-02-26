"use client";

import { useState, useEffect } from "react";
import { X, ZoomIn } from "lucide-react";

interface ServiceImageModalProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
}

export function ServiceImageModal({ src, alt, className, style }: ServiceImageModalProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Thumbnail — clicável */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group relative block w-full cursor-zoom-in overflow-hidden"
        style={style}
        aria-label={`Ampliar foto: ${alt}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className={className} />
        <span className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-200 group-hover:bg-black/30">
          <ZoomIn size={20} className="text-white opacity-0 drop-shadow transition-opacity duration-200 group-hover:opacity-100" />
        </span>
      </button>

      {/* Lightbox */}
      {open && (
        <div
          role="dialog"
          aria-modal
          aria-label={alt}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          {/* Fechar */}
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            aria-label="Fechar"
          >
            <X size={18} />
          </button>

          {/* Imagem ampliada */}
          <div
            className="relative max-h-[90dvh] max-w-[90vw]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={alt}
              className="max-h-[90dvh] max-w-[90vw] rounded-xl object-contain shadow-2xl"
            />
            {alt && (
              <p className="mt-2 text-center text-sm text-white/60">{alt}</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
