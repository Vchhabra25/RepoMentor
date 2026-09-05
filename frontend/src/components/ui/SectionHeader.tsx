import type { ReactNode } from "react";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function SectionHeader({ eyebrow, title, description, action }: SectionHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
      <div>
        {eyebrow && (
          <p className="text-xs font-mono uppercase tracking-widest text-accent-cyan mb-2">
            {eyebrow}
          </p>
        )}
        <h2 className="text-2xl font-display font-semibold text-ink">{title}</h2>
        {description && <p className="text-sm text-ink-muted mt-1.5 max-w-xl">{description}</p>}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}
