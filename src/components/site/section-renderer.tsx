import Image from "next/image";

import type { Site } from "@/lib/tenant/types";
import type { Section } from "@/lib/tenant/types";

import { ContactForm } from "./contact-form";

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

  if (section.type === "hero") {
    const eyebrow = asString(section.content.eyebrow);
    const title = asString(section.content.title, site.name);
    const subtitle = asString(section.content.subtitle);
    const ctaLabel = asString(section.content.ctaLabel, "Entrar em contato");
    const ctaHref = asString(section.content.ctaHref, "#contact");
    const imageUrl = asString(section.content.imageUrl);

    if (variant === "split") {
      return (
        <section className={`grid gap-5 rounded-3xl p-8 shadow-sm md:grid-cols-2 md:items-center ${surfaceClassName}`}>
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
            <div className="rounded-2xl border border-[var(--site-border)] bg-[var(--site-background)] p-5">
              <p className="text-sm font-semibold">Sessões online em todo o Brasil</p>
              <p className="mt-2 text-sm opacity-75">
                Atendimento com plano terapêutico personalizado e acompanhamento semanal.
              </p>
            </div>
          )}
        </section>
      );
    }

    if (variant === "centered") {
      return (
        <section className={`rounded-3xl p-8 text-center shadow-sm ${surfaceClassName}`}>
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
            className={`mt-6 inline-flex bg-[var(--site-primary)] px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110 ${buttonStyleClassName}`}
          >
            {ctaLabel}
          </a>
        </section>
      );
    }

    return (
      <section className={`rounded-3xl p-8 shadow-sm ${surfaceClassName}`}>
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
          className={`mt-6 inline-flex bg-[var(--site-primary)] px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110 ${buttonStyleClassName}`}
        >
          {ctaLabel}
        </a>
      </section>
    );
  }

  if (section.type === "about") {
    const title = asString(section.content.title, "Sobre");
    const body = asString(section.content.body);

    return (
      <section className={`rounded-3xl p-6 ${surfaceClassName}`}>
        <h2 className="text-2xl font-semibold">{title}</h2>
        {body && <p className="mt-4 whitespace-pre-line leading-7 opacity-85">{body}</p>}
      </section>
    );
  }

  if (section.type === "services") {
    const title = asString(section.content.title, "Serviços");
    const items = asStringArray(section.content.items);
    const imageUrl = asString(section.content.imageUrl);

    if (variant === "minimal") {
      return (
        <section className={`rounded-3xl p-6 ${surfaceClassName}`}>
          <h2 className="text-2xl font-semibold">{title}</h2>
          {imageUrl && (
            <Image
              src={imageUrl}
              alt={title}
              width={960}
              height={720}
              className="mt-4 aspect-[4/3] h-auto w-full rounded-2xl border border-[var(--site-border)] object-cover"
            />
          )}
          <ul className="mt-4 space-y-2">
            {items.map((item, index) => (
              <li key={`${item}-${index}`} className="flex items-center gap-2 text-sm">
                <span className="h-2 w-2 rounded-full bg-[var(--site-accent)]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      );
    }

    return (
      <section className={`rounded-3xl p-6 ${surfaceClassName}`}>
        <h2 className="text-2xl font-semibold">{title}</h2>
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={title}
            width={960}
            height={720}
            className="mt-4 aspect-[4/3] h-auto w-full rounded-2xl border border-[var(--site-border)] object-cover"
          />
        )}
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {items.map((item, index) => (
            <li
              key={`${item}-${index}`}
              className="rounded-2xl border border-[var(--site-border)] bg-[var(--site-background)] px-4 py-3 text-sm font-medium"
            >
              {item}
            </li>
          ))}
        </ul>
      </section>
    );
  }

  if (section.type === "cta") {
    const title = asString(section.content.title, "Vamos conversar?");
    const description = asString(section.content.description);
    const buttonLabel = asString(section.content.buttonLabel, "Entrar em contato");
    const buttonHref = asString(section.content.buttonHref, "#cta");
    const imageUrl = asString(section.content.imageUrl);

    if (variant === "banner") {
      return (
        <section id="cta" className="rounded-3xl bg-[var(--site-primary)] p-6 text-white">
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
            className={`mt-5 inline-flex border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20 ${buttonStyleClassName}`}
          >
            {buttonLabel}
          </a>
        </section>
      );
    }

    return (
      <section id="cta" className={`rounded-3xl p-6 ${surfaceClassName}`}>
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
          className={`mt-5 inline-flex bg-[var(--site-primary)] px-4 py-2 text-sm font-semibold text-white transition hover:brightness-105 ${buttonStyleClassName}`}
        >
          {buttonLabel}
        </a>
      </section>
    );
  }

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

  if (section.type === "contact") {
    const title = asString(section.content.title, "Contato");
    const subtitle = asString(section.content.subtitle);
    const whatsappUrl = asString(section.content.whatsappUrl);
    const whatsappLabel = asString(section.content.whatsappLabel, "Falar no WhatsApp");
    const submitLabel = asString(section.content.submitLabel, "Enviar");

    return (
      <section
        id="contact"
        className={`rounded-3xl p-6 md:grid md:grid-cols-2 md:gap-6 ${surfaceClassName}`}
      >
        <div className="mb-6 md:mb-0">
          <h2 className="text-2xl font-semibold">{title}</h2>
          {subtitle && <p className="mt-3 text-sm opacity-80">{subtitle}</p>}
          {whatsappUrl && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className={`mt-4 inline-flex bg-[var(--site-accent)] px-4 py-2 text-sm font-semibold text-white transition hover:brightness-105 ${buttonStyleClassName}`}
            >
              {whatsappLabel}
            </a>
          )}
        </div>
        <ContactForm
          siteId={site.id}
          submitLabel={submitLabel}
          buttonStyleClassName={buttonStyleClassName}
        />
      </section>
    );
  }

  return null;
}
