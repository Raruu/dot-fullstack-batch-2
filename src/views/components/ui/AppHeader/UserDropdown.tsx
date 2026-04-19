"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";
import { SignOut24Regular } from "@fluentui/react-icons";
import { motion } from "framer-motion";
import { useAuthClient } from "@/views/providers/useAuthCient";

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { signOut, useSession } = useAuthClient();
  const { data: session } = useSession();

  const displayName = session?.user?.name || "-";
  const displayEmail = session?.user?.email || "-";
  const displayPfp = session?.user?.image || "";

  function toggleDropdown(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  }

  async function handleSignOut() {
    setIsOpen(false);
    await signOut();
    router.replace("/");
    router.refresh();
  }

  return (
    <Dropdown
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      placement="bottom-end"
      classNames={{ content: "p-2" }}
    >
      <DropdownTrigger>
        <motion.div whileHover={{ scale: 0.9 }}>
          <button
            onClick={toggleDropdown}
            className="flex items-center text-gray-700 cursor-pointer dark:text-gray-400"
          >
            <Avatar src={displayPfp} alt="User" className="mr-3 h-11 w-11" />
          </button>
        </motion.div>
      </DropdownTrigger>

      <DropdownMenu aria-label="User actions">
        <DropdownItem
          key="profile-summary"
          showDivider
          onClick={() => router.push(`/app/user?search=${displayEmail}`)}
        >
          <div className="flex flex-row items-center">
            <Avatar src={displayPfp} alt="User" className="mr-3 h-11 w-11" />
            <div>
              <span className="block text-theme-sm font-medium text-gray-700 dark:text-gray-400">
                {displayName}
              </span>
              <span className="mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400">
                {displayEmail}
              </span>
            </div>
          </div>
        </DropdownItem>

        <DropdownItem
          key="sign-out"
          variant="solid"
          color="danger"
          className="h-10"
          onPress={handleSignOut}
        >
          <SignOut24Regular /> Keluar
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
