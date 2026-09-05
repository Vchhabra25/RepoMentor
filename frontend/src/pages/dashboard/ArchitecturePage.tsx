import { Network, ArrowLeftRight, Waypoints, ShieldCheck, Database } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StreamingMarkdown } from "@/components/ui/StreamingMarkdown";
import { MermaidDiagram } from "@/components/ui/MermaidDiagram";
import { CollapsibleSection } from "@/components/ui/CollapsibleSection";
import { RequiresIntelligenceAnalysis } from "@/components/ai/RequiresIntelligenceAnalysis";
import { AgentStreamPanel } from "@/components/ai/AgentStreamPanel";
import { useAgentStream } from "@/hooks/useAgentStream";
import { useRepositoryWorkspace } from "@/hooks/useRepositoryWorkspace";
import { aiApi } from "@/services/api";
import type { ArchitectureResponse } from "@/types/ai";

const LOADING_MESSAGES = [
  "🧠 Understanding architecture...",
  "🔍 Following dependencies...",
  "⚡ Connecting components...",
  "🗺️ Drafting the diagram...",
];

function ArchitectureContent() {
  const { repository } = useRepositoryWorkspace();

  const result = useAgentStream<ArchitectureResponse>(
    (signal) => aiApi.architecture(repository!.id, signal),
    [repository?.id]
  );

  return (
    <AgentStreamPanel
      title="Architecture"
      icon={Network}
      loadingMessages={LOADING_MESSAGES}
      result={result}
      renderData={(data) => (
        <div className="space-y-4">
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wide text-accent-cyan mb-2">Diagram</h4>
            <MermaidDiagram chart={data.mermaid_diagram} />
          </div>

          <CollapsibleSection title="Overall architecture" icon={Network} defaultOpen>
            <StreamingMarkdown content={data.overall_architecture} />
          </CollapsibleSection>
          <CollapsibleSection title="Frontend ↔ Backend interaction" icon={ArrowLeftRight}>
            <StreamingMarkdown content={data.frontend_backend_interaction} />
          </CollapsibleSection>
          <CollapsibleSection title="Data flow" icon={Waypoints}>
            <StreamingMarkdown content={data.data_flow} />
          </CollapsibleSection>
          <CollapsibleSection title="Authentication flow" icon={ShieldCheck}>
            <StreamingMarkdown content={data.authentication_flow} />
          </CollapsibleSection>
          <CollapsibleSection title="Database flow" icon={Database}>
            <StreamingMarkdown content={data.database_flow} />
          </CollapsibleSection>
        </div>
      )}
    />
  );
}

export default function ArchitecturePage() {
  return (
    <div>
      <SectionHeader
        eyebrow="AI-generated"
        title="Architecture"
        description="How this system fits together — data flow, auth, database, and a visual diagram."
      />
      <RequiresIntelligenceAnalysis>
        <ArchitectureContent />
      </RequiresIntelligenceAnalysis>
    </div>
  );
}
