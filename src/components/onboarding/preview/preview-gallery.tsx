"use client";

import { useWizard } from "../wizard-context";

export function PreviewGallery({ deviceMode }: { deviceMode: "desktop" | "mobile" }) {
  const { state } = useWizard();
  const { content, fontFamily, galleryVariant } = state;
  const images = (content.galleryImages as Array<{ url: string; caption?: string }> ?? [])
    .filter(img => img.url?.trim());

  if (images.length === 0) return null;

  const variant = galleryVariant || "grid";
  const baseStyle = { fontFamily: fontFamily || "Inter" };

  if (variant === "masonry") {
    const col1 = images.filter((_, i) => i % 2 === 0);
    const col2 = images.filter((_, i) => i % 2 !== 0);
    return (
      <section className="px-3 py-4" style={baseStyle}>
        <h2 className="text-[10px] font-bold mb-3" style={{ color: "var(--preview-text)" }}>
          {String(content.galleryTitle ?? "Galeria")}
        </h2>
        <div className="grid grid-cols-2 gap-1.5">
          <div className="space-y-1.5">
            {col1.slice(0, 3).map((img, i) => (
              <div key={i} className="overflow-hidden rounded-md" style={{ height: i % 2 === 0 ? "40px" : "28px" }}>
                <img src={img.url} alt="" className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
          <div className="space-y-1.5">
            {col2.slice(0, 3).map((img, i) => (
              <div key={i} className="overflow-hidden rounded-md" style={{ height: i % 2 === 0 ? "28px" : "40px" }}>
                <img src={img.url} alt="" className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (variant === "carousel") {
    return (
      <section className="px-3 py-4" style={baseStyle}>
        <h2 className="text-[10px] font-bold mb-3" style={{ color: "var(--preview-text)" }}>
          {String(content.galleryTitle ?? "Galeria")}
        </h2>
        <div className="flex gap-2 overflow-hidden">
          {images.slice(0, 5).map((img, i) => (
            <div key={i} className="h-20 w-24 shrink-0 overflow-hidden rounded-lg">
              <img src={img.url} alt="" className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  // Grid (default)
  const cols = deviceMode === "mobile" ? "grid-cols-2" : "grid-cols-3";
  return (
    <section className="px-3 py-4" style={baseStyle}>
      <h2 className="text-[10px] font-bold mb-3" style={{ color: "var(--preview-text)" }}>
        {String(content.galleryTitle ?? "Galeria")}
      </h2>
      <div className={`grid gap-1.5 ${cols}`}>
        {images.slice(0, 6).map((img, i) => (
          <div key={i} className="aspect-square overflow-hidden rounded-lg">
            <img src={img.url} alt="" className="h-full w-full object-cover" />
          </div>
        ))}
      </div>
    </section>
  );
}
