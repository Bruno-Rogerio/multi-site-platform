"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

type AnimatedSectionProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "left" | "right";
};

export function AnimatedSection({
  children,
  className,
  delay = 0,
  direction = "up",
}: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const initial = {
    opacity: 0,
    y: direction === "up" ? 40 : 0,
    x: direction === "left" ? -40 : direction === "right" ? 40 : 0,
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={initial}
      animate={isInView ? { opacity: 1, y: 0, x: 0 } : initial}
      transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1], delay }}
    >
      {children}
    </motion.div>
  );
}
