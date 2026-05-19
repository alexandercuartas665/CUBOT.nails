import { createFileRoute } from "@tanstack/react-router";
import { Briefcase, Plus, Mail, Phone, Building2 } from "lucide-react";
import { ModulePage, Card, StatTile } from "@/components/dashboard/ModulePage";

export const Route = createFileRoute("/org/equipo")({
  head: () => ({ meta: [{ title: "Equipo de Trabajo — PropIA" }] }),
  component: Page,
});

const team = [
  { n: "Alex Cuartas", r: "Admin PH Senior", c: ["Altavista","Mirador"], cargo: 142, color: "from-primary to-primary/70" },
  { n: "María Restrepo", r: "Admin PH", c: ["Aragón"], cargo: 96, color: "from-gold/80 to-gold" },
  { n: "Diego Vélez", r: "Admin PH", c: ["Torres del Parque","Sierra Verde"], cargo: 398, color: "from-primary to-primary/70" },
  { n: "Laura Gómez", r: "Contadora", c: ["Todas"], cargo: 700, color: "from-success/80 to-success" },
  { n: "Carlos Mejía", r: "Coord. Mantenimiento", c: ["Todas"], cargo: 700, color: "from-gold/80 to-gold" },
  { n: "Sandra Ortiz", r: "Asistente PQRS", c: ["Altavista","Aragón","Mirador"], cargo: 302, color: "from-primary to-primary/70" },
];

function Page() {
  return (
    <ModulePage icon={Briefcase} eyebrow="Capa 1 · Talento" title="Equipo de Trabajo"
      description="Administradores, contadores y operativos asignados a las copropiedades A&D Group."
      actions={<button className="h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-semibold inline-flex items-center gap-2"><Plus className="size-4" /> Nuevo miembro</button>}>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile label="Miembros activos" value="14" tone="primary" />
        <StatTile label="Administradores" value="3" />
        <StatTile label="Operativos" value="9" tone="gold" />
        <StatTile label="Carga promedio" value="100 ud" hint="por admin" tone="success" />
      </div>

      <Card>
        <header className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h3 className="font-bold">Directorio interno</h3>
          <div className="flex gap-1">
            {["Todos","Admins","Operativos","Externos"].map((t,i) => (
              <button key={t} className={`h-8 px-3 rounded-md text-xs font-semibold ${i===0?"bg-foreground text-background":"hover:bg-muted text-muted-foreground"}`}>{t}</button>
            ))}
          </div>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-6">
          {team.map((m) => (
            <div key={m.n} className="p-4 rounded-xl border border-border hover:shadow-soft transition">
              <div className="flex items-center gap-3 mb-3">
                <div className={`size-12 rounded-full bg-gradient-to-br ${m.color} grid place-items-center text-white font-bold text-sm`}>
                  {m.n.split(" ").map(w=>w[0]).slice(0,2).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm truncate">{m.n}</div>
                  <div className="text-[11px] text-muted-foreground">{m.r}</div>
                </div>
                <div className="size-2 rounded-full bg-success" />
              </div>
              <div className="text-[11px] text-muted-foreground mb-2 flex items-center gap-1.5"><Building2 className="size-3" /> {m.c.join(" · ")}</div>
              <div className="flex items-center justify-between pt-3 border-t border-border">
                <span className="text-[10px] font-bold uppercase text-muted-foreground">Carga: {m.cargo} ud</span>
                <div className="flex gap-1">
                  <button className="size-7 rounded-md hover:bg-muted grid place-items-center text-muted-foreground"><Mail className="size-3.5" /></button>
                  <button className="size-7 rounded-md hover:bg-muted grid place-items-center text-muted-foreground"><Phone className="size-3.5" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </ModulePage>
  );
}
