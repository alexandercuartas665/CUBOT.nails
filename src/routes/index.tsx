import { createFileRoute } from "@tanstack/react-router";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { RecaudoChart } from "@/components/dashboard/RecaudoChart";
import { CarteraDonut } from "@/components/dashboard/CarteraDonut";
import {
  Wallet, MessageSquareWarning, ListChecks, CalendarClock,
  Sparkles, ArrowUpRight, MessageCircle, AlertTriangle,
  CheckCircle2, Clock, Wrench, FileText, Building2, Users,
  TreePine, ShieldCheck, ChevronRight, Plus, Zap,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PropIA — Dashboard Operativo" },
      { name: "description", content: "Vista todo-en-uno: cartera, PQRS, mantenimiento, asambleas, IA y WhatsApp en un solo lugar." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto space-y-6">
      {/* Greeting */}
      <section className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary">Martes · 5 de Mayo, 2026</span>
            <span className="size-1 rounded-full bg-muted-foreground/40" />
            <span className="text-[11px] font-medium text-muted-foreground">Semana 19</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight mt-1">
            Buenos días, <span className="text-primary">Alex</span>.
          </h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-xl">
            Hoy tienes <strong className="text-foreground">8 pendientes</strong>, <strong className="text-destructive">3 PQRS vencidas</strong> y la asamblea ordinaria a 12 días. Aquí está tu panorama.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="h-10 px-4 rounded-lg border border-border bg-card hover:bg-muted text-sm font-semibold inline-flex items-center gap-2">
            <FileText className="size-4" /> Generar informe
          </button>
          <button className="h-10 px-4 rounded-lg bg-foreground text-background hover:bg-foreground/90 text-sm font-semibold inline-flex items-center gap-2 shadow-soft">
            <Plus className="size-4" /> Nueva tarea
          </button>
        </div>
      </section>

      {/* KPIs */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Cartera del mes" value="$142.8M" hint="Meta: $150M (95.2%)"
          icon={Wallet} tone="primary" delta={{ value: "12.4%", positive: true }} />
        <KpiCard label="PQRS abiertas" value="12" hint="3 vencidas · 5 hoy"
          icon={MessageSquareWarning} tone="danger" delta={{ value: "8%", positive: false }} />
        <KpiCard label="Tareas del día" value="8" hint="2 críticas · 4 en curso"
          icon={ListChecks} tone="default" />
        <KpiCard label="Próxima asamblea" value="12 días" hint="Ordinaria · 17 May"
          icon={CalendarClock} tone="gold" />
      </section>

      {/* Main grid */}
      <section className="grid grid-cols-12 gap-6">
        {/* Recaudo chart */}
        <div className="col-span-12 lg:col-span-8 rounded-2xl border border-border bg-card p-6 shadow-soft">
          <header className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-base tracking-tight">Recaudo vs Facturado</h2>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary-soft text-primary">Tiempo real</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Últimos 7 meses · Edificio Altavista</p>
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-primary-soft border border-primary/20" /> Facturado</span>
              <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-primary" /> Recaudado</span>
              <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-gold" /> Mes actual</span>
            </div>
          </header>
          <RecaudoChart />
        </div>

        {/* Cartera donut */}
        <div className="col-span-12 lg:col-span-4 rounded-2xl border border-border bg-card p-6 shadow-soft">
          <header className="mb-5">
            <h2 className="font-bold text-base tracking-tight">Estado de cartera</h2>
            <p className="text-xs text-muted-foreground mt-1">142 unidades privadas</p>
          </header>
          <CarteraDonut />
          <button className="mt-5 w-full h-9 rounded-lg border border-border hover:bg-muted text-xs font-semibold inline-flex items-center justify-center gap-1.5">
            Gestionar cartera <ArrowUpRight className="size-3.5" />
          </button>
        </div>

        {/* Tareas del día */}
        <div className="col-span-12 lg:col-span-5 rounded-2xl border border-border bg-card shadow-soft overflow-hidden">
          <header className="px-6 pt-5 pb-3 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-base tracking-tight">Tareas del día</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Asignadas a ti · 5 May</p>
            </div>
            <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-muted">8</span>
          </header>
          <ul className="divide-y divide-border">
            {[
              { icon: AlertTriangle, tone: "destructive", title: "Aprobar 4 pagos pendientes", meta: "Vence hoy · $8.2M", time: "10:30" },
              { icon: MessageSquareWarning, tone: "warning", title: "Responder PQRS #421 — Ruido nocturno", meta: "Apto 502 · 2 días vencida", time: "11:00" },
              { icon: Wrench, tone: "primary", title: "Visita técnica ascensor torre B", meta: "Otis Ltda. · Confirmado", time: "14:00" },
              { icon: FileText, tone: "muted", title: "Revisar contrato aseo (renovación)", meta: "Aseototal SAS · Vence 15 May", time: "16:00" },
              { icon: CheckCircle2, tone: "success", title: "Cerrar caso #408 — Filtración", meta: "Validado por residente", time: "Hecho" },
            ].map((t, i) => {
              const toneMap: Record<string, string> = {
                destructive: "bg-destructive/10 text-destructive",
                warning: "bg-gold/15 text-gold-foreground",
                primary: "bg-primary-soft text-primary",
                muted: "bg-muted text-muted-foreground",
                success: "bg-success/15 text-success",
              };
              return (
                <li key={i} className="flex items-start gap-3 px-6 py-3.5 hover:bg-muted/40 transition-colors group cursor-pointer">
                  <div className={`size-8 rounded-lg grid place-items-center shrink-0 ${toneMap[t.tone]}`}>
                    <t.icon className="size-4" strokeWidth={2.2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-foreground truncate">{t.title}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{t.meta}</div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Clock className="size-3 text-muted-foreground" />
                    <span className="text-[11px] text-muted-foreground tabular-nums font-medium">{t.time}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* IA Asistente Panel */}
        <div className="col-span-12 lg:col-span-4 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary to-primary/85 text-primary-foreground p-6 shadow-elevated relative overflow-hidden">
          <div className="absolute -top-12 -right-12 size-48 rounded-full bg-gold/20 blur-3xl" />
          <div className="absolute bottom-0 right-0 size-32 rounded-full bg-primary-foreground/5 blur-2xl" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-1">
              <div className="size-7 rounded-lg bg-gold grid place-items-center">
                <Sparkles className="size-4 text-gold-foreground" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary-foreground/80">IA Asistente · Capa 0</span>
            </div>
            <h3 className="font-bold text-lg tracking-tight mt-3">3 alertas inteligentes detectadas</h3>
            <p className="text-sm text-primary-foreground/80 mt-1">Patrones de comportamiento en tu copropiedad esta semana.</p>

            <ul className="mt-5 space-y-3">
              <li className="rounded-xl bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/15 p-3">
                <div className="flex items-start gap-2">
                  <Zap className="size-4 text-gold shrink-0 mt-0.5" />
                  <div>
                    <div className="text-[13px] font-semibold leading-snug">Recaudo bajará 8% este mes</div>
                    <div className="text-[11px] text-primary-foreground/70 mt-0.5">Basado en patrones de pago de los últimos 6 meses.</div>
                  </div>
                </div>
              </li>
              <li className="rounded-xl bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/15 p-3">
                <div className="flex items-start gap-2">
                  <Zap className="size-4 text-gold shrink-0 mt-0.5" />
                  <div>
                    <div className="text-[13px] font-semibold leading-snug">Pico de PQRS por ruido los viernes</div>
                    <div className="text-[11px] text-primary-foreground/70 mt-0.5">Sugerencia: comunicado preventivo en cartelera.</div>
                  </div>
                </div>
              </li>
            </ul>
            <button className="mt-5 w-full h-10 rounded-lg bg-primary-foreground text-primary hover:bg-primary-foreground/95 text-sm font-bold inline-flex items-center justify-center gap-2">
              Hablar con la IA <ArrowUpRight className="size-4" />
            </button>
          </div>
        </div>

        {/* WhatsApp Inbox */}
        <div className="col-span-12 lg:col-span-3 rounded-2xl border border-border bg-card p-5 shadow-soft flex flex-col">
          <header className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="size-7 rounded-lg bg-success/15 grid place-items-center">
                <MessageCircle className="size-4 text-success" />
              </div>
              <h3 className="font-bold text-sm">WhatsApp</h3>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-destructive/10 text-destructive">7</span>
          </header>
          <ul className="space-y-3 flex-1">
            {[
              { name: "María Gómez · 401", msg: "Necesito factura de mayo", time: "9:42" },
              { name: "Juan Restrepo · 1203", msg: "El portón sigue dañado", time: "9:15" },
              { name: "Asoc. Residentes", msg: "Acta lista para revisar", time: "Ayer" },
            ].map((m, i) => (
              <li key={i} className="flex items-start gap-2.5 cursor-pointer hover:bg-muted/40 -mx-2 px-2 py-2 rounded-lg">
                <div className="size-8 rounded-full bg-gradient-to-br from-primary to-primary/60 grid place-items-center text-primary-foreground text-[10px] font-bold shrink-0">
                  {m.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-xs font-semibold truncate">{m.name}</div>
                    <span className="text-[10px] text-muted-foreground shrink-0">{m.time}</span>
                  </div>
                  <div className="text-[11px] text-muted-foreground truncate mt-0.5">{m.msg}</div>
                </div>
              </li>
            ))}
          </ul>
          <button className="mt-3 text-[11px] font-semibold text-primary hover:underline inline-flex items-center gap-1 self-start">
            Abrir bandeja <ChevronRight className="size-3" />
          </button>
        </div>

        {/* Quick access modules */}
        <div className="col-span-12 rounded-2xl border border-border bg-card p-6 shadow-soft">
          <header className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-bold text-base tracking-tight">Módulos del sistema</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Acceso rápido a toda la operación de PropIA</p>
            </div>
            <button className="text-xs font-semibold text-primary hover:underline">Ver todo</button>
          </header>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { icon: Building2, title: "Mi Copropiedad", meta: "142 unidades", tone: "primary" },
              { icon: Users, title: "Directorio", meta: "320 personas", tone: "primary" },
              { icon: Wallet, title: "Finanzas", meta: "12 pendientes", tone: "gold" },
              { icon: MessageSquareWarning, title: "PQRS", meta: "12 abiertas", tone: "destructive" },
              { icon: Wrench, title: "Mantenimiento", meta: "4 en curso", tone: "primary" },
              { icon: CalendarClock, title: "Asambleas", meta: "1 próxima", tone: "gold" },
              { icon: TreePine, title: "Zonas Comunes", meta: "8 reservas hoy", tone: "primary" },
              { icon: FileText, title: "Reportes", meta: "5 plantillas", tone: "muted" },
              { icon: ShieldCheck, title: "Auditoría", meta: "Sin alertas", tone: "primary" },
              { icon: Building2, title: "Multi-PH", meta: "4 copropiedades", tone: "muted" },
              { icon: Users, title: "Equipo", meta: "8 miembros", tone: "muted" },
              { icon: Sparkles, title: "Centro IA", meta: "Activo", tone: "gold" },
            ].map((m, i) => {
              const tones: Record<string, string> = {
                primary: "bg-primary-soft text-primary",
                gold: "bg-gold/15 text-gold-foreground",
                destructive: "bg-destructive/10 text-destructive",
                muted: "bg-muted text-muted-foreground",
              };
              return (
                <button key={i} className="group text-left rounded-xl border border-border p-3.5 hover:border-primary/40 hover:bg-primary-soft/30 transition-all">
                  <div className={`size-9 rounded-lg grid place-items-center mb-3 ${tones[m.tone]}`}>
                    <m.icon className="size-4.5" strokeWidth={2.2} />
                  </div>
                  <div className="text-sm font-bold tracking-tight">{m.title}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">{m.meta}</div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <footer className="text-center text-[11px] text-muted-foreground pt-2 pb-4">
        PropIA v1.3 · A&D Group SAS · La información pertenece a la copropiedad
      </footer>
    </div>
  );
}
