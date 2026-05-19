export function CarteraDonut() {
  const segments = [
    { label: "Al día", value: 78, color: "var(--color-primary)" },
    { label: "1-30 días", value: 12, color: "var(--color-gold)" },
    { label: "31-60 días", value: 6, color: "oklch(0.65 0.18 45)" },
    { label: "+60 días", value: 4, color: "var(--color-destructive)" },
  ];

  const c = 2 * Math.PI * 42;
  let acc = 0;

  return (
    <div className="flex items-center gap-5">
      <div className="relative size-32 shrink-0">
        <svg viewBox="0 0 100 100" className="size-full -rotate-90">
          <circle cx="50" cy="50" r="42" fill="none" stroke="var(--color-muted)" strokeWidth="12" />
          {segments.map((s, i) => {
            const len = (s.value / 100) * c;
            const dash = `${len} ${c - len}`;
            const offset = -acc;
            acc += len;
            return (
              <circle key={i} cx="50" cy="50" r="42" fill="none"
                stroke={s.color} strokeWidth="12"
                strokeDasharray={dash} strokeDashoffset={offset}
                strokeLinecap="butt" />
            );
          })}
        </svg>
        <div className="absolute inset-0 grid place-items-center text-center">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Al día</div>
            <div className="text-2xl font-bold tabular-nums">78%</div>
          </div>
        </div>
      </div>
      <div className="flex-1 space-y-2">
        {segments.map((s) => (
          <div key={s.label} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="size-2.5 rounded-sm" style={{ background: s.color }} />
              <span className="text-foreground font-medium">{s.label}</span>
            </div>
            <span className="text-muted-foreground tabular-nums font-semibold">{s.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
