import { UseConfirmDialogFixedOptions } from "@/types/dialog";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  cn,
} from "@heroui/react";
import type { ReactNode } from "react";
import { useState, useCallback } from "react";

interface Props {
  message: ReactNode | (() => ReactNode);
  footer?: ReactNode | (() => ReactNode);
  thirdButton?: ReactNode | (() => ReactNode);
  onConfirm?: (result: boolean) => boolean | void | Promise<boolean | void>;
}

export const useConfirmDialogFixed = ({
  message,
  footer,
  thirdButton,
  onConfirm: onSave,
}: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<UseConfirmDialogFixedOptions>({
    title: "",
  });
  const [resolveRef, setResolveRef] = useState<
    ((value: boolean) => void) | null
  >(null);

  const confirm = useCallback(
    (opts: UseConfirmDialogFixedOptions): Promise<boolean> => {
      setOptions(opts);
      setIsOpen(true);

      return new Promise((resolve) => {
        setResolveRef(() => resolve);
      });
    },
    [],
  );

  const closeDialog = useCallback(
    (result: boolean) => {
      setIsOpen(false);
      resolveRef?.(result);
    },
    [resolveRef],
  );

  const handleSave = useCallback(async () => {
    const saveResult = await onSave?.(true);

    if (saveResult === false) {
      return;
    }

    closeDialog(true);
  }, [closeDialog, onSave]);

  const handleClose = useCallback(() => {
    closeDialog(false);
  }, [closeDialog]);

  const content = typeof message === "function" ? message() : message;
  const footerContent = typeof footer === "function" ? footer() : footer;
  const footerThirdButton =
    typeof thirdButton === "function" ? thirdButton() : thirdButton;

  const DialogComponent = (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="md"
      isDismissable={options.isDismissable || false}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          {options.title}
        </ModalHeader>
        <ModalBody>{content}</ModalBody>
        <ModalFooter className="w-full">
          {footer && footerContent}
          <div
            className={cn(
              "flex flex-row items-center w-full",
              thirdButton ? "justify-between" : "justify-end",
            )}
          >
            {thirdButton && footerThirdButton}
            <div className="flex flex-row items-center gap-1">
              {!options.noCancle && !footer && (
                <Button
                  variant="light"
                  onPress={handleClose}
                  isDisabled={isLoading}
                >
                  {options.cancelText || "Tidak"}
                </Button>
              )}
              {!footer && (
                <Button
                  color={options.variant || "primary"}
                  onPress={handleSave}
                  isDisabled={options.disabled}
                  isLoading={isLoading}
                >
                  {options.confirmText || "Ya"}
                </Button>
              )}
            </div>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );

  return { confirm, DialogComponent, closeDialog, setIsLoading };
};
