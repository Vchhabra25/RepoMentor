import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Github, FileCode2, Plus, FolderGit2, HardDrive } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { ErrorCard } from "@/components/ui/ErrorCard";
import { api, ApiError } from "@/services/api";
import type { Repository } from "@/types";
import { formatBytes, formatRelativeTime } from "@/utils/formatters";

const statusVariant: Record<Repository["status"], "success" | "cyan" | "amber" | "danger" | "neutral"> = {
  Queued: "neutral",
  Uploading: "cyan",
  Extracting: "cyan",
  Preparing: "amber",
  Ready: "success",
  Failed: "danger",
};

export default function HomeDashboardPage() {
  const navigate = useNavigate();
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setIsLoading(true);
    setError(null);
    try {
      const { repositories } = await api.listRepositories();
      setRepositories(repositories);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't load your repositories right now.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <SectionHeader
        eyebrow="Workspace"
        title="Your repositories"
        description="Pick a repository to explore its architecture, ask its Interview Coach, or generate a README."
        action={
          <Button icon={<Plus size={16} />} onClick={() => navigate("/upload")}>
            Ingest repository
          </Button>
        }
      />

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[0, 1, 2].map((i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <ErrorCard message={error} onRetry={load} />
      ) : repositories.length === 0 ? (
        <Card padding="lg" className="text-center py-16">
          <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-surface-elevated border border-border flex items-center justify-center">
            <FolderGit2 size={24} className="text-ink-muted" />
          </div>
          <h3 className="text-base font-medium text-ink mb-1.5">No repositories yet</h3>
          <p className="text-sm text-ink-muted max-w-sm mx-auto mb-6">
            Upload a .zip or point RepoMentor at a public GitHub repository to get started.
          </p>
          <Button icon={<Plus size={16} />} onClick={() => navigate("/upload")}>
            Ingest your first repository
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {repositories.map((repo, i) => (
            <motion.div
              key={repo.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: i * 0.04 }}
            >
              <Card
                padding="lg"
                hoverable
                className="cursor-pointer h-full flex flex-col"
                onClick={() => navigate(`/dashboard/${repo.id}`)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-9 h-9 rounded-lg bg-surface-elevated border border-border flex items-center justify-center">
                    {repo.source === "github" ? (
                      <Github size={16} className="text-ink-muted" />
                    ) : (
                      <FileCode2 size={16} className="text-ink-muted" />
                    )}
                  </div>
                  <Badge variant={statusVariant[repo.status]}>{repo.status}</Badge>
                </div>

                <p className="text-sm font-mono text-ink font-medium truncate mb-1">
                  {repo.owner ? `${repo.owner}/${repo.name}` : repo.name}
                </p>
                <p className="text-xs text-ink-faint mb-4">{repo.primary_language ?? "Language unknown"}</p>

                <div className="mt-auto flex items-center justify-between text-xs text-ink-faint pt-3 border-t border-border">
                  <span className="flex items-center gap-1">
                    <HardDrive size={12} />
                    {formatBytes(repo.size_bytes)}
                  </span>
                  <span>{formatRelativeTime(repo.upload_time)}</span>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
