/* ─── Core types for the onboarding wizard ─── */

export type OnboardingPlan = "basico" | "premium";

export type StepDefinition = {
  id: string;
  label: string;
  subtitle: string;
};

export type ServiceCardData = {
  title: string;
  description: string;
  iconName: string;
  icon?: string; // alias for iconName, used by some components
  imageUrl?: string; // optional image for the card
  imageObjectPosition?: string; // CSS object-position for the image (e.g. "center top")
  extraLines?: string[]; // extra text lines below the description
  tag?: string;
};

export type CtaTypeId = "whatsapp" | "email" | "instagram" | "linkedin" | "facebook" | "youtube" | "tiktok" | "pinterest" | "telegram";

export type CtaConfig = {
  type: CtaTypeId;
  label: string;
  url: string;
};

export type SectionColorOverride = {
  bg?: string;
  text?: string;
  accent?: string;
};

export type WizardState = {
  // Plan
  selectedPlan: OnboardingPlan | null;
  planConfirmed: boolean;

  // Template flow (basico)
  selectedTemplateSlug: string | null;

  // Visual identity (premium wizard)
  visualPrimaryColor: string;
  visualTone: "dark" | "light" | "neutral";
  visualPersonality: "clean" | "bold" | "elegant" | "friendly";
  visualMotion: "none" | "subtle" | "lively";

  // Style & palette (builder/premium)
  paletteId: string;
  customColors: { primary: string; accent: string; background: string; text: string };
  fontFamily: string;
  buttonStyle: "rounded" | "pill" | "square";

  // Section builder
  heroVariant: string;
  servicesVariant: string;
  ctaVariant: string;
  testimonialsVariant: string;
  galleryVariant: string;
  faqVariant: string;
  blogVariant: string;
  eventsVariant: string;
  statsVariant: string;
  contactVariant: string;
  motionStyle: string;
  headerStyle: "blur" | "solid" | "minimal" | "gradient" | "dark";
  dividerStyle: "wave" | "diagonal" | "curve" | "line" | "none";
  enabledSections: string[];
  sectionColors: Record<string, SectionColorOverride>;

  // Service cards
  serviceCards: ServiceCardData[];

  // CTA system
  selectedCtaTypes: CtaTypeId[];
  floatingCtaEnabled: boolean;
  floatingCtaChannels: CtaTypeId[];
  ctaConfig: Partial<Record<CtaTypeId, { label: string; url: string }>>;

  // Icon pack
  selectedIconPack: "basic" | "premium";

  // Premium addons (builder mode)
  addonsSelected: string[];

  // Content editing
  content: Record<string, unknown>;
  contactSelectedLinks: string[];

  // Images
  heroImage: string;
  logoUrl: string;
  servicesImage: string;

  // Business info
  businessName: string;
  businessSegment: string;
  businessCity: string;
  businessHighlights: string;
  targetAudience: string;
  preferredSubdomain: string;

  // Checkout
  ownerName: string;
  ownerDocument: string;
  ownerDocumentType: "cpf" | "cnpj";
  ownerEmail: string;
  ownerPassword: string;
  ownerPasswordConfirm: string;
  ownerLegalName: string;
  ownerAddress: string;
  ownerPostalCode: string;
  ownerCity: string;
  ownerState: string;

  // Lead capture
  leadId: string;

  // UI state
  currentStep: number;
  previewDevice: "desktop" | "mobile";
  submitState: "idle" | "submitting" | "success" | "error";
  submitMessage: string;
  draftSiteId: string;
  draftUrl: string;
  checkoutState: "idle" | "submitting" | "success" | "error";
  checkoutMessage: string;
  checkoutUrl: string;
};

