import { notFound } from "next/navigation";
import { NavigationTitle } from "@/components/ui/NavigationTitle";
import { RoomCard } from "@/views/rooms/detail/RoomCard";
import {
  RoomDetailProvider,
  useRoomDetail,
} from "@/providers/rooms/RoomDetailProvider";
import { RoomActionsProvider } from "@/providers/rooms/RoomActions";
import LoadDetailActionSuccess from "@/views/rooms/detail/LoadDetailProvider";
import { ScheduleActionsProvider } from "@/providers/schedule/ScheduleActions";
import { ScheduleEdit } from "@/views/rooms/detail/ScheduleEdit";
import { env } from "@/libs/env";

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

  return (
    <div className="space-y-6">
      <NavigationTitle title={`Detail Ruangan`} showBack />

      <RoomDetailProvider apiUrl={env.BACKEND_API_URL} roomId={parsedId}>
        <RoomActionsProvider
          apiUrl={env.BACKEND_API_URL}
          useData={useRoomDetail}
        >
          <LoadDetailActionSuccess />
          <div className="space-y-4">
            <RoomCard />
            <ScheduleActionsProvider apiUrl={env.BACKEND_API_URL}>
              <ScheduleEdit />
            </ScheduleActionsProvider>
          </div>
        </RoomActionsProvider>
      </RoomDetailProvider>
    </div>
  );
}
