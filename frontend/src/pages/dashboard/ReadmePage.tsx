import { FileText, Download } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StreamingMarkdown } from "@/components/ui/StreamingMarkdown";
import { CopyButton } from "@/components/ui/CopyButton";
import { Button } from "@/components/ui/Button";
import { RequiresIntelligenceAnalysis } from "@/components/ai/RequiresIntelligenceAnalysis";
import { AgentStreamPanel } from "@/components/ai/AgentStreamPanel";
import { useAgentStream } from "@/hooks/useAgentStream";
import { useRepositoryWorkspace } from "@/hooks/useRepositoryWorkspace";
import { aiApi } from "@/services/api";
import type { ReadmeResponse } from "@/types/ai";

const LOADING_MESSAGES = ["📂 Reading project structure...", "🧠 Understanding architecture...", "🎯 Drafting sections..."];

function downloadMarkdown(content: string, filename: string) {
  const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function ReadmeContent() {
  const { repository } = useRepositoryWorkspace();

  const result = useAgentStream<ReadmeResponse>((signal) => aiApi.readme(repository!.id, signal), [repository?.id]);

  return (
    <AgentStreamPanel
      title="README.md"
      icon={FileText}
      loadingMessages={LOADING_MESSAGES}
      result={result}
      headerActions={
        result.data ? (
          <>
            <CopyButton text={result.data.markdown} />
            <Button
              variant="secondary"
              size="sm"
              icon={<Download size={13} />}
              onClick={() => downloadMarkdown(result.data!.markdown, "README.md")}
            >
              Download
            </Button>
          </>
        ) : undefined
      }
      renderData={(data) => <StreamingMarkdown content={data.markdown} />}
    />
  );
}

export default function ReadmePage() {
  return (
    <div>
      <SectionHeader
        eyebrow="AI-generated"
        title="README"
        description="A ready-to-commit README, generated from this repository's real structure."
      />
      <RequiresIntelligenceAnalysis>
        <ReadmeContent />
      </RequiresIntelligenceAnalysis>
    </div>
  );
}
