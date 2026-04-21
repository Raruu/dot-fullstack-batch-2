"use client";
import { Encounter } from "@/components/KeiAoraineoekaki/Encounter";
import { Tooltip } from "@heroui/react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface Props {
  code?: string;
  message?: string;
  backInstead?: boolean;
  baka?: string;
}

export default function NotFoundPage({
  code: text = "404",
  message = "Not Found",
  backInstead,
  baka = "Bakaa~",
}: Props) {
  const router = useRouter();

  return (
    <motion.div
      className="flex min-h-screen flex-col items-center justify-center gap-3 px-4 text-center"
      initial={{ opacity: 0.1, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <Tooltip
        content={`Pergi ke halaman utama! ${baka}!`}
        color="danger"
        size="lg"
        showArrow
      >
        <div className="cursor-pointer">
          <Encounter
            onClick={() => {
              if (backInstead) {
                router.back();
                return;
              }
              router.replace("/");
            }}
            text={text}
          />
        </div>
      </Tooltip>
      <Tooltip
        content={`"Klik 'the encounter' untuk pergi! ${baka}!"`}
        color="danger"
        size="lg"
        placement="bottom"
        showArrow
      >
        <h1 className="text-4xl font-bold italic text-foreground/50 hover:text-foreground duration-150">
          {message} - {baka}
        </h1>
      </Tooltip>
    </motion.div>
  );
}
