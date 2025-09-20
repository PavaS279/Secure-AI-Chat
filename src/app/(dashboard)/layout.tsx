import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BarChart2, BookOpen, Search, LogOut, Puzzle, Inbox } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThreatHistoryProvider } from "@/contexts/threat-history-context";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThreatHistoryProvider>
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader>
            <Logo />
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip={{ children: "Dashboard", side: "right", align: "center" }}
                >
                  <Link href="/">
                    <BarChart2 />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip={{ children: "Analyze", side: "right", align: "center" }}
                >
                  <Link href="/analyze">
                    <Search />
                    <span>Analyze</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip={{
                    children: "Inbox",
                    side: "right",
                    align: "center",
                  }}
                >
                  <Link href="/inbox">
                    <Inbox />
                    <span>Inbox</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip={{
                    children: "Extension",
                    side: "right",
                    align: "center",
                  }}
                >
                  <Link href="/extension">
                    <Puzzle />
                    <span>Extension</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip={{
                    children: "Training",
                    side: "right",
                    align: "center",
                  }}
                >
                  <Link href="/training">
                    <BookOpen />
                    <span>Training</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://picsum.photos/seed/user/100/100" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div className="flex flex-col text-sm group-data-[collapsible=icon]:hidden">
                <span className="font-medium text-foreground">User</span>
                <span className="text-muted-foreground">user@example.com</span>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:h-8 ml-auto">
              <LogOut className="h-4 w-4" />
            </Button>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <header className="flex h-14 items-center gap-4 border-b bg-background/90 px-6 backdrop-blur-sm">
            <SidebarTrigger className="md:hidden" />
            <div className="flex-1">
              {/* Optional Header Content */}
            </div>
          </header>
          <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </ThreatHistoryProvider>
  );
}
