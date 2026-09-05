import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/utils/cn";

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  trend?: string;
  trendDirection?: "up" | "down" | "neutral";
}

export function StatCard({ label, value, icon: Icon, trend, trendDirection = "neutral" }: StatCardProps) {
  return (
    <Card padding="md" hoverable>
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl bg-signal-gradient-soft border border-accent-indigo/20 flex items-center justify-center">
          <Icon size={18} className="text-accent-cyan" />
        </div>
        {trend && (
          <span
            className={cn(
              "text-xs font-mono px-2 py-0.5 rounded-full",
              trendDirection === "up" && "text-state-success bg-state-success/10",
              trendDirection === "down" && "text-state-danger bg-state-danger/10",
              trendDirection === "neutral" && "text-ink-muted bg-surface-hover"
            )}
          >
            {trend}
          </span>
        )}
      </div>
      <p className="text-2xl font-display font-semibold text-ink">{value}</p>
      <p className="text-sm text-ink-muted mt-1">{label}</p>
    </Card>
  );
}
