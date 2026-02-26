"use client";

import { useEffect, useMemo, useState } from "react";
import { useWizard } from "../wizard-context";
import { StepNavigation } from "../step-navigation";
import { ImageUpload } from "../builders/image-upload";
import { IconPickerInline } from "../builders/icon-picker";
import { LinkDestinationSelect } from "../builders/link-destination-select";
import { getTemplateBySlug } from "@/lib/onboarding/templates";
import { MessageCircle, Instagram, Mail, Linkedin, Facebook, Check, Plus, Trash2 } from "lucide-react";

type Testimonial = { quote: string; author: string };

export function TemplateContentEditor() {
  const { state, dispatch } = useWizard();
  const { selectedTemplateSlug, content, serviceCards } = state;

  // Local testimonials state — synced to content.testimonialsJson
  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => {
    try {
      const parsed = JSON.parse(content.testimonialsJson || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  function updateTestimonials(newList: Testimonial[]) {
    setTestimonials(newList);
    dispatch({ type: "UPDATE_CONTENT", key: "testimonialsJson", value: JSON.stringify(newList) });
  }

  function addTestimonial() {
    if (testimonials.length >= 3) return;
    updateTestimonials([...testimonials, { quote: "", author: "" }]);
  }

  function removeTestimonial(index: number) {
    updateTestimonials(testimonials.filter((_, i) => i !== index));
  }

  function updateTestimonialField(index: number, field: keyof Testimonial, value: string) {
    const next = testimonials.map((t, i) => (i === index ? { ...t, [field]: value } : t));
    updateTestimonials(next);
  }

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

  // Registered social links for contact checkboxes
  const registeredLinks = useMemo(() => {
    const links: { type: string; label: string; Icon: React.ComponentType<{ size?: number; className?: string }> }[] = [];
    if (content.social_whatsapp?.trim()) links.push({ type: "whatsapp", label: "WhatsApp", Icon: MessageCircle });
    if (content.social_instagram?.trim()) links.push({ type: "instagram", label: "Instagram", Icon: Instagram });
    if (content.social_email?.trim()) links.push({ type: "email", label: "E-mail", Icon: Mail });
    if (content.social_linkedin?.trim()) links.push({ type: "linkedin", label: "LinkedIn", Icon: Linkedin });
    if (content.social_facebook?.trim()) links.push({ type: "facebook", label: "Facebook", Icon: Facebook });
    return links;
  }, [content.social_whatsapp, content.social_instagram, content.social_email, content.social_linkedin, content.social_facebook]);

  const inputClass = "mt-1 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-[var(--platform-text)] placeholder:text-[var(--platform-text)]/30 focus:border-[#22D3EE] focus:outline-none";
  const labelClass = "text-xs font-medium text-[var(--platform-text)]/60";

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

        {/* ─── 1. Seus canais de contato ──────────────────── */}
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
          <h3 className="text-sm font-semibold text-[var(--platform-text)]">Seus canais de contato</h3>
          <p className="text-xs text-[var(--platform-text)]/50">
            Preencha seus links — eles aparecem como opções nos botões e na seção de contato.
          </p>

          <div className="mt-4 space-y-3">
            {/* WhatsApp */}
            <div>
              <label className={`flex items-center gap-1.5 ${labelClass}`}>
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
              <label className={`flex items-center gap-1.5 ${labelClass}`}>
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
              <label className={`flex items-center gap-1.5 ${labelClass}`}>
                <Mail size={12} /> E-mail
              </label>
              <input
                type="email"
                value={content.social_email || ""}
                onChange={(e) => handleContentChange("social_email", e.target.value)}
                placeholder="contato@exemplo.com"
                className={inputClass}
              />
            </div>

            {/* LinkedIn */}
            <div>
              <label className={`flex items-center gap-1.5 ${labelClass}`}>
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
              <label className={`flex items-center gap-1.5 ${labelClass}`}>
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
        </div>

        {/* ─── 2. Logo + Rodapé ──────────────────────────── */}
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
          <h3 className="text-sm font-semibold text-[var(--platform-text)]">Identidade</h3>
          <p className="text-xs text-[var(--platform-text)]/50">Logo e rodapé do seu site</p>

          <div className="mt-4 space-y-4">
            <ImageUpload
              label="Logo do seu negócio"
              value={state.logoUrl}
              onChange={(url) => dispatch({ type: "SET_IMAGE", key: "logoUrl", url })}
              slot="logoUrl"
              variant="avatar"
              description="PNG transparente recomendado"
            />

            <div>
              <label className={labelClass}>Texto do rodapé</label>
              <input
                type="text"
                value={content.footerText || ""}
                onChange={(e) => handleContentChange("footerText", e.target.value)}
                placeholder="Ex: © 2025 Seu Nome. Todos os direitos reservados."
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* ─── 3. Hero ───────────────────────────────────── */}
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
          <h3 className="text-sm font-semibold text-[var(--platform-text)]">Hero</h3>
          <p className="text-xs text-[var(--platform-text)]/50">A primeira coisa que seus visitantes vão ver</p>

          <div className="mt-4 space-y-4">
            <ImageUpload
              label="Imagem do Hero"
              value={state.heroImage}
              onChange={(url) => dispatch({ type: "SET_IMAGE", key: "heroImage", url })}
              slot="heroImage"
              variant="compact"
              description="Imagem de destaque (opcional)"
            />

            <div>
              <label className={labelClass}>Eyebrow (pequeno texto acima)</label>
              <input
                type="text"
                value={content.heroEyebrow || ""}
                onChange={(e) => handleContentChange("heroEyebrow", e.target.value)}
                placeholder="Ex: Psicologia online"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Título principal</label>
              <input
                type="text"
                value={content.heroTitle || ""}
                onChange={(e) => handleContentChange("heroTitle", e.target.value)}
                placeholder="Ex: Cuidado emocional para viver com mais clareza"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Subtítulo</label>
              <textarea
                value={content.heroSubtitle || ""}
                onChange={(e) => handleContentChange("heroSubtitle", e.target.value)}
                placeholder="Uma breve descrição do que você faz..."
                rows={2}
                className={`${inputClass} resize-none`}
              />
            </div>

            <div>
              <label className={labelClass}>Texto do botão</label>
              <input
                type="text"
                value={content.heroCtaLabel || ""}
                onChange={(e) => handleContentChange("heroCtaLabel", e.target.value)}
                placeholder="Ex: Agendar sessão"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Destino do botão</label>
              <LinkDestinationSelect
                value={content.heroCtaUrl || ""}
                onChange={(url) => handleContentChange("heroCtaUrl", url)}
                content={content}
                placeholder="Escolha o destino do botão"
              />
            </div>
          </div>
        </div>

        {/* ─── 4. Serviços ───────────────────────────────── */}
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
          <h3 className="text-sm font-semibold text-[var(--platform-text)]">Serviços</h3>
          <p className="text-xs text-[var(--platform-text)]/50">O que você oferece aos seus clientes</p>

          <div className="mt-4 space-y-3">
            <div>
              <label className={labelClass}>Título da seção</label>
              <input
                type="text"
                value={content.servicesTitle || ""}
                onChange={(e) => handleContentChange("servicesTitle", e.target.value)}
                placeholder="Ex: Serviços"
                className={inputClass}
              />
            </div>

            <div className="space-y-3">
              {serviceCards.slice(0, 4).map((card, i) => (
                <div key={i} className="rounded-lg border border-white/10 bg-white/[0.03] p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-medium text-[var(--platform-text)]/50">
                      Ícone do serviço — clique para selecionar
                    </p>
                    {serviceCards.length > 1 && (
                      <button
                        type="button"
                        onClick={() => dispatch({ type: "REMOVE_SERVICE_CARD", index: i })}
                        className="text-[var(--platform-text)]/30 transition hover:text-red-400"
                        title="Remover serviço"
                      >
                        <Trash2 size={12} />
                      </button>
                    )}
                  </div>
                  <IconPickerInline
                    selectedIcon={card.iconName || card.icon || ""}
                    onSelect={(icon) => dispatch({ type: "UPDATE_SERVICE_CARD", index: i, data: { iconName: icon, icon } })}
                  />
                  <input
                    type="text"
                    value={card.title}
                    onChange={(e) => dispatch({ type: "UPDATE_SERVICE_CARD", index: i, data: { title: e.target.value } })}
                    placeholder={`Serviço ${i + 1}`}
                    className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-[var(--platform-text)] placeholder:text-[var(--platform-text)]/30 focus:border-[#22D3EE] focus:outline-none"
                  />
                  <textarea
                    value={card.description || ""}
                    onChange={(e) => dispatch({ type: "UPDATE_SERVICE_CARD", index: i, data: { description: e.target.value } })}
                    placeholder="Descrição breve (opcional)"
                    rows={1}
                    className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-[var(--platform-text)] placeholder:text-[var(--platform-text)]/30 focus:border-[#22D3EE] focus:outline-none resize-none"
                  />
                  <ImageUpload
                    label="Imagem"
                    value={card.imageUrl || ""}
                    onChange={(url) => dispatch({ type: "UPDATE_SERVICE_CARD", index: i, data: { imageUrl: url } })}
                    slot={`serviceCard-${i}`}
                    variant="compact"
                    description="Imagem para este serviço (opcional)"
                  />
                </div>
              ))}
              {serviceCards.length < 4 && (
                <button
                  type="button"
                  onClick={() => dispatch({ type: "ADD_SERVICE_CARD" })}
                  className="w-full rounded-lg border border-dashed border-white/10 py-2.5 text-xs text-[var(--platform-text)]/30 transition hover:border-[#22D3EE]/20 hover:text-[#22D3EE]/50"
                >
                  + Adicionar serviço
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ─── 5. CTA ────────────────────────────────────── */}
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
          <h3 className="text-sm font-semibold text-[var(--platform-text)]">Call to Action</h3>
          <p className="text-xs text-[var(--platform-text)]/50">Convide seus visitantes a entrar em contato</p>

          <div className="mt-4 space-y-4">
            <div>
              <label className={labelClass}>Título</label>
              <input
                type="text"
                value={content.ctaTitle || ""}
                onChange={(e) => handleContentChange("ctaTitle", e.target.value)}
                placeholder="Ex: Vamos conversar?"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Descrição</label>
              <textarea
                value={content.ctaDescription || ""}
                onChange={(e) => handleContentChange("ctaDescription", e.target.value)}
                placeholder="Uma frase convidativa..."
                rows={2}
                className={`${inputClass} resize-none`}
              />
            </div>

            {/* Button 1 (primary) */}
            <div>
              <label className={labelClass}>Texto do botão principal</label>
              <input
                type="text"
                value={content.ctaButtonLabel || ""}
                onChange={(e) => handleContentChange("ctaButtonLabel", e.target.value)}
                placeholder="Ex: Falar no WhatsApp"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Destino do botão principal</label>
              <LinkDestinationSelect
                value={content.ctaButtonUrl || ""}
                onChange={(url) => handleContentChange("ctaButtonUrl", url)}
                content={content}
              />
            </div>

            {/* Button 2 (secondary) */}
            <div className="border-t border-white/10 pt-4">
              <p className="text-xs font-medium text-[var(--platform-text)]/50 mb-3">Botão secundário (opcional)</p>

              <div className="space-y-3">
                <div>
                  <label className={labelClass}>Texto</label>
                  <input
                    type="text"
                    value={content.ctaSecondaryLabel || ""}
                    onChange={(e) => handleContentChange("ctaSecondaryLabel", e.target.value)}
                    placeholder="Ex: Saiba mais"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Destino</label>
                  <LinkDestinationSelect
                    value={content.ctaSecondaryUrl || ""}
                    onChange={(url) => handleContentChange("ctaSecondaryUrl", url)}
                    content={content}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── 6. Sobre ─────────────────────────────────── */}
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
          <h3 className="text-sm font-semibold text-[var(--platform-text)]">Sobre você</h3>
          <p className="text-xs text-[var(--platform-text)]/50">
            Conte um pouco sobre você e seu negócio — esta seção transmite confiança
          </p>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <ImageUpload
              label="Sua foto ou imagem"
              value={content.aboutImage || ""}
              onChange={(url) => handleContentChange("aboutImage", url)}
              slot="aboutImage"
              variant="compact"
              aspectRatio="3/4"
              description="Foto profissional ou imagem representativa"
            />

            <div className="space-y-3">
              <div>
                <label className={labelClass}>Título da seção</label>
                <input
                  type="text"
                  value={content.aboutTitle || ""}
                  onChange={(e) => handleContentChange("aboutTitle", e.target.value)}
                  placeholder={`Sobre ${state.businessName || "você"}`}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Texto sobre você</label>
                <textarea
                  value={content.aboutBody || ""}
                  onChange={(e) => handleContentChange("aboutBody", e.target.value)}
                  placeholder="Conte sua história, sua experiência e o que te motiva..."
                  rows={5}
                  className={`${inputClass} resize-none`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ─── 7. Contato (checkboxes) ───────────────────── */}
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
          <h3 className="text-sm font-semibold text-[var(--platform-text)]">Seção de Contato</h3>
          <p className="text-xs text-[var(--platform-text)]/50">
            Escolha até 2 canais para exibir na seção de contato do site
          </p>

          <div className="mt-4 space-y-2">
            {registeredLinks.length === 0 ? (
              <p className="text-xs text-[var(--platform-text)]/40 italic">
                Preencha seus canais acima para exibi-los na seção de contato
              </p>
            ) : (
              registeredLinks.map((link) => {
                const isChecked = state.contactSelectedLinks.includes(link.type);
                const atLimit = state.contactSelectedLinks.length >= 2 && !isChecked;
                return (
                  <label
                    key={link.type}
                    className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 transition ${
                      isChecked
                        ? "border-[#22D3EE]/30 bg-[#22D3EE]/10"
                        : atLimit
                        ? "border-white/10 opacity-40 cursor-not-allowed"
                        : "border-white/10 cursor-pointer hover:bg-white/[0.04]"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      disabled={atLimit}
                      onChange={() => {
                        const newLinks = isChecked
                          ? state.contactSelectedLinks.filter((t) => t !== link.type)
                          : [...state.contactSelectedLinks, link.type];
                        dispatch({ type: "SET_CONTACT_SELECTED_LINKS", links: newLinks });
                      }}
                      className="hidden"
                    />
                    <div
                      className={`flex h-4 w-4 items-center justify-center rounded border-2 ${
                        isChecked ? "border-[#22D3EE] bg-[#22D3EE]" : "border-white/20"
                      }`}
                    >
                      {isChecked && <Check size={10} className="text-[#0B1020]" />}
                    </div>
                    <link.Icon size={14} className="text-[var(--platform-text)]/60" />
                    <span className="text-sm text-[var(--platform-text)]">{link.label}</span>
                  </label>
                );
              })
            )}
          </div>
          {state.contactSelectedLinks.length >= 2 && (
            <p className="mt-2 text-[10px] text-[#22D3EE]/70">Máximo de 2 canais selecionados</p>
          )}

          {/* Floating buttons toggle */}
          {registeredLinks.length > 0 && (
            <label className="mt-4 flex cursor-pointer items-center gap-3 rounded-lg border border-white/10 px-3 py-2.5 transition hover:bg-white/[0.03]">
              <div
                className={`relative h-5 w-9 rounded-full transition ${
                  content.floatingButtonsEnabled !== "false" ? "bg-[#22D3EE]" : "bg-white/10"
                }`}
              >
                <div
                  className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
                    content.floatingButtonsEnabled !== "false" ? "translate-x-4" : "translate-x-0.5"
                  }`}
                />
              </div>
              <input
                type="checkbox"
                className="hidden"
                checked={content.floatingButtonsEnabled !== "false"}
                onChange={(e) =>
                  handleContentChange("floatingButtonsEnabled", e.target.checked ? "true" : "false")
                }
              />
              <div>
                <p className="text-xs font-medium text-[var(--platform-text)]">Botões flutuantes de contato</p>
                <p className="text-[10px] text-[var(--platform-text)]/40">
                  Aparecem fixos no canto da tela em todos os dispositivos
                </p>
              </div>
            </label>
          )}
        </div>

        {/* ─── 7. Depoimentos ───────────────────────────── */}
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-[var(--platform-text)]">Depoimentos</h3>
              <p className="text-xs text-[var(--platform-text)]/50">Adicione até 3 depoimentos de clientes</p>
            </div>
            {testimonials.length < 3 && (
              <button
                type="button"
                onClick={addTestimonial}
                className="flex items-center gap-1 rounded-lg border border-white/10 px-2 py-1.5 text-xs text-[var(--platform-text)]/60 transition hover:border-[#22D3EE]/30 hover:text-[#22D3EE]"
              >
                <Plus size={12} /> Adicionar
              </button>
            )}
          </div>

          {/* Variant selector */}
          <div className="mt-3">
            <label className={labelClass}>Estilo de exibição</label>
            <select
              value={content.testimonialsVariant || "grid"}
              onChange={(e) => handleContentChange("testimonialsVariant", e.target.value)}
              className={`${inputClass} cursor-pointer`}
            >
              <option value="grid">Grade (2 colunas)</option>
              <option value="carousel">Carrossel (um por vez)</option>
              <option value="quotes">Destaque (citações grandes)</option>
            </select>
          </div>

          {testimonials.length === 0 ? (
            <button
              type="button"
              onClick={addTestimonial}
              className="mt-4 w-full rounded-lg border border-dashed border-white/10 py-4 text-xs text-[var(--platform-text)]/30 transition hover:border-[#22D3EE]/20 hover:text-[#22D3EE]/50"
            >
              + Adicionar primeiro depoimento
            </button>
          ) : (
            <div className="mt-4 space-y-3">
              {testimonials.map((t, i) => (
                <div key={i} className="rounded-lg border border-white/10 bg-white/[0.03] p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-medium text-[var(--platform-text)]/50">Depoimento {i + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeTestimonial(i)}
                      className="text-[var(--platform-text)]/30 transition hover:text-red-400"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                  <textarea
                    value={t.quote}
                    onChange={(e) => updateTestimonialField(i, "quote", e.target.value)}
                    placeholder="O que o cliente disse sobre você..."
                    rows={2}
                    className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-[var(--platform-text)] placeholder:text-[var(--platform-text)]/30 focus:border-[#22D3EE] focus:outline-none resize-none"
                  />
                  <input
                    type="text"
                    value={t.author}
                    onChange={(e) => updateTestimonialField(i, "author", e.target.value)}
                    placeholder="Nome do cliente"
                    className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-[var(--platform-text)] placeholder:text-[var(--platform-text)]/30 focus:border-[#22D3EE] focus:outline-none"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ─── 8. SEO ────────────────────────────────────── */}
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
                <label className={labelClass}>Título SEO</label>
                <span className={`text-[10px] ${(content.seoTitle || "").length > 60 ? "text-red-400" : "text-[var(--platform-text)]/40"}`}>
                  {(content.seoTitle || "").length}/60
                </span>
              </div>
              <input
                type="text"
                value={content.seoTitle || ""}
                onChange={(e) => handleContentChange("seoTitle", e.target.value)}
                placeholder="Ex: Psicologia Online | Dra. Maria Silva"
                className={inputClass}
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className={labelClass}>Descrição SEO</label>
                <span className={`text-[10px] ${(content.seoDescription || "").length > 160 ? "text-red-400" : "text-[var(--platform-text)]/40"}`}>
                  {(content.seoDescription || "").length}/160
                </span>
              </div>
              <textarea
                value={content.seoDescription || ""}
                onChange={(e) => handleContentChange("seoDescription", e.target.value)}
                placeholder="Breve descrição do seu negócio que aparece nos resultados do Google..."
                rows={2}
                className={`${inputClass} resize-none`}
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
