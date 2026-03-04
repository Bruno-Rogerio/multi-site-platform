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
};

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  try {
    const date = new Date(dateStr + "T12:00:00");
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(date);
  } catch {
    return dateStr;
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
}: EventsSectionProps) {
  if (events.length === 0) return null;

  return (
    <section id="events" className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-10 text-center">
          <h2
            className="text-3xl font-black tracking-tight"
            style={{ color: "var(--site-text)" }}
          >
            {title}
          </h2>
          {subtitle && (
            <p
              className="mt-3 text-base leading-relaxed"
              style={{ color: "var(--site-text)", opacity: 0.6 }}
            >
              {subtitle}
            </p>
          )}
        </div>

        {/* Events list */}
        <div className="relative space-y-4">
          {/* Timeline line */}
          <div
            className="absolute left-7 top-0 h-full w-px"
            style={{ backgroundColor: "var(--site-border)" }}
          />

          {events.map((event, i) => {
            const upcoming = isFuture(event.date);
            return (
              <div
                key={i}
                className="relative flex gap-5"
                style={{ opacity: upcoming ? 1 : 0.5 }}
              >
                {/* Timeline dot */}
                <div
                  className="relative z-10 flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl border text-center"
                  style={{
                    borderColor: upcoming ? "var(--site-primary)" : "var(--site-border)",
                    backgroundColor: upcoming
                      ? "color-mix(in srgb, var(--site-primary) 10%, transparent)"
                      : "var(--site-surface)",
                    color: upcoming ? "var(--site-primary)" : "var(--site-text)",
                  }}
                >
                  <Calendar size={18} />
                  {!upcoming && (
                    <span className="mt-0.5 text-[8px] font-bold uppercase tracking-wider">
                      Passado
                    </span>
                  )}
                </div>

                {/* Content */}
                <div
                  className="flex-1 rounded-[var(--site-radius,12px)] border p-4"
                  style={{
                    borderColor: upcoming
                      ? "color-mix(in srgb, var(--site-primary) 25%, transparent)"
                      : "var(--site-border)",
                    backgroundColor: "var(--site-surface)",
                    boxShadow: upcoming ? "var(--site-shadow)" : "none",
                  }}
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <h3
                      className="text-base font-bold"
                      style={{ color: "var(--site-text)" }}
                    >
                      {event.title}
                    </h3>
                    {upcoming && (
                      <span
                        className="rounded-full px-2.5 py-0.5 text-xs font-semibold text-white"
                        style={{ backgroundColor: "var(--site-primary)" }}
                      >
                        Em breve
                      </span>
                    )}
                  </div>

                  <div className="mt-2 flex flex-wrap gap-3">
                    {event.date && (
                      <span
                        className="flex items-center gap-1.5 text-xs"
                        style={{ color: "var(--site-text)", opacity: 0.7 }}
                      >
                        <Calendar size={12} />
                        {formatDate(event.date)}
                      </span>
                    )}
                    {event.time && (
                      <span
                        className="flex items-center gap-1.5 text-xs"
                        style={{ color: "var(--site-text)", opacity: 0.7 }}
                      >
                        <Clock size={12} />
                        {event.time}
                      </span>
                    )}
                    {event.location && (
                      <span
                        className="flex items-center gap-1.5 text-xs"
                        style={{ color: "var(--site-text)", opacity: 0.7 }}
                      >
                        <MapPin size={12} />
                        {event.location}
                      </span>
                    )}
                  </div>

                  {event.description && (
                    <p
                      className="mt-3 text-sm leading-relaxed"
                      style={{ color: "var(--site-text)", opacity: 0.65 }}
                    >
                      {event.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
