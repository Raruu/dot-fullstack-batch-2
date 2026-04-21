"use client";

import { useNavigation } from "@/hooks/useNavigation";
import { ThemeToggleButton } from "./ThemeToggleButton";
import UserDropdown from "./UserDropdown";
import { motion } from "framer-motion";
import {
  ArrowLeft20Filled,
  TextAlignLeft20Regular,
} from "@fluentui/react-icons";
import { useRouter } from "next/navigation";
import { cn } from "@heroui/react";

const AppHeader: React.FC = () => {
  const { toggleSidebar, toggleMobileSidebar, navigationText, showBack } =
    useNavigation();

  const router = useRouter();

  const handleToggle = () => {
    if (window.innerWidth >= 1024) {
      toggleSidebar();
    } else {
      toggleMobileSidebar();
    }
  };

  const back = () => {
    router.back();
  };

  return (
    <header className="flex w-full">
      <div className="flex flex-col items-center justify-between grow lg:flex-row lg:px-6">
        <div className="flex items-center justify-between w-full gap-2 px-3 py-3 sm:gap-4 lg:justify-normal lg:px-0 lg:py-4">
          <div className="flex flex-row items-center gap-4">
            <button
              className="size-11 cursor-pointer relative flex items-center justify-center text-gray-500 transition-colors bg-background/50 border border-gray-200 rounded-full hover:text-dark-900 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-background dark:hover:text-white"
              onClick={showBack ? back : handleToggle}
              aria-label="Toggle Sidebar"
            >
              {showBack ? <ArrowLeft20Filled /> : <TextAlignLeft20Regular />}
            </button>
            <motion.div
              whileHover={{ scale: showBack ? 0.95 : 1 }}
              className={cn(
                "flex flex-col",
                showBack ? "cursor-pointer" : "cursor-default",
              )}
              onClick={showBack ? handleToggle : undefined}
            >
              <h2 className="font-semibold">{navigationText.title}</h2>
              <p className="text-xs text-foreground/50">
                {navigationText.subtitle}
              </p>
            </motion.div>
          </div>

          <div className="items-center gap-4 px-5 py-0 flex flex-1 shadow-theme-md justify-end lg:px-0 lg:shadow-none">
            <div className="flex items-center gap-2 2xsm:gap-3">
              <ThemeToggleButton />
            </div>
            <UserDropdown />
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
