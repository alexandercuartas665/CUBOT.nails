import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays, Plus, Filter, Building2 } from "lucide-react";
import { ModulePage, Card, StatTile } from "@/components/dashboard/ModulePage";

export const Route = createFileRoute("/org/calendario")({
  head: () => ({ meta: [{ title: "Calendario Multi — PropIA" }] }),
  component: Page,
});

const events = [
  { d: 6, m: "May", t: "Mantenimiento ascensor", c: "Altavista", color: "bg-primary" },
  { d: 8, m: "May", t: "Corte agua programado", c: "Aragón", color: "bg-gold" },
  { d: 10, m: "May", t: "Comité de convivencia", c: "Torres del Parque", color: "bg-primary" },
  { d: 12, m: "May", t: "Vencimiento póliza áreas comunes", c: "Mirador", color: "bg-destructive" },
  { d: 14, m: "May", t: "Reserva BBQ · Apto 502", c: "Altavista", color: "bg-success" },
  { d: 17, m: "May", t: "Asamblea Ordinaria 2026", c: "Altavista", color: "bg-primary" },
  { d: 19, m: "May", t: "Inspección bombas hidráulicas", c: "Sierra Verde", color: "bg-primary" },
  { d: 22, m: "May", t: "Pago nómina vigilancia", c: "Todos", color: "bg-gold" },
  { d: 25, m: "May", t: "Asamblea Extraordinaria", c: "Mirador", color: "bg-primary" },
  { d: 28, m: "May", t: "Reserva salón social", c: "Aragón", color: "bg-success" },
];

function Page() {
  const dias = Array.from({ length: 35 }, (_, i) => i - 2);
  return (
    <ModulePage icon={CalendarDays} eyebrow="Capa 1 · Agenda" title="Calendario Multi-copropiedad"
      description="Asambleas, mantenimientos, reservas y pagos en una sola vista cruzada."
      actions={<>
        <button className="h-10 px-4 rounded-lg border border-border bg-card text-sm font-semibold inline-flex items-center gap-2"><Filter className="size-4" /> Filtrar</button>
        <button className="h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-semibold inline-flex items-center gap-2"><Plus className="size-4" /> Nuevo evento</button>
      </>}>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile label="Eventos este mes" value="38" tone="primary" />
        <StatTile label="Asambleas" value="2" hint="17 y 25 May" />
        <StatTile label="Mantenimientos" value="14" tone="gold" />
        <StatTile label="Reservas zonas" value="22" tone="success" />
      </div>

      <div className="grid grid-cols-12 gap-6">
        <Card className="col-span-12 lg:col-span-8 p-6">
          <header className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-lg">Mayo 2026</h3>
            <div className="flex gap-1">
              <button className="size-8 rounded-md hover:bg-muted text-muted-foreground">‹</button>
              <button className="h-8 px-3 rounded-md bg-foreground text-background text-xs font-bold">Hoy</button>
              <button className="size-8 rounded-md hover:bg-muted text-muted-foreground">›</button>
            </div>
          </header>
          <div className="grid grid-cols-7 gap-1 text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-2">
            {["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"].map(d => <div key={d} className="text-center">{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {dias.map((d, i) => {
              const valid = d > 0 && d <= 31;
              const dayEvents = events.filter(e => e.d === d);
              const isToday = d === 5;
              return (
                <div key={i} className={`min-h-[72px] p-1.5 rounded-lg border text-xs ${valid ? "border-border bg-background hover:bg-muted/40" : "border-transparent"} ${isToday ? "ring-2 ring-primary border-primary" : ""}`}>
                  {valid && <div className={`text-[11px] font-bold mb-1 ${isToday ? "text-primary" : ""}`}>{d}</div>}
                  <div className="space-y-0.5">
                    {dayEvents.slice(0,2).map((e,j) => (
                      <div key={j} className={`${e.color} text-white text-[9px] font-semibold px-1.5 py-0.5 rounded truncate`}>{e.t}</div>
                    ))}
                    {dayEvents.length > 2 && <div className="text-[9px] text-muted-foreground">+{dayEvents.length-2}</div>}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="col-span-12 lg:col-span-4">
          <header className="px-5 py-3 border-b border-border"><h3 className="font-bold text-sm">Próximos eventos</h3></header>
          <ul className="divide-y divide-border">
            {events.slice(0,7).map((e, i) => (
              <li key={i} className="px-5 py-3 flex items-center gap-3 hover:bg-muted/30">
                <div className="text-center w-10 shrink-0">
                  <div className="text-[10px] font-bold uppercase text-muted-foreground">{e.m}</div>
                  <div className="text-lg font-bold leading-none">{e.d}</div>
                </div>
                <div className={`w-1 h-10 rounded-full ${e.color}`} />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm truncate">{e.t}</div>
                  <div className="text-[11px] text-muted-foreground flex items-center gap-1"><Building2 className="size-3" /> {e.c}</div>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </ModulePage>
  );
}
