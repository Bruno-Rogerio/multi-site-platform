"use client";

import {
  createContext,
  useContext,
  useReducer,
  useMemo,
  type ReactNode,
  type Dispatch,
} from "react";
import type { WizardState, WizardAction, StepDefinition, CtaTypeId } from "@/lib/onboarding/types";
import { getStepsForPlan } from "@/lib/onboarding/plans";
import { calculateMonthlyTotal } from "@/lib/onboarding/pricing";
import {
  isFeatureUnlocked as checkFeatureUnlocked,
  getServiceCardsLimit,
  getSectionsLimit,
  getCtaTypesLimit,
  type PremiumFeatureId,
} from "@/lib/onboarding/premium-gate";
import { DEFAULT_CONTENT, DEFAULT_SERVICE_CARDS } from "@/lib/onboarding/helpers";

/* ─── Initial state ─── */

const initialState: WizardState = {
  // Plan
  selectedPlan: null,
  planConfirmed: false,

  // Template flow
  selectedTemplateSlug: null,

  // Style & palette
  paletteId: "buildsphere",
  customColors: { primary: "#3B82F6", accent: "#22D3EE", background: "#0B1020", text: "#EAF0FF" },
  fontFamily: "Sora, sans-serif",
  buttonStyle: "rounded",

  // Section builder
  heroVariant: "centered",
  servicesVariant: "default",
  servicesDisplayMode: "grid",
  ctaVariant: "banner",
  motionStyle: "motion-fade",
  enabledSections: ["hero", "services", "about", "cta", "contact"],
  sectionColors: {},

  // Service cards
  serviceCards: DEFAULT_SERVICE_CARDS,

  // CTA system
  selectedCtaTypes: ["whatsapp"],
  floatingCtaEnabled: false,
  floatingCtaChannels: [],
  ctaConfig: {
    whatsapp: { label: "WhatsApp", url: "" },
  },

  // Icon pack
  selectedIconPack: "basic",

  // Premium addons
  addonsSelected: [],

  // Content
  content: { ...DEFAULT_CONTENT },
  contactSelectedLinks: [],

  // Images
  heroImage: "",
  logoUrl: "",

  // Business info
  businessName: "",
  businessSegment: "",
  businessCity: "",
  businessHighlights: "",
  targetAudience: "",
  preferredSubdomain: "",

  // Checkout
  ownerName: "",
  ownerDocument: "",
  ownerDocumentType: "cpf",
  ownerEmail: "",
  ownerPassword: "",
  ownerPasswordConfirm: "",

  // UI state
  currentStep: 0,
  previewDevice: "desktop",
  submitState: "idle",
  submitMessage: "",
  draftSiteId: "",
  draftUrl: "",
  checkoutState: "idle",
  checkoutMessage: "",
  checkoutUrl: "",
};

/* ─── Free defaults (used when toggling section premium off) ─── */

const FREE_PALETA_DEFAULTS = {
  paletteId: "buildsphere",
} as const;

const FREE_TIPOGRAFIA_DEFAULTS = {
  fontFamily: "Sora, sans-serif",
} as const;

const FREE_VARIANTES_DEFAULTS = {
  heroVariant: "centered",
  servicesVariant: "default",
  ctaVariant: "banner",
  motionStyle: "motion-fade",
} as const;

const FREE_CANAIS_DEFAULTS = {
  floatingCtaEnabled: false,
  floatingCtaChannels: [] as CtaTypeId[],
} as const;

const FREE_CARDS_DEFAULTS = {
  selectedIconPack: "basic" as const,
} as const;

/* ─── Reducer ─── */

function wizardReducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case "SET_PLAN":
      return {
        ...initialState,
        businessName: state.businessName,
        businessSegment: state.businessSegment,
        businessCity: state.businessCity,
        businessHighlights: state.businessHighlights,
        targetAudience: state.targetAudience,
        preferredSubdomain: state.preferredSubdomain,
        selectedPlan: action.plan,
        currentStep: state.currentStep,
      };

    case "CONFIRM_PLAN":
      return { ...state, planConfirmed: true };

    case "SELECT_TEMPLATE":
      return { ...state, selectedTemplateSlug: action.slug };

    case "SET_PALETTE":
      return { ...state, paletteId: action.id };

    case "SET_CUSTOM_COLOR":
      return {
        ...state,
        customColors: { ...state.customColors, [action.key]: action.value },
      };

    case "SET_FONT":
      return { ...state, fontFamily: action.family };

    case "SET_BUTTON_STYLE":
      return { ...state, buttonStyle: action.style };

    case "SET_HERO_VARIANT":
      return { ...state, heroVariant: action.variant };

    case "SET_SERVICES_VARIANT":
      return { ...state, servicesVariant: action.variant };

    case "SET_SERVICES_DISPLAY":
      return { ...state, servicesDisplayMode: action.mode };

    case "SET_CTA_VARIANT":
      return { ...state, ctaVariant: action.variant };

    case "SET_MOTION_STYLE":
      return { ...state, motionStyle: action.style };

    case "ADD_SECTION":
      return {
        ...state,
        enabledSections: [...state.enabledSections, action.sectionType],
      };

    case "REMOVE_SECTION":
      return {
        ...state,
        enabledSections: state.enabledSections.filter((s) => s !== action.sectionType),
      };

    case "SET_SECTION_COLOR":
      return {
        ...state,
        sectionColors: { ...state.sectionColors, [action.sectionType]: action.colors },
      };

    case "UPDATE_SERVICE_CARD":
      return {
        ...state,
        serviceCards: state.serviceCards.map((card, i) =>
          i === action.index ? { ...card, ...action.data } : card
        ),
      };

    case "ADD_SERVICE_CARD":
      return {
        ...state,
        serviceCards: [
          ...state.serviceCards,
          { title: "Novo serviço", description: "Descrição", iconName: "Star" },
        ],
      };

    case "REMOVE_SERVICE_CARD":
      return {
        ...state,
        serviceCards: state.serviceCards.filter((_, i) => i !== action.index),
      };

    case "TOGGLE_CTA_TYPE": {
      const isSelected = state.selectedCtaTypes.includes(action.ctaTypeId);
      if (isSelected) {
        const newTypes = state.selectedCtaTypes.filter((id) => id !== action.ctaTypeId);
        const { [action.ctaTypeId]: _removed, ...remainingConfig } = state.ctaConfig;
        return {
          ...state,
          selectedCtaTypes: newTypes,
          ctaConfig: remainingConfig,
          floatingCtaEnabled: newTypes.length === 0 ? false : state.floatingCtaEnabled,
        };
      }
      return {
        ...state,
        selectedCtaTypes: [...state.selectedCtaTypes, action.ctaTypeId],
      };
    }

    case "SET_CTA_CONFIG":
      return {
        ...state,
        ctaConfig: { ...state.ctaConfig, [action.ctaTypeId]: action.config },
      };

    case "SET_FLOATING_CTA": {
      const newEnabled = action.enabled;
      const autoChannels = newEnabled && state.floatingCtaChannels.length === 0 && state.selectedCtaTypes.length > 0
        ? [state.selectedCtaTypes[0]]
        : state.floatingCtaChannels;
      return {
        ...state,
        floatingCtaEnabled: newEnabled,
        floatingCtaChannels: newEnabled ? autoChannels : state.floatingCtaChannels,
      };
    }

    case "SET_FLOATING_CTA_CHANNELS":
      return { ...state, floatingCtaChannels: action.channels };

    case "SET_ICON_PACK":
      return { ...state, selectedIconPack: action.pack };

    case "TOGGLE_ADDON": {
      const isSelected = state.addonsSelected.includes(action.addonId);
      return {
        ...state,
        addonsSelected: isSelected
          ? state.addonsSelected.filter((id) => id !== action.addonId)
          : [...state.addonsSelected, action.addonId],
      };
    }

    case "TOGGLE_SECTION_PREMIUM": {
      const { sectionId } = action;
      const isActive = state.addonsSelected.includes(sectionId);

      if (isActive) {
        // Turning OFF: remove addon and reset to free defaults for that section
        const newAddons = state.addonsSelected.filter((id) => id !== sectionId);
        const base = { ...state, addonsSelected: newAddons };

        switch (sectionId) {
          case "premium-paleta":
            return { ...base, ...FREE_PALETA_DEFAULTS };
          case "premium-tipografia":
            return { ...base, ...FREE_TIPOGRAFIA_DEFAULTS };
          case "premium-variantes":
            return { ...base, ...FREE_VARIANTES_DEFAULTS };
          case "premium-canais":
            return {
              ...base,
              ...FREE_CANAIS_DEFAULTS,
              // Trim CTA types to free limit (2)
              selectedCtaTypes: state.selectedCtaTypes.slice(0, 2),
            };
          case "premium-cards":
            return {
              ...base,
              ...FREE_CARDS_DEFAULTS,
              // Trim service cards to free limit (4)
              serviceCards: state.serviceCards.slice(0, 4),
            };
          default:
            return base;
        }
      }

      // Turning ON: add addon
      return {
        ...state,
        addonsSelected: [...state.addonsSelected, sectionId],
      };
    }

    case "UPDATE_CONTENT":
      return { ...state, content: { ...state.content, [action.key]: action.value } };

    case "SET_BUSINESS_FIELD": {
      const newState = { ...state, [action.key]: action.value };
      if (action.key === "businessHighlights") {
        newState.content = { ...newState.content, slogan: action.value };
      }
      return newState;
    }

    case "SET_CHECKOUT_FIELD":
      return { ...state, [action.key]: action.value };

    case "SET_STEP":
      return { ...state, currentStep: action.step };

    case "NEXT_STEP":
      return { ...state, currentStep: state.currentStep + 1 };

    case "PREV_STEP":
      return { ...state, currentStep: Math.max(0, state.currentStep - 1) };

    case "SET_PREVIEW_DEVICE":
      return { ...state, previewDevice: action.device };

    case "SET_SUBMIT_STATE":
      return { ...state, submitState: action.state, submitMessage: action.message ?? "" };

    case "SET_DRAFT":
      return { ...state, draftSiteId: action.siteId, draftUrl: action.url };

    case "SET_CHECKOUT_STATE":
      return {
        ...state,
        checkoutState: action.state,
        checkoutMessage: action.message ?? "",
        checkoutUrl: action.url ?? "",
      };

    case "SET_IMAGE":
      return { ...state, [action.key]: action.url };

    case "SET_CONTACT_SELECTED_LINKS":
      return { ...state, contactSelectedLinks: action.links };

    case "RESET_WIZARD":
      return initialState;

    default:
      return state;
  }
}

