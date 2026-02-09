/* ─── Icon pack definitions using lucide-react icon names ─── */

export type IconDefinition = {
  name: string;
  label: string;
  category: string;
};

export type IconPackId = "basic" | "premium";

export const basicIconPack: IconDefinition[] = [
  // Geral
  { name: "Heart", label: "Coração", category: "geral" },
  { name: "Star", label: "Estrela", category: "geral" },
  { name: "Shield", label: "Escudo", category: "geral" },
  { name: "Clock", label: "Relógio", category: "geral" },
  { name: "Phone", label: "Telefone", category: "geral" },
  { name: "Mail", label: "Email", category: "geral" },
  { name: "MapPin", label: "Localização", category: "geral" },
  { name: "CheckCircle", label: "Verificado", category: "geral" },
  { name: "Users", label: "Pessoas", category: "geral" },
  { name: "Calendar", label: "Agenda", category: "geral" },
  { name: "Lightbulb", label: "Ideia", category: "geral" },
  { name: "Zap", label: "Energia", category: "geral" },
  { name: "MessageCircle", label: "Mensagem", category: "geral" },
  // Negócios
  { name: "Briefcase", label: "Trabalho", category: "negócios" },
  { name: "Target", label: "Meta", category: "negócios" },
  { name: "TrendingUp", label: "Crescimento", category: "negócios" },
  { name: "Award", label: "Premiação", category: "negócios" },
  // Saúde
  { name: "Brain", label: "Mente", category: "saúde" },
  { name: "Smile", label: "Sorriso", category: "saúde" },
  { name: "HeartPulse", label: "Saúde", category: "saúde" },
];

export const premiumIconPack: IconDefinition[] = [
  // Inclui todos do basico
  ...basicIconPack,
  // Natureza
  { name: "Leaf", label: "Folha", category: "natureza" },
  { name: "Sun", label: "Sol", category: "natureza" },
  { name: "Moon", label: "Lua", category: "natureza" },
  { name: "Flower2", label: "Flor", category: "natureza" },
  { name: "TreePine", label: "Árvore", category: "natureza" },
  // Fitness
  { name: "Dumbbell", label: "Halter", category: "fitness" },
  { name: "Activity", label: "Atividade", category: "fitness" },
  { name: "Flame", label: "Chama", category: "fitness" },
  { name: "Timer", label: "Cronômetro", category: "fitness" },
  // Nutrição
  { name: "Apple", label: "Maçã", category: "nutrição" },
  { name: "Salad", label: "Salada", category: "nutrição" },
  { name: "UtensilsCrossed", label: "Talheres", category: "nutrição" },
  { name: "Coffee", label: "Café", category: "nutrição" },
  // Criativo
  { name: "Camera", label: "Câmera", category: "criativo" },
  { name: "Palette", label: "Paleta", category: "criativo" },
  { name: "Paintbrush", label: "Pincel", category: "criativo" },
  { name: "PenTool", label: "Caneta", category: "criativo" },
  { name: "Image", label: "Imagem", category: "criativo" },
  // Educação
  { name: "GraduationCap", label: "Formatura", category: "educação" },
  { name: "BookOpen", label: "Livro", category: "educação" },
  { name: "FileText", label: "Documento", category: "educação" },
  { name: "PencilLine", label: "Lápis", category: "educação" },
  { name: "School", label: "Escola", category: "educação" },
  // Tech
  { name: "Globe", label: "Mundo", category: "tech" },
  { name: "Code", label: "Código", category: "tech" },
  { name: "Laptop", label: "Notebook", category: "tech" },
  { name: "Smartphone", label: "Celular", category: "tech" },
  { name: "Wifi", label: "Wifi", category: "tech" },
  { name: "Cloud", label: "Nuvem", category: "tech" },
  { name: "Database", label: "Banco de dados", category: "tech" },
  { name: "Lock", label: "Cadeado", category: "tech" },
  // Comunicação
  { name: "Video", label: "Vídeo", category: "comunicação" },
  { name: "Mic", label: "Microfone", category: "comunicação" },
  { name: "Radio", label: "Rádio", category: "comunicação" },
  { name: "Headphones", label: "Fone", category: "comunicação" },
  // Financeiro
  { name: "DollarSign", label: "Dólar", category: "financeiro" },
  { name: "CreditCard", label: "Cartão", category: "financeiro" },
  { name: "PiggyBank", label: "Cofrinho", category: "financeiro" },
  { name: "Wallet", label: "Carteira", category: "financeiro" },
  // Outros
  { name: "Gift", label: "Presente", category: "outros" },
  { name: "Crown", label: "Coroa", category: "outros" },
  { name: "Gem", label: "Diamante", category: "outros" },
  { name: "Rocket", label: "Foguete", category: "outros" },
  { name: "Compass", label: "Bússola", category: "outros" },
  { name: "Key", label: "Chave", category: "outros" },
  { name: "Sparkles", label: "Brilho", category: "outros" },
  { name: "ThumbsUp", label: "Positivo", category: "outros" },
  { name: "Trophy", label: "Troféu", category: "outros" },
  { name: "BadgeCheck", label: "Certificado", category: "outros" },
];

export function getIconPack(packId: IconPackId): IconDefinition[] {
  return packId === "premium" ? premiumIconPack : basicIconPack;
}

export function isIconPremium(iconName: string): boolean {
  const isInBasic = basicIconPack.some((icon) => icon.name === iconName);
  return !isInBasic;
}

export function getIconCategories(packId: IconPackId): string[] {
  const pack = getIconPack(packId);
  return [...new Set(pack.map((icon) => icon.category))];
}
