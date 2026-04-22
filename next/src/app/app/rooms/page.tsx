import { NavigationTitle } from "@/components/ui/NavigationTitle";
import { RoomTable } from "@/views/rooms/RoomTable";
import { RoomListProvider } from "@/providers/rooms/RoomListProvider";
import { RoomActionsProvider } from "@/providers/rooms/RoomActions";
import { env } from "@/libs/env";

export default async function Page() {
  return (
    <div>
      <NavigationTitle title="Daftar Ruangan" />

      <RoomListProvider apiUrl={env.BACKEND_API_URL}>
        <RoomActionsProvider apiUrl={env.BACKEND_API_URL}>
          <div className="flex w-full flex-col gap-8">
            <RoomTable />
          </div>
        </RoomActionsProvider>
      </RoomListProvider>
    </div>
  );
}
