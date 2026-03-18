"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

type GalleryImage = {
  url: string;
  alt: string;
  caption?: string;
};

type GallerySectionProps = {
  title?: string;
  subtitle?: string;
  images?: GalleryImage[];
  variant?: string;
};

export function GallerySection({
  title = "Galeria",
  subtitle,
  images = [],
  variant = "grid",
}: GallerySectionProps) {
  const isCarousel = variant === "carousel";
  const isMasonry = variant === "masonry";

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [carouselPaused, setCarouselPaused] = useState(false);

  useEffect(() => {
    if (!isCarousel || carouselPaused || images.length <= 1) return;
    const t = setInterval(() => setCarouselIndex(i => (i + 1) % images.length), 4000);
    return () => clearInterval(t);
  }, [isCarousel, carouselPaused, images.length]);

  if (images.length === 0) return null;

  function prev() {
    setLightboxIndex((cur) => (cur === null ? null : (cur - 1 + images.length) % images.length));
  }

  function next() {
    setLightboxIndex((cur) => (cur === null ? null : (cur + 1) % images.length));
  }

  return (
    <section id="gallery" className="py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-10 text-center">
          <h2
            className="text-3xl font-black tracking-tight"
            style={{ color: "var(--site-text)" }}
          >
            {title}
          </h2>
          {subtitle && (
            <p
              className="mt-3 text-base leading-relaxed"
              style={{ color: "var(--site-text)", opacity: 0.6 }}
            >
              {subtitle}
            </p>
          )}
        </div>

        {/* Grid / Masonry */}
        {!isCarousel && (
          <div
            className={
              isMasonry
                ? "columns-2 gap-4 md:columns-3"
                : "grid grid-cols-2 gap-4 md:grid-cols-3"
            }
          >
            {images.map((img, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setLightboxIndex(i)}
                className={`group relative block w-full overflow-hidden rounded-[var(--site-radius,12px)] border transition-all hover:opacity-90 ${isMasonry ? "mb-4 break-inside-avoid" : "aspect-square"}`}
                style={{ borderColor: "var(--site-border)" }}
              >
                <Image
                  src={img.url}
                  alt={img.alt || `Imagem ${i + 1}`}
                  width={600}
                  height={isMasonry ? 0 : 600}
                  style={isMasonry ? { width: "100%", height: "auto" } : { objectFit: "cover", width: "100%", height: "100%" }}
                  className="transition-transform duration-300 group-hover:scale-105"
                />
                {img.caption && (
                  <div className="absolute inset-x-0 bottom-0 bg-black/50 px-3 py-2 opacity-0 transition-opacity group-hover:opacity-100">
                    <p className="text-xs text-white">{img.caption}</p>
                  </div>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Carousel */}
        {isCarousel && (
          <div
            className="relative overflow-hidden rounded-[var(--site-radius,16px)] border"
            style={{ borderColor: "var(--site-border)" }}
            onMouseEnter={() => setCarouselPaused(true)}
            onMouseLeave={() => setCarouselPaused(false)}
          >
            <div
              className="flex transition-transform duration-300"
              style={{ transform: `translateX(-${carouselIndex * 100}%)` }}
            >
              {images.map((img, i) => (
                <div key={i} className="relative min-w-full aspect-[4/3]">
                  <Image
                    src={img.url}
                    alt={img.alt || `Imagem ${i + 1}`}
                    fill
                    className="object-cover"
                  />
                  {img.caption && (
                    <div className="absolute inset-x-0 bottom-0 bg-black/50 px-4 py-3">
                      <p className="text-sm text-white">{img.caption}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => setCarouselIndex((carouselIndex - 1 + images.length) % images.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white hover:bg-black/60"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  type="button"
                  onClick={() => setCarouselIndex((carouselIndex + 1) % images.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white hover:bg-black/60"
                >
                  <ChevronRight size={20} />
                </button>
                <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setCarouselIndex(i)}
                      className="h-1.5 rounded-full transition-all"
                      style={{
                        width: carouselIndex === i ? "20px" : "6px",
                        backgroundColor: carouselIndex === i ? "var(--site-primary)" : "rgba(255,255,255,0.5)",
                      }}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Lightbox (grid/masonry) */}
      {!isCarousel && lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setLightboxIndex(null)}
        >
          <div
            className="relative max-h-[90vh] max-w-4xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[lightboxIndex].url}
              alt={images[lightboxIndex].alt || ""}
              width={1200}
              height={800}
              className="max-h-[80vh] w-full rounded-xl object-contain"
            />
            {images[lightboxIndex].caption && (
              <p className="mt-2 text-center text-sm text-white/70">{images[lightboxIndex].caption}</p>
            )}
            <button
              type="button"
              onClick={() => setLightboxIndex(null)}
              className="absolute -right-3 -top-3 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            >
              <X size={18} />
            </button>
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={prev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
                >
                  <ChevronLeft size={22} />
                </button>
                <button
                  type="button"
                  onClick={next}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
                >
                  <ChevronRight size={22} />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
