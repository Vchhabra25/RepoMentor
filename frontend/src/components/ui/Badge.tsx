import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

type Variant = "amber" | "cyan" | "success" | "danger" | "neutral";

interface BadgeProps {
  children: ReactNode;
  variant?: Variant;
  icon?: ReactNode;
}

const variantStyles: Record<Variant, string> = {
  amber: "bg-accent-amber/10 text-accent-amber border-accent-amber/20",
  cyan: "bg-accent-cyan/10 text-accent-cyan border-accent-cyan/20",
  success: "bg-state-success/10 text-state-success border-state-success/20",
  danger: "bg-state-danger/10 text-state-danger border-state-danger/20",
  neutral: "bg-surface-hover text-ink-muted border-border",
};

export function Badge({ children, variant = "neutral", icon }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border",
        variantStyles[variant]
      )}
    >
      {icon}
      {children}
    </span>
  );
}
