/* ─── Conteúdo mockado por segmento de negócio ─── */
/* Pré-preenchido no wizard para que todas as seções (FAQ, Blog, Galeria,
   Agenda, Números) já apareçam com conteúdo contextualizado desde o início. */

type FaqItem = { question: string; answer: string };
type BlogPost = { title: string; excerpt: string; imageUrl: string; link: string };
type GalleryImage = { url: string; alt: string; caption: string };
type EventItem = { title: string; date: string; time: string; location: string; description: string };
type StatsItem = { value: string; label: string };

type MockSectionContent = {
  faqItems: FaqItem[];
  blogPosts: BlogPost[];
  galleryImages: GalleryImage[];
  events: EventItem[];
  statsItems: StatsItem[];
};

/** Gera URL de imagem placeholder consistente por seed */
function pic(seed: string, w = 600, h = 600): string {
  return `https://picsum.photos/seed/${seed}/${w}/${h}`;
}

const MOCK_CONTENT: Record<string, MockSectionContent> = {
  "saude-terapia": {
    faqItems: [
      { question: "Como funciona a primeira consulta?", answer: "A primeira consulta é uma avaliação inicial onde conversamos sobre sua história, necessidades e objetivos. É um espaço acolhedor e sigiloso para você se sentir à vontade." },
      { question: "Com que frequência devo fazer as sessões?", answer: "A frequência ideal varia de acordo com cada pessoa e o processo terapêutico. Geralmente, iniciamos com sessões semanais para estabelecer uma boa continuidade." },
      { question: "As sessões são presenciais ou online?", answer: "Ofereço atendimento presencial e online, ambos com a mesma qualidade e sigilo. Você escolhe o formato que melhor se adapta à sua rotina." },
      { question: "O atendimento é coberto por plano de saúde?", answer: "Depende do plano e da modalidade. Entre em contato para verificar as opções disponíveis e formas de pagamento acessíveis." },
    ],
    blogPosts: [
      { title: "5 sinais de que você pode se beneficiar de terapia", excerpt: "Artigo · Saúde Mental", imageUrl: pic("saude-blog1", 800, 450), link: "" },
      { title: "A importância do autocuidado no dia a dia", excerpt: "Artigo · Bem-estar", imageUrl: pic("saude-blog2", 800, 450), link: "" },
      { title: "Como lidar com a ansiedade de forma saudável", excerpt: "Artigo · Ansiedade", imageUrl: pic("saude-blog3", 800, 450), link: "" },
    ],
    galleryImages: [
      { url: pic("saude-gal1"), alt: "Ambiente de atendimento", caption: "Espaço acolhedor e reservado" },
      { url: pic("saude-gal2"), alt: "Sessão de terapia", caption: "Atendimento humanizado" },
      { url: pic("saude-gal3"), alt: "Consultório", caption: "Ambiente tranquilo e seguro" },
    ],
    events: [
      { title: "Roda de Conversa: Ansiedade e Autoconhecimento", date: "2026-04-10", time: "19:00", location: "Online (Zoom)", description: "Um espaço aberto para trocar experiências e aprender ferramentas para lidar com a ansiedade no cotidiano." },
      { title: "Workshop: Primeiros Passos na Terapia", date: "2026-04-26", time: "10:00", location: "Online", description: "Para quem pensa em começar e quer entender como funciona o processo terapêutico." },
      { title: "Palestra: Saúde Mental no Trabalho", date: "2026-05-14", time: "18:30", location: "Presencial", description: "Como cuidar da saúde emocional em ambientes corporativos e de alta pressão." },
    ],
    statsItems: [
      { value: "+200", label: "Pacientes atendidos" },
      { value: "8 anos", label: "De experiência" },
      { value: "98%", label: "Taxa de satisfação" },
      { value: "Online", label: "Atendimento disponível" },
    ],
  },

  "beleza-estetica": {
    faqItems: [
      { question: "Como agendar um horário?", answer: "Você pode agendar pelo WhatsApp, pelo formulário do site ou ligando diretamente. Respondemos sempre no mesmo dia." },
      { question: "Com que antecedência devo agendar?", answer: "Recomendamos agendar com pelo menos 48 horas de antecedência para garantir disponibilidade, especialmente nos fins de semana." },
      { question: "Quais são as formas de pagamento?", answer: "Aceitamos cartão de crédito, débito, Pix e dinheiro. Parcelamentos disponíveis para procedimentos acima de determinado valor." },
      { question: "Os produtos utilizados são hipoalergênicos?", answer: "Trabalhamos com marcas reconhecidas e produtos de alta qualidade. Para clientes com pele sensível, realizamos teste prévio antes do procedimento." },
    ],
    blogPosts: [
      { title: "Cuidados essenciais com a pele no inverno", excerpt: "Artigo · Skincare", imageUrl: pic("beleza-blog1", 800, 450), link: "" },
      { title: "Os tratamentos mais procurados em 2026", excerpt: "Artigo · Tendências", imageUrl: pic("beleza-blog2", 800, 450), link: "" },
      { title: "Hidratação profunda: dicas de profissional", excerpt: "Artigo · Cuidados", imageUrl: pic("beleza-blog3", 800, 450), link: "" },
    ],
    galleryImages: [
      { url: pic("beleza-gal1"), alt: "Tratamento facial", caption: "Procedimento de limpeza de pele" },
      { url: pic("beleza-gal2"), alt: "Ambiente do estúdio", caption: "Espaço confortável e higienizado" },
      { url: pic("beleza-gal3"), alt: "Resultado de tratamento", caption: "Cuidado com resultados visíveis" },
    ],
    events: [
      { title: "Dia de Beleza com Desconto Especial", date: "2026-04-05", time: "09:00", location: "Estúdio", description: "Pacotes promocionais com até 30% de desconto para novos clientes. Vagas limitadas." },
      { title: "Workshop: Maquiagem para o Dia a Dia", date: "2026-04-19", time: "14:00", location: "Estúdio", description: "Aprenda técnicas simples para realçar sua beleza natural com dicas de profissional." },
      { title: "Lançamento: Nova Linha de Tratamentos", date: "2026-05-08", time: "10:00", location: "Estúdio", description: "Conheça os novos procedimentos estéticos que chegam ao nosso portfólio este mês." },
    ],
    statsItems: [
      { value: "+500", label: "Clientes satisfeitas" },
      { value: "5 anos", label: "No mercado" },
      { value: "15+", label: "Tratamentos disponíveis" },
      { value: "4.9★", label: "Avaliação média" },
    ],
  },

  "nutricao-alimentacao": {
    faqItems: [
      { question: "Como é feito o plano alimentar?", answer: "O plano é elaborado de forma individualizada, levando em conta seus objetivos, exames, rotina e preferências alimentares. Nada genérico aqui." },
      { question: "Com que frequência terei retornos?", answer: "Os retornos são mensais para avaliar o progresso e ajustar o plano conforme necessário. Também estou disponível para dúvidas pelo WhatsApp." },
      { question: "A dieta é muito restritiva?", answer: "Trabalho com educação alimentar, não com restrição excessiva. O objetivo é criar hábitos saudáveis e sustentáveis a longo prazo." },
      { question: "Atende casos de reeducação alimentar?", answer: "Sim, a reeducação alimentar é um dos focos principais. Atendo diferentes objetivos: emagrecimento, ganho de massa, saúde digestiva e outros." },
    ],
    blogPosts: [
      { title: "O que realmente importa para emagrecer com saúde", excerpt: "Artigo · Emagrecimento", imageUrl: pic("nutricao-blog1", 800, 450), link: "" },
      { title: "Alimentos que aumentam a energia no dia a dia", excerpt: "Artigo · Alimentação", imageUrl: pic("nutricao-blog2", 800, 450), link: "" },
      { title: "Como montar um prato equilibrado em minutos", excerpt: "Artigo · Praticidade", imageUrl: pic("nutricao-blog3", 800, 450), link: "" },
    ],
    galleryImages: [
      { url: pic("nutricao-gal1"), alt: "Alimentos saudáveis", caption: "Alimentação colorida e nutritiva" },
      { url: pic("nutricao-gal2"), alt: "Consultório de nutrição", caption: "Atendimento personalizado" },
      { url: pic("nutricao-gal3"), alt: "Preparo de refeição saudável", caption: "Receitas práticas e saborosas" },
    ],
    events: [
      { title: "Palestra: Alimentação Saudável sem Sofrimento", date: "2026-04-08", time: "19:00", location: "Online", description: "Como criar uma relação mais leve e positiva com a comida, sem dietas extremas." },
      { title: "Grupo de Reeducação Alimentar — Turma Abril", date: "2026-04-15", time: "18:30", location: "Online (grupo fechado)", description: "Programa em grupo para quem quer transformar hábitos com suporte profissional." },
      { title: "Workshop: Meal Prep para a Semana", date: "2026-05-03", time: "10:00", location: "Online", description: "Como preparar refeições saudáveis para a semana toda em poucas horas." },
    ],
    statsItems: [
      { value: "+300", label: "Pacientes atendidos" },
      { value: "6 anos", label: "De experiência" },
      { value: "92%", label: "Atingem sua meta" },
      { value: "Online", label: "Consultas disponíveis" },
    ],
  },

  "yoga-meditacao": {
    faqItems: [
      { question: "Preciso ter flexibilidade para começar?", answer: "Não! O yoga é para todos, independente do nível de flexibilidade. As aulas são adaptadas tanto para iniciantes quanto para avançados." },
      { question: "Qual a diferença entre yoga e meditação?", answer: "O yoga integra posturas físicas, respiração e meditação. A meditação é uma prática focada exclusivamente na mente e presença. Oferecemos ambas." },
      { question: "As aulas são presenciais ou online?", answer: "Oferecemos aulas presenciais no estúdio e também online ao vivo, para quem prefere praticar de casa com o mesmo acompanhamento." },
      { question: "Com que frequência devo praticar?", answer: "O ideal é de 2 a 3 vezes por semana para sentir resultados consistentes. Mas qualquer frequência já traz benefícios reais para o bem-estar." },
    ],
    blogPosts: [
      { title: "Yoga para iniciantes: por onde começar", excerpt: "Artigo · Iniciantes", imageUrl: pic("yoga-blog1", 800, 450), link: "" },
      { title: "Meditação em 5 minutos: técnica para o dia a dia", excerpt: "Artigo · Meditação", imageUrl: pic("yoga-blog2", 800, 450), link: "" },
      { title: "Como o yoga melhorou minha qualidade de sono", excerpt: "Artigo · Bem-estar", imageUrl: pic("yoga-blog3", 800, 450), link: "" },
    ],
    galleryImages: [
      { url: pic("yoga-gal1"), alt: "Aula de yoga", caption: "Prática ao ar livre" },
      { url: pic("yoga-gal2"), alt: "Meditação em grupo", caption: "Encontros semanais" },
      { url: pic("yoga-gal3"), alt: "Estúdio de yoga", caption: "Espaço tranquilo e acolhedor" },
    ],
    events: [
      { title: "Aula Experimental Gratuita de Yoga", date: "2026-04-04", time: "08:00", location: "Estúdio", description: "Experimente uma aula completa sem custo algum. Vagas limitadas — garante a sua!" },
      { title: "Retiro de Fim de Semana: Reconexão", date: "2026-04-25", time: "09:00", location: "Sítio Vila Verde", description: "48 horas de práticas de yoga, meditação, alimentação consciente e descanso profundo." },
      { title: "Workshop: Respiração Consciente (Pranayama)", date: "2026-05-16", time: "10:00", location: "Estúdio / Online", description: "Técnicas de pranayama para aliviar o estresse e melhorar o foco no cotidiano." },
    ],
    statsItems: [
      { value: "+150", label: "Alunos ativos" },
      { value: "10 anos", label: "Ensinando yoga" },
      { value: "3 modalidades", label: "Disponíveis" },
      { value: "Diariamente", label: "Aulas ao vivo" },
    ],
  },

  "fitness-academia": {
    faqItems: [
      { question: "Preciso de avaliação física antes de começar?", answer: "Sim, realizamos uma avaliação física completa para montar um programa de treino seguro e eficiente para o seu perfil e objetivos." },
      { question: "Vocês oferecem personal trainer?", answer: "Sim! Temos personal trainers disponíveis para treinos individuais ou em pequenos grupos, com foco em resultados acelerados." },
      { question: "Quais são os horários de funcionamento?", answer: "Funcionamos de segunda a sexta das 6h às 22h, e nos fins de semana das 8h às 18h. Confira a grade completa de aulas coletivas." },
      { question: "Posso trazer um amigo para aula experimental?", answer: "Com certeza! Oferecemos aula experimental gratuita para visitantes. Entre em contato para agendar o melhor horário." },
    ],
    blogPosts: [
      { title: "Como montar um treino eficiente em 45 minutos", excerpt: "Artigo · Treino", imageUrl: pic("fitness-blog1", 800, 450), link: "" },
      { title: "Nutrição pré e pós treino: o que comer", excerpt: "Artigo · Nutrição", imageUrl: pic("fitness-blog2", 800, 450), link: "" },
      { title: "Cardio ou musculação: qual escolher?", excerpt: "Artigo · Dicas", imageUrl: pic("fitness-blog3", 800, 450), link: "" },
    ],
    galleryImages: [
      { url: pic("fitness-gal1"), alt: "Área de musculação", caption: "Equipamentos modernos" },
      { url: pic("fitness-gal2"), alt: "Aula de funcional", caption: "Treinos em grupo" },
      { url: pic("fitness-gal3"), alt: "Personal training", caption: "Acompanhamento individual" },
    ],
    events: [
      { title: "Desafio 30 Dias — Turma Maio", date: "2026-05-04", time: "07:00", location: "Academia / Online", description: "Desafio de transformação com treinos diários, acompanhamento nutricional e suporte em grupo." },
      { title: "Aula Aberta: Treino Funcional na Praça", date: "2026-04-12", time: "08:00", location: "Parque Municipal", description: "Treino ao ar livre aberto para toda a comunidade. Gratuito e para todos os níveis." },
      { title: "Workshop: Técnica de Levantamento Olímpico", date: "2026-04-20", time: "09:00", location: "Academia", description: "Para quem quer aperfeiçoar técnica e aumentar performance com segurança." },
    ],
    statsItems: [
      { value: "+400", label: "Alunos matriculados" },
      { value: "12 anos", label: "No mercado" },
      { value: "20+", label: "Modalidades" },
      { value: "95%", label: "Indicariam para amigos" },
    ],
  },

  "servicos-gerais": {
    faqItems: [
      { question: "Vocês atendem em toda a cidade?", answer: "Sim, atendemos em toda a região metropolitana. Para outras localidades, consulte disponibilidade e taxa de deslocamento." },
      { question: "Como funciona o processo de orçamento?", answer: "É rápido e sem compromisso. Entre em contato, descreva o serviço e enviamos um orçamento detalhado em até 24 horas." },
      { question: "O serviço tem garantia?", answer: "Todos os nossos serviços têm garantia de qualidade. Ficou algo errado? Voltamos sem custo adicional para resolver." },
      { question: "Quais formas de pagamento são aceitas?", answer: "Aceitamos Pix, cartão de crédito/débito e dinheiro. Para serviços maiores, trabalhamos com parcelamento facilitado." },
    ],
    blogPosts: [
      { title: "Como escolher um bom profissional de serviços", excerpt: "Artigo · Dicas", imageUrl: pic("servicos-blog1", 800, 450), link: "" },
      { title: "Manutenção preventiva: economia a longo prazo", excerpt: "Artigo · Casa & Serviços", imageUrl: pic("servicos-blog2", 800, 450), link: "" },
      { title: "Por que contratar um profissional qualificado", excerpt: "Artigo · Qualidade", imageUrl: pic("servicos-blog3", 800, 450), link: "" },
    ],
    galleryImages: [
      { url: pic("servicos-gal1"), alt: "Serviço realizado", caption: "Qualidade em cada detalhe" },
      { url: pic("servicos-gal2"), alt: "Equipe em ação", caption: "Profissionais experientes" },
      { url: pic("servicos-gal3"), alt: "Resultado final", caption: "Acabamento impecável" },
    ],
    events: [
      { title: "Promoção de Serviços — Mês do Cliente", date: "2026-04-01", time: "", location: "", description: "Desconto especial de 15% em todos os serviços durante o mês de abril. Aproveite!" },
      { title: "Visita Técnica Gratuita", date: "2026-04-22", time: "09:00", location: "A combinar", description: "Agende uma visita técnica sem compromisso para diagnóstico e orçamento presencial." },
    ],
    statsItems: [
      { value: "+800", label: "Serviços realizados" },
      { value: "10 anos", label: "De experiência" },
      { value: "4.8★", label: "Avaliação no Google" },
      { value: "100%", label: "Garantia no serviço" },
    ],
  },

  "design-criacao": {
    faqItems: [
      { question: "Como funciona o processo criativo?", answer: "Iniciamos com um briefing detalhado para entender sua marca, público e objetivos. Em seguida, desenvolvemos propostas conceituais para sua aprovação." },
      { question: "Quantas revisões estão incluídas?", answer: "Nossos projetos incluem até 3 rodadas de revisão. Queremos garantir que o resultado final supere suas expectativas." },
      { question: "Vocês entregam os arquivos em quais formatos?", answer: "Entregamos todos os arquivos finais em formatos editáveis (AI, PSD) e para uso imediato (PDF, PNG, JPG, SVG), conforme o projeto." },
      { question: "Trabalham com empresas de qualquer tamanho?", answer: "Sim! Atendemos desde freelancers e empreendedores individuais até empresas de médio porte, com soluções para cada orçamento." },
    ],
    blogPosts: [
      { title: "Por que uma identidade visual forte vale o investimento", excerpt: "Artigo · Branding", imageUrl: pic("design-blog1", 800, 450), link: "" },
      { title: "Tendências de design gráfico para 2026", excerpt: "Artigo · Tendências", imageUrl: pic("design-blog2", 800, 450), link: "" },
      { title: "Como escolher as cores certas para sua marca", excerpt: "Artigo · Psicologia das Cores", imageUrl: pic("design-blog3", 800, 450), link: "" },
    ],
    galleryImages: [
      { url: pic("design-gal1"), alt: "Projeto de identidade visual", caption: "Branding completo" },
      { url: pic("design-gal2"), alt: "Material gráfico criado", caption: "Design editorial" },
      { url: pic("design-gal3"), alt: "Portfólio de projetos", caption: "Cases recentes" },
    ],
    events: [
      { title: "Workshop: Branding do Zero para Empreendedores", date: "2026-04-17", time: "19:00", location: "Online", description: "Como criar uma identidade visual impactante mesmo sem ser designer." },
      { title: "Portfolio Review — Sessão Aberta", date: "2026-05-07", time: "18:00", location: "Online", description: "Traga seu portfólio e receba feedback construtivo para evoluir sua carreira criativa." },
    ],
    statsItems: [
      { value: "+120", label: "Projetos entregues" },
      { value: "7 anos", label: "No mercado" },
      { value: "40+", label: "Clientes ativos" },
      { value: "100%", label: "Entrega no prazo" },
    ],
  },

  "fotografia-arte": {
    faqItems: [
      { question: "Em quanto tempo recebo as fotos editadas?", answer: "O prazo de entrega varia conforme o tipo de trabalho. Ensaios individuais levam em média 7 dias úteis, e eventos até 21 dias após a data." },
      { question: "Como faço para reservar uma data?", answer: "A reserva é feita mediante contrato e pagamento de sinal. Entre em contato para verificar disponibilidade e dar início ao processo." },
      { question: "Vocês fazem ensaios externos?", answer: "Sim! Trabalhamos tanto em estúdio quanto em locações externas. Podemos sugerir locais incríveis ou ir ao local que você preferir." },
      { question: "Posso escolher o estilo de edição?", answer: "Cada trabalho tem nosso estilo autoral, mas conversamos sobre o tom e a estética desejados para garantir que o resultado combine com você." },
    ],
    blogPosts: [
      { title: "Como se preparar para um ensaio fotográfico", excerpt: "Artigo · Ensaio", imageUrl: pic("foto-blog1", 800, 450), link: "" },
      { title: "A magia da fotografia de momentos reais", excerpt: "Artigo · Lifestyle", imageUrl: pic("foto-blog2", 800, 450), link: "" },
      { title: "Os bastidores de um casamento fotografado", excerpt: "Artigo · Casamento", imageUrl: pic("foto-blog3", 800, 450), link: "" },
    ],
    galleryImages: [
      { url: pic("foto-gal1"), alt: "Ensaio fotográfico", caption: "Fotografia autoral" },
      { url: pic("foto-gal2"), alt: "Registro de evento", caption: "Momentos eternizados" },
      { url: pic("foto-gal3"), alt: "Retrato profissional", caption: "Luz e composição" },
    ],
    events: [
      { title: "Ensaio Coletivo — Outono 2026", date: "2026-04-11", time: "07:30", location: "Jardim Botânico", description: "Ensaios individuais de 20 minutos em locação externa. Vagas limitadas — garanta a sua!" },
      { title: "Workshop: Fotografia com Celular", date: "2026-04-25", time: "10:00", location: "Online", description: "Técnicas profissionais para tirar fotos incríveis usando apenas o smartphone." },
      { title: "Exposição: Rostos da Cidade", date: "2026-05-15", time: "19:00", location: "Galeria Municipal", description: "Abertura da exposição de fotografia de rua e retratos urbanos do acervo 2025/2026." },
    ],
    statsItems: [
      { value: "+600", label: "Ensaios realizados" },
      { value: "9 anos", label: "De carreira" },
      { value: "50+", label: "Casamentos fotografados" },
      { value: "4.9★", label: "Avaliação dos clientes" },
    ],
  },

  "musica-entretenimento": {
    faqItems: [
      { question: "Vocês tocam em qual tipo de evento?", answer: "Atuamos em casamentos, formaturas, festas corporativas, aniversários e shows independentes. Adaptamos o repertório para cada ocasião." },
      { question: "Qual é o tempo mínimo de contratação?", answer: "A contratação mínima é de 2 horas para eventos fechados. Para shows ao vivo, trabalhamos com cachês por apresentação." },
      { question: "É possível personalizar o repertório?", answer: "Sim! Montamos a setlist com base no seu evento e preferências. Temos um repertório extenso com diferentes gêneros e épocas." },
      { question: "Quantos músicos acompanham a apresentação?", answer: "A formação varia de solo a banda completa (até 6 músicos), dependendo do evento e do pacote contratado." },
    ],
    blogPosts: [
      { title: "Música ao vivo: o toque que transforma qualquer evento", excerpt: "Artigo · Eventos", imageUrl: pic("musica-blog1", 800, 450), link: "" },
      { title: "Como escolher a trilha sonora do seu casamento", excerpt: "Artigo · Casamento", imageUrl: pic("musica-blog2", 800, 450), link: "" },
      { title: "Por dentro de um show: da preparação ao palco", excerpt: "Artigo · Bastidores", imageUrl: pic("musica-blog3", 800, 450), link: "" },
    ],
    galleryImages: [
      { url: pic("musica-gal1"), alt: "Show ao vivo", caption: "Performance impecável" },
      { url: pic("musica-gal2"), alt: "Música em evento", caption: "Noite inesquecível" },
      { url: pic("musica-gal3"), alt: "Ensaio de banda", caption: "Preparação e dedicação" },
    ],
    events: [
      { title: "Show Acústico — Sábado Cultural", date: "2026-04-18", time: "19:30", location: "Bar do Jardim", description: "Uma noite intimista com repertório variado, do clássico ao contemporâneo. Entrada franca." },
      { title: "Apresentação: Noite de Jazz e MPB", date: "2026-05-02", time: "20:00", location: "Teatro Municipal", description: "Espetáculo especial com clássicos do jazz e MPB em arranjos exclusivos." },
      { title: "Live Online — Acústico Especial", date: "2026-05-23", time: "19:00", location: "Instagram Live", description: "Transmissão ao vivo com setlist especial e interação com o público." },
    ],
    statsItems: [
      { value: "+200", label: "Shows realizados" },
      { value: "15 anos", label: "De carreira musical" },
      { value: "10 gêneros", label: "No repertório" },
      { value: "4.9★", label: "Avaliação dos clientes" },
    ],
  },

  "coaching-desenvolvimento": {
    faqItems: [
      { question: "O que é coaching e como funciona?", answer: "Coaching é um processo estruturado de desenvolvimento pessoal e profissional. Trabalhamos metas claras, crenças limitantes e planos de ação para resultados reais." },
      { question: "Quantas sessões são necessárias?", answer: "Um processo completo geralmente dura de 3 a 6 meses, com sessões quinzenais ou mensais. Mas sentiremos resultados desde as primeiras sessões." },
      { question: "Qual a diferença entre coaching e terapia?", answer: "A terapia trabalha o passado e questões emocionais profundas. O coaching foca no presente e no futuro, com foco em performance e metas concretas." },
      { question: "Vocês oferecem sessão gratuita?", answer: "Sim! Oferecemos uma sessão estratégica gratuita de 30 minutos para alinharmos objetivos e você conhecer a metodologia antes de se comprometer." },
    ],
    blogPosts: [
      { title: "Como definir metas que você realmente vai alcançar", excerpt: "Artigo · Produtividade", imageUrl: pic("coaching-blog1", 800, 450), link: "" },
      { title: "Crenças limitantes: como identificar e superar", excerpt: "Artigo · Mentalidade", imageUrl: pic("coaching-blog2", 800, 450), link: "" },
      { title: "O poder da consistência nos resultados", excerpt: "Artigo · Desenvolvimento", imageUrl: pic("coaching-blog3", 800, 450), link: "" },
    ],
    galleryImages: [
      { url: pic("coaching-gal1"), alt: "Sessão de coaching", caption: "Processo individualizado" },
      { url: pic("coaching-gal2"), alt: "Workshop em grupo", caption: "Aprendizado colaborativo" },
      { url: pic("coaching-gal3"), alt: "Mentoria profissional", caption: "Resultados comprovados" },
    ],
    events: [
      { title: "Sessão Estratégica Gratuita — Vagas Abertas", date: "2026-04-06", time: "10:00", location: "Online (Zoom)", description: "30 minutos para entender onde você está e para onde quer ir. Sem compromisso." },
      { title: "Workshop: Clareza e Foco para Alta Performance", date: "2026-04-22", time: "19:30", location: "Online", description: "Como eliminar distrações, definir prioridades e executar com mais consistência." },
      { title: "Imersão: Mindset de Alta Performance", date: "2026-05-10", time: "09:00", location: "Espaço Coworking Centro", description: "Jornada intensiva de um dia para reprogramar sua mentalidade para o sucesso." },
    ],
    statsItems: [
      { value: "+180", label: "Clientes transformados" },
      { value: "8 anos", label: "De experiência" },
      { value: "ICF", label: "Certificação internacional" },
      { value: "98%", label: "Recomendam" },
    ],
  },

  "educacao-cursos": {
    faqItems: [
      { question: "Os cursos têm certificado?", answer: "Sim! Todos os nossos cursos oferecem certificado digital ao final, reconhecido no mercado e válido para comprovação de capacitação." },
      { question: "As aulas ficam gravadas para rever depois?", answer: "Sim, as aulas ficam disponíveis por 12 meses após a conclusão do curso para você revisar sempre que precisar." },
      { question: "Preciso ter experiência prévia?", answer: "Não! Nossos cursos são desenvolvidos para todos os níveis. Indicamos o nível mais adequado para você na descrição de cada curso." },
      { question: "Existe suporte durante o curso?", answer: "Sim! Temos grupo exclusivo de alunos e um fórum interno. Também respondemos perguntas diretamente nas aulas ao vivo e gravadas." },
    ],
    blogPosts: [
      { title: "Como aprender mais em menos tempo com técnicas comprovadas", excerpt: "Artigo · Aprendizado", imageUrl: pic("edu-blog1", 800, 450), link: "" },
      { title: "Por que investir em qualificação vale cada centavo", excerpt: "Artigo · Carreira", imageUrl: pic("edu-blog2", 800, 450), link: "" },
      { title: "Habilidades mais valorizadas pelo mercado em 2026", excerpt: "Artigo · Tendências", imageUrl: pic("edu-blog3", 800, 450), link: "" },
    ],
    galleryImages: [
      { url: pic("edu-gal1"), alt: "Aula online", caption: "Conteúdo de alta qualidade" },
      { url: pic("edu-gal2"), alt: "Alunos em formação", caption: "Centenas de formados" },
      { url: pic("edu-gal3"), alt: "Material de estudo", caption: "Método prático e eficiente" },
    ],
    events: [
      { title: "Aula Aberta Gratuita: Introdução ao Curso", date: "2026-04-09", time: "19:30", location: "Online (Zoom)", description: "Participe de uma aula demonstrativa sem custo e conheça a metodologia do curso." },
      { title: "Nova Turma — Inscrições Abertas", date: "2026-04-28", time: "Flexível", location: "100% Online", description: "Vagas limitadas para a nova turma. Inscreva-se com antecedência e garanta o melhor preço." },
      { title: "Webinar: Como se Qualificar em 2026", date: "2026-05-06", time: "20:00", location: "Online", description: "Panorama das profissões em alta e como se preparar para as oportunidades do mercado." },
    ],
    statsItems: [
      { value: "+500", label: "Alunos formados" },
      { value: "12 cursos", label: "Disponíveis" },
      { value: "4.8★", label: "Avaliação dos alunos" },
      { value: "92%", label: "Empregabilidade" },
    ],
  },

  "tecnologia-ti": {
    faqItems: [
      { question: "Vocês atendem pequenas empresas?", answer: "Sim! Temos soluções escaláveis para negócios de todos os tamanhos, desde startups até empresas de médio porte." },
      { question: "Como funciona a consultoria inicial?", answer: "Fazemos um diagnóstico técnico e levantamento de necessidades. Com base nisso, apresentamos um plano de ação e proposta comercial personalizada." },
      { question: "Oferecem suporte pós-entrega?", answer: "Sim! Todos os projetos incluem suporte técnico após a entrega, com planos de manutenção e SLA conforme a necessidade do cliente." },
      { question: "Trabalham com desenvolvimento sob demanda?", answer: "Sim, desenvolvemos soluções customizadas: sistemas web, aplicativos mobile, automações e integrações entre plataformas." },
    ],
    blogPosts: [
      { title: "Como a automação pode reduzir custos operacionais", excerpt: "Artigo · Tecnologia", imageUrl: pic("tech-blog1", 800, 450), link: "" },
      { title: "Segurança digital: o que toda empresa precisa saber", excerpt: "Artigo · Cibersegurança", imageUrl: pic("tech-blog2", 800, 450), link: "" },
      { title: "Cloud ou servidor próprio: como decidir", excerpt: "Artigo · Infraestrutura", imageUrl: pic("tech-blog3", 800, 450), link: "" },
    ],
    galleryImages: [
      { url: pic("tech-gal1"), alt: "Equipe de desenvolvimento", caption: "Time especializado" },
      { url: pic("tech-gal2"), alt: "Infraestrutura de TI", caption: "Ambiente seguro e escalável" },
      { url: pic("tech-gal3"), alt: "Projeto entregue", caption: "Soluções funcionando" },
    ],
    events: [
      { title: "Consultoria Diagnóstico Gratuita", date: "2026-04-13", time: "10:00", location: "Online (Meet)", description: "1 hora de análise técnica do seu ambiente digital, sem compromisso e sem custo." },
      { title: "Webinar: IA na Prática para Pequenas Empresas", date: "2026-04-29", time: "19:00", location: "Online", description: "Como usar inteligência artificial para otimizar processos e aumentar produtividade." },
      { title: "Tech Talk: Segurança Digital para PMEs", date: "2026-05-19", time: "18:30", location: "Online", description: "As principais ameaças digitais de 2026 e como proteger sua empresa de forma prática." },
    ],
    statsItems: [
      { value: "+80", label: "Projetos entregues" },
      { value: "5 anos", label: "No mercado" },
      { value: "99.9%", label: "Uptime garantido" },
      { value: "48h", label: "Tempo de resposta" },
    ],
  },

  "juridico-advocacia": {
    faqItems: [
      { question: "Como funciona a consulta inicial?", answer: "A consulta inicial é uma reunião para entender seu caso, esclarecer dúvidas jurídicas e apresentar as possibilidades de atuação. É confidencial e sem compromisso." },
      { question: "Qual a área de especialização do escritório?", answer: "Temos especialização em direito civil, trabalhista, empresarial e de família. Nossa equipe atua com foco em resultados e segurança jurídica." },
      { question: "O escritório atende em quais regiões?", answer: "Atendemos de forma presencial em nossa cidade e arredores. Para casos de outras regiões, trabalhamos online conforme permitido pela OAB." },
      { question: "Como são definidos os honorários?", answer: "Os honorários são estabelecidos de forma transparente após a análise do caso, em conformidade com a tabela da OAB. Sem surpresas no processo." },
    ],
    blogPosts: [
      { title: "Seus direitos como consumidor: o que você precisa saber", excerpt: "Artigo · Direito do Consumidor", imageUrl: pic("juridico-blog1", 800, 450), link: "" },
      { title: "Demissão sem justa causa: entenda seus direitos", excerpt: "Artigo · Direito Trabalhista", imageUrl: pic("juridico-blog2", 800, 450), link: "" },
      { title: "Como proteger legalmente o seu negócio", excerpt: "Artigo · Direito Empresarial", imageUrl: pic("juridico-blog3", 800, 450), link: "" },
    ],
    galleryImages: [
      { url: pic("juridico-gal1"), alt: "Escritório de advocacia", caption: "Ambiente profissional" },
      { url: pic("juridico-gal2"), alt: "Reunião com cliente", caption: "Atendimento personalizado" },
      { url: pic("juridico-gal3"), alt: "Equipe jurídica", caption: "Profissionais qualificados" },
    ],
    events: [
      { title: "Palestra Gratuita: Seus Direitos na Prática", date: "2026-04-16", time: "18:30", location: "Auditório OAB Local", description: "Orientação jurídica gratuita sobre os principais direitos civis e trabalhistas do cidadão." },
      { title: "Plantão Jurídico Online — Tire Suas Dúvidas", date: "2026-05-05", time: "09:00", location: "Online (por agendamento)", description: "Atendimento de 15 minutos por inscrição para perguntas jurídicas objetivas e diretas." },
    ],
    statsItems: [
      { value: "+350", label: "Casos resolvidos" },
      { value: "15 anos", label: "De atuação" },
      { value: "OAB", label: "Registro ativo" },
      { value: "3 áreas", label: "De especialização" },
    ],
  },

  "financas-contabilidade": {
    faqItems: [
      { question: "Quais empresas vocês atendem?", answer: "Atendemos MEIs, microempresas, empresas de médio porte e profissionais autônomos. Temos soluções contábeis para cada perfil." },
      { question: "O que está incluso no serviço de contabilidade?", answer: "Nossos planos incluem apuração de impostos, folha de pagamento, abertura/alteração de empresa, obrigações acessórias e consultoria mensal." },
      { question: "Como é feita a comunicação com o cliente?", answer: "Temos um portal online para envio de documentos e relatórios. Também atendemos por WhatsApp, e-mail e reuniões periódicas." },
      { question: "Vocês ajudam a reduzir a carga tributária?", answer: "Sim! Fazemos planejamento tributário para identificar o enquadramento mais vantajoso e as oportunidades legais de economia fiscal." },
    ],
    blogPosts: [
      { title: "Simples Nacional ou Lucro Presumido: qual escolher?", excerpt: "Artigo · Tributação", imageUrl: pic("financas-blog1", 800, 450), link: "" },
      { title: "Como organizar as finanças da sua empresa", excerpt: "Artigo · Gestão Financeira", imageUrl: pic("financas-blog2", 800, 450), link: "" },
      { title: "Guia para abertura de empresa passo a passo", excerpt: "Artigo · Empreendedorismo", imageUrl: pic("financas-blog3", 800, 450), link: "" },
    ],
    galleryImages: [
      { url: pic("financas-gal1"), alt: "Escritório contábil", caption: "Ambiente organizado e profissional" },
      { url: pic("financas-gal2"), alt: "Análise de relatórios", caption: "Dados sempre em dia" },
      { url: pic("financas-gal3"), alt: "Consultoria financeira", caption: "Orientação estratégica" },
    ],
    events: [
      { title: "Webinar: Planejamento Tributário para 2026", date: "2026-04-14", time: "19:30", location: "Online (Zoom)", description: "Estratégias legais para reduzir impostos e aumentar a margem do seu negócio este ano." },
      { title: "Consultoria Gratuita: MEI e Microempresa", date: "2026-04-28", time: "09:00", location: "Online ou Presencial", description: "Atendimento sem custo para tirar dúvidas sobre enquadramento, tributos e obrigações." },
    ],
    statsItems: [
      { value: "+250", label: "Empresas atendidas" },
      { value: "12 anos", label: "No mercado" },
      { value: "CRC", label: "Registro ativo" },
      { value: "100%", label: "Conformidade fiscal" },
    ],
  },

  "outro": {
    faqItems: [
      { question: "Como posso entrar em contato?", answer: "Você pode falar comigo pelo WhatsApp, e-mail ou pelo formulário do site. Respondemos em até 24 horas úteis." },
      { question: "Vocês atendem de forma online?", answer: "Sim! Atendemos presencialmente e de forma online, com a mesma qualidade e dedicação em ambos os formatos." },
      { question: "Como funciona o processo de contratação?", answer: "Iniciamos com uma conversa para entender sua necessidade e apresentamos uma proposta personalizada. Simples e sem burocracia." },
      { question: "Qual é o prazo médio de entrega?", answer: "O prazo varia conforme o serviço contratado. Informamos o prazo exato na proposta e cumprimos o combinado." },
    ],
    blogPosts: [
      { title: "Como escolher o profissional certo para o seu projeto", excerpt: "Artigo · Dicas", imageUrl: pic("outro-blog1", 800, 450), link: "" },
      { title: "A importância de investir em qualidade", excerpt: "Artigo · Qualidade", imageUrl: pic("outro-blog2", 800, 450), link: "" },
      { title: "Nossos diferenciais: o que nos torna únicos", excerpt: "Artigo · Sobre nós", imageUrl: pic("outro-blog3", 800, 450), link: "" },
    ],
    galleryImages: [
      { url: pic("outro-gal1"), alt: "Nosso trabalho", caption: "Qualidade em cada detalhe" },
      { url: pic("outro-gal2"), alt: "Nossa equipe", caption: "Profissionais dedicados" },
      { url: pic("outro-gal3"), alt: "Resultado para o cliente", caption: "Satisfação garantida" },
    ],
    events: [
      { title: "Conversa Aberta com Nossos Clientes", date: "2026-04-23", time: "19:00", location: "Online", description: "Um encontro informal para ouvir feedback, tirar dúvidas e compartilhar novidades." },
      { title: "Lançamento de Novos Serviços", date: "2026-05-12", time: "10:00", location: "Online", description: "Conheça os novos serviços que estarão disponíveis em breve e inscreva-se com antecedência." },
    ],
    statsItems: [
      { value: "+100", label: "Clientes satisfeitos" },
      { value: "5+ anos", label: "De experiência" },
      { value: "100%", label: "Comprometimento" },
      { value: "5★", label: "Avaliação" },
    ],
  },
};

