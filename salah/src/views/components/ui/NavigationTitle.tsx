"use client";

import { useNavigation } from "@/views/hooks/useNavigation";
import { useEffect, useRef } from "react";

type Props = {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
};

export const NavigationTitle = ({
  title = "",
  subtitle = "",
  showBack = false,
}: Props) => {
  const { setNavigationText, setShowBack } = useNavigation();
  const setNavigationTextRef = useRef(setNavigationText);
  const setShowBackRef = useRef(setShowBack);
  useEffect(() => {
    setNavigationTextRef.current({ title: title, subtitle: subtitle });
    setShowBackRef.current(showBack);
  }, [showBack, subtitle, title]);

  return <></>;
};
