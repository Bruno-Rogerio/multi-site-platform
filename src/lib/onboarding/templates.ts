/* ─── 8+ complete template presets for the Básico plan ─── */

export type TemplatePreset = {
  slug: string;
  name: string;
  category: string;
  description: string;
  paletteId: string;
  siteStyleId: string;
  fontFamily: string;
  buttonStyle: "rounded" | "pill" | "square";
  heroVariant: string;
  servicesVariant: string;
  ctaVariant: string;
  motionStyle: string;
  defaultContent: {
    heroEyebrow: string;
    heroTitle: string;
    heroSubtitle: string;
    heroCtaLabel: string;
    servicesTitle: string;
    serviceItems: string[];
    ctaTitle: string;
    ctaDescription: string;
    ctaButtonLabel: string;
  };
  previewColors: { bg: string; primary: string; accent: string; text: string };
};

export const templatePresets: TemplatePreset[] = [
  {
    slug: "terapia-pro",
    name: "Terapia Pro",
    category: "Saúde Mental",
    description: "Layout acolhedor com visual suave para profissionais de saúde mental",
    paletteId: "aurora-soft",
    siteStyleId: "soft-human",
    fontFamily: "Sora, sans-serif",
    buttonStyle: "pill",
    heroVariant: "split",
    servicesVariant: "minimal",
    ctaVariant: "banner",
    motionStyle: "motion-reveal",
    defaultContent: {
      heroEyebrow: "Psicologia online",
      heroTitle: "Cuidado emocional para viver com mais clareza",
      heroSubtitle: "Atendimento individual com foco em ansiedade, autoconhecimento e qualidade de vida.",
      heroCtaLabel: "Agendar sessão",
      servicesTitle: "Como posso te ajudar",
      serviceItems: ["Ansiedade e estresse", "Autoconfiança", "Organização emocional", "Relacionamentos"],
      ctaTitle: "Vamos conversar?",
      ctaDescription: "Agende uma sessão e veja como posso te ajudar.",
      ctaButtonLabel: "Falar no WhatsApp",
    },
    previewColors: { bg: "#F8FAFC", primary: "#2563EB", accent: "#A78BFA", text: "#0F172A" },
  },
  {
    slug: "coach-elegante",
    name: "Coach Elegante",
    category: "Coaching",
    description: "Visual editorial premium para coaches e mentores",
    paletteId: "midnight-violet",
    siteStyleId: "editorial",
    fontFamily: "Georgia, serif",
    buttonStyle: "square",
    heroVariant: "centered",
    servicesVariant: "default",
    ctaVariant: "default",
    motionStyle: "motion-reveal",
    defaultContent: {
      heroEyebrow: "Coaching executivo",
      heroTitle: "Desbloqueie seu potencial de liderança",
      heroSubtitle: "Mentoria personalizada para executivos e empreendedores que querem ir além.",
      heroCtaLabel: "Conhecer programas",
      servicesTitle: "Programas de desenvolvimento",
      serviceItems: ["Coaching individual", "Mentoria executiva", "Workshops de liderança", "Assessment 360"],
      ctaTitle: "Pronto para o próximo nível?",
      ctaDescription: "Agende uma conversa estratégica sem compromisso.",
      ctaButtonLabel: "Agendar conversa",
    },
    previewColors: { bg: "#111827", primary: "#7C5CFF", accent: "#38BDF8", text: "#EEF2FF" },
  },
  {
    slug: "nutri-fresh",
    name: "Nutri Fresh",
    category: "Nutrição",
    description: "Visual natural e acolhedor para nutricionistas",
    paletteId: "forest-trust",
    siteStyleId: "organic-warm",
    fontFamily: "Sora, sans-serif",
    buttonStyle: "rounded",
    heroVariant: "split",
    servicesVariant: "default",
    ctaVariant: "banner",
    motionStyle: "motion-reveal",
    defaultContent: {
      heroEyebrow: "Nutrição funcional",
      heroTitle: "Alimentação que transforma sua saúde",
      heroSubtitle: "Planos alimentares personalizados para cada fase da sua vida.",
      heroCtaLabel: "Agendar consulta",
      servicesTitle: "Atendimentos",
      serviceItems: ["Reeducação alimentar", "Nutrição esportiva", "Nutrição gestacional", "Emagrecimento saudável"],
      ctaTitle: "Comece sua transformação",
      ctaDescription: "Marque sua primeira consulta e receba seu plano personalizado.",
      ctaButtonLabel: "Falar comigo",
    },
    previewColors: { bg: "#0F172A", primary: "#15803D", accent: "#22C55E", text: "#ECFDF5" },
  },
  {
    slug: "consultor-tech",
    name: "Consultor Tech",
    category: "Tecnologia",
    description: "Visual moderno e impactante para consultores de TI",
    paletteId: "buildsphere",
    siteStyleId: "tech-modern",
    fontFamily: "Sora, sans-serif",
    buttonStyle: "rounded",
    heroVariant: "split",
    servicesVariant: "default",
    ctaVariant: "banner",
    motionStyle: "motion-reveal",
    defaultContent: {
      heroEyebrow: "Consultoria em tecnologia",
      heroTitle: "Soluções digitais para acelerar seu negócio",
      heroSubtitle: "Consultoria estratégica em infraestrutura, cloud e transformação digital.",
      heroCtaLabel: "Falar com especialista",
      servicesTitle: "Nossos serviços",
      serviceItems: ["Infraestrutura cloud", "Segurança digital", "Automação de processos", "Consultoria estratégica"],
      ctaTitle: "Vamos transformar seu negócio?",
      ctaDescription: "Entre em contato e receba uma análise gratuita.",
      ctaButtonLabel: "Solicitar análise",
    },
    previewColors: { bg: "#0B1020", primary: "#3B82F6", accent: "#22D3EE", text: "#EAF0FF" },
  },
  {
    slug: "advogado-premium",
    name: "Advogado Premium",
    category: "Direito",
    description: "Visual sério e profissional para escritórios de advocacia",
    paletteId: "mono-pro",
    siteStyleId: "bold-contrast",
    fontFamily: "Georgia, serif",
    buttonStyle: "square",
    heroVariant: "centered",
    servicesVariant: "minimal",
    ctaVariant: "default",
    motionStyle: "motion-none",
    defaultContent: {
      heroEyebrow: "Advocacia especializada",
      heroTitle: "Defesa estratégica com experiência comprovada",
      heroSubtitle: "Atuação em direito empresarial, trabalhista e contratual com excelência.",
      heroCtaLabel: "Consultar agora",
      servicesTitle: "Áreas de atuação",
      serviceItems: ["Direito empresarial", "Direito trabalhista", "Contratos", "Compliance"],
      ctaTitle: "Precisa de orientação jurídica?",
      ctaDescription: "Agende uma consulta com nossos especialistas.",
      ctaButtonLabel: "Agendar consulta",
    },
    previewColors: { bg: "#FAFAFA", primary: "#111827", accent: "#52525B", text: "#09090B" },
  },
  {
    slug: "personal-energia",
    name: "Personal Energia",
    category: "Fitness",
    description: "Visual energético e motivacional para personal trainers",
    paletteId: "solar-pop",
    siteStyleId: "bold-contrast",
    fontFamily: "Sora, sans-serif",
    buttonStyle: "pill",
    heroVariant: "centered",
    servicesVariant: "default",
    ctaVariant: "banner",
    motionStyle: "motion-reveal",
    defaultContent: {
      heroEyebrow: "Personal trainer",
      heroTitle: "Transforme seu corpo e sua mente",
      heroSubtitle: "Treinos personalizados com acompanhamento completo para resultados reais.",
      heroCtaLabel: "Começar agora",
      servicesTitle: "Modalidades",
      serviceItems: ["Treino funcional", "Musculacao", "HIIT", "Acompanhamento online"],
      ctaTitle: "Bora treinar?",
      ctaDescription: "Agende sua aula experimental gratuita.",
      ctaButtonLabel: "Agendar aula",
    },
    previewColors: { bg: "#111827", primary: "#F59E0B", accent: "#F97316", text: "#FFFBEB" },
  },
  {
    slug: "fotografo-criativo",
    name: "Fotógrafo Criativo",
    category: "Fotografia",
    description: "Visual minimalista e limpo para portfólio fotográfico",
    paletteId: "mono-pro",
    siteStyleId: "minimal-clean",
    fontFamily: "Sora, sans-serif",
    buttonStyle: "rounded",
    heroVariant: "minimal",
    servicesVariant: "minimal",
    ctaVariant: "default",
    motionStyle: "motion-reveal",
    defaultContent: {
      heroEyebrow: "Fotografia profissional",
      heroTitle: "Momentos que contam histórias",
      heroSubtitle: "Fotografia autoral para casamentos, ensaios e eventos corporativos.",
      heroCtaLabel: "Ver portfólio",
      servicesTitle: "Serviços",
      serviceItems: ["Casamentos", "Ensaios", "Eventos corporativos", "Fotografia de produto"],
      ctaTitle: "Vamos criar juntos?",
      ctaDescription: "Entre em contato e vamos planejar seu ensaio.",
      ctaButtonLabel: "Falar comigo",
    },
    previewColors: { bg: "#FAFAFA", primary: "#111827", accent: "#52525B", text: "#09090B" },
  },
  {
    slug: "educador-online",
    name: "Educador Online",
    category: "Educação",
    description: "Visual confiável e acessível para educadores e professores",
    paletteId: "forest-trust",
    siteStyleId: "soft-human",
    fontFamily: "Sora, sans-serif",
    buttonStyle: "rounded",
    heroVariant: "centered",
    servicesVariant: "default",
    ctaVariant: "banner",
    motionStyle: "motion-reveal",
    defaultContent: {
      heroEyebrow: "Educação online",
      heroTitle: "Aprenda no seu ritmo com quem entende",
      heroSubtitle: "Cursos e mentorias para profissionais que querem se destacar.",
      heroCtaLabel: "Conhecer cursos",
      servicesTitle: "Cursos disponíveis",
      serviceItems: ["Curso introdutorio", "Mentoria individual", "Workshop intensivo", "Masterclass"],
      ctaTitle: "Pronto para aprender?",
      ctaDescription: "Inscreva-se e comece sua jornada de aprendizado.",
      ctaButtonLabel: "Inscrever-se",
    },
    previewColors: { bg: "#0F172A", primary: "#15803D", accent: "#22C55E", text: "#ECFDF5" },
  },
];

export function getTemplateBySlug(slug: string): TemplatePreset | undefined {
  return templatePresets.find((t) => t.slug === slug);
}