/* ─── Context ─── */

type WizardContextValue = {
  state: WizardState;
  dispatch: Dispatch<WizardAction>;
  steps: StepDefinition[];
  totalSteps: number;
  monthlyTotal: number;
  isFeatureUnlocked: (featureId: PremiumFeatureId) => boolean;
  maxServiceCards: number;
  maxSections: number;
  maxCtaTypes: number;
};

const WizardContext = createContext<WizardContextValue | null>(null);

export function WizardProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(wizardReducer, initialState);

  const value = useMemo(() => {
    const steps = getStepsForPlan(state.selectedPlan);
    const monthlyTotal = calculateMonthlyTotal(state.selectedPlan, state.addonsSelected);

    return {
      state,
      dispatch,
      steps,
      totalSteps: steps.length,
      monthlyTotal,
      isFeatureUnlocked: (featureId: PremiumFeatureId) =>
        checkFeatureUnlocked(featureId, state.selectedPlan, state.addonsSelected),
      maxServiceCards: getServiceCardsLimit(state.selectedPlan, state.addonsSelected),
      maxSections: getSectionsLimit(state.selectedPlan, state.addonsSelected),
      maxCtaTypes: getCtaTypesLimit(state.selectedPlan, state.addonsSelected),
    };
  }, [state]);

  return <WizardContext.Provider value={value}>{children}</WizardContext.Provider>;
}

export function useWizard() {
  const context = useContext(WizardContext);
  if (!context) {
    throw new Error("useWizard must be used within a WizardProvider");
  }
  return context;
}
