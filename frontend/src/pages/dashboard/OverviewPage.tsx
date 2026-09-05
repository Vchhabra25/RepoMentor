import { LayoutDashboard, Layers, Workflow, Sparkles } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StreamingMarkdown } from "@/components/ui/StreamingMarkdown";
import { RequiresIntelligenceAnalysis } from "@/components/ai/RequiresIntelligenceAnalysis";
import { AgentStreamPanel } from "@/components/ai/AgentStreamPanel";
import { useAgentStream } from "@/hooks/useAgentStream";
import { useRepositoryWorkspace } from "@/hooks/useRepositoryWorkspace";
import { aiApi } from "@/services/api";
import type { ProjectOverviewResponse } from "@/types/ai";

const LOADING_MESSAGES = [
  "🧠 Understanding architecture...",
  "📂 Reading project structure...",
  "🔍 Following imports...",
  "⚡ Connecting dependencies...",
];

function OverviewContent() {
  const { repository } = useRepositoryWorkspace();

  const result = useAgentStream<ProjectOverviewResponse>(
    (signal) => aiApi.overview(repository!.id, signal),
    [repository?.id]
  );

  return (
    <AgentStreamPanel
      title="Project overview"
      icon={LayoutDashboard}
      loadingMessages={LOADING_MESSAGES}
      result={result}
      renderData={(data) => (
        <div className="space-y-6">
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wide text-accent-cyan mb-2">Purpose</h4>
            <StreamingMarkdown content={data.purpose} />
          </div>
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wide text-accent-cyan mb-2 flex items-center gap-1.5">
              <Layers size={12} /> Tech stack
            </h4>
            <StreamingMarkdown content={data.tech_stack_summary} />
          </div>
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wide text-accent-cyan mb-2 flex items-center gap-1.5">
              <Workflow size={12} /> High-level workflow
            </h4>
            <StreamingMarkdown content={data.high_level_workflow} />
          </div>
          {data.important_technologies.length > 0 && (
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wide text-accent-cyan mb-3 flex items-center gap-1.5">
                <Sparkles size={12} /> Important technologies
              </h4>
              <div className="flex flex-wrap gap-2">
                {data.important_technologies.map((tech) => (
                  <span
                    key={tech}
                    className="text-xs font-mono px-3 py-1.5 rounded-lg bg-surface-elevated border border-border text-ink-muted"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    />
  );
}

export default function OverviewPage() {
  return (
    <div>
      <SectionHeader
        eyebrow="AI-generated"
        title="Overview"
        description="A plain-language explanation of what this project does and how it's built."
      />
      <RequiresIntelligenceAnalysis>
        <OverviewContent />
      </RequiresIntelligenceAnalysis>
    </div>
  );
}
