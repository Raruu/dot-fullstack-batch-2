"use client";
import { cn } from "@heroui/react";
import { motion } from "framer-motion";
import { useMemo } from "react";

interface Props {
  text?: string;
  size?: number;
  variants?: "danger" | "warning" | "success";
  borderRadius?: number;
  padding?: number;
  gap?: number;
}

export const VerticalRandomPerspectiveBlocks: React.FC<Props> = ({
  text = "404",
  size = 32,
  variants = "danger",
  borderRadius = 4,
  padding = 10,
  gap = 10,
}) => {
  const chars = text.split("");
  const randomPerspectives = useMemo(() => {
    const generateRandom = (min: number, max: number) =>
      // eslint-disable-next-line react-hooks/purity
      Math.random() * (max - min) + min;

    return chars.map(() => ({
      rotateX: generateRandom(-30, 30),
      rotateY: generateRandom(-30, 30),
      rotateZ: generateRandom(-15, 15),
    }));
  }, [chars]);

  const bgSize = size + padding;

  return (
    <div
      className="flex flex-col items-center justify-center overflow-hidden perspective-distant"
      style={{ gap, padding }}
    >
      {chars.map((char, index) => {
        const perspective = randomPerspectives[index];

        return (
          <motion.div
            key={`${char}-${index}`}
            className={cn(
              "flex items-center justify-center font-black text-white cursor-pointer ",
              `bg-${variants}`,
            )}
            style={{
              borderRadius,
              fontSize: size,
              width: bgSize,
              height: bgSize,
            }}
            initial={perspective}
            animate={perspective}
            whileHover={{
              rotateX: 0,
              rotateY: 0,
              rotateZ: 0,
            }}
          >
            <span className="select-none">{char}</span>
          </motion.div>
        );
      })}
    </div>
  );
};
