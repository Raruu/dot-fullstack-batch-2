"use client";

import { CheckmarkFilled, Copy20Regular } from "@fluentui/react-icons";
import { Button, Tooltip } from "@heroui/react";
import { useCallback, useMemo, useState } from "react";

interface UseCopyOptions {
  idleText?: string;
  copiedText?: string;
  durationMs?: number;
}

export function useCopy(options: UseCopyOptions = {}) {
  const {
    idleText = "Salin",
    copiedText = "Tersalin",
    durationMs = 1200,
  } = options;

  const [isCopied, setIsCopied] = useState(false);

  const copy = useCallback(
    async (value: string) => {
      await navigator.clipboard.writeText(value);
      setIsCopied(true);

      window.setTimeout(() => {
        setIsCopied(false);
      }, durationMs);
    },
    [durationMs],
  );

  const label = useMemo(
    () => (isCopied ? copiedText : idleText),
    [copiedText, idleText, isCopied],
  );

  const renderCopyButton = useCallback(
    (value: string) => (
      <Tooltip
        content={
          isCopied ? (
            <div className="flex flex-row items-center justify-center gap-1">
              <CheckmarkFilled /> <p>{copiedText}</p>
            </div>
          ) : (
            label
          )
        }
        isOpen={isCopied ? true : undefined}
        color={isCopied ? "success" : "primary"}
        showArrow
      >
        <Button
          size="sm"
          variant="light"
          isIconOnly
          onPress={() => copy(value)}
        >
          <Copy20Regular />
        </Button>
      </Tooltip>
    ),
    [copiedText, copy, isCopied, label],
  );

  return {
    copy,
    isCopied,
    label,
    renderCopyButton,
  };
}
