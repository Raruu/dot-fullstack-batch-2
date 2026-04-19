"use client";
import { useRoomDetail } from "@/views/providers/rooms/RoomDetailProvider";
import { useCopy } from "@/views/hooks/useCopy";
import { Button, Card } from "@heroui/react";
import { useEditModalRoom } from "../components/EditModal";
import { BinRecycleRegular, PenRegular } from "@fluentui/react-icons";
import { useDeleteModalRoom } from "../components/DeleteModal";

export function RoomCard() {
  const { detail } = useRoomDetail();

  const { openEditModal, DialogComponent: EditModal } = useEditModalRoom();

  const { openDeleteModal, DialogComponent: DeleteModal } =
    useDeleteModalRoom(detail);

  const { renderCopyButton } = useCopy({
    idleText: "Salin Kode Ruangan",
  });

  return (
    <>
      {EditModal}
      {DeleteModal}
      <Card className="bg-background/30 p-6 space-y-4">
        <div className="flex flex-row items-center justify-between">
          <h2 className="text-lg font-semibold">Informasi Ruangan</h2>

          <div className="flex flex-row items-center gap-3">
            <Button color="danger" variant="solid" onPress={openDeleteModal}>
              <BinRecycleRegular /> Hapus
            </Button>
            <Button
              color="primary"
              variant="solid"
              onPress={() => openEditModal(detail)}
            >
              <PenRegular />
              Edit
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-default-500">Kode Ruangan</p>
            <div className="flex items-center gap-2">
              <p className="font-medium">{detail.roomCode}</p>
              {renderCopyButton(detail.roomCode)}
            </div>
          </div>

          <div>
            <p className="text-default-500">Nama</p>
            <p className="font-medium">{detail.roomName}</p>
          </div>

          <div className="md:col-span-2">
            <p className="text-default-500">Lantai</p>
            <p className="font-medium">{detail.level}</p>
          </div>
        </div>
      </Card>
    </>
  );
}
