"use client";
import AppHeader from "@/components/ui/AppHeader";
import { useNavigation } from "@/hooks/useNavigation";
import { cn, ScrollShadow } from "@heroui/react";
import { useEffect, useRef, useState } from "react";

export default function Display({ children }: { children: React.ReactNode }) {
  const { isExpanded, isHovered, isMobileOpen } = useNavigation();
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    const element = headerRef.current;
    if (!element) return;

    const updateHeaderHeight = () => {
      setHeaderHeight(element.getBoundingClientRect().height);
    };

    updateHeaderHeight();

    const observer = new ResizeObserver(updateHeaderHeight);
    observer.observe(element);
    window.addEventListener("resize", updateHeaderHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateHeaderHeight);
    };
  }, []);

  return (
    <div
      className={cn(
        "flex-1 transition-all duration-300 ease-in-out max-h-screen overflow-hidden",
        isMobileOpen
          ? "ml-0"
          : isExpanded || isHovered
            ? "lg:ml-72.5"
            : "lg:ml-22.5",
      )}
    >
      <div ref={headerRef}>
        <AppHeader />
      </div>
      <ScrollShadow style={{ maxHeight: `calc(100vh - ${headerHeight}px)` }}>
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6 mb-9">
          {children}
        </div>
      </ScrollShadow>
    </div>
  );
}
