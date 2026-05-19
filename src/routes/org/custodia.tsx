import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeftRight, CheckCircle2, Clock, FileCheck, Building2, Plus } from "lucide-react";
import { ModulePage, Card, StatTile } from "@/components/dashboard/ModulePage";

export const Route = createFileRoute("/org/custodia")({
  head: () => ({ meta: [{ title: "Transferencia de Custodia — PropIA" }] }),
  component: Page,
});

const checklist = [
  { t: "Inventario físico de equipos y herramientas", done: true },
  { t: "Conciliación bancaria a la fecha", done: true },
  { t: "Estados de cartera firmados", done: true },
  { t: "Entrega de archivo físico y digital", done: true },
  { t: "Acta de empalme firmada por consejo", done: false },
  { t: "Transferencia de claves y accesos digitales", done: false },
  { t: "Notificación a entidades (banco, DIAN, proveedores)", done: false },
  { t: "Devolución de pólizas de manejo", done: false },
];

function Page() {
  const completed = checklist.filter(c=>c.done).length;
  const pct = Math.round(completed/checklist.length*100);
  return (
    <ModulePage icon={ArrowLeftRight} eyebrow="Capa 1 · Continuidad" title="Transferencia de Custodia"
      description="Proceso seguro y trazable de empalme entre administradoras. Toda la información viaja con la copropiedad."
      actions={<button className="h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-semibold inline-flex items-center gap-2"><Plus className="size-4" /> Iniciar empalme</button>}>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile label="Empalmes activos" value="2" tone="primary" />
        <StatTile label="Completados (año)" value="3" tone="success" />
        <StatTile label="Tiempo promedio" value="14 días" tone="gold" />
        <StatTile label="Documentos custodiados" value="1,248" />
      </div>

      <div className="grid grid-cols-12 gap-6">
        <Card className="col-span-12 lg:col-span-7 p-6">
          <header className="flex items-start justify-between mb-5">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-primary">En curso</div>
              <h3 className="font-bold text-lg mt-0.5">Edificio Mirador</h3>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5"><Building2 className="size-3" /> Empalme entrante desde Administradora XYZ · Inicio 21 Abr</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary tabular-nums">{pct}%</div>
              <div className="text-[10px] uppercase text-muted-foreground">Avance</div>
            </div>
          </header>
          <div className="h-2 rounded-full bg-muted overflow-hidden mb-6">
            <div className="h-full bg-gradient-to-r from-primary to-primary/60" style={{ width: `${pct}%` }} />
          </div>
          <ul className="space-y-2">
            {checklist.map((c, i) => (
              <li key={i} className={`flex items-center gap-3 p-3 rounded-lg border ${c.done ? "border-success/30 bg-success/5" : "border-border"}`}>
                <div className={`size-7 rounded-lg grid place-items-center ${c.done ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground"}`}>
                  {c.done ? <CheckCircle2 className="size-4" /> : <Clock className="size-3.5" />}
                </div>
                <span className={`flex-1 text-sm ${c.done ? "line-through text-muted-foreground" : "font-medium"}`}>{c.t}</span>
                {!c.done && <button className="text-[11px] font-semibold text-primary hover:underline">Marcar</button>}
              </li>
            ))}
          </ul>
        </Card>

        <div className="col-span-12 lg:col-span-5 space-y-4">
          <Card className="p-5">
            <h3 className="font-bold text-sm mb-4">Empalmes históricos</h3>
            <ul className="space-y-3">
              {[
                {n:"Torres del Parque", d:"Completado 12 Mar 2026", t:"12 días"},
                {n:"Sierra Verde", d:"Completado 08 Ene 2026", t:"18 días"},
                {n:"Conjunto Aragón", d:"Completado 22 Oct 2025", t:"15 días"},
              ].map((e,i) => (
                <li key={i} className="flex items-center gap-3 p-3 rounded-lg border border-border">
                  <div className="size-9 rounded-lg bg-success/10 text-success grid place-items-center"><FileCheck className="size-4" /></div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm truncate">{e.n}</div>
                    <div className="text-[11px] text-muted-foreground">{e.d}</div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-1 rounded bg-success/10 text-success">{e.t}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-5 bg-gradient-to-br from-gold/10 to-gold/5 border-gold/30">
            <div className="text-[10px] font-bold uppercase tracking-wider text-gold-foreground">Compromiso PropIA</div>
            <h3 className="font-bold text-sm mt-1">Custodia digital permanente</h3>
            <p className="text-xs text-muted-foreground mt-2">Toda la información histórica se conserva cifrada por 10 años, accesible para el siguiente administrador con autorización del consejo.</p>
          </Card>
        </div>
      </div>
    </ModulePage>
  );
}
