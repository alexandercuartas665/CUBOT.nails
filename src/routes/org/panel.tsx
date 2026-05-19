import { createFileRoute } from "@tanstack/react-router";
import { FileBarChart, Building2, AlertTriangle, TrendingUp, Wallet } from "lucide-react";
import { ModulePage, Card, StatTile } from "@/components/dashboard/ModulePage";

export const Route = createFileRoute("/org/panel")({
  head: () => ({ meta: [{ title: "Panel Consolidado — PropIA" }] }),
  component: Page,
});

const copropiedades = [
  { n: "Edificio Altavista", u: 142, recaudo: 95.2, cartera: 8.4, alertas: 3, estado: "ok" },
  { n: "Conjunto Bosques de Aragón", u: 96, recaudo: 88.1, cartera: 14.2, alertas: 5, estado: "warn" },
  { n: "Torres del Parque", u: 210, recaudo: 97.8, cartera: 4.1, alertas: 1, estado: "ok" },
  { n: "Edificio Mirador", u: 64, recaudo: 79.3, cartera: 22.7, alertas: 9, estado: "danger" },
  { n: "Conjunto Sierra Verde", u: 188, recaudo: 92.4, cartera: 11.8, alertas: 4, estado: "warn" },
];

function Page() {
  return (
    <ModulePage icon={FileBarChart} eyebrow="Capa 1 · Organización" title="Panel Consolidado"
      description="Vista 360° de todas las copropiedades administradas por A&D Group.">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile label="Copropiedades" value="5" hint="700 unidades totales" tone="primary" />
        <StatTile label="Recaudo consolidado" value="$612M" hint="92.1% promedio" tone="success" />
        <StatTile label="Cartera total" value="$61.2M" hint="124 unidades morosas" tone="danger" />
        <StatTile label="Alertas activas" value="22" hint="9 críticas" tone="gold" />
      </div>

      <Card>
        <header className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h3 className="font-bold">Desempeño por copropiedad</h3>
          <span className="text-[11px] text-muted-foreground">Mayo 2026</span>
        </header>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-[11px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left px-6 py-3 font-semibold">Copropiedad</th>
                <th className="text-right px-4 py-3 font-semibold">Unidades</th>
                <th className="text-right px-4 py-3 font-semibold">Recaudo %</th>
                <th className="text-right px-4 py-3 font-semibold">Cartera $M</th>
                <th className="text-right px-4 py-3 font-semibold">Alertas</th>
                <th className="text-right px-6 py-3 font-semibold">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {copropiedades.map((c) => (
                <tr key={c.n} className="hover:bg-muted/30">
                  <td className="px-6 py-3.5 font-semibold flex items-center gap-2">
                    <div className="size-8 rounded-lg bg-primary-soft text-primary grid place-items-center"><Building2 className="size-3.5" /></div>
                    {c.n}
                  </td>
                  <td className="px-4 py-3.5 text-right tabular-nums">{c.u}</td>
                  <td className="px-4 py-3.5 text-right tabular-nums font-semibold text-success">{c.recaudo}%</td>
                  <td className="px-4 py-3.5 text-right tabular-nums">${c.cartera}</td>
                  <td className="px-4 py-3.5 text-right tabular-nums">{c.alertas}</td>
                  <td className="px-6 py-3.5 text-right">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${c.estado === "ok" ? "bg-success/10 text-success" : c.estado === "warn" ? "bg-gold/15 text-gold-foreground" : "bg-destructive/10 text-destructive"}`}>
                      {c.estado === "ok" ? "Saludable" : c.estado === "warn" ? "Atención" : "Crítico"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid grid-cols-12 gap-6">
        <Card className="col-span-12 lg:col-span-7 p-6">
          <h3 className="font-bold mb-1">Top alertas operativas</h3>
          <p className="text-xs text-muted-foreground mb-4">Asuntos cross-copropiedad que requieren atención</p>
          <ul className="space-y-3">
            {[
              { c: "Mirador", t: "Cartera vencida superó 22%", i: AlertTriangle, tone: "danger" },
              { c: "Aragón", t: "5 PQRS sin respuesta hace +48h", i: AlertTriangle, tone: "warn" },
              { c: "Altavista", t: "Mantenimiento ascensor torre B vencido", i: AlertTriangle, tone: "warn" },
              { c: "Sierra Verde", t: "Próxima asamblea: quórum 38%", i: TrendingUp, tone: "warn" },
            ].map((a, i) => (
              <li key={i} className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/30">
                <div className={`size-9 rounded-lg grid place-items-center ${a.tone === "danger" ? "bg-destructive/10 text-destructive" : "bg-gold/15 text-gold-foreground"}`}><a.i className="size-4" /></div>
                <div className="flex-1"><div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{a.c}</div><div className="font-semibold text-sm">{a.t}</div></div>
                <button className="text-xs font-semibold text-primary hover:underline">Ver →</button>
              </li>
            ))}
          </ul>
        </Card>
        <Card className="col-span-12 lg:col-span-5 p-6">
          <h3 className="font-bold mb-4">Recaudo agregado</h3>
          <div className="space-y-4">
            {copropiedades.map((c) => (
              <div key={c.n}>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold truncate">{c.n}</span>
                  <span className="tabular-nums text-muted-foreground">{c.recaudo}%</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary to-primary/60" style={{ width: `${c.recaudo}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-border flex items-center gap-2 text-sm">
            <Wallet className="size-4 text-primary" />
            <span className="text-muted-foreground">Promedio organización:</span>
            <span className="font-bold ml-auto">92.1%</span>
          </div>
        </Card>
      </div>
    </ModulePage>
  );
}
