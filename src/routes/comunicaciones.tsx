import { createFileRoute } from "@tanstack/react-router";
import { Megaphone, Plus, Send, MessageCircle, Mail, Bell, Users, Eye } from "lucide-react";
import { ModulePage, Card, StatTile } from "@/components/dashboard/ModulePage";

export const Route = createFileRoute("/comunicaciones")({
  head: () => ({ meta: [{ title: "Comunicaciones — PropIA" }] }),
  component: Page,
});

function Page() {
  return (
    <ModulePage icon={Megaphone} eyebrow="Capa 2 · Difusión" title="Comunicaciones"
      description="Comunicados, encuestas y notificaciones por WhatsApp, email, app y cartelera digital."
      actions={<button className="h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-semibold inline-flex items-center gap-2"><Plus className="size-4" /> Nuevo comunicado</button>}>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile label="Enviados (mes)" value="14" tone="primary" />
        <StatTile label="Lectura promedio" value="78%" tone="success" />
        <StatTile label="WhatsApp activos" value="287" hint="de 320 personas" tone="gold" />
        <StatTile label="Encuestas abiertas" value="2" />
      </div>

      <div className="grid grid-cols-12 gap-6">
        <Card className="col-span-12 lg:col-span-7 p-0">
          <header className="px-6 py-4 border-b border-border flex items-center justify-between">
            <h3 className="font-bold">Comunicados recientes</h3>
            <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
              <span className="inline-flex items-center gap-1"><MessageCircle className="size-3 text-success" /> WhatsApp</span>
              <span className="inline-flex items-center gap-1"><Mail className="size-3 text-primary" /> Email</span>
              <span className="inline-flex items-center gap-1"><Bell className="size-3 text-gold-foreground" /> App push</span>
            </div>
          </header>
          <ul className="divide-y divide-border">
            {[
              { t: "Mantenimiento ascensor torre B — 6 May", chs: ["wa","email","push"], reach: 320, read: 268, when: "Hace 2h" },
              { t: "Convocatoria asamblea ordinaria 2026", chs: ["wa","email"], reach: 142, read: 128, when: "Hace 1 día" },
              { t: "Recordatorio: pago de cuota mayo", chs: ["wa"], reach: 142, read: 119, when: "Hace 3 días" },
              { t: "Encuesta: nuevo servicio de jardinería", chs: ["wa","push"], reach: 320, read: 201, when: "Hace 5 días" },
            ].map((c, i) => (
              <li key={i} className="px-6 py-4 hover:bg-muted/30">
                <div className="flex items-center gap-2 mb-1">
                  {c.chs.includes("wa") && <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-success/10 text-success inline-flex items-center gap-1"><MessageCircle className="size-2.5" />WhatsApp</span>}
                  {c.chs.includes("email") && <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-primary-soft text-primary inline-flex items-center gap-1"><Mail className="size-2.5" />Email</span>}
                  {c.chs.includes("push") && <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gold/15 text-gold-foreground inline-flex items-center gap-1"><Bell className="size-2.5" />Push</span>}
                  <span className="text-[10px] text-muted-foreground ml-auto">{c.when}</span>
                </div>
                <div className="font-semibold text-sm">{c.t}</div>
                <div className="flex items-center gap-4 mt-2 text-[11px] text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><Users className="size-3" /> {c.reach} destinatarios</span>
                  <span className="inline-flex items-center gap-1"><Eye className="size-3" /> {c.read} leídos · {Math.round(c.read/c.reach*100)}%</span>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="col-span-12 lg:col-span-5 p-6">
          <h3 className="font-bold mb-1">Nuevo comunicado rápido</h3>
          <p className="text-xs text-muted-foreground mb-4">La IA te ayuda a redactar mejor.</p>
          <input className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm mb-3" placeholder="Asunto del comunicado" defaultValue="Mantenimiento agua martes 8 May" />
          <textarea className="w-full h-32 p-3 rounded-lg border border-border bg-background text-sm resize-none" placeholder="Mensaje..." defaultValue="Estimados residentes, informamos que el martes 8 de mayo entre 9:00 AM y 12:00 PM se realizará mantenimiento al sistema hidráulico..." />
          <div className="flex items-center gap-2 mt-3">
            <span className="text-[11px] font-semibold text-muted-foreground">Canales:</span>
            <button className="h-8 px-3 rounded-md bg-success/10 text-success text-xs font-bold inline-flex items-center gap-1.5"><MessageCircle className="size-3" />WhatsApp</button>
            <button className="h-8 px-3 rounded-md bg-primary-soft text-primary text-xs font-bold inline-flex items-center gap-1.5"><Mail className="size-3" />Email</button>
            <button className="h-8 px-3 rounded-md hover:bg-muted text-muted-foreground text-xs font-bold inline-flex items-center gap-1.5 border border-dashed border-border"><Bell className="size-3" />Push</button>
          </div>
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
            <button className="flex-1 h-10 rounded-lg border border-border text-sm font-semibold">Guardar borrador</button>
            <button className="flex-1 h-10 rounded-lg bg-primary text-primary-foreground text-sm font-semibold inline-flex items-center justify-center gap-2"><Send className="size-4" />Enviar a 320 personas</button>
          </div>
        </Card>
      </div>
    </ModulePage>
  );
}
