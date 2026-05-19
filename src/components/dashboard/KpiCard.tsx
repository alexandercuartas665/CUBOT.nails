import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  label: string;
  value: string;
  hint?: string;
  delta?: { value: string; positive?: boolean };
  icon: LucideIcon;
  tone?: "default" | "primary" | "gold" | "danger";
};

const tones = {
  default: "bg-card",
  primary: "bg-card",
  gold: "bg-card",
  danger: "bg-card",
};

const iconTones = {
  default: "bg-muted text-foreground",
  primary: "bg-primary-soft text-primary",
  gold: "bg-gold/15 text-gold-foreground",
  danger: "bg-destructive/10 text-destructive",
};

export function KpiCard({ label, value, hint, delta, icon: Icon, tone = "default" }: Props) {
  return (
    <div className={cn("rounded-2xl border border-border p-5 shadow-soft hover:shadow-card transition-shadow", tones[tone])}>
      <div className="flex items-start justify-between">
        <div className={cn("size-9 rounded-xl grid place-items-center", iconTones[tone])}>
          <Icon className="size-4.5" strokeWidth={2.2} />
        </div>
        {delta && (
          <span className={cn(
            "inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-full",
            delta.positive ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
          )}>
            {delta.positive ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
            {delta.value}
          </span>
        )}
      </div>
      <div className="mt-4">
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">{label}</div>
        <div className="text-2xl font-bold tracking-tight mt-1 tabular-nums">{value}</div>
        {hint && <div className="text-xs text-muted-foreground mt-1">{hint}</div>}
      </div>
    </div>
  );
}
