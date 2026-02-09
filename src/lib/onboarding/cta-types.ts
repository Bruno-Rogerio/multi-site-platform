/* ─── CTA channel type definitions ─── */

import type { CtaTypeId } from "./types";

export type CtaTypeDefinition = {
  id: CtaTypeId;
  label: string;
  icon: string;
  placeholder: string;
  urlPrefix: string;
  description: string;
};

export const ctaTypes: CtaTypeDefinition[] = [
  {
    id: "whatsapp",
    label: "WhatsApp",
    icon: "MessageCircle",
    placeholder: "5511999999999",
    urlPrefix: "https://wa.me/",
    description: "Link direto para conversa no WhatsApp",
  },
  {
    id: "email",
    label: "E-mail",
    icon: "Mail",
    placeholder: "contato@exemplo.com",
    urlPrefix: "mailto:",
    description: "Abre o cliente de email do visitante",
  },
  {
    id: "instagram",
    label: "Instagram",
    icon: "Instagram",
    placeholder: "seuperfil",
    urlPrefix: "https://instagram.com/",
    description: "Link para seu perfil no Instagram",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    icon: "Linkedin",
    placeholder: "in/seuperfil",
    urlPrefix: "https://linkedin.com/",
    description: "Link para seu perfil no LinkedIn",
  },
  {
    id: "facebook",
    label: "Facebook",
    icon: "Facebook",
    placeholder: "suapagina",
    urlPrefix: "https://facebook.com/",
    description: "Link para sua página no Facebook",
  },
];

export const BASIC_CTA_LIMIT = 2;

export function getCtaTypeById(id: CtaTypeId): CtaTypeDefinition | undefined {
  return ctaTypes.find((cta) => cta.id === id);
}

export function buildCtaUrl(type: CtaTypeId, value: string): string {
  const ctaType = getCtaTypeById(type);
  if (!ctaType) return value;

  // Remove prefix if user accidentally included it
  let cleanValue = value.trim();
  if (cleanValue.startsWith(ctaType.urlPrefix)) {
    cleanValue = cleanValue.replace(ctaType.urlPrefix, "");
  }
  // Remove @ from Instagram handles
  if (type === "instagram" && cleanValue.startsWith("@")) {
    cleanValue = cleanValue.slice(1);
  }

  return `${ctaType.urlPrefix}${cleanValue}`;
}
