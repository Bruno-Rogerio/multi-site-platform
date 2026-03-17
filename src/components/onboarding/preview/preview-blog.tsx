"use client";

import { useWizard } from "../wizard-context";

export function PreviewBlog({ deviceMode }: { deviceMode: "desktop" | "mobile" }) {
  const { state } = useWizard();
  const { content, fontFamily, blogVariant } = state;
  const posts = (content.blogPosts as Array<{ title: string; excerpt: string; imageUrl?: string }> ?? [])
    .filter(p => p.title?.trim());

  if (posts.length === 0) return null;

  const variant = blogVariant || "grid";
  const baseStyle = { fontFamily: fontFamily || "Inter" };
  const cardStyle = {
    border: "1px solid color-mix(in srgb, var(--preview-text) 12%, transparent)",
    backgroundColor: "color-mix(in srgb, var(--preview-text) 3%, transparent)",
    borderRadius: "var(--preview-radius, 8px)",
  };

  if (variant === "list") {
    return (
      <section className="px-3 py-4" style={baseStyle}>
        <h2 className="text-[10px] font-bold mb-3" style={{ color: "var(--preview-text)" }}>
          {String(content.blogTitle ?? "Blog")}
        </h2>
        <div className="space-y-2">
          {posts.slice(0, 4).map((post, i) => (
            <div key={i} className="flex gap-2 overflow-hidden rounded-lg" style={cardStyle}>
              {post.imageUrl && (
                <div className="h-12 w-16 shrink-0 overflow-hidden rounded-l-lg">
                  <img src={post.imageUrl} alt="" className="h-full w-full object-cover" />
                </div>
              )}
              <div className="flex-1 py-1.5 pr-2" style={{ paddingLeft: post.imageUrl ? 0 : "8px" }}>
                <p className="text-[8px] font-semibold leading-snug line-clamp-2" style={{ color: "var(--preview-text)" }}>{post.title}</p>
                {post.excerpt && <p className="mt-0.5 text-[6px] leading-relaxed line-clamp-2" style={{ color: "var(--preview-muted)" }}>{post.excerpt}</p>}
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (variant === "magazine" && posts.length > 0) {
    const [featured, ...rest] = posts;
    return (
      <section className="px-3 py-4" style={baseStyle}>
        <h2 className="text-[10px] font-bold mb-3" style={{ color: "var(--preview-text)" }}>
          {String(content.blogTitle ?? "Blog")}
        </h2>
        <div className="space-y-2">
          {/* Featured */}
          <div className="overflow-hidden rounded-lg" style={cardStyle}>
            {featured.imageUrl && (
              <div className="relative h-20 w-full overflow-hidden">
                <img src={featured.imageUrl} alt="" className="h-full w-full object-cover" />
              </div>
            )}
            <div className="p-2">
              <p className="text-[9px] font-bold leading-snug" style={{ color: "var(--preview-text)" }}>{featured.title}</p>
              {featured.excerpt && <p className="mt-0.5 text-[6px] leading-relaxed line-clamp-2" style={{ color: "var(--preview-muted)" }}>{featured.excerpt}</p>}
            </div>
          </div>
          {/* Rest */}
          <div className={`grid gap-2 ${deviceMode === "mobile" ? "grid-cols-1" : "grid-cols-2"}`}>
            {rest.slice(0, 4).map((post, i) => (
              <div key={i} className="overflow-hidden rounded-lg" style={cardStyle}>
                {post.imageUrl && (
                  <div className="relative h-10 w-full overflow-hidden">
                    <img src={post.imageUrl} alt="" className="h-full w-full object-cover" />
                  </div>
                )}
                <div className="p-1.5">
                  <p className="text-[7px] font-semibold leading-snug line-clamp-2" style={{ color: "var(--preview-text)" }}>{post.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Grid (default)
  return (
    <section className="px-3 py-4" style={baseStyle}>
      <h2 className="text-[10px] font-bold mb-3" style={{ color: "var(--preview-text)" }}>
        {String(content.blogTitle ?? "Blog")}
      </h2>
      <div className={`grid gap-2 ${deviceMode === "mobile" ? "grid-cols-1" : "grid-cols-2"}`}>
        {posts.slice(0, 4).map((post, i) => (
          <div key={i} className="overflow-hidden rounded-lg" style={cardStyle}>
            {post.imageUrl && (
              <div className="relative h-12 w-full overflow-hidden">
                <img src={post.imageUrl} alt="" className="h-full w-full object-cover" />
              </div>
            )}
            <div className="p-2">
              <p className="text-[8px] font-semibold leading-snug line-clamp-2" style={{ color: "var(--preview-text)" }}>{post.title}</p>
              {post.excerpt && <p className="mt-1 text-[6px] leading-relaxed line-clamp-2" style={{ color: "var(--preview-muted)" }}>{post.excerpt}</p>}
              <p className="mt-1 text-[6px] font-semibold" style={{ color: "var(--preview-primary)" }}>Ler mais →</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
