import { NavigationTitle } from "@/views/components/ui/NavigationTitle";
import { getRoomListData } from "@/models/queries/rooms/get-room-list";
import { RoomTable } from "@/views/pages/rooms/RoomTable";
import { RoomListProvider } from "@/views/providers/rooms/RoomListProvider";
import { createRoomAction } from "@/controllers/actions/rooms/create";
import { RoomActionsProvider } from "@/views/providers/rooms/RoomActions";

interface Props {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export default async function Page({ searchParams }: Props) {
  const resolvedSearchParams = (await searchParams) ?? {};

  const data = await getRoomListData({
    floor: Array.isArray(resolvedSearchParams.floor)
      ? resolvedSearchParams.floor[0]
      : resolvedSearchParams.floor,
    search: Array.isArray(resolvedSearchParams.search)
      ? resolvedSearchParams.search[0]
      : resolvedSearchParams.search,
    page: Array.isArray(resolvedSearchParams.page)
      ? resolvedSearchParams.page[0]
      : resolvedSearchParams.page,
    pageSize: Array.isArray(resolvedSearchParams.pageSize)
      ? resolvedSearchParams.pageSize[0]
      : resolvedSearchParams.pageSize,
  });

  const bindedCreateClassAction = createRoomAction.bind(null, "/app/rooms");

  return (
    <div>
      <NavigationTitle
        title="Daftar Ruangan"
        subtitle={`${data.pagination.totalCount} Ruangan`}
      />

      <RoomListProvider data={data}>
        <RoomActionsProvider createClassAction={bindedCreateClassAction}>
          <div className="flex w-full flex-col gap-8">
            <RoomTable />
          </div>
        </RoomActionsProvider>
      </RoomListProvider>
    </div>
  );
}
