import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { isReservedSubdomain } from "@/lib/tenant/host";

const SUBDOMAIN_REGEX = /^[a-z0-9-]{3,30}$/;

type OnboardingDraftPayload = {
  siteStyle: string;
  paletteId?: string;
  customColors?: {
    primary?: string;
    accent?: string;
    background?: string;
    text?: string;
  };
  headerStyle: string;
  heroStyle: string;
  servicesStyle: string;
  ctaStyle: string;
  motionStyle?: string;
  addonsSelected: string[];
  businessName: string;
  businessSegment: string;
  businessCity: string;
  businessHighlights: string;
  targetAudience: string;
  preferredSubdomain: string;
};

function normalizeSubdomain(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function resolveRootDomain(hostHeader: string): string {
  const configured =
    process.env.PLATFORM_ROOT_DOMAIN ??
    process.env.NEXT_PUBLIC_PLATFORM_ROOT_DOMAIN ??
    "";

  if (configured) {
    return configured.toLowerCase().trim();
  }

  if (hostHeader.includes("localtest.me")) {
    return "localtest.me";
  }

  return "localtest.me";
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
  if (input === "hero-split") return "split";
  if (input === "hero-centered") return "centered";
  return "default";
}

function mapServicesVariant(input: string): string {
  if (input === "services-list" || input === "services-steps") return "minimal";
  return "default";
}

function mapCtaVariant(input: string): string {
  if (input === "cta-banner") return "banner";
  return "default";
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
  const rootDomain = resolveRootDomain(hostHeader);
  const domain = `${preferredSubdomain}.${rootDomain}`;

  const { data: existingSite } = await admin
    .from("sites")
    .select("id")
    .eq("domain", domain)
    .maybeSingle();

  if (existingSite) {
    return NextResponse.json(
      { error: "Esse subdominio ja esta em uso. Escolha outro." },
      { status: 409 },
    );
  }

  const themeSettings = {
    ...themeBySiteStyle(payload.siteStyle),
    ...resolvePalette(payload),
    siteStyle: payload.siteStyle,
    paletteId: payload.paletteId ?? "buildsphere",
    headerStyle: payload.headerStyle,
    motionStyle: payload.motionStyle ?? "motion-reveal",
    addons: payload.addonsSelected ?? [],
    onboardingDraft: true,
  };

  const { data: site, error: siteError } = await admin
    .from("sites")
    .insert({
      name: businessName,
      domain,
      plan: "landing",
      theme_settings: themeSettings,
    })
    .select("id,name,domain")
    .single();

  if (siteError || !site) {
    return NextResponse.json(
      { error: "Falha ao criar rascunho do site.", details: siteError?.message },
      { status: 500 },
    );
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

  const sectionInserts = [
    {
      page_id: page.id,
      type: "hero",
      variant: mapHeroVariant(payload.heroStyle),
      order: 1,
      content: {
        eyebrow: city ? `${segment} em ${city}` : segment,
        title: `${businessName}: cuidado profissional para ${audience}`,
        subtitle:
          payload.businessHighlights?.trim() ||
          "Atendimento personalizado com foco em resultado e acolhimento.",
        ctaLabel: "Agendar conversa",
        ctaHref: "#cta",
      },
    },
    {
      page_id: page.id,
      type: "services",
      variant: mapServicesVariant(payload.servicesStyle),
      order: 2,
      content: {
        title: "Como posso ajudar",
        items: toItems(payload.businessHighlights ?? ""),
      },
    },
    {
      page_id: page.id,
      type: "cta",
      variant: mapCtaVariant(payload.ctaStyle),
      order: 3,
      content: {
        title: "Vamos conversar?",
        description: "Me chame no WhatsApp para entender seu momento e definir proximos passos.",
        buttonLabel: "Falar no WhatsApp",
        buttonHref: "https://wa.me/5511999999999",
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
