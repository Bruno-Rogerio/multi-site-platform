import Image from "next/image";
import * as LucideIcons from "lucide-react";

import type { Site } from "@/lib/tenant/types";
import type { Section } from "@/lib/tenant/types";
import { TestimonialsCarousel } from "./testimonials-carousel";
import { ServiceImageModal } from "./service-image-modal";
import { StaggeredCards } from "./staggered-cards";

type SectionRendererProps = {
  section: Section;
  site: Site;
  buttonStyleClassName: string;
};

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

type ServiceCard = { title: string; description?: string; iconName?: string; imageUrl?: string };

function asCards(value: unknown): ServiceCard[] {
  if (!Array.isArray(value)) return [];
  const result: ServiceCard[] = [];
  for (const item of value) {
    if (!item || typeof item !== "object") continue;
    const rec = item as Record<string, unknown>;
    const title = typeof rec.title === "string" ? rec.title : "";
    if (!title) continue;
    result.push({
      title,
      description: typeof rec.description === "string" ? rec.description : "",
      iconName: typeof rec.iconName === "string" ? rec.iconName : "",
      imageUrl: typeof rec.imageUrl === "string" ? rec.imageUrl : "",
    });
  }
  return result;
}

type SocialLink = { type: string; url: string; label: string; icon: string };

function asSocialLinks(value: unknown): SocialLink[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const rec = item as Record<string, unknown>;
      const url = typeof rec.url === "string" ? rec.url : "";
      if (!url) return null;
      return {
        type: typeof rec.type === "string" ? rec.type : "",
        url,
        label: typeof rec.label === "string" ? rec.label : "",
        icon: typeof rec.icon === "string" ? rec.icon : "",
      };
    })
    .filter((l): l is SocialLink => l !== null);
}

function getIcon(iconName: string) {
  if (!iconName) return null;
  return (LucideIcons as unknown as Record<string, React.ComponentType<{ size?: number; className?: string }>>)[iconName] ?? null;
}

type Testimonial = { quote: string; author: string };

function asTestimonials(value: unknown): Testimonial[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const quote = asString((item as Record<string, unknown>).quote);
      const author = asString((item as Record<string, unknown>).author);
      if (!quote || !author) return null;
      return { quote, author };
    })
    .filter((item): item is Testimonial => item !== null);
}

const containerClass = "mx-auto w-full max-w-6xl px-6";

/* ── Reusable style helpers ───────────────────────────── */

const glassCard = {
  border: "1px solid color-mix(in srgb, var(--site-primary) 22%, var(--site-border))",
  background: "color-mix(in srgb, var(--site-surface) 75%, transparent)",
  backdropFilter: "blur(12px) saturate(1.4)",
  WebkitBackdropFilter: "blur(12px) saturate(1.4)",
  boxShadow:
    "0 4px 24px color-mix(in srgb, var(--site-primary) 10%, transparent), inset 0 1px 0 color-mix(in srgb, white 8%, transparent)",
} as React.CSSProperties;

const iconGradient = {
  background:
    "linear-gradient(135deg, color-mix(in srgb, var(--site-primary) 22%, transparent), color-mix(in srgb, var(--site-accent) 18%, transparent))",
} as React.CSSProperties;

/* ── Section title decorator ──────────────────────────── */
function SectionEyebrow({ label }: { label: string }) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <div
        className="h-[2px] w-8 rounded-full"
        style={{
          background: "linear-gradient(90deg, var(--site-primary), var(--site-accent))",
        }}
      />
      <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--site-accent)]">
        {label}
      </span>
    </div>
  );
}

