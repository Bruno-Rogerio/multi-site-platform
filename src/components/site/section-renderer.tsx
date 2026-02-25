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

    if (variant === "split") {
      return (
        <section id="hero" className="w-full">
          <div className="mx-auto grid w-full max-w-7xl gap-8 px-6 py-16 md:grid-cols-2 md:items-center md:py-24">
            <div>
              {eyebrow && (
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--site-accent)]">
                  {eyebrow}
                </p>
              )}
              <h1 className="text-4xl font-bold leading-[1.1] md:text-5xl lg:text-6xl">{title}</h1>
              {subtitle && <p className="mt-5 max-w-lg text-lg leading-relaxed opacity-70">{subtitle}</p>}
              <a
                href={ctaHref}
                className={`mt-8 inline-flex bg-[var(--site-primary)] px-6 py-3.5 text-sm font-semibold text-white transition hover:brightness-110 ${buttonStyleClassName}`}
                style={{ color: "#fff" }}
              >
                {ctaLabel}
              </a>
            </div>
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={title}
                width={1280}
                height={960}
                className="aspect-[4/3] h-auto w-full object-cover"
                style={{ borderRadius: cardRadius, border: "1px solid var(--site-border)" }}
              />
            ) : (
              <div
                className="flex aspect-[4/3] items-center justify-center"
                style={{ borderRadius: cardRadius, border: "1px dashed var(--site-border)", backgroundColor: "color-mix(in srgb, var(--site-primary) 5%, transparent)" }}
              >
                <span className="text-sm opacity-30">Sua imagem aqui</span>
              </div>
            )}
          </div>
        </section>
      );
    }

    if (variant === "centered") {
      return (
        <section id="hero" className="w-full py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-6 text-center">
            {imageUrl && (
              <Image
                src={imageUrl}
                alt={title}
                width={1280}
                height={720}
                className="mx-auto mb-8 aspect-[16/9] h-auto w-full object-cover"
                style={{ borderRadius: cardRadius, border: "1px solid var(--site-border)" }}
              />
            )}
            {eyebrow && (
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--site-accent)]">
                {eyebrow}
              </p>
            )}
            <h1 className="text-4xl font-bold leading-[1.1] md:text-5xl lg:text-6xl">{title}</h1>
            {subtitle && <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed opacity-70">{subtitle}</p>}
            <a
              href={ctaHref}
              className={`mt-8 inline-flex bg-[var(--site-primary)] px-6 py-3.5 text-sm font-semibold text-white transition hover:brightness-110 ${buttonStyleClassName}`}
              style={{ color: "#fff" }}
            >
              {ctaLabel}
            </a>
          </div>
        </section>
      );
    }

    if (variant === "minimal") {
      return (
        <section id="hero" className="w-full py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-6">
            {imageUrl && (
              <Image
                src={imageUrl}
                alt={title}
                width={1280}
                height={540}
                className="mb-10 aspect-[21/9] h-auto w-full object-cover"
                style={{ borderRadius: cardRadius, border: "1px solid var(--site-border)" }}
              />
            )}
            {eyebrow && (
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--site-accent)]">
                {eyebrow}
              </p>
            )}
            <h1 className="max-w-4xl border-l-[6px] border-[var(--site-primary)] pl-6 text-4xl font-bold leading-[1.1] md:text-6xl lg:text-7xl">
              {title}
            </h1>
            {subtitle && <p className="mt-6 max-w-2xl text-lg leading-relaxed opacity-60">{subtitle}</p>}
            <a
              href={ctaHref}
              className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[var(--site-primary)] underline underline-offset-4 decoration-2 decoration-[var(--site-primary)]/40 transition hover:decoration-[var(--site-primary)]"
            >
              {ctaLabel} <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </section>
      );
    }

    if (variant === "card") {
      return (
        <section
          id="hero"
          className="w-full py-16 md:py-24"
          style={{ background: "radial-gradient(ellipse at top, color-mix(in srgb, var(--site-primary) 6%, var(--site-background)), var(--site-background))" }}
        >
          <div
            className="relative mx-auto max-w-4xl overflow-hidden p-8 text-center md:p-12"
            style={{
              borderRadius: "var(--site-radius, 24px)",
              border: "1px solid color-mix(in srgb, var(--site-primary) 18%, transparent)",
              boxShadow: "0 8px 40px color-mix(in srgb, var(--site-primary) 12%, transparent)",
              backgroundColor: "color-mix(in srgb, var(--site-surface) 80%, transparent)",
            }}
          >
            {imageUrl && (
              <Image
                src={imageUrl}
                alt={title}
                width={1280}
                height={720}
                className="mx-auto mb-8 aspect-[16/9] h-auto w-full object-cover"
                style={{ borderRadius: cardRadius, border: "1px solid var(--site-border)" }}
              />
            )}
            {eyebrow && (
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--site-accent)]">
                {eyebrow}
              </p>
            )}
            <h1 className="text-3xl font-bold leading-[1.1] md:text-5xl">{title}</h1>
            {subtitle && <p className="mt-4 text-base leading-relaxed opacity-70">{subtitle}</p>}
            <a
              href={ctaHref}
              className={`mt-8 inline-flex bg-[var(--site-primary)] px-6 py-3.5 text-sm font-semibold text-white transition hover:brightness-110 ${buttonStyleClassName}`}
              style={{ color: "#fff" }}
            >
              {ctaLabel}
            </a>
          </div>
        </section>
      );
    }

    if (variant === "centered-gradient") {
      return (
        <section
          id="hero"
          className="w-full bg-[linear-gradient(135deg,var(--site-primary),var(--site-accent))] py-16 text-white md:py-24"
        >
          <div className="mx-auto max-w-4xl px-6 text-center">
            {imageUrl && (
              <Image
                src={imageUrl}
                alt={title}
                width={1280}
                height={720}
                className="mx-auto mb-8 aspect-[16/9] h-auto w-full max-w-3xl rounded-2xl border border-white/20 object-cover"
              />
            )}
            {eyebrow && (
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
                {eyebrow}
              </p>
            )}
            <h1 className="text-4xl font-bold leading-[1.1] md:text-5xl lg:text-6xl">{title}</h1>
            {subtitle && <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-white/80">{subtitle}</p>}
            <a
              href={ctaHref}
              className={`mt-8 inline-flex bg-white px-6 py-3.5 text-sm font-semibold transition hover:bg-white/90 ${buttonStyleClassName}`}
              style={{ color: "var(--site-primary)" }}
            >
              {ctaLabel}
            </a>
          </div>
        </section>
      );
    }

    // default hero
    return (
      <section id="hero" className="relative w-full overflow-hidden py-16 md:py-24">
        <div
          className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full opacity-[0.06] blur-3xl"
          style={{ background: "radial-gradient(circle, var(--site-primary), transparent)" }}
        />
        <div className="relative mx-auto max-w-7xl px-6">
          {imageUrl && (
            <Image
              src={imageUrl}
              alt={title}
              width={1280}
              height={720}
              className="mb-8 aspect-[16/9] h-auto w-full max-w-3xl object-cover"
              style={{ borderRadius: cardRadius, border: "1px solid var(--site-border)" }}
            />
          )}
          {eyebrow && (
            <>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--site-accent)]">
                {eyebrow}
              </p>
              <div className="mb-4 h-0.5 w-12" style={{ backgroundColor: "var(--site-accent)" }} />
            </>
          )}
          <h1 className="text-4xl font-bold leading-[1.1] md:text-5xl lg:text-6xl">{title}</h1>
          {subtitle && <p className="mt-5 max-w-2xl text-lg leading-relaxed opacity-70">{subtitle}</p>}
          <a
            href={ctaHref}
            className={`mt-8 inline-flex bg-[var(--site-primary)] px-6 py-3.5 text-sm font-semibold text-white transition hover:brightness-110 ${buttonStyleClassName}`}
            style={{ color: "#fff" }}
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
      <section id="about" className="w-full py-16 md:py-20">
        <div className={containerClass}>
          {aboutImageUrl ? (
            <div className="grid gap-10 items-start md:grid-cols-[360px_1fr]">
              <div className="overflow-hidden" style={{ borderRadius: cardRadius, border: "1px solid var(--site-border)" }}>
                <Image
                  src={aboutImageUrl}
                  alt={title}
                  width={360}
                  height={480}
                  className="aspect-[3/4] h-auto w-full object-cover"
                />
              </div>
              <div>
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
              <h2 className="text-3xl font-bold">{title}</h2>
              {body && <p className="mt-5 max-w-3xl whitespace-pre-line text-base leading-relaxed opacity-80">{body}</p>}
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

    const effectiveCards: ServiceCard[] = cards.length > 0
      ? cards
      : items.map((t) => ({ title: t, description: "", iconName: "" }));

    if (variant === "minimal" || variant === "minimal-list") {
      return (
        <section id="services" className="w-full py-16 md:py-20">
          <div className={containerClass}>
            <h2 className="text-3xl font-bold">{title}</h2>
            {imageUrl && (
              <Image src={imageUrl} alt={title} width={1200} height={600}
                className="mt-6 aspect-[2/1] h-auto w-full object-cover"
                style={{ borderRadius: cardRadius, border: "1px solid var(--site-border)" }} />
            )}
            <ul className="mt-6 divide-y divide-[var(--site-border)]">
              {effectiveCards.map((card, index) => {
                const Icon = getIcon(card.iconName || "");
                return (
                  <li key={`${card.title}-${index}`}
                    className="flex items-center gap-4 px-4 py-5 text-sm transition hover:bg-[var(--site-primary)]/5"
                    style={{ borderRadius: cardRadius }}>
                    {Icon ? (
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                        style={{ backgroundColor: "color-mix(in srgb, var(--site-primary) 10%, transparent)" }}>
                        <Icon size={18} className="text-[var(--site-primary)]" />
                      </div>
                    ) : (
                      <span className="h-2 w-2 shrink-0 rounded-full bg-[var(--site-accent)]" />
                    )}
                    <div className="flex-1">
                      <span className="text-base font-medium">{card.title}</span>
                      {card.description && (
                        <p className="mt-1 text-sm opacity-60">{card.description}</p>
                      )}
                    </div>
                    {card.imageUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={card.imageUrl}
                        alt={card.title}
                        className="h-16 w-20 shrink-0 object-cover"
                        style={{ borderRadius: cardRadius }}
                      />
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      );
    }

    if (variant === "masonry") {
      return (
        <section id="services" className="w-full py-16 md:py-20">
          <div className={containerClass}>
            <h2 className="text-3xl font-bold">{title}</h2>
            {imageUrl && (
              <Image src={imageUrl} alt={title} width={1200} height={600}
                className="mt-6 aspect-[2/1] h-auto w-full object-cover"
                style={{ borderRadius: cardRadius, border: "1px solid var(--site-border)" }} />
            )}
            <div className="mt-6 columns-1 gap-5 space-y-5 sm:columns-2">
              {effectiveCards.map((card, index) => {
                const Icon = getIcon(card.iconName || "");
                const isTall = index % 3 === 0;
                return (
                  <div key={`${card.title}-${index}`}
                    className="break-inside-avoid overflow-hidden border border-[var(--site-border)] bg-[var(--site-surface)] transition-all duration-200 hover:shadow-lg hover:border-[var(--site-primary)]/20"
                    style={{ borderRadius: cardRadius }}>
                    {card.imageUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={card.imageUrl}
                        alt={card.title}
                        className="w-full object-cover"
                        style={{ height: isTall ? "160px" : "120px" }}
                      />
                    )}
                    <div className={`px-5 ${isTall ? "py-8" : "py-5"}`}>
                      {Icon && (
                        <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl"
                          style={{ backgroundColor: "color-mix(in srgb, var(--site-primary) 10%, transparent)" }}>
                          <Icon size={20} className="text-[var(--site-primary)]" />
                        </div>
                      )}
                      <h3 className="text-base font-semibold">{card.title}</h3>
                      {card.description && <p className="mt-2 text-sm leading-relaxed opacity-60">{card.description}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      );
    }

    if (variant === "columns") {
      return (
        <section id="services" className="w-full py-16 md:py-20">
          <div className={containerClass}>
            <h2 className="text-3xl font-bold text-center">{title}</h2>
            {imageUrl && (
              <Image src={imageUrl} alt={title} width={1200} height={600}
                className="mt-6 aspect-[2/1] h-auto w-full object-cover"
                style={{ borderRadius: cardRadius, border: "1px solid var(--site-border)" }} />
            )}
            <div className="mt-8 space-y-5">
              {effectiveCards.map((card, index) => {
                const Icon = getIcon(card.iconName || "");
                const isReversed = index % 2 === 1;
                return (
                  <div
                    key={`${card.title}-${index}`}
                    className={`flex items-center gap-6 overflow-hidden border border-[var(--site-border)] bg-[var(--site-surface)] p-6 transition-all duration-200 hover:shadow-lg hover:border-[var(--site-primary)]/20 ${
                      isReversed ? "flex-row-reverse" : ""
                    }`}
                    style={{ borderRadius: cardRadius }}
                  >
                    {Icon && (
                      <div
                        className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl"
                        style={{ backgroundColor: "color-mix(in srgb, var(--site-primary) 10%, transparent)" }}
                      >
                        <Icon size={28} className="text-[var(--site-primary)]" />
                      </div>
                    )}
                    <div className={`flex-1 ${isReversed ? "text-right" : ""}`}>
                      <h3 className="text-base font-semibold">{card.title}</h3>
                      {card.description && (
                        <p className="mt-1 text-sm leading-relaxed opacity-60">{card.description}</p>
                      )}
                    </div>
                    {card.imageUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={card.imageUrl}
                        alt={card.title}
                        className="h-20 w-24 shrink-0 object-cover"
                        style={{ borderRadius: cardRadius }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      );
    }

    if (variant === "steps") {
      return (
        <section id="services" className="w-full py-16 md:py-20">
          <div className={containerClass}>
            <h2 className="text-3xl font-bold">{title}</h2>
            {imageUrl && (
              <Image src={imageUrl} alt={title} width={1200} height={600}
                className="mt-6 aspect-[2/1] h-auto w-full object-cover"
                style={{ borderRadius: cardRadius, border: "1px solid var(--site-border)" }} />
            )}
            <ol className="mt-8 relative ml-1">
              <div
                className="absolute left-[15px] top-5 bottom-5 w-0.5"
                style={{ backgroundColor: "color-mix(in srgb, var(--site-primary) 20%, transparent)" }}
              />
              {effectiveCards.map((card, index) => {
                const Icon = getIcon(card.iconName || "");
                return (
                  <li key={`${card.title}-${index}`} className="relative flex items-center gap-4 pb-6 last:pb-0">
                    <span className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--site-primary)] text-xs font-bold text-white" style={{ color: "#fff" }}>
                      {index + 1}
                    </span>
                    <div className="flex-1 pt-1">
                      <div className="flex items-center gap-2">
                        {Icon && <Icon size={16} className="text-[var(--site-primary)]" />}
                        <span className="text-base font-semibold">{card.title}</span>
                      </div>
                      {card.description && <p className="mt-1 text-sm leading-relaxed opacity-60">{card.description}</p>}
                    </div>
                    {card.imageUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={card.imageUrl}
                        alt={card.title}
                        className="h-20 w-24 shrink-0 object-cover"
                        style={{ borderRadius: cardRadius }}
                      />
                    )}
                  </li>
                );
              })}
            </ol>
          </div>
        </section>
      );
    }

    // default services — layout horizontal (ícone+texto | imagem) se houver imagens, senão grid
    const hasAnyImage = effectiveCards.some((c) => c.imageUrl);

    if (hasAnyImage) {
      return (
        <section id="services" className="w-full py-16 md:py-20">
          <div className={containerClass}>
            <h2 className="text-3xl font-bold">{title}</h2>
            {imageUrl && (
              <Image src={imageUrl} alt={title} width={1200} height={600}
                className="mt-6 aspect-[2/1] h-auto w-full object-cover"
                style={{ borderRadius: cardRadius, border: "1px solid var(--site-border)" }} />
            )}
            <div className="mt-8 space-y-6">
              {effectiveCards.map((card, index) => {
                const Icon = getIcon(card.iconName || "");
                const isReversed = index % 2 === 1;
                return (
                  <div
                    key={`${card.title}-${index}`}
                    className={`flex items-center gap-8 overflow-hidden border border-[var(--site-border)] bg-[var(--site-surface)] transition-all duration-200 hover:shadow-lg hover:border-[var(--site-primary)]/20 ${isReversed ? "flex-row-reverse" : ""}`}
                    style={{ borderRadius: cardRadius }}
                  >
                    <div className="flex-1 p-6 md:p-8">
                      {Icon && (
                        <div
                          className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl"
                          style={{ backgroundColor: "color-mix(in srgb, var(--site-primary) 10%, transparent)" }}
                        >
                          <Icon size={22} className="text-[var(--site-primary)]" />
                        </div>
                      )}
                      <h3 className="text-xl font-semibold">{card.title}</h3>
                      {card.description && (
                        <p className="mt-3 text-base leading-relaxed opacity-60">{card.description}</p>
                      )}
                    </div>
                    {card.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={card.imageUrl}
                        alt={card.title}
                        className="h-48 w-48 shrink-0 object-cover md:h-56 md:w-64"
                        style={{ borderRadius: isReversed ? `${cardRadius} 0 0 ${cardRadius}` : `0 ${cardRadius} ${cardRadius} 0` }}
                      />
                    ) : (
                      <div
                        className="hidden h-48 w-48 shrink-0 items-center justify-center md:flex md:h-56 md:w-64"
                        style={{
                          backgroundColor: "color-mix(in srgb, var(--site-primary) 5%, transparent)",
                          borderRadius: isReversed ? `${cardRadius} 0 0 ${cardRadius}` : `0 ${cardRadius} ${cardRadius} 0`,
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

    return (
      <section id="services" className="w-full py-16 md:py-20">
        <div className={containerClass}>
          <h2 className="text-3xl font-bold">{title}</h2>
          {imageUrl && (
            <Image src={imageUrl} alt={title} width={1200} height={600}
              className="mt-6 aspect-[2/1] h-auto w-full object-cover"
              style={{ borderRadius: cardRadius, border: "1px solid var(--site-border)" }} />
          )}
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {effectiveCards.map((card, index) => {
              const Icon = getIcon(card.iconName || "");
              return (
                <div
                  key={`${card.title}-${index}`}
                  className="overflow-hidden border border-[var(--site-border)] bg-[var(--site-surface)] p-6 text-center transition-all duration-200 hover:shadow-lg hover:border-[var(--site-primary)]/20"
                  style={{ borderRadius: cardRadius }}
                >
                  {Icon && (
                    <div
                      className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl"
                      style={{ backgroundColor: "color-mix(in srgb, var(--site-primary) 10%, transparent)" }}
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
          </div>
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
    const linkTarget = (href: string) => href.startsWith("http") ? "_blank" : undefined;
    const linkRel = (href: string) => href.startsWith("http") ? "noreferrer" : undefined;

    if (variant === "banner") {
      return (
        <section id="cta" className="w-full" style={{ backgroundColor: "color-mix(in srgb, var(--site-primary) 6%, var(--site-background))" }}>
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-12 md:flex-row md:items-center md:justify-between md:py-16">
            <div className="flex-1">
              <h2 className="text-2xl font-bold md:text-3xl">{title}</h2>
              {description && <p className="mt-3 max-w-xl text-base opacity-70">{description}</p>}
            </div>
            <a
              href={buttonHref}
              target={linkTarget(buttonHref)}
              rel={linkRel(buttonHref)}
              className={`inline-flex shrink-0 bg-[var(--site-primary)] px-6 py-3.5 text-sm font-semibold text-white transition hover:brightness-110 ${buttonStyleClassName}`}
              style={{ color: "#fff" }}
            >
              {buttonLabel}
            </a>
          </div>
        </section>
      );
    }

    if (variant === "centered") {
      return (
        <section
          id="cta"
          className="w-full py-12 md:py-16"
          style={{ borderTop: "2px solid color-mix(in srgb, var(--site-primary) 12%, transparent)", borderBottom: "2px solid color-mix(in srgb, var(--site-primary) 12%, transparent)" }}
        >
          <div className="mx-auto max-w-3xl px-6 text-center">
            <h2 className="text-2xl font-bold md:text-3xl">{title}</h2>
            {description && <p className="mx-auto mt-3 max-w-xl text-base opacity-70">{description}</p>}
            <a
              href={buttonHref}
              target={linkTarget(buttonHref)}
              rel={linkRel(buttonHref)}
              className={`mt-6 inline-flex bg-[var(--site-primary)] px-6 py-3.5 text-sm font-semibold text-white transition hover:brightness-110 ${buttonStyleClassName}`}
              style={{ color: "#fff" }}
            >
              {buttonLabel}
            </a>
          </div>
        </section>
      );
    }

    if (variant === "banner-gradient") {
      return (
        <section id="cta" className="w-full bg-[linear-gradient(135deg,var(--site-primary),var(--site-accent))] text-white">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-12 md:flex-row md:items-center md:justify-between md:py-16">
            <div className="flex-1">
              <h2 className="text-2xl font-bold md:text-3xl">{title}</h2>
              {description && <p className="mt-3 max-w-xl text-base text-white/80">{description}</p>}
            </div>
            <a
              href={buttonHref}
              target={linkTarget(buttonHref)}
              rel={linkRel(buttonHref)}
              className={`inline-flex shrink-0 bg-white px-6 py-3.5 text-sm font-semibold transition hover:bg-white/90 ${buttonStyleClassName}`}
              style={{ color: "var(--site-primary)" }}
            >
              {buttonLabel}
            </a>
          </div>
        </section>
      );
    }

    if (variant === "centered-gradient") {
      return (
        <section id="cta" className="relative w-full overflow-hidden bg-[linear-gradient(135deg,var(--site-primary),var(--site-accent))] text-white">
          <div className="pointer-events-none absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
          <div className="relative mx-auto max-w-3xl px-6 py-12 text-center md:py-16">
            <h2 className="text-2xl font-bold md:text-3xl">{title}</h2>
            {description && <p className="mx-auto mt-3 max-w-xl text-base text-white/80">{description}</p>}
            <a
              href={buttonHref}
              target={linkTarget(buttonHref)}
              rel={linkRel(buttonHref)}
              className={`mt-6 inline-flex bg-white px-6 py-3.5 text-sm font-semibold transition hover:bg-white/90 ${buttonStyleClassName}`}
              style={{ color: "var(--site-primary)" }}
            >
              {buttonLabel}
            </a>
          </div>
        </section>
      );
    }

    if (variant === "double") {
      return (
        <section id="cta" className="w-full py-12 md:py-16">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <h2 className="text-2xl font-bold md:text-3xl">{title}</h2>
            {description && <p className="mx-auto mt-3 max-w-xl text-base opacity-70">{description}</p>}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
              <a
                href={buttonHref}
                target={linkTarget(buttonHref)}
                rel={linkRel(buttonHref)}
                className={`inline-flex bg-[var(--site-primary)] px-6 py-3.5 text-sm font-semibold text-white transition hover:brightness-110 ${buttonStyleClassName}`}
                style={{ color: "#fff" }}
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

    // default cta
    return (
      <section
        id="cta"
        className="w-full py-12 md:py-16"
        style={{ borderTop: "1px solid var(--site-border)", borderBottom: "1px solid var(--site-border)" }}
      >
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-2xl font-bold md:text-3xl">{title}</h2>
          {description && <p className="mx-auto mt-3 max-w-xl text-base opacity-70">{description}</p>}
          <a
            href={buttonHref}
            target={linkTarget(buttonHref)}
            rel={linkRel(buttonHref)}
            className={`mt-6 inline-flex border-2 border-[var(--site-primary)] px-6 py-3 text-sm font-semibold transition hover:bg-[var(--site-primary)] hover:text-white ${buttonStyleClassName}`}
            style={{ color: "var(--site-primary)" }}
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

    return (
      <section className="w-full py-16 md:py-20">
        <div className={containerClass}>
          <h2 className="text-3xl font-bold">{title}</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {testimonials.map((testimonial) => (
              <article
                key={`${testimonial.author}-${testimonial.quote}`}
                className="border border-[var(--site-border)] bg-[var(--site-surface)] p-6"
                style={{ borderRadius: cardRadius }}
              >
                <p className="text-base leading-relaxed opacity-80">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-[var(--site-accent)]">
                  {testimonial.author}
                </p>
              </article>
            ))}
          </div>
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
      if (whatsappUrl) legacyLinks.push({ type: "whatsapp", url: whatsappUrl, label: whatsappLabel, icon: "MessageCircle" });
      if (secondaryUrl && secondaryLabel) legacyLinks.push({ type: "email", url: secondaryUrl, label: secondaryLabel, icon: "Mail" });
    }
    const allLinks = socialLinks.length > 0 ? socialLinks : legacyLinks;

    return (
      <section id="contact" className="w-full py-16 md:py-20">
        <div className={`${containerClass} text-center`}>
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
                    className="group flex flex-col items-center gap-3 transition"
                  >
                    <span
                      className="flex h-14 w-14 items-center justify-center rounded-xl transition group-hover:scale-105 group-hover:brightness-110"
                      style={{ backgroundColor: "color-mix(in srgb, var(--site-primary) 12%, transparent)" }}
                    >
                      {Icon && <Icon size={24} className="text-[var(--site-primary)]" />}
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
