const data = [
  { m: "Nov", facturado: 132, recaudado: 118 },
  { m: "Dic", facturado: 138, recaudado: 121 },
  { m: "Ene", facturado: 140, recaudado: 132 },
  { m: "Feb", facturado: 142, recaudado: 130 },
  { m: "Mar", facturado: 145, recaudado: 138 },
  { m: "Abr", facturado: 148, recaudado: 142 },
  { m: "May", facturado: 150, recaudado: 96 },
];

export function RecaudoChart() {
  const max = 160;
  return (
    <div className="h-56 flex items-end gap-3 px-1">
      {data.map((d, i) => {
        const isCurrent = i === data.length - 1;
        const fH = (d.facturado / max) * 100;
        const rH = (d.recaudado / max) * 100;
        return (
          <div key={d.m} className="flex-1 flex flex-col items-center gap-2 group">
            <div className="w-full relative flex items-end justify-center gap-1 h-full">
              <div
                className="w-3 rounded-t-sm bg-primary-soft border border-primary/20"
                style={{ height: `${fH}%` }}
                title={`Facturado $${d.facturado}M`}
              />
              <div
                className={`w-3 rounded-t-sm transition-all ${isCurrent ? "bg-gradient-to-t from-gold to-gold/70" : "bg-gradient-to-t from-primary to-primary/70"}`}
                style={{ height: `${rH}%` }}
                title={`Recaudado $${d.recaudado}M`}
              />
            </div>
            <span className={`text-[10px] font-semibold ${isCurrent ? "text-gold-foreground" : "text-muted-foreground"}`}>{d.m}</span>
          </div>
        );
      })}
    </div>
  );
}
