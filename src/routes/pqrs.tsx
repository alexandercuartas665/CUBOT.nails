import { createFileRoute } from "@tanstack/react-router";
import { MessageSquareWarning, Plus, Filter, Clock, MessageCircle, AlertTriangle, CheckCircle2 } from "lucide-react";
import { ModulePage, Card, StatTile } from "@/components/dashboard/ModulePage";

export const Route = createFileRoute("/pqrs")({
  head: () => ({ meta: [{ title: "PQRS — PropIA" }] }),
  component: Page,
});

const tickets = [
  { id: "421", title: "Ruido nocturno persistente del Apto 502", category: "Queja", priority: "Alta", status: "Vencida", from: "Apto 401 · M. Gómez", time: "2 días vencida", channel: "WhatsApp" },
  { id: "420", title: "Solicitud de paz y salvo para venta", category: "Petición", priority: "Media", status: "En curso", from: "Apto 1203 · J. Restrepo", time: "Vence mañana", channel: "App" },
  { id: "419", title: "Filtración en techo de parqueadero #45", category: "Reclamo", priority: "Alta", status: "Vencida", from: "Apto 802 · L. Hoyos", time: "1 día vencida", channel: "WhatsApp" },
  { id: "418", title: "Sugerencia: instalar bicicletero adicional", category: "Sugerencia", priority: "Baja", status: "Por revisar", from: "Apto 1502 · A. Pérez", time: "Hace 3h", channel: "App" },
  { id: "417", title: "Cobro duplicado en cuota mayo", category: "Reclamo", priority: "Alta", status: "En curso", from: "Apto 305 · D. Marín", time: "Vence hoy", channel: "Email" },
  { id: "416", title: "Solicitud copia acta asamblea 2025", category: "Petición", priority: "Baja", status: "Resuelta", from: "Apto 901 · C. Vélez", time: "Cerrada ayer", channel: "WhatsApp" },
];

const cats: Record<string, string> = {
  Petición: "bg-primary-soft text-primary", Queja: "bg-destructive/10 text-destructive",
  Reclamo: "bg-gold/15 text-gold-foreground", Sugerencia: "bg-success/10 text-success",
};
const stats: Record<string, string> = {
  "Vencida": "bg-destructive text-destructive-foreground", "En curso": "bg-gold/20 text-gold-foreground",
  "Por revisar": "bg-muted text-foreground", "Resuelta": "bg-success/15 text-success",
};

function Page() {
  return (
    <ModulePage icon={MessageSquareWarning} eyebrow="Capa 2 · Atención al residente" title="PQRS"
      description="Peticiones, quejas, reclamos y sugerencias. Recibidas por WhatsApp, app o email."
      actions={<button className="h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-semibold inline-flex items-center gap-2"><Plus className="size-4" /> Crear caso</button>}>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatTile label="Abiertas" value="12" tone="primary" />
        <StatTile label="Vencidas SLA" value="3" tone="danger" />
        <StatTile label="Por aprobar" value="2" tone="gold" />
        <StatTile label="Resueltas (mes)" value="48" tone="success" />
        <StatTile label="Tiempo promedio" value="2.4d" hint="Meta: 3 días" />
      </div>

      <Card>
        <header className="px-6 py-4 border-b border-border flex items-center justify-between">
          <div className="flex gap-1">
            {["Todas (12)", "Vencidas (3)", "Hoy (5)", "Mías (4)"].map((t, i) => (
              <button key={t} className={`h-8 px-3 rounded-md text-xs font-semibold ${i === 0 ? "bg-foreground text-background" : "hover:bg-muted text-muted-foreground"}`}>{t}</button>
            ))}
          </div>
          <button className="h-9 px-3 rounded-lg border border-border text-xs font-semibold inline-flex items-center gap-2"><Filter className="size-3.5" /> Filtros</button>
        </header>
        <ul className="divide-y divide-border">
          {tickets.map((t) => (
            <li key={t.id} className="px-6 py-4 hover:bg-muted/30 cursor-pointer">
              <div className="flex items-start gap-4">
                <div className="text-xs font-bold tabular-nums text-muted-foreground w-12 mt-1">#{t.id}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${cats[t.category]}`}>{t.category}</span>
                    {t.priority === "Alta" && <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-destructive/10 text-destructive inline-flex items-center gap-1"><AlertTriangle className="size-2.5" /> Alta</span>}
                    <span className="text-[10px] text-muted-foreground">vía {t.channel}</span>
                  </div>
                  <div className="font-semibold text-sm mt-1">{t.title}</div>
                  <div className="text-xs text-muted-foreground mt-1">{t.from}</div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${stats[t.status]}`}>{t.status}</span>
                  <span className="text-[11px] text-muted-foreground inline-flex items-center gap-1"><Clock className="size-3" /> {t.time}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </ModulePage>
  );
}
