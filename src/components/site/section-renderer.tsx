import Image from "next/image";
import * as LucideIcons from "lucide-react";

import type { Site } from "@/lib/tenant/types";
import type { Section } from "@/lib/tenant/types";

type SectionRendererProps = {
  section: Section;
  site: Site;
  buttonStyleClassName: string;
};

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

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
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const quote = asString((item as Record<string, unknown>).quote);
      const author = asString((item as Record<string, unknown>).author);

      if (!quote || !author) {
        return null;
      }

      return { quote, author };
    })
    .filter((item): item is Testimonial => item !== null);
}

export function SectionRenderer({
  section,
  site,
  buttonStyleClassName,
}: SectionRendererProps) {
  const variant = section.variant ?? "default";
  const surfaceClassName = "border border-[var(--site-border)] bg-[var(--site-surface)]";

  // ─── HERO ───────────────────────────────────────────────
  if (section.type === "hero") {
    const eyebrow = asString(section.content.eyebrow);
    const title = asString(section.content.title, site.name);
    const subtitle = asString(section.content.subtitle);
    const ctaLabel = asString(section.content.ctaLabel, "Entrar em contato");
    const ctaHref = asString(section.content.ctaHref, "#contact");
    const imageUrl = asString(section.content.imageUrl);

    if (variant === "split") {
      return (
        <section id="hero" className={`grid gap-5 rounded-3xl p-8 shadow-sm md:grid-cols-2 md:items-center ${surfaceClassName}`}>
          <div>
            {eyebrow && (
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--site-accent)]">
                {eyebrow}
              </p>
            )}
            <h1 className="text-3xl font-bold leading-tight md:text-5xl">{title}</h1>
            {subtitle && <p className="mt-4 text-base opacity-80">{subtitle}</p>}
            <a
              href={ctaHref}
              style={{ color: "#fff" }}
              className={`mt-6 inline-flex bg-[var(--site-primary)] px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110 ${buttonStyleClassName}`}
            >
              {ctaLabel}
            </a>
          </div>
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={title}
              width={1280}
              height={720}
              className="aspect-[16/9] h-auto w-full rounded-2xl border border-[var(--site-border)] object-cover"
            />
          ) : (
            <div
              className="flex aspect-[16/9] items-center justify-center rounded-2xl border border-dashed"
              style={{ borderColor: "var(--site-primary)", opacity: 0.25, backgroundColor: "color-mix(in srgb, var(--site-primary) 8%, transparent)" }}
            >
              <span className="text-xs opacity-60">Imagem</span>
            </div>
          )}
        </section>
      );
    }

    if (variant === "centered") {
      return (
        <section id="hero" className={`rounded-3xl p-8 text-center shadow-sm ${surfaceClassName}`}>
          {eyebrow && (
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--site-accent)]">
              {eyebrow}
            </p>
          )}
          <h1 className="mx-auto max-w-3xl text-3xl font-bold leading-tight md:text-5xl">{title}</h1>
          {subtitle && <p className="mx-auto mt-4 max-w-2xl text-base opacity-80">{subtitle}</p>}
          {imageUrl && (
            <Image
              src={imageUrl}
              alt={title}
              width={1280}
              height={720}
              className="mx-auto mt-5 aspect-[16/9] h-auto w-full max-w-3xl rounded-2xl border border-[var(--site-border)] object-cover"
            />
          )}
          <a
            href={ctaHref}
            style={{ color: "#fff" }}
            className={`mt-6 inline-flex bg-[var(--site-primary)] px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110 ${buttonStyleClassName}`}
          >
            {ctaLabel}
          </a>
        </section>
      );
    }

    if (variant === "minimal") {
      return (
        <section id="hero" className="rounded-3xl p-8">
          {eyebrow && (
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--site-accent)]">
              {eyebrow}
            </p>
          )}
          <h1 className="max-w-3xl text-3xl font-bold leading-tight md:text-5xl">{title}</h1>
          {subtitle && <p className="mt-4 max-w-2xl text-base opacity-70">{subtitle}</p>}
          {imageUrl && (
            <Image
              src={imageUrl}
              alt={title}
              width={1280}
              height={720}
              className="mt-5 aspect-[16/9] h-auto w-full max-w-3xl rounded-2xl border border-[var(--site-border)] object-cover"
            />
          )}
          <a
            href={ctaHref}
            className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-[var(--site-primary)] underline underline-offset-4 decoration-[var(--site-primary)]/40 transition hover:decoration-[var(--site-primary)]"
          >
            {ctaLabel} <span aria-hidden="true">&rarr;</span>
          </a>
        </section>
      );
    }

    if (variant === "card") {
      return (
        <section
          id="hero"
          className="mx-auto max-w-2xl rounded-3xl p-8 text-center"
          style={{
            backgroundColor: "color-mix(in srgb, var(--site-primary) 5%, var(--site-background))",
            border: "1px solid color-mix(in srgb, var(--site-primary) 15%, transparent)",
            boxShadow: "0 4px 24px color-mix(in srgb, var(--site-primary) 10%, transparent)",
          }}
        >
          {eyebrow && (
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--site-accent)]">
              {eyebrow}
            </p>
          )}
          {imageUrl && (
            <Image
              src={imageUrl}
              alt={title}
              width={1280}
              height={720}
              className="mx-auto mb-5 aspect-[16/9] h-auto w-full rounded-2xl border border-[var(--site-border)] object-cover"
            />
          )}
          <h1 className="text-3xl font-bold leading-tight md:text-4xl">{title}</h1>
          {subtitle && <p className="mt-4 text-base opacity-80">{subtitle}</p>}
          <a
            href={ctaHref}
            style={{ color: "#fff" }}
            className={`mt-6 inline-flex bg-[var(--site-primary)] px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110 ${buttonStyleClassName}`}
          >
            {ctaLabel}
          </a>
        </section>
      );
    }

    if (variant === "centered-gradient") {
      return (
        <section id="hero" className="rounded-3xl bg-[linear-gradient(135deg,var(--site-primary),var(--site-accent))] p-8 text-center text-white shadow-sm">
          {eyebrow && (
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
              {eyebrow}
            </p>
          )}
          <h1 className="mx-auto max-w-3xl text-3xl font-bold leading-tight md:text-5xl">{title}</h1>
          {subtitle && <p className="mx-auto mt-4 max-w-2xl text-base text-white/85">{subtitle}</p>}
          {imageUrl && (
            <Image
              src={imageUrl}
              alt={title}
              width={1280}
              height={720}
              className="mx-auto mt-5 aspect-[16/9] h-auto w-full max-w-3xl rounded-2xl border border-white/20 object-cover"
            />
          )}
          <a
            href={ctaHref}
            className={`mt-6 inline-flex bg-white px-5 py-3 text-sm font-semibold transition hover:bg-white/90 ${buttonStyleClassName}`}
            style={{ color: "var(--site-primary)" }}
          >
            {ctaLabel}
          </a>
        </section>
      );
    }

    // default hero
    return (
      <section id="hero" className={`rounded-3xl p-8 shadow-sm ${surfaceClassName}`}>
        {eyebrow && (
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--site-accent)]">
            {eyebrow}
          </p>
        )}
        <h1 className="text-3xl font-bold leading-tight md:text-5xl">{title}</h1>
        {subtitle && <p className="mt-4 max-w-2xl text-base opacity-80">{subtitle}</p>}
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={title}
            width={1280}
            height={720}
            className="mt-5 aspect-[16/9] h-auto w-full max-w-3xl rounded-2xl border border-[var(--site-border)] object-cover"
          />
        )}
        <a
          href={ctaHref}
          style={{ color: "#fff" }}
          className={`mt-6 inline-flex bg-[var(--site-primary)] px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110 ${buttonStyleClassName}`}
        >
          {ctaLabel}
        </a>
      </section>
    );
  }

  // ─── ABOUT ──────────────────────────────────────────────
  if (section.type === "about") {
    const title = asString(section.content.title, "Sobre");
    const body = asString(section.content.body);

    return (
      <section id="about" className={`rounded-3xl p-6 ${surfaceClassName}`}>
        <h2 className="text-2xl font-semibold">{title}</h2>
        {body && <p className="mt-4 whitespace-pre-line leading-7 opacity-85">{body}</p>}
      </section>
    );
  }

  // ─── SERVICES ───────────────────────────────────────────
  if (section.type === "services") {
    const title = asString(section.content.title, "Serviços");
    const cards = asCards(section.content.cards);
    const items = asStringArray(section.content.items);
    const imageUrl = asString(section.content.imageUrl);

    // Render a single card (icon + title + description)
    function renderCard(card: ServiceCard, index: number, centered = true) {
      const Icon = getIcon(card.iconName || "");
      return (
        <div
          key={`${card.title}-${index}`}
          className={`rounded-2xl border border-[var(--site-border)] bg-[var(--site-surface)] overflow-hidden shadow-sm ${centered && !card.imageUrl ? "text-center" : ""}`}
        >
          {card.imageUrl && (
            <Image src={card.imageUrl} alt={card.title} width={400} height={300}
              className="aspect-[4/3] h-auto w-full object-cover" />
          )}
          <div className={`px-5 py-5 ${centered && !card.imageUrl ? "text-center" : ""}`}>
            {Icon && !card.imageUrl && (
              <div
                className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl ${centered ? "mx-auto" : ""}`}
                style={{ backgroundColor: "color-mix(in srgb, var(--site-primary) 12%, transparent)" }}
              >
                <Icon size={20} className="text-[var(--site-primary)]" />
              </div>
            )}
            <h3 className="text-sm font-semibold">{card.title}</h3>
            {card.description && (
              <p className="mt-1 text-xs opacity-70">{card.description}</p>
            )}
          </div>
        </div>
      );
    }

    // If we have rich cards, use them; otherwise fall back to items as simple cards
    const effectiveCards: ServiceCard[] = cards.length > 0
      ? cards
      : items.map((t) => ({ title: t, description: "", iconName: "" }));

    if (variant === "minimal" || variant === "minimal-list") {
      return (
        <section id="services" className={`rounded-3xl p-6 ${surfaceClassName}`}>
          <h2 className="text-2xl font-semibold">{title}</h2>
          {imageUrl && (
            <Image src={imageUrl} alt={title} width={960} height={720}
              className="mt-4 aspect-[4/3] h-auto w-full rounded-2xl border border-[var(--site-border)] object-cover" />
          )}
          <ul className="mt-4 space-y-3">
            {effectiveCards.map((card, index) => {
              const Icon = getIcon(card.iconName || "");
              return (
                <li key={`${card.title}-${index}`}
                  className="flex items-center gap-3 rounded-xl border border-[var(--site-border)] px-4 py-3 text-sm">
                  {Icon ? (
                    <Icon size={16} className="shrink-0 text-[var(--site-primary)]" />
                  ) : (
                    <span className="h-2 w-2 shrink-0 rounded-full bg-[var(--site-accent)]" />
                  )}
                  <span className="font-medium">{card.title}</span>
                </li>
              );
            })}
          </ul>
        </section>
      );
    }

    if (variant === "masonry") {
      return (
        <section id="services" className={`rounded-3xl p-6 ${surfaceClassName}`}>
          <h2 className="text-2xl font-semibold">{title}</h2>
          {imageUrl && (
            <Image src={imageUrl} alt={title} width={960} height={720}
              className="mt-4 aspect-[4/3] h-auto w-full rounded-2xl border border-[var(--site-border)] object-cover" />
          )}
          <div className="mt-4 columns-2 gap-3 space-y-3">
            {effectiveCards.map((card, index) => {
              const Icon = getIcon(card.iconName || "");
              return (
                <div key={`${card.title}-${index}`}
                  className={`break-inside-avoid rounded-2xl border border-[var(--site-border)] bg-[var(--site-surface)] px-4 text-sm shadow-sm ${
                    index % 3 === 0 ? "py-6" : index % 3 === 1 ? "py-4" : "py-5"
                  }`}>
                  {Icon && (
                    <div className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-lg"
                      style={{ backgroundColor: "color-mix(in srgb, var(--site-primary) 12%, transparent)" }}>
                      <Icon size={16} className="text-[var(--site-primary)]" />
                    </div>
                  )}
                  <h3 className="font-semibold">{card.title}</h3>
                  {card.description && <p className="mt-1 text-xs opacity-70">{card.description}</p>}
                </div>
              );
            })}
          </div>
        </section>
      );
    }

    if (variant === "columns") {
      return (
        <section id="services" className={`rounded-3xl p-6 ${surfaceClassName}`}>
          <h2 className="text-2xl font-semibold text-center">{title}</h2>
          {imageUrl && (
            <Image src={imageUrl} alt={title} width={960} height={720}
              className="mt-4 aspect-[4/3] h-auto w-full rounded-2xl border border-[var(--site-border)] object-cover" />
          )}
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {effectiveCards.map((card, index) => renderCard(card, index))}
          </div>
        </section>
      );
    }

    if (variant === "steps") {
      return (
        <section id="services" className={`rounded-3xl p-6 ${surfaceClassName}`}>
          <h2 className="text-2xl font-semibold">{title}</h2>
          {imageUrl && (
            <Image src={imageUrl} alt={title} width={960} height={720}
              className="mt-4 aspect-[4/3] h-auto w-full rounded-2xl border border-[var(--site-border)] object-cover" />
          )}
          <ol className="mt-4 space-y-3">
            {effectiveCards.map((card, index) => {
              const Icon = getIcon(card.iconName || "");
              return (
                <li key={`${card.title}-${index}`} className="flex items-start gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--site-primary)] text-xs font-bold text-white">
                    {index + 1}
                  </span>
                  <div className="pt-0.5">
                    <div className="flex items-center gap-2">
                      {Icon && <Icon size={14} className="text-[var(--site-primary)]" />}
                      <span className="text-sm font-medium">{card.title}</span>
                    </div>
                    {card.description && <p className="mt-0.5 text-xs opacity-70">{card.description}</p>}
                  </div>
                </li>
              );
            })}
          </ol>
        </section>
      );
    }

    // default services (grid)
    return (
      <section id="services" className={`rounded-3xl p-6 ${surfaceClassName}`}>
        <h2 className="text-2xl font-semibold">{title}</h2>
        {imageUrl && (
          <Image src={imageUrl} alt={title} width={960} height={720}
            className="mt-4 aspect-[4/3] h-auto w-full rounded-2xl border border-[var(--site-border)] object-cover" />
        )}
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {effectiveCards.map((card, index) => renderCard(card, index))}
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
    const imageUrl = asString(section.content.imageUrl);

    if (variant === "banner") {
      return (
        <section
          id="cta"
          className="rounded-3xl p-6"
          style={{
            backgroundColor: "color-mix(in srgb, var(--site-primary) 8%, var(--site-background))",
            border: "1px solid color-mix(in srgb, var(--site-primary) 15%, transparent)",
          }}
        >
          <h2 className="text-2xl font-semibold">{title}</h2>
          {description && <p className="mt-3 text-sm opacity-80">{description}</p>}
          {imageUrl && (
            <Image
              src={imageUrl}
              alt={title}
              width={1280}
              height={720}
              className="mt-4 aspect-[16/9] h-auto w-full rounded-2xl border border-[var(--site-border)] object-cover"
            />
          )}
          <a
            href={buttonHref}
            target={buttonHref.startsWith("http") ? "_blank" : undefined}
            rel={buttonHref.startsWith("http") ? "noreferrer" : undefined}
            className={`mt-5 inline-flex bg-[var(--site-primary)] px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 ${buttonStyleClassName}`}
            style={{ color: "#fff" }}
          >
            {buttonLabel}
          </a>
        </section>
      );
    }

    if (variant === "centered") {
      return (
        <section id="cta" className={`rounded-3xl p-6 text-center ${surfaceClassName}`}>
          <h2 className="text-2xl font-semibold">{title}</h2>
          {description && <p className="mx-auto mt-3 max-w-xl text-sm opacity-80">{description}</p>}
          {imageUrl && (
            <Image
              src={imageUrl}
              alt={title}
              width={1280}
              height={720}
              className="mx-auto mt-4 aspect-[16/9] h-auto w-full max-w-2xl rounded-2xl border border-[var(--site-border)] object-cover"
            />
          )}
          <a
            href={buttonHref}
            target={buttonHref.startsWith("http") ? "_blank" : undefined}
            rel={buttonHref.startsWith("http") ? "noreferrer" : undefined}
            className={`mt-5 inline-flex bg-[var(--site-primary)] px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-105 ${buttonStyleClassName}`}
            style={{ color: "#fff" }}
          >
            {buttonLabel}
          </a>
        </section>
      );
    }

    if (variant === "banner-gradient") {
      return (
        <section id="cta" className="rounded-3xl bg-[linear-gradient(135deg,var(--site-primary),var(--site-accent))] p-6 text-white">
          <h2 className="text-2xl font-semibold">{title}</h2>
          {description && <p className="mt-3 text-sm text-white/90">{description}</p>}
          {imageUrl && (
            <Image
              src={imageUrl}
              alt={title}
              width={1280}
              height={720}
              className="mt-4 aspect-[16/9] h-auto w-full rounded-2xl border border-white/25 object-cover"
            />
          )}
          <a
            href={buttonHref}
            target={buttonHref.startsWith("http") ? "_blank" : undefined}
            rel={buttonHref.startsWith("http") ? "noreferrer" : undefined}
            className={`mt-5 inline-flex bg-white px-5 py-2.5 text-sm font-semibold transition hover:bg-white/90 ${buttonStyleClassName}`}
            style={{ color: "var(--site-primary)" }}
          >
            {buttonLabel}
          </a>
        </section>
      );
    }

    if (variant === "centered-gradient") {
      return (
        <section id="cta" className="rounded-3xl bg-[linear-gradient(135deg,var(--site-primary),var(--site-accent))] p-6 text-center text-white">
          <h2 className="text-2xl font-semibold">{title}</h2>
          {description && <p className="mx-auto mt-3 max-w-xl text-sm text-white/85">{description}</p>}
          {imageUrl && (
            <Image
              src={imageUrl}
              alt={title}
              width={1280}
              height={720}
              className="mx-auto mt-4 aspect-[16/9] h-auto w-full max-w-2xl rounded-2xl border border-white/20 object-cover"
            />
          )}
          <a
            href={buttonHref}
            target={buttonHref.startsWith("http") ? "_blank" : undefined}
            rel={buttonHref.startsWith("http") ? "noreferrer" : undefined}
            className={`mt-5 inline-flex bg-white px-5 py-2.5 text-sm font-semibold transition hover:bg-white/90 ${buttonStyleClassName}`}
            style={{ color: "var(--site-primary)" }}
          >
            {buttonLabel}
          </a>
        </section>
      );
    }

    if (variant === "double") {
      return (
        <section id="cta" className={`rounded-3xl p-6 text-center ${surfaceClassName}`}>
          <h2 className="text-2xl font-semibold">{title}</h2>
          {description && <p className="mx-auto mt-3 max-w-xl text-sm opacity-80">{description}</p>}
          {imageUrl && (
            <Image
              src={imageUrl}
              alt={title}
              width={1280}
              height={720}
              className="mx-auto mt-4 aspect-[16/9] h-auto w-full max-w-2xl rounded-2xl border border-[var(--site-border)] object-cover"
            />
          )}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <a
              href={buttonHref}
              target={buttonHref.startsWith("http") ? "_blank" : undefined}
              rel={buttonHref.startsWith("http") ? "noreferrer" : undefined}
              className={`inline-flex bg-[var(--site-primary)] px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-105 ${buttonStyleClassName}`}
              style={{ color: "#fff" }}
            >
              {buttonLabel}
            </a>
            {secondaryLabel && secondaryHref && (
              <a
                href={secondaryHref}
                target={secondaryHref.startsWith("http") ? "_blank" : undefined}
                rel={secondaryHref.startsWith("http") ? "noreferrer" : undefined}
                className={`inline-flex border border-[var(--site-primary)] px-5 py-2.5 text-sm font-semibold transition hover:bg-[var(--site-primary)]/10 ${buttonStyleClassName}`}
                style={{ color: "var(--site-primary)" }}
              >
                {secondaryLabel}
              </a>
            )}
          </div>
        </section>
      );
    }

    // default cta
    return (
      <section
        id="cta"
        className="rounded-3xl p-6"
        style={{
          backgroundColor: "color-mix(in srgb, var(--site-primary) 8%, var(--site-background))",
          border: "1px solid color-mix(in srgb, var(--site-primary) 15%, transparent)",
        }}
      >
        <h2 className="text-2xl font-semibold">{title}</h2>
        {description && <p className="mt-3 text-sm opacity-80">{description}</p>}
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={title}
            width={1280}
            height={720}
            className="mt-4 aspect-[16/9] h-auto w-full rounded-2xl border border-[var(--site-border)] object-cover"
          />
        )}
        <a
          href={buttonHref}
          target={buttonHref.startsWith("http") ? "_blank" : undefined}
          rel={buttonHref.startsWith("http") ? "noreferrer" : undefined}
          className={`mt-5 inline-flex bg-[var(--site-primary)] px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-105 ${buttonStyleClassName}`}
          style={{ color: "#fff" }}
        >
          {buttonLabel}
        </a>
      </section>
    );
  }

  // ─── TESTIMONIALS ───────────────────────────────────────
  if (section.type === "testimonials") {
    const title = asString(section.content.title, "Depoimentos");
    const testimonials = asTestimonials(section.content.items);

    return (
      <section className={`rounded-3xl p-6 ${surfaceClassName}`}>
        <h2 className="text-2xl font-semibold">{title}</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {testimonials.map((testimonial) => (
            <article
              key={`${testimonial.author}-${testimonial.quote}`}
              className="rounded-2xl border border-[var(--site-border)] p-4"
            >
              <p className="text-sm leading-6 opacity-85">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-[var(--site-accent)]">
                {testimonial.author}
              </p>
            </article>
          ))}
        </div>
      </section>
    );
  }

  // ─── CONTACT ────────────────────────────────────────────
  if (section.type === "contact") {
    const title = asString(section.content.title, "Contato");
    const subtitle = asString(section.content.subtitle);

    // New: array of social links with icons
    const socialLinks = asSocialLinks(section.content.socialLinks);

    // Backward compat: build from legacy fields if socialLinks is empty
    const legacyLinks: SocialLink[] = [];
    if (socialLinks.length === 0) {
      const whatsappUrl = asString(section.content.whatsappUrl);
      const whatsappLabel = asString(section.content.whatsappLabel, "Falar no WhatsApp");
      const secondaryUrl = asString(section.content.secondaryUrl);
      const secondaryLabel = asString(section.content.secondaryLabel);
      if (whatsappUrl) legacyLinks.push({ type: "whatsapp", url: whatsappUrl, label: whatsappLabel, icon: "MessageCircle" });
      if (secondaryUrl && secondaryLabel) legacyLinks.push({ type: "email", url: secondaryUrl, label: secondaryLabel, icon: "Mail" });
    }

    const allLinks = socialLinks.length > 0 ? socialLinks : legacyLinks;

    return (
      <section
        id="contact"
        className={`rounded-3xl p-6 text-center ${surfaceClassName}`}
      >
        <h2 className="text-2xl font-semibold">{title}</h2>
        {subtitle && <p className="mt-3 text-sm opacity-80">{subtitle}</p>}
        {allLinks.length > 0 && (
          <div className="mt-6 flex flex-wrap items-center justify-center gap-5">
            {allLinks.map((link) => {
              const Icon = getIcon(link.icon);
              return (
                <a
                  key={link.url}
                  href={link.url}
                  target={link.url.startsWith("#") ? undefined : "_blank"}
                  rel={link.url.startsWith("#") ? undefined : "noreferrer"}
                  className="group flex flex-col items-center gap-2 transition"
                >
                  <span
                    className="flex h-12 w-12 items-center justify-center rounded-xl transition group-hover:brightness-110"
                    style={{ backgroundColor: "color-mix(in srgb, var(--site-primary) 12%, transparent)" }}
                  >
                    {Icon && <Icon size={22} className="text-[var(--site-primary)]" />}
                  </span>
                  <span className="text-xs font-medium opacity-80">{link.label}</span>
                </a>
              );
            })}
          </div>
        )}
      </section>
    );
  }

  return null;
}
