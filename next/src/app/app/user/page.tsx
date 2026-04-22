import { NavigationTitle } from "@/components/ui/NavigationTitle";
import { UserTable } from "@/views/users/UserTable";
import { UserListProvider } from "@/providers/users/UserListProvider";
import { UserActionsProvider } from "@/providers/users/UserActions";
import { env } from "@/libs/env";

export default async function Page() {
  return (
    <div>
      <NavigationTitle title="Daftar User" />

      <UserListProvider apiUrl={env.BACKEND_API_URL}>
        <UserActionsProvider apiUrl={env.BACKEND_API_URL}>
          <div className="flex w-full flex-col gap-8">
            <UserTable />
          </div>
        </UserActionsProvider>
      </UserListProvider>
    </div>
  );
}
