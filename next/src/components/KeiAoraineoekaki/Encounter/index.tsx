import EncounterImg from "./encounter.webp";
import Image from "next/image";
import { motion } from "framer-motion";
import { VerticalRandomPerspectiveBlocks } from "@/components/VerticalRandomPerspectiveBlocks";
import { WavyActionLines } from "../AnimatedActionLines";

interface Props {
  text?: string;
  onClick?: () => void;
}

export const Encounter = ({ text = "403", onClick }: Props) => {
  return (
    <motion.div
      className="relative"
      whileHover={{ scale: 1.1 }}
      onClick={onClick}
    >
      <div className="absolute -translate-x-20 -translate-y-16">
        <WavyActionLines className="size-36" />
      </div>

      <div className="absolute translate-x-62.5 translate-y-16">
        <VerticalRandomPerspectiveBlocks text={text} />
      </div>

      <Image
        src={EncounterImg}
        alt="Encounter"
        width={256}
        height={256}
        className="w-full"
      />
    </motion.div>
  );
};
