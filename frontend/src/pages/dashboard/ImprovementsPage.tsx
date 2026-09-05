import { useMemo } from "react";
import { Sparkles, Layers } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { RequiresIntelligenceAnalysis } from "@/components/ai/RequiresIntelligenceAnalysis";
import { AgentStreamPanel } from "@/components/ai/AgentStreamPanel";
import { useAgentStream } from "@/hooks/useAgentStream";
import { useRepositoryWorkspace } from "@/hooks/useRepositoryWorkspace";
import { aiApi } from "@/services/api";
import type { ImprovementSuggestion, ImprovementSuggestionsResponse } from "@/types/ai";

const LOADING_MESSAGES = ["🔍 Following dependencies...", "🧠 Understanding architecture...", "⚡ Connecting components..."];

const priorityVariant: Record<string, "success" | "amber" | "danger" | "neutral"> = {
  Low: "success",
  Medium: "amber",
  High: "danger",
};

function SuggestionCard({ suggestion }: { suggestion: ImprovementSuggestion }) {
  return (
    <Card padding="md">
      <div className="flex items-start justify-between gap-3 mb-2">
        <p className="text-sm text-ink font-medium">{suggestion.suggestion}</p>
        <Badge variant={priorityVariant[suggestion.priority] ?? "neutral"}>{suggestion.priority}</Badge>
      </div>
      <p className="text-sm text-ink-muted leading-relaxed">{suggestion.rationale}</p>
    </Card>
  );
}

function ImprovementsContent() {
  const { repository } = useRepositoryWorkspace();

  const result = useAgentStream<ImprovementSuggestionsResponse>(
    (signal) => aiApi.improvementSuggestions(repository!.id, signal),
    [repository?.id]
  );

  const grouped = useMemo(() => {
    if (!result.data) return new Map<string, ImprovementSuggestion[]>();
    const map = new Map<string, ImprovementSuggestion[]>();
    for (const suggestion of result.data.suggestions) {
      const list = map.get(suggestion.category) ?? [];
      list.push(suggestion);
      map.set(suggestion.category, list);
    }
    return map;
  }, [result.data]);

  return (
    <AgentStreamPanel
      title="Suggestions"
      icon={Sparkles}
      loadingMessages={LOADING_MESSAGES}
      result={result}
      renderData={() =>
        grouped.size === 0 ? (
          <p className="text-sm text-ink-faint text-center py-8">No suggestions generated.</p>
        ) : (
          <div className="space-y-6">
            {Array.from(grouped.entries()).map(([category, suggestions]) => (
              <div key={category}>
                <h4 className="text-xs font-mono uppercase tracking-wide text-accent-cyan mb-3 flex items-center gap-1.5">
                  <Layers size={12} />
                  {category}
                </h4>
                <div className="space-y-2.5">
                  {suggestions.map((s, i) => (
                    <SuggestionCard key={`${category}-${i}`} suggestion={s} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )
      }
    />
  );
}

export default function ImprovementsPage() {
  return (
    <div>
      <SectionHeader
        eyebrow="AI-generated"
        title="Improvements"
        description="Concrete, prioritized suggestions grounded in this repository's actual structure and metrics."
      />
      <RequiresIntelligenceAnalysis>
        <ImprovementsContent />
      </RequiresIntelligenceAnalysis>
    </div>
  );
}
