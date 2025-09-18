import { 
  LayoutDashboard, 
  CheckSquare, 
  Users, 
  Download, 
  BookOpen,
  LogOut,
  User
} from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { ProfileDialog } from "@/components/ProfileDialog";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const navigationItems = [
  { 
    title: "Dashboard", 
    url: "/", 
    icon: LayoutDashboard,
    description: "Visão geral do sistema"
  },
  { 
    title: "Tarefas", 
    url: "/tarefas", 
    icon: CheckSquare,
    description: "Gerenciar tarefas e prazos"
  },
  { 
    title: "Clientes", 
    url: "/clientes", 
    icon: Users,
    description: "CRUD de clientes"
  },
  { 
    title: "Recursos", 
    url: "/recursos", 
    icon: Download,
    description: "Ferramentas e aplicativos"
  },
  { 
    title: "Wiki", 
    url: "/wiki", 
    icon: BookOpen,
    description: "Templates e códigos"
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut, currentEmployee } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const currentPath = location.pathname;
  const isCollapsed = state === "collapsed";

  const isActive = (path: string) => {
    if (path === "/") return currentPath === "/";
    return currentPath.startsWith(path);
  };

  const getNavCls = (active: boolean) => 
    active 
      ? "bg-primary text-primary-foreground shadow-glow" 
      : "hover:bg-surface-hover transition-all duration-200";

  return (
    <Sidebar 
      className="border-r border-border bg-gradient-surface"
      collapsible="icon"
    >
      <SidebarContent>
        {/* Logo/Brand */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center shadow-glow">
              <LayoutDashboard className="w-4 h-4 text-white" />
            </div>
            {!isCollapsed && (
              <div className="animate-fade-in">
                <h2 className="text-lg font-bold text-foreground">Image Press</h2>
                <p className="text-xs text-muted-foreground">Plataforma de Gestão de Desenvolvimento</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <SidebarGroup className="flex-1">
          <SidebarGroupLabel className={isCollapsed ? "sr-only" : "text-muted-foreground px-6 py-2"}>
            Navegação Principal
          </SidebarGroupLabel>
          
          <SidebarGroupContent className="px-3">
            <SidebarMenu className="space-y-2">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-12">
                    <NavLink 
                      to={item.url} 
                      className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group ${getNavCls(isActive(item.url))}`}
                    >
                      <item.icon className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${isActive(item.url) ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                      
                      {!isCollapsed && (
                        <div className="flex-1 animate-fade-in">
                          <div className={`font-medium ${isActive(item.url) ? 'text-primary-foreground' : 'text-foreground'}`}>
                            {item.title}
                          </div>
                          <div className={`text-xs ${isActive(item.url) ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                            {item.description}
                          </div>
                        </div>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="p-3 border-t border-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="h-12">
              <div 
                className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-surface-hover transition-all duration-200 group cursor-pointer"
                onClick={() => setProfileOpen(true)}
                title="Editar perfil"
              >
                {currentEmployee?.avatar_url ? (
                  <img
                    src={currentEmployee.avatar_url}
                    alt={currentEmployee.name}
                    className="w-8 h-8 rounded-full border"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
                
                {!isCollapsed && (
                  <div className="flex-1 animate-fade-in">
                    <div className="font-medium text-foreground">{currentEmployee?.name || user?.user_metadata?.full_name || 'Usuário'}</div>
                    <div className="text-xs text-muted-foreground">{currentEmployee?.email || user?.email || 'sem email'}</div>
                  </div>
                )}
                
                {!isCollapsed && (
                  <button
                    type="button"
                    className="p-2 rounded hover:bg-destructive/10"
                    onClick={async (e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      try {
                        await signOut();
                        navigate('/login');
                      } catch (err) {
                        console.error('Erro ao sair', err);
                      }
                    }}
                    title="Sair"
                  >
                    <LogOut className="w-4 h-4 text-muted-foreground hover:text-destructive transition-colors duration-200" />
                  </button>
                )}
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      {/* Profile Dialog */}
      <ProfileDialog open={profileOpen} onOpenChange={setProfileOpen} />
    </Sidebar>
  );
}