import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Menu } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <SidebarProvider defaultOpen={true}>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm flex items-center px-6 sticky top-0 z-10">
              <SidebarTrigger className="mr-4 p-2 rounded-lg hover:bg-surface-hover transition-colors duration-200">
                <Menu className="w-5 h-5" />
              </SidebarTrigger>
              
              <div className="flex-1">
                <h1 className="text-lg font-semibold text-foreground">Painel de Controle</h1>
                <p className="text-sm text-muted-foreground">Gerencie os serviços da sua empresa</p>
              </div>

              <div className="flex items-center gap-4">
                {/* Status indicator */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-red border border-primary/20">
                  <div className="w-2 h-2 rounded-full bg-primary animate-glow-pulse" />
                  <span className="text-xs font-medium text-primary">Online</span>
                </div>
              </div>
            </header>

            {/* Main content */}
            <main className="flex-1 p-6">
              <div className="animate-fade-in">
                {children}
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
}