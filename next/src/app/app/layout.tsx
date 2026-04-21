import AppSidebar from "@/components/ui/AppSidebar";
import Backdrop from "@/components/ui/AppSidebar/Backdrop";
import { SidebarProvider } from "@/hooks/useNavigation";
import Display from "../../components/ui/Display";
import { itemSidebarNav } from "../../components/navigation/NavItems";

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
