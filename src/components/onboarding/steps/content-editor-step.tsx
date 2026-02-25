"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Type, Sparkles, MessageSquare, Phone, Search } from "lucide-react";
import { useWizard } from "../wizard-context";
import { StepNavigation } from "../step-navigation";
import { ImageUpload } from "../builders/image-upload";

type SectionTab = "hero" | "services" | "cta" | "contact" | "seo";

const tabs: { id: SectionTab; label: string; icon: React.ReactNode }[] = [
  { id: "hero", label: "Hero", icon: <Sparkles size={14} /> },
  { id: "services", label: "Serviços", icon: <Type size={14} /> },
  { id: "cta", label: "CTA", icon: <MessageSquare size={14} /> },
  { id: "contact", label: "Contato", icon: <Phone size={14} /> },
  { id: "seo", label: "SEO", icon: <Search size={14} /> },
];

function HeroContentEditor() {
  const { state, dispatch } = useWizard();
  const { content, heroImage } = state;

  function handleChange(key: string, value: string) {
    dispatch({ type: "UPDATE_CONTENT", key, value });
  }

  return (
    <div className="space-y-4">
      {/* Hero image upload inline */}
      <ImageUpload
        label="Imagem do Hero"
        value={heroImage}
        onChange={(url) => dispatch({ type: "SET_IMAGE", key: "heroImage", url })}
        slot="heroImage"
        aspectRatio="16/9"
        description="Imagem de destaque da página inicial"
      />

      <div className="border-t border-white/10 pt-4">
        <label className="text-xs font-medium text-[var(--platform-text)]/60">
          Slogan
        </label>
        <input
          type="text"
          value={content.slogan || ""}
          onChange={(e) => handleChange("slogan", e.target.value)}
          placeholder="Ex: Cuidando da sua saúde emocional"
          className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-[var(--platform-text)] placeholder:text-[var(--platform-text)]/30 focus:border-[#22D3EE] focus:outline-none"
        />
        <p className="mt-1 text-[10px] text-[var(--platform-text)]/40">
          Aparece no header do site, abaixo do nome
        </p>
      </div>

      <div>
        <label className="text-xs font-medium text-[var(--platform-text)]/60">
          Eyebrow (pequeno texto acima)
        </label>
        <input
          type="text"
          value={content.heroEyebrow || ""}
          onChange={(e) => handleChange("heroEyebrow", e.target.value)}
          placeholder="Ex: Psicologia online"
          className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-[var(--platform-text)] placeholder:text-[var(--platform-text)]/30 focus:border-[#22D3EE] focus:outline-none"
        />
      </div>

      <div>
        <label className="text-xs font-medium text-[var(--platform-text)]/60">
          Título principal
        </label>
        <input
          type="text"
          value={content.heroTitle || ""}
          onChange={(e) => handleChange("heroTitle", e.target.value)}
          placeholder="Ex: Cuidado emocional para viver com mais clareza"
          className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-[var(--platform-text)] placeholder:text-[var(--platform-text)]/30 focus:border-[#22D3EE] focus:outline-none"
        />
      </div>

      <div>
        <label className="text-xs font-medium text-[var(--platform-text)]/60">
          Subtítulo
        </label>
        <textarea
          value={content.heroSubtitle || ""}
          onChange={(e) => handleChange("heroSubtitle", e.target.value)}
          placeholder="Uma breve descrição do que você faz..."
          rows={3}
          className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-[var(--platform-text)] placeholder:text-[var(--platform-text)]/30 focus:border-[#22D3EE] focus:outline-none resize-none"
        />
      </div>

      <div>
        <label className="text-xs font-medium text-[var(--platform-text)]/60">
          Texto do botão
        </label>
        <input
          type="text"
          value={content.heroCtaLabel || ""}
          onChange={(e) => handleChange("heroCtaLabel", e.target.value)}
          placeholder="Ex: Agendar sessão"
          className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-[var(--platform-text)] placeholder:text-[var(--platform-text)]/30 focus:border-[#22D3EE] focus:outline-none"
        />
      </div>

      <div>
        <label className="text-xs font-medium text-[var(--platform-text)]/60">
          Link do botão (destino)
        </label>
        <input
          type="text"
          value={content.heroCtaUrl || ""}
          onChange={(e) => handleChange("heroCtaUrl", e.target.value)}
          placeholder="Ex: https://wa.me/5511999999999 ou #contato"
          className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-[var(--platform-text)] placeholder:text-[var(--platform-text)]/30 focus:border-[#22D3EE] focus:outline-none"
        />
        <p className="mt-1 text-[10px] text-[var(--platform-text)]/40">
          Use #contato para rolar até a seção de contato, ou cole um link externo
        </p>
      </div>
    </div>
  );
}

function ServicesContentEditor() {
  const { state, dispatch } = useWizard();
  const { content, serviceCards } = state;

  function handleChange(key: string, value: string) {
    dispatch({ type: "UPDATE_CONTENT", key, value });
  }

  function handleServiceChange(index: number, field: string, value: string) {
    dispatch({ type: "UPDATE_SERVICE_CARD", index, data: { [field]: value } });
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-medium text-[var(--platform-text)]/60">
          Título da seção
        </label>
        <input
          type="text"
          value={content.servicesTitle || ""}
          onChange={(e) => handleChange("servicesTitle", e.target.value)}
          placeholder="Ex: Serviços"
          className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-[var(--platform-text)] placeholder:text-[var(--platform-text)]/30 focus:border-[#22D3EE] focus:outline-none"
        />
      </div>

      <div className="border-t border-white/10 pt-4">
        <p className="text-xs font-medium text-[var(--platform-text)]/60 mb-3">
          Textos dos cards
        </p>
        <div className="space-y-3">
          {serviceCards.map((card, index) => (
            <div
              key={index}
              className="rounded-lg border border-white/10 bg-white/[0.02] p-3 space-y-2"
            >
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded bg-[#22D3EE]/20 text-xs font-bold text-[#22D3EE]">
                  {index + 1}
                </span>
                <input
                  type="text"
                  value={card.title}
                  onChange={(e) => handleServiceChange(index, "title", e.target.value)}
                  placeholder="Título"
                  className="flex-1 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-sm text-[var(--platform-text)] placeholder:text-[var(--platform-text)]/30 focus:border-[#22D3EE] focus:outline-none"
                />
              </div>
              <textarea
                value={card.description}
                onChange={(e) => handleServiceChange(index, "description", e.target.value)}
                placeholder="Descrição do serviço..."
                rows={2}
                className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-sm text-[var(--platform-text)] placeholder:text-[var(--platform-text)]/30 focus:border-[#22D3EE] focus:outline-none resize-none"
              />
              {/* imagem do card */}
              <div className="flex items-center gap-2">
                {card.imageUrl ? (
                  <div className="relative h-10 w-16 shrink-0 overflow-hidden rounded-md border border-white/10">
                    <img src={card.imageUrl} alt={card.title} className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleServiceChange(index, "imageUrl", "")}
                      className="absolute inset-0 flex items-center justify-center bg-black/50 text-[10px] text-white opacity-0 hover:opacity-100 transition"
                    >
                      Remover
                    </button>
                  </div>
                ) : null}
                <label className="cursor-pointer rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 text-[11px] text-[var(--platform-text)]/60 hover:bg-white/[0.08] transition">
                  {card.imageUrl ? "Trocar imagem" : "+ Imagem do serviço"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = (ev) => {
                        handleServiceChange(index, "imageUrl", ev.target?.result as string);
                      };
                      reader.readAsDataURL(file);
                    }}
                  />
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CtaContentEditor() {
  const { state, dispatch } = useWizard();
  const { content, ctaVariant } = state;

  function handleChange(key: string, value: string) {
    dispatch({ type: "UPDATE_CONTENT", key, value });
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-medium text-[var(--platform-text)]/60">
          Título
        </label>
        <input
          type="text"
          value={content.ctaTitle || ""}
          onChange={(e) => handleChange("ctaTitle", e.target.value)}
          placeholder="Ex: Vamos conversar?"
          className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-[var(--platform-text)] placeholder:text-[var(--platform-text)]/30 focus:border-[#22D3EE] focus:outline-none"
        />
      </div>

      <div>
        <label className="text-xs font-medium text-[var(--platform-text)]/60">
          Descrição
        </label>
        <textarea
          value={content.ctaDescription || ""}
          onChange={(e) => handleChange("ctaDescription", e.target.value)}
          placeholder="Uma frase convidativa para seus visitantes entrarem em contato..."
          rows={3}
          className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-[var(--platform-text)] placeholder:text-[var(--platform-text)]/30 focus:border-[#22D3EE] focus:outline-none resize-none"
        />
      </div>

      <div>
        <label className="text-xs font-medium text-[var(--platform-text)]/60">
          Texto do botão principal
        </label>
        <input
          type="text"
          value={content.ctaButtonLabel || ""}
          onChange={(e) => handleChange("ctaButtonLabel", e.target.value)}
          placeholder="Ex: Falar no WhatsApp"
          className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-[var(--platform-text)] placeholder:text-[var(--platform-text)]/30 focus:border-[#22D3EE] focus:outline-none"
        />
      </div>

      <div>
        <label className="text-xs font-medium text-[var(--platform-text)]/60">
          Link do botão (destino)
        </label>
        <input
          type="text"
          value={content.ctaButtonUrl || ""}
          onChange={(e) => handleChange("ctaButtonUrl", e.target.value)}
          placeholder="Ex: https://wa.me/5511999999999 ou #contato"
          className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-[var(--platform-text)] placeholder:text-[var(--platform-text)]/30 focus:border-[#22D3EE] focus:outline-none"
        />
        <p className="mt-1 text-[10px] text-[var(--platform-text)]/40">
          Use #contato para rolar até a seção de contato, ou cole um link externo
        </p>
      </div>

      {/* Secondary button fields — only for "double" variant */}
      {ctaVariant === "double" && (
        <div className="border-t border-white/10 pt-4 space-y-4">
          <p className="text-xs font-medium text-[var(--platform-text)]/60">
            Segundo botão (outline)
          </p>

          <div>
            <label className="text-xs text-[var(--platform-text)]/50">
              Texto do segundo botão
            </label>
            <input
              type="text"
              value={content.ctaSecondaryLabel || ""}
              onChange={(e) => handleChange("ctaSecondaryLabel", e.target.value)}
              placeholder="Ex: Saiba mais"
              className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-[var(--platform-text)] placeholder:text-[var(--platform-text)]/30 focus:border-[#22D3EE] focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs text-[var(--platform-text)]/50">
              Link do segundo botão
            </label>
            <input
              type="text"
              value={content.ctaSecondaryUrl || ""}
              onChange={(e) => handleChange("ctaSecondaryUrl", e.target.value)}
              placeholder="Ex: /sobre ou https://exemplo.com"
              className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-[var(--platform-text)] placeholder:text-[var(--platform-text)]/30 focus:border-[#22D3EE] focus:outline-none"
            />
          </div>
        </div>
      )}
    </div>
  );
}

function ContactContentEditor() {
  const { state, dispatch } = useWizard();
  const { content, logoUrl } = state;

  function handleChange(key: string, value: string) {
    dispatch({ type: "UPDATE_CONTENT", key, value });
  }

  return (
    <div className="space-y-4">
      {/* Logo upload inline */}
      <ImageUpload
        label="Logo do seu negócio"
        value={logoUrl}
        onChange={(url) => dispatch({ type: "SET_IMAGE", key: "logoUrl", url })}
        slot="logoUrl"
        aspectRatio="1/1"
        description="Formato quadrado, PNG transparente recomendado"
      />

      <div className="border-t border-white/10 pt-4">
        <label className="text-xs font-medium text-[var(--platform-text)]/60">
          Título da seção
        </label>
        <input
          type="text"
          value={content.contactTitle || ""}
          onChange={(e) => handleChange("contactTitle", e.target.value)}
          placeholder="Ex: Entre em contato"
          className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-[var(--platform-text)] placeholder:text-[var(--platform-text)]/30 focus:border-[#22D3EE] focus:outline-none"
        />
      </div>

      <div>
        <label className="text-xs font-medium text-[var(--platform-text)]/60">
          Subtítulo
        </label>
        <input
          type="text"
          value={content.contactSubtitle || ""}
          onChange={(e) => handleChange("contactSubtitle", e.target.value)}
          placeholder="Ex: Estou aqui para ajudar"
          className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-[var(--platform-text)] placeholder:text-[var(--platform-text)]/30 focus:border-[#22D3EE] focus:outline-none"
        />
      </div>

      <div className="border-t border-white/10 pt-4">
        <p className="text-xs font-medium text-[var(--platform-text)]/60 mb-3">
          Informações de contato (preencha os que você usa)
        </p>

        <div className="space-y-3">
          <div>
            <label className="text-xs text-[var(--platform-text)]/50">WhatsApp</label>
            <input
              type="text"
              value={content.whatsapp || ""}
              onChange={(e) => handleChange("whatsapp", e.target.value)}
              placeholder="Ex: 11999999999"
              className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-[var(--platform-text)] placeholder:text-[var(--platform-text)]/30 focus:border-[#22D3EE] focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs text-[var(--platform-text)]/50">Email</label>
            <input
              type="email"
              value={content.email || ""}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="Ex: contato@exemplo.com"
              className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-[var(--platform-text)] placeholder:text-[var(--platform-text)]/30 focus:border-[#22D3EE] focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs text-[var(--platform-text)]/50">Instagram</label>
            <input
              type="text"
              value={content.instagram || ""}
              onChange={(e) => handleChange("instagram", e.target.value)}
              placeholder="Ex: @seuperfil"
              className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-[var(--platform-text)] placeholder:text-[var(--platform-text)]/30 focus:border-[#22D3EE] focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs text-[var(--platform-text)]/50">LinkedIn</label>
            <input
              type="text"
              value={content.linkedin || ""}
              onChange={(e) => handleChange("linkedin", e.target.value)}
              placeholder="Ex: linkedin.com/in/seuperfil"
              className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-[var(--platform-text)] placeholder:text-[var(--platform-text)]/30 focus:border-[#22D3EE] focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs text-[var(--platform-text)]/50">Facebook</label>
            <input
              type="text"
              value={content.facebook || ""}
              onChange={(e) => handleChange("facebook", e.target.value)}
              placeholder="Ex: facebook.com/suapagina"
              className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-[var(--platform-text)] placeholder:text-[var(--platform-text)]/30 focus:border-[#22D3EE] focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 pt-4">
        <p className="text-xs font-medium text-[var(--platform-text)]/60 mb-3">
          Rodapé
        </p>

        <div>
          <label className="text-xs text-[var(--platform-text)]/50">Texto do rodapé</label>
          <input
            type="text"
            value={content.footerText || ""}
            onChange={(e) => handleChange("footerText", e.target.value)}
            placeholder="Ex: © 2025 Seu Nome. Todos os direitos reservados."
            className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-[var(--platform-text)] placeholder:text-[var(--platform-text)]/30 focus:border-[#22D3EE] focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}

function SeoContentEditor() {
  const { state, dispatch } = useWizard();
  const { content } = state;

  function handleChange(key: string, value: string) {
    dispatch({ type: "UPDATE_CONTENT", key, value });
  }

  const metaTitleLen = (content.seoTitle || "").length;
  const metaDescLen = (content.seoDescription || "").length;

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-[#22D3EE]/20 bg-[#22D3EE]/5 p-3">
        <p className="text-xs text-[#22D3EE]/80">
          SEO ajuda seu site a aparecer no Google. Preencha para melhorar seu posicionamento.
        </p>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-[var(--platform-text)]/60">
            Título SEO (meta title)
          </label>
          <span className={`text-[10px] ${metaTitleLen > 60 ? "text-red-400" : "text-[var(--platform-text)]/40"}`}>
            {metaTitleLen}/60
          </span>
        </div>
        <input
          type="text"
          value={content.seoTitle || ""}
          onChange={(e) => handleChange("seoTitle", e.target.value)}
          placeholder="Ex: Psicologia Online | Dra. Maria Silva"
          className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-[var(--platform-text)] placeholder:text-[var(--platform-text)]/30 focus:border-[#22D3EE] focus:outline-none"
        />
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-[var(--platform-text)]/60">
            Descrição SEO (meta description)
          </label>
          <span className={`text-[10px] ${metaDescLen > 160 ? "text-red-400" : "text-[var(--platform-text)]/40"}`}>
            {metaDescLen}/160
          </span>
        </div>
        <textarea
          value={content.seoDescription || ""}
          onChange={(e) => handleChange("seoDescription", e.target.value)}
          placeholder="Breve descrição do seu negócio que aparece nos resultados do Google..."
          rows={3}
          className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-[var(--platform-text)] placeholder:text-[var(--platform-text)]/30 focus:border-[#22D3EE] focus:outline-none resize-none"
        />
      </div>

      <div>
        <label className="text-xs font-medium text-[var(--platform-text)]/60">
          Palavras-chave (separadas por vírgula)
        </label>
        <input
          type="text"
          value={content.seoKeywords || ""}
          onChange={(e) => handleChange("seoKeywords", e.target.value)}
          placeholder="Ex: psicologia online, terapia, saúde mental"
          className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-[var(--platform-text)] placeholder:text-[var(--platform-text)]/30 focus:border-[#22D3EE] focus:outline-none"
        />
      </div>

      {/* Google preview */}
      <div className="border-t border-white/10 pt-4">
        <p className="text-xs font-medium text-[var(--platform-text)]/60 mb-3">
          Preview no Google
        </p>
        <div className="rounded-lg border border-white/10 bg-white p-3">
          <p className="text-[11px] text-green-700 font-mono truncate">
            {state.preferredSubdomain || "seusite"}.{process.env.NEXT_PUBLIC_PLATFORM_ROOT_DOMAIN || "bsph.com.br"}
          </p>
          <p className="text-sm text-blue-700 font-medium truncate mt-0.5">
            {content.seoTitle || content.heroTitle || "Título do seu site"}
          </p>
          <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">
            {content.seoDescription || content.heroSubtitle || "Descrição do seu site aparece aqui..."}
          </p>
        </div>
      </div>
    </div>
  );
}

export function ContentEditorStep() {
  const { state } = useWizard();
  const { content } = state;
  const [activeTab, setActiveTab] = useState<SectionTab>("hero");

  const canProceed =
    !!content.heroTitle &&
    content.heroTitle.length > 0;

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#22D3EE]">
          Conteúdo
        </p>
        <h1 className="mt-2 text-2xl font-black text-[var(--platform-text)] md:text-3xl">
          Escreva os textos do seu site
        </h1>
        <p className="mt-2 max-w-xl text-sm text-[var(--platform-text)]/60">
          Personalize cada seção com suas palavras. O preview ao lado mostra as mudanças em tempo real.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 p-1 rounded-xl border border-white/10 bg-white/[0.02]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 flex-1 rounded-lg px-3 py-2 text-sm font-medium transition ${
              activeTab === tab.id
                ? "bg-[#22D3EE]/20 text-[#22D3EE]"
                : "text-[var(--platform-text)]/60 hover:text-[var(--platform-text)] hover:bg-white/[0.04]"
            }`}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "hero" && <HeroContentEditor />}
            {activeTab === "services" && <ServicesContentEditor />}
            {activeTab === "cta" && <CtaContentEditor />}
            {activeTab === "contact" && <ContactContentEditor />}
            {activeTab === "seo" && <SeoContentEditor />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <StepNavigation canProceed={canProceed} />
    </div>
  );
}
