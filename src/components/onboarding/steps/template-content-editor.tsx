"use client";

import { useEffect } from "react";
import { useWizard } from "../wizard-context";
import { StepNavigation } from "../step-navigation";
import { ImageUpload } from "../builders/image-upload";
import { getTemplateBySlug } from "@/lib/onboarding/templates";
import { LayoutGrid, List, MessageCircle, Instagram, Mail, Linkedin, Facebook } from "lucide-react";

export function TemplateContentEditor() {
  const { state, dispatch } = useWizard();
  const { selectedTemplateSlug, content, servicesDisplayMode, serviceCards } = state;

  const template = selectedTemplateSlug ? getTemplateBySlug(selectedTemplateSlug) : null;

  // Apply template content defaults on mount (visual settings already applied in gallery)
  useEffect(() => {
    if (template) {
      dispatch({ type: "UPDATE_CONTENT", key: "heroEyebrow", value: template.defaultContent.heroEyebrow });
      dispatch({ type: "UPDATE_CONTENT", key: "heroTitle", value: template.defaultContent.heroTitle });
      dispatch({ type: "UPDATE_CONTENT", key: "heroSubtitle", value: template.defaultContent.heroSubtitle });
      dispatch({ type: "UPDATE_CONTENT", key: "heroCtaLabel", value: template.defaultContent.heroCtaLabel });
      dispatch({ type: "UPDATE_CONTENT", key: "servicesTitle", value: template.defaultContent.servicesTitle });
      dispatch({ type: "UPDATE_CONTENT", key: "ctaTitle", value: template.defaultContent.ctaTitle });
      dispatch({ type: "UPDATE_CONTENT", key: "ctaDescription", value: template.defaultContent.ctaDescription });
      dispatch({ type: "UPDATE_CONTENT", key: "ctaButtonLabel", value: template.defaultContent.ctaButtonLabel });

      // Apply service items
      const items = template.defaultContent.serviceItems;
      items.forEach((item, i) => {
        if (i < serviceCards.length) {
          dispatch({ type: "UPDATE_SERVICE_CARD", index: i, data: { title: item } });
        }
      });
    }
  }, [template?.slug]);

  function handleContentChange(key: string, value: string) {
    dispatch({ type: "UPDATE_CONTENT", key, value });
  }

  function handleServiceChange(index: number, value: string) {
    dispatch({ type: "UPDATE_SERVICE_CARD", index, data: { title: value } });
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#22D3EE]">
          Personalize o conteúdo
        </p>
        <h1 className="mt-2 text-2xl font-black text-[var(--platform-text)] md:text-3xl">
          Seu site, seus textos
        </h1>
        <p className="mt-2 max-w-xl text-sm text-[var(--platform-text)]/60">
          Edite os textos para deixar com a sua cara. O visual do template será mantido.
        </p>
      </div>

      <div className="space-y-6">
        {/* Hero section */}
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
          <h3 className="text-sm font-semibold text-[var(--platform-text)]">Hero</h3>
          <p className="text-xs text-[var(--platform-text)]/50">A primeira coisa que seus visitantes vão ver</p>

          <div className="mt-4 space-y-4">
            {/* Hero image */}
            <ImageUpload
              label="Imagem do Hero"
              value={state.heroImage}
              onChange={(url) => dispatch({ type: "SET_IMAGE", key: "heroImage", url })}
              slot="heroImage"
              aspectRatio="16/9"
              description="Imagem de destaque (opcional)"
            />

            <div>
              <label className="text-xs font-medium text-[var(--platform-text)]/60">Eyebrow (pequeno texto acima)</label>
              <input
                type="text"
                value={content.heroEyebrow || ""}
                onChange={(e) => handleContentChange("heroEyebrow", e.target.value)}
                placeholder="Ex: Psicologia online"
                className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-[var(--platform-text)] placeholder:text-[var(--platform-text)]/30 focus:border-[#22D3EE] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-[var(--platform-text)]/60">Título principal</label>
              <input
                type="text"
                value={content.heroTitle || ""}
                onChange={(e) => handleContentChange("heroTitle", e.target.value)}
                placeholder="Ex: Cuidado emocional para viver com mais clareza"
                className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-[var(--platform-text)] placeholder:text-[var(--platform-text)]/30 focus:border-[#22D3EE] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-[var(--platform-text)]/60">Subtítulo</label>
              <textarea
                value={content.heroSubtitle || ""}
                onChange={(e) => handleContentChange("heroSubtitle", e.target.value)}
                placeholder="Uma breve descrição do que você faz..."
                rows={2}
                className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-[var(--platform-text)] placeholder:text-[var(--platform-text)]/30 focus:border-[#22D3EE] focus:outline-none resize-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-[var(--platform-text)]/60">Texto do botão</label>
              <input
                type="text"
                value={content.heroCtaLabel || ""}
                onChange={(e) => handleContentChange("heroCtaLabel", e.target.value)}
                placeholder="Ex: Agendar sessão"
                className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-[var(--platform-text)] placeholder:text-[var(--platform-text)]/30 focus:border-[#22D3EE] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-[var(--platform-text)]/60">Link do botão (destino)</label>
              <input
                type="text"
                value={content.heroCtaUrl || ""}
                onChange={(e) => handleContentChange("heroCtaUrl", e.target.value)}
                placeholder="Ex: https://wa.me/5511999999999 ou #contato"
                className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-[var(--platform-text)] placeholder:text-[var(--platform-text)]/30 focus:border-[#22D3EE] focus:outline-none"
              />
              <p className="mt-1 text-[10px] text-[var(--platform-text)]/40">
                Use #contato para rolar até a seção de contato, ou cole um link externo
              </p>
            </div>
          </div>
        </div>

        {/* Services section */}
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-[var(--platform-text)]">Serviços</h3>
              <p className="text-xs text-[var(--platform-text)]/50">O que você oferece aos seus clientes</p>
            </div>

            {/* Display mode toggle */}
            <div className="flex rounded-lg border border-white/10 p-0.5">
              <button
                onClick={() => dispatch({ type: "SET_SERVICES_DISPLAY", mode: "grid" })}
                className={`flex items-center gap-1 rounded-md px-2 py-1 text-xs transition ${
                  servicesDisplayMode === "grid"
                    ? "bg-[#22D3EE]/20 text-[#22D3EE]"
                    : "text-[var(--platform-text)]/50 hover:text-[var(--platform-text)]"
                }`}
              >
                <LayoutGrid size={12} />
                Grid
              </button>
              <button
                onClick={() => dispatch({ type: "SET_SERVICES_DISPLAY", mode: "list" })}
                className={`flex items-center gap-1 rounded-md px-2 py-1 text-xs transition ${
                  servicesDisplayMode === "list"
                    ? "bg-[#22D3EE]/20 text-[#22D3EE]"
                    : "text-[var(--platform-text)]/50 hover:text-[var(--platform-text)]"
                }`}
              >
                <List size={12} />
                Lista
              </button>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <div>
              <label className="text-xs font-medium text-[var(--platform-text)]/60">Título da seção</label>
              <input
                type="text"
                value={content.servicesTitle || ""}
                onChange={(e) => handleContentChange("servicesTitle", e.target.value)}
                placeholder="Ex: Serviços"
                className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-[var(--platform-text)] placeholder:text-[var(--platform-text)]/30 focus:border-[#22D3EE] focus:outline-none"
              />
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              {serviceCards.slice(0, 4).map((card, i) => (
                <input
                  key={i}
                  type="text"
                  value={card.title}
                  onChange={(e) => handleServiceChange(i, e.target.value)}
                  placeholder={`Serviço ${i + 1}`}
                  className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-[var(--platform-text)] placeholder:text-[var(--platform-text)]/30 focus:border-[#22D3EE] focus:outline-none"
                />
              ))}
            </div>
          </div>
        </div>

        {/* CTA section */}
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
          <h3 className="text-sm font-semibold text-[var(--platform-text)]">Call to Action</h3>
          <p className="text-xs text-[var(--platform-text)]/50">Convide seus visitantes a entrar em contato</p>

          <div className="mt-4 space-y-4">
            <div>
              <label className="text-xs font-medium text-[var(--platform-text)]/60">Título</label>
              <input
                type="text"
                value={content.ctaTitle || ""}
                onChange={(e) => handleContentChange("ctaTitle", e.target.value)}
                placeholder="Ex: Vamos conversar?"
                className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-[var(--platform-text)] placeholder:text-[var(--platform-text)]/30 focus:border-[#22D3EE] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-[var(--platform-text)]/60">Descrição</label>
              <textarea
                value={content.ctaDescription || ""}
                onChange={(e) => handleContentChange("ctaDescription", e.target.value)}
                placeholder="Uma frase convidativa..."
                rows={2}
                className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-[var(--platform-text)] placeholder:text-[var(--platform-text)]/30 focus:border-[#22D3EE] focus:outline-none resize-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-[var(--platform-text)]/60">Texto do botão</label>
              <input
                type="text"
                value={content.ctaButtonLabel || ""}
                onChange={(e) => handleContentChange("ctaButtonLabel", e.target.value)}
                placeholder="Ex: Falar no WhatsApp"
                className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-[var(--platform-text)] placeholder:text-[var(--platform-text)]/30 focus:border-[#22D3EE] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-[var(--platform-text)]/60">Link do botão (destino)</label>
              <input
                type="text"
                value={content.ctaButtonUrl || ""}
                onChange={(e) => handleContentChange("ctaButtonUrl", e.target.value)}
                placeholder="Ex: https://wa.me/5511999999999 ou #contato"
                className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-[var(--platform-text)] placeholder:text-[var(--platform-text)]/30 focus:border-[#22D3EE] focus:outline-none"
              />
              <p className="mt-1 text-[10px] text-[var(--platform-text)]/40">
                Use #contato para rolar até a seção de contato, ou cole um link externo
              </p>
            </div>
          </div>
        </div>

        {/* Social links & contact */}
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
          <h3 className="text-sm font-semibold text-[var(--platform-text)]">Redes sociais e contato</h3>
          <p className="text-xs text-[var(--platform-text)]/50">Preencha apenas os canais que você usa. Aparecem como ícones na seção de contato.</p>

          <div className="mt-4 space-y-3">
            {/* WhatsApp */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium text-[var(--platform-text)]/60">
                <MessageCircle size={12} /> WhatsApp
              </label>
              <div className="mt-1 flex">
                <span className="flex items-center rounded-l-lg border border-r-0 border-white/10 bg-white/[0.06] px-3 text-xs text-[var(--platform-text)]/40">
                  wa.me/
                </span>
                <input
                  type="text"
                  value={content.social_whatsapp || ""}
                  onChange={(e) => handleContentChange("social_whatsapp", e.target.value)}
                  placeholder="5511999999999"
                  className="w-full rounded-r-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-[var(--platform-text)] placeholder:text-[var(--platform-text)]/30 focus:border-[#22D3EE] focus:outline-none"
                />
              </div>
            </div>

            {/* Instagram */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium text-[var(--platform-text)]/60">
                <Instagram size={12} /> Instagram
              </label>
              <div className="mt-1 flex">
                <span className="flex items-center rounded-l-lg border border-r-0 border-white/10 bg-white/[0.06] px-3 text-xs text-[var(--platform-text)]/40">
                  instagram.com/
                </span>
                <input
                  type="text"
                  value={content.social_instagram || ""}
                  onChange={(e) => handleContentChange("social_instagram", e.target.value)}
                  placeholder="seuperfil"
                  className="w-full rounded-r-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-[var(--platform-text)] placeholder:text-[var(--platform-text)]/30 focus:border-[#22D3EE] focus:outline-none"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium text-[var(--platform-text)]/60">
                <Mail size={12} /> E-mail
              </label>
              <input
                type="email"
                value={content.social_email || ""}
                onChange={(e) => handleContentChange("social_email", e.target.value)}
                placeholder="contato@exemplo.com"
                className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-[var(--platform-text)] placeholder:text-[var(--platform-text)]/30 focus:border-[#22D3EE] focus:outline-none"
              />
            </div>

            {/* LinkedIn */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium text-[var(--platform-text)]/60">
                <Linkedin size={12} /> LinkedIn
              </label>
              <div className="mt-1 flex">
                <span className="flex items-center rounded-l-lg border border-r-0 border-white/10 bg-white/[0.06] px-3 text-xs text-[var(--platform-text)]/40">
                  linkedin.com/
                </span>
                <input
                  type="text"
                  value={content.social_linkedin || ""}
                  onChange={(e) => handleContentChange("social_linkedin", e.target.value)}
                  placeholder="in/seuperfil"
                  className="w-full rounded-r-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-[var(--platform-text)] placeholder:text-[var(--platform-text)]/30 focus:border-[#22D3EE] focus:outline-none"
                />
              </div>
            </div>

            {/* Facebook */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium text-[var(--platform-text)]/60">
                <Facebook size={12} /> Facebook
              </label>
              <div className="mt-1 flex">
                <span className="flex items-center rounded-l-lg border border-r-0 border-white/10 bg-white/[0.06] px-3 text-xs text-[var(--platform-text)]/40">
                  facebook.com/
                </span>
                <input
                  type="text"
                  value={content.social_facebook || ""}
                  onChange={(e) => handleContentChange("social_facebook", e.target.value)}
                  placeholder="suapagina"
                  className="w-full rounded-r-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-[var(--platform-text)] placeholder:text-[var(--platform-text)]/30 focus:border-[#22D3EE] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Logo + Footer */}
          <div className="mt-4 space-y-4 border-t border-white/10 pt-4">
            <ImageUpload
              label="Logo do seu negócio"
              value={state.logoUrl}
              onChange={(url) => dispatch({ type: "SET_IMAGE", key: "logoUrl", url })}
              slot="logoUrl"
              aspectRatio="1/1"
              description="Formato quadrado, PNG transparente recomendado"
            />

            <div>
              <label className="text-xs font-medium text-[var(--platform-text)]/60">Texto do rodapé</label>
              <input
                type="text"
                value={content.footerText || ""}
                onChange={(e) => handleContentChange("footerText", e.target.value)}
                placeholder="Ex: © 2025 Seu Nome. Todos os direitos reservados."
                className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-[var(--platform-text)] placeholder:text-[var(--platform-text)]/30 focus:border-[#22D3EE] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* SEO section */}
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
          <h3 className="text-sm font-semibold text-[var(--platform-text)]">SEO</h3>
          <p className="text-xs text-[var(--platform-text)]/50">Ajude seu site a aparecer no Google</p>

          <div className="mt-4 space-y-4">
            <div className="rounded-lg border border-[#22D3EE]/20 bg-[#22D3EE]/5 p-3">
              <p className="text-xs text-[#22D3EE]/80">
                SEO ajuda seu site a aparecer no Google. Preencha para melhorar seu posicionamento.
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-[var(--platform-text)]/60">Título SEO</label>
                <span className={`text-[10px] ${(content.seoTitle || "").length > 60 ? "text-red-400" : "text-[var(--platform-text)]/40"}`}>
                  {(content.seoTitle || "").length}/60
                </span>
              </div>
              <input
                type="text"
                value={content.seoTitle || ""}
                onChange={(e) => handleContentChange("seoTitle", e.target.value)}
                placeholder="Ex: Psicologia Online | Dra. Maria Silva"
                className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-[var(--platform-text)] placeholder:text-[var(--platform-text)]/30 focus:border-[#22D3EE] focus:outline-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-[var(--platform-text)]/60">Descrição SEO</label>
                <span className={`text-[10px] ${(content.seoDescription || "").length > 160 ? "text-red-400" : "text-[var(--platform-text)]/40"}`}>
                  {(content.seoDescription || "").length}/160
                </span>
              </div>
              <textarea
                value={content.seoDescription || ""}
                onChange={(e) => handleContentChange("seoDescription", e.target.value)}
                placeholder="Breve descrição do seu negócio que aparece nos resultados do Google..."
                rows={2}
                className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-[var(--platform-text)] placeholder:text-[var(--platform-text)]/30 focus:border-[#22D3EE] focus:outline-none resize-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <StepNavigation canProceed={!!content.heroTitle && content.heroTitle.length > 0} />
    </div>
  );
}
