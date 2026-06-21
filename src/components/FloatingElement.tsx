import { motion } from "motion/react";
import React from "react";

export const FloatingElement = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  return (
    <motion.div
      animate={{
        y: ["-15px", "15px", "-15px"],
        rotate: [-2, 2, -2],
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
        delay: delay,
      }}
    >
      {children}
    </motion.div>
  );
};
