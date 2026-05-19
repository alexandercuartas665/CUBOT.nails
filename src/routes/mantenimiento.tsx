import { createFileRoute } from "@tanstack/react-router";
import { Wrench, Plus, Calendar, MapPin, User } from "lucide-react";
import { ModulePage, Card, StatTile } from "@/components/dashboard/ModulePage";

export const Route = createFileRoute("/mantenimiento")({
  head: () => ({ meta: [{ title: "Mantenimiento — PropIA" }] }),
  component: Page,
});

const cols = [
  { title: "Por programar", count: 4, items: [
    { t: "Mantenimiento bomba presión", e: "Sistema hidráulico", who: "Hidromec SAS", w: "Esta semana" },
    { t: "Limpieza tanque agua potable", e: "Cuarto técnico", who: "Aseototal SAS", w: "15 May" },
  ]},
  { title: "Programadas", count: 3, items: [
    { t: "Visita técnica ascensor torre B", e: "Ascensor B", who: "Otis Ltda", w: "Hoy 14:00" },
    { t: "Revisión sistema contraincendio", e: "Hidrantes", who: "Securisa", w: "8 May 09:00" },
  ]},
  { title: "En ejecución", count: 2, items: [
    { t: "Pintura fachada torre A", e: "Fachada exterior", who: "Pinturas El Prado", w: "Día 3 de 12" },
  ]},
  { title: "Completadas (mes)", count: 18, items: [
    { t: "Cambio luminarias parqueadero", e: "Sótano 1-2", who: "Eléctricos JR", w: "Cerrada 2 May" },
  ]},
];

function Page() {
  return (
    <ModulePage icon={Wrench} eyebrow="Capa 2 · Operación de equipos" title="Mantenimiento"
      description="Calendario preventivo y correctivo de equipos, instalaciones y zonas comunes."
      actions={<button className="h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-semibold inline-flex items-center gap-2"><Plus className="size-4" /> Nueva orden</button>}>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile label="Equipos críticos" value="22" hint="3 alertas" tone="primary" />
        <StatTile label="Próximos 7 días" value="6" tone="gold" />
        <StatTile label="En ejecución" value="2" tone="success" />
        <StatTile label="Completadas mes" value="18" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {cols.map((c, i) => (
          <Card key={i} className="p-4 bg-muted/30">
            <header className="flex items-center justify-between mb-3 px-1">
              <h3 className="font-bold text-sm">{c.title}</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-card border border-border">{c.count}</span>
            </header>
            <div className="space-y-2">
              {c.items.map((it, j) => (
                <div key={j} className="rounded-xl bg-card border border-border p-3 hover:border-primary/40 cursor-pointer shadow-soft">
                  <div className="font-semibold text-sm leading-snug">{it.t}</div>
                  <div className="text-[11px] text-muted-foreground mt-2 flex items-center gap-1.5"><MapPin className="size-3" />{it.e}</div>
                  <div className="text-[11px] text-muted-foreground flex items-center gap-1.5"><User className="size-3" />{it.who}</div>
                  <div className="text-[11px] mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-primary-soft text-primary font-semibold"><Calendar className="size-3" />{it.w}</div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </ModulePage>
  );
}
