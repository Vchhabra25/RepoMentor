import type { ReactNode } from "react";
import { Sparkles } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Loader } from "@/components/ui/Loader";
import { useRepositoryWorkspace } from "@/hooks/useRepositoryWorkspace";

export function RequiresIntelligenceAnalysis({ children }: { children: ReactNode }) {
  const { repository, analysis, isAnalyzing, analyzeError, runIntelligenceAnalysis } = useRepositoryWorkspace();

  if (analysis) return <>{children}</>;

  if (isAnalyzing) {
    return (
      <Card padding="lg" className="py-14">
        <Loader messages={["🧠 Scanning file tree...", "🧩 Detecting languages and frameworks...", "📦 Parsing dependencies..."]} />
      </Card>
    );
  }

  return (
    <Card padding="lg" className="text-center py-14">
      <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-signal-gradient-soft border border-accent-indigo/20 flex items-center justify-center">
        <Sparkles size={22} className="text-accent-cyan" />
      </div>
      <h3 className="text-base font-medium text-ink mb-1.5">Run Intelligence Analysis first</h3>
      <p className="text-sm text-ink-muted max-w-sm mx-auto mb-6">
        AI features read from the Repository Intelligence Engine's structural analysis. Run it once to unlock
        everything on this page.
      </p>
      {analyzeError && <p className="text-xs text-state-danger mb-4">{analyzeError}</p>}
      <Button icon={<Sparkles size={16} />} onClick={runIntelligenceAnalysis} disabled={repository?.status !== "Ready"}>
        Run analysis
      </Button>
    </Card>
  );
}
