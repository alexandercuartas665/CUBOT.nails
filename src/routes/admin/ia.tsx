import { createFileRoute } from "@tanstack/react-router";
import { Sparkles, MessageCircle, Wallet, Wrench, Megaphone, FileText, Send } from "lucide-react";
import { ModulePage, Card, StatTile } from "@/components/dashboard/ModulePage";

export const Route = createFileRoute("/admin/ia")({
  head: () => ({ meta: [{ title: "IA Asistente — PropIA" }] }),
  component: Page,
});

const skills = [
  { n: "Cobro persuasivo WhatsApp", d: "Genera mensajes empáticos por edad de mora y perfil del residente", uses: 1284, i: Wallet, color: "from-primary to-primary/70" },
  { n: "Redacción de comunicados", d: "Asunto, cuerpo y CTA optimizados para apertura > 75%", uses: 842, i: Megaphone, color: "from-gold/80 to-gold" },
  { n: "Resumen de PQRS", d: "Clasifica, prioriza y sugiere respuesta según historial", uses: 612, i: MessageCircle, color: "from-primary to-primary/70" },
  { n: "Plan mantenimiento predictivo", d: "Recomienda cronogramas según equipos y vida útil", uses: 184, i: Wrench, color: "from-success/80 to-success" },
  { n: "Borrador de actas", d: "Toma de la grabación y arma el acta lista para firmar", uses: 92, i: FileText, color: "from-primary to-primary/70" },
  { n: "Alertas proactivas", d: "Detecta anomalías financieras y operativas en tiempo real", uses: 2412, i: Sparkles, color: "from-gold/80 to-gold" },
];

function Page() {
  return (
    <ModulePage icon={Sparkles} eyebrow="Capa 0 · IA" title="IA Asistente PropIA"
      description="Configura, monitorea y entrena los agentes que potencian toda la plataforma.">

      <Card className="p-6 bg-gradient-to-br from-primary to-primary/85 text-primary-foreground border-primary/20 relative overflow-hidden">
        <div className="absolute -top-12 -right-12 size-48 rounded-full bg-gold/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 size-32 rounded-full bg-primary-foreground/10 blur-2xl" />
        <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2"><Sparkles className="size-4" /><span className="text-[10px] font-bold uppercase tracking-wider text-primary-foreground/80">PropIA Brain</span></div>
            <h2 className="text-2xl font-bold mt-2">Tu copiloto de copropiedades</h2>
            <p className="text-sm text-primary-foreground/85 mt-2 max-w-xl">5,426 acciones automatizadas este mes. Ahorro estimado de 312 horas a tu equipo administrativo.</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-primary-foreground/10 backdrop-blur p-3 text-center"><div className="text-xl font-bold">5.4K</div><div className="text-[10px] uppercase text-primary-foreground/70">Acciones</div></div>
            <div className="rounded-xl bg-primary-foreground/10 backdrop-blur p-3 text-center"><div className="text-xl font-bold">94%</div><div className="text-[10px] uppercase text-primary-foreground/70">Precisión</div></div>
            <div className="rounded-xl bg-primary-foreground/10 backdrop-blur p-3 text-center"><div className="text-xl font-bold">312h</div><div className="text-[10px] uppercase text-primary-foreground/70">Ahorro</div></div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile label="Skills activas" value="14" tone="primary" />
        <StatTile label="Tokens consumidos" value="4.2M" hint="este mes" />
        <StatTile label="Costo estimado" value="$182" hint="USD" tone="gold" />
        <StatTile label="Satisfacción" value="4.8/5" hint="de admins" tone="success" />
      </div>

      <Card>
        <header className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h3 className="font-bold">Catálogo de skills</h3>
          <span className="text-[11px] text-muted-foreground">Modelos curados por PropIA</span>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-6">
          {skills.map(s => (
            <div key={s.n} className="p-5 rounded-xl border border-border hover:border-primary/40 hover:shadow-soft transition group">
              <div className={`size-10 rounded-xl bg-gradient-to-br ${s.color} grid place-items-center text-white mb-3`}><s.i className="size-4" /></div>
              <div className="font-bold text-sm">{s.n}</div>
              <p className="text-xs text-muted-foreground mt-1">{s.d}</p>
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                <span className="text-[11px] text-muted-foreground"><span className="font-bold text-foreground tabular-nums">{s.uses.toLocaleString()}</span> usos</span>
                <button className="text-[11px] font-bold text-primary hover:underline">Configurar →</button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-2 mb-1"><MessageCircle className="size-4 text-primary" /><h3 className="font-bold">Probar la IA en vivo</h3></div>
        <p className="text-xs text-muted-foreground mb-4">Pídele algo a PropIA Brain — redactar, analizar, planear.</p>
        <div className="flex gap-2">
          <input className="flex-1 h-11 px-4 rounded-lg border border-border bg-background text-sm" placeholder='Ej: "Redacta un comunicado sobre corte de agua el martes…"' />
          <button className="h-11 px-5 rounded-lg bg-primary text-primary-foreground text-sm font-bold inline-flex items-center gap-2"><Send className="size-4" /> Enviar</button>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {["Resumen de cartera","Plan asamblea","Mensaje de cobro","Análisis de PQRS"].map(s=>(
            <button key={s} className="h-7 px-3 rounded-md bg-muted hover:bg-muted/70 text-[11px] font-semibold text-muted-foreground">{s}</button>
          ))}
        </div>
      </Card>
    </ModulePage>
  );
}
