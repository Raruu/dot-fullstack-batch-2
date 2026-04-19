"use client";
import { SidebarNavSections } from "@/types/nav-item";
import {
  AppsList24Regular,
  CalendarLtr24Regular,
  Home24Regular,
} from "@fluentui/react-icons";

export const itemSidebarNav: SidebarNavSections = {
  menu: [
    {
      icon: <Home24Regular />,
      name: "Beranda",
      path: "/app",
    },
    {
      icon: <CalendarLtr24Regular />,
      name: "Ruangan",
      path: "/app/rooms",
    },
    {
      name: "Master",
      icon: <AppsList24Regular />,
      subItems: [{ name: "User", path: "/app/user" }],
    },
  ],
};
