import { notFound } from "next/navigation";
import { NavigationTitle } from "@/views/components/ui/NavigationTitle";
import { getRoomDetail } from "@/models/queries/rooms/get-room-detail";
import { RoomCard } from "@/views/pages/rooms/detail/RoomCard";
import { RoomDetailProvider } from "@/views/providers/rooms/RoomDetailProvider";
import { RoomActionsProvider } from "@/views/providers/rooms/RoomActions";
import { updateRoomAction } from "@/controllers/actions/rooms/update";
import { deleteRoomAction } from "@/controllers/actions/rooms/delete";
import NotFound from "@/app/not-found";
import LoadDetailProvider from "@/views/pages/rooms/detail/LoadDetailProvider";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  const parsedId = Number(id);

  if (!Number.isInteger(parsedId) || parsedId <= 0) {
    notFound();
  }

  const detail = await getRoomDetail(parsedId);

  const bindedUpdateRoomAction = updateRoomAction.bind(null, "/app/rooms");
  const bindedDeleteRoomAction = deleteRoomAction.bind(null, "/app/rooms");

  return (
    <div className="space-y-6">
      <NavigationTitle
        title={`Detail Ruangan ${detail?.roomCode ?? "yang tidak ditemukan"}`}
        subtitle={detail?.roomName ?? "Mungkin sudah dihapus"}
        showBack
      />

      <RoomActionsProvider
        deleteRoomAction={bindedDeleteRoomAction}
        updateRoomAction={bindedUpdateRoomAction}
      >
        {detail ? (
          <RoomDetailProvider detail={detail}>
            <RoomCard />
          </RoomDetailProvider>
        ) : (
          <>
            <NotFound
              baka="Nyaa~"
              message="Data sudah tidak ada atau tidak pernah ada"
              backInstead
            />
            <LoadDetailProvider />
          </>
        )}
      </RoomActionsProvider>
    </div>
  );
}
