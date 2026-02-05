"use client";

import { useRef, useEffect, useState } from "react";
import { useInView } from "framer-motion";

type Metric = {
  value: string;
  label: string;
  numericTarget?: number;
  prefix?: string;
  suffix?: string;
};

const metrics: Metric[] = [
  {
    value: "500+",
    label: "Profissionais ativos",
    numericTarget: 500,
    suffix: "+",
  },
  {
    value: "99.9%",
    label: "Uptime garantido",
    numericTarget: 99.9,
    suffix: "%",
  },
  {
    value: "< 5min",
    label: "Para configurar",
    prefix: "< ",
    numericTarget: 5,
    suffix: "min",
  },
  {
    value: "4.9",
    label: "Satisfacao dos clientes",
    numericTarget: 4.9,
    suffix: "/5",
  },
];

function AnimatedCounter({
  target,
  prefix = "",
  suffix = "",
  decimals = 0,
  inView,
}: {
  target: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  inView: boolean;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1500;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(current);
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <span className="text-3xl font-black md:text-4xl bg-[linear-gradient(135deg,#3B82F6,#7C5CFF,#22D3EE)] bg-clip-text text-transparent">
      {prefix}
      {decimals > 0 ? count.toFixed(decimals) : Math.floor(count)}
      {suffix}
    </span>
  );
}

export function SocialProofCounter() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <div
      ref={ref}
      className="mx-auto max-w-7xl border-y border-white/[0.06] px-5 py-10 md:px-8"
    >
      <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="text-center">
            <AnimatedCounter
              target={metric.numericTarget ?? 0}
              prefix={metric.prefix}
              suffix={metric.suffix}
              decimals={metric.value.includes(".") ? 1 : 0}
              inView={isInView}
            />
            <p className="mt-2 text-xs uppercase tracking-[0.14em] text-[var(--platform-text)]/55">
              {metric.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
