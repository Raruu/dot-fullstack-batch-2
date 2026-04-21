"use client";

import { Input, Switch } from "@heroui/react";
import { useEffect, useRef, useState } from "react";

import { useConfirmDialogFixed } from "@/views/hooks/useConfirmDialogFixed";
import { useUserActions } from "@/views/providers/users/UserActions";
import { UserListRow } from "@/types/users/users-list";
import { ProfileImageField } from "./ProfileImageField";

export function useEditModalUser() {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [emailVerified, setEmailVerified] = useState(false);
  const imagePreviewRef = useRef<string | null>(null);

  const { updateState, submitUpdateById, isUpdatePending } = useUserActions();
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    (() => {
      setIsSuccess(updateState.success ?? false);
    })();
  }, [updateState]);

  const { confirm, DialogComponent, closeDialog, setIsLoading } =
    useConfirmDialogFixed({
      message: () => (
        <div className="w-full space-y-3">
          <ProfileImageField
            previewSrc={image}
            onFileCropped={(file, previewUrl) => {
              if (imagePreviewRef.current?.startsWith("blob:")) {
                URL.revokeObjectURL(imagePreviewRef.current);
              }

              imagePreviewRef.current = previewUrl;
              setImageFile(file);
              setImage(previewUrl);
            }}
            isInvalid={!!updateState.errors?.imageFile}
            errorMessage={updateState.errors?.imageFile?.join(", ")}
          />

          <Input
            label="Nama"
            value={name}
            onValueChange={setName}
            isRequired
            isInvalid={!!updateState.errors?.name}
            errorMessage={updateState.errors?.name?.join(", ")}
          />
          <Input
            label="Email"
            value={email}
            onValueChange={setEmail}
            isRequired
            isInvalid={!!updateState.errors?.email}
            errorMessage={updateState.errors?.email?.join(", ")}
          />
          <Input
            label="Password Baru"
            type="password"
            value={newPassword}
            onValueChange={setNewPassword}
            isInvalid={!!updateState.errors?.newPassword}
            errorMessage={updateState.errors?.newPassword?.join(", ")}
            description="Kosongkan jika tidak ingin reset password"
          />
          <Input
            label="Konfirmasi Password Baru"
            type="password"
            value={confirmPassword}
            onValueChange={setConfirmPassword}
            isInvalid={!!updateState.errors?.confirmPassword}
            errorMessage={updateState.errors?.confirmPassword?.join(", ")}
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
        if (!editingId) {
          return false;
        }

        setIsLoading(true);
        const formData = new FormData();
        formData.set("id", editingId);
        formData.set("name", name);
        formData.set("email", email);
        formData.set("imageCurrent", image ?? "");
        if (imageFile) {
          formData.set("imageFile", imageFile);
        }
        formData.set("emailVerified", emailVerified ? "true" : "false");
        formData.set("newPassword", newPassword);
        formData.set("confirmPassword", confirmPassword);
        submitUpdateById(formData);
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
    setIsLoading(false);

    if (isSuccess && editingId) {
      (() => {
        closeDialog(true);
        setEditingId(null);
        setIsSuccess(false);
      })();
    }
  }, [closeDialog, editingId, isSuccess, setIsLoading, updateState]);

  const openEditModal = async (row: UserListRow) => {
    setEditingId(row.id);
    setName(row.name);
    setEmail(row.email);
    if (imagePreviewRef.current?.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreviewRef.current);
    }
    imagePreviewRef.current = null;
    setImageFile(null);
    setImage(row.image ?? null);
    setEmailVerified(row.emailVerified);
    setNewPassword("");
    setConfirmPassword("");
    setIsSuccess(false);
    setIsLoading(false);

    await confirm({
      title: `Edit ${row.name}`,
      confirmText: "Simpan",
      cancelText: "Batal",
      disabled: isUpdatePending,
    });
  };

  return {
    openEditModal,
    DialogComponent,
  };
}
