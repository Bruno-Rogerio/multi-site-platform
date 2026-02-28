"use client";

import { motion, useInView } from "framer-motion";
import { Children, useRef } from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
};

export function StaggeredCards({ children, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.08 });
  const items = Children.toArray(children);

  return (
    <div ref={ref} className={className}>
      {items.map((child, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 28 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
          transition={{
            duration: 0.52,
            delay: Math.min(i * 0.09, 0.45),
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
}
