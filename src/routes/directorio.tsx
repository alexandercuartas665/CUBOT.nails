import { createFileRoute } from "@tanstack/react-router";
import { Users, Plus, Search, MessageCircle, Phone, Mail, MoreVertical } from "lucide-react";
import { ModulePage, Card, StatTile } from "@/components/dashboard/ModulePage";

export const Route = createFileRoute("/directorio")({
  head: () => ({ meta: [{ title: "Directorio y Accesos — PropIA" }] }),
  component: Page,
});

const people = [
  { name: "María Gómez Restrepo", role: "Propietaria", unit: "Apto 401", access: "Residente", status: "Al día", phone: "+57 300 123 4567", color: "from-primary to-primary/70" },
  { name: "Juan Restrepo López", role: "Residente", unit: "Apto 1203", access: "Residente", status: "Mora 1-30", phone: "+57 311 555 0102", color: "from-gold to-gold/70" },
  { name: "Carlos Aseototal SAS", role: "Proveedor · Aseo", unit: "—", access: "Proveedor", status: "Vigente", phone: "+57 604 222 3344", color: "from-primary/80 to-primary/50" },
  { name: "Andrea Velásquez", role: "Administradora", unit: "—", access: "Admin PH", status: "Activa", phone: "+57 312 444 9988", color: "from-success to-success/60" },
  { name: "Pedro Vigilancia 24/7", role: "Proveedor · Vigilancia", unit: "—", access: "Proveedor", status: "Vigente", phone: "+57 604 888 1122", color: "from-primary to-primary/60" },
  { name: "Lucía Hoyos", role: "Inquilina", unit: "Apto 802", access: "Residente", status: "Al día", phone: "+57 318 777 6655", color: "from-primary/70 to-primary/40" },
];

function Page() {
  return (
    <ModulePage icon={Users} eyebrow="Capa 2 · Personas y Empresas" title="Directorio y Accesos"
      description="Identidades vinculadas a la copropiedad. Roles mediante etiquetas y nivel de acceso al sistema."
      actions={<button className="h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-semibold inline-flex items-center gap-2"><Plus className="size-4" /> Nueva persona</button>}>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile label="Personas" value="320" hint="+8 este mes" tone="primary" />
        <StatTile label="Propietarios" value="142" />
        <StatTile label="Proveedores activos" value="14" tone="gold" />
        <StatTile label="Pendientes de validar" value="3" tone="danger" />
      </div>

      <Card>
        <header className="px-6 py-4 border-b border-border flex items-center justify-between gap-4">
          <h3 className="font-bold">Personas y empresas</h3>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
              <input placeholder="Buscar por nombre, unidad…" className="h-9 w-72 pl-9 pr-3 rounded-lg border border-border bg-background text-sm" />
            </div>
            <select className="h-9 px-3 rounded-lg border border-border bg-background text-sm">
              <option>Todos los roles</option><option>Propietarios</option><option>Residentes</option><option>Proveedores</option>
            </select>
          </div>
        </header>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-[11px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left font-bold px-6 py-3">Persona / Empresa</th>
                <th className="text-left font-bold px-3 py-3">Unidad</th>
                <th className="text-left font-bold px-3 py-3">Acceso</th>
                <th className="text-left font-bold px-3 py-3">Estado</th>
                <th className="text-left font-bold px-3 py-3">Contacto</th>
                <th className="px-3 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {people.map((p, i) => (
                <tr key={i} className="hover:bg-muted/30">
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <div className={`size-9 rounded-full bg-gradient-to-br ${p.color} grid place-items-center text-white text-[11px] font-bold`}>
                        {p.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
                      </div>
                      <div>
                        <div className="font-semibold">{p.name}</div>
                        <div className="text-xs text-muted-foreground">{p.role}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-muted-foreground">{p.unit}</td>
                  <td className="px-3 py-3"><span className="text-[10px] font-bold px-2 py-1 rounded-md bg-primary-soft text-primary">{p.access}</span></td>
                  <td className="px-3 py-3"><span className={`text-[10px] font-bold px-2 py-1 rounded-md ${p.status.startsWith("Mora") ? "bg-destructive/10 text-destructive" : "bg-success/10 text-success"}`}>{p.status}</span></td>
                  <td className="px-3 py-3 text-xs text-muted-foreground tabular-nums">{p.phone}</td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-1">
                      <button className="size-8 rounded-md hover:bg-muted grid place-items-center"><MessageCircle className="size-3.5 text-success" /></button>
                      <button className="size-8 rounded-md hover:bg-muted grid place-items-center"><Phone className="size-3.5" /></button>
                      <button className="size-8 rounded-md hover:bg-muted grid place-items-center"><Mail className="size-3.5" /></button>
                      <button className="size-8 rounded-md hover:bg-muted grid place-items-center"><MoreVertical className="size-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </ModulePage>
  );
}