export type WizardAction =
  | { type: "SET_PLAN"; plan: OnboardingPlan }
  | { type: "CONFIRM_PLAN" }
  | { type: "SELECT_TEMPLATE"; slug: string }
  | { type: "SET_PALETTE"; id: string }
  | { type: "SET_CUSTOM_COLOR"; key: string; value: string }
  | { type: "SET_FONT"; family: string }
  | { type: "SET_BUTTON_STYLE"; style: "rounded" | "pill" | "square" }
  | { type: "SET_HERO_VARIANT"; variant: string }
  | { type: "SET_SERVICES_VARIANT"; variant: string }
  | { type: "SET_CTA_VARIANT"; variant: string }
  | { type: "SET_TESTIMONIALS_VARIANT"; variant: string }
  | { type: "SET_GALLERY_VARIANT"; variant: string }
  | { type: "SET_FAQ_VARIANT"; variant: string }
  | { type: "SET_BLOG_VARIANT"; variant: string }
  | { type: "SET_EVENTS_VARIANT"; variant: string }
  | { type: "SET_STATS_VARIANT"; variant: string }
  | { type: "SET_CONTACT_VARIANT"; variant: string }
  | { type: "SET_MOTION_STYLE"; style: string }
  | { type: "SET_HEADER_STYLE"; style: "blur" | "solid" | "minimal" | "gradient" | "dark" }
  | { type: "SET_DIVIDER_STYLE"; style: "wave" | "diagonal" | "curve" | "line" | "none" }
  | { type: "ADD_SECTION"; sectionType: string }
  | { type: "REMOVE_SECTION"; sectionType: string }
  | { type: "SET_SECTION_COLOR"; sectionType: string; colors: SectionColorOverride }
  | { type: "UPDATE_SERVICE_CARD"; index: number; data: Partial<ServiceCardData> }
  | { type: "ADD_SERVICE_CARD" }
  | { type: "REMOVE_SERVICE_CARD"; index: number }
  | { type: "TOGGLE_CTA_TYPE"; ctaTypeId: CtaTypeId }
  | { type: "SET_CTA_CONFIG"; ctaTypeId: CtaTypeId; config: { label: string; url: string } }
  | { type: "SET_FLOATING_CTA"; enabled: boolean }
  | { type: "SET_FLOATING_CTA_CHANNELS"; channels: CtaTypeId[] }
  | { type: "SET_ICON_PACK"; pack: "basic" | "premium" }
  | { type: "TOGGLE_ADDON"; addonId: string }
  | { type: "UPDATE_CONTENT"; key: string; value: string }
  | { type: "SET_BUSINESS_FIELD"; key: string; value: string }
  | { type: "SET_CHECKOUT_FIELD"; key: string; value: string }
  | { type: "SET_STEP"; step: number }
  | { type: "NEXT_STEP" }
  | { type: "PREV_STEP" }
  | { type: "SET_PREVIEW_DEVICE"; device: "desktop" | "mobile" }
  | { type: "SET_SUBMIT_STATE"; state: WizardState["submitState"]; message?: string }
  | { type: "SET_DRAFT"; siteId: string; url: string }
  | { type: "SET_CHECKOUT_STATE"; state: WizardState["checkoutState"]; message?: string; url?: string }
  | { type: "TOGGLE_SECTION_PREMIUM"; sectionId: "premium-paleta" | "premium-tipografia" | "premium-variantes" | "premium-canais" | "premium-cards" }
  | { type: "SET_VISUAL_IDENTITY"; primaryColor: string; tone: "dark" | "light" | "neutral"; personality: "clean" | "bold" | "elegant" | "friendly"; motion: "none" | "subtle" | "lively" }
  | { type: "SET_PALETTE_THEME"; paletteId: string; customColors: { primary: string; accent: string; background: string; text: string }; fontFamily: string; motionStyle: string; buttonStyle: "rounded" | "pill" | "square"; headerStyle: "blur" | "solid" | "minimal" | "gradient" | "dark"; dividerStyle: "wave" | "diagonal" | "curve" | "line" | "none" }
  | { type: "SET_IMAGE"; key: "heroImage" | "logoUrl" | "servicesImage"; url: string }
  | { type: "SET_CONTACT_SELECTED_LINKS"; links: string[] }
  | { type: "SET_LEAD_ID"; leadId: string }
  | { type: "RESET_WIZARD" }
  | { type: "REORDER_SECTIONS"; sections: string[] }
  | { type: "SET_CONTENT_ARRAY"; key: string; value: unknown[] }
  | { type: "SET_SERVICE_CARDS"; cards: ServiceCardData[] };
