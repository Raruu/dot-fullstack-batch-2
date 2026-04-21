"use client";

import { Button, Input, Switch, Tooltip } from "@heroui/react";
import { useEffect, useRef, useState } from "react";
import { Add20Filled } from "@fluentui/react-icons";
import { useConfirmDialogFixed } from "@/views/hooks/useConfirmDialogFixed";
import { useUserActions } from "@/views/providers/users/UserActions";
import { ProfileImageField } from "./ProfileImageField";

function useCreateModalUser() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [emailVerified, setEmailVerified] = useState(false);
  const { createState, submitCreate, isCreatePending } = useUserActions();
  const imagePreviewRef = useRef<string | null>(null);

  const { confirm, DialogComponent, closeDialog, setIsLoading } =
    useConfirmDialogFixed({
      message: () => (
        <div className="w-full space-y-3">
          <ProfileImageField
            previewSrc={imagePreview}
            onFileCropped={(file, previewUrl) => {
              if (imagePreviewRef.current?.startsWith("blob:")) {
                URL.revokeObjectURL(imagePreviewRef.current);
              }

              imagePreviewRef.current = previewUrl;
              setImageFile(file);
              setImagePreview(previewUrl);
            }}
            isInvalid={!!createState.errors?.imageFile}
            errorMessage={createState.errors?.imageFile?.join(", ")}
          />

          <Input
            label="Nama"
            value={name}
            onValueChange={setName}
            isRequired
            isInvalid={!!createState.errors?.name}
            errorMessage={createState.errors?.name?.join(", ")}
          />
          <Input
            label="Email"
            value={email}
            onValueChange={setEmail}
            isRequired
            isInvalid={!!createState.errors?.email}
            errorMessage={createState.errors?.email?.join(", ")}
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onValueChange={setPassword}
            isRequired
            isInvalid={!!createState.errors?.password}
            errorMessage={createState.errors?.password?.join(", ")}
          />
          <Input
            label="Konfirmasi Password"
            type="password"
            value={confirmPassword}
            onValueChange={setConfirmPassword}
            isRequired
            isInvalid={!!createState.errors?.confirmPassword}
            errorMessage={createState.errors?.confirmPassword?.join(", ")}
          />
          <div className="flex flex-row items-center justify-between px-2">
            <p className="text-md ">Email Terverifikasi</p>
            <Switch
              isSelected={emailVerified}
              onChange={(e) => {
                setEmailVerified(e.target.checked);
              }}
            />
          </div>
        </div>
      ),
      onConfirm: () => {
        setIsLoading(true);
        const formData = new FormData();
        formData.set("name", name);
        formData.set("email", email);
        formData.set("password", password);
        formData.set("confirmPassword", confirmPassword);
        if (imageFile) {
          formData.set("imageFile", imageFile);
        }
        formData.set("emailVerified", emailVerified ? "true" : "false");
        submitCreate(formData);
        return false;
      },
    });

  useEffect(() => {
    return () => {
      if (imagePreviewRef.current?.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreviewRef.current);
      }
    };
  }, []);

  useEffect(() => {
    (() => setIsSuccess(createState.success ?? false))();
  }, [createState, setIsLoading]);

  useEffect(() => {
    setIsLoading(false);
    if (isSuccess && name && email && password && confirmPassword) {
      (() => {
        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setImageFile(null);
        if (imagePreviewRef.current?.startsWith("blob:")) {
          URL.revokeObjectURL(imagePreviewRef.current);
        }
        imagePreviewRef.current = null;
        setImagePreview(null);
        setEmailVerified(false);
        closeDialog(true);
      })();
    }
  }, [
    closeDialog,
    confirmPassword,
    createState,
    email,
    isSuccess,
    name,
    password,
    setIsLoading,
  ]);

  const openCreateModal = async () => {
    setIsLoading(false);
    setIsSuccess(false);
    await confirm({
      title: "Tambah User",
      confirmText: "Simpan",
      cancelText: "Batal",
      disabled: isCreatePending,
    });
  };

  return {
    openCreateModal,
    DialogComponent,
  };
}

export function UserCreateDialog() {
  const { openCreateModal, DialogComponent } = useCreateModalUser();

  return (
    <>
      {DialogComponent}
      <Tooltip content="Tambah User" color="primary">
        <Button size="lg" color="primary" isIconOnly onPress={openCreateModal}>
          <Add20Filled />
        </Button>
      </Tooltip>
    </>
  );
}
