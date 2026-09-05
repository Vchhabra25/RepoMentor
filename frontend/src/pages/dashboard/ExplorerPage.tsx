import { useMemo, useState } from "react";
import {
  Folder,
  FileCode,
  Search,
  FolderTree,
  Compass,
  ArrowRight,
} from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { StreamingMarkdown } from "@/components/ui/StreamingMarkdown";
import { ExplainModeSelector } from "@/components/ui/ExplainModeSelector";
import { RequiresIntelligenceAnalysis } from "@/components/ai/RequiresIntelligenceAnalysis";
import { AgentStreamPanel } from "@/components/ai/AgentStreamPanel";
import { useAgentStream } from "@/hooks/useAgentStream";
import { useRepositoryWorkspace } from "@/hooks/useRepositoryWorkspace";
import { aiApi } from "@/services/api";
import type { FileExplanationResponse, FolderExplanationResponse } from "@/types/ai";
import { EXPLAIN_MODES, type ExplainMode } from "@/types/ai";
import { cn } from "@/utils/cn";

type Target = { type: "folder" | "file"; path: string };

const LOADING_MESSAGES = ["📂 Reading project structure...", "🔍 Following imports...", "🧠 Understanding architecture..."];

function FolderExplanationView({ data, mode }: { data: FolderExplanationResponse; mode: ExplainMode }) {
  return (
    <div className="space-y-4">
      <StreamingMarkdown content={data.purpose} />
      {mode !== "30 Second Summary" && data.responsibilities.length > 0 && (
        <div>
          <h4 className="text-xs font-mono uppercase tracking-wide text-accent-cyan mb-2">Responsibilities</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm text-ink-muted marker:text-accent-indigo">
            {data.responsibilities.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </div>
      )}
      {mode !== "30 Second Summary" && data.important_files.length > 0 && (
        <div>
          <h4 className="text-xs font-mono uppercase tracking-wide text-accent-cyan mb-2">Important files</h4>
          <div className="flex flex-wrap gap-2">
            {data.important_files.map((f) => (
              <span key={f} className="text-xs font-mono px-2.5 py-1 rounded-lg bg-surface-elevated border border-border text-ink-muted">
                {f}
              </span>
            ))}
          </div>
        </div>
      )}
      {(mode === "Explain Like an Interviewer" || mode === "Explain Like a Senior Engineer") && (
        <div>
          <h4 className="text-xs font-mono uppercase tracking-wide text-accent-cyan mb-2">How it connects</h4>
          <StreamingMarkdown content={data.connections} />
        </div>
      )}
    </div>
  );
}

function FileExplanationView({ data, mode }: { data: FileExplanationResponse; mode: ExplainMode }) {
  return (
    <div className="space-y-4">
      <StreamingMarkdown content={data.purpose} />
      {mode !== "30 Second Summary" && (data.classes.length > 0 || data.functions.length > 0) && (
        <div className="grid grid-cols-2 gap-4">
          {data.classes.length > 0 && (
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wide text-accent-cyan mb-2">Classes</h4>
              <div className="flex flex-wrap gap-1.5">
                {data.classes.map((c) => (
                  <span key={c} className="text-xs font-mono px-2 py-1 rounded-md bg-surface-elevated border border-border text-ink-muted">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          )}
          {data.functions.length > 0 && (
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wide text-accent-cyan mb-2">Functions</h4>
              <div className="flex flex-wrap gap-1.5">
                {data.functions.map((f) => (
                  <span key={f} className="text-xs font-mono px-2 py-1 rounded-md bg-surface-elevated border border-border text-ink-muted">
                    {f}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      {(mode === "Explain Like an Intern" || mode === "Explain Like an Interviewer" || mode === "Explain Like a Senior Engineer") &&
        data.dependencies.length > 0 && (
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wide text-accent-cyan mb-2">Dependencies</h4>
            <div className="flex flex-wrap gap-1.5">
              {data.dependencies.map((d) => (
                <span key={d} className="text-xs font-mono px-2 py-1 rounded-md bg-surface-elevated border border-border text-ink-muted">
                  {d}
                </span>
              ))}
            </div>
          </div>
        )}
      {mode === "Explain Like a Senior Engineer" && data.possible_improvements.length > 0 && (
        <div>
          <h4 className="text-xs font-mono uppercase tracking-wide text-accent-cyan mb-2">Possible improvements</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm text-ink-muted marker:text-accent-indigo">
            {data.possible_improvements.map((imp) => (
              <li key={imp}>{imp}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function ExplanationPanel({ target }: { target: Target }) {
  const { repository } = useRepositoryWorkspace();
  const [mode, setMode] = useState<ExplainMode>(EXPLAIN_MODES[0]);

  const folderResult = useAgentStream<FolderExplanationResponse>(
    (signal) => aiApi.folderExplanation(repository!.id, target.path, signal),
    [repository?.id, target.type, target.path],
    { enabled: target.type === "folder" }
  );

  const fileResult = useAgentStream<FileExplanationResponse>(
    (signal) => aiApi.fileExplanation(repository!.id, target.path, signal),
    [repository?.id, target.type, target.path],
    { enabled: target.type === "file" }
  );

  const modeSelector = <ExplainModeSelector mode={mode} onChange={setMode} />;

  if (target.type === "folder") {
    return (
      <AgentStreamPanel
        title={target.path}
        icon={Folder}
        loadingMessages={LOADING_MESSAGES}
        result={folderResult}
        bodyActions={modeSelector}
        renderData={(data) => <FolderExplanationView data={data} mode={mode} />}
      />
    );
  }

  return (
    <AgentStreamPanel
      title={target.path}
      icon={FileCode}
      loadingMessages={LOADING_MESSAGES}
      result={fileResult}
      bodyActions={modeSelector}
      renderData={(data) => <FileExplanationView data={data} mode={mode} />}
    />
  );
}

function ExplorerContent() {
  const { analysis } = useRepositoryWorkspace();
  const [query, setQuery] = useState("");
  const [target, setTarget] = useState<Target | null>(null);
  const [manualPath, setManualPath] = useState("");

  const folders = analysis!.important_folders;
  const entryPoints = analysis!.summary.entryPoints;
  const configFiles = analysis!.summary.configurationFiles;

  const filteredFolders = useMemo(
    () => folders.filter((f) => f.path.toLowerCase().includes(query.toLowerCase())),
    [folders, query]
  );
  const filteredEntryPoints = useMemo(
    () => entryPoints.filter((p) => p.toLowerCase().includes(query.toLowerCase())),
    [entryPoints, query]
  );
  const filteredConfigFiles = useMemo(
    () => configFiles.filter((p) => p.toLowerCase().includes(query.toLowerCase())),
    [configFiles, query]
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      <Card padding="sm" className="lg:col-span-2 h-fit">
        <div className="p-2 pb-3">
          <div className="flex items-center gap-2 bg-surface-elevated border border-border rounded-lg px-3 py-2 mb-3">
            <Search size={14} className="text-ink-faint" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search known paths..."
              className="bg-transparent text-sm text-ink placeholder:text-ink-faint focus:outline-none flex-1"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              value={manualPath}
              onChange={(e) => setManualPath(e.target.value)}
              placeholder="Explain any path, e.g. src/App.tsx"
              className="flex-1 bg-surface-elevated border border-border rounded-lg px-3 py-2 text-xs font-mono text-ink placeholder:text-ink-faint focus:outline-none focus:ring-1 focus:ring-accent-indigo/50"
            />
            <button
              disabled={!manualPath.trim()}
              onClick={() => {
                const isLikelyFolder = !manualPath.includes(".") || manualPath.endsWith("/");
                setTarget({ type: isLikelyFolder ? "folder" : "file", path: manualPath.replace(/\/$/, "") });
              }}
              className="shrink-0 w-8 h-8 rounded-lg bg-surface-elevated border border-border text-ink-muted hover:text-ink hover:border-accent-indigo/40 disabled:opacity-40 flex items-center justify-center transition-colors"
              aria-label="Explain path"
            >
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        <div className="max-h-[560px] overflow-y-auto px-2 pb-2 space-y-4">
          <div>
            <p className="text-xs font-mono uppercase tracking-wide text-ink-faint px-2 mb-1.5">Important folders</p>
            {filteredFolders.length === 0 ? (
              <p className="text-xs text-ink-faint px-2">None found.</p>
            ) : (
              filteredFolders.map((folder) => (
                <button
                  key={folder.path}
                  onClick={() => setTarget({ type: "folder", path: folder.path })}
                  className={cn(
                    "w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-left transition-colors",
                    target?.path === folder.path ? "bg-signal-gradient-soft text-ink" : "hover:bg-surface-hover text-ink-muted"
                  )}
                >
                  <Folder size={14} className="text-accent-cyan shrink-0" />
                  <span className="text-sm font-mono truncate">{folder.path}</span>
                  <Badge variant="neutral">{folder.category}</Badge>
                </button>
              ))
            )}
          </div>

          <div>
            <p className="text-xs font-mono uppercase tracking-wide text-ink-faint px-2 mb-1.5">Entry points</p>
            {filteredEntryPoints.length === 0 ? (
              <p className="text-xs text-ink-faint px-2">None found.</p>
            ) : (
              filteredEntryPoints.map((path) => (
                <button
                  key={path}
                  onClick={() => setTarget({ type: "file", path })}
                  className={cn(
                    "w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-left transition-colors",
                    target?.path === path ? "bg-signal-gradient-soft text-ink" : "hover:bg-surface-hover text-ink-muted"
                  )}
                >
                  <FileCode size={14} className="text-ink-faint shrink-0" />
                  <span className="text-sm font-mono truncate">{path}</span>
                </button>
              ))
            )}
          </div>

          <div>
            <p className="text-xs font-mono uppercase tracking-wide text-ink-faint px-2 mb-1.5">Configuration files</p>
            {filteredConfigFiles.length === 0 ? (
              <p className="text-xs text-ink-faint px-2">None found.</p>
            ) : (
              filteredConfigFiles.map((path) => (
                <button
                  key={path}
                  onClick={() => setTarget({ type: "file", path })}
                  className={cn(
                    "w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-left transition-colors",
                    target?.path === path ? "bg-signal-gradient-soft text-ink" : "hover:bg-surface-hover text-ink-muted"
                  )}
                >
                  <FileCode size={14} className="text-ink-faint shrink-0" />
                  <span className="text-sm font-mono truncate">{path}</span>
                </button>
              ))
            )}
          </div>
        </div>
      </Card>

      <div className="lg:col-span-3">
        {target ? (
          <ExplanationPanel key={`${target.type}:${target.path}`} target={target} />
        ) : (
          <Card padding="lg" className="flex flex-col items-center justify-center text-center py-20">
            <Compass size={26} className="text-ink-faint mb-4" />
            <p className="text-sm text-ink-muted max-w-xs">
              Pick a folder or file on the left — or type a known path — to get an AI explanation.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}

export default function ExplorerPage() {
  return (
    <div>
      <SectionHeader
        eyebrow="AI-generated"
        title="Explorer"
        description="Browse the structure the Intelligence Engine already mapped, and ask AI to explain any folder or file."
        action={<Badge variant="neutral"><FolderTree size={12} className="mr-1" />Known paths only</Badge>}
      />
      <RequiresIntelligenceAnalysis>
        <ExplorerContent />
      </RequiresIntelligenceAnalysis>
    </div>
  );
}
