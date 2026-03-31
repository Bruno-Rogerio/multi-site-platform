import Link from "next/link";

const PERIODS = [
  { label: "7d",  value: 7 },
  { label: "14d", value: 14 },
  { label: "30d", value: 30 },
  { label: "90d", value: 90 },
] as const;

export function AnalyticsPeriodSelector({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-0.5 rounded-lg border border-white/10 bg-[#0B1020] p-0.5">
      {PERIODS.map(({ label, value }) => (
        <Link
          key={value}
          href={`?period=${value}`}
          className={`rounded-md px-3 py-1 text-[11px] font-semibold transition-all ${
            current === value
              ? "bg-[#22D3EE]/10 text-[#22D3EE]"
              : "text-[var(--platform-text)]/35 hover:text-[var(--platform-text)]/65"
          }`}
        >
          {label}
        </Link>
      ))}
    </div>
  );
}
