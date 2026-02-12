"use client";

import { useMemo, useState } from "react";

type Option = {
  id: string;
  name: string;
  description: string;
  vibe: string;
};

type Addon = {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
};

type Palette = {
  id: string;
  name: string;
  primary: string;
  accent: string;
  background: string;
  text: string;
};

type CustomPaletteColors = {
  primary: string;
  accent: string;
  background: string;
  text: string;
};

type Step = 0 | 1 | 2 | 3;
type SubmitState = "idle" | "submitting" | "success" | "error";
type CheckoutState = "idle" | "submitting" | "success" | "error";
type CreationMode = "template" | "builder" | "builder-premium";
type OptionStatus = "included" | "premium" | "blocked";

const BASE_MONTHLY_PRICE = 59.9;
const FULL_PREMIUM_PRICE = 49.9;
const PREMIUM_STYLE_ADDON_ID = "premium-design";

const creationModes: Array<{
  id: CreationMode;
  title: string;
  shortLabel: string;
  description: string;
  priceLabel: string;
  highlights: string[];
  badge?: string;
}> = [
  {
    id: "template",
    title: "A) Estilos Prontos",
    shortLabel: "Estilo pronto",
    description: "Fluxo rapido com layouts bem resolvidos. Voce personaliza conteudo, paleta e identidade basica.",
    priceLabel: "R$ 59,90/mes",
    highlights: ["Fluxo mais rapido", "Layout guiado", "Sem complexidade"],
  },
  {
    id: "builder",
    title: "B) Modo Construtor",
    shortLabel: "Construtor",
    description: "Mais liberdade visual com personalizacao por secao e recursos premium avulsos.",
    priceLabel: "R$ 59,90/mes + premium avulso",
    highlights: ["Mais controle visual", "Recursos premium sob demanda", "Ideal para personalizar sem exagero"],
  },
  {
    id: "builder-premium",
    title: "C) Construtor + Premium Full",
    shortLabel: "Premium full",
    description: "Tudo liberado no construtor, sem cobrar recurso premium separado durante a montagem.",
    priceLabel: "R$ 109,80/mes",
    highlights: ["Tudo destravado", "Sem microcobranca por recurso", "Melhor para crescimento"],
    badge: "Melhor custo-beneficio",
  },
];

const onboardingSteps = [
  { label: "Estilo", subtitle: "Modo, template e paleta" },
  { label: "Construcao", subtitle: "Estrutura visual do site" },
  { label: "Negocio", subtitle: "Conteudo, dominio e recursos" },
  { label: "Resumo", subtitle: "Cadastro e validacao final" },
] as const;

const siteStyles: Option[] = [
  { id: "minimal-clean", name: "Minimal Clean", description: "Limpo, leve e focado em clareza.", vibe: "Aereo" },
  { id: "soft-human", name: "Soft Human", description: "Acolhedor para saude e consultoria.", vibe: "Empatico" },
  { id: "editorial", name: "Editorial Premium", description: "Visual elegante com credibilidade.", vibe: "Luxo" },
  { id: "tech-modern", name: "Tech Modern", description: "Impacto digital e energia tech.", vibe: "Inovador" },
  { id: "bold-contrast", name: "Bold Contrast", description: "Tipografia forte e secoes marcantes.", vibe: "Atitude" },
  { id: "organic-warm", name: "Organic Warm", description: "Tons quentes e proximidade humana.", vibe: "Calor" },
];

const palettes: Palette[] = [
  { id: "buildsphere", name: "BuildSphere", primary: "#3B82F6", accent: "#22D3EE", background: "#0B1020", text: "#EAF0FF" },
  { id: "midnight-violet", name: "Midnight Violet", primary: "#7C5CFF", accent: "#38BDF8", background: "#111827", text: "#EEF2FF" },
  { id: "aurora-soft", name: "Aurora Soft", primary: "#2563EB", accent: "#A78BFA", background: "#F8FAFC", text: "#0F172A" },
  { id: "warm-premium", name: "Warm Premium", primary: "#C2410C", accent: "#FB7185", background: "#1C1917", text: "#FFF7ED" },
  { id: "forest-trust", name: "Forest Trust", primary: "#15803D", accent: "#22C55E", background: "#0F172A", text: "#ECFDF5" },
  { id: "mono-pro", name: "Mono Pro", primary: "#111827", accent: "#52525B", background: "#FAFAFA", text: "#09090B" },
  { id: "solar-pop", name: "Solar Pop", primary: "#F59E0B", accent: "#F97316", background: "#111827", text: "#FFFBEB" },
  { id: "mint-cloud", name: "Mint Cloud", primary: "#0D9488", accent: "#14B8A6", background: "#F0FDFA", text: "#134E4A" },
  { id: "rose-luxe", name: "Rose Luxe", primary: "#E11D48", accent: "#FB7185", background: "#1F1022", text: "#FFE4E6" },
  { id: "ocean-deep", name: "Ocean Deep", primary: "#0EA5E9", accent: "#06B6D4", background: "#082F49", text: "#E0F2FE" },
  { id: "custom", name: "Personalizar", primary: "#3B82F6", accent: "#22D3EE", background: "#0B1020", text: "#EAF0FF" },
];

const sectionStyles = {
  header: [
    { id: "header-center", name: "Centro", description: "Logo central e CTA direto.", vibe: "Balanceado" },
    { id: "header-split", name: "Split", description: "Menu a esquerda e CTA a direita.", vibe: "Comercial" },
    { id: "header-glass", name: "Glass", description: "Topo transparente com blur.", vibe: "Premium" },
    { id: "header-solid", name: "Solid", description: "Barra solida e objetiva.", vibe: "Institucional" },
  ],
  hero: [
    { id: "hero-centered", name: "Centered", description: "Titulo central com CTA forte.", vibe: "Direto" },
    { id: "hero-split", name: "Split", description: "Texto e imagem lado a lado.", vibe: "Equilibrado" },
    { id: "hero-card", name: "Card", description: "Hero com bloco destacado.", vibe: "Moderno" },
    { id: "hero-minimal", name: "Minimal", description: "Visual clean e sem excesso.", vibe: "Leve" },
  ],
  services: [
    { id: "services-grid", name: "Grid", description: "Cards organizados em grade.", vibe: "Escalavel" },
    { id: "services-list", name: "Lista", description: "Lista vertical com icones.", vibe: "Didatico" },
    { id: "services-columns", name: "Colunas", description: "Comparativo em colunas.", vibe: "Estruturado" },
    { id: "services-steps", name: "Steps", description: "Jornada em etapas.", vibe: "Processo" },
  ],
  cta: [
    { id: "cta-banner", name: "Banner", description: "Faixa de conversao em destaque.", vibe: "Conversao" },
    { id: "cta-card", name: "Card", description: "CTA compacto e objetivo.", vibe: "Sutil" },
    { id: "cta-double", name: "Duplo", description: "WhatsApp e formulario juntos.", vibe: "Completo" },
    { id: "cta-floating", name: "Flutuante", description: "Bloco com visual premium.", vibe: "Sofisticado" },
  ],
} as const;

const premiumOptionIds = {
  header: ["header-glass", "header-solid"],
  hero: ["hero-card", "hero-split"],
  services: ["services-columns", "services-steps"],
  cta: ["cta-double", "cta-floating"],
  motion: ["motion-parallax", "motion-vivid"],
} as const;

const motionStyles: Option[] = [
  { id: "motion-none", name: "Sem animacao", description: "Transicoes minimas, foco em sobriedade.", vibe: "A" },
  { id: "motion-reveal", name: "Reveal suave", description: "Elementos surgem com suavidade no scroll.", vibe: "B" },
  { id: "motion-parallax", name: "Parallax leve", description: "Profundidade sutil com camadas.", vibe: "C" },
  { id: "motion-vivid", name: "Vivo premium", description: "Microinteracoes, glow e destaque ativo.", vibe: "D" },
];

const addons: Addon[] = [
  { id: "premium-design", name: "Design premium", description: "Desbloqueia layouts e efeitos visuais premium.", monthlyPrice: 19.9 },
  { id: "extra-section", name: "Secao extra", description: "Uma secao adicional customizavel.", monthlyPrice: 9.9 },
  { id: "blog", name: "Blog", description: "Estrutura de posts com SEO basico.", monthlyPrice: 29.9 },
  { id: "lead-capture", name: "Captura de leads", description: "Formulario com painel de mensagens.", monthlyPrice: 19.9 },
  { id: "appointments", name: "Agendamento", description: "Fluxo de solicitacao de sessoes.", monthlyPrice: 29.9 },
  { id: "members-area", name: "Area logada", description: "Conteudo protegido para clientes.", monthlyPrice: 49.9 },
];

