"use client";

import { useRef, type ReactNode } from "react";
import { motion, useInView, type Variants } from "framer-motion";

type AnimatedSectionProps = {
  children: ReactNode;
  animationStyle?: string;
};

function getVariants(style: string): Variants {
  switch (style) {
    case "motion-reveal":
      return {
        hidden: { opacity: 0, y: 48 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
      };
    case "motion-parallax":
      return {
        hidden: { opacity: 0, y: 60, scale: 0.95 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] } },
      };
    case "motion-vivid":
      return {
        hidden: { opacity: 0, x: -40, scale: 0.92 },
        visible: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.5, type: "spring", stiffness: 220, damping: 18 } },
      };
    case "motion-fade":
      return {
        hidden: { opacity: 0, y: 16 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
      };
    default:
      // motion-none ou desconhecido — sem animação
      return {
        hidden: { opacity: 1 },
        visible: { opacity: 1 },
      };
  }
}

export function AnimatedSection({ children, animationStyle = "motion-fade" }: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-8% 0px" });
  const variants = getVariants(animationStyle);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
    >
      {children}
    </motion.div>
  );
}
