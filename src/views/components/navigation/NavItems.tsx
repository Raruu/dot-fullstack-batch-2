"use client";
import { SidebarNavSections } from "@/types/nav-item";
import {
  AppsList24Regular,
  CalendarLtr24Regular,
  Grid24Regular,
} from "@fluentui/react-icons";

export const itemSidebarNav: SidebarNavSections = {
  menu: [
    {
      icon: <Grid24Regular />,
      name: "Dashboard",
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
