"use client";

import {
  Avatar,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { Camera24Regular } from "@fluentui/react-icons";
import Cropper, { Area } from "react-easy-crop";
import { ChangeEvent, useCallback, useRef, useState } from "react";
import { motion } from "motion/react";

interface Props {
  previewSrc: string | null;
  onFileCropped: (file: File, previewUrl: string) => void;
  isInvalid?: boolean;
  errorMessage?: string;
}

async function createImageFromDataUrl(
  dataUrl: string,
): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", () =>
      reject(new Error("Gagal memuat gambar.")),
    );
    image.src = dataUrl;
  });
}

async function cropToWebpFile(
  imageSrc: string,
  pixelCrop: Area,
): Promise<File> {
  const image = await createImageFromDataUrl(imageSrc);
  const canvas = document.createElement("canvas");

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Canvas tidak tersedia.");
  }

  context.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height,
  );

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, "image/webp", 0.92);
  });

  if (!blob) {
    throw new Error("Gagal memproses gambar.");
  }

  return new File([blob], `${Date.now()}.webp`, { type: "image/webp" });
}

export function ProfileImageField({
  previewSrc,
  onFileCropped,
  isInvalid,
  errorMessage,
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onFileChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];

      if (!file) {
        return;
      }

      const reader = new FileReader();

      reader.onload = () => {
        const result = reader.result;

        if (typeof result !== "string") {
          return;
        }

        setSourceImage(result);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setCropModalOpen(true);
      };

      reader.readAsDataURL(file);
      event.target.value = "";
    },
    [],
  );

  const onCropComplete = useCallback(
    (_croppedArea: Area, croppedPixels: Area) => {
      setCroppedAreaPixels(croppedPixels);
    },
    [],
  );

  const confirmCrop = useCallback(async () => {
    if (!sourceImage || !croppedAreaPixels) {
      return;
    }

    const file = await cropToWebpFile(sourceImage, croppedAreaPixels);
    const previewUrl = URL.createObjectURL(file);

    onFileCropped(file, previewUrl);
    setCropModalOpen(false);
    setSourceImage(null);
  }, [croppedAreaPixels, onFileCropped, sourceImage]);

  return (
    <div className="w-full space-y-2">
      <div className="flex w-full flex-col items-center gap-3 pb-1">
        <motion.div
          whileHover={{ scale: 1.15, translateY: -10 }}
          onClick={() => inputRef.current?.click()}
        >
          <Avatar
            src={previewSrc ?? ""}
            alt="Foto Profil"
            className="size-36"
          />
        </motion.div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onFileChange}
        />
        <Button
          variant="flat"
          color="primary"
          onPress={() => inputRef.current?.click()}
          startContent={<Camera24Regular />}
        >
          Pilih Foto
        </Button>
      </div>

      {isInvalid && errorMessage ? (
        <p className="text-sm text-danger">{errorMessage}</p>
      ) : null}

      <Modal
        isOpen={cropModalOpen}
        onClose={() => setCropModalOpen(false)}
        size="xl"
      >
        <ModalContent>
          <ModalHeader>Crop Foto Profil (1:1)</ModalHeader>
          <ModalBody>
            <div className="relative h-[50vh] w-full overflow-hidden rounded-xl bg-black">
              {sourceImage ? (
                <Cropper
                  image={sourceImage}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  cropShape="round"
                  showGrid={false}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
              ) : null}
            </div>
            <div className="space-y-1">
              <p className="text-sm text-default-500">Zoom</p>
              <input
                type="range"
                min={1}
                max={3}
                step={0.01}
                value={zoom}
                onChange={(event) => setZoom(Number(event.target.value))}
                className="w-full"
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={() => setCropModalOpen(false)}>
              Batal
            </Button>
            <Button color="primary" onPress={confirmCrop}>
              Gunakan Foto
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
