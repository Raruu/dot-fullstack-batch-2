"use client";
import { cn } from "@heroui/react";
import { motion, Variants } from "framer-motion";

export const AnimatedActionLines = ({ className }: { className?: string }) => {
  const drawVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (customDelay: number) => ({
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { duration: 1, ease: "easeInOut" },
        opacity: { duration: 0.1 },
        delay: customDelay,
        repeat: Infinity,
        repeatType: "reverse" as const,
        repeatDelay: 0.5,
      },
    }),
  };

  return (
    <div className={cn("flex items-center justify-center p-8", className)}>
      <svg
        className="h-full w-full text-[#FF5E62]"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Left Squiggle */}
        <motion.path
          d="M 10 35 L 45 50 L 35 70 L 55 75 L 50 90 L 75 90"
          stroke="currentColor"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={drawVariants}
          custom={0} // Starts immediately
          initial="hidden"
          animate="visible"
        />

        {/* Right Squiggle */}
        <motion.path
          d="M 40 5 L 65 30 L 55 45 L 80 55 L 70 70 L 95 80"
          stroke="currentColor"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={drawVariants}
          custom={0.2} // Slight delay for a staggered, organic feel
          initial="hidden"
          animate="visible"
        />
      </svg>
    </div>
  );
};

export const WavyActionLines = ({ className }: { className?: string }) => {
  const waveVariants: Variants = {
    animate: (customDelay: number) => ({
      y: [0, -12, 0], // Bob up and down
      rotate: [0, 4, -2, 0], // Subtle organic swaying
      transition: {
        duration: 0.5,
        ease: "easeInOut",
        repeat: Infinity,
        delay: customDelay,
      },
    }),
  };

  return (
    <div className={cn("flex items-center justify-center p-8", className)}>
      <svg
        className="h-full w-full text-danger"
        viewBox="0 -15 110 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Left Squiggle */}
        <motion.path
          d="M 10 35 L 45 50 L 35 70 L 55 75 L 50 90 L 75 90"
          stroke="currentColor"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={waveVariants}
          custom={0}
          animate="animate"
        />

        {/* Right Squiggle */}
        <motion.path
          d="M 40 5 L 65 30 L 55 45 L 80 55 L 70 70 L 95 80"
          stroke="currentColor"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={waveVariants}
          custom={0.25}
          animate="animate"
        />
      </svg>
    </div>
  );
};