export function SectionRenderer({
  section,
  site,
  buttonStyleClassName,
}: SectionRendererProps) {
  const variant = section.variant ?? "default";
  const cardRadius = "calc(var(--site-radius, 12px) * 0.67)";

  // ─── HERO ───────────────────────────────────────────────
  if (section.type === "hero") {
    const eyebrow = asString(section.content.eyebrow);
    const title = asString(section.content.title, site.name);
    const subtitle = asString(section.content.subtitle);
    const ctaLabel = asString(section.content.ctaLabel, "Entrar em contato");
    const ctaHref = asString(section.content.ctaHref, "#contact");
    const imageUrl = asString(section.content.imageUrl);

    /* ── HERO SPLIT ── */
    if (variant === "split") {
      return (
        <section id="hero" className="relative w-full overflow-hidden">
          {/* Orbs */}
          <div
            className="pointer-events-none absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full opacity-[0.18] blur-[120px]"
            style={{ background: "var(--site-primary)" }}
          />
          <div
            className="pointer-events-none absolute -bottom-32 right-0 h-80 w-80 rounded-full opacity-[0.14] blur-[100px]"
            style={{ background: "var(--site-accent)" }}
          />
          <div className="relative mx-auto grid w-full max-w-7xl gap-8 px-6 py-16 md:grid-cols-2 md:items-center md:py-28">
            <div>
              {eyebrow && (
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--site-accent)]">
                  {eyebrow}
                </p>
              )}
              <h1 className="text-4xl font-bold leading-[1.1] md:text-5xl lg:text-6xl">{title}</h1>
              {subtitle && (
                <p className="mt-5 max-w-lg text-lg leading-relaxed opacity-70">{subtitle}</p>
              )}
              <a
                href={ctaHref}
                className={`mt-8 inline-flex bg-[var(--site-primary)] px-6 py-3.5 text-sm font-semibold transition hover:brightness-110 ${buttonStyleClassName}`}
                style={{ color: "var(--site-button-text)" }}
              >
                {ctaLabel}
              </a>
            </div>
            {imageUrl ? (
              <div
                className="overflow-hidden"
                style={{
                  borderRadius: cardRadius,
                  boxShadow:
                    "0 20px 60px color-mix(in srgb, var(--site-primary) 18%, transparent), 0 2px 8px rgba(0,0,0,0.15)",
                  border: "1px solid color-mix(in srgb, var(--site-primary) 20%, var(--site-border))",
                }}
              >
                <Image
                  src={imageUrl}
                  alt={title}
                  width={1280}
                  height={960}
                  className="aspect-[4/3] h-auto w-full object-cover"
                />
              </div>
            ) : (
              <div
                className="flex aspect-[4/3] items-center justify-center"
                style={{
                  borderRadius: cardRadius,
                  border: "1px dashed var(--site-border)",
                  backgroundColor: "color-mix(in srgb, var(--site-primary) 5%, transparent)",
                }}
              >
                <span className="text-sm opacity-30">Sua imagem aqui</span>
              </div>
            )}
          </div>
        </section>
      );
    }

    /* ── HERO CENTERED ── */
    if (variant === "centered") {
      return (
        <section
          id="hero"
          className="relative w-full overflow-hidden py-16 md:py-28"
          style={{
            background:
              "radial-gradient(ellipse 80% 55% at 50% -10%, color-mix(in srgb, var(--site-primary) 18%, transparent), transparent)",
          }}
        >
          {/* Orbs */}
          <div
            className="pointer-events-none absolute -left-32 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full opacity-[0.12] blur-[90px]"
            style={{ background: "var(--site-accent)" }}
          />
          <div
            className="pointer-events-none absolute -right-32 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full opacity-[0.10] blur-[80px]"
            style={{ background: "var(--site-primary)" }}
          />
          <div className="relative mx-auto max-w-4xl px-6 text-center">
            {imageUrl && (
              <div
                className="mx-auto mb-8 overflow-hidden"
                style={{
                  borderRadius: cardRadius,
                  boxShadow:
                    "0 16px 48px color-mix(in srgb, var(--site-primary) 14%, transparent)",
                  border: "1px solid color-mix(in srgb, var(--site-primary) 18%, var(--site-border))",
                }}
              >
                <Image
                  src={imageUrl}
                  alt={title}
                  width={1280}
                  height={720}
                  className="aspect-[16/9] h-auto w-full object-cover"
                />
              </div>
            )}
            {eyebrow && (
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--site-accent)]">
                {eyebrow}
              </p>
            )}
            <h1 className="text-4xl font-bold leading-[1.1] md:text-5xl lg:text-6xl">{title}</h1>
            {subtitle && (
              <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed opacity-70">{subtitle}</p>
            )}
            <a
              href={ctaHref}
              className={`mt-8 inline-flex bg-[var(--site-primary)] px-6 py-3.5 text-sm font-semibold transition hover:brightness-110 ${buttonStyleClassName}`}
              style={{ color: "var(--site-button-text)" }}
            >
              {ctaLabel}
            </a>
          </div>
        </section>
      );
    }

    /* ── HERO MINIMAL ── */
    if (variant === "minimal") {
      return (
        <section id="hero" className="relative w-full overflow-hidden py-16 md:py-24">
          {/* Subtle orb — mantém feel editorial mas adiciona profundidade */}
          <div
            className="pointer-events-none absolute right-0 top-0 h-[360px] w-[360px] -translate-y-1/3 translate-x-1/3 rounded-full opacity-[0.08] blur-[100px]"
            style={{ background: "var(--site-primary)" }}
          />
          <div className="relative mx-auto max-w-7xl px-6">
            {imageUrl && (
              <div
                className="mb-10 overflow-hidden"
                style={{
                  borderRadius: cardRadius,
                  border: "1px solid var(--site-border)",
                  boxShadow: "0 8px 32px color-mix(in srgb, var(--site-primary) 8%, transparent)",
                }}
              >
                <Image
                  src={imageUrl}
                  alt={title}
                  width={1280}
                  height={540}
                  className="aspect-[21/9] h-auto w-full object-cover"
                />
              </div>
            )}
            {eyebrow && (
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--site-accent)]">
                {eyebrow}
              </p>
            )}
            <h1
              className="max-w-4xl border-l-[6px] pl-6 text-4xl font-bold leading-[1.1] md:text-6xl lg:text-7xl"
              style={{ borderColor: "var(--site-primary)" }}
            >
              {title}
            </h1>
            {subtitle && (
              <p className="mt-6 max-w-2xl text-lg leading-relaxed opacity-60">{subtitle}</p>
            )}
            <a
              href={ctaHref}
              className="mt-8 inline-flex items-center gap-2 text-sm font-semibold underline decoration-2 underline-offset-4 transition hover:opacity-100"
              style={{
                color: "var(--site-primary)",
                textDecorationColor: "color-mix(in srgb, var(--site-primary) 40%, transparent)",
              }}
            >
              {ctaLabel} <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </section>
      );
    }

    /* ── HERO CARD ── */
    if (variant === "card") {
      return (
        <section
          id="hero"
          className="relative w-full overflow-hidden py-16 md:py-24"
          style={{
            background:
              "radial-gradient(ellipse at top, color-mix(in srgb, var(--site-primary) 14%, var(--site-background)), var(--site-background))",
          }}
        >
          {/* Orbs */}
          <div
            className="pointer-events-none absolute -left-40 -top-20 h-[400px] w-[400px] rounded-full opacity-[0.14] blur-[110px]"
            style={{ background: "var(--site-primary)" }}
          />
          <div
            className="pointer-events-none absolute -bottom-20 -right-32 h-80 w-80 rounded-full opacity-[0.12] blur-[90px]"
            style={{ background: "var(--site-accent)" }}
          />
          <div
            className="relative mx-auto max-w-4xl overflow-hidden p-8 text-center md:p-12"
            style={{
              borderRadius: "var(--site-radius, 24px)",
              border: "1px solid color-mix(in srgb, var(--site-primary) 22%, transparent)",
              boxShadow:
                "0 12px 48px color-mix(in srgb, var(--site-primary) 14%, transparent), inset 0 1px 0 color-mix(in srgb, white 8%, transparent)",
              backdropFilter: "blur(16px) saturate(1.5)",
              WebkitBackdropFilter: "blur(16px) saturate(1.5)",
              backgroundColor: "color-mix(in srgb, var(--site-surface) 70%, transparent)",
            }}
          >
            {imageUrl && (
              <div
                className="mx-auto mb-8 overflow-hidden"
                style={{ borderRadius: cardRadius, border: "1px solid var(--site-border)" }}
              >
                <Image
                  src={imageUrl}
                  alt={title}
                  width={1280}
                  height={720}
                  className="aspect-[16/9] h-auto w-full object-cover"
                />
              </div>
            )}
            {eyebrow && (
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--site-accent)]">
                {eyebrow}
              </p>
            )}
            <h1 className="text-3xl font-bold leading-[1.1] md:text-5xl">{title}</h1>
            {subtitle && (
              <p className="mt-4 text-base leading-relaxed opacity-70">{subtitle}</p>
            )}
            <a
              href={ctaHref}
              className={`mt-8 inline-flex bg-[var(--site-primary)] px-6 py-3.5 text-sm font-semibold transition hover:brightness-110 ${buttonStyleClassName}`}
              style={{ color: "var(--site-button-text)" }}
            >
              {ctaLabel}
            </a>
          </div>
        </section>
      );
    }

    /* ── HERO CENTERED-GRADIENT ── */
    if (variant === "centered-gradient") {
      return (
        <section
          id="hero"
          className="relative w-full overflow-hidden bg-[linear-gradient(135deg,var(--site-primary),var(--site-accent))] py-16 text-white md:py-28"
        >
          {/* Noise texture */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
              backgroundSize: "18px 18px",
            }}
          />
          {/* White orbs */}
          <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-white opacity-[0.10] blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-white opacity-[0.08] blur-3xl" />

          <div className="relative mx-auto max-w-4xl px-6 text-center">
            {imageUrl && (
              <div className="mx-auto mb-8 max-w-3xl overflow-hidden rounded-2xl border border-white/20">
                <Image
                  src={imageUrl}
                  alt={title}
                  width={1280}
                  height={720}
                  className="aspect-[16/9] h-auto w-full object-cover"
                />
              </div>
            )}
            {eyebrow && (
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
                {eyebrow}
              </p>
            )}
            <h1 className="text-4xl font-bold leading-[1.1] md:text-5xl lg:text-6xl">{title}</h1>
            {subtitle && (
              <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-white/80">
                {subtitle}
              </p>
            )}
            <a
              href={ctaHref}
              className={`mt-8 inline-flex bg-white px-6 py-3.5 text-sm font-semibold shadow-lg transition hover:bg-white/90 ${buttonStyleClassName}`}
              style={{ color: "var(--site-primary)" }}
            >
              {ctaLabel}
            </a>
          </div>
        </section>
      );
    }

    /* ── HERO DEFAULT ── */
    return (
      <section
        id="hero"
        className="relative w-full overflow-hidden py-16 md:py-24"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 70% 0%, color-mix(in srgb, var(--site-primary) 10%, transparent), transparent)",
        }}
      >
        {/* Orbs */}
        <div
          className="pointer-events-none absolute -right-32 -top-32 h-[420px] w-[420px] rounded-full opacity-[0.14] blur-[110px]"
          style={{ background: "var(--site-primary)" }}
        />
        <div
          className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full opacity-[0.10] blur-[80px]"
          style={{ background: "var(--site-accent)" }}
        />
        <div className="relative mx-auto max-w-7xl px-6">
          {imageUrl && (
            <div
              className="mb-8 overflow-hidden"
              style={{
                borderRadius: cardRadius,
                border: "1px solid var(--site-border)",
                boxShadow: "0 8px 32px color-mix(in srgb, var(--site-primary) 8%, transparent)",
              }}
            >
              <Image
                src={imageUrl}
                alt={title}
                width={1280}
                height={720}
                className="aspect-[16/9] h-auto w-full max-w-3xl object-cover"
              />
            </div>
          )}
          {eyebrow && (
            <>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--site-accent)]">
                {eyebrow}
              </p>
              <div
                className="mb-4 h-0.5 w-12"
                style={{
                  background: "linear-gradient(90deg, var(--site-accent), transparent)",
                }}
              />
            </>
          )}
          <h1 className="text-4xl font-bold leading-[1.1] md:text-5xl lg:text-6xl">{title}</h1>
          {subtitle && (
            <p className="mt-5 max-w-2xl text-lg leading-relaxed opacity-70">{subtitle}</p>
          )}
          <a
            href={ctaHref}
            className={`mt-8 inline-flex bg-[var(--site-primary)] px-6 py-3.5 text-sm font-semibold transition hover:brightness-110 ${buttonStyleClassName}`}
            style={{ color: "var(--site-button-text)" }}
          >
            {ctaLabel}
          </a>
        </div>
      </section>
    );
  }

  // ─── ABOUT ──────────────────────────────────────────────
  if (section.type === "about") {
    const title = asString(section.content.title, "Sobre");
    const body = asString(section.content.body);
    const aboutImageUrl = asString(section.content.imageUrl);

    return (
      <section
        id="about"
        className="relative w-full overflow-hidden py-16 md:py-20"
        style={{
          background:
            "radial-gradient(ellipse 55% 70% at 100% 50%, color-mix(in srgb, var(--site-accent) 7%, transparent), transparent)",
        }}
      >
        {/* Orb */}
        <div
          className="pointer-events-none absolute -right-20 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full opacity-[0.09] blur-[80px]"
          style={{ background: "var(--site-primary)" }}
        />
        <div className={`relative ${containerClass}`}>
          {aboutImageUrl ? (
            <div className="grid items-start gap-10 md:grid-cols-[340px_1fr]">
              <div
                className="overflow-hidden"
                style={{
                  borderRadius: cardRadius,
                  border: "1px solid color-mix(in srgb, var(--site-primary) 16%, var(--site-border))",
                  boxShadow:
                    "0 12px 40px color-mix(in srgb, var(--site-primary) 12%, transparent), 0 2px 8px rgba(0,0,0,0.1)",
                }}
              >
                <Image
                  src={aboutImageUrl}
                  alt={title}
                  width={360}
                  height={480}
                  className="aspect-[3/4] h-auto w-full object-cover"
                />
              </div>
              <div>
                <SectionEyebrow label="Sobre" />
                <h2 className="text-3xl font-bold">{title}</h2>
                {body && (
                  <p className="mt-5 whitespace-pre-line text-base leading-relaxed opacity-80">
                    {body}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <>
              <SectionEyebrow label="Sobre" />
              <h2 className="text-3xl font-bold">{title}</h2>
              {body && (
                <p className="mt-5 max-w-3xl whitespace-pre-line text-base leading-relaxed opacity-80">
                  {body}
                </p>
              )}
            </>
          )}
        </div>
      </section>
    );
  }

  // ─── SERVICES ───────────────────────────────────────────
  if (section.type === "services") {
    const title = asString(section.content.title, "Serviços");
    const cards = asCards(section.content.cards);
    const items = asStringArray(section.content.items);
    const imageUrl = asString(section.content.imageUrl);

    const effectiveCards: ServiceCard[] =
      cards.length > 0 ? cards : items.map((t) => ({ title: t, description: "", iconName: "" }));

    /* ── SERVICES MINIMAL-LIST ── */
    if (variant === "minimal" || variant === "minimal-list") {
      return (
        <section
          id="services"
          className="relative w-full overflow-hidden py-16 md:py-20"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 0% 100%, color-mix(in srgb, var(--site-primary) 5%, transparent), transparent)",
          }}
        >
          <div className={`relative ${containerClass}`}>
            <SectionEyebrow label="Serviços" />
            <h2 className="text-3xl font-bold">{title}</h2>
            {imageUrl && (
              <div
                className="mt-6 overflow-hidden"
                style={{ borderRadius: cardRadius, border: "1px solid var(--site-border)" }}
              >
                <Image
                  src={imageUrl}
                  alt={title}
                  width={1200}
                  height={600}
                  className="aspect-[2/1] h-auto w-full object-cover"
                />
              </div>
            )}
            <ul className="mt-6 divide-y divide-[var(--site-border)]">
              {effectiveCards.map((card, index) => {
                const Icon = getIcon(card.iconName || "");
                return (
                  <li
                    key={`${card.title}-${index}`}
                    className="group flex items-center gap-4 px-4 py-5 text-sm transition-all duration-200 hover:bg-[color-mix(in_srgb,var(--site-primary)_5%,transparent)]"
                    style={{
                      borderRadius: cardRadius,
                      borderLeft: "3px solid transparent",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.borderLeftColor = "var(--site-primary)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.borderLeftColor = "transparent";
                    }}
                  >
                    {Icon ? (
                      <div
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                        style={iconGradient}
                      >
                        <Icon size={18} className="text-[var(--site-primary)]" />
                      </div>
                    ) : (
                      <span
                        className="h-2 w-2 shrink-0 rounded-full"
                        style={{ background: "var(--site-accent)" }}
                      />
                    )}
                    <div className="flex-1">
                      <span className="text-base font-medium">{card.title}</span>
                      {card.description && (
                        <p className="mt-1 text-sm opacity-60">{card.description}</p>
                      )}
                    </div>
                    {card.imageUrl && (
                      <div
                        className="h-16 w-20 shrink-0 overflow-hidden"
                        style={{ borderRadius: cardRadius }}
                      >
                        <ServiceImageModal
                          src={card.imageUrl}
                          alt={card.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      );
    }

    /* ── SERVICES MASONRY ── */
    if (variant === "masonry") {
      return (
        <section
          id="services"
          className="relative w-full overflow-hidden py-16 md:py-20"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 100% 0%, color-mix(in srgb, var(--site-accent) 6%, transparent), transparent)",
          }}
        >
          {/* Orb */}
          <div
            className="pointer-events-none absolute -left-20 bottom-0 h-72 w-72 rounded-full opacity-[0.08] blur-[90px]"
            style={{ background: "var(--site-primary)" }}
          />
          <div className={`relative ${containerClass}`}>
            <SectionEyebrow label="Serviços" />
            <h2 className="text-3xl font-bold">{title}</h2>
            {imageUrl && (
              <div
                className="mt-6 overflow-hidden"
                style={{ borderRadius: cardRadius, border: "1px solid var(--site-border)" }}
              >
                <Image
                  src={imageUrl}
                  alt={title}
                  width={1200}
                  height={600}
                  className="aspect-[2/1] h-auto w-full object-cover"
                />
              </div>
            )}
            <div className="mt-6 columns-1 gap-5 space-y-5 sm:columns-2">
              {effectiveCards.map((card, index) => {
                const Icon = getIcon(card.iconName || "");
                const isTall = index % 3 === 0;
                return (
                  <div
                    key={`${card.title}-${index}`}
                    className="break-inside-avoid overflow-hidden transition-all duration-300 hover:-translate-y-1"
                    style={{
                      borderRadius: cardRadius,
                      ...glassCard,
                      boxShadow:
                        "0 4px 20px color-mix(in srgb, var(--site-primary) 8%, transparent)",
                    }}
                  >
                    {card.imageUrl && (
                      <ServiceImageModal
                        src={card.imageUrl}
                        alt={card.title}
                        className="w-full object-cover"
                        style={{ height: isTall ? "160px" : "120px" }}
                      />
                    )}
                    <div className={`px-5 ${isTall ? "py-8" : "py-5"}`}>
                      {Icon && (
                        <div
                          className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl"
                          style={iconGradient}
                        >
                          <Icon size={20} className="text-[var(--site-primary)]" />
                        </div>
                      )}
                      <h3 className="text-base font-semibold">{card.title}</h3>
                      {card.description && (
                        <p className="mt-2 text-sm leading-relaxed opacity-60">
                          {card.description}
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

    /* ── SERVICES COLUMNS ── */
    if (variant === "columns") {
      return (
        <section
          id="services"
          className="relative w-full overflow-hidden py-16 md:py-20"
          style={{
            background:
              "radial-gradient(ellipse 65% 55% at 50% 100%, color-mix(in srgb, var(--site-primary) 6%, transparent), transparent)",
          }}
        >
          <div className={`relative ${containerClass}`}>
            <div className="text-center">
              <SectionEyebrow label="Serviços" />
              <h2 className="text-3xl font-bold">{title}</h2>
            </div>
            {imageUrl && (
              <div
                className="mt-6 overflow-hidden"
                style={{ borderRadius: cardRadius, border: "1px solid var(--site-border)" }}
              >
                <Image
                  src={imageUrl}
                  alt={title}
                  width={1200}
                  height={600}
                  className="aspect-[2/1] h-auto w-full object-cover"
                />
              </div>
            )}
            <div className="mt-8 space-y-5">
              {effectiveCards.map((card, index) => {
                const Icon = getIcon(card.iconName || "");
                const isReversed = index % 2 === 1;
                return (
                  <div
                    key={`${card.title}-${index}`}
                    className={`flex items-center gap-6 overflow-hidden p-6 transition-all duration-300 hover:-translate-y-0.5 ${
                      isReversed ? "flex-row-reverse" : ""
                    }`}
                    style={{ borderRadius: cardRadius, ...glassCard }}
                  >
                    {Icon && (
                      <div
                        className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl"
                        style={iconGradient}
                      >
                        <Icon size={28} className="text-[var(--site-primary)]" />
                      </div>
                    )}
                    <div className={`flex-1 ${isReversed ? "text-right" : ""}`}>
                      <h3 className="text-base font-semibold">{card.title}</h3>
                      {card.description && (
                        <p className="mt-1 text-sm leading-relaxed opacity-60">
                          {card.description}
                        </p>
                      )}
                    </div>
                    {card.imageUrl && (
                      <div
                        className="h-20 w-24 shrink-0 overflow-hidden"
                        style={{ borderRadius: cardRadius }}
                      >
                        <ServiceImageModal
                          src={card.imageUrl}
                          alt={card.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      );
    }

    /* ── SERVICES STEPS ── */
    if (variant === "steps") {
      return (
        <section
          id="services"
          className="relative w-full overflow-hidden py-16 md:py-20"
          style={{
            background:
              "radial-gradient(ellipse 50% 80% at 0% 50%, color-mix(in srgb, var(--site-primary) 6%, transparent), transparent)",
          }}
        >
          {/* Orb */}
          <div
            className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full opacity-[0.08] blur-[90px]"
            style={{ background: "var(--site-accent)" }}
          />
          <div className={`relative ${containerClass}`}>
            <SectionEyebrow label="Como funciona" />
            <h2 className="text-3xl font-bold">{title}</h2>
            {imageUrl && (
              <div
                className="mt-6 overflow-hidden"
                style={{ borderRadius: cardRadius, border: "1px solid var(--site-border)" }}
              >
                <Image
                  src={imageUrl}
                  alt={title}
                  width={1200}
                  height={600}
                  className="aspect-[2/1] h-auto w-full object-cover"
                />
              </div>
            )}
            <ol className="relative ml-1 mt-8">
              {/* Gradient timeline line */}
              <div
                className="absolute bottom-5 left-[15px] top-5 w-0.5"
                style={{
                  background:
                    "linear-gradient(to bottom, var(--site-primary), var(--site-accent), color-mix(in srgb, var(--site-accent) 20%, transparent))",
                }}
              />
              {effectiveCards.map((card, index) => {
                const Icon = getIcon(card.iconName || "");
                return (
                  <li
                    key={`${card.title}-${index}`}
                    className="relative flex items-center gap-4 pb-8 last:pb-0"
                  >
                    <span
                      className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold shadow-lg"
                      style={{
                        background:
                          "linear-gradient(135deg, var(--site-primary), var(--site-accent))",
                        color: "var(--site-button-text)",
                        boxShadow:
                          "0 0 0 3px color-mix(in srgb, var(--site-primary) 20%, transparent)",
                      }}
                    >
                      {index + 1}
                    </span>
                    <div className="flex-1 pt-1">
                      <div className="flex items-center gap-2">
                        {Icon && (
                          <Icon size={16} className="text-[var(--site-primary)]" />
                        )}
                        <span className="text-base font-semibold">{card.title}</span>
                      </div>
                      {card.description && (
                        <p className="mt-1 text-sm leading-relaxed opacity-60">
                          {card.description}
                        </p>
                      )}
                    </div>
                    {card.imageUrl && (
                      <div
                        className="h-20 w-24 shrink-0 overflow-hidden"
                        style={{ borderRadius: cardRadius }}
                      >
                        <ServiceImageModal
                          src={card.imageUrl}
                          alt={card.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                  </li>
                );
              })}
            </ol>
          </div>
        </section>
      );
    }

    /* ── SERVICES DEFAULT (com imagens) ── */
    const hasAnyImage = effectiveCards.some((c) => c.imageUrl);

    if (hasAnyImage) {
      return (
        <section
          id="services"
          className="relative w-full overflow-hidden py-16 md:py-20"
          style={{
            background:
              "radial-gradient(ellipse 60% 60% at 100% 50%, color-mix(in srgb, var(--site-primary) 5%, transparent), transparent)",
          }}
        >
          <div className={`relative ${containerClass}`}>
            <SectionEyebrow label="Serviços" />
            <h2 className="text-3xl font-bold">{title}</h2>
            {imageUrl && (
              <div
                className="mt-6 overflow-hidden"
                style={{ borderRadius: cardRadius, border: "1px solid var(--site-border)" }}
              >
                <Image
                  src={imageUrl}
                  alt={title}
                  width={1200}
                  height={600}
                  className="aspect-[2/1] h-auto w-full object-cover"
                />
              </div>
            )}
            <div className="mt-8 space-y-6">
              {effectiveCards.map((card, index) => {
                const Icon = getIcon(card.iconName || "");
                const isReversed = index % 2 === 1;
                return (
                  <div
                    key={`${card.title}-${index}`}
                    className={`flex items-center gap-8 overflow-hidden transition-all duration-300 hover:-translate-y-0.5 ${
                      isReversed ? "flex-row-reverse" : ""
                    }`}
                    style={{ borderRadius: cardRadius, ...glassCard }}
                  >
                    <div className="flex-1 p-6 md:p-8">
                      {Icon && (
                        <div
                          className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl"
                          style={iconGradient}
                        >
                          <Icon size={22} className="text-[var(--site-primary)]" />
                        </div>
                      )}
                      <h3 className="text-xl font-semibold">{card.title}</h3>
                      {card.description && (
                        <p className="mt-3 text-base leading-relaxed opacity-60">
                          {card.description}
                        </p>
                      )}
                    </div>
                    {card.imageUrl ? (
                      <div
                        className="h-48 w-48 shrink-0 overflow-hidden md:h-56 md:w-64"
                        style={{
                          borderRadius: isReversed
                            ? `${cardRadius} 0 0 ${cardRadius}`
                            : `0 ${cardRadius} ${cardRadius} 0`,
                        }}
                      >
                        <ServiceImageModal
                          src={card.imageUrl}
                          alt={card.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div
                        className="hidden h-48 w-48 shrink-0 items-center justify-center md:flex md:h-56 md:w-64"
                        style={{
                          backgroundColor:
                            "color-mix(in srgb, var(--site-primary) 5%, transparent)",
                          borderRadius: isReversed
                            ? `${cardRadius} 0 0 ${cardRadius}`
                            : `0 ${cardRadius} ${cardRadius} 0`,
                        }}
                      >
                        <span className="text-sm opacity-30">Imagem</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      );
    }

    /* ── SERVICES DEFAULT (grid sem imagens) ── */
    return (
      <section
        id="services"
        className="relative w-full overflow-hidden py-16 md:py-20"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 0% 100%, color-mix(in srgb, var(--site-primary) 7%, transparent), transparent)",
        }}
      >
        {/* Orb */}
        <div
          className="pointer-events-none absolute -right-16 top-0 h-72 w-72 rounded-full opacity-[0.08] blur-[90px]"
          style={{ background: "var(--site-accent)" }}
        />
        <div className={`relative ${containerClass}`}>
          <SectionEyebrow label="Serviços" />
          <h2 className="text-3xl font-bold">{title}</h2>
          {imageUrl && (
            <div
              className="mt-6 overflow-hidden"
              style={{ borderRadius: cardRadius, border: "1px solid var(--site-border)" }}
            >
              <Image
                src={imageUrl}
                alt={title}
                width={1200}
                height={600}
                className="aspect-[2/1] h-auto w-full object-cover"
              />
            </div>
          )}
          <StaggeredCards className="mt-6 grid gap-5 sm:grid-cols-2">
            {effectiveCards.map((card, index) => {
              const Icon = getIcon(card.iconName || "");
              return (
                <div
                  key={`${card.title}-${index}`}
                  className="overflow-hidden p-6 text-center transition-all duration-300 hover:-translate-y-1"
                  style={{
                    borderRadius: cardRadius,
                    ...glassCard,
                    boxShadow:
                      "0 4px 20px color-mix(in srgb, var(--site-primary) 8%, transparent), inset 0 1px 0 color-mix(in srgb, white 6%, transparent)",
                  }}
                >
                  {Icon && (
                    <div
                      className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl"
                      style={iconGradient}
                    >
                      <Icon size={22} className="text-[var(--site-primary)]" />
                    </div>
                  )}
                  <h3 className="text-base font-semibold">{card.title}</h3>
                  {card.description && (
                    <p className="mt-2 text-sm leading-relaxed opacity-60">{card.description}</p>
                  )}
                </div>
              );
            })}
          </StaggeredCards>
        </div>
      </section>
    );
  }

  // ─── CTA ────────────────────────────────────────────────
  if (section.type === "cta") {
    const title = asString(section.content.title, "Vamos conversar?");
    const description = asString(section.content.description);
    const buttonLabel = asString(section.content.buttonLabel, "Entrar em contato");
    const buttonHref = asString(section.content.buttonHref, "#contact");
    const secondaryLabel = asString(section.content.secondaryLabel);
    const secondaryHref = asString(section.content.secondaryHref);
    const linkTarget = (href: string) => (href.startsWith("http") ? "_blank" : undefined);
    const linkRel = (href: string) => (href.startsWith("http") ? "noreferrer" : undefined);

    /* ── CTA BANNER ── */
    if (variant === "banner") {
      return (
        <section
          id="cta"
          className="relative w-full overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, color-mix(in srgb, var(--site-primary) 12%, var(--site-background)), color-mix(in srgb, var(--site-accent) 8%, var(--site-background)))",
          }}
        >
          {/* Orb */}
          <div
            className="pointer-events-none absolute -right-16 top-1/2 h-56 w-56 -translate-y-1/2 rounded-full opacity-[0.16] blur-3xl"
            style={{ background: "var(--site-accent)" }}
          />
          <div className="relative mx-auto flex max-w-7xl flex-col gap-4 px-6 py-12 md:flex-row md:items-center md:justify-between md:py-16">
            <div className="flex-1">
              <h2 className="text-2xl font-bold md:text-3xl">{title}</h2>
              {description && (
                <p className="mt-3 max-w-xl text-base opacity-70">{description}</p>
              )}
            </div>
            <a
              href={buttonHref}
              target={linkTarget(buttonHref)}
              rel={linkRel(buttonHref)}
              className={`inline-flex shrink-0 bg-[var(--site-primary)] px-6 py-3.5 text-sm font-semibold shadow-lg transition hover:brightness-110 ${buttonStyleClassName}`}
              style={{ color: "var(--site-button-text)" }}
            >
              {buttonLabel}
            </a>
          </div>
        </section>
      );
    }

    /* ── CTA CENTERED ── */
    if (variant === "centered") {
      return (
        <section
          id="cta"
          className="relative w-full overflow-hidden py-12 md:py-16"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 50%, color-mix(in srgb, var(--site-primary) 8%, var(--site-background)), var(--site-background))",
          }}
        >
          {/* Orbs */}
          <div
            className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full opacity-[0.10] blur-3xl"
            style={{ background: "var(--site-primary)" }}
          />
          <div
            className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full opacity-[0.10] blur-3xl"
            style={{ background: "var(--site-accent)" }}
          />
          <div className="relative mx-auto max-w-3xl px-6 text-center">
            <div
              className="overflow-hidden p-8 md:p-12"
              style={{
                borderRadius: "var(--site-radius, 24px)",
                ...glassCard,
              }}
            >
              <h2 className="text-2xl font-bold md:text-3xl">{title}</h2>
              {description && (
                <p className="mx-auto mt-3 max-w-xl text-base opacity-70">{description}</p>
              )}
              <a
                href={buttonHref}
                target={linkTarget(buttonHref)}
                rel={linkRel(buttonHref)}
                className={`mt-6 inline-flex bg-[var(--site-primary)] px-6 py-3.5 text-sm font-semibold shadow-lg transition hover:brightness-110 ${buttonStyleClassName}`}
                style={{ color: "var(--site-button-text)" }}
              >
                {buttonLabel}
              </a>
            </div>
          </div>
        </section>
      );
    }

    /* ── CTA BANNER-GRADIENT ── */
    if (variant === "banner-gradient") {
      return (
        <section
          id="cta"
          className="relative w-full overflow-hidden bg-[linear-gradient(135deg,var(--site-primary),var(--site-accent))] text-white"
        >
          {/* Texture */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
              backgroundSize: "16px 16px",
            }}
          />
          {/* White orbs */}
          <div className="pointer-events-none absolute -right-20 top-1/2 h-48 w-48 -translate-y-1/2 rounded-full bg-white opacity-[0.12] blur-3xl" />
          <div className="pointer-events-none absolute -left-20 bottom-0 h-40 w-40 rounded-full bg-white opacity-[0.08] blur-3xl" />

          <div className="relative mx-auto flex max-w-7xl flex-col gap-4 px-6 py-12 md:flex-row md:items-center md:justify-between md:py-16">
            <div className="flex-1">
              <h2 className="text-2xl font-bold md:text-3xl">{title}</h2>
              {description && (
                <p className="mt-3 max-w-xl text-base text-white/80">{description}</p>
              )}
            </div>
            <a
              href={buttonHref}
              target={linkTarget(buttonHref)}
              rel={linkRel(buttonHref)}
              className={`inline-flex shrink-0 bg-white px-6 py-3.5 text-sm font-semibold shadow-lg transition hover:bg-white/90 ${buttonStyleClassName}`}
              style={{ color: "var(--site-primary)" }}
            >
              {buttonLabel}
            </a>
          </div>
        </section>
      );
    }

    /* ── CTA CENTERED-GRADIENT ── */
    if (variant === "centered-gradient") {
      return (
        <section
          id="cta"
          className="relative w-full overflow-hidden bg-[linear-gradient(135deg,var(--site-primary),var(--site-accent))] text-white"
        >
          {/* Texture */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />
          {/* White orbs */}
          <div className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full bg-white opacity-[0.12] blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-white opacity-[0.10] blur-3xl" />

          <div className="relative mx-auto max-w-3xl px-6 py-12 text-center md:py-16">
            <h2 className="text-2xl font-bold md:text-3xl">{title}</h2>
            {description && (
              <p className="mx-auto mt-3 max-w-xl text-base text-white/80">{description}</p>
            )}
            <a
              href={buttonHref}
              target={linkTarget(buttonHref)}
              rel={linkRel(buttonHref)}
              className={`mt-6 inline-flex bg-white px-6 py-3.5 text-sm font-semibold shadow-lg transition hover:bg-white/90 ${buttonStyleClassName}`}
              style={{ color: "var(--site-primary)" }}
            >
              {buttonLabel}
            </a>
          </div>
        </section>
      );
    }

    /* ── CTA DOUBLE ── */
    if (variant === "double") {
      return (
        <section
          id="cta"
          className="relative w-full overflow-hidden py-12 md:py-16"
          style={{
            background:
              "radial-gradient(ellipse 70% 70% at 50% 50%, color-mix(in srgb, var(--site-primary) 7%, var(--site-background)), var(--site-background))",
          }}
        >
          {/* Orbs */}
          <div
            className="pointer-events-none absolute -left-16 top-0 h-64 w-64 rounded-full opacity-[0.10] blur-3xl"
            style={{ background: "var(--site-primary)" }}
          />
          <div
            className="pointer-events-none absolute -right-16 bottom-0 h-56 w-56 rounded-full opacity-[0.10] blur-3xl"
            style={{ background: "var(--site-accent)" }}
          />
          <div className="relative mx-auto max-w-3xl px-6 text-center">
            <h2 className="text-2xl font-bold md:text-3xl">{title}</h2>
            {description && (
              <p className="mx-auto mt-3 max-w-xl text-base opacity-70">{description}</p>
            )}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
              <a
                href={buttonHref}
                target={linkTarget(buttonHref)}
                rel={linkRel(buttonHref)}
                className={`inline-flex bg-[var(--site-primary)] px-6 py-3.5 text-sm font-semibold shadow-lg transition hover:brightness-110 ${buttonStyleClassName}`}
                style={{ color: "var(--site-button-text)" }}
              >
                {buttonLabel}
              </a>
              {secondaryLabel && secondaryHref && (
                <a
                  href={secondaryHref}
                  target={linkTarget(secondaryHref)}
                  rel={linkRel(secondaryHref)}
                  className={`inline-flex border-2 border-[var(--site-primary)] px-6 py-3 text-sm font-semibold transition hover:bg-[var(--site-primary)]/10 ${buttonStyleClassName}`}
                  style={{ color: "var(--site-primary)" }}
                >
                  {secondaryLabel}
                </a>
              )}
            </div>
          </div>
        </section>
      );
    }

    /* ── CTA DEFAULT ── */
    return (
      <section
        id="cta"
        className="relative w-full overflow-hidden py-12 md:py-16"
        style={{
          background:
            "radial-gradient(ellipse 60% 80% at 50% 100%, color-mix(in srgb, var(--site-primary) 6%, var(--site-background)), var(--site-background))",
          borderTop: "1px solid var(--site-border)",
          borderBottom: "1px solid var(--site-border)",
        }}
      >
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-2xl font-bold md:text-3xl">{title}</h2>
          {description && (
            <p className="mx-auto mt-3 max-w-xl text-base opacity-70">{description}</p>
          )}
          <a
            href={buttonHref}
            target={linkTarget(buttonHref)}
            rel={linkRel(buttonHref)}
            className={`mt-6 inline-flex border-2 border-[var(--site-primary)] px-6 py-3 text-sm font-semibold transition hover:bg-[var(--site-primary)] hover:shadow-lg ${buttonStyleClassName}`}
            style={{ color: "var(--site-primary)" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color = "var(--site-button-text)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color = "var(--site-primary)";
            }}
          >
            {buttonLabel}
          </a>
        </div>
      </section>
    );
  }

  // ─── TESTIMONIALS ───────────────────────────────────────
  if (section.type === "testimonials") {
    const title = asString(section.content.title, "Depoimentos");
    const testimonials = asTestimonials(section.content.items);

    /* ── CAROUSEL ── */
    if (variant === "carousel") {
      return (
        <TestimonialsCarousel title={title} testimonials={testimonials} cardRadius={cardRadius} />
      );
    }

    /* ── SPLIT / QUOTES ── */
    if (variant === "split" || variant === "quotes") {
      return (
        <section
          id="testimonials"
          className="relative w-full overflow-hidden py-16 md:py-20"
          style={{
            background:
              "radial-gradient(ellipse 50% 60% at 0% 50%, color-mix(in srgb, var(--site-accent) 5%, transparent), transparent)",
          }}
        >
          {/* Orb */}
          <div
            className="pointer-events-none absolute -right-16 top-0 h-64 w-64 rounded-full opacity-[0.07] blur-[80px]"
            style={{ background: "var(--site-primary)" }}
          />
          <div className={`relative ${containerClass}`}>
            <SectionEyebrow label="Depoimentos" />
            <h2 className="text-3xl font-bold">{title}</h2>
            <div className="mt-6 divide-y divide-[var(--site-border)]">
              {testimonials.map((testimonial, i) => (
                <div
                  key={`${testimonial.author}-${i}`}
                  className="grid gap-4 py-8 md:grid-cols-[200px_1fr]"
                >
                  <div className="flex flex-col justify-start">
                    <p
                      className="font-semibold"
                      style={{ color: "var(--site-accent)" }}
                    >
                      {testimonial.author}
                    </p>
                    <div
                      className="mt-2 h-[2px] w-8 rounded-full"
                      style={{
                        background: "linear-gradient(90deg, var(--site-accent), transparent)",
                      }}
                    />
                  </div>
                  <div>
                    <p
                      className="mb-2 font-serif text-4xl leading-none"
                      style={{ color: "var(--site-accent)" }}
                    >
                      &ldquo;
                    </p>
                    <p className="text-base leading-relaxed opacity-80 md:text-lg">
                      {testimonial.quote}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    }

    /* ── TESTIMONIALS GRID (default) ── */
    return (
      <section
        id="testimonials"
        className="relative w-full overflow-hidden py-16 md:py-20"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 100% 0%, color-mix(in srgb, var(--site-accent) 6%, transparent), radial-gradient(ellipse 60% 50% at 0% 100%, color-mix(in srgb, var(--site-primary) 5%, transparent), transparent))",
        }}
      >
        {/* Orb */}
        <div
          className="pointer-events-none absolute -left-20 bottom-0 h-72 w-72 rounded-full opacity-[0.08] blur-[90px]"
          style={{ background: "var(--site-primary)" }}
        />
        <div className={`relative ${containerClass}`}>
          <SectionEyebrow label="Depoimentos" />
          <h2 className="text-3xl font-bold">{title}</h2>
          <StaggeredCards className="mt-6 grid gap-5 sm:grid-cols-2">
            {testimonials.map((testimonial, i) => (
              <article
                key={`${testimonial.author}-${i}`}
                className="relative overflow-hidden p-6 transition-all duration-300 hover:-translate-y-1"
                style={{ borderRadius: cardRadius, ...glassCard }}
              >
                {/* Decorative quote */}
                <p
                  className="absolute right-4 top-2 font-serif text-6xl leading-none opacity-[0.08] select-none"
                  style={{ color: "var(--site-accent)" }}
                  aria-hidden="true"
                >
                  &rdquo;
                </p>
                <p className="relative text-base leading-relaxed opacity-80">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <div
                    className="h-[2px] w-6 rounded-full"
                    style={{
                      background: "linear-gradient(90deg, var(--site-primary), var(--site-accent))",
                    }}
                  />
                  <p
                    className="text-sm font-semibold uppercase tracking-wide"
                    style={{ color: "var(--site-accent)" }}
                  >
                    {testimonial.author}
                  </p>
                </div>
              </article>
            ))}
          </StaggeredCards>
        </div>
      </section>
    );
  }

  // ─── CONTACT ────────────────────────────────────────────
  if (section.type === "contact") {
    const title = asString(section.content.title, "Contato");
    const subtitle = asString(section.content.subtitle);
    const socialLinks = asSocialLinks(section.content.socialLinks);
    const legacyLinks: SocialLink[] = [];
    if (socialLinks.length === 0) {
      const whatsappUrl = asString(section.content.whatsappUrl);
      const whatsappLabel = asString(section.content.whatsappLabel, "Falar no WhatsApp");
      const secondaryUrl = asString(section.content.secondaryUrl);
      const secondaryLabel = asString(section.content.secondaryLabel);
      if (whatsappUrl)
        legacyLinks.push({
          type: "whatsapp",
          url: whatsappUrl,
          label: whatsappLabel,
          icon: "MessageCircle",
        });
      if (secondaryUrl && secondaryLabel)
        legacyLinks.push({
          type: "email",
          url: secondaryUrl,
          label: secondaryLabel,
          icon: "Mail",
        });
    }
    const allLinks = socialLinks.length > 0 ? socialLinks : legacyLinks;

    return (
      <section
        id="contact"
        className="relative w-full overflow-hidden py-16 md:py-20"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 100%, color-mix(in srgb, var(--site-primary) 10%, transparent), transparent)",
        }}
      >
        {/* Orbs */}
        <div
          className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full opacity-[0.08] blur-3xl"
          style={{ background: "var(--site-primary)" }}
        />
        <div
          className="pointer-events-none absolute -bottom-16 -right-16 h-64 w-64 rounded-full opacity-[0.08] blur-3xl"
          style={{ background: "var(--site-accent)" }}
        />
        <div className={`relative ${containerClass} text-center`}>
          <SectionEyebrow label="Contato" />
          <h2 className="text-3xl font-bold">{title}</h2>
          {subtitle && <p className="mt-3 text-base opacity-70">{subtitle}</p>}
          {allLinks.length > 0 && (
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
              {allLinks.map((link) => {
                const Icon = getIcon(link.icon);
                return (
                  <a
                    key={link.url}
                    href={link.url}
                    target={link.url.startsWith("#") ? undefined : "_blank"}
                    rel={link.url.startsWith("#") ? undefined : "noreferrer"}
                    className="group flex flex-col items-center gap-3 transition-transform duration-200 hover:-translate-y-1"
                  >
                    <span
                      className="flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-200 group-hover:brightness-110 group-hover:shadow-[0_8px_24px_color-mix(in_srgb,var(--site-primary)_25%,transparent)]"
                      style={{
                        ...glassCard,
                        borderRadius: "16px",
                      }}
                    >
                      {Icon && <Icon size={26} className="text-[var(--site-primary)]" />}
                    </span>
                    <span className="text-sm font-medium opacity-70">{link.label}</span>
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </section>
    );
  }

  return null;
}
