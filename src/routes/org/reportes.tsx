import { createFileRoute } from "@tanstack/react-router";
import { FileBarChart, Download, Sparkles, TrendingUp, Wallet, Wrench, MessageSquareWarning } from "lucide-react";
import { ModulePage, Card, StatTile } from "@/components/dashboard/ModulePage";

export const Route = createFileRoute("/org/reportes")({
  head: () => ({ meta: [{ title: "Reportes Cruzados — PropIA" }] }),
  component: Page,
});

const reportes = [
  { t: "Recaudo consolidado mensual", d: "Comparativo mes vs mes por copropiedad", i: Wallet, freq: "Mensual" },
  { t: "Cartera por edad — global", d: "30/60/90/+90 días en todas las PH", i: TrendingUp, freq: "Semanal" },
  { t: "Tickets PQRS por SLA", d: "Cumplimiento de tiempos por copropiedad", i: MessageSquareWarning, freq: "Semanal" },
  { t: "Mantenimientos ejecutados", d: "Preventivos vs correctivos · costos", i: Wrench, freq: "Mensual" },
  { t: "Asistencia a asambleas", d: "Quórum histórico por copropiedad", i: FileBarChart, freq: "Por evento" },
  { t: "Comparativo presupuesto vs ejecutado", d: "Desviaciones por concepto", i: Wallet, freq: "Mensual" },
];

function Page() {
  return (
    <ModulePage icon={FileBarChart} eyebrow="Capa 1 · Inteligencia" title="Reportes Cruzados"
      description="Insights agregados de toda la cartera de copropiedades. Exportables y agendables.">

      <Card className="p-6 bg-gradient-to-br from-primary to-primary/85 text-primary-foreground border-primary/20 relative overflow-hidden">
        <div className="absolute -top-12 -right-12 size-48 rounded-full bg-gold/20 blur-3xl" />
        <div className="relative flex items-start gap-4">
          <div className="size-11 rounded-xl bg-primary-foreground/15 grid place-items-center"><Sparkles className="size-5" /></div>
          <div className="flex-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-primary-foreground/70">Insight IA</div>
            <h2 className="text-lg font-bold mt-0.5">Mirador necesita atención inmediata</h2>
            <p className="text-sm text-primary-foreground/85 mt-1 max-w-2xl">El recaudo cayó 12 puntos vs abril y la cartera +90 días creció 38%. Te recomiendo activar campaña de cobro persuasivo por WhatsApp para 18 unidades morosas.</p>
            <div className="flex gap-2 mt-4">
              <button className="h-9 px-4 rounded-lg bg-primary-foreground text-primary text-xs font-bold">Generar campaña</button>
              <button className="h-9 px-4 rounded-lg bg-primary-foreground/15 text-primary-foreground text-xs font-bold">Ver reporte completo</button>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile label="Reportes activos" value="24" tone="primary" />
        <StatTile label="Programados" value="8" hint="envío automático" />
        <StatTile label="Insights IA" value="14" tone="gold" />
        <StatTile label="Exportados (mes)" value="142" tone="success" />
      </div>

      <Card>
        <header className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h3 className="font-bold">Catálogo de reportes</h3>
          <span className="text-[11px] text-muted-foreground">PDF · Excel · CSV</span>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
          {reportes.map((r) => (
            <div key={r.t} className="p-4 rounded-xl border border-border hover:border-primary/40 hover:shadow-soft transition">
              <div className="flex items-start gap-3">
                <div className="size-10 rounded-xl bg-primary-soft text-primary grid place-items-center"><r.i className="size-4" /></div>
                <div className="flex-1">
                  <div className="font-bold text-sm">{r.t}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{r.d}</div>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-muted text-muted-foreground">{r.freq}</span>
                    <button className="text-xs font-semibold text-primary inline-flex items-center gap-1 hover:underline"><Download className="size-3" /> Exportar</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </ModulePage>
  );
}
