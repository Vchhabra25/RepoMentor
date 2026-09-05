import type { LucideIcon } from "lucide-react";
import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  futureAI?: boolean;
}

export function EmptyState({ icon: Icon, title, description, futureAI = true }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6 rounded-xl2 border border-dashed border-border bg-surface/40">
      <div className="w-14 h-14 rounded-2xl bg-surface-elevated border border-border flex items-center justify-center mb-5">
        <Icon size={24} className="text-ink-muted" />
      </div>
      <h3 className="text-base font-medium text-ink mb-1.5">{title}</h3>
      <p className="text-sm text-ink-muted max-w-sm mb-4">{description}</p>
      {futureAI && (
        <Badge variant="amber" icon={<Sparkles size={12} />}>
          Powered by AI — coming soon
        </Badge>
      )}
    </div>
  );
}
