import type { WizardState } from "@/lib/onboarding/types";
import type { Site, Section, ThemeSettings } from "@/lib/tenant/types";
import { getPaletteById, getSiteStyleVars } from "@/lib/onboarding/palettes";

function str(v: unknown): string {
  return typeof v === "string" ? v : "";
}

const CTA_ICONS: Record<string, string> = {
  whatsapp: "MessageCircle",
  email: "Mail",
  instagram: "Instagram",
  linkedin: "Linkedin",
  facebook: "Facebook",
};

const CTA_LABELS: Record<string, string> = {
  whatsapp: "WhatsApp",
  email: "E-mail",
  instagram: "Instagram",
  linkedin: "LinkedIn",
  facebook: "Facebook",
};

export function wizardToPreviewSite(state: WizardState): Site {
  const palette =
    state.paletteId && state.paletteId !== "custom"
      ? getPaletteById(state.paletteId)
      : null;

  let primaryColor: string;
  let accentColor: string;
  let backgroundColor: string;
  let textColor: string;

  if (state.paletteId === "custom") {
    primaryColor = state.customColors.primary;
    accentColor = state.customColors.accent;
    backgroundColor = state.customColors.background;
    textColor = state.customColors.text;
  } else if (palette) {
    primaryColor = palette.primary;
    accentColor = palette.accent;
    backgroundColor = palette.background;
    textColor = palette.text;
  } else {
    primaryColor = "#3B82F6";
    accentColor = "#22D3EE";
    backgroundColor = "#0B1020";
    textColor = "#EAF0FF";
  }

  const styleVars = palette ? getSiteStyleVars(palette) : {};

  const themeSettings: ThemeSettings = {
    primaryColor,
    accentColor,
    backgroundColor,
    textColor,
    fontFamily: state.fontFamily || "Inter, system-ui, sans-serif",
    buttonStyle: state.buttonStyle || "rounded",
    logoUrl: state.logoUrl || undefined,
    headerStyle: state.headerStyle || "blur",
    dividerStyle: state.dividerStyle || "none",
    motionStyle: state.motionStyle || "none",
    "--site-radius": styleVars["--site-radius"] ?? "24px",
    "--site-spacing": styleVars["--site-spacing"] ?? "16px",
    "--site-shadow": styleVars["--site-shadow"] ?? "none",
  };

  return {
    id: "preview",
    name: state.businessName || "Meu Site",
    domain:
      (state.preferredSubdomain || "seusite") +
      "." +
      (process.env.NEXT_PUBLIC_PLATFORM_ROOT_DOMAIN || "bsph.com.br"),
    plan: "pro",
    themeSettings,
    homePage: {
      id: "home",
      siteId: "preview",
      slug: "/",
      title: state.businessName || "Meu Site",
      sections: [],
    },
    createdAt: new Date().toISOString(),
  };
}

export function wizardToPreviewSections(state: WizardState): Section[] {
  const sections: Section[] = [];
  state.enabledSections.forEach((sectionId, index) => {
    const section = buildSection(state, sectionId, index);
    if (section) sections.push(section);
  });
  return sections;
}

function buildSection(
  state: WizardState,
  sectionId: string,
  order: number
): Section | null {
  const content = state.content;

  switch (sectionId) {
    case "hero":
      return {
        id: "hero",
        type: "hero",
        order,
        variant: state.heroVariant || "default",
        content: {
          title: str(content.heroTitle) || state.businessName || "",
          subtitle: str(content.heroSubtitle),
          eyebrow: str(content.heroEyebrow),
          ctaLabel: str(content.heroCta) || "Entrar em contato",
          ctaHref: "#contact",
          imageUrl: state.heroImage || str(content.heroImage) || "",
        },
      };

    case "about":
      return {
        id: "about",
        type: "about",
        order,
        content: {
          title: str(content.aboutTitle),
          body: str(content.aboutBody),
          imageUrl: str(content.aboutImage),
        },
      };

    case "services":
      return {
        id: "services",
        type: "services",
        order,
        variant: state.servicesVariant || "default",
        content: {
          title: str(content.servicesTitle),
          cards: state.serviceCards,
          imageUrl: state.servicesImage || "",
        },
      };

    case "testimonials": {
      // Normalize to { quote, author } format
      let items: Array<{ quote: string; author: string }> = [];
      if (Array.isArray(content.testimonials)) {
        items = (content.testimonials as Array<Record<string, unknown>>)
          .map((t) => ({ quote: str(t.text), author: str(t.name) }))
          .filter((t) => t.quote && t.author);
      } else {
        try {
          const parsed = JSON.parse(str(content.testimonialsJson) || "[]");
          if (Array.isArray(parsed)) {
            items = (parsed as Array<Record<string, unknown>>).filter(
              (t) => t?.quote && t?.author
            ) as Array<{ quote: string; author: string }>;
          }
        } catch {
          /* noop */
        }
      }
      return {
        id: "testimonials",
        type: "testimonials",
        order,
        variant: state.testimonialsVariant || "grid",
        content: {
          title: str(content.testimonialsTitle) || "Depoimentos",
          items,
        },
      };
    }

    case "cta": {
      return {
        id: "cta",
        type: "cta",
        order,
        variant: state.ctaVariant || "centered",
        content: {
          title: str(content.ctaTitle) || "Vamos conversar?",
          description: str(content.ctaDescription),
          buttonLabel: str(content.ctaButtonLabel) || "Entrar em contato",
          buttonHref: str(content.ctaButtonUrl) || "#contact",
          secondaryLabel: str(content.ctaSecondaryLabel),
          secondaryHref: str(content.ctaSecondaryUrl),
        },
      };
    }

    case "contact": {
      const socialLinks = state.contactSelectedLinks
        .map((type) => {
          const conf =
            state.ctaConfig[type as keyof typeof state.ctaConfig];
          if (!conf?.url) return null;
          return {
            type,
            url: conf.url,
            label: conf.label || CTA_LABELS[type] || type,
            icon: CTA_ICONS[type] || "Link",
          };
        })
        .filter(Boolean);
      return {
        id: "contact",
        type: "contact",
        order,
        content: {
          title: str(content.contactTitle) || "Contato",
          subtitle: str(content.contactSubtitle),
          socialLinks,
        },
      };
    }

    case "faq":
      return {
        id: "faq",
        type: "faq",
        order,
        variant: state.faqVariant || "accordion",
        content: {
          title: str(content.faqTitle) || "Perguntas frequentes",
          items: Array.isArray(content.faqItems) ? content.faqItems : [],
        },
      };

    case "blog":
      return {
        id: "blog",
        type: "blog",
        order,
        variant: state.blogVariant || "grid",
        content: {
          title: str(content.blogTitle) || "Blog",
          posts: Array.isArray(content.blogPosts) ? content.blogPosts : [],
        },
      };

    case "gallery":
      return {
        id: "gallery",
        type: "gallery",
        order,
        variant: state.galleryVariant || "grid",
        content: {
          title: str(content.galleryTitle) || "Galeria",
          images: Array.isArray(content.galleryImages)
            ? content.galleryImages
            : [],
        },
      };

    case "events":
      return {
        id: "events",
        type: "events",
        order,
        variant: state.eventsVariant || "timeline",
        content: {
          title: str(content.eventsTitle) || "Eventos",
          events: Array.isArray(content.events) ? content.events : [],
        },
      };

    default:
      return null;
  }
}
