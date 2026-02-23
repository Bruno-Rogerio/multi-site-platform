import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { buildCtaUrl } from "@/lib/onboarding/cta-types";
import type { CtaTypeId } from "@/lib/onboarding/types";
import { isReservedSubdomain } from "@/lib/tenant/host";

const SUBDOMAIN_REGEX = /^[a-z0-9-]{3,30}$/;

type OnboardingDraftPayload = {
  creationMode?: "template" | "builder" | "builder-premium";
  siteStyle: string;
  paletteId?: string;
  customColors?: {
    primary?: string;
    accent?: string;
    background?: string;
    text?: string;
  };
  fontFamily?: string;
  headerStyle: string;
  heroStyle: string;
  servicesStyle: string;
  ctaStyle: string;
  motionStyle?: string;
  buttonStyle?: string;
  addonsSelected: string[];
  businessName: string;
  businessSegment: string;
  businessCity: string;
  businessHighlights: string;
  targetAudience: string;
  preferredSubdomain: string;
  content?: Record<string, string>;
  heroImage?: string;
  logoUrl?: string;
  ctaConfig?: Partial<Record<CtaTypeId, { label: string; url: string }>>;
  selectedCtaTypes?: CtaTypeId[];
};

function normalizeSubdomain(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function resolveRootDomain(): string {
  const configured =
    process.env.PLATFORM_ROOT_DOMAIN ??
    process.env.NEXT_PUBLIC_PLATFORM_ROOT_DOMAIN ??
    "";

  return configured.toLowerCase().trim() || "seudominio.com";
}

function buildPublicUrl(domain: string, hostHeader: string): string {
  const hasLocalPort = /:\d+$/.test(hostHeader);
  const port = hasLocalPort ? hostHeader.split(":").pop() : "";
  if (port) {
    return `http://${domain}:${port}`;
  }
  return `https://${domain}`;
}

function toItems(highlights: string): string[] {
  const fromLines = highlights
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (fromLines.length > 0) {
    return fromLines.slice(0, 6);
  }

  const fromComma = highlights
    .split(",")
    .map((piece) => piece.trim())
    .filter(Boolean);

  if (fromComma.length > 0) {
    return fromComma.slice(0, 6);
  }

  return ["Atendimento personalizado", "Plano de acompanhamento", "Suporte continuo"];
}

function mapHeroVariant(input: string): string {
  const valid = ["centered", "minimal", "split", "card", "centered-gradient"];
  return valid.includes(input) ? input : "centered";
}

function mapServicesVariant(input: string): string {
  const valid = ["default", "minimal-list", "masonry", "columns", "steps"];
  return valid.includes(input) ? input : "default";
}

function mapCtaVariant(input: string): string {
  const valid = ["banner", "centered", "banner-gradient", "centered-gradient", "double"];
  return valid.includes(input) ? input : "banner";
}

function themeBySiteStyle(style: string) {
  const base = {
    backgroundColor: "#ffffff",
    textColor: "#101426",
    fontFamily: "Sora, sans-serif",
    buttonStyle: "rounded",
  };

  switch (style) {
    case "tech-modern":
      return { ...base, primaryColor: "#3B82F6", accentColor: "#22D3EE" };
    case "editorial":
      return { ...base, primaryColor: "#1F2937", accentColor: "#7C5CFF" };
    case "organic-warm":
      return { ...base, primaryColor: "#C2410C", accentColor: "#FB7185" };
    case "bold-contrast":
      return { ...base, primaryColor: "#111827", accentColor: "#16A34A" };
    case "soft-human":
      return { ...base, primaryColor: "#2563EB", accentColor: "#8B5CF6" };
    default:
      return { ...base, primaryColor: "#204ECF", accentColor: "#36A66F" };
  }
}

function paletteById(paletteId: string | undefined) {
  switch (paletteId) {
    case "solar-pop":
      return { primaryColor: "#F59E0B", accentColor: "#F97316", backgroundColor: "#111827", textColor: "#FFFBEB" };
    case "mint-cloud":
      return { primaryColor: "#0D9488", accentColor: "#14B8A6", backgroundColor: "#F0FDFA", textColor: "#134E4A" };
    case "rose-luxe":
      return { primaryColor: "#E11D48", accentColor: "#FB7185", backgroundColor: "#1F1022", textColor: "#FFE4E6" };
    case "ocean-deep":
      return { primaryColor: "#0EA5E9", accentColor: "#06B6D4", backgroundColor: "#082F49", textColor: "#E0F2FE" };
    case "midnight-violet":
      return { primaryColor: "#7C5CFF", accentColor: "#38BDF8", backgroundColor: "#111827", textColor: "#EEF2FF" };
    case "aurora-soft":
      return { primaryColor: "#2563EB", accentColor: "#A78BFA", backgroundColor: "#F8FAFC", textColor: "#0F172A" };
    case "warm-premium":
      return { primaryColor: "#C2410C", accentColor: "#FB7185", backgroundColor: "#1C1917", textColor: "#FFF7ED" };
    case "forest-trust":
      return { primaryColor: "#15803D", accentColor: "#22C55E", backgroundColor: "#0F172A", textColor: "#ECFDF5" };
    case "mono-pro":
      return { primaryColor: "#111827", accentColor: "#52525B", backgroundColor: "#FAFAFA", textColor: "#09090B" };
    case "buildsphere":
    default:
      return { primaryColor: "#3B82F6", accentColor: "#22D3EE", backgroundColor: "#0B1020", textColor: "#EAF0FF" };
  }
}

function isHexColor(value: string | undefined): value is string {
  return Boolean(value && /^#[0-9a-fA-F]{6}$/.test(value));
}

function resolvePalette(payload: OnboardingDraftPayload) {
  if (payload.paletteId === "custom" && payload.customColors) {
    return {
      primaryColor: isHexColor(payload.customColors.primary) ? payload.customColors.primary : "#3B82F6",
      accentColor: isHexColor(payload.customColors.accent) ? payload.customColors.accent : "#22D3EE",
      backgroundColor: isHexColor(payload.customColors.background) ? payload.customColors.background : "#0B1020",
      textColor: isHexColor(payload.customColors.text) ? payload.customColors.text : "#EAF0FF",
    };
  }

  return paletteById(payload.paletteId);
}

export async function POST(request: Request) {
  const admin = createSupabaseAdminClient();
  if (!admin) {
    return NextResponse.json(
      { error: "Supabase admin indisponivel no servidor." },
      { status: 500 },
    );
  }

  const payload = (await request.json().catch(() => null)) as OnboardingDraftPayload | null;
  if (!payload) {
    return NextResponse.json({ error: "Payload invalido." }, { status: 400 });
  }

  const businessName = payload.businessName?.trim();
  const preferredSubdomain = normalizeSubdomain(payload.preferredSubdomain ?? "");

  if (!businessName) {
    return NextResponse.json({ error: "Nome do negocio e obrigatorio." }, { status: 400 });
  }

  if (!SUBDOMAIN_REGEX.test(preferredSubdomain)) {
    return NextResponse.json(
      { error: "Subdominio invalido. Use 3-30 caracteres (a-z, 0-9, -)." },
      { status: 400 },
    );
  }

  if (isReservedSubdomain(preferredSubdomain)) {
    return NextResponse.json({ error: "Subdominio reservado. Escolha outro." }, { status: 400 });
  }

  const headerStore = await headers();
  const hostHeader = (headerStore.get("host") ?? "").toLowerCase();
  const rootDomain = resolveRootDomain();
  const domain = `${preferredSubdomain}.${rootDomain}`;

  const { data: existingSite } = await admin
    .from("sites")
    .select("id,theme_settings")
    .eq("domain", domain)
    .maybeSingle();

  if (existingSite) {
    const settings = existingSite.theme_settings as Record<string, unknown> | null;

    // If it's an active site (not a draft), reject
    if (!settings?.onboardingDraft) {
      return NextResponse.json(
        { error: "Esse subdominio ja esta em uso. Escolha outro." },
        { status: 409 },
      );
    }

    // It's a previous draft — delete old sections/pages and recreate below
    const { data: oldPages } = await admin
      .from("pages")
      .select("id")
      .eq("site_id", existingSite.id);
    if (oldPages && oldPages.length > 0) {
      const pageIds = oldPages.map((p: { id: string }) => p.id);
      await admin.from("sections").delete().in("page_id", pageIds);
      await admin.from("pages").delete().eq("site_id", existingSite.id);
    }
  }

  const themeSettings = {
    ...themeBySiteStyle(payload.siteStyle),
    ...resolvePalette(payload),
    siteStyle: payload.siteStyle,
    paletteId: payload.paletteId ?? "buildsphere",
    fontFamily: payload.fontFamily ?? "Sora, sans-serif",
    headerStyle: payload.headerStyle,
    motionStyle: payload.motionStyle ?? "motion-reveal",
    buttonStyle: payload.buttonStyle ?? "rounded",
    logoUrl: payload.logoUrl ?? "",
    creationMode: payload.creationMode ?? "template",
    addons: payload.addonsSelected ?? [],
    onboardingDraft: true,
  };

  // Keep "minimal clean" visually clean even when user picks a strong palette.
  if (payload.siteStyle === "minimal-clean") {
    const minimal = themeBySiteStyle("minimal-clean");
    themeSettings.backgroundColor = minimal.backgroundColor;
    themeSettings.textColor = minimal.textColor;
  }

  let site: { id: string; name: string; domain: string };

  if (existingSite) {
    // Update existing draft
    await admin
      .from("sites")
      .update({ name: businessName, theme_settings: themeSettings })
      .eq("id", existingSite.id);
    site = { id: existingSite.id, name: businessName, domain };
  } else {
    // Create new site
    const { data: newSite, error: siteError } = await admin
      .from("sites")
      .insert({
        name: businessName,
        domain,
        plan: "landing",
        theme_settings: themeSettings,
      })
      .select("id,name,domain")
      .single();

    if (siteError || !newSite) {
      return NextResponse.json(
        { error: "Falha ao criar rascunho do site.", details: siteError?.message },
        { status: 500 },
      );
    }
    site = newSite;
  }

  const { data: page, error: pageError } = await admin
    .from("pages")
    .insert({
      site_id: site.id,
      slug: "home",
      title: `Home ${businessName}`,
    })
    .select("id")
    .single();

  if (pageError || !page) {
    return NextResponse.json(
      { error: "Rascunho criado parcialmente (falha em pages).", details: pageError?.message },
      { status: 500 },
    );
  }

  const audience = payload.targetAudience?.trim() || "voce";
  const segment = payload.businessSegment?.trim() || "atendimento profissional";
  const city = payload.businessCity?.trim();
  const content = payload.content ?? {};
  const ctaConfig = payload.ctaConfig ?? {};
  const selectedCtaTypes = payload.selectedCtaTypes ?? [];

  // Build WhatsApp URL from content.whatsapp if provided
  const whatsappNumber = content.whatsapp?.trim().replace(/\D/g, "");
  const whatsappUrl = whatsappNumber ? `https://wa.me/${whatsappNumber}` : "";

  // Resolve CTA button link from user's channel config
  function resolveCtaHref(): string {
    // 1. Use explicit ctaButtonUrl/heroCtaUrl from content editor
    if (content.ctaButtonUrl?.trim()) return content.ctaButtonUrl.trim();
    if (content.heroCtaUrl?.trim()) return content.heroCtaUrl.trim();
    // 2. Use WhatsApp from content
    if (whatsappUrl) return whatsappUrl;
    // 3. Use primary CTA channel config
    const primaryType = selectedCtaTypes[0];
    if (primaryType && ctaConfig[primaryType]?.url) {
      return buildCtaUrl(primaryType, ctaConfig[primaryType].url);
    }
    // 4. Fallback — anchor to contact section
    return "#contact";
  }

  const ctaHref = resolveCtaHref();
  const heroCtaLabel = content.heroCtaLabel?.trim() || content.heroCta?.trim() || "Agendar conversa";
  const heroImageUrl = payload.heroImage?.trim() || "";

  // Save header CTA label in theme so SiteShell can use it
  (themeSettings as Record<string, unknown>).headerCtaLabel = heroCtaLabel;
  await admin
    .from("sites")
    .update({ theme_settings: themeSettings })
    .eq("id", site.id);

  const sectionInserts = [
    {
      page_id: page.id,
      type: "hero",
      variant: mapHeroVariant(payload.heroStyle),
      order: 1,
      content: {
        eyebrow: content.heroEyebrow?.trim() || (city ? `${segment} em ${city}` : segment),
        title: content.heroTitle?.trim() || `${businessName}: cuidado profissional para ${audience}`,
        subtitle: content.heroSubtitle?.trim() ||
          payload.businessHighlights?.trim() ||
          "Atendimento personalizado com foco em resultado e acolhimento.",
        ctaLabel: heroCtaLabel,
        ctaHref,
        imageUrl: heroImageUrl,
      },
    },
    {
      page_id: page.id,
      type: "services",
      variant: mapServicesVariant(payload.servicesStyle),
      order: 2,
      content: {
        title: content.servicesTitle?.trim() || "Como posso ajudar",
        items: toItems(content.servicesItems?.trim() || payload.businessHighlights || ""),
      },
    },
    {
      page_id: page.id,
      type: "cta",
      variant: mapCtaVariant(payload.ctaStyle),
      order: 3,
      content: {
        title: content.ctaTitle?.trim() || "Vamos conversar?",
        description: content.ctaDescription?.trim() || "Me chame para entender seu momento e definir proximos passos.",
        buttonLabel: content.ctaButtonLabel?.trim() || "Entrar em contato",
        buttonHref: ctaHref,
        secondaryLabel: content.ctaSecondaryLabel?.trim() || "",
        secondaryHref: content.ctaSecondaryUrl?.trim() || "",
      },
    },
    {
      page_id: page.id,
      type: "about",
      variant: "default",
      order: 4,
      content: {
        title: content.aboutTitle?.trim() || `Sobre ${businessName}`,
        body:
          content.aboutBody?.trim() ||
          `${businessName} — ${segment}${city ? ` em ${city}` : ""}. Atendimento personalizado com foco em resultado e acolhimento.`,
      },
    },
    {
      page_id: page.id,
      type: "contact",
      variant: "default",
      order: 5,
      content: {
        title: content.contactTitle?.trim() || "Contato",
        subtitle:
          content.contactSubtitle?.trim() || "Entre em contato comigo",
        whatsappUrl: whatsappUrl || (ctaHref.startsWith("https://wa.me/") ? ctaHref : ""),
        whatsappLabel: content.ctaButtonLabel?.trim() || "Falar no WhatsApp",
        secondaryUrl: content.email?.trim() ? `mailto:${content.email.trim()}` : (content.ctaSecondaryUrl?.trim() || ""),
        secondaryLabel: content.email?.trim() ? "Enviar email" : (content.ctaSecondaryLabel?.trim() || ""),
        submitLabel: "Enviar",
      },
    },
  ];

  const { error: sectionsError } = await admin.from("sections").insert(sectionInserts);
  if (sectionsError) {
    return NextResponse.json(
      { error: "Rascunho criado parcialmente (falha em sections).", details: sectionsError.message },
      { status: 500 },
    );
  }

  return NextResponse.json({
    ok: true,
    siteId: site.id,
    domain,
    draftUrl: buildPublicUrl(domain, hostHeader),
  });
}
