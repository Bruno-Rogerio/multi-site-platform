"use client";

import { useRef, useEffect, useState } from "react";
import { LazyMotion, domAnimation, m, useInView } from "framer-motion";
import { Users, Clock, TrendingUp, Star } from "lucide-react";

const COUNTERS = [
  { icon: Users, value: 500, suffix: "+", label: "Sites publicados", color: "#3B82F6" },
  { icon: Clock, value: 5, suffix: "min", label: "Tempo médio de setup", color: "#7C5CFF" },
  { icon: Star, value: 4.9, suffix: "★", label: "Avaliação média", color: "#22D3EE" },
  { icon: TrendingUp, value: 98, suffix: "%", label: "Clientes satisfeitos", color: "#A855F7" },
];

function Counter({ target, suffix, duration = 2000 }: { target: number; suffix: string; duration?: number }) {
  // Inicializa com o valor final para que o SSR/crawlers leiam o número correto.
  // A animação visual começa do zero no cliente durante o fade-in do motion.div,
  // tornando o flash imperceptível.
  const [count, setCount] = useState(target);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const isFloat = !Number.isInteger(target);
    const start = performance.now();
    let rafId: number;
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = isFloat
        ? Math.round(target * eased * 10) / 10
        : Math.floor(target * eased);
      setCount(current);
      if (progress < 1) rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [inView, target, duration]);

  return (
    <span ref={ref}>
      {Number.isInteger(target) ? count : count.toFixed(1)}
      {suffix}
    </span>
  );
}

export function SocialProofCounter() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-8 md:py-12">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <LazyMotion features={domAnimation}>
          <m.div
            className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0E1428] p-8 md:p-10"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <div className="relative grid grid-cols-2 gap-8 md:grid-cols-4">
              {COUNTERS.map(({ icon: Icon, value, suffix, label, color }, i) => (
                <m.div
                  key={label}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <div
                    className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl"
                    style={{ background: `${color}20`, border: `1px solid ${color}30` }}
                  >
                    <Icon size={22} style={{ color }} />
                  </div>
                  <p className="text-3xl font-black text-[#EAF0FF] md:text-4xl" style={{ color }}>
                    <Counter target={value} suffix={suffix} />
                  </p>
                  <p className="mt-1 text-sm text-[#EAF0FF]/50">{label}</p>
                </m.div>
              ))}
            </div>
          </m.div>
        </LazyMotion>
      </div>
    </section>
  );
}
