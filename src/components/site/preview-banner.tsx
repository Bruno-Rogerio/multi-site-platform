"use client";

import { useEffect, useState } from "react";
import { Clock, Sparkles, X } from "lucide-react";

function buildPublishUrl(siteId: string): string {
  const rootDomain =
    typeof process !== "undefined"
      ? (process.env.NEXT_PUBLIC_PLATFORM_ROOT_DOMAIN ?? "bsph.com.br")
      : "bsph.com.br";
  return `https://${rootDomain}/publicar/${siteId}`;
}

type PreviewBannerProps = {
  expiresAt: string; // ISO date string
  siteId: string;
};

function formatCountdown(ms: number): string {
  if (ms <= 0) return "Expirado";
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours > 0) {
    return `${hours}h ${minutes.toString().padStart(2, "0")}m ${seconds.toString().padStart(2, "0")}s`;
  }
  return `${minutes.toString().padStart(2, "0")}m ${seconds.toString().padStart(2, "0")}s`;
}

export function PreviewBanner({ expiresAt, siteId }: PreviewBannerProps) {
  const [timeLeft, setTimeLeft] = useState<number>(() =>
    Math.max(0, new Date(expiresAt).getTime() - Date.now()),
  );
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft(Math.max(0, new Date(expiresAt).getTime() - Date.now()));
    }, 1000);
    return () => clearInterval(interval);
  }, [expiresAt, timeLeft]);

  if (dismissed) return null;

  const isExpired = timeLeft <= 0;
  const isUrgent = timeLeft < 3 * 60 * 60 * 1000; // less than 3h

  return (
    <div
      className={`sticky top-0 z-50 w-full ${
        isExpired
          ? "bg-red-600"
          : isUrgent
          ? "bg-amber-500"
          : "bg-gradient-to-r from-[#3B82F6] to-[#7C5CFF]"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2.5">
        {/* Timer */}
        <div className="flex items-center gap-1.5 text-white/90">
          <Clock size={13} />
          <span className="text-xs font-semibold">
            {isExpired ? "Demonstração expirada" : `Demonstração expira em ${formatCountdown(timeLeft)}`}
          </span>
        </div>

        {/* Divider */}
        <div className="hidden h-4 w-px bg-white/30 sm:block" />

        {/* Message */}
        <p className="hidden flex-1 text-xs text-white/80 sm:block">
          {isExpired
            ? "Este site de demonstração expirou. Publique agora para mantê-lo online."
            : "Este é um site de demonstração gratuito. Publique para torná-lo permanente."}
        </p>

        {/* CTA */}
        <a
          href={buildPublishUrl(siteId)}
          className="ml-auto flex shrink-0 items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-xs font-bold text-[#3B82F6] transition hover:bg-white/90"
        >
          <Sparkles size={11} />
          Publicar meu site
        </a>

        {/* Dismiss */}
        <button
          onClick={() => setDismissed(true)}
          className="ml-2 shrink-0 rounded-full p-0.5 text-white/70 transition hover:text-white"
          aria-label="Fechar"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
