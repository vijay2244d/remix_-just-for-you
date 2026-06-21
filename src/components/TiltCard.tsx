import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import React from "react";
import { cn } from "@/src/lib/utils";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
}

export const TiltCard = ({ children, className, containerClassName }: TiltCardProps) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateY,
        rotateX,
        transformStyle: "preserve-3d",
      }}
      className={cn("relative rounded-3xl transition-colors", containerClassName)}
    >
      <div
        style={{
          transform: "translateZ(60px)",
          transformStyle: "preserve-3d",
        }}
        className={cn("h-full w-full p-8 shadow-2xl rounded-3xl bg-white/60 backdrop-blur-md border border-white/40", className)}
      >
        {children}
      </div>
    </motion.div>
  );
};
