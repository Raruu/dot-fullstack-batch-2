import { NavigationTitle } from "@/views/components/ui/NavigationTitle";
import { getUserListData } from "@/models/queries/users/get-user-list";
import { UserTable } from "@/views/pages/users/UserTable";
import { UserListProvider } from "@/views/providers/users/UserListProvider";
import { createUserAction } from "@/controllers/actions/users/create";
import { updateUserAction } from "@/controllers/actions/users/update";
import { UserActionsProvider } from "@/views/providers/users/UserActions";
import { deleteUserAction } from "@/controllers/actions/users/delete";

interface Props {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export default async function Page({ searchParams }: Props) {
  const resolvedSearchParams = (await searchParams) ?? {};

  const data = await getUserListData({
    status: Array.isArray(resolvedSearchParams.status)
      ? resolvedSearchParams.status[0]
      : resolvedSearchParams.status,
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

  const bindedCreateUserAction = createUserAction.bind(null, "/app/user");
  const bindedUpdateUserAction = updateUserAction.bind(null, "/app/user");
  const bindedDeleteUserAction = deleteUserAction.bind(null, "/app/user");

  return (
    <div>
      <NavigationTitle
        title="Daftar User"
        subtitle={`${data.pagination.totalCount} User`}
      />

      <UserListProvider data={data}>
        <UserActionsProvider
          createUserAction={bindedCreateUserAction}
          updateUserAction={bindedUpdateUserAction}
          deleteUserAction={bindedDeleteUserAction}
        >
          <div className="flex w-full flex-col gap-8">
            <UserTable />
          </div>
        </UserActionsProvider>
      </UserListProvider>
    </div>
  );
}
