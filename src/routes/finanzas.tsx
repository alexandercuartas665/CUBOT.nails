import { createFileRoute } from "@tanstack/react-router";
import { Wallet, Plus, Download, ArrowUpRight, ArrowDownRight, CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import { ModulePage, Card, StatTile } from "@/components/dashboard/ModulePage";
import { RecaudoChart } from "@/components/dashboard/RecaudoChart";
import { CarteraDonut } from "@/components/dashboard/CarteraDonut";

export const Route = createFileRoute("/finanzas")({
  head: () => ({ meta: [{ title: "Finanzas y Cartera — PropIA" }] }),
  component: Page,
});

const txs = [
  { type: "in", concept: "Cuota administración mayo · Apto 401", amount: 480000, status: "Conciliado", date: "5 May 09:15" },
  { type: "in", concept: "Cuota extra fondo imprevistos · Apto 802", amount: 220000, status: "Conciliado", date: "5 May 08:42" },
  { type: "out", concept: "Pago Aseototal SAS · Servicio aseo abril", amount: -8400000, status: "Aprobado", date: "4 May 16:00" },
  { type: "in", concept: "Cuota administración mayo · Apto 1203", amount: 480000, status: "Pendiente", date: "4 May 14:22" },
  { type: "out", concept: "Otis Ltda · Mantenimiento ascensor torre B", amount: -2150000, status: "Por aprobar", date: "4 May 11:08" },
  { type: "in", concept: "Reserva salón social · Apto 502", amount: 180000, status: "Conciliado", date: "3 May 19:30" },
];

function Page() {
  return (
    <ModulePage icon={Wallet} eyebrow="Capa 2 · Operación financiera" title="Finanzas y Cartera"
      description="Recaudo, conciliación, cartera por edad y aprobación de pagos. Sin contabilidad — se integra con tu software contable vía API."
      actions={<>
        <button className="h-10 px-4 rounded-lg border border-border bg-card text-sm font-semibold inline-flex items-center gap-2"><Download className="size-4" /> Exportar</button>
        <button className="h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-semibold inline-flex items-center gap-2"><Plus className="size-4" /> Registrar pago</button>
      </>}>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile label="Recaudo mes" value="$142.8M" hint="95.2% de meta" tone="primary" />
        <StatTile label="Cartera vencida" value="$8.4M" hint="22 unidades" tone="danger" />
        <StatTile label="Por aprobar" value="12" hint="$6.2M egresos" tone="gold" />
        <StatTile label="Saldo en bancos" value="$84.1M" hint="3 cuentas activas" tone="success" />
      </div>

      <div className="grid grid-cols-12 gap-6">
        <Card className="col-span-12 lg:col-span-8 p-6">
          <header className="flex items-start justify-between mb-6">
            <div>
              <h3 className="font-bold">Recaudo vs Facturado</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Últimos 7 meses</p>
            </div>
          </header>
          <RecaudoChart />
        </Card>
        <Card className="col-span-12 lg:col-span-4 p-6">
          <h3 className="font-bold mb-5">Cartera por edad</h3>
          <CarteraDonut />
        </Card>
      </div>

      <Card>
        <header className="px-6 py-4 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="font-bold">Movimientos recientes</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Ingresos y egresos · 142 movimientos este mes</p>
          </div>
          <div className="flex gap-1">
            {["Todos", "Ingresos", "Egresos", "Pendientes"].map((t, i) => (
              <button key={t} className={`h-8 px-3 rounded-md text-xs font-semibold ${i === 0 ? "bg-foreground text-background" : "hover:bg-muted text-muted-foreground"}`}>{t}</button>
            ))}
          </div>
        </header>
        <ul className="divide-y divide-border">
          {txs.map((t, i) => {
            const isIn = t.type === "in";
            const status = t.status === "Conciliado" ? { c: "bg-success/10 text-success", I: CheckCircle2 } :
              t.status === "Pendiente" || t.status === "Por aprobar" ? { c: "bg-gold/15 text-gold-foreground", I: Clock } :
              { c: "bg-primary-soft text-primary", I: AlertTriangle };
            const StatusIcon = status.I;
            return (
              <li key={i} className="flex items-center gap-4 px-6 py-3.5 hover:bg-muted/30">
                <div className={`size-10 rounded-xl grid place-items-center ${isIn ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>
                  {isIn ? <ArrowDownRight className="size-4" /> : <ArrowUpRight className="size-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm truncate">{t.concept}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">{t.date}</div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-md inline-flex items-center gap-1 ${status.c}`}>
                  <StatusIcon className="size-3" /> {t.status}
                </span>
                <div className={`font-bold tabular-nums text-sm w-32 text-right ${isIn ? "text-success" : "text-foreground"}`}>
                  {isIn ? "+" : ""}${Math.abs(t.amount).toLocaleString("es-CO")}
                </div>
              </li>
            );
          })}
        </ul>
      </Card>
    </ModulePage>
  );
}
