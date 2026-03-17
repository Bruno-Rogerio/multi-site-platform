"use client";

import { Calendar, Clock, MapPin } from "lucide-react";

type EventItem = {
  title: string;
  date: string;
  time?: string;
  location?: string;
  description?: string;
};

type EventsSectionProps = {
  title?: string;
  subtitle?: string;
  events?: EventItem[];
  maxItems?: number;
  viewAllHref?: string;
  variant?: string;
};

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  try {
    const date = new Date(dateStr + "T12:00:00");
    return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "long", year: "numeric" }).format(date);
  } catch {
    return dateStr;
  }
}

function formatDateShort(dateStr: string): { day: string; month: string } {
  if (!dateStr) return { day: "--", month: "---" };
  try {
    const date = new Date(dateStr + "T12:00:00");
    return {
      day: new Intl.DateTimeFormat("pt-BR", { day: "2-digit" }).format(date),
      month: new Intl.DateTimeFormat("pt-BR", { month: "short" }).format(date).replace(".", "").toUpperCase(),
    };
  } catch {
    return { day: "--", month: "---" };
  }
}

function isFuture(dateStr: string): boolean {
  if (!dateStr) return true;
  try {
    const date = new Date(dateStr + "T12:00:00");
    return date >= new Date();
  } catch {
    return true;
  }
}

