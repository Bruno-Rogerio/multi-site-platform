export type SitePlan = "landing" | "pro";

export type SectionType =
  | "hero"
  | "about"
  | "services"
  | "cta"
  | "testimonials"
  | "contact";

export type ButtonStyle = "rounded" | "pill" | "square";

export type ThemeSettings = {
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  buttonStyle: ButtonStyle;
  logoUrl?: string;
  headerCtaLabel?: string;
  "--site-radius"?: string;
  "--site-spacing"?: string;
  "--site-shadow"?: string;
  headerStyle?: "blur" | "solid" | "minimal";
  dividerStyle?: "wave" | "diagonal" | "curve" | "line" | "none";
  motionStyle?: string;
  seoTitle?: string;
  seoDescription?: string;
  footerText?: string;
  whatsappUrl?: string;
  floatingLinks?: Array<{ type: string; url: string; icon: string; label: string }>;
  floatingButtonsEnabled?: boolean;
  // Draft / preview fields
  onboardingDraft?: boolean;
  previewExpiresAt?: string;
  selectedPlan?: string;
  ownerEmail?: string;
};

export type Section = {
  id: string;
  type: SectionType;
  variant?: string;
  order: number;
  content: Record<string, unknown>;
};

export type Page = {
  id: string;
  siteId: string;
  slug: string;
  title: string;
  sections: Section[];
};

export type Site = {
  id: string;
  name: string;
  domain: string;
  plan: SitePlan;
  themeSettings: ThemeSettings;
  homePage: Page;
  createdAt?: string;
};

export const defaultThemeSettings: ThemeSettings = {
  primaryColor: "#204ecf",
  accentColor: "#36a66f",
  backgroundColor: "#ffffff",
  textColor: "#101426",
  fontFamily: "Inter, system-ui, sans-serif",
  buttonStyle: "rounded",
};
