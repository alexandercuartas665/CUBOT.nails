import { createFileRoute } from "@tanstack/react-router";
import { Building2, Plus, ChevronRight, MapPin, Users, Wrench, Banknote } from "lucide-react";
import { ModulePage, Card, StatTile } from "@/components/dashboard/ModulePage";

export const Route = createFileRoute("/copropiedad")({
  head: () => ({ meta: [{ title: "Mi Copropiedad — PropIA" }] }),
  component: Page,
});

const sections = [
  { id: "identidad", title: "Identidad", desc: "NIT, dirección, representación legal, tipo de PH", progress: 100, items: 8 },
  { id: "distribucion", title: "Distribución", desc: "Torres, pisos, unidades privadas, coeficientes", progress: 92, items: 142 },
  { id: "equipo", title: "Equipo de trabajo", desc: "Administrador, contador, revisor, vigilancia, aseo", progress: 75, items: 12 },
  { id: "gobierno", title: "Gobierno", desc: "Consejo, comités, manual de convivencia", progress: 60, items: 6 },
  { id: "servicios", title: "Servicios contratados", desc: "Aseo, vigilancia, ascensores, jardinería", progress: 88, items: 9 },
  { id: "zonas", title: "Zonas comunes", desc: "Salón social, BBQ, gimnasio, piscina, parqueaderos", progress: 100, items: 14 },
  { id: "equipos", title: "Equipos e instalaciones", desc: "Ascensores, planta eléctrica, bombas, hidrantes", progress: 70, items: 22 },
  { id: "finanzas", title: "Finanzas (config)", desc: "Cuentas bancarias, presupuesto, conceptos de cobro", progress: 100, items: 5 },
];

function Page() {
  return (
    <ModulePage icon={Building2} eyebrow="Capa 2 · Configuración" title="Mi Copropiedad"
      description="Ficha viva de Edificio Altavista. Toda la operación se alimenta de aquí."
      actions={<>
        <button className="h-10 px-4 rounded-lg border border-border bg-card text-sm font-semibold">Exportar</button>
        <button className="h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-semibold inline-flex items-center gap-2"><Plus className="size-4" /> Nueva sección</button>
      </>}>

      <Card className="p-6 bg-gradient-to-br from-primary to-primary/85 text-primary-foreground border-primary/20 relative overflow-hidden">
        <div className="absolute -top-12 -right-12 size-48 rounded-full bg-gold/20 blur-3xl" />
        <div className="relative grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
          <div className="md:col-span-2">
            <div className="text-[10px] font-bold uppercase tracking-wider text-primary-foreground/70">Copropiedad</div>
            <h2 className="text-2xl font-bold mt-1">Edificio Altavista PH</h2>
            <div className="flex items-center gap-2 mt-2 text-sm text-primary-foreground/85"><MapPin className="size-3.5" /> Carrera 43A # 7-50, El Poblado · Medellín</div>
            <div className="text-xs text-primary-foreground/70 mt-1">NIT 900.456.789-1 · Régimen no contribuyente</div>
          </div>
          <div className="grid grid-cols-3 gap-4 md:col-span-2">
            <div><div className="text-2xl font-bold">142</div><div className="text-[10px] uppercase tracking-wider text-primary-foreground/70">Unidades</div></div>
            <div><div className="text-2xl font-bold">320</div><div className="text-[10px] uppercase tracking-wider text-primary-foreground/70">Personas</div></div>
            <div><div className="text-2xl font-bold">84%</div><div className="text-[10px] uppercase tracking-wider text-primary-foreground/70">Configurado</div></div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile label="Unidades privadas" value="142" hint="3 torres · 14 pisos" tone="primary" />
        <StatTile label="Personal activo" value="12" hint="vigilancia, aseo, admon" />
        <StatTile label="Equipos críticos" value="22" hint="3 alertas pendientes" tone="gold" />
        <StatTile label="Cuotas mensuales" value="$148M" hint="Presupuesto 2026" tone="success" />
      </div>

      <Card>
        <header className="px-6 py-4 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="font-bold">Secciones de configuración</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Cada ficha alimenta los módulos operativos</p>
          </div>
          <span className="text-[11px] font-semibold text-primary">84% completado</span>
        </header>
        <div className="divide-y divide-border">
          {sections.map((s) => (
            <button key={s.id} className="w-full px-6 py-4 flex items-center gap-5 hover:bg-muted/40 text-left">
              <div className="size-10 rounded-xl bg-muted grid place-items-center">
                {s.id === "equipo" ? <Users className="size-4" /> : s.id === "equipos" ? <Wrench className="size-4" /> : s.id === "finanzas" ? <Banknote className="size-4" /> : <Building2 className="size-4" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm">{s.title}</div>
                <div className="text-xs text-muted-foreground">{s.desc}</div>
              </div>
              <div className="hidden md:block w-32">
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${s.progress}%` }} />
                </div>
                <div className="text-[10px] text-muted-foreground mt-1 text-right">{s.progress}%</div>
              </div>
              <span className="text-xs text-muted-foreground tabular-nums">{s.items} ítems</span>
              <ChevronRight className="size-4 text-muted-foreground" />
            </button>
          ))}
        </div>
      </Card>
    </ModulePage>
  );
}
