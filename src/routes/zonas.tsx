import { createFileRoute } from "@tanstack/react-router";
import { Trees, Plus, Clock, Users, CheckCircle2 } from "lucide-react";
import { ModulePage, Card, StatTile } from "@/components/dashboard/ModulePage";

export const Route = createFileRoute("/zonas")({
  head: () => ({ meta: [{ title: "Zonas Comunes — PropIA" }] }),
  component: Page,
});

const zones = [
  { name: "Salón Social", cap: 60, today: 2, week: 5, status: "Disponible", img: "🎉" },
  { name: "BBQ Terraza", cap: 20, today: 3, week: 8, status: "Ocupado ahora", img: "🔥" },
  { name: "Gimnasio", cap: 15, today: 12, week: 78, status: "Disponible", img: "💪" },
  { name: "Piscina", cap: 30, today: 8, week: 42, status: "Disponible", img: "🏊" },
  { name: "Cancha múltiple", cap: 10, today: 1, week: 14, status: "Disponible", img: "⚽" },
  { name: "Sala de juegos", cap: 12, today: 0, week: 9, status: "En mantenimiento", img: "🎮" },
];

function Page() {
  return (
    <ModulePage icon={Trees} eyebrow="Capa 2 · Reservas" title="Zonas Comunes"
      description="Reservas, disponibilidad y reglas de uso de las zonas comunes."
      actions={<button className="h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-semibold inline-flex items-center gap-2"><Plus className="size-4" /> Nueva reserva</button>}>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile label="Reservas hoy" value="8" tone="primary" />
        <StatTile label="Esta semana" value="42" />
        <StatTile label="Ingresos por reservas" value="$3.4M" hint="Mes" tone="success" />
        <StatTile label="Zonas activas" value="6 / 7" tone="gold" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {zones.map((z, i) => {
          const occupied = z.status === "Ocupado ahora";
          const maint = z.status === "En mantenimiento";
          return (
            <Card key={i} className="p-5 hover:border-primary/40 cursor-pointer transition-colors">
              <div className="flex items-start justify-between">
                <div className="size-12 rounded-xl bg-primary-soft grid place-items-center text-2xl">{z.img}</div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${occupied ? "bg-gold/15 text-gold-foreground" : maint ? "bg-destructive/10 text-destructive" : "bg-success/10 text-success"}`}>
                  {z.status}
                </span>
              </div>
              <h3 className="font-bold mt-4">{z.name}</h3>
              <div className="text-xs text-muted-foreground inline-flex items-center gap-1 mt-1"><Users className="size-3" /> Cupo {z.cap} personas</div>
              <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-border">
                <div><div className="text-lg font-bold tabular-nums">{z.today}</div><div className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Reservas hoy</div></div>
                <div><div className="text-lg font-bold tabular-nums">{z.week}</div><div className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Esta semana</div></div>
              </div>
            </Card>
          );
        })}
      </div>

      <Card>
        <header className="px-6 py-4 border-b border-border"><h3 className="font-bold">Próximas reservas</h3></header>
        <ul className="divide-y divide-border">
          {[
            { z: "Salón Social", who: "Apto 1203", when: "10 May · 19:00 - 23:00", status: "Confirmada", paid: true },
            { z: "BBQ Terraza", who: "Apto 502", when: "11 May · 13:00 - 18:00", status: "Pendiente pago", paid: false },
            { z: "Cancha múltiple", who: "Apto 802", when: "12 May · 17:00 - 19:00", status: "Confirmada", paid: true },
          ].map((r, i) => (
            <li key={i} className="px-6 py-3 flex items-center gap-4 hover:bg-muted/30">
              <div className="size-8 rounded-lg bg-primary-soft text-primary grid place-items-center"><Clock className="size-4" /></div>
              <div className="flex-1"><div className="font-semibold text-sm">{r.z}</div><div className="text-[11px] text-muted-foreground">{r.who} · {r.when}</div></div>
              <span className={`text-[10px] font-bold px-2 py-1 rounded-md inline-flex items-center gap-1 ${r.paid ? "bg-success/10 text-success" : "bg-gold/15 text-gold-foreground"}`}>
                {r.paid && <CheckCircle2 className="size-3" />}{r.status}
              </span>
            </li>
          ))}
        </ul>
      </Card>
    </ModulePage>
  );
}
