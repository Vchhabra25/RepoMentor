import { EXPLAIN_MODES, type ExplainMode } from "@/types/ai";
import { cn } from "@/utils/cn";

interface ExplainModeSelectorProps {
  mode: ExplainMode;
  onChange: (mode: ExplainMode) => void;
}

export function ExplainModeSelector({ mode, onChange }: ExplainModeSelectorProps) {
  return (
    <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Explanation detail level">
      {EXPLAIN_MODES.map((option) => (
        <button
          key={option}
          role="tab"
          aria-selected={mode === option}
          onClick={() => onChange(option)}
          className={cn(
            "text-xs font-medium px-2.5 py-1.5 rounded-lg border transition-colors",
            mode === option
              ? "bg-signal-gradient-soft border-accent-indigo/30 text-ink"
              : "border-border text-ink-muted hover:text-ink hover:border-accent-indigo/30"
          )}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
