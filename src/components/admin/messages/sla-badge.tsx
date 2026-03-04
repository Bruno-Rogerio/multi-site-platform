"use client";

import { useState, useEffect } from "react";
import { Clock, CheckCircle, AlertTriangle } from "lucide-react";

interface SlaBadgeProps {
  slaDeadline: string;
  status: string;
}

function formatRemaining(ms: number): string {
  if (ms <= 0) return "SLA expirado";
  const totalMinutes = Math.floor(ms / 60_000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours > 0) return `${hours}h ${minutes}m restantes`;
  return `${minutes}m restantes`;
}

export function SlaBadge({ slaDeadline, status }: SlaBadgeProps) {
  const [remaining, setRemaining] = useState(() => new Date(slaDeadline).getTime() - Date.now());

  useEffect(() => {
    if (status === "resolved") return;
    const interval = setInterval(() => {
      setRemaining(new Date(slaDeadline).getTime() - Date.now());
    }, 30_000);
    return () => clearInterval(interval);
  }, [slaDeadline, status]);

  if (status === "resolved") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-white/[0.06] px-2.5 py-1 text-[10px] font-medium text-[var(--platform-text)]/50">
        <CheckCircle size={10} />
        Resolvido
      </span>
    );
  }

  const total = new Date(slaDeadline).getTime() - (Date.now() - remaining); // creation time to deadline
  const deadlineMs = new Date(slaDeadline).getTime();
  const nowMs = Date.now();

  // Approximate total SLA window: 2h or 24h
  // Use ratio of remaining vs a rough window
  let color: "green" | "yellow" | "red";
  if (remaining <= 0) {
    color = "red";
  } else {
    // Determine percentage: we compare remaining to sla window
    // sla_deadline - now / sla_window. We don't store window, so use 24h as fallback
    const window = deadlineMs - (deadlineMs - (remaining > 0 ? 24 * 3_600_000 : 2 * 3_600_000)); // rough
    const pct = remaining / (24 * 3_600_000); // ratio against 24h cap
    if (pct > 0.5) color = "green";
    else if (pct > 0.2) color = "yellow";
    else color = "red";
  }

  const styles = {
    green:  { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20" },
    yellow: { bg: "bg-yellow-500/10",  text: "text-yellow-400",  border: "border-yellow-500/20" },
    red:    { bg: "bg-red-500/10",     text: "text-red-400",     border: "border-red-500/20" },
  }[color];

  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-medium ${styles.bg} ${styles.text} ${styles.border}`}>
      {color === "red" ? <AlertTriangle size={10} /> : <Clock size={10} />}
      {formatRemaining(remaining)}
    </span>
  );
}
