import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, Building2, Users, Wallet, MessageSquareWarning,
  Wrench, CalendarDays, Trees, Megaphone, Sparkles, Shield,
  CreditCard, ScrollText, Briefcase, ArrowLeftRight, FileBarChart,
  ChevronsUpDown, Search,
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarHeader, SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";

const capa2 = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard, badge: null },
  { title: "Mi Copropiedad", url: "/copropiedad", icon: Building2, badge: null },
  { title: "Directorio y Accesos", url: "/directorio", icon: Users, badge: null },
  { title: "Finanzas y Cartera", url: "/finanzas", icon: Wallet, badge: "12" },
  { title: "PQRS", url: "/pqrs", icon: MessageSquareWarning, badge: "3" },
  { title: "Mantenimiento", url: "/mantenimiento", icon: Wrench, badge: null },
  { title: "Asambleas", url: "/asambleas", icon: CalendarDays, badge: null },
  { title: "Zonas Comunes", url: "/zonas", icon: Trees, badge: null },
  { title: "Comunicaciones", url: "/comunicaciones", icon: Megaphone, badge: null },
];

const capa1 = [
  { title: "Panel Consolidado", url: "/org/panel", icon: FileBarChart },
  { title: "Calendario Multi", url: "/org/calendario", icon: CalendarDays },
  { title: "Equipo de Trabajo", url: "/org/equipo", icon: Briefcase },
  { title: "Reportes Cruzados", url: "/org/reportes", icon: FileBarChart },
  { title: "Transferencia Custodia", url: "/org/custodia", icon: ArrowLeftRight },
];

const capa0 = [
  { title: "Super Admin", url: "/admin/console", icon: Shield },
  { title: "Billing & Planes", url: "/admin/billing", icon: CreditCard },
  { title: "Auditoría Global", url: "/admin/auditoria", icon: ScrollText },
  { title: "IA Asistente", url: "/admin/ia", icon: Sparkles },
];

export function PropiaSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const path = useRouterState({ select: (r) => r.location.pathname });
  const isActive = (url: string) => path === url;

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border px-3 py-4">
        <div className="flex items-center gap-2.5">
          <div className="relative size-9 shrink-0 rounded-xl bg-gradient-to-br from-primary to-primary/70 grid place-items-center shadow-soft">
            <span className="text-primary-foreground font-bold text-sm tracking-tight">P</span>
            <div className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full bg-gold ring-2 ring-sidebar" />
          </div>
          {!collapsed && (
            <div className="flex flex-col leading-none">
              <span className="font-bold text-[15px] tracking-tight text-sidebar-foreground">PropIA</span>
              <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground font-medium">A&D Group</span>
            </div>
          )}
        </div>

        {!collapsed && (
          <button className="mt-4 w-full rounded-lg bg-primary-soft border border-primary/15 p-2.5 text-left hover:bg-primary-soft/70 transition-colors group">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <div className="text-[10px] font-bold uppercase tracking-wider text-primary/80">Copropiedad</div>
                <div className="text-sm font-semibold text-foreground truncate">Edificio Altavista</div>
                <div className="text-[11px] text-muted-foreground">142 unidades · Medellín</div>
              </div>
              <ChevronsUpDown className="size-4 text-primary/60 group-hover:text-primary shrink-0" />
            </div>
          </button>
        )}

        {!collapsed && (
          <div className="mt-3 relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
            <input
              placeholder="Buscar… ⌘K"
              className="w-full h-8 rounded-md bg-muted border border-border pl-8 pr-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40"
            />
          </div>
        )}
      </SidebarHeader>

      <SidebarContent className="px-1">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] tracking-[0.14em] font-bold text-muted-foreground/80">
            Capa 2 · Operación
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {capa2.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                    <Link to={item.url} className="group/item">
                      <item.icon className="size-4" />
                      {!collapsed && <span className="flex-1 truncate">{item.title}</span>}
                      {!collapsed && item.badge && (
                        <span className="ml-auto text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-destructive/10 text-destructive">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] tracking-[0.14em] font-bold text-muted-foreground/80">
            Capa 1 · Organización
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {capa1.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                    <Link to={item.url}>
                      <item.icon className="size-4" />
                      {!collapsed && <span className="truncate">{item.title}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] tracking-[0.14em] font-bold text-muted-foreground/80 flex items-center gap-1.5">
            Capa 0 · Operador
            <span className="size-1.5 rounded-full bg-gold" />
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {capa0.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                    <Link to={item.url}>
                      <item.icon className="size-4" />
                      {!collapsed && <span className="truncate">{item.title}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-3">
        {!collapsed ? (
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-full bg-gradient-to-br from-gold/80 to-gold grid place-items-center text-gold-foreground font-bold text-xs shrink-0">
              AC
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold truncate">Alex Cuartas</div>
              <div className="text-[11px] text-muted-foreground truncate">Administrador PH</div>
            </div>
            <div className="size-2 rounded-full bg-success animate-pulse" />
          </div>
        ) : (
          <div className="size-9 mx-auto rounded-full bg-gradient-to-br from-gold/80 to-gold grid place-items-center text-gold-foreground font-bold text-xs">
            AC
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
