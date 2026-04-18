import AppSidebar from "@/views/components/ui/AppSidebar";
import Backdrop from "@/views/components/ui/AppSidebar/Backdrop";
import { SidebarProvider } from "@/views/hooks/useNavigation";
import Display from "../../views/components/ui/Display";
import { itemSidebarNav } from "../../views/components/navigation/NavItems";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="min-h-screen xl:flex">
        <AppSidebar navSections={itemSidebarNav} />
        <Backdrop />
        <Display>{children}</Display>
      </div>
    </SidebarProvider>
  );
}
