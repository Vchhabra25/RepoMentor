import { useNavigate } from "react-router-dom";
import {
  FileCode2,
  HardDrive,
  Layers,
  FolderTree,
  Database,
  ShieldCheck,
  Sparkles,
  Clock,
  GitCommitHorizontal,
  ArrowRight,
  Cpu,
} from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { StatCard } from "@/components/ui/StatCard";
import { Loader } from "@/components/ui/Loader";
import { useRepositoryWorkspace } from "@/hooks/useRepositoryWorkspace";
import { formatBytes, formatRelativeTime } from "@/utils/formatters";

export default function RepositoryHomePage() {
  const { repository, analysis, isAnalyzing, analyzeError, runIntelligenceAnalysis } = useRepositoryWorkspace();
  const navigate = useNavigate();

  if (!repository) return null;

  const activity = [
    { label: "Repository ingested", detail: `via ${repository.source === "github" ? "GitHub" : "ZIP upload"}`, time: repository.upload_time },
    ...(analysis
      ? [{ label: "Intelligence analysis completed", detail: analysis.summary.estimatedArchitecture, time: analysis.generated_at }]
      : []),
  ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

  return (
    <div>
      <SectionHeader
        eyebrow={repository.source === "github" ? "GitHub repository" : "ZIP upload"}
        title={repository.owner ? `${repository.owner}/${repository.name}` : repository.name}
        description={`Ingested ${formatRelativeTime(repository.upload_time)}`}
        action={<Badge variant={repository.status === "Ready" ? "success" : "neutral"}>{repository.status}</Badge>}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Detected framework" value={analysis?.summary.framework || "—"} icon={Cpu} />
        <StatCard label="Primary language" value={repository.primary_language ?? "—"} icon={FileCode2} />
        <StatCard label="Database" value={analysis?.summary.database || "—"} icon={Database} />
        <StatCard label="Authentication" value={analysis?.summary.authentication || "—"} icon={ShieldCheck} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <Card padding="lg">
          <h3 className="text-base font-medium text-ink mb-4 flex items-center gap-2">
            <Layers size={16} className="text-ink-muted" />
            Project statistics
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-ink-faint">Repository size</p>
              <p className="text-ink font-mono">{formatBytes(repository.size_bytes)}</p>
            </div>
            <div>
              <p className="text-xs text-ink-faint">Files</p>
              <p className="text-ink font-mono">{repository.file_count}</p>
            </div>
            <div>
              <p className="text-xs text-ink-faint">Folders</p>
              <p className="text-ink font-mono">{repository.folder_count}</p>
            </div>
            <div>
              <p className="text-xs text-ink-faint">Lines of code</p>
              <p className="text-ink font-mono">{analysis ? analysis.health.lines_of_code.toLocaleString() : "—"}</p>
            </div>
          </div>
        </Card>

        <Card padding="lg">
          <h3 className="text-base font-medium text-ink mb-4 flex items-center gap-2">
            <Sparkles size={16} className="text-accent-cyan" />
            AI status
          </h3>
          {isAnalyzing ? (
            <Loader size="sm" messages={["🧠 Scanning repository...", "🧩 Detecting stack..."]} />
          ) : analysis ? (
            <div>
              <p className="text-sm text-ink-muted mb-4">
                Intelligence analysis is ready. AI features (Overview, Architecture, Interview Mode, and more) are
                available for this repository.
              </p>
              <Button size="sm" variant="secondary" icon={<ArrowRight size={14} />} iconPosition="right" onClick={() => navigate(`/dashboard/${repository.id}/overview`)}>
                Explore with AI
              </Button>
            </div>
          ) : (
            <div>
              <p className="text-sm text-ink-muted mb-4">
                Run the Repository Intelligence Engine first to unlock AI-powered features.
              </p>
              {analyzeError && <p className="text-xs text-state-danger mb-3">{analyzeError}</p>}
              <Button size="sm" icon={<Sparkles size={14} />} onClick={runIntelligenceAnalysis} disabled={repository.status !== "Ready"}>
                Run analysis
              </Button>
            </div>
          )}
        </Card>

        <Card padding="lg">
          <h3 className="text-base font-medium text-ink mb-4 flex items-center gap-2">
            <FolderTree size={16} className="text-ink-muted" />
            Repository health
          </h3>
          {analysis ? (
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between">
                <span className="text-ink-muted">Avg. folder depth</span>
                <span className="text-ink font-mono">{analysis.health.average_folder_depth}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-muted">Largest file</span>
                <span className="text-ink font-mono truncate max-w-[140px]">{analysis.health.largest_file ?? "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-muted">Package managers</span>
                <span className="text-ink font-mono truncate max-w-[140px]">
                  {analysis.summary.packageManagers.join(", ") || "—"}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-ink-faint">Run analysis to see health metrics.</p>
          )}
        </Card>
      </div>

      <Card padding="lg">
        <h3 className="text-base font-medium text-ink mb-5 flex items-center gap-2">
          <GitCommitHorizontal size={16} className="text-ink-muted" />
          Recent activity
        </h3>
        <div className="space-y-4">
          {activity.map((item) => (
            <div key={item.label} className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-surface-elevated border border-border flex items-center justify-center shrink-0 mt-0.5">
                  <Clock size={12} className="text-ink-muted" />
                </div>
                <div>
                  <p className="text-sm text-ink">{item.label}</p>
                  <p className="text-xs text-ink-muted font-mono">{item.detail}</p>
                </div>
              </div>
              <span className="text-xs text-ink-faint whitespace-nowrap">{formatRelativeTime(item.time)}</span>
            </div>
          ))}
        </div>
      </Card>

      <div className="mt-6 flex items-center gap-2 text-xs text-ink-faint">
        <HardDrive size={12} />
        Root directory: <span className="font-mono">{repository.root_directory}</span>
      </div>
    </div>
  );
}
