type BrandProps = {
  compact?: boolean;
};

export function Brand({ compact = false }: BrandProps) {
  return (
    <div className="inline-flex items-center gap-3">
      <div className="relative h-10 w-10 rounded-full bg-[radial-gradient(circle_at_35%_30%,#22D3EE,#3B82F6_45%,#7C5CFF_80%)] shadow-[0_0_20px_rgba(59,130,246,0.45)]">
        <div className="absolute inset-[2px] rounded-full border border-white/35" />
      </div>
      <p className={`font-semibold tracking-tight ${compact ? "text-lg" : "text-2xl"}`}>
        <span className="text-[var(--platform-text)]">Build</span>
        <span className="bg-[linear-gradient(135deg,#3B82F6,#7C5CFF,#22D3EE)] bg-clip-text text-transparent">
          Sphere
        </span>
      </p>
    </div>
  );
}
