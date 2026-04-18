import { UseConfirmDialogFixedOptions } from "@/types/dialog";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import type { ReactNode } from "react";
import { useState, useCallback } from "react";

interface Props {
  message: ReactNode | (() => ReactNode);
  onConfirm?: (result: boolean) => boolean | void | Promise<boolean | void>;
}

export const useConfirmDialogFixed = ({
  message,
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
        <ModalFooter>
          {!options.noCancle && (
            <Button
              variant="light"
              onPress={handleClose}
              isDisabled={isLoading}
            >
              {options.cancelText || "Tidak"}
            </Button>
          )}

          <Button
            color={options.variant || "primary"}
            onPress={handleSave}
            isDisabled={options.disabled}
            isLoading={isLoading}
          >
            {options.confirmText || "Ya"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );

  return { confirm, DialogComponent, closeDialog, setIsLoading };
};
