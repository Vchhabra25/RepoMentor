import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Github,
  ArrowRight,
  Clock,
  Compass,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  FolderGit2,
  FileCode2,
  HardDrive,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Loader } from "@/components/ui/Loader";
import { Badge } from "@/components/ui/Badge";
import { UploadZone } from "@/components/upload/UploadZone";
import { api, ApiError } from "@/services/api";
import type { Repository } from "@/types";
import { formatBytes, formatRelativeTime } from "@/utils/formatters";

type Phase = "idle" | "uploading" | "processing" | "success" | "error";

const PROCESSING_MESSAGES = [
  "🧠 Reading your repository...",
  "📂 Exploring folders...",
  "🧹 Clearing out build artifacts...",
  "🔍 Finding dependencies...",
  "🎯 Preparing workspace...",
];

const statusVariant: Record<Repository["status"], "success" | "cyan" | "amber" | "danger" | "neutral"> = {
  Queued: "neutral",
  Uploading: "cyan",
  Extracting: "cyan",
  Preparing: "amber",
  Ready: "success",
  Failed: "danger",
};

export default function UploadPage() {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [githubUrl, setGithubUrl] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [uploadPercent, setUploadPercent] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [result, setResult] = useState<Repository | null>(null);
  const [recentRepositories, setRecentRepositories] = useState<Repository[]>([]);
  const [isLoadingRecent, setIsLoadingRecent] = useState(true);

  async function loadRecent() {
    try {
      const { repositories } = await api.listRepositories();
      setRecentRepositories(repositories);
    } catch {
      // Recent uploads are a convenience list — a failure here shouldn't block the page.
    } finally {
      setIsLoadingRecent(false);
    }
  }

  useEffect(() => {
    loadRecent();
  }, []);

  function resetToIdle() {
    setPhase("idle");
    setErrorMessage(null);
    setUploadPercent(0);
  }

  async function handleAnalyze() {
    setErrorMessage(null);

    if (file) {
      setPhase("uploading");
      setUploadPercent(0);
      try {
        const { repository } = await api.uploadRepository(file, (percent) => {
          setUploadPercent(percent);
          if (percent >= 100) setPhase("processing");
        });
        setResult(repository);
        setPhase("success");
        loadRecent();
      } catch (err) {
        setErrorMessage(err instanceof ApiError ? err.message : "Something went wrong during upload.");
        setPhase("error");
      }
      return;
    }

    if (githubUrl) {
      setPhase("processing");
      try {
        const { repository } = await api.ingestGithubRepository(githubUrl);
        setResult(repository);
        setPhase("success");
        loadRecent();
      } catch (err) {
        setErrorMessage(err instanceof ApiError ? err.message : "Something went wrong during ingestion.");
        setPhase("error");
      }
    }
  }

  if (phase === "uploading" || phase === "processing") {
    return (
      <div className="min-h-screen bg-base grid-bg flex items-center justify-center px-6">
        <div className="w-full max-w-sm text-center">
          {phase === "uploading" ? (
            <>
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-signal-gradient-soft border border-accent-indigo/20 flex items-center justify-center">
                <span className="text-2xl font-display font-semibold text-accent-cyan">
                  {uploadPercent}%
                </span>
              </div>
              <div className="h-2 rounded-full bg-surface-elevated border border-border overflow-hidden mb-4">
                <motion.div
                  className="h-full bg-signal-gradient"
                  initial={{ width: 0 }}
                  animate={{ width: `${uploadPercent}%` }}
                  transition={{ ease: "easeOut" }}
                />
              </div>
              <p className="text-sm text-ink-muted font-mono">📤 Uploading {file?.name}...</p>
            </>
          ) : (
            <Loader size="lg" messages={PROCESSING_MESSAGES} />
          )}
        </div>
      </div>
    );
  }

  if (phase === "success" && result) {
    return (
      <div className="min-h-screen bg-base grid-bg flex items-center justify-center px-6">
        <Card padding="lg" className="w-full max-w-md text-center">
          <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-state-success/10 border border-state-success/20 flex items-center justify-center">
            <CheckCircle2 size={26} className="text-state-success" />
          </div>
          <h1 className="text-xl font-display font-semibold text-ink mb-1">Repository ready</h1>
          <p className="text-sm text-ink-muted font-mono mb-6">
            {result.owner ? `${result.owner}/${result.name}` : result.name}
          </p>

          <div className="grid grid-cols-2 gap-3 text-left mb-8">
            <div className="rounded-lg bg-surface-elevated border border-border px-3 py-2.5">
              <p className="text-xs text-ink-faint">Language</p>
              <p className="text-sm text-ink font-mono">{result.primary_language ?? "—"}</p>
            </div>
            <div className="rounded-lg bg-surface-elevated border border-border px-3 py-2.5">
              <p className="text-xs text-ink-faint">Size</p>
              <p className="text-sm text-ink font-mono">{formatBytes(result.size_bytes)}</p>
            </div>
            <div className="rounded-lg bg-surface-elevated border border-border px-3 py-2.5">
              <p className="text-xs text-ink-faint">Files</p>
              <p className="text-sm text-ink font-mono">{result.file_count}</p>
            </div>
            <div className="rounded-lg bg-surface-elevated border border-border px-3 py-2.5">
              <p className="text-xs text-ink-faint">Folders</p>
              <p className="text-sm text-ink font-mono">{result.folder_count}</p>
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            <Button
              size="lg"
              icon={<ArrowRight size={18} />}
              iconPosition="right"
              onClick={() => navigate(`/dashboard/${result.id}`)}
            >
              Open repository
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setFile(null);
                setGithubUrl("");
                setResult(null);
                resetToIdle();
              }}
            >
              Ingest another
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base grid-bg px-6 py-10">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-2.5 mb-10">
          <div className="w-8 h-8 rounded-lg bg-signal-gradient flex items-center justify-center">
            <Compass size={16} className="text-white" />
          </div>
          <span className="font-display font-semibold text-ink">RepoMentor AI</span>
        </div>

        <h1 className="text-3xl font-display font-semibold text-ink mb-2">Bring your codebase</h1>
        <p className="text-ink-muted mb-10">Upload a .zip file or point us to a public GitHub repository.</p>

        <AnimatePresence>
          {phase === "error" && errorMessage && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 flex items-start gap-3 rounded-xl border border-state-danger/30 bg-state-danger/10 px-4 py-3.5 text-left overflow-hidden"
            >
              <AlertCircle size={18} className="text-state-danger shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-ink font-medium mb-0.5">Ingestion failed</p>
                <p className="text-sm text-ink-muted">{errorMessage}</p>
              </div>
              <button
                onClick={resetToIdle}
                className="text-ink-muted hover:text-ink transition-colors"
                aria-label="Dismiss"
              >
                <RotateCcw size={16} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <UploadZone onFileSelected={(f) => { setFile(f); setGithubUrl(""); }} selectedFile={file} />

        <div className="flex items-center gap-4 my-8">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs font-mono text-ink-faint uppercase">or</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <Card padding="md">
          <label className="text-sm font-medium text-ink mb-2 flex items-center gap-2">
            <Github size={16} className="text-ink-muted" />
            GitHub repository URL
          </label>
          <div className="flex gap-3 mt-3">
            <input
              value={githubUrl}
              onChange={(e) => {
                setGithubUrl(e.target.value);
                setFile(null);
              }}
              placeholder="https://github.com/organization/repository"
              className="flex-1 bg-surface-elevated border border-border rounded-lg px-4 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-accent-indigo/50"
            />
          </div>
        </Card>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: file || githubUrl ? 1 : 0.5 }}
          className="mt-8 flex justify-end"
        >
          <Button
            size="lg"
            icon={<ArrowRight size={18} />}
            iconPosition="right"
            disabled={!file && !githubUrl}
            onClick={handleAnalyze}
          >
            Analyze repository
          </Button>
        </motion.div>

        <div className="mt-16">
          <h2 className="text-sm font-medium text-ink-muted mb-4 flex items-center gap-2">
            <Clock size={15} />
            Recent repositories
          </h2>

          {isLoadingRecent ? (
            <div className="space-y-2">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-[52px] rounded-xl bg-surface/40 border border-border animate-pulse" />
              ))}
            </div>
          ) : recentRepositories.length === 0 ? (
            <div className="text-center py-10 rounded-xl border border-dashed border-border bg-surface/30">
              <FolderGit2 size={22} className="text-ink-faint mx-auto mb-2" />
              <p className="text-sm text-ink-faint">No repositories ingested yet.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {recentRepositories.map((repo) => (
                <button
                  key={repo.id}
                  onClick={() => navigate(`/dashboard/${repo.id}`)}
                  className="w-full flex items-center justify-between glass rounded-xl px-4 py-3.5 text-left hover:border-accent-indigo/40 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-surface-elevated border border-border flex items-center justify-center shrink-0">
                      {repo.source === "github" ? (
                        <Github size={14} className="text-ink-muted" />
                      ) : (
                        <FileCode2 size={14} className="text-ink-muted" />
                      )}
                    </div>
                    <span className="text-sm text-ink font-mono truncate">
                      {repo.owner ? `${repo.owner}/${repo.name}` : repo.name}
                    </span>
                    <Badge variant={statusVariant[repo.status]}>{repo.status}</Badge>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 text-xs text-ink-faint">
                    <span className="hidden sm:flex items-center gap-1">
                      <HardDrive size={12} />
                      {formatBytes(repo.size_bytes)}
                    </span>
                    <span>{formatRelativeTime(repo.upload_time)}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
