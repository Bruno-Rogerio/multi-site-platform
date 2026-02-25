/* ─── 8 template presets — cada um com identidade visual única ─── */

export type TemplatePreset = {
  slug: string;
  name: string;
  category: string;
  description: string;
  paletteId: string;
  fontFamily: string;
  buttonStyle: "rounded" | "pill" | "square";
  heroVariant: string;
  servicesVariant: string;
  ctaVariant: string;
  motionStyle: string;
  headerStyle: "blur" | "solid" | "minimal";
  dividerStyle: "wave" | "diagonal" | "curve" | "line" | "none";
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
  // ─── 1. ESSÊNCIA ─── Saúde / Terapia / Bem-estar
  // Visual: suave, acolhedor, serif elegante, pill buttons, header minimalista
  {
    slug: "essencia",
    name: "Essência",
    category: "Saúde & Terapia",
    description: "Visual orgânico e acolhedor para profissionais de saúde mental e bem-estar",
    paletteId: "aurora-soft",
    fontFamily: "Lora, serif",
    buttonStyle: "pill",
    heroVariant: "split",
    servicesVariant: "columns",
    ctaVariant: "banner",
    motionStyle: "motion-reveal",
    headerStyle: "minimal",
    dividerStyle: "wave",
    defaultContent: {
      heroEyebrow: "Psicologia & Saúde Mental",
      heroTitle: "Um espaço seguro para cuidar de você",
      heroSubtitle: "Atendimento individual com escuta ativa, acolhimento e foco no seu bem-estar emocional.",
      heroCtaLabel: "Agendar sessão",
      servicesTitle: "Como posso te ajudar",
      serviceItems: [
        "Terapia individual",
        "Ansiedade e estresse",
        "Autoconhecimento",
        "Relacionamentos e vínculos",
      ],
      ctaTitle: "Dê o primeiro passo",
      ctaDescription: "A mudança começa com uma conversa. Agende sua primeira sessão.",
      ctaButtonLabel: "Falar comigo",
    },
    previewColors: { bg: "#F8FAFC", primary: "#2563EB", accent: "#A78BFA", text: "#0F172A" },
  },

  // ─── 2. QUADRO ─── Fotografia / Design / Artes Visuais
  // Visual: editorial, escuro, sem bordas, Playfair, botão quadrado, header sólido
  {
    slug: "quadro",
    name: "Quadro",
    category: "Fotografia & Design",
    description: "Editorial e impactante para fotógrafos, designers e artistas visuais",
    paletteId: "editorial-dark",
    fontFamily: "Playfair Display, serif",
    buttonStyle: "square",
    heroVariant: "card",
    servicesVariant: "masonry",
    ctaVariant: "banner-gradient",
    motionStyle: "motion-parallax",
    headerStyle: "solid",
    dividerStyle: "diagonal",
    defaultContent: {
      heroEyebrow: "Fotografia autoral",
      heroTitle: "Imagens que ficam na memória",
      heroSubtitle: "Fotografia de casamentos, ensaios e editorial com olhar único e estética inconfundível.",
      heroCtaLabel: "Ver portfólio",
      servicesTitle: "Serviços",
      serviceItems: [
        "Casamentos & celebrações",
        "Ensaios pessoais",
        "Editorial de moda",
        "Fotografia corporativa",
      ],
      ctaTitle: "Vamos criar juntos?",
      ctaDescription: "Entre em contato e vamos planejar algo incrível.",
      ctaButtonLabel: "Iniciar projeto",
    },
    previewColors: { bg: "#0C0C0C", primary: "#F0E6D3", accent: "#FF4444", text: "#F0F0F0" },
  },

  // ─── 3. SINAL ─── Coaching / Educação Digital / Marketing
  // Visual: elétrico, gradiente, Poppins, rounded, header blur, curva
  {
    slug: "sinal",
    name: "Sinal",
    category: "Coaching & Educação",
    description: "Elétrico e moderno para coaches, educadores digitais e mentores",
    paletteId: "buildsphere",
    fontFamily: "Poppins, sans-serif",
    buttonStyle: "rounded",
    heroVariant: "centered-gradient",
    servicesVariant: "steps",
    ctaVariant: "centered-gradient",
    motionStyle: "motion-vivid",
    headerStyle: "blur",
    dividerStyle: "curve",
    defaultContent: {
      heroEyebrow: "Mentoria & Transformação",
      heroTitle: "Desbloqueie seu próximo nível",
      heroSubtitle: "Metodologia comprovada para profissionais que querem crescer com clareza e estratégia.",
      heroCtaLabel: "Começar agora",
      servicesTitle: "O processo",
      serviceItems: [
        "Diagnóstico e clareza",
        "Estratégia personalizada",
        "Execução com suporte",
        "Resultados e expansão",
      ],
      ctaTitle: "Pronto para mudar de patamar?",
      ctaDescription: "Agende uma conversa estratégica gratuita e descubra seu próximo passo.",
      ctaButtonLabel: "Quero evoluir",
    },
    previewColors: { bg: "#0B1020", primary: "#3B82F6", accent: "#22D3EE", text: "#EAF0FF" },
  },

  // ─── 4. ESTRUTURA ─── Jurídico / Finanças / Consultoria Executiva
  // Visual: corporativo austero, navy+ouro, Montserrat, quadrado, header sólido navy, linha
  {
    slug: "estrutura",
    name: "Estrutura",
    category: "Jurídico & Finanças",
    description: "Sério e sofisticado para advogados, contadores e consultores executivos",
    paletteId: "corporate-navy",
    fontFamily: "Montserrat, sans-serif",
    buttonStyle: "square",
    heroVariant: "minimal",
    servicesVariant: "minimal-list",
    ctaVariant: "double",
    motionStyle: "motion-fade",
    headerStyle: "solid",
    dividerStyle: "line",
    defaultContent: {
      heroEyebrow: "Advocacia Especializada",
      heroTitle: "Defesa estratégica com excelência e rigor",
      heroSubtitle: "Atuação em direito empresarial, trabalhista e contratual com foco em resultados.",
      heroCtaLabel: "Consultar agora",
      servicesTitle: "Áreas de atuação",
      serviceItems: [
        "Direito empresarial",
        "Direito trabalhista",
        "Contratos e compliance",
        "Consultoria preventiva",
      ],
      ctaTitle: "Precisando de orientação jurídica?",
      ctaDescription: "Agende uma consulta e proteja seus interesses com especialistas.",
      ctaButtonLabel: "Agendar consulta",
    },
    previewColors: { bg: "#FAFAFA", primary: "#1B2A4A", accent: "#B8962E", text: "#1B2A4A" },
  },

  // ─── 5. BROTO ─── Nutrição / Yoga / Bem-estar Natural
  // Visual: fresco, orgânico, mint+verde, Lora, pill, header minimalista, wave
  {
    slug: "broto",
    name: "Broto",
    category: "Nutrição & Yoga",
    description: "Natural e acolhedor para nutricionistas, professores de yoga e terapeutas holísticos",
    paletteId: "mint-cloud",
    fontFamily: "Lora, serif",
    buttonStyle: "pill",
    heroVariant: "centered",
    servicesVariant: "default",
    ctaVariant: "centered",
    motionStyle: "motion-reveal",
    headerStyle: "minimal",
    dividerStyle: "wave",
    defaultContent: {
      heroEyebrow: "Nutrição funcional",
      heroTitle: "Alimentação que nutre de dentro para fora",
      heroSubtitle: "Planos alimentares personalizados que respeitam seu corpo, sua rotina e seus objetivos.",
      heroCtaLabel: "Agendar consulta",
      servicesTitle: "Cuidados que ofereço",
      serviceItems: [
        "Reeducação alimentar",
        "Nutrição esportiva",
        "Saúde digestiva",
        "Acompanhamento online",
      ],
      ctaTitle: "Sua saúde começa hoje",
      ctaDescription: "Agende sua primeira consulta e receba um plano feito só para você.",
      ctaButtonLabel: "Falar comigo",
    },
    previewColors: { bg: "#F0FDFA", primary: "#0D9488", accent: "#14B8A6", text: "#134E4A" },
  },

  // ─── 6. CÓDIGO ─── TI / Desenvolvimento / Engenharia
  // Visual: dark tech, ciano elétrico, Sora, quadrado, header sólido escuro, sem divisor
  {
    slug: "codigo",
    name: "Código",
    category: "Tecnologia & TI",
    description: "Preciso e técnico para desenvolvedores, engenheiros e consultores de TI",
    paletteId: "dark-tech",
    fontFamily: "Sora, sans-serif",
    buttonStyle: "square",
    heroVariant: "split",
    servicesVariant: "steps",
    ctaVariant: "banner",
    motionStyle: "motion-vivid",
    headerStyle: "solid",
    dividerStyle: "none",
    defaultContent: {
      heroEyebrow: "Consultoria em Tecnologia",
      heroTitle: "Soluções digitais que escalam com seu negócio",
      heroSubtitle: "Arquitetura, desenvolvimento e infraestrutura para startups e empresas em crescimento.",
      heroCtaLabel: "Falar com especialista",
      servicesTitle: "O que entrego",
      serviceItems: [
        "Diagnóstico técnico",
        "Arquitetura de solução",
        "Desenvolvimento e entrega",
        "Manutenção e suporte",
      ],
      ctaTitle: "Vamos resolver isso juntos?",
      ctaDescription: "Me conta o problema, eu te mostro como resolver.",
      ctaButtonLabel: "Iniciar conversa",
    },
    previewColors: { bg: "#0D1117", primary: "#00E5FF", accent: "#7C3AED", text: "#E6EDF3" },
  },

  // ─── 7. CENA ─── Música / Performance / Entretenimento
  // Visual: dramático, violeta profundo, Playfair, pill, header blur roxo, diagonal
  {
    slug: "cena",
    name: "Cena",
    category: "Música & Performance",
    description: "Dramático e envolvente para músicos, performers, DJs e artistas de palco",
    paletteId: "midnight-violet",
    fontFamily: "Playfair Display, serif",
    buttonStyle: "pill",
    heroVariant: "centered-gradient",
    servicesVariant: "masonry",
    ctaVariant: "centered-gradient",
    motionStyle: "motion-parallax",
    headerStyle: "blur",
    dividerStyle: "diagonal",
    defaultContent: {
      heroEyebrow: "Música & Performance ao vivo",
      heroTitle: "Cada apresentação, uma experiência única",
      heroSubtitle: "Shows, eventos e projetos musicais com presença artística e emoção em cada nota.",
      heroCtaLabel: "Ver agenda",
      servicesTitle: "O que apresento",
      serviceItems: [
        "Shows ao vivo",
        "Eventos corporativos",
        "Casamentos & cerimônias",
        "Gravações e estúdio",
      ],
      ctaTitle: "Leve a música ao seu evento",
      ctaDescription: "Entre em contato para verificar disponibilidade e montar seu projeto.",
      ctaButtonLabel: "Fazer proposta",
    },
    previewColors: { bg: "#111827", primary: "#7C5CFF", accent: "#38BDF8", text: "#EEF2FF" },
  },

  // ─── 8. FAÍSCA ─── Fitness / Personal / Serviços Locais
  // Visual: energético, laranja quente, Inter, rounded, header blur, wave
  {
    slug: "faisca",
    name: "Faísca",
    category: "Fitness & Serviços",
    description: "Energético e direto para personal trainers, eletricistas, reformas e serviços locais",
    paletteId: "solar-pop",
    fontFamily: "Inter, sans-serif",
    buttonStyle: "rounded",
    heroVariant: "split",
    servicesVariant: "default",
    ctaVariant: "banner-gradient",
    motionStyle: "motion-fade",
    headerStyle: "blur",
    dividerStyle: "wave",
    defaultContent: {
      heroEyebrow: "Personal Trainer",
      heroTitle: "Resultados reais, sem enrolação",
      heroSubtitle: "Treinos personalizados online e presenciais para quem quer mudar de verdade.",
      heroCtaLabel: "Agendar aula grátis",
      servicesTitle: "Modalidades",
      serviceItems: [
        "Treino funcional",
        "Musculação",
        "HIIT e condicionamento",
        "Acompanhamento online",
      ],
      ctaTitle: "Bora começar?",
      ctaDescription: "Agende sua aula experimental gratuita e sinta a diferença.",
      ctaButtonLabel: "Agendar agora",
    },
    previewColors: { bg: "#111827", primary: "#F59E0B", accent: "#F97316", text: "#FFFBEB" },
  },
];

export function getTemplateBySlug(slug: string): TemplatePreset | undefined {
  return templatePresets.find((t) => t.slug === slug);
}
