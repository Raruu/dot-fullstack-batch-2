import { UseConfirmDialogOptions } from "@/types/dialog";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import { useState, useCallback } from "react";

export const useConfirmDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<UseConfirmDialogOptions>({
    title: "",
    message: "",
  });
  const [resolveRef, setResolveRef] = useState<
    ((value: boolean) => void) | null
  >(null);

  const confirm = useCallback(
    (opts: UseConfirmDialogOptions): Promise<boolean> => {
      setOptions(opts);
      setIsOpen(true);

      return new Promise((resolve) => {
        setResolveRef(() => resolve);
      });
    },
    [],
  );

  const handleSave = useCallback(() => {
    setIsOpen(false);
    resolveRef?.(true);
  }, [resolveRef]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    resolveRef?.(false);
  }, [resolveRef]);

  const content =
    typeof options.message === "function" ? options.message() : options.message;

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
            <Button variant="light" onPress={handleClose}>
              {options.cancelText || "Tidak"}
            </Button>
          )}

          <Button
            color={options.variant || "primary"}
            onPress={handleSave}
            isDisabled={options.disabled}
          >
            {options.confirmText || "Ya"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );

  return { confirm, DialogComponent };
};
