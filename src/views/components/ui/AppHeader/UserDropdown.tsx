"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Dropdown,
  Label,
} from "@heroui/react";
import { SignOut24Regular } from "@fluentui/react-icons";
import { motion } from "framer-motion";
import { useAuthClient } from "@/views/providers/useAuthCient";

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { signOut, useSession } = useAuthClient();

  const user = useSession().data?.user;
  const displayName = user?.name || "-";
  const displayEmail = user?.email || "-";
  const displayPfp = user?.image || "";

  async function handleSignOut() {
    setIsOpen(false);
    await signOut();
    router.replace("/");
    router.refresh();
  }

  return (
    <Dropdown isOpen={isOpen} onOpenChange={setIsOpen}>
      <Dropdown.Trigger>
        <motion.div whileHover={{ scale: 0.9 }}>
          <div className="flex items-center text-gray-700 cursor-pointer dark:text-gray-400">
            <Avatar className="mr-3 h-11 w-11">
              <AvatarImage src={displayPfp} alt="User" />
              <AvatarFallback>-</AvatarFallback>
            </Avatar>
          </div>
        </motion.div>
      </Dropdown.Trigger>

      <Dropdown.Popover>
        <Dropdown.Menu>
          <Dropdown.Item key="profile-summary">
            <Label className="flex flex-row items-center">
              <Avatar className="mr-3 h-11 w-11">
                <AvatarImage src={displayPfp} alt="User" />
                <AvatarFallback>-</AvatarFallback>
              </Avatar>
              <div>
                <span className="block text-theme-sm font-medium text-gray-700 dark:text-gray-400">
                  {displayName}
                </span>
                <span className="mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400">
                  {displayEmail}
                </span>
              </div>
            </Label>
          </Dropdown.Item>

          <Dropdown.Item
            key="sign-out"
            variant="danger"
            className="h-10"
            onPress={handleSignOut}
          >
            <Label>
              <SignOut24Regular /> Keluar
            </Label>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
}
