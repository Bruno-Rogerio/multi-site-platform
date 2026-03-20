/* ─── 20 template presets — cada um com identidade visual única ─── */

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
    statsItems?: Array<{ value: string; label: string }>;
  };
  previewColors: { bg: string; primary: string; accent: string; text: string };
};

export const templatePresets: TemplatePreset[] = [
  // ─── 1. ESSÊNCIA ────────────────────────────────────────────────────────────
  // Saúde mental / Psicologia / Terapia
  // Personalidade: acolhedor, suave, intimista — como uma sala segura
  // Lora serif + pill + minimal header + wave + reveal
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
      heroSubtitle:
        "Atendimento individual com escuta ativa, acolhimento genuíno e foco no seu bem-estar emocional.",
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
      statsItems: [
        { value: "200+", label: "Pacientes atendidos" },
        { value: "4.9★", label: "Avaliação média" },
        { value: "8 anos", label: "De experiência" },
      ],
    },
    previewColors: { bg: "#F8FAFC", primary: "#2563EB", accent: "#A78BFA", text: "#0F172A" },
  },

  // ─── 2. QUADRO ───────────────────────────────────────────────────────────────
  // Fotografia / Design / Artes visuais
  // Personalidade: editorial, escuro, dramático — obra de arte em movimento
  // Playfair Display + square + solid + diagonal + parallax
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
      heroSubtitle:
        "Fotografia de casamentos, ensaios e editorial com olhar único e estética inconfundível.",
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
      statsItems: [
        { value: "500+", label: "Sessões realizadas" },
        { value: "4.9★", label: "Avaliação" },
        { value: "7 anos", label: "Atuando no mercado" },
      ],
    },
    previewColors: { bg: "#0C0C0C", primary: "#F0E6D3", accent: "#FF4444", text: "#F0F0F0" },
  },

  // ─── 3. SINAL ────────────────────────────────────────────────────────────────
  // Coaching / Educação Digital / Mentoria
  // Personalidade: elétrico, ambicioso, transformador — energia de palco
  // Poppins + rounded + blur + curve + vivid
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
      heroSubtitle:
        "Metodologia comprovada para profissionais que querem crescer com clareza e estratégia.",
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
      statsItems: [
        { value: "300+", label: "Clientes transformados" },
        { value: "4.8★", label: "Satisfação" },
        { value: "5 anos", label: "De mentoria" },
      ],
    },
    previewColors: { bg: "#0B1020", primary: "#3B82F6", accent: "#22D3EE", text: "#EAF0FF" },
  },

  // ─── 4. ESTRUTURA ────────────────────────────────────────────────────────────
  // Jurídico / Finanças / Consultoria Executiva
  // Personalidade: austero, institucional, confiável — peso de toga
  // Montserrat + square + solid + line + fade
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
      heroSubtitle:
        "Atuação em direito empresarial, trabalhista e contratual com foco em resultados.",
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
      statsItems: [
        { value: "20+", label: "Anos de atuação" },
        { value: "500+", label: "Casos encerrados" },
        { value: "4.9★", label: "Avaliação" },
      ],
    },
    previewColors: { bg: "#FAFAFA", primary: "#1B2A4A", accent: "#B8962E", text: "#1B2A4A" },
  },

  // ─── 5. BROTO ────────────────────────────────────────────────────────────────
  // Nutrição / Yoga / Bem-estar Natural
  // Personalidade: orgânico, fresco, generoso — horta depois da chuva
  // Lora + pill + minimal + wave + reveal
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
      heroSubtitle:
        "Planos alimentares personalizados que respeitam seu corpo, sua rotina e seus objetivos.",
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
      statsItems: [
        { value: "400+", label: "Pacientes atendidos" },
        { value: "4.9★", label: "Avaliação" },
        { value: "6 anos", label: "De experiência" },
      ],
    },
    previewColors: { bg: "#F0FDFA", primary: "#0D9488", accent: "#14B8A6", text: "#134E4A" },
  },

  // ─── 6. CÓDIGO ───────────────────────────────────────────────────────────────
  // Tecnologia / Desenvolvimento / TI
  // Personalidade: preciso, técnico, noturno — terminal aberto às 2h
  // Sora + square + solid dark + none + vivid
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
      heroSubtitle:
        "Arquitetura, desenvolvimento e infraestrutura para startups e empresas em crescimento.",
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
      statsItems: [
        { value: "50+", label: "Projetos entregues" },
        { value: "4.9★", label: "Satisfação" },
        { value: "10 anos", label: "Em tecnologia" },
      ],
    },
    previewColors: { bg: "#0D1117", primary: "#00E5FF", accent: "#7C3AED", text: "#E6EDF3" },
  },

  // ─── 7. CENA ─────────────────────────────────────────────────────────────────
  // Música / Performance / Entretenimento ao vivo
  // Personalidade: dramático, envolvente, magnético — holofote no palco
  // Playfair Display + pill + blur + diagonal + parallax
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
      heroSubtitle:
        "Shows, eventos e projetos musicais com presença artística e emoção em cada nota.",
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
      statsItems: [
        { value: "200+", label: "Eventos realizados" },
        { value: "4.9★", label: "Avaliação" },
        { value: "12 anos", label: "De carreira" },
      ],
    },
    previewColors: { bg: "#111827", primary: "#7C5CFF", accent: "#38BDF8", text: "#EEF2FF" },
  },

  // ─── 8. FAÍSCA ───────────────────────────────────────────────────────────────
  // Fitness / Personal Trainer / Serviços locais
  // Personalidade: energético, direto, sem enrolação — suor e resultado
  // Inter + rounded + blur + wave + fade
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
      heroSubtitle:
        "Treinos personalizados online e presenciais para quem quer mudar de verdade.",
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
      statsItems: [
        { value: "500+", label: "Alunos treinados" },
        { value: "4.9★", label: "Avaliação" },
        { value: "8 anos", label: "De experiência" },
      ],
    },
    previewColors: { bg: "#111827", primary: "#F59E0B", accent: "#F97316", text: "#FFFBEB" },
  },

  // ─── 9. VELUDO ───────────────────────────────────────────────────────────────
  // Moda / Luxo / Beleza / Estética premium
  // Personalidade: sedutor, sombrio, luxuoso — perfume caro e luz baixa
  // Cormorant Garamond + pill + solid + none + parallax
  {
    slug: "veludo",
    name: "Veludo",
    category: "Moda & Beleza",
    description: "Sombrio e luxuoso para studios de estética, marcas de moda e clínicas premium",
    paletteId: "rose-luxe",
    fontFamily: "Cormorant Garamond, serif",
    buttonStyle: "pill",
    heroVariant: "card",
    servicesVariant: "masonry",
    ctaVariant: "centered-gradient",
    motionStyle: "motion-parallax",
    headerStyle: "solid",
    dividerStyle: "none",
    defaultContent: {
      heroEyebrow: "Studio de Estética Avançada",
      heroTitle: "Beleza que transforma, experiência que encanta",
      heroSubtitle:
        "Procedimentos de alta performance em um ambiente exclusivo pensado para o seu bem-estar.",
      heroCtaLabel: "Agendar agora",
      servicesTitle: "Tratamentos",
      serviceItems: [
        "Skincare personalizado",
        "Design de sobrancelhas",
        "Procedimentos faciais",
        "Massagem e relaxamento",
      ],
      ctaTitle: "Sua melhor versão te espera",
      ctaDescription: "Agende uma avaliação e descubra o tratamento ideal para você.",
      ctaButtonLabel: "Quero meu horário",
      statsItems: [
        { value: "1.200+", label: "Clientes atendidas" },
        { value: "4.9★", label: "Avaliação" },
        { value: "9 anos", label: "De experiência" },
      ],
    },
    previewColors: { bg: "#1F1022", primary: "#E11D48", accent: "#FB7185", text: "#FFF1F2" },
  },

  // ─── 10. FLORESTA ────────────────────────────────────────────────────────────
  // Sustentabilidade / Agronegócio / Meio ambiente / ESG
  // Personalidade: enraizado, confiável, próspero — cheiro de terra molhada
  // Merriweather + rounded + minimal + wave + reveal
  {
    slug: "floresta",
    name: "Floresta",
    category: "Sustentabilidade & Agro",
    description: "Enraizado e confiável para negócios sustentáveis, agronegócio e consultores ESG",
    paletteId: "forest-trust",
    fontFamily: "Merriweather, serif",
    buttonStyle: "rounded",
    heroVariant: "split",
    servicesVariant: "columns",
    ctaVariant: "banner",
    motionStyle: "motion-reveal",
    headerStyle: "minimal",
    dividerStyle: "wave",
    defaultContent: {
      heroEyebrow: "Consultoria Ambiental",
      heroTitle: "Crescimento que respeita o futuro",
      heroSubtitle:
        "Estratégias ESG, certificações ambientais e gestão sustentável para empresas que querem crescer com responsabilidade.",
      heroCtaLabel: "Falar com consultor",
      servicesTitle: "Nossas soluções",
      serviceItems: [
        "Diagnóstico ESG",
        "Certificações ambientais",
        "Gestão de resíduos",
        "Relatórios de impacto",
      ],
      ctaTitle: "Sua empresa mais sustentável",
      ctaDescription: "Agende uma reunião e vamos mapear o caminho certo para o seu negócio.",
      ctaButtonLabel: "Iniciar diagnóstico",
      statsItems: [
        { value: "80+", label: "Empresas certificadas" },
        { value: "15 anos", label: "De atuação" },
        { value: "4.8★", label: "Avaliação" },
      ],
    },
    previewColors: { bg: "#0F172A", primary: "#15803D", accent: "#22C55E", text: "#F0FDF4" },
  },

  // ─── 11. CROMO ───────────────────────────────────────────────────────────────
  // Design / Consultoria independente / Arquitetura / Minimalismo B&W
  // Personalidade: ultra-clean, sem ruído, autoconfiante — branco e silêncio
  // DM Sans + square + minimal + line + fade
  {
    slug: "cromo",
    name: "Cromo",
    category: "Design & Consultoria",
    description: "Minimalismo absoluto em preto e branco para designers, arquitetos e consultores independentes",
    paletteId: "mono-pro",
    fontFamily: "DM Sans, sans-serif",
    buttonStyle: "square",
    heroVariant: "minimal",
    servicesVariant: "minimal-list",
    ctaVariant: "centered",
    motionStyle: "motion-fade",
    headerStyle: "minimal",
    dividerStyle: "line",
    defaultContent: {
      heroEyebrow: "Design & Estratégia",
      heroTitle: "Menos ruído. Mais resultado.",
      heroSubtitle:
        "Projetos de design e estratégia para marcas que valorizam clareza, consistência e impacto real.",
      heroCtaLabel: "Ver projetos",
      servicesTitle: "Serviços",
      serviceItems: [
        "Identidade visual",
        "Estratégia de marca",
        "Design de produto",
        "Consultoria criativa",
      ],
      ctaTitle: "Pronto para simplificar?",
      ctaDescription: "Vamos conversar sobre o seu projeto.",
      ctaButtonLabel: "Entrar em contato",
      statsItems: [
        { value: "120+", label: "Projetos concluídos" },
        { value: "40+", label: "Marcas criadas" },
        { value: "6 anos", label: "De mercado" },
      ],
    },
    previewColors: { bg: "#FAFAFA", primary: "#111827", accent: "#52525B", text: "#111827" },
  },

  // ─── 12. OCEANO ──────────────────────────────────────────────────────────────
  // Startup / SaaS / Produto digital / Inovação
  // Personalidade: profundo, expansivo, inovador — startups do futuro
  // Space Grotesk + rounded + blur + diagonal + vivid
  {
    slug: "oceano",
    name: "Oceano",
    category: "Startup & Digital",
    description: "Profundo e inovador para startups, produtos SaaS e empresas de tecnologia digital",
    paletteId: "ocean-deep",
    fontFamily: "Space Grotesk, sans-serif",
    buttonStyle: "rounded",
    heroVariant: "centered-gradient",
    servicesVariant: "steps",
    ctaVariant: "centered-gradient",
    motionStyle: "motion-vivid",
    headerStyle: "blur",
    dividerStyle: "diagonal",
    defaultContent: {
      heroEyebrow: "Produto Digital",
      heroTitle: "A ferramenta que o seu negócio precisava",
      heroSubtitle:
        "Automatize processos, centralize dados e escale suas operações com uma solução feita sob medida.",
      heroCtaLabel: "Teste grátis",
      servicesTitle: "O que resolvemos",
      serviceItems: [
        "Automação de processos",
        "Análise de dados",
        "Integrações e APIs",
        "Suporte especializado",
      ],
      ctaTitle: "Comece hoje, sem burocracia",
      ctaDescription: "14 dias grátis, sem cartão de crédito. Cancele quando quiser.",
      ctaButtonLabel: "Criar conta grátis",
      statsItems: [
        { value: "5.000+", label: "Empresas ativas" },
        { value: "99.9%", label: "Uptime" },
        { value: "4.8★", label: "No App Store" },
      ],
    },
    previewColors: { bg: "#082F49", primary: "#0EA5E9", accent: "#06B6D4", text: "#F0F9FF" },
  },

  // ─── 13. ÂMBAR ───────────────────────────────────────────────────────────────
  // Gastronomia / Restaurante / Chef / Eventos gastronômicos
  // Personalidade: quente, artesanal, gostoso — brasa e aromas
  // Fraunces + pill + solid + none + reveal
  {
    slug: "ambar",
    name: "Âmbar",
    category: "Gastronomia & Chef",
    description: "Quente e artesanal para chefs, restaurantes, buffets e experiências gastronômicas",
    paletteId: "warm-premium",
    fontFamily: "Fraunces, serif",
    buttonStyle: "pill",
    heroVariant: "card",
    servicesVariant: "default",
    ctaVariant: "banner",
    motionStyle: "motion-reveal",
    headerStyle: "solid",
    dividerStyle: "none",
    defaultContent: {
      heroEyebrow: "Chef & Gastronomia Autoral",
      heroTitle: "Sabores que contam histórias",
      heroSubtitle:
        "Criações gastronômicas com ingredientes selecionados, técnica apurada e muito amor em cada prato.",
      heroCtaLabel: "Ver cardápio",
      servicesTitle: "O que oferecemos",
      serviceItems: [
        "Cardápio degustação",
        "Eventos & jantares exclusivos",
        "Aulas de culinária",
        "Personal chef",
      ],
      ctaTitle: "Reserve sua mesa",
      ctaDescription: "Experiências gastronômicas únicas, sob encomenda ou no espaço.",
      ctaButtonLabel: "Fazer reserva",
      statsItems: [
        { value: "2.000+", label: "Jantares servidos" },
        { value: "4.9★", label: "Avaliação" },
        { value: "14 anos", label: "De cozinha" },
      ],
    },
    previewColors: { bg: "#1C1917", primary: "#C2410C", accent: "#FB7185", text: "#FFF7ED" },
  },

  // ─── 14. TEMPLO ──────────────────────────────────────────────────────────────
  // Espiritualidade / Meditação / Retiros / Terapias holísticas
  // Personalidade: sereno, etéreo, contemplativo — névoa e incenso
  // EB Garamond + pill + minimal + curve + reveal (suave como aurora-soft mas diferente)
  {
    slug: "templo",
    name: "Templo",
    category: "Espiritualidade & Retiros",
    description: "Sereno e etéreo para professores de meditação, retiros espirituais e terapias holísticas",
    paletteId: "aurora-soft",
    fontFamily: "EB Garamond, serif",
    buttonStyle: "pill",
    heroVariant: "centered",
    servicesVariant: "columns",
    ctaVariant: "centered",
    motionStyle: "motion-reveal",
    headerStyle: "minimal",
    dividerStyle: "curve",
    defaultContent: {
      heroEyebrow: "Meditação & Consciência",
      heroTitle: "O caminho para dentro começa aqui",
      heroSubtitle:
        "Práticas de meditação, respiração e autoconhecimento para uma vida com mais presença e equilíbrio.",
      heroCtaLabel: "Explorar práticas",
      servicesTitle: "Práticas que ofereço",
      serviceItems: [
        "Meditação guiada",
        "Retiros de silêncio",
        "Respiração consciente",
        "Círculos de mulheres",
      ],
      ctaTitle: "Encontre seu centro",
      ctaDescription: "Participe de uma sessão gratuita e sinta a diferença.",
      ctaButtonLabel: "Reservar meu lugar",
      statsItems: [
        { value: "800+", label: "Participantes" },
        { value: "30+", label: "Retiros realizados" },
        { value: "10 anos", label: "De prática" },
      ],
    },
    previewColors: { bg: "#F8FAFC", primary: "#2563EB", accent: "#A78BFA", text: "#0F172A" },
  },

  // ─── 15. PRISMA ──────────────────────────────────────────────────────────────
  // Agência criativa / Marketing digital / Branding
  // Personalidade: criativo, multifacetado, estratégico — ideias que brilham
  // Plus Jakarta Sans + rounded + blur + diagonal + vivid (buildsphere alt)
  {
    slug: "prisma",
    name: "Prisma",
    category: "Agência & Marketing",
    description: "Criativo e estratégico para agências de marketing, branding e growth hacking",
    paletteId: "buildsphere",
    fontFamily: "Plus Jakarta Sans, sans-serif",
    buttonStyle: "rounded",
    heroVariant: "split",
    servicesVariant: "default",
    ctaVariant: "banner-gradient",
    motionStyle: "motion-vivid",
    headerStyle: "blur",
    dividerStyle: "diagonal",
    defaultContent: {
      heroEyebrow: "Agência de Marketing Digital",
      heroTitle: "Marcas que crescem, campanhas que convertem",
      heroSubtitle:
        "Estratégia, criação e performance para negócios que querem dominar o digital.",
      heroCtaLabel: "Ver cases",
      servicesTitle: "O que fazemos",
      serviceItems: [
        "Estratégia de marca",
        "Tráfego pago",
        "Conteúdo e SEO",
        "Social media",
      ],
      ctaTitle: "Sua marca no próximo nível",
      ctaDescription: "Agende um diagnóstico gratuito do seu marketing digital.",
      ctaButtonLabel: "Quero crescer",
      statsItems: [
        { value: "150+", label: "Clientes atendidos" },
        { value: "R$2M+", label: "Em tráfego gerenciado" },
        { value: "4.9★", label: "Satisfação" },
      ],
    },
    previewColors: { bg: "#0B1020", primary: "#3B82F6", accent: "#22D3EE", text: "#EAF0FF" },
  },

  // ─── 16. NOTURNO ─────────────────────────────────────────────────────────────
  // Jornalismo / Podcast / Conteúdo / Comunicação
  // Personalidade: profundo, opinativo, cult — mic aberto, luz vermelha
  // Merriweather + square + solid + none (editorial-dark alt)
  {
    slug: "noturno",
    name: "Noturno",
    category: "Podcast & Conteúdo",
    description: "Profundo e opinativo para podcasters, jornalistas, criadores e comunicadores",
    paletteId: "editorial-dark",
    fontFamily: "Merriweather, serif",
    buttonStyle: "square",
    heroVariant: "minimal",
    servicesVariant: "minimal-list",
    ctaVariant: "centered",
    motionStyle: "motion-fade",
    headerStyle: "solid",
    dividerStyle: "none",
    defaultContent: {
      heroEyebrow: "Podcast & Jornalismo",
      heroTitle: "Histórias que precisam ser contadas",
      heroSubtitle:
        "Conteúdo investigativo, entrevistas e análises que informam, provocam e ficam.",
      heroCtaLabel: "Ouvir agora",
      servicesTitle: "Formatos",
      serviceItems: [
        "Podcast semanal",
        "Newsletter",
        "Reportagens especiais",
        "Parcerias editoriais",
      ],
      ctaTitle: "Não perca nenhum episódio",
      ctaDescription: "Assine a newsletter e receba todo conteúdo em primeira mão.",
      ctaButtonLabel: "Assinar grátis",
      statsItems: [
        { value: "50K+", label: "Ouvintes mensais" },
        { value: "200+", label: "Episódios" },
        { value: "4.8★", label: "Avaliação" },
      ],
    },
    previewColors: { bg: "#0C0C0C", primary: "#F0E6D3", accent: "#FF4444", text: "#F0F0F0" },
  },

  // ─── 17. VOLTAGEM ────────────────────────────────────────────────────────────
  // Eventos / Festas / DJ / Entretenimento
  // Personalidade: explosivo, pop, irreverente — festa que não acaba
  // Poppins + pill + blur + wave + vivid (solar-pop alt)
  {
    slug: "voltagem",
    name: "Voltagem",
    category: "Eventos & DJ",
    description: "Explosivo e pop para organizadores de eventos, DJs, MCs e produtoras de festas",
    paletteId: "solar-pop",
    fontFamily: "Poppins, sans-serif",
    buttonStyle: "pill",
    heroVariant: "centered-gradient",
    servicesVariant: "default",
    ctaVariant: "centered-gradient",
    motionStyle: "motion-vivid",
    headerStyle: "blur",
    dividerStyle: "wave",
    defaultContent: {
      heroEyebrow: "DJ & Produtor de Eventos",
      heroTitle: "A festa começa quando eu chego",
      heroSubtitle:
        "Sets exclusivos, produção completa e energia que transforma qualquer evento em uma noite inesquecível.",
      heroCtaLabel: "Verificar data",
      servicesTitle: "O que oferece",
      serviceItems: [
        "Festas privadas",
        "Eventos corporativos",
        "Shows e festivais",
        "Casamentos",
      ],
      ctaTitle: "Bora fazer sua festa bombar?",
      ctaDescription: "Manda mensagem e conta como você imagina o seu evento.",
      ctaButtonLabel: "Fazer orçamento",
      statsItems: [
        { value: "500+", label: "Eventos realizados" },
        { value: "4.9★", label: "Avaliação" },
        { value: "10 anos", label: "Na pista" },
      ],
    },
    previewColors: { bg: "#111827", primary: "#F59E0B", accent: "#F97316", text: "#FFFBEB" },
  },

  // ─── 18. CRISTAL ─────────────────────────────────────────────────────────────
  // SaaS B2B / Produto digital / Infraestrutura / Cloud
  // Personalidade: preciso, moderno, confiável — dados em ordem
  // Space Grotesk + square + solid + none (dark-tech alt)
  {
    slug: "cristal",
    name: "Cristal",
    category: "SaaS & Produto",
    description: "Preciso e confiável para produtos SaaS B2B, plataformas e ferramentas de infraestrutura",
    paletteId: "dark-tech",
    fontFamily: "Space Grotesk, sans-serif",
    buttonStyle: "square",
    heroVariant: "centered",
    servicesVariant: "steps",
    ctaVariant: "double",
    motionStyle: "motion-fade",
    headerStyle: "solid",
    dividerStyle: "none",
    defaultContent: {
      heroEyebrow: "Plataforma B2B",
      heroTitle: "Operações mais rápidas, times mais eficientes",
      heroSubtitle:
        "Centralize, automatize e monitore suas operações com dashboards em tempo real e integrações nativas.",
      heroCtaLabel: "Ver demonstração",
      servicesTitle: "Módulos",
      serviceItems: [
        "Gestão de projetos",
        "Automação de fluxos",
        "Analytics em tempo real",
        "Integrações via API",
      ],
      ctaTitle: "Pronto para operar em outro nível?",
      ctaDescription: "Comece com 30 dias grátis. Sem limite de usuários.",
      ctaButtonLabel: "Criar conta",
      statsItems: [
        { value: "10K+", label: "Times usando" },
        { value: "99.8%", label: "SLA garantido" },
        { value: "3x", label: "Mais produtividade" },
      ],
    },
    previewColors: { bg: "#0D1117", primary: "#00E5FF", accent: "#7C3AED", text: "#E6EDF3" },
  },

  // ─── 19. ESPIRAL ─────────────────────────────────────────────────────────────
  // Arte / Ilustração / Tatuagem / Arte urbana
  // Personalidade: onírico, artístico, incomum — criatividade sem moldura
  // Cormorant Garamond + pill + blur + curve + parallax (midnight-violet alt)
  {
    slug: "espiral",
    name: "Espiral",
    category: "Arte & Ilustração",
    description: "Onírico e artístico para ilustradores, tatuadores, artistas plásticos e arte urbana",
    paletteId: "midnight-violet",
    fontFamily: "Cormorant Garamond, serif",
    buttonStyle: "pill",
    heroVariant: "card",
    servicesVariant: "masonry",
    ctaVariant: "centered-gradient",
    motionStyle: "motion-parallax",
    headerStyle: "blur",
    dividerStyle: "curve",
    defaultContent: {
      heroEyebrow: "Ilustração & Arte Autoral",
      heroTitle: "Arte que vive além das telas",
      heroSubtitle:
        "Criações únicas, commissions e peças originais que carregam emoção, intenção e identidade.",
      heroCtaLabel: "Ver portfólio",
      servicesTitle: "O que crio",
      serviceItems: [
        "Ilustrações digitais",
        "Commissions personalizadas",
        "Murais e arte urbana",
        "Estampas e produtos",
      ],
      ctaTitle: "Vamos criar algo único?",
      ctaDescription: "Manda mensagem com a sua ideia e vamos dar vida a ela.",
      ctaButtonLabel: "Solicitar commission",
      statsItems: [
        { value: "300+", label: "Peças criadas" },
        { value: "15+", label: "Países alcançados" },
        { value: "4.9★", label: "Avaliação" },
      ],
    },
    previewColors: { bg: "#111827", primary: "#7C5CFF", accent: "#38BDF8", text: "#EEF2FF" },
  },

  // ─── 20. FERRO ───────────────────────────────────────────────────────────────
  // Engenharia / Construção Civil / Arquitetura / Projetos
  // Personalidade: sólido, técnico, robusto — fundação que não cede
  // Montserrat + square + solid + line (corporate-navy alt)
  {
    slug: "ferro",
    name: "Ferro",
    category: "Engenharia & Arquitetura",
    description: "Sólido e técnico para engenheiros, construtoras, arquitetos e gestores de projetos",
    paletteId: "corporate-navy",
    fontFamily: "Montserrat, sans-serif",
    buttonStyle: "square",
    heroVariant: "split",
    servicesVariant: "columns",
    ctaVariant: "double",
    motionStyle: "motion-fade",
    headerStyle: "solid",
    dividerStyle: "line",
    defaultContent: {
      heroEyebrow: "Engenharia & Construção",
      heroTitle: "Projetos que ficam de pé por décadas",
      heroSubtitle:
        "Soluções em engenharia civil, gestão de obras e projetos estruturais com rigor técnico e prazos cumpridos.",
      heroCtaLabel: "Solicitar orçamento",
      servicesTitle: "Especialidades",
      serviceItems: [
        "Projetos estruturais",
        "Gerenciamento de obras",
        "Laudos e perícias",
        "Reforma e retrofit",
      ],
      ctaTitle: "Seu projeto nas mãos certas",
      ctaDescription: "Solicite um orçamento detalhado sem compromisso.",
      ctaButtonLabel: "Pedir orçamento",
      statsItems: [
        { value: "300+", label: "Obras entregues" },
        { value: "25 anos", label: "No mercado" },
        { value: "4.9★", label: "Avaliação" },
      ],
    },
    previewColors: { bg: "#FAFAFA", primary: "#1B2A4A", accent: "#B8962E", text: "#1B2A4A" },
  },
];

export function getTemplateBySlug(slug: string): TemplatePreset | undefined {
  return templatePresets.find((t) => t.slug === slug);
}
