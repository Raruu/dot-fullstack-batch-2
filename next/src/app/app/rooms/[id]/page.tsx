import { notFound } from "next/navigation";
import { NavigationTitle } from "@/components/ui/NavigationTitle";
import { getRoomDetail } from "@/models/queries/rooms/get-room-detail";
import { RoomCard } from "@/views/rooms/detail/RoomCard";
import { RoomDetailProvider } from "@/providers/rooms/RoomDetailProvider";
import { RoomActionsProvider } from "@/providers/rooms/RoomActions";
import { updateRoomAction } from "@/controllers/actions/rooms/update";
import { deleteRoomAction } from "@/controllers/actions/rooms/delete";
import { updateScheduleAction } from "@/controllers/actions/schedule/update";
import { createScheduleAction } from "@/controllers/actions/schedule/create";
import { deleteScheduleAction } from "@/controllers/actions/schedule/delete";
import NotFound from "@/app/not-found";
import LoadDetailActionSuccess from "@/views/rooms/detail/LoadDetailProvider";
import { ScheduleActionsProvider } from "@/providers/schedule/ScheduleActions";
import { ScheduleEdit } from "@/views/rooms/detail/ScheduleEdit";

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
  const bindedUpdateScheduleAction = updateScheduleAction.bind(
    null,
    "/app/rooms",
  );
  const bindedCreateScheduleAction = createScheduleAction.bind(
    null,
    "/app/rooms",
  );
  const bindedDeleteScheduleAction = deleteScheduleAction.bind(
    null,
    "/app/rooms",
  );

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
        <LoadDetailActionSuccess />
        {detail ? (
          <RoomDetailProvider detail={detail}>
            <div className="space-y-4">
              <RoomCard />
              <ScheduleActionsProvider
                createScheduleAction={bindedCreateScheduleAction}
                updateScheduleAction={bindedUpdateScheduleAction}
                deleteScheduleAction={bindedDeleteScheduleAction}
              >
                <ScheduleEdit />
              </ScheduleActionsProvider>
            </div>
          </RoomDetailProvider>
        ) : (
          <>
            <NotFound
              baka="Nyaa~"
              message="Data sudah tidak ada atau tidak pernah ada"
              backInstead
            />
          </>
        )}
      </RoomActionsProvider>
    </div>
  );
}
