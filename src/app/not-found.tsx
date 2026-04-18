"use client";

import { Encounter } from "@/views/components/KeiAoraineoekaki/Encounter";
import { Tooltip } from "@heroui/react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface Props {
  code?: string;
  message?: string;
}

export default function NotFoundPage({
  code: text = "404",
  message = "Not Found",
}: Props) {
  const router = useRouter();

  return (
    <motion.div
      className="flex min-h-screen flex-col items-center justify-center gap-3 px-4 text-center"
      initial={{ opacity: 0.1, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <Tooltip>
        <Tooltip.Trigger>
          <div className="cursor-pointer">
            <Encounter
              onClick={() => {
                router.replace("/");
              }}
              text={text}
            />
          </div>
        </Tooltip.Trigger>

        <Tooltip.Content className="bg-danger scale-170 text-white" offset={24}>
          <Tooltip.Arrow className="[&>svg]:fill-danger" />
          Pergi ke halaman utama! BAKA!
        </Tooltip.Content>
      </Tooltip>

      <Tooltip delay={0}>
        <Tooltip.Trigger>
          <h1 className="text-4xl font-bold italic text-foreground/50 hover:text-foreground duration-150">
            {message} - Bakaa~
          </h1>
        </Tooltip.Trigger>
        <Tooltip.Content
          placement="bottom"
          className="bg-danger scale-170 text-white"
          offset={12}
        >
          <Tooltip.Arrow className="[&>svg]:fill-danger" />
          Klik &lsquo;the encounter&lsquo; untuk pergi! BAKA!
        </Tooltip.Content>
      </Tooltip>
    </motion.div>
  );
}
