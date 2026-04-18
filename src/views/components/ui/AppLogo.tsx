import { motion } from "framer-motion";
import Image from "next/image";

export default function AppLogo({ showLabels }: { showLabels: boolean }) {
  return showLabels ? (
    <motion.div whileHover={{ scale: 0.8 }} whileTap={{ scale: 0.5 }}>
      <Image
        className="dark:invert"
        src="/next.svg"
        alt="Logo"
        width={150}
        height={40}
      />
    </motion.div>
  ) : (
    <Image
      className="dark:invert"
      src="/next.svg"
      alt="Logo"
      width={32}
      height={32}
    />
  );
}
