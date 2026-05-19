import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { PropiaSidebar } from "@/components/PropiaSidebar";
import { Bell, HelpCircle, Sparkles } from "lucide-react";
import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Página no encontrada</h2>
        <p className="mt-2 text-sm text-muted-foreground">El módulo que buscas no existe.</p>
        <div className="mt-6">
          <Link to="/" className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            Ir al Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "PropIA — Dashboard de Administración PH" },
      { name: "description", content: "Plataforma SaaS de administración de Propiedad Horizontal con IA. Gestión integral de copropiedades." },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <PropiaSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 border-b border-border bg-card/60 backdrop-blur-sm flex items-center justify-between px-4 sticky top-0 z-30">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <div className="h-5 w-px bg-border" />
              <nav className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Edificio Altavista</span>
                <span className="text-muted-foreground/40">/</span>
                <span className="font-semibold text-foreground">Dashboard</span>
              </nav>
            </div>
            <div className="flex items-center gap-2">
              <button className="hidden md:inline-flex items-center gap-2 h-9 px-3 rounded-lg border border-border bg-background hover:bg-muted text-xs font-medium">
                <Sparkles className="size-3.5 text-gold" />
                Preguntar a la IA
                <kbd className="ml-1 px-1.5 py-0.5 rounded bg-muted text-[10px] text-muted-foreground border border-border">⌘K</kbd>
              </button>
              <button className="size-9 rounded-lg border border-border bg-background hover:bg-muted grid place-items-center relative">
                <Bell className="size-4" />
                <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-destructive ring-2 ring-card" />
              </button>
              <button className="size-9 rounded-lg border border-border bg-background hover:bg-muted grid place-items-center">
                <HelpCircle className="size-4" />
              </button>
            </div>
          </header>
          <main className="flex-1 min-w-0">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
