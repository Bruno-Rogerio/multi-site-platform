"use client";

import { Clock } from "lucide-react";
import { useEffect, useState } from "react";

function getTimeLeft(expiresAt: string) {
  const diff = new Date(expiresAt).getTime() - Date.now();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
  };
}

export function DraftCountdown({ expiresAt }: { expiresAt: string }) {
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(expiresAt));

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(getTimeLeft(expiresAt)), 1000);
    return () => clearInterval(timer);
  }, [expiresAt]);

  if (!timeLeft) {
    return (
      <p className="text-sm font-semibold text-red-400">Demonstração expirada.</p>
    );
  }

  const segments = [
    { label: "dias", value: timeLeft.days },
    { label: "horas", value: timeLeft.hours },
    { label: "min", value: timeLeft.minutes },
    { label: "seg", value: timeLeft.seconds },
  ];

  return (
    <div className="inline-flex items-center gap-3 rounded-xl border border-amber-400/20 bg-amber-500/10 px-5 py-3">
      <Clock size={16} className="text-amber-400 shrink-0" />
      <div className="flex items-center gap-1.5">
        {segments.map((seg, i) => (
          <div key={seg.label} className="flex items-center gap-1.5">
            <div className="flex flex-col items-center">
              <span className="w-9 text-center font-mono text-xl font-bold text-[var(--platform-text)]">
                {String(seg.value).padStart(2, "0")}
              </span>
              <span className="text-[9px] uppercase tracking-wide text-[var(--platform-text)]/40">
                {seg.label}
              </span>
            </div>
            {i < segments.length - 1 && (
              <span className="mb-3 text-lg font-bold text-[var(--platform-text)]/30">:</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
