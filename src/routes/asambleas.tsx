import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays, Plus, Users, FileCheck, Vote, Video } from "lucide-react";
import { ModulePage, Card, StatTile } from "@/components/dashboard/ModulePage";

export const Route = createFileRoute("/asambleas")({
  head: () => ({ meta: [{ title: "Asambleas — PropIA" }] }),
  component: Page,
});

function Page() {
  return (
    <ModulePage icon={CalendarDays} eyebrow="Capa 2 · Gobierno" title="Asambleas"
      description="Convocatorias, quórum, votaciones y actas. Soporta modalidad presencial, virtual o mixta."
      actions={<button className="h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-semibold inline-flex items-center gap-2"><Plus className="size-4" /> Nueva convocatoria</button>}>

      <Card className="p-6 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground border-primary/20 relative overflow-hidden">
        <div className="absolute -top-12 -right-12 size-48 rounded-full bg-gold/20 blur-3xl" />
        <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          <div className="lg:col-span-2">
            <div className="text-[10px] font-bold uppercase tracking-wider text-primary-foreground/70">Próxima asamblea</div>
            <h2 className="text-2xl font-bold mt-1">Asamblea Ordinaria 2026</h2>
            <p className="text-sm text-primary-foreground/85 mt-1">Aprobación presupuesto, elección consejo, informe de gestión.</p>
            <div className="flex flex-wrap items-center gap-3 mt-4 text-sm">
              <span className="inline-flex items-center gap-1.5"><CalendarDays className="size-4" /> 17 Mayo · 7:00 PM</span>
              <span className="inline-flex items-center gap-1.5"><Video className="size-4" /> Mixta · Salón social + Zoom</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-primary-foreground/10 backdrop-blur p-3 text-center"><div className="text-2xl font-bold">12</div><div className="text-[10px] uppercase text-primary-foreground/70">Días</div></div>
            <div className="rounded-xl bg-primary-foreground/10 backdrop-blur p-3 text-center"><div className="text-2xl font-bold">87</div><div className="text-[10px] uppercase text-primary-foreground/70">Confirmados</div></div>
            <div className="rounded-xl bg-primary-foreground/10 backdrop-blur p-3 text-center"><div className="text-2xl font-bold">61%</div><div className="text-[10px] uppercase text-primary-foreground/70">Quórum est.</div></div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-12 gap-6">
        <Card className="col-span-12 lg:col-span-7">
          <header className="px-6 py-4 border-b border-border"><h3 className="font-bold">Orden del día</h3></header>
          <ol className="divide-y divide-border">
            {[
              { t: "Verificación de quórum", time: "10 min", icon: Users },
              { t: "Lectura y aprobación acta anterior", time: "15 min", icon: FileCheck },
              { t: "Informe de gestión 2025 — Administración", time: "30 min", icon: FileCheck },
              { t: "Aprobación estados financieros 2025", time: "20 min", icon: Vote },
              { t: "Aprobación presupuesto 2026", time: "30 min", icon: Vote },
              { t: "Elección Consejo de Administración", time: "25 min", icon: Vote },
              { t: "Proposiciones y varios", time: "20 min", icon: Users },
            ].map((p, i) => (
              <li key={i} className="px-6 py-3 flex items-center gap-3">
                <div className="size-8 rounded-lg bg-primary-soft text-primary grid place-items-center text-xs font-bold">{i + 1}</div>
                <p.icon className="size-4 text-muted-foreground" />
                <div className="flex-1 font-medium text-sm">{p.t}</div>
                <span className="text-[11px] text-muted-foreground">{p.time}</span>
              </li>
            ))}
          </ol>
        </Card>

        <div className="col-span-12 lg:col-span-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <StatTile label="Convocados" value="142" tone="primary" />
            <StatTile label="Confirmados" value="87" tone="success" />
            <StatTile label="Poderes recibidos" value="14" tone="gold" />
            <StatTile label="Coef. confirmado" value="58.2%" />
          </div>
          <Card>
            <header className="px-5 py-3 border-b border-border"><h3 className="font-bold text-sm">Asambleas pasadas</h3></header>
            <ul className="divide-y divide-border text-sm">
              {[{n:"Extraordinaria · Reformas", d:"22 Nov 2025", q:"68%"},{n:"Ordinaria 2025", d:"19 Mar 2025", q:"72%"},{n:"Extraordinaria · Cuota", d:"08 Ago 2024", q:"55%"}].map((a,i)=>(
                <li key={i} className="px-5 py-3 flex items-center justify-between hover:bg-muted/30">
                  <div><div className="font-semibold text-sm">{a.n}</div><div className="text-[11px] text-muted-foreground">{a.d}</div></div>
                  <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-success/10 text-success">Quórum {a.q}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </ModulePage>
  );
}
