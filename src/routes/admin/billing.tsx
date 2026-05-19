import { createFileRoute } from "@tanstack/react-router";
import { CreditCard, Download, CheckCircle2, TrendingUp, Plus } from "lucide-react";
import { ModulePage, Card, StatTile } from "@/components/dashboard/ModulePage";

export const Route = createFileRoute("/admin/billing")({
  head: () => ({ meta: [{ title: "Billing & Planes — PropIA" }] }),
  component: Page,
});

const planes = [
  { n: "Starter", p: "$89.000", per: "copropiedad/mes", f: ["Hasta 80 unidades","3 usuarios admin","WhatsApp básico","Reportes estándar"], color: "border-border" },
  { n: "Pro", p: "$169.000", per: "copropiedad/mes", f: ["Hasta 250 unidades","10 usuarios admin","WhatsApp + IA","Reportes cruzados","API contable"], color: "border-primary ring-2 ring-primary/20", popular: true },
  { n: "Enterprise", p: "Custom", per: "según volumen", f: ["Unidades ilimitadas","Usuarios ilimitados","IA avanzada + voz","Custodia digital 10y","Soporte dedicado"], color: "border-gold/40" },
];

const facturas = [
  { id: "F-2026-0428", t: "A&D Group", m: "Mayo 2026", a: 845000, e: "Pagada" },
  { id: "F-2026-0427", t: "Inmobiliaria Centro", m: "Mayo 2026", a: 2028000, e: "Pagada" },
  { id: "F-2026-0426", t: "Admon Cartagena", m: "Mayo 2026", a: 1352000, e: "Pendiente" },
  { id: "F-2026-0425", t: "PH Bogotá Norte", m: "Mayo 2026", a: 507000, e: "Pagada" },
  { id: "F-2026-0424", t: "Edificios del Eje", m: "Mayo 2026", a: 178000, e: "Vencida" },
];

function Page() {
  return (
    <ModulePage icon={CreditCard} eyebrow="Capa 0 · Comercial" title="Billing & Planes"
      description="Facturación SaaS, suscripciones y métricas de revenue de PropIA."
      actions={<button className="h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-semibold inline-flex items-center gap-2"><Plus className="size-4" /> Nuevo plan</button>}>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile label="MRR" value="$48.2M" hint="+12% MoM" tone="primary" />
        <StatTile label="ARR proyectado" value="$578M" tone="success" />
        <StatTile label="Churn (mes)" value="1.8%" hint="2 tenants" tone="gold" />
        <StatTile label="LTV / CAC" value="4.2x" tone="success" />
      </div>

      <Card>
        <header className="px-6 py-4 border-b border-border"><h3 className="font-bold">Planes activos</h3></header>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
          {planes.map(p => (
            <div key={p.n} className={`relative p-5 rounded-xl border ${p.color} bg-card`}>
              {p.popular && <span className="absolute -top-2 left-5 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-primary text-primary-foreground">Más vendido</span>}
              <div className="text-sm font-bold uppercase tracking-wider text-muted-foreground">{p.n}</div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-2xl font-bold">{p.p}</span>
                <span className="text-xs text-muted-foreground">/{p.per}</span>
              </div>
              <ul className="mt-4 space-y-2">
                {p.f.map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm"><CheckCircle2 className="size-3.5 text-success mt-0.5 shrink-0" />{f}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <header className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h3 className="font-bold">Facturas recientes</h3>
          <button className="text-xs font-semibold inline-flex items-center gap-1 text-primary hover:underline"><Download className="size-3" /> Exportar todo</button>
        </header>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-[11px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left px-6 py-3 font-semibold">Factura</th>
                <th className="text-left px-4 py-3 font-semibold">Tenant</th>
                <th className="text-left px-4 py-3 font-semibold">Período</th>
                <th className="text-right px-4 py-3 font-semibold">Monto</th>
                <th className="text-right px-6 py-3 font-semibold">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {facturas.map(f => (
                <tr key={f.id} className="hover:bg-muted/30">
                  <td className="px-6 py-3.5 font-mono text-xs font-semibold">{f.id}</td>
                  <td className="px-4 py-3.5">{f.t}</td>
                  <td className="px-4 py-3.5 text-muted-foreground">{f.m}</td>
                  <td className="px-4 py-3.5 text-right tabular-nums font-bold">${f.a.toLocaleString("es-CO")}</td>
                  <td className="px-6 py-3.5 text-right">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded ${f.e==="Pagada"?"bg-success/10 text-success":f.e==="Pendiente"?"bg-gold/15 text-gold-foreground":"bg-destructive/10 text-destructive"}`}>{f.e}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-primary to-primary/85 text-primary-foreground border-primary/20">
        <div className="flex items-center gap-3"><TrendingUp className="size-5" /><h3 className="font-bold">Crecimiento sostenido</h3></div>
        <p className="text-sm text-primary-foreground/85 mt-2">42 tenants activos · +8 nuevos en últimos 90 días · Net Revenue Retention 118%.</p>
      </Card>
    </ModulePage>
  );
}
