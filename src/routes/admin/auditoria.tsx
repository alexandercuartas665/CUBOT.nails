import { createFileRoute } from "@tanstack/react-router";
import { ScrollText, Download, Filter, User, Database, Settings, LogIn, FileEdit } from "lucide-react";
import { ModulePage, Card, StatTile } from "@/components/dashboard/ModulePage";

export const Route = createFileRoute("/admin/auditoria")({
  head: () => ({ meta: [{ title: "Auditoría Global — PropIA" }] }),
  component: Page,
});

const eventos = [
  { t: "Usuario creado", who: "alex.cuartas@adgroup.co", obj: "maria.lopez@adgroup.co", tenant: "A&D Group", ts: "Hoy 10:42", icon: User, color: "success" },
  { t: "Pago aprobado", who: "alex.cuartas@adgroup.co", obj: "Otis Ltda · $2.150.000", tenant: "Altavista", ts: "Hoy 09:15", icon: FileEdit, color: "primary" },
  { t: "Acceso concedido", who: "sandra.ortiz@adgroup.co", obj: "Apto 802 · Visitante", tenant: "Aragón", ts: "Hoy 08:30", icon: LogIn, color: "primary" },
  { t: "Configuración modificada", who: "admin@propia.app", obj: "Plan Pro → Enterprise", tenant: "Inmobiliaria Centro", ts: "Ayer 17:20", icon: Settings, color: "gold" },
  { t: "Exportación de datos", who: "diego.velez@adgroup.co", obj: "Cartera completa · CSV", tenant: "Sierra Verde", ts: "Ayer 14:08", icon: Database, color: "primary" },
  { t: "Acta firmada digitalmente", who: "consejo@altavista.co", obj: "Asamblea 22-Nov-2025", tenant: "Altavista", ts: "Ayer 11:45", icon: FileEdit, color: "success" },
  { t: "Intento de login fallido", who: "anonymous", obj: "carlos.mejia@adgroup.co · 5 intentos", tenant: "—", ts: "Ayer 09:02", icon: LogIn, color: "destructive" },
  { t: "Comunicado masivo enviado", who: "alex.cuartas@adgroup.co", obj: "320 destinatarios · WhatsApp", tenant: "Altavista", ts: "Ayer 08:10", icon: FileEdit, color: "primary" },
];

const colorMap: Record<string, string> = {
  success: "bg-success/10 text-success",
  primary: "bg-primary-soft text-primary",
  gold: "bg-gold/15 text-gold-foreground",
  destructive: "bg-destructive/10 text-destructive",
};

function Page() {
  return (
    <ModulePage icon={ScrollText} eyebrow="Capa 0 · Cumplimiento" title="Auditoría Global"
      description="Trazabilidad inmutable de toda acción crítica en la plataforma. Hash encadenado y exportable a peritos."
      actions={<>
        <button className="h-10 px-4 rounded-lg border border-border bg-card text-sm font-semibold inline-flex items-center gap-2"><Filter className="size-4" /> Filtros</button>
        <button className="h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-semibold inline-flex items-center gap-2"><Download className="size-4" /> Exportar</button>
      </>}>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile label="Eventos hoy" value="1,284" tone="primary" />
        <StatTile label="Acciones críticas" value="42" tone="gold" />
        <StatTile label="Intentos sospechosos" value="3" tone="danger" />
        <StatTile label="Retención" value="10 años" tone="success" />
      </div>

      <Card>
        <header className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h3 className="font-bold">Bitácora reciente</h3>
          <div className="flex gap-1">
            {["Todo","Críticos","Datos","Accesos","Config"].map((t,i)=>(
              <button key={t} className={`h-8 px-3 rounded-md text-xs font-semibold ${i===0?"bg-foreground text-background":"hover:bg-muted text-muted-foreground"}`}>{t}</button>
            ))}
          </div>
        </header>
        <ul className="divide-y divide-border">
          {eventos.map((e, i) => (
            <li key={i} className="px-6 py-3.5 flex items-center gap-4 hover:bg-muted/30">
              <div className={`size-9 rounded-xl grid place-items-center ${colorMap[e.color]}`}><e.icon className="size-4" /></div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm">{e.t} · <span className="text-muted-foreground font-normal">{e.obj}</span></div>
                <div className="text-[11px] text-muted-foreground mt-0.5">por {e.who} · {e.tenant}</div>
              </div>
              <span className="text-[11px] text-muted-foreground tabular-nums shrink-0">{e.ts}</span>
              <span className="font-mono text-[10px] text-muted-foreground/60 hidden md:inline">#{(8742+i).toString(16)}</span>
            </li>
          ))}
        </ul>
      </Card>
    </ModulePage>
  );
}