export function EventsSection({
  title = "Eventos",
  subtitle,
  events = [],
  maxItems,
  viewAllHref,
  variant = "timeline",
}: EventsSectionProps) {
  const displayEvents = maxItems
    ? [...events]
        .filter((e) => isFuture(e.date))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, maxItems)
    : events;

  if (displayEvents.length === 0) return null;

  const Header = () => (
    <div className="mb-10 text-center">
      <h2 className="text-3xl font-black tracking-tight" style={{ color: "var(--site-text)" }}>{title}</h2>
      {subtitle && <p className="mt-3 text-base leading-relaxed" style={{ color: "var(--site-text)", opacity: 0.6 }}>{subtitle}</p>}
    </div>
  );

  const ViewAll = () => viewAllHref ? (
    <div className="mt-8 text-center">
      <a href={viewAllHref} className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition hover:opacity-80" style={{ backgroundColor: "var(--site-primary)", color: "#fff" }}>
        Ver todos os eventos →
      </a>
    </div>
  ) : null;

  // ── CARDS ──
  if (variant === "cards") {
    return (
      <section id="events" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <Header />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {displayEvents.map((event, i) => {
              const upcoming = isFuture(event.date);
              const { day, month } = formatDateShort(event.date);
              return (
                <div
                  key={i}
                  className="relative overflow-hidden rounded-[var(--site-radius,16px)] border transition-all hover:-translate-y-0.5"
                  style={{
                    borderColor: upcoming ? "color-mix(in srgb, var(--site-primary) 35%, transparent)" : "var(--site-border)",
                    backgroundColor: "var(--site-surface)",
                    boxShadow: upcoming ? "var(--site-shadow)" : "none",
                    opacity: upcoming ? 1 : 0.55,
                  }}
                >
                  {/* Date badge */}
                  <div
                    className="flex items-center gap-3 px-5 py-4 border-b"
                    style={{ borderColor: "color-mix(in srgb, var(--site-text) 8%, transparent)" }}
                  >
                    <div
                      className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl text-white"
                      style={{ backgroundColor: upcoming ? "var(--site-primary)" : "var(--site-border)" }}
                    >
                      <span className="text-xl font-black leading-none">{day}</span>
                      <span className="text-[10px] font-semibold tracking-wider">{month}</span>
                    </div>
                    <div>
                      <h3 className="font-bold leading-snug text-sm" style={{ color: "var(--site-text)" }}>{event.title}</h3>
                      {upcoming && (
                        <span className="mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold text-white" style={{ backgroundColor: "var(--site-primary)" }}>
                          Em breve
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="px-5 py-4 space-y-2">
                    {event.time && (
                      <span className="flex items-center gap-1.5 text-xs" style={{ color: "var(--site-text)", opacity: 0.7 }}>
                        <Clock size={12} />{event.time}
                      </span>
                    )}
                    {event.location && (
                      <span className="flex items-center gap-1.5 text-xs" style={{ color: "var(--site-text)", opacity: 0.7 }}>
                        <MapPin size={12} />{event.location}
                      </span>
                    )}
                    {event.description && (
                      <p className="text-sm leading-relaxed" style={{ color: "var(--site-text)", opacity: 0.65 }}>{event.description}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <ViewAll />
        </div>
      </section>
    );
  }

  // ── LIST ──
  if (variant === "list") {
    return (
      <section id="events" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <Header />
          <div className="divide-y" style={{ borderColor: "color-mix(in srgb, var(--site-text) 10%, transparent)" }}>
            {displayEvents.map((event, i) => {
              const upcoming = isFuture(event.date);
              const { day, month } = formatDateShort(event.date);
              return (
                <div key={i} className="flex items-center gap-4 py-4" style={{ opacity: upcoming ? 1 : 0.5 }}>
                  <div
                    className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl text-white"
                    style={{ backgroundColor: upcoming ? "var(--site-primary)" : "var(--site-border)" }}
                  >
                    <span className="text-base font-black leading-none">{day}</span>
                    <span className="text-[9px] font-semibold tracking-wider">{month}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate" style={{ color: "var(--site-text)" }}>{event.title}</p>
                    <div className="mt-0.5 flex flex-wrap items-center gap-3">
                      {event.time && (
                        <span className="flex items-center gap-1 text-xs" style={{ color: "var(--site-text)", opacity: 0.6 }}>
                          <Clock size={11} />{event.time}
                        </span>
                      )}
                      {event.location && (
                        <span className="flex items-center gap-1 text-xs" style={{ color: "var(--site-text)", opacity: 0.6 }}>
                          <MapPin size={11} />{event.location}
                        </span>
                      )}
                    </div>
                  </div>
                  {upcoming && (
                    <span className="shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold text-white" style={{ backgroundColor: "var(--site-primary)" }}>
                      Em breve
                    </span>
                  )}
                </div>
              );
            })}
          </div>
          <ViewAll />
        </div>
      </section>
    );
  }

  // ── TIMELINE (default) ──
  return (
    <section id="events" className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <Header />
        <div className="relative space-y-4">
          <div className="absolute left-7 top-0 h-full w-px" style={{ backgroundColor: "var(--site-border)" }} />
          {displayEvents.map((event, i) => {
            const upcoming = isFuture(event.date);
            return (
              <div key={i} className="relative flex gap-5" style={{ opacity: upcoming ? 1 : 0.5 }}>
                <div
                  className="relative z-10 flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl border text-center"
                  style={{
                    borderColor: upcoming ? "var(--site-primary)" : "var(--site-border)",
                    backgroundColor: upcoming ? "color-mix(in srgb, var(--site-primary) 10%, transparent)" : "var(--site-surface)",
                    color: upcoming ? "var(--site-primary)" : "var(--site-text)",
                  }}
                >
                  <Calendar size={18} />
                  {!upcoming && <span className="mt-0.5 text-[8px] font-bold uppercase tracking-wider">Passado</span>}
                </div>
                <div
                  className="flex-1 rounded-[var(--site-radius,12px)] border p-4"
                  style={{
                    borderColor: upcoming ? "color-mix(in srgb, var(--site-primary) 25%, transparent)" : "var(--site-border)",
                    backgroundColor: "var(--site-surface)",
                    boxShadow: upcoming ? "var(--site-shadow)" : "none",
                  }}
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <h3 className="text-base font-bold" style={{ color: "var(--site-text)" }}>{event.title}</h3>
                    {upcoming && (
                      <span className="rounded-full px-2.5 py-0.5 text-xs font-semibold text-white" style={{ backgroundColor: "var(--site-primary)" }}>
                        Em breve
                      </span>
                    )}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-3">
                    {event.date && (
                      <span className="flex items-center gap-1.5 text-xs" style={{ color: "var(--site-text)", opacity: 0.7 }}>
                        <Calendar size={12} />{formatDate(event.date)}
                      </span>
                    )}
                    {event.time && (
                      <span className="flex items-center gap-1.5 text-xs" style={{ color: "var(--site-text)", opacity: 0.7 }}>
                        <Clock size={12} />{event.time}
                      </span>
                    )}
                    {event.location && (
                      <span className="flex items-center gap-1.5 text-xs" style={{ color: "var(--site-text)", opacity: 0.7 }}>
                        <MapPin size={12} />{event.location}
                      </span>
                    )}
                  </div>
                  {event.description && (
                    <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--site-text)", opacity: 0.65 }}>{event.description}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <ViewAll />
      </div>
    </section>
  );
}
