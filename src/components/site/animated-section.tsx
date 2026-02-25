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
        hidden: { opacity: 0, y: 24 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
      };
    case "motion-parallax":
      return {
        hidden: { opacity: 0, y: 32, scale: 0.98 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] } },
      };
    case "motion-vivid":
      return {
        hidden: { opacity: 0, x: -16, scale: 0.97 },
        visible: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.4, type: "spring", stiffness: 280, damping: 24 } },
      };
    case "motion-fade":
      return {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.55, ease: "easeOut" } },
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