function normalizeSubdomain(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function isHexColor(value: string): boolean {
  return /^#[0-9a-fA-F]{6}$/.test(value);
}

function hexToRgb(hex: string) {
  const normalized = hex.replace("#", "");
  if (normalized.length !== 6) {
    return { r: 11, g: 16, b: 32 };
  }

  const r = Number.parseInt(normalized.slice(0, 2), 16);
  const g = Number.parseInt(normalized.slice(2, 4), 16);
  const b = Number.parseInt(normalized.slice(4, 6), 16);
  return { r, g, b };
}

function getReadableText(backgroundHex: string) {
  const { r, g, b } = hexToRgb(backgroundHex);
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;

  if (luminance > 0.62) {
    return {
      primary: "#0B1020",
      muted: "rgba(11,16,32,0.74)",
      border: "rgba(11,16,32,0.18)",
    };
  }

  return {
    primary: "#EAF0FF",
    muted: "rgba(234,240,255,0.78)",
    border: "rgba(234,240,255,0.16)",
  };
}

function getSitePreviewFlavor(styleId: string) {
  switch (styleId) {
    case "editorial":
      return {
        pageClass: "rounded-[1.4rem] border border-white/20 bg-[#161321]",
        sectionClass: "rounded-md border border-white/15 bg-white/[0.03]",
        textClass: "font-serif tracking-[0.012em]",
        headerType: "solid",
        heroLayout: "editorial",
        servicesLayout: "list",
        ctaTone: "outline",
      };
    case "tech-modern":
      return {
        pageClass: "rounded-[1.4rem] border border-cyan-300/30 bg-[linear-gradient(160deg,#0B1020,#1D1D45)]",
        sectionClass: "rounded-lg border border-cyan-300/20 bg-cyan-400/[0.05]",
        textClass: "tracking-[0.01em]",
        headerType: "glass",
        heroLayout: "split",
        servicesLayout: "grid",
        ctaTone: "gradient",
      };
    case "bold-contrast":
      return {
        pageClass: "rounded-none border-2 border-white/45 bg-black",
        sectionClass: "rounded-none border-2 border-white/35 bg-black",
        textClass: "font-semibold uppercase tracking-[0.08em]",
        headerType: "solid",
        heroLayout: "card",
        servicesLayout: "steps",
        ctaTone: "contrast",
      };
    case "organic-warm":
      return {
        pageClass: "rounded-[1.4rem] border border-orange-200/25 bg-[linear-gradient(160deg,#2C1915,#3A241D)]",
        sectionClass: "rounded-2xl border border-orange-200/20 bg-orange-500/[0.09]",
        textClass: "",
        headerType: "center",
        heroLayout: "image-bg",
        servicesLayout: "cards",
        ctaTone: "soft",
      };
    case "soft-human":
      return {
        pageClass: "rounded-[1.4rem] border border-amber-200/25 bg-[#2A1A2F]",
        sectionClass: "rounded-2xl border border-amber-200/15 bg-amber-300/[0.06]",
        textClass: "",
        headerType: "floating",
        heroLayout: "centered",
        servicesLayout: "cards",
        ctaTone: "soft",
      };
    default:
      return {
        pageClass: "rounded-[1.4rem] border border-slate-300/45 bg-[#F8FAFC]",
        sectionClass: "rounded-xl border border-slate-300/45 bg-white",
        textClass: "",
        headerType: "split",
        heroLayout: "minimal",
        servicesLayout: "grid",
        ctaTone: "minimal",
      };
  }
}

function buildOptionStatuses(
  options: readonly Option[],
  premiumOptionIds: readonly string[],
  mode: CreationMode,
  isPremiumStylesUnlocked: boolean,
): Record<string, OptionStatus> {
  const statusEntries = options.map<[string, OptionStatus]>((option) => {
    if (!premiumOptionIds.includes(option.id)) {
      return [option.id, "included"];
    }

    if (mode === "builder-premium") {
      return [option.id, "included"];
    }

    if (mode === "builder") {
      return [option.id, isPremiumStylesUnlocked ? "included" : "premium"];
    }

    return [option.id, "blocked"];
  });

  return Object.fromEntries(statusEntries);
}

function getOptionStatusLabel(status: OptionStatus): { label: string; className: string } {
  if (status === "blocked") {
    return {
      label: "Bloqueado",
      className: "border-rose-300/40 bg-rose-500/15 text-rose-200",
    };
  }

  if (status === "premium") {
    return {
      label: "Premium +R$",
      className: "border-amber-300/35 bg-amber-500/15 text-amber-100",
    };
  }

  return {
    label: "Incluido",
    className: "border-emerald-300/35 bg-emerald-500/15 text-emerald-100",
  };
}

function OptionGrid({
  title,
  options,
  value,
  onChange,
  statuses,
}: {
  title: string;
  options: readonly Option[];
  value: string;
  onChange: (id: string) => void;
  statuses?: Record<string, OptionStatus>;
}) {
  function renderOptionThumb(optionId: string) {
    if (optionId === "minimal-clean") {
      return (
        <div className="mb-2 h-16 rounded-lg border border-white/10 bg-[#F8FAFC] p-2">
          <div className="h-1.5 w-16 rounded bg-slate-300" />
          <div className="mt-2 h-6 rounded bg-slate-200" />
          <div className="mt-1 h-1.5 w-20 rounded bg-slate-300" />
        </div>
      );
    }
    if (optionId === "soft-human") {
      return (
        <div className="mb-2 h-16 rounded-lg border border-white/10 bg-[#FFF7ED] p-2">
          <div className="h-1.5 w-12 rounded bg-orange-300" />
          <div className="mt-2 grid grid-cols-2 gap-1">
            <div className="h-6 rounded bg-orange-100" />
            <div className="h-6 rounded bg-amber-100" />
          </div>
        </div>
      );
    }
    if (optionId === "editorial") {
      return (
        <div className="mb-2 h-16 rounded-lg border border-white/10 bg-[#111827] p-2">
          <div className="h-1.5 w-14 rounded bg-violet-300/70" />
          <div className="mt-2 h-6 rounded border border-white/20 bg-white/5" />
          <div className="mt-1 h-1.5 w-24 rounded bg-white/35" />
        </div>
      );
    }
    if (optionId === "tech-modern") {
      return (
        <div className="mb-2 h-16 rounded-lg border border-cyan-300/30 bg-[linear-gradient(135deg,#0B1020,#1D1D45)] p-2">
          <div className="h-1.5 w-16 rounded bg-cyan-300/70" />
          <div className="mt-2 h-6 rounded bg-[linear-gradient(135deg,#3B82F6,#7C5CFF,#22D3EE)]" />
          <div className="mt-1 h-1.5 w-20 rounded bg-cyan-200/70" />
        </div>
      );
    }
    if (optionId === "bold-contrast") {
      return (
        <div className="mb-2 h-16 rounded-lg border border-white/10 bg-black p-2">
          <div className="h-1.5 w-16 rounded bg-white/80" />
          <div className="mt-2 grid grid-cols-2 gap-1">
            <div className="h-6 rounded bg-white" />
            <div className="h-6 rounded bg-[#22D3EE]" />
          </div>
        </div>
      );
    }
    if (optionId === "organic-warm") {
      return (
        <div className="mb-2 h-16 rounded-lg border border-white/10 bg-[#2C1915] p-2">
          <div className="h-1.5 w-16 rounded bg-rose-300/70" />
          <div className="mt-2 h-6 rounded bg-gradient-to-r from-orange-400 to-pink-400" />
          <div className="mt-1 h-1.5 w-20 rounded bg-orange-200/70" />
        </div>
      );
    }

    return (
      <div className="mb-2 h-16 rounded-lg border border-white/10 bg-[linear-gradient(135deg,rgba(59,130,246,0.25),rgba(124,92,255,0.2),rgba(34,211,238,0.15))]" />
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-[#12182B] p-4 animate-fade-up">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#22D3EE]">{title}</p>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        {options.map((option) => {
          const isActive = value === option.id;
          const status = statuses?.[option.id] ?? "included";
          const statusBadge = getOptionStatusLabel(status);
          const isSelectable = status === "included";
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => {
                if (!isSelectable) {
                  return;
                }
                onChange(option.id);
              }}
              disabled={!isSelectable}
              className={`group relative overflow-hidden rounded-xl border p-3 text-left transition duration-300 hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(34,211,238,0.16)] ${
                isActive
                  ? "border-[#22D3EE]/75 bg-[linear-gradient(135deg,rgba(59,130,246,0.3),rgba(124,92,255,0.22),rgba(34,211,238,0.2))]"
                  : "border-white/10 bg-white/[0.02] hover:border-[#22D3EE]/45 hover:bg-white/[0.05]"
              } ${!isSelectable ? "cursor-not-allowed opacity-70 hover:translate-y-0 hover:shadow-none" : ""}`}
            >
              <div className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100" style={{ background: "radial-gradient(circle at 10% 0%, rgba(34,211,238,0.14), transparent 55%)" }} />
              <span className={`absolute left-2 top-2 rounded-full border px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] ${statusBadge.className}`}>
                {statusBadge.label}
              </span>
              <span
                className={`absolute right-2 top-2 inline-flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold ${
                  isActive ? "bg-[#22D3EE] text-[#041822]" : "bg-white/10 text-[var(--platform-text)]/50"
                }`}
              >
                {isActive ? "✓" : "+"}
              </span>
              {renderOptionThumb(option.id)}
              <p className="text-sm font-semibold text-[var(--platform-text)]">{option.name}</p>
              <p className="mt-1 text-xs text-[var(--platform-text)]/70">{option.description}</p>
              <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#22D3EE]/90">
                {option.vibe}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function PalettePicker({
  value,
  onChange,
  customColors,
  onChangeCustomColor,
}: {
  value: string;
  onChange: (id: string) => void;
  customColors: CustomPaletteColors;
  onChangeCustomColor: (key: keyof CustomPaletteColors, value: string) => void;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#12182B] p-4 animate-fade-up">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#22D3EE]">Paleta de cores</p>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        {palettes.map((palette) => {
          const isActive = value === palette.id;
          return (
            <button
              key={palette.id}
              type="button"
              onClick={() => onChange(palette.id)}
              className={`rounded-xl border p-3 text-left transition duration-300 hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(34,211,238,0.16)] ${
                isActive
                  ? "border-[#22D3EE]/75 bg-[#22D3EE]/12"
                  : "border-white/10 bg-white/[0.02] hover:border-[#22D3EE]/45 hover:bg-white/[0.05]"
              }`}
            >
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-semibold text-[var(--platform-text)]">{palette.name}</p>
                <span
                  className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold ${
                    isActive ? "bg-[#22D3EE] text-[#041822]" : "bg-white/10 text-[var(--platform-text)]/50"
                  }`}
                >
                  {isActive ? "✓" : "+"}
                </span>
              </div>
              <div className="mb-2 flex gap-1">
                {[palette.background, palette.primary, palette.accent, palette.text].map((color) => (
                  <span key={color} className="h-6 flex-1 rounded-md border border-white/10" style={{ backgroundColor: color }} />
                ))}
              </div>
            </button>
          );
        })}
      </div>
      {value === "custom" ? (
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {(
            [
              ["primary", "Cor principal"],
              ["accent", "Destaque"],
              ["background", "Fundo"],
              ["text", "Texto"],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--platform-text)]/70">
              {label}
              <div className="mt-1 flex items-center gap-2">
                <input
                  type="color"
                  value={customColors[key]}
                  onChange={(event) => onChangeCustomColor(key, event.target.value)}
                  className="h-9 w-12 cursor-pointer rounded border border-white/15 bg-transparent p-0"
                />
                <input
                  value={customColors[key]}
                  onChange={(event) => {
                    const next = event.target.value;
                    if (next.length <= 7) {
                      onChangeCustomColor(key, next);
                    }
                  }}
                  className="w-full rounded-lg border border-white/15 bg-[#0B1020] px-2 py-2 text-xs text-[var(--platform-text)] outline-none focus:border-[#22D3EE]"
                />
              </div>
            </label>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function OnboardingWizard() {
  const [step, setStep] = useState<Step>(0);
  const [creationMode, setCreationMode] = useState<CreationMode | null>(null);
  const [modeConfirmed, setModeConfirmed] = useState(false);
  const [siteStyle, setSiteStyle] = useState<string>(siteStyles[0].id);
  const [paletteId, setPaletteId] = useState<string>(palettes[0].id);
  const [customColors, setCustomColors] = useState<CustomPaletteColors>({
    primary: "#3B82F6",
    accent: "#22D3EE",
    background: "#0B1020",
    text: "#EAF0FF",
  });
  const [headerStyle, setHeaderStyle] = useState<string>(sectionStyles.header[0].id);
  const [heroStyle, setHeroStyle] = useState<string>(sectionStyles.hero[0].id);
  const [servicesStyle, setServicesStyle] = useState<string>(sectionStyles.services[0].id);
  const [ctaStyle, setCtaStyle] = useState<string>(sectionStyles.cta[0].id);
  const [motionStyle, setMotionStyle] = useState<string>(motionStyles[1].id);
  const [addonsSelected, setAddonsSelected] = useState<string[]>([]);

  const [businessName, setBusinessName] = useState("");
  const [businessSegment, setBusinessSegment] = useState("");
  const [businessCity, setBusinessCity] = useState("");
  const [businessHighlights, setBusinessHighlights] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [preferredSubdomain, setPreferredSubdomain] = useState("");

  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [submitMessage, setSubmitMessage] = useState("");
  const [draftUrl, setDraftUrl] = useState("");
  const [draftSiteId, setDraftSiteId] = useState<string>("");
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
  const [checkoutState, setCheckoutState] = useState<CheckoutState>("idle");
  const [checkoutMessage, setCheckoutMessage] = useState("");
  const [checkoutUrl, setCheckoutUrl] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [ownerDocument, setOwnerDocument] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [ownerPassword, setOwnerPassword] = useState("");
  const [ownerPasswordConfirm, setOwnerPasswordConfirm] = useState("");

  const selectedPalette = useMemo(() => {
    if (paletteId === "custom") {
      return {
        id: "custom",
        name: "Personalizado",
        primary: isHexColor(customColors.primary) ? customColors.primary : "#3B82F6",
        accent: isHexColor(customColors.accent) ? customColors.accent : "#22D3EE",
        background: isHexColor(customColors.background) ? customColors.background : "#0B1020",
        text: isHexColor(customColors.text) ? customColors.text : "#EAF0FF",
      };
    }

    return palettes.find((palette) => palette.id === paletteId) ?? palettes[0];
  }, [paletteId, customColors]);
  const selectedMode: CreationMode = creationMode ?? "template";
  const premiumStylesUnlocked = useMemo(
    () => selectedMode === "builder-premium" || addonsSelected.includes(PREMIUM_STYLE_ADDON_ID),
    [addonsSelected, selectedMode],
  );

  const addonsTotal = useMemo(
    () =>
      addons
        .filter((addon) => addonsSelected.includes(addon.id))
        .reduce((acc, addon) => acc + addon.monthlyPrice, 0),
    [addonsSelected],
  );
  const allPremiumAddonsTotal = useMemo(
    () => addons.reduce((acc, addon) => acc + addon.monthlyPrice, 0),
    [],
  );
  const premiumPotentialSavings = useMemo(
    () => Math.max(0, allPremiumAddonsTotal - FULL_PREMIUM_PRICE),
    [allPremiumAddonsTotal],
  );

  const monthlyTotal = useMemo(() => {
    if (selectedMode === "builder-premium") {
      return BASE_MONTHLY_PRICE + FULL_PREMIUM_PRICE;
    }
    if (selectedMode === "builder") {
      return BASE_MONTHLY_PRICE + addonsTotal;
    }
    return BASE_MONTHLY_PRICE;
  }, [addonsTotal, selectedMode]);

  const effectiveAddonsSelected = useMemo(() => {
    if (selectedMode === "builder-premium") {
      return addons.map((addon) => addon.id);
    }
    if (selectedMode === "builder") {
      return addonsSelected;
    }
    return [];
  }, [addonsSelected, selectedMode]);

  const previewFlavor = useMemo(() => getSitePreviewFlavor(siteStyle), [siteStyle]);
  const previewText = useMemo(() => {
    const backgroundReference = siteStyle === "minimal-clean" ? "#F8FAFC" : selectedPalette.background;
    return getReadableText(backgroundReference);
  }, [selectedPalette.background, siteStyle]);
  const solidHeaderText = useMemo(() => getReadableText(selectedPalette.primary).primary, [selectedPalette.primary]);
  const ctaTextColor = useMemo(() => getReadableText(selectedPalette.primary).primary, [selectedPalette.primary]);
  const headerOptionStatuses = useMemo(
    () => buildOptionStatuses(sectionStyles.header, premiumOptionIds.header, selectedMode, premiumStylesUnlocked),
    [premiumStylesUnlocked, selectedMode],
  );
  const heroOptionStatuses = useMemo(
    () => buildOptionStatuses(sectionStyles.hero, premiumOptionIds.hero, selectedMode, premiumStylesUnlocked),
    [premiumStylesUnlocked, selectedMode],
  );
  const servicesOptionStatuses = useMemo(
    () => buildOptionStatuses(sectionStyles.services, premiumOptionIds.services, selectedMode, premiumStylesUnlocked),
    [premiumStylesUnlocked, selectedMode],
  );
  const ctaOptionStatuses = useMemo(
    () => buildOptionStatuses(sectionStyles.cta, premiumOptionIds.cta, selectedMode, premiumStylesUnlocked),
    [premiumStylesUnlocked, selectedMode],
  );
  const motionOptionStatuses = useMemo(
    () => buildOptionStatuses(motionStyles, premiumOptionIds.motion, selectedMode, premiumStylesUnlocked),
    [premiumStylesUnlocked, selectedMode],
  );
  const safeHeaderStyle = headerOptionStatuses[headerStyle] === "included" ? headerStyle : sectionStyles.header[0].id;
  const safeHeroStyle = heroOptionStatuses[heroStyle] === "included" ? heroStyle : sectionStyles.hero[0].id;
  const safeServicesStyle =
    servicesOptionStatuses[servicesStyle] === "included" ? servicesStyle : sectionStyles.services[0].id;
  const safeCtaStyle = ctaOptionStatuses[ctaStyle] === "included" ? ctaStyle : sectionStyles.cta[0].id;
  const safeMotionStyle = motionOptionStatuses[motionStyle] === "included" ? motionStyle : motionStyles[0].id;

  const canMoveToSummary =
    businessName.trim().length > 1 &&
    businessSegment.trim().length > 1 &&
    normalizeSubdomain(preferredSubdomain).length >= 3;
  const progressPercent = ((step + 1) / 4) * 100;
  const hasDraft = draftSiteId.length > 0;
  const normalizedDocument = ownerDocument.replace(/\D/g, "");
  const isStrongPassword =
    ownerPassword.length >= 10 &&
    /[a-z]/.test(ownerPassword) &&
    /[A-Z]/.test(ownerPassword) &&
    /\d/.test(ownerPassword) &&
    /[^A-Za-z0-9]/.test(ownerPassword);
  const canStartCheckout =
    hasDraft &&
    ownerName.trim().length >= 3 &&
    (normalizedDocument.length === 11 || normalizedDocument.length === 14) &&
    ownerEmail.includes("@") &&
    isStrongPassword &&
    ownerPassword === ownerPasswordConfirm;

  function toggleAddon(addonId: string) {
    if (selectedMode !== "builder") {
      return;
    }
    setAddonsSelected((current) =>
      current.includes(addonId) ? current.filter((id) => id !== addonId) : [...current, addonId],
    );
  }

  async function createDraftTenant() {
    setSubmitState("submitting");
    setSubmitMessage("");
    setDraftUrl("");

    const response = await fetch("/api/onboarding/draft", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        creationMode: selectedMode,
        siteStyle,
        paletteId,
        customColors: paletteId === "custom" ? selectedPalette : undefined,
        headerStyle: safeHeaderStyle,
        heroStyle: safeHeroStyle,
        servicesStyle: safeServicesStyle,
        ctaStyle: safeCtaStyle,
        motionStyle: safeMotionStyle,
        addonsSelected: effectiveAddonsSelected,
        businessName,
        businessSegment,
        businessCity,
        businessHighlights,
        targetAudience,
        preferredSubdomain,
      }),
    });

    const payload = (await response.json().catch(() => null)) as
      | { ok?: boolean; siteId?: string; draftUrl?: string; error?: string; details?: string }
      | null;

    if (!response.ok || !payload?.ok) {
      setSubmitState("error");
      setSubmitMessage(`${payload?.error ?? "Nao foi possivel criar rascunho."} ${payload?.details ?? ""}`.trim());
      return;
    }

    setSubmitState("success");
    setDraftUrl(payload.draftUrl ?? "");
    setDraftSiteId(payload.siteId ?? "");
    setSubmitMessage("Rascunho criado com sucesso. Voce ja pode visualizar o tenant gerado.");
  }

  async function startCheckout() {
    setCheckoutState("submitting");
    setCheckoutMessage("");
    setCheckoutUrl("");

    const response = await fetch("/api/onboarding/register-checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        siteId: draftSiteId,
        creationMode: selectedMode,
        fullName: ownerName,
        document: ownerDocument,
        email: ownerEmail,
        password: ownerPassword,
        addonsSelected: effectiveAddonsSelected,
      }),
    });

    const payload = (await response.json().catch(() => null)) as
      | { ok?: boolean; checkoutUrl?: string; error?: string; details?: string }
      | null;

    if (!response.ok || !payload?.ok || !payload.checkoutUrl) {
      setCheckoutState("error");
      setCheckoutMessage(`${payload?.error ?? "Nao foi possivel iniciar checkout."} ${payload?.details ?? ""}`.trim());
      return;
    }

    setCheckoutState("success");
    setCheckoutUrl(payload.checkoutUrl);
    setCheckoutMessage("Cadastro concluido. Redirecionando para o Stripe...");
    window.location.assign(payload.checkoutUrl);
  }

  function renderStepContent() {
    if (step === 0) {
      return (
        <div className="space-y-4 animate-fade-up" key="step-0">
          <section className="rounded-2xl border border-white/10 bg-[#12182B] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#22D3EE]">Modo selecionado</p>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#22D3EE]/35 bg-[#22D3EE]/10 px-3 py-3">
              <div>
                <p className="text-sm font-semibold text-[var(--platform-text)]">
                  {creationModes.find((mode) => mode.id === selectedMode)?.title}
                </p>
                <p className="text-xs text-[var(--platform-text)]/75">
                  {creationModes.find((mode) => mode.id === selectedMode)?.description}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setStep(0);
                  setModeConfirmed(false);
                }}
                className="rounded-lg border border-white/20 bg-white/[0.03] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--platform-text)] transition hover:bg-white/[0.08]"
              >
                Alterar modo
              </button>
            </div>
          </section>
          <OptionGrid title="Estilo geral do site" options={siteStyles} value={siteStyle} onChange={setSiteStyle} />
          <PalettePicker
            value={paletteId}
            onChange={setPaletteId}
            customColors={customColors}
            onChangeCustomColor={(key, value) =>
              setCustomColors((current) => ({ ...current, [key]: value }))
            }
          />
        </div>
      );
    }

    if (step === 1) {
      const isTemplateMode = selectedMode === "template";
      return (
        <div className="space-y-4 animate-fade-up" key="step-1">
          {isTemplateMode ? (
            <section className="rounded-2xl border border-white/10 bg-[#12182B] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#22D3EE]">Configuracao guiada</p>
              <p className="mt-2 text-sm text-[var(--platform-text)]/75">
                No modo de estilos prontos, voce tem uma configuracao mais rapida com mudancas essenciais de layout.
              </p>
            </section>
          ) : (
            <>
              <OptionGrid
                title="Estilo do header"
                options={sectionStyles.header}
                value={safeHeaderStyle}
                onChange={setHeaderStyle}
                statuses={headerOptionStatuses}
              />
              <OptionGrid
                title="Estilo do hero"
                options={sectionStyles.hero}
                value={safeHeroStyle}
                onChange={setHeroStyle}
                statuses={heroOptionStatuses}
              />
            </>
          )}
          <OptionGrid
            title="Estilo da secao de blocos"
            options={sectionStyles.services}
            value={safeServicesStyle}
            onChange={setServicesStyle}
            statuses={servicesOptionStatuses}
          />
          <OptionGrid
            title="Estilo de CTA"
            options={sectionStyles.cta}
            value={safeCtaStyle}
            onChange={setCtaStyle}
            statuses={ctaOptionStatuses}
          />
          {!isTemplateMode ? (
            <OptionGrid
              title="Movimento do site"
              options={motionStyles}
              value={safeMotionStyle}
              onChange={setMotionStyle}
              statuses={motionOptionStatuses}
            />
          ) : null}
          <section className="rounded-2xl border border-white/10 bg-[#12182B] px-4 py-3">
            <p className="text-[11px] text-[var(--platform-text)]/75">
              Legenda:
              <span className="mx-2 rounded-full border border-emerald-300/35 bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase text-emerald-100">Incluido</span>
              <span className="mx-2 rounded-full border border-amber-300/35 bg-amber-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase text-amber-100">Premium +R$</span>
              <span className="mx-2 rounded-full border border-rose-300/40 bg-rose-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase text-rose-200">Bloqueado</span>
            </p>
            {selectedMode === "builder" && !premiumStylesUnlocked ? (
              <p className="mt-2 text-xs text-[var(--platform-text)]/70">
                Para liberar opcoes premium de layout/efeitos no Modo Construtor, ative o recurso
                <strong> Design premium (+R$ 19,90/mes)</strong> na etapa de negocio.
              </p>
            ) : null}
          </section>
        </div>
      );
    }

    if (step === 2) {
      return (
        <section className="rounded-2xl border border-white/10 bg-[#12182B] p-4 animate-fade-up" key="step-2">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#22D3EE]">Dados do negocio</p>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <label className="text-sm text-[var(--platform-text)]/80">
              Nome do negocio
              <input value={businessName} onChange={(event) => setBusinessName(event.target.value)} className="mt-1 w-full rounded-xl border border-white/15 bg-[#0B1020] px-3 py-2 text-sm outline-none focus:border-[#22D3EE]" />
            </label>
            <label className="text-sm text-[var(--platform-text)]/80">
              Segmento
              <input value={businessSegment} onChange={(event) => setBusinessSegment(event.target.value)} className="mt-1 w-full rounded-xl border border-white/15 bg-[#0B1020] px-3 py-2 text-sm outline-none focus:border-[#22D3EE]" />
            </label>
            <label className="text-sm text-[var(--platform-text)]/80">
              Cidade/Regiao
              <input value={businessCity} onChange={(event) => setBusinessCity(event.target.value)} className="mt-1 w-full rounded-xl border border-white/15 bg-[#0B1020] px-3 py-2 text-sm outline-none focus:border-[#22D3EE]" />
            </label>
            <label className="text-sm text-[var(--platform-text)]/80">
              Publico alvo
              <input value={targetAudience} onChange={(event) => setTargetAudience(event.target.value)} className="mt-1 w-full rounded-xl border border-white/15 bg-[#0B1020] px-3 py-2 text-sm outline-none focus:border-[#22D3EE]" />
            </label>
            <label className="text-sm text-[var(--platform-text)]/80 md:col-span-2">
              Subdominio desejado
              <input value={preferredSubdomain} onChange={(event) => setPreferredSubdomain(normalizeSubdomain(event.target.value))} className="mt-1 w-full rounded-xl border border-white/15 bg-[#0B1020] px-3 py-2 text-sm outline-none focus:border-[#22D3EE]" />
            </label>
            <label className="text-sm text-[var(--platform-text)]/80 md:col-span-2">
              Servicos e diferenciais
              <textarea value={businessHighlights} onChange={(event) => setBusinessHighlights(event.target.value)} rows={4} className="mt-1 w-full rounded-xl border border-white/15 bg-[#0B1020] px-3 py-2 text-sm outline-none focus:border-[#22D3EE]" />
            </label>
          </div>

          <div className="mt-4 rounded-xl border border-white/10 bg-[#0B1020] p-3">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#22D3EE]">Recursos premium</p>
            {selectedMode === "template" ? (
              <p className="mt-2 text-xs text-[var(--platform-text)]/70">
                Recursos premium estao bloqueados no modo Estilos Prontos. Para liberar escolha
                {" "}&quot;Modo Construtor&quot; ou &quot;Construtor + Premium Full&quot;.
              </p>
            ) : (
              <div className="mt-3 grid gap-2 md:grid-cols-2">
                {addons.map((addon) => {
                  const isActive = addonsSelected.includes(addon.id);
                  const includedInPremium = selectedMode === "builder-premium";
                  return (
                    <button
                      key={addon.id}
                      type="button"
                      onClick={() => toggleAddon(addon.id)}
                      disabled={includedInPremium}
                      className={`rounded-xl border p-3 text-left transition ${
                        isActive || includedInPremium
                          ? "border-[#22D3EE]/65 bg-[#22D3EE]/10"
                          : "border-white/10 bg-white/[0.02] hover:border-white/25"
                      } ${includedInPremium ? "cursor-not-allowed opacity-85" : ""}`}
                    >
                      <p className="text-sm font-semibold text-[var(--platform-text)]">
                        {addon.name} - {includedInPremium ? "Incluido no Premium Full" : `+ R$ ${addon.monthlyPrice.toFixed(2)}/mes`}
                      </p>
                      <p className="mt-1 text-xs text-[var(--platform-text)]/70">{addon.description}</p>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      );
    }

    return (
      <section className="rounded-2xl border border-white/10 bg-[#12182B] p-4 animate-fade-up" key="step-3">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#22D3EE]">Resumo da configuracao</p>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-[#0B1020] p-3 text-sm text-[var(--platform-text)]/80">
            <p className="font-semibold text-[var(--platform-text)]">Visual</p>
            <p className="mt-2">Modo: {creationModes.find((mode) => mode.id === selectedMode)?.shortLabel}</p>
            <p className="mt-2">Estilo geral: {siteStyles.find((item) => item.id === siteStyle)?.name}</p>
            <p>Paleta: {selectedPalette.name}</p>
            <p>Header: {sectionStyles.header.find((item) => item.id === safeHeaderStyle)?.name}</p>
            <p>Hero: {sectionStyles.hero.find((item) => item.id === safeHeroStyle)?.name}</p>
            <p>Services: {sectionStyles.services.find((item) => item.id === safeServicesStyle)?.name}</p>
            <p>CTA: {sectionStyles.cta.find((item) => item.id === safeCtaStyle)?.name}</p>
            <p>Motion: {motionStyles.find((item) => item.id === safeMotionStyle)?.name}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-[#0B1020] p-3 text-sm text-[var(--platform-text)]/80">
            <p className="font-semibold text-[var(--platform-text)]">Negocio</p>
            <p className="mt-2">Nome: {businessName || "-"}</p>
            <p>Segmento: {businessSegment || "-"}</p>
            <p>Cidade: {businessCity || "-"}</p>
            <p>Publico: {targetAudience || "-"}</p>
            <p>Subdominio: {normalizeSubdomain(preferredSubdomain) || "-"}</p>
          </div>
        </div>

        <div className="mt-3 rounded-xl border border-white/10 bg-[linear-gradient(135deg,rgba(59,130,246,0.16),rgba(124,92,255,0.16),rgba(34,211,238,0.16))] p-4">
          <p className="text-sm text-[var(--platform-text)]/85">Plano base: R$ {BASE_MONTHLY_PRICE.toFixed(2)}/mes</p>
          <p className="text-sm text-[var(--platform-text)]/85">
            {selectedMode === "template"
              ? "Recursos premium: indisponiveis no modo Estilos Prontos"
              : selectedMode === "builder-premium"
              ? `Premium Full: R$ ${FULL_PREMIUM_PRICE.toFixed(2)}/mes`
              : `Recursos premium avulsos: R$ ${addonsTotal.toFixed(2)}/mes`}
          </p>
          <p className="mt-2 text-xl font-bold text-[var(--platform-text)]">Total mensal estimado: R$ {monthlyTotal.toFixed(2)}</p>
          <p className="mt-1 text-xs text-[var(--platform-text)]/70">Nesta etapa ja criamos um tenant de rascunho para validar o site gerado.</p>
        </div>

        {submitState !== "idle" ? (
          <div className={`mt-3 rounded-xl border px-3 py-2 text-sm ${submitState === "error" ? "border-red-300/40 bg-red-500/10 text-red-200" : "border-emerald-300/40 bg-emerald-500/10 text-emerald-200"}`}>
            {submitMessage}
            {draftUrl ? (
              <div className="mt-2">
                <a href={draftUrl} target="_blank" rel="noreferrer" className="inline-flex rounded-md border border-emerald-200/40 px-2 py-1 text-xs font-semibold uppercase tracking-[0.1em]">
                  Abrir site rascunho
                </a>
              </div>
            ) : null}
          </div>
        ) : null}

        <div className="mt-4 rounded-xl border border-white/10 bg-[#0B1020] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#22D3EE]">Cadastro + Checkout</p>
          <p className="mt-1 text-xs text-[var(--platform-text)]/70">
            Sem confirmacao de email no MVP. O usuario escolhe senha forte e segue direto para assinatura.
          </p>

          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <label className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--platform-text)]/65">
              Nome completo
              <input
                value={ownerName}
                onChange={(event) => setOwnerName(event.target.value)}
                className="mt-1 w-full rounded-lg border border-white/15 bg-[#12182B] px-3 py-2 text-sm normal-case tracking-normal text-[var(--platform-text)] outline-none focus:border-[#22D3EE]"
                placeholder="Nome do responsavel"
              />
            </label>
            <label className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--platform-text)]/65">
              CPF ou CNPJ
              <input
                value={ownerDocument}
                onChange={(event) => setOwnerDocument(event.target.value)}
                className="mt-1 w-full rounded-lg border border-white/15 bg-[#12182B] px-3 py-2 text-sm normal-case tracking-normal text-[var(--platform-text)] outline-none focus:border-[#22D3EE]"
                placeholder="000.000.000-00 ou 00.000.000/0001-00"
              />
            </label>
            <label className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--platform-text)]/65">
              E-mail de acesso
              <input
                type="email"
                value={ownerEmail}
                onChange={(event) => setOwnerEmail(event.target.value)}
                className="mt-1 w-full rounded-lg border border-white/15 bg-[#12182B] px-3 py-2 text-sm normal-case tracking-normal text-[var(--platform-text)] outline-none focus:border-[#22D3EE]"
                placeholder="voce@empresa.com"
              />
            </label>
            <label className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--platform-text)]/65">
              Senha forte
              <input
                type="password"
                value={ownerPassword}
                onChange={(event) => setOwnerPassword(event.target.value)}
                className="mt-1 w-full rounded-lg border border-white/15 bg-[#12182B] px-3 py-2 text-sm normal-case tracking-normal text-[var(--platform-text)] outline-none focus:border-[#22D3EE]"
                placeholder="Min. 10 caracteres com simbolo"
              />
            </label>
            <label className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--platform-text)]/65 md:col-span-2">
              Confirmar senha
              <input
                type="password"
                value={ownerPasswordConfirm}
                onChange={(event) => setOwnerPasswordConfirm(event.target.value)}
                className="mt-1 w-full rounded-lg border border-white/15 bg-[#12182B] px-3 py-2 text-sm normal-case tracking-normal text-[var(--platform-text)] outline-none focus:border-[#22D3EE]"
                placeholder="Repita a senha"
              />
            </label>
          </div>

          <div className="mt-3 rounded-lg border border-white/10 bg-[#12182B] px-3 py-2 text-xs text-[var(--platform-text)]/75">
            Requisitos da senha: 10+ caracteres, maiuscula, minuscula, numero e simbolo.
          </div>

          {checkoutState !== "idle" ? (
            <p
              className={`mt-3 rounded-lg border px-3 py-2 text-xs ${
                checkoutState === "error"
                  ? "border-red-300/40 bg-red-500/10 text-red-200"
                  : "border-emerald-300/40 bg-emerald-500/10 text-emerald-200"
              }`}
            >
              {checkoutMessage}
              {checkoutUrl ? (
                <a
                  href={checkoutUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="ml-2 underline underline-offset-4"
                >
                  Abrir checkout
                </a>
              ) : null}
            </p>
          ) : null}
        </div>
      </section>
    );
  }

  if (!modeConfirmed) {
    return (
      <section className="mx-auto w-full max-w-6xl rounded-3xl border border-white/15 bg-[linear-gradient(155deg,rgba(18,24,43,0.96),rgba(8,12,24,0.96))] p-6 shadow-[0_28px_60px_rgba(6,10,22,0.55)] md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#22D3EE]">Passo 1 - escolha seu modo</p>
        <h2 className="mt-3 text-3xl font-black text-[var(--platform-text)] md:text-4xl">
          Como voce quer construir seu site?
        </h2>
        <p className="mt-3 text-sm leading-7 text-[var(--platform-text)]/78 md:text-base">
          Antes de configurar o visual, escolha e confirme o modo. Isso define quais recursos ficam liberados
          durante todo o onboarding.
        </p>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {creationModes.map((mode) => {
            const isActive = creationMode === mode.id;
            const isPremiumMode = mode.id === "builder-premium";
            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => {
                  setCreationMode(mode.id);
                  if (mode.id !== "builder") {
                    setAddonsSelected([]);
                  }
                }}
                className={`rounded-2xl border p-4 text-left transition hover:-translate-y-1 hover:shadow-[0_14px_28px_rgba(34,211,238,0.14)] ${
                  isActive
                    ? "border-[#22D3EE]/75 bg-[linear-gradient(135deg,rgba(59,130,246,0.24),rgba(124,92,255,0.16),rgba(34,211,238,0.2))]"
                    : isPremiumMode
                      ? "border-[#22D3EE]/35 bg-[linear-gradient(135deg,rgba(59,130,246,0.16),rgba(124,92,255,0.12),rgba(34,211,238,0.14))] hover:border-[#22D3EE]/65"
                      : "border-white/10 bg-white/[0.02] hover:border-[#22D3EE]/45"
                }`}
              >
                {mode.badge ? (
                  <span className="inline-flex rounded-full border border-[#22D3EE]/45 bg-[#22D3EE]/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#22D3EE]">
                    {mode.badge}
                  </span>
                ) : null}
                <p className="mt-2 text-sm font-semibold text-[var(--platform-text)]">{mode.title}</p>
                <p className="mt-1 text-xs text-[var(--platform-text)]/75">{mode.description}</p>
                <ul className="mt-3 space-y-1 text-[11px] text-[var(--platform-text)]/70">
                  {mode.highlights.map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#22D3EE]" />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-xs font-semibold uppercase tracking-[0.12em] text-[#22D3EE]">{mode.priceLabel}</p>
              </button>
            );
          })}
        </div>
        <div className="mt-4 rounded-xl border border-[#22D3EE]/30 bg-[#22D3EE]/10 px-3 py-2 text-xs text-[var(--platform-text)]/85">
          Se voce pretende usar varios recursos premium, o plano <strong>Construtor + Premium Full</strong> pode
          economizar ate <strong>R$ {premiumPotentialSavings.toFixed(2)}/mes</strong> comparado a contratar todos os
          premium avulsos.
        </div>
        <div className="mt-5 flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={() => {
              setStep(0);
              setModeConfirmed(true);
            }}
            disabled={!creationMode}
            className="rounded-xl bg-[linear-gradient(135deg,#3B82F6,#7C5CFF,#22D3EE)] px-5 py-2 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(59,130,246,0.35)] transition hover:-translate-y-0.5 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Confirmar modo e continuar
          </button>
        </div>
      </section>
    );
  }

  return (
    <div className="relative grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(560px,1.05fr)] 2xl:grid-cols-[minmax(0,1fr)_660px]">
      <div className="pointer-events-none absolute -top-12 left-8 -z-10 h-44 w-44 rounded-full bg-[#22D3EE]/15 blur-3xl" />
      <div className="pointer-events-none absolute right-6 top-20 -z-10 h-52 w-52 rounded-full bg-[#7C5CFF]/15 blur-3xl" />

      <div className="space-y-5">
        <section className="relative overflow-hidden rounded-3xl border border-white/15 bg-[linear-gradient(145deg,rgba(18,24,43,0.96),rgba(11,16,32,0.96))] p-6 shadow-[0_30px_65px_rgba(4,9,20,0.55)] md:p-8">
          <div className="pointer-events-none absolute right-[-70px] top-[-70px] h-56 w-56 rounded-full bg-[#22D3EE]/18 blur-3xl" />
          <div className="pointer-events-none absolute bottom-[-90px] left-[-90px] h-64 w-64 rounded-full bg-[#7C5CFF]/20 blur-3xl" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#22D3EE]/40 bg-[#22D3EE]/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#7FE7FF]">
              Onboarding premium BuildSphere
            </div>
            <h1 className="mt-4 text-3xl font-black leading-tight text-[var(--platform-text)] md:text-5xl">
              Monte um site profissional
              <span className="bg-[linear-gradient(135deg,#3B82F6,#7C5CFF,#22D3EE)] bg-clip-text text-transparent">
                {" "}em poucos passos
              </span>
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--platform-text)]/78 md:text-base">
              Escolha o modo ideal, personalize o visual e valide o resultado em tempo real. Uma experiencia
              bonita para converter mais e reduzir friccao no cadastro.
            </p>

            <div className="mt-5 grid gap-2 sm:grid-cols-3">
              <article className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">
                <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--platform-text)]/60">Tempo medio</p>
                <p className="mt-1 text-sm font-semibold text-[var(--platform-text)]">8-12 minutos</p>
              </article>
              <article className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">
                <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--platform-text)]/60">Modelo</p>
                <p className="mt-1 text-sm font-semibold text-[var(--platform-text)]">Setup + assinatura</p>
              </article>
              <article className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">
                <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--platform-text)]/60">Preview</p>
                <p className="mt-1 text-sm font-semibold text-[var(--platform-text)]">Desktop e mobile</p>
              </article>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-white/12 bg-[#12182B]/95 p-5 shadow-[0_20px_35px_rgba(9,13,28,0.45)]">
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#22D3EE]">Progresso do onboarding</p>
            <p className="text-xs font-semibold text-[var(--platform-text)]/70">{Math.round(progressPercent)}% concluido</p>
          </div>
          <div className="grid gap-2 md:grid-cols-4">
            {onboardingSteps.map((stepItem, index) => {
              const isActive = step === index;
              const isDone = step > index;
              return (
                <article
                  key={stepItem.label}
                  className={`rounded-xl border px-3 py-3 transition ${
                    isActive
                      ? "border-[#22D3EE]/70 bg-[linear-gradient(135deg,rgba(59,130,246,0.2),rgba(124,92,255,0.15),rgba(34,211,238,0.16))]"
                      : isDone
                        ? "border-emerald-300/40 bg-emerald-500/10"
                        : "border-white/10 bg-white/[0.02]"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                        isDone
                          ? "bg-emerald-400 text-emerald-950"
                          : isActive
                            ? "bg-[#22D3EE] text-[#02131a]"
                            : "bg-white/10 text-[var(--platform-text)]/70"
                      }`}
                    >
                      {isDone ? "✓" : index + 1}
                    </span>
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--platform-text)]">
                      {stepItem.label}
                    </p>
                  </div>
                  <p className="mt-1 text-[11px] leading-5 text-[var(--platform-text)]/65">{stepItem.subtitle}</p>
                </article>
              );
            })}
          </div>
          <div className="mt-4 h-2 w-full overflow-hidden rounded-full border border-white/10 bg-[#0B1020]">
            <div
              className="h-full rounded-full bg-[linear-gradient(135deg,#3B82F6,#7C5CFF,#22D3EE)] transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </section>

        {renderStepContent()}

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-[#12182B]/80 p-3">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--platform-text)]/65">
            Etapa {step + 1} de {onboardingSteps.length}
          </p>
          <button
            type="button"
            onClick={() => setStep((current) => Math.max(0, current - 1) as Step)}
            disabled={step === 0 || submitState === "submitting"}
            className="rounded-xl border border-white/20 bg-white/[0.02] px-4 py-2 text-sm font-semibold text-[var(--platform-text)] transition hover:-translate-y-0.5 hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Voltar
          </button>

          {step < 2 ? (
            <button
              type="button"
              onClick={() => setStep((current) => Math.min(3, current + 1) as Step)}
              className="rounded-xl bg-[linear-gradient(135deg,#3B82F6,#7C5CFF,#22D3EE)] px-5 py-2 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(59,130,246,0.35)] transition hover:-translate-y-0.5 hover:brightness-110"
            >
              Continuar
            </button>
          ) : null}

          {step === 2 ? (
            <button
              type="button"
              onClick={() => setStep(3)}
              disabled={!canMoveToSummary}
              className="rounded-xl bg-[linear-gradient(135deg,#3B82F6,#7C5CFF,#22D3EE)] px-5 py-2 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(59,130,246,0.35)] transition hover:-translate-y-0.5 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Continuar para resumo
            </button>
          ) : null}

          {step === 3 ? (
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => void createDraftTenant()}
                disabled={submitState === "submitting" || !canMoveToSummary}
                className="rounded-xl border border-white/20 bg-white/[0.02] px-4 py-2 text-sm font-semibold text-[var(--platform-text)] transition hover:-translate-y-0.5 hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitState === "submitting"
                  ? "Criando rascunho..."
                  : hasDraft
                    ? "Recriar rascunho"
                    : "Criar rascunho do site"}
              </button>
              <button
                type="button"
                onClick={() => void startCheckout()}
                disabled={checkoutState === "submitting" || !canStartCheckout}
                className="rounded-xl bg-[linear-gradient(135deg,#3B82F6,#7C5CFF,#22D3EE)] px-5 py-2 text-sm font-semibold text-white shadow-[0_14px_26px_rgba(59,130,246,0.35)] transition hover:-translate-y-0.5 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {checkoutState === "submitting" ? "Abrindo checkout..." : "Cadastrar e ir para checkout"}
              </button>
            </div>
          ) : null}
        </div>
      </div>

      <aside className="sticky top-4 h-fit overflow-hidden rounded-3xl border border-white/12 bg-[linear-gradient(160deg,rgba(18,24,43,0.96),rgba(8,12,24,0.96))] p-4 shadow-[0_28px_55px_rgba(6,10,22,0.55)] xl:p-5">
        <div className="pointer-events-none absolute right-[-45px] top-[-45px] h-36 w-36 rounded-full bg-[#22D3EE]/18 blur-3xl" />
        <div className="pointer-events-none absolute bottom-[-65px] left-[-45px] h-44 w-44 rounded-full bg-[#7C5CFF]/18 blur-3xl" />
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#22D3EE]">Preview em tempo real</p>
        <p className="mt-1 text-sm text-[var(--platform-text)]/70">Visual do site com suas escolhas atuais.</p>
        <div className="mt-3 rounded-xl border border-white/10 bg-[#0B1020]/90 p-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#22D3EE]">
            {creationModes.find((mode) => mode.id === selectedMode)?.shortLabel}
          </p>
          <p className="mt-1 text-lg font-bold text-[var(--platform-text)]">R$ {monthlyTotal.toFixed(2)}/mes</p>
          {selectedMode !== "builder-premium" ? (
            <button
              type="button"
              onClick={() => setCreationMode("builder-premium")}
              className="mt-2 w-full rounded-lg bg-[linear-gradient(135deg,#3B82F6,#7C5CFF,#22D3EE)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-white transition hover:-translate-y-0.5 hover:brightness-110"
            >
              Ver premium full
            </button>
          ) : (
            <p className="mt-2 text-xs text-emerald-200">Todos os recursos premium estao liberados.</p>
          )}
        </div>
        <div className="mt-3 inline-flex rounded-lg border border-white/15 bg-[#0B1020] p-1">
          <button
            type="button"
            onClick={() => setPreviewDevice("desktop")}
            className={`rounded px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${
              previewDevice === "desktop" ? "bg-[#3B82F6] text-white" : "text-[var(--platform-text)]/65"
            }`}
          >
            Desktop
          </button>
          <button
            type="button"
            onClick={() => setPreviewDevice("mobile")}
            className={`rounded px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${
              previewDevice === "mobile" ? "bg-[#3B82F6] text-white" : "text-[var(--platform-text)]/65"
            }`}
          >
            Mobile
          </button>
        </div>
        <div
          className={`mt-3 overflow-hidden border border-white/10 transition-all ${
            previewDevice === "mobile"
              ? "mx-auto max-w-[320px] rounded-[1.8rem]"
              : "rounded-xl shadow-[0_18px_36px_rgba(0,0,0,0.45)]"
          }`}
        >
          {previewDevice === "mobile" ? (
            <div className="px-4 pt-3" style={{ backgroundColor: selectedPalette.background }}>
              <div className="mx-auto h-1.5 w-20 rounded-full bg-white/25" />
            </div>
          ) : null}
          <div className="flex items-center gap-2 border-b border-black/15 px-3 py-2" style={{ backgroundColor: selectedPalette.background }}>
            <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F56]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#FFBD2E]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#27C93F]" />
            <div
              className="ml-2 h-5 flex-1 rounded-md border border-white/10 bg-white/[0.04] px-2 text-[10px] leading-5"
              style={{ color: previewText.primary }}
            >
              {normalizeSubdomain(preferredSubdomain || "meu-site")}.{process.env.NEXT_PUBLIC_PLATFORM_ROOT_DOMAIN || "bsph.com.br"}
            </div>
          </div>

          <div
            className={`p-3 ${
              previewDevice === "mobile"
                ? "space-y-3 max-h-[58vh] overflow-y-auto"
                : "grid max-h-[68vh] grid-cols-3 gap-3 overflow-y-auto"
            }`}
            style={{ backgroundColor: selectedPalette.background, color: previewText.primary }}
          >
            <section className={`border p-3 transition-all ${previewFlavor.pageClass} ${previewDevice === "desktop" ? "col-span-3" : ""}`}>
              <p className="text-[10px] uppercase tracking-[0.16em]" style={{ color: selectedPalette.accent }}>
                Header {sectionStyles.header.find((item) => item.id === safeHeaderStyle)?.name}
              </p>
              <div
                className={`mt-2 rounded-xl px-3 py-2 ${
                  safeHeaderStyle === "header-glass"
                    ? "border border-white/20 bg-white/[0.05] backdrop-blur"
                    : safeHeaderStyle === "header-solid"
                      ? "border border-transparent"
                      : safeHeaderStyle === "header-center"
                        ? "border border-white/15 text-center"
                        : "border border-white/15"
                }`}
                style={{
                  backgroundColor: safeHeaderStyle === "header-solid" ? selectedPalette.primary : undefined,
                  color: safeHeaderStyle === "header-solid" ? solidHeaderText : previewText.primary,
                }}
              >
                <div className={`${safeHeaderStyle === "header-center" ? "" : "flex items-center justify-between gap-2"}`}>
                  <p className={`text-sm font-semibold ${previewFlavor.textClass}`}>{businessName || "Nome do seu negocio"}</p>
                  {safeHeaderStyle !== "header-center" ? (
                    <span className="rounded-md border px-2 py-0.5 text-[10px]" style={{ borderColor: previewText.border }}>
                      Agendar
                    </span>
                  ) : null}
                </div>
              </div>
            </section>

            <section className={`border p-3 ${previewFlavor.sectionClass} ${previewDevice === "desktop" ? "col-span-3" : ""}`}>
              <p className="text-[10px] uppercase tracking-[0.16em]" style={{ color: selectedPalette.accent }}>
                Hero {sectionStyles.hero.find((item) => item.id === safeHeroStyle)?.name}
              </p>

              {safeHeroStyle === "hero-split" ? (
                <div className="mt-2 grid gap-2 md:grid-cols-2">
                  <div>
                    <h3 className={`text-base font-semibold ${previewFlavor.textClass}`} style={{ color: previewText.primary }}>
                      {businessName ? `${businessName} para ${targetAudience || "seu publico"}` : "Seu titulo principal"}
                    </h3>
                    <p className="mt-1 text-xs" style={{ color: previewText.muted }}>
                      {businessHighlights || "Resumo do seu diferencial e proposta de valor."}
                    </p>
                    <button type="button" className="mt-2 rounded-md px-3 py-1 text-xs font-semibold text-white" style={{ backgroundColor: selectedPalette.primary }}>
                      Agendar conversa
                    </button>
                  </div>
                  <div className="rounded-lg border p-2" style={{ borderColor: previewText.border }}>
                    <div className="h-20 rounded-md bg-[linear-gradient(135deg,#3B82F6,#7C5CFF,#22D3EE)] opacity-70" />
                    <p className="mt-1 text-[10px]" style={{ color: previewText.muted }}>Imagem de destaque</p>
                  </div>
                </div>
              ) : safeHeroStyle === "hero-card" ? (
                <div className="mt-2 rounded-xl border p-3 shadow-[0_10px_24px_rgba(0,0,0,0.24)]" style={{ borderColor: previewText.border }}>
                  <p className="text-[11px] uppercase tracking-[0.14em]" style={{ color: selectedPalette.accent }}>Atendimento premium</p>
                  <h3 className={`mt-1 text-lg font-semibold ${previewFlavor.textClass}`} style={{ color: previewText.primary }}>
                    {businessName || "Titulo principal do card"}
                  </h3>
                  <p className="mt-1 text-xs" style={{ color: previewText.muted }}>
                    {businessHighlights || "Mensagem principal com proposta de valor direta."}
                  </p>
                </div>
              ) : safeHeroStyle === "hero-minimal" ? (
                <div className="mt-2">
                  <h3 className={`text-lg font-semibold ${previewFlavor.textClass}`} style={{ color: previewText.primary }}>
                    {businessName || "Titulo principal minimalista"}
                  </h3>
                  <p className="mt-1 text-xs" style={{ color: previewText.muted }}>
                    {businessHighlights || "Texto curto com foco em clareza e objetividade."}
                  </p>
                </div>
              ) : (
                <div className="mt-2 text-center">
                  <h3 className={`text-lg font-semibold ${previewFlavor.textClass}`} style={{ color: previewText.primary }}>
                    {businessName || "Hero central"}
                  </h3>
                  <p className="mt-1 text-xs" style={{ color: previewText.muted }}>
                    {businessHighlights || "Mensagem central forte e CTA destacado."}
                  </p>
                </div>
              )}
            </section>

            <section className={`border p-3 ${previewFlavor.sectionClass} ${previewDevice === "desktop" ? "col-span-3" : ""}`}>
              <p className="text-[10px] uppercase tracking-[0.16em]" style={{ color: selectedPalette.accent }}>
                Services {sectionStyles.services.find((item) => item.id === safeServicesStyle)?.name}
              </p>
              {safeServicesStyle === "services-list" ? (
                <ul className="mt-2 space-y-2 text-xs">
                  {["Servico 1", "Servico 2", "Servico 3", "Servico 4"].map((item) => (
                    <li key={item} className="rounded-lg border px-2 py-2" style={{ borderColor: previewText.border }}>
                      {item}
                    </li>
                  ))}
                </ul>
              ) : safeServicesStyle === "services-columns" ? (
                <div className="mt-2 grid grid-cols-1 gap-2 text-[11px] md:grid-cols-3">
                  <div className="rounded-lg border p-2" style={{ borderColor: previewText.border }}>Base</div>
                  <div className="rounded-lg border p-2" style={{ borderColor: previewText.border }}>Pro</div>
                  <div className="rounded-lg border p-2" style={{ borderColor: previewText.border }}>Premium</div>
                </div>
              ) : safeServicesStyle === "services-steps" ? (
                <div className="mt-2 space-y-2 text-xs">
                  {["Diagnostico", "Planejamento", "Acompanhamento", "Resultado"].map((stepLabel, index) => (
                    <div key={stepLabel} className="flex items-center gap-2 rounded-lg border px-2 py-2" style={{ borderColor: previewText.border }}>
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white" style={{ backgroundColor: selectedPalette.primary }}>
                        {index + 1}
                      </span>
                      {stepLabel}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-2 grid grid-cols-1 gap-2 text-xs md:grid-cols-2">
                  {["Atendimento individual", "Sessao de orientacao", "Plano de evolucao", "Suporte dedicado"].map((item) => (
                    <div key={item} className="rounded-lg border p-2" style={{ borderColor: previewText.border }}>
                      <div className="mb-1 h-14 rounded-md bg-[linear-gradient(135deg,rgba(59,130,246,0.35),rgba(124,92,255,0.3),rgba(34,211,238,0.25))]" />
                      {item}
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section
              className={`p-3 ${previewDevice === "desktop" ? "col-span-3" : ""} ${
                safeCtaStyle === "cta-floating" ? "rounded-2xl shadow-[0_16px_30px_rgba(0,0,0,0.3)]" : "rounded-lg"
              } ${safeMotionStyle === "motion-vivid" ? "animate-pulse" : ""}`}
              style={{
                background:
                  safeCtaStyle === "cta-card"
                    ? selectedPalette.primary
                    : safeCtaStyle === "cta-double"
                      ? `linear-gradient(135deg, ${selectedPalette.primary}, ${selectedPalette.accent})`
                      : safeCtaStyle === "cta-floating"
                        ? `radial-gradient(circle at top right, ${selectedPalette.accent}, ${selectedPalette.primary})`
                        : `linear-gradient(135deg, ${selectedPalette.primary}, ${selectedPalette.accent})`,
                color: ctaTextColor,
              }}
            >
              <p className="text-[10px] uppercase tracking-[0.16em]">
                CTA {sectionStyles.cta.find((item) => item.id === safeCtaStyle)?.name}
              </p>
              <p className="mt-1 text-sm font-semibold">Vamos conversar?</p>
              {safeCtaStyle === "cta-double" ? (
                <div className="mt-2 grid grid-cols-2 gap-2 text-[11px]">
                  <div className="rounded bg-white/20 px-2 py-1">WhatsApp</div>
                  <div className="rounded bg-white/20 px-2 py-1">Formulario</div>
                </div>
              ) : (
                <button type="button" className="mt-2 rounded bg-white/20 px-3 py-1 text-[11px] font-semibold">
                  Falar agora
                </button>
              )}
            </section>
          </div>
        </div>

      </aside>
    </div>
  );
}