/** Retorna o conteúdo mockado (arrays) para um segmento de negócio.
 *  Usado para pré-preencher FAQ, Blog, Galeria, Agenda e Números no wizard. */
export function getMockArrayContentForSegment(segmentId: string): Record<string, unknown[]> {
  const content = MOCK_CONTENT[segmentId] ?? MOCK_CONTENT["outro"];
  return {
    faqItems: content.faqItems,
    blogPosts: content.blogPosts,
    galleryImages: content.galleryImages,
    events: content.events,
    statsItems: content.statsItems,
  };
}

type ServiceCard = { title: string; description: string; iconName: string };

const SERVICE_CARDS: Record<string, ServiceCard[]> = {
  "saude-terapia": [
    { title: "Consulta Individual", description: "Sessão de acompanhamento personalizado e confidencial", iconName: "Heart" },
    { title: "Terapia Online", description: "Atendimento remoto com a mesma qualidade e sigilo", iconName: "Monitor" },
    { title: "Grupo Terapêutico", description: "Encontros em grupo com dinâmicas especializadas", iconName: "Users" },
    { title: "Avaliação Psicológica", description: "Laudos e relatórios técnicos com embasamento científico", iconName: "FileText" },
  ],
  "beleza-estetica": [
    { title: "Procedimentos Faciais", description: "Limpeza de pele, peeling e tratamentos rejuvenescedores", iconName: "Smile" },
    { title: "Cabelo & Coloração", description: "Cortes, tintura e tratamentos capilares especializados", iconName: "Scissors" },
    { title: "Estética Corporal", description: "Massagens, drenagem linfática e modelagem corporal", iconName: "Star" },
    { title: "Manicure & Pedicure", description: "Cuidados completos e duradouros para mãos e pés", iconName: "Heart" },
  ],
  "nutricao-alimentacao": [
    { title: "Consulta Nutricional", description: "Avaliação detalhada e plano alimentar personalizado", iconName: "User" },
    { title: "Dieta Personalizada", description: "Cardápio adaptado ao seu estilo de vida e objetivos", iconName: "Leaf" },
    { title: "Acompanhamento Online", description: "Suporte contínuo e ajustes via plataforma digital", iconName: "Monitor" },
    { title: "Nutrição Esportiva", description: "Suporte nutricional para quem treina e busca performance", iconName: "Zap" },
  ],
  "yoga-meditacao": [
    { title: "Aulas de Yoga", description: "Práticas para todos os níveis, presencial ou online", iconName: "Heart" },
    { title: "Meditação Guiada", description: "Técnicas para reduzir o estresse e cultivar a presença", iconName: "Smile" },
    { title: "Respiração Consciente", description: "Pranayama para equilíbrio energético e vitalidade", iconName: "Activity" },
    { title: "Retiro & Workshop", description: "Imersões transformadoras individuais e em grupo", iconName: "Users" },
  ],
  "fitness-academia": [
    { title: "Personal Training", description: "Treinos personalizados para o seu objetivo e ritmo", iconName: "Target" },
    { title: "Avaliação Física", description: "Análise completa do condicionamento e composição corporal", iconName: "Activity" },
    { title: "Treino Funcional", description: "Movimentos integrados que melhoram seu desempenho", iconName: "Zap" },
    { title: "Consultoria Online", description: "Planilhas de treino e acompanhamento remoto", iconName: "Monitor" },
  ],
  "servicos-gerais": [
    { title: "Instalação & Montagem", description: "Serviços rápidos, seguros e com garantia", iconName: "Wrench" },
    { title: "Manutenção Preventiva", description: "Revisões periódicas para evitar problemas maiores", iconName: "Settings" },
    { title: "Reformas & Reparos", description: "Soluções completas para sua casa ou empresa", iconName: "Shield" },
    { title: "Consultoria Técnica", description: "Avaliação detalhada e orçamento sem compromisso", iconName: "FileText" },
  ],
  "design-criacao": [
    { title: "Identidade Visual", description: "Logo, paleta de cores e tipografia para sua marca", iconName: "Star" },
    { title: "Design Gráfico", description: "Materiais impressos e digitais de alto impacto", iconName: "Award" },
    { title: "Social Media", description: "Artes e conteúdo visual otimizado para redes sociais", iconName: "Users" },
    { title: "Branding Estratégico", description: "Posicionamento visual que conecta marca e público", iconName: "TrendingUp" },
  ],
  "fotografia-arte": [
    { title: "Ensaio Fotográfico", description: "Portraits, books e ensaios temáticos personalizados", iconName: "Camera" },
    { title: "Fotografia de Eventos", description: "Casamentos, aniversários e eventos corporativos", iconName: "Users" },
    { title: "Fotografia de Produto", description: "Imagens profissionais para e-commerce e catálogos", iconName: "Star" },
    { title: "Edição & Tratamento", description: "Retoque e edição profissional com entrega rápida", iconName: "Monitor" },
  ],
  "musica-entretenimento": [
    { title: "Aulas de Instrumento", description: "Metodologia personalizada para todos os níveis", iconName: "Music" },
    { title: "Produção Musical", description: "Gravação, mixagem e masterização profissional", iconName: "Mic" },
    { title: "Shows & Eventos", description: "Apresentações ao vivo e animação de celebrações", iconName: "Users" },
    { title: "Trilhas & Jingles", description: "Identidade sonora personalizada para marcas e projetos", iconName: "Star" },
  ],
  "coaching-desenvolvimento": [
    { title: "Coaching Individual", description: "Sessões focadas nos seus objetivos pessoais e profissionais", iconName: "Target" },
    { title: "Liderança & Carreira", description: "Desenvolvimento de habilidades executivas e de equipe", iconName: "TrendingUp" },
    { title: "Workshop em Grupo", description: "Dinâmicas para equipes, líderes e organizações", iconName: "Users" },
    { title: "Mentoria Estratégica", description: "Acompanhamento personalizado para conquista de metas", iconName: "Lightbulb" },
  ],
  "educacao-cursos": [
    { title: "Aula Particular", description: "Ensino individualizado focado nas dificuldades específicas", iconName: "User" },
    { title: "Curso Online", description: "Aprendizado no seu ritmo, com suporte e material completo", iconName: "Monitor" },
    { title: "Workshop Presencial", description: "Prática intensa com resultados visíveis e rápidos", iconName: "Users" },
    { title: "Preparatório & Concurso", description: "Material, estratégia e treino focado em aprovação", iconName: "Target" },
  ],
  "tecnologia-ti": [
    { title: "Desenvolvimento Web", description: "Sites, sistemas e aplicações sob medida para seu negócio", iconName: "Monitor" },
    { title: "Aplicativos Mobile", description: "Apps iOS e Android com experiência profissional", iconName: "Zap" },
    { title: "Suporte & TI", description: "Manutenção, configuração e suporte técnico ágil", iconName: "Settings" },
    { title: "Consultoria Digital", description: "Estratégia e transformação tecnológica para empresas", iconName: "TrendingUp" },
  ],
  "juridico-advocacia": [
    { title: "Consultoria Jurídica", description: "Orientação especializada para suas questões legais", iconName: "Scale" },
    { title: "Elaboração de Contratos", description: "Documentos seguros, claros e personalizados", iconName: "FileText" },
    { title: "Acompanhamento Processual", description: "Representação e defesa dos seus direitos em juízo", iconName: "Shield" },
    { title: "Direito Empresarial", description: "Assessoria completa para empresas e empreendedores", iconName: "Briefcase" },
  ],
  "financas-contabilidade": [
    { title: "Contabilidade Empresarial", description: "Gestão contábil completa, organizada e em dia", iconName: "FileText" },
    { title: "Planejamento Tributário", description: "Reduza legalmente a carga de impostos da sua empresa", iconName: "TrendingUp" },
    { title: "Declaração de IR", description: "Imposto de renda feito com segurança e dentro do prazo", iconName: "Shield" },
    { title: "Consultoria Financeira", description: "Estratégias para crescimento e saúde financeira", iconName: "DollarSign" },
  ],
  "outro": [
    { title: "Serviço Principal", description: "Nosso principal trabalho com qualidade e dedicação", iconName: "Star" },
    { title: "Consultoria", description: "Orientação especializada para suas necessidades", iconName: "User" },
    { title: "Suporte & Atendimento", description: "Sempre disponível para ajudar e resolver sua demanda", iconName: "Heart" },
    { title: "Resultado Garantido", description: "Comprometimento com a excelência em cada projeto", iconName: "Shield" },
  ],
};

