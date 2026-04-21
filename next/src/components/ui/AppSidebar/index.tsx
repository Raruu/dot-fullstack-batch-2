"use client";
import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown20Regular,
  MoreHorizontal20Regular,
} from "@fluentui/react-icons";
import { useNavigation } from "@/hooks/useNavigation";
import { NavItem, SidebarNavSections } from "@/types/nav-item";
import AppLogo from "../AppLogo";
import { cn } from "@heroui/react";

type AppSidebarProps = {
  navSections: SidebarNavSections;
};

const AppSidebar: React.FC<AppSidebarProps> = ({ navSections }) => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered, toggleSidebar } =
    useNavigation();
  const pathname = usePathname();
  const showLabels = isExpanded || isHovered || isMobileOpen;

  const formatSectionTitle = useCallback((key: string) => {
    if (/^[a-z]+\d+$/i.test(key)) {
      return key.toUpperCase();
    }

    return key
      .replace(/[_-]+/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }, []);

  const sectionEntries = useMemo(
    () => [
      ...Object.entries(navSections).map(([key, items]) => ({
        key,
        title: formatSectionTitle(key),
        items,
      })),
    ],
    [formatSectionTitle, navSections],
  );

  const renderMenuItems = (navItems: NavItem[], menuType: string) => (
    <ul className="flex flex-col gap-4">
      {navItems.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={cn(
                "group flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors duration-200 lg:justify-start",
                openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "sidebar-item-active"
                  : "sidebar-item-inactive",
              )}
            >
              <span
                className={cn(
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "sidebar-icon-active"
                    : "sidebar-icon-inactive",
                )}
              >
                {nav.icon}
              </span>
              {showLabels && (
                <span className="text-sm font-bold">{nav.name}</span>
              )}
              {showLabels && (
                <ChevronDown20Regular
                  className={cn(
                    "ml-auto h-5 w-5 transition-transform duration-200",
                    openSubmenu?.type === menuType &&
                      openSubmenu?.index === index &&
                      "rotate-180 text-primary",
                  )}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                href={nav.path}
                className={cn(
                  "group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 transition-colors duration-200",
                  isActive(nav.path)
                    ? "sidebar-item-active"
                    : "sidebar-item-inactive",
                )}
              >
                <span
                  className={cn(
                    isActive(nav.path)
                      ? "sidebar-icon-active"
                      : "sidebar-icon-inactive",
                  )}
                >
                  {nav.icon}
                </span>
                {showLabels && (
                  <span className="text-sm font-bold text-ellipsis overflow-hidden text-nowrap">
                    {nav.name}
                  </span>
                )}
              </Link>
            )
          )}
          {nav.subItems && showLabels && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => {
                  const subItemActive = isActive(subItem.path);

                  return (
                    <li key={subItem.name}>
                      <Link
                        href={subItem.path}
                        className={cn(
                          "flex items-center gap-2 rounded-xl px-3 py-3 text-sm transition-colors duration-200 font-semibold",
                          subItemActive
                            ? "sidebar-item-active"
                            : "sidebar-subitem-inactive",
                        )}
                      >
                        {subItem.name}
                        <span className="flex items-center gap-1 ml-auto">
                          {subItem.new && (
                            <span
                              className={cn(
                                "ml-auto rounded-xl px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                                subItemActive
                                  ? "sidebar-badge-active"
                                  : "sidebar-badge-inactive",
                              )}
                            >
                              new
                            </span>
                          )}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: string;
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {},
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback((path: string) => path === pathname, [pathname]);

  useEffect(() => {
    let submenuMatched = false;
    sectionEntries.forEach(({ key, items }) => {
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: key,
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    if (!submenuMatched) {
      const setSubMenu = () => {
        setOpenSubmenu(null);
      };
      setSubMenu();
    }
  }, [pathname, isActive, sectionEntries]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: string) => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 z-50  flex h-screen flex-col border-r border-gray-200 bg-foreground/5 px-5 text-gray-900 transition-all duration-300 ease-in-out mt-0 lg:translate-x-0 dark:border-gray-800",
        isExpanded || isMobileOpen || isHovered ? "w-72.5" : "w-22.5",
        isMobileOpen ? "translate-x-0 bg-background" : "-translate-x-full",
      )}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={cn(
          "flex py-8",
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start",
        )}
      >
        <button
          type="button"
          onClick={toggleSidebar}
          className="cursor-pointer"
          aria-label="Toggle sidebar"
        >
          <AppLogo showLabels={showLabels} />
        </button>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear overflow-x-hidden">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            {sectionEntries.map(({ key, title, items }) => (
              <div key={key}>
                <h2
                  className={cn(
                    "mb-4 flex text-xs uppercase leading-5 text-gray-400",
                    !isExpanded && !isHovered
                      ? "lg:justify-center"
                      : "justify-start",
                  )}
                >
                  {showLabels ? title : <MoreHorizontal20Regular />}
                </h2>
                {renderMenuItems(items, key)}
              </div>
            ))}
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
