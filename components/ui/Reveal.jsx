"use client";

import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

const variants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0 },
};

export default function Reveal({
  children,
  delay = 0,
  className = "",
  as: Component = "div",
}) {
  const controls = useAnimation();
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      variants={variants}
      initial="hidden"
      animate={controls}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.23, 1, 0.32, 1],
      }}
      className={className}
      as={Component}
    >
      {children}
    </motion.div>
  );
}

