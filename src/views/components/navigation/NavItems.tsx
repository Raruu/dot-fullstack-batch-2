"use client";
import { SidebarNavSections } from "@/types/nav-item";
import { AppsList24Regular, Grid24Regular } from "@fluentui/react-icons";

export const itemSidebarNav: SidebarNavSections = {
  menu: [
    {
      icon: <Grid24Regular />,
      name: "Dashboard",
      path: "/",
    },
    {
      name: "Master",
      icon: <AppsList24Regular />,
      subItems: [{ name: "User", path: "/user" }],
    },
  ],
};
