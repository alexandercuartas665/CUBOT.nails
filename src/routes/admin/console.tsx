import { createFileRoute } from "@tanstack/react-router";
import { Shield, Building2, Users, Activity, AlertTriangle, Database } from "lucide-react";
import { ModulePage, Card, StatTile } from "@/components/dashboard/ModulePage";

export const Route = createFileRoute("/admin/console")({
  head: () => ({ meta: [{ title: "Super Admin — PropIA" }] }),
  component: Page,
});

const tenants = [
  { n: "A&D Group", c: 5, u: 700, plan: "Enterprise", estado: "ok", uso: 78 },
  { n: "Inmobiliaria Centro", c: 12, u: 1840, plan: "Enterprise", estado: "ok", uso: 92 },
  { n: "PH Bogotá Norte", c: 3, u: 412, plan: "Pro", estado: "ok", uso: 64 },
  { n: "Admon Cartagena", c: 8, u: 980, plan: "Pro", estado: "warn", uso: 95 },
  { n: "Edificios del Eje", c: 2, u: 188, plan: "Starter", estado: "ok", uso: 32 },
];

function Page() {
  return (
    <ModulePage icon={Shield} eyebrow="Capa 0 · Operador" title="Super Admin Console"
      description="Control multi-tenant de toda la plataforma PropIA.">

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile label="Tenants activos" value="42" hint="+3 este mes" tone="primary" />
        <StatTile label="Copropiedades" value="248" tone="success" />
        <StatTile label="Unidades totales" value="34,820" />
        <StatTile label="Usuarios activos" value="8,142" tone="gold" />
      </div>

      <div className="grid grid-cols-12 gap-6">
        <Card className="col-span-12 lg:col-span-8">
          <header className="px-6 py-4 border-b border-border flex items-center justify-between">
            <h3 className="font-bold">Tenants destacados</h3>
            <button className="text-xs font-semibold text-primary hover:underline">Ver todos →</button>
          </header>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-[11px] uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="text-left px-6 py-3 font-semibold">Tenant</th>
                  <th className="text-right px-4 py-3 font-semibold">Coprops</th>
                  <th className="text-right px-4 py-3 font-semibold">Unidades</th>
                  <th className="text-left px-4 py-3 font-semibold">Plan</th>
                  <th className="text-right px-4 py-3 font-semibold">Uso</th>
                  <th className="text-right px-6 py-3 font-semibold">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {tenants.map(t => (
                  <tr key={t.n} className="hover:bg-muted/30">
                    <td className="px-6 py-3.5 font-semibold flex items-center gap-2"><Building2 className="size-3.5 text-muted-foreground" />{t.n}</td>
                    <td className="px-4 py-3.5 text-right tabular-nums">{t.c}</td>
                    <td className="px-4 py-3.5 text-right tabular-nums">{t.u.toLocaleString()}</td>
                    <td className="px-4 py-3.5"><span className={`text-[10px] font-bold px-2 py-1 rounded ${t.plan==="Enterprise"?"bg-primary text-primary-foreground":t.plan==="Pro"?"bg-primary-soft text-primary":"bg-muted text-muted-foreground"}`}>{t.plan}</span></td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="inline-flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
                          <div className={`h-full ${t.uso>90?"bg-destructive":t.uso>70?"bg-gold":"bg-success"}`} style={{width:`${t.uso}%`}} />
                        </div>
                        <span className="text-xs tabular-nums text-muted-foreground w-8 text-right">{t.uso}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded ${t.estado==="ok"?"bg-success/10 text-success":"bg-gold/15 text-gold-foreground"}`}>{t.estado==="ok"?"OK":"Atención"}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="col-span-12 lg:col-span-4 space-y-4">
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-3"><Activity className="size-4 text-success" /><h3 className="font-bold text-sm">Salud de plataforma</h3></div>
            <div className="space-y-3">
              {[{n:"API Gateway",v:"99.98%",ok:true},{n:"Base de datos",v:"99.99%",ok:true},{n:"Storage",v:"100%",ok:true},{n:"WhatsApp Bridge",v:"98.4%",ok:false}].map((s,i)=>(
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2"><span className={`size-2 rounded-full ${s.ok?"bg-success animate-pulse":"bg-gold"}`} />{s.n}</span>
                  <span className="font-bold tabular-nums text-xs">{s.v}</span>
                </div>
              ))}
            </div>
          </Card>
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-3"><AlertTriangle className="size-4 text-gold-foreground" /><h3 className="font-bold text-sm">Incidentes recientes</h3></div>
            <ul className="space-y-2 text-xs">
              <li className="p-2.5 rounded-lg bg-muted/50"><div className="font-semibold">WhatsApp Bridge: latencia alta</div><div className="text-muted-foreground mt-0.5">Hace 2h · Mitigado</div></li>
              <li className="p-2.5 rounded-lg bg-muted/50"><div className="font-semibold">Job de cartera reintentos</div><div className="text-muted-foreground mt-0.5">Ayer · Resuelto</div></li>
            </ul>
          </Card>
          <Card className="p-5 bg-foreground text-background">
            <Database className="size-5 mb-3" />
            <div className="text-[10px] font-bold uppercase tracking-wider opacity-60">Almacenamiento</div>
            <div className="text-2xl font-bold mt-1">2.4 TB <span className="text-sm font-normal opacity-60">/ 5 TB</span></div>
            <div className="h-1.5 mt-3 rounded-full bg-background/15 overflow-hidden"><div className="h-full bg-gold w-[48%]" /></div>
          </Card>
        </div>
      </div>
    </ModulePage>
  );
}