/** Retorna os cards de serviço pré-preenchidos para um segmento de negócio. */
export function getMockServiceCardsForSegment(segmentId: string): ServiceCard[] {
  return SERVICE_CARDS[segmentId] ?? SERVICE_CARDS["outro"];
}

/** Gera URL de imagem de capa via loremflickr com keywords relevantes ao segmento */
function flickr(keywords: string, lock: number): string {
  return `https://loremflickr.com/1200/700/${keywords}?lock=${lock}`;
}

/** Retorna uma URL de imagem de capa (hero) específica por segmento */
export function getMockHeroImageForSegment(segmentId: string): string {
  const map: Record<string, string> = {
    "saude-terapia":           flickr("healthcare,wellness,clinic", 11),
    "beleza-estetica":         flickr("beauty,salon,cosmetics", 22),
    "nutricao-alimentacao":    flickr("food,nutrition,healthy", 33),
    "yoga-meditacao":          flickr("yoga,meditation,zen", 44),
    "fitness-academia":        flickr("fitness,gym,exercise", 55),
    "servicos-gerais":         flickr("professional,service,business", 66),
    "design-criacao":          flickr("design,creative,studio", 77),
    "fotografia-arte":         flickr("photography,camera,portrait", 88),
    "musica-entretenimento":   flickr("music,concert,guitar", 99),
    "coaching-desenvolvimento":flickr("coaching,success,motivation", 110),
    "educacao-cursos":         flickr("education,learning,classroom", 121),
    "tecnologia-ti":           flickr("technology,computer,digital", 132),
    "juridico-advocacia":      flickr("law,justice,office", 143),
    "financas-contabilidade":  flickr("finance,business,office", 154),
    "outro":                   flickr("business,professional,office", 165),
  };
  return map[segmentId] ?? flickr("business,professional", 1);
}
