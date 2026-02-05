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
    category: "Saude Mental",
    description: "Layout acolhedor com visual suave para profissionais de saude mental",
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
      heroCtaLabel: "Agendar sessao",
      servicesTitle: "Como posso te ajudar",
      serviceItems: ["Ansiedade e estresse", "Autoconfianca", "Organizacao emocional", "Relacionamentos"],
      ctaTitle: "Vamos conversar?",
      ctaDescription: "Agende uma sessao e veja como posso te ajudar.",
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
      heroTitle: "Desbloqueie seu potencial de lideranca",
      heroSubtitle: "Mentoria personalizada para executivos e empreendedores que querem ir alem.",
      heroCtaLabel: "Conhecer programas",
      servicesTitle: "Programas de desenvolvimento",
      serviceItems: ["Coaching individual", "Mentoria executiva", "Workshops de lideranca", "Assessment 360"],
      ctaTitle: "Pronto para o proximo nivel?",
      ctaDescription: "Agende uma conversa estrategica sem compromisso.",
      ctaButtonLabel: "Agendar conversa",
    },
    previewColors: { bg: "#111827", primary: "#7C5CFF", accent: "#38BDF8", text: "#EEF2FF" },
  },
  {
    slug: "nutri-fresh",
    name: "Nutri Fresh",
    category: "Nutricao",
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
      heroEyebrow: "Nutricao funcional",
      heroTitle: "Alimentacao que transforma sua saude",
      heroSubtitle: "Planos alimentares personalizados para cada fase da sua vida.",
      heroCtaLabel: "Agendar consulta",
      servicesTitle: "Atendimentos",
      serviceItems: ["Reeducacao alimentar", "Nutricao esportiva", "Nutricao gestacional", "Emagrecimento saudavel"],
      ctaTitle: "Comece sua transformacao",
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
      heroTitle: "Solucoes digitais para acelerar seu negocio",
      heroSubtitle: "Consultoria estrategica em infraestrutura, cloud e transformacao digital.",
      heroCtaLabel: "Falar com especialista",
      servicesTitle: "Nossos servicos",
      serviceItems: ["Infraestrutura cloud", "Seguranca digital", "Automacao de processos", "Consultoria estrategica"],
      ctaTitle: "Vamos transformar seu negocio?",
      ctaDescription: "Entre em contato e receba uma analise gratuita.",
      ctaButtonLabel: "Solicitar analise",
    },
    previewColors: { bg: "#0B1020", primary: "#3B82F6", accent: "#22D3EE", text: "#EAF0FF" },
  },
  {
    slug: "advogado-premium",
    name: "Advogado Premium",
    category: "Direito",
    description: "Visual serio e profissional para escritorios de advocacia",
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
      heroTitle: "Defesa estrategica com experiencia comprovada",
      heroSubtitle: "Atuacao em direito empresarial, trabalhista e contratual com excelencia.",
      heroCtaLabel: "Consultar agora",
      servicesTitle: "Areas de atuacao",
      serviceItems: ["Direito empresarial", "Direito trabalhista", "Contratos", "Compliance"],
      ctaTitle: "Precisa de orientacao juridica?",
      ctaDescription: "Agende uma consulta com nossos especialistas.",
      ctaButtonLabel: "Agendar consulta",
    },
    previewColors: { bg: "#FAFAFA", primary: "#111827", accent: "#52525B", text: "#09090B" },
  },
  {
    slug: "personal-energia",
    name: "Personal Energia",
    category: "Fitness",
    description: "Visual energetico e motivacional para personal trainers",
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
      heroCtaLabel: "Comecar agora",
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
    name: "Fotografo Criativo",
    category: "Fotografia",
    description: "Visual minimalista e limpo para portfolio fotografico",
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
      heroTitle: "Momentos que contam historias",
      heroSubtitle: "Fotografia autoral para casamentos, ensaios e eventos corporativos.",
      heroCtaLabel: "Ver portfolio",
      servicesTitle: "Servicos",
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
    category: "Educacao",
    description: "Visual confiavel e acessivel para educadores e professores",
    paletteId: "forest-trust",
    siteStyleId: "soft-human",
    fontFamily: "Sora, sans-serif",
    buttonStyle: "rounded",
    heroVariant: "centered",
    servicesVariant: "default",
    ctaVariant: "banner",
    motionStyle: "motion-reveal",
    defaultContent: {
      heroEyebrow: "Educacao online",
      heroTitle: "Aprenda no seu ritmo com quem entende",
      heroSubtitle: "Cursos e mentorias para profissionais que querem se destacar.",
      heroCtaLabel: "Conhecer cursos",
      servicesTitle: "Cursos disponiveis",
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
