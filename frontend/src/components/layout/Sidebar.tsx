import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { NavLink, useParams } from "react-router-dom";
import {
  LayoutDashboard,
  Network,
  FolderTree,
  Zap,
  Mic,
  Sparkles,
  FileText,
  Settings,
  Compass,
  Clock,
  Plus,
  Github,
  FileCode2,
  X,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { api } from "@/services/api";
import type { Repository } from "@/types";
import { formatRelativeTime } from "@/utils/formatters";

const repoNavItems = [
  { label: "Overview", to: "overview", icon: LayoutDashboard },
  { label: "Architecture", to: "architecture", icon: Network },
  { label: "Explorer", to: "explorer", icon: FolderTree },
  { label: "API Explorer", to: "api-explorer", icon: Zap },
  { label: "Interview Mode", to: "interview", icon: Mic },
  { label: "Improvements", to: "improvements", icon: Sparkles },
  { label: "README", to: "readme", icon: FileText },
];

interface SidebarProps {
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function Sidebar({ isMobileOpen = false, onCloseMobile }: SidebarProps) {
  const { repositoryId } = useParams<{ repositoryId: string }>();
  const [activeRepo, setActiveRepo] = useState<Repository | null>(null);
  const [recentRepositories, setRecentRepositories] = useState<Repository[]>([]);

  useEffect(() => {
    api
      .listRepositories()
      .then(({ repositories }) => setRecentRepositories(repositories.slice(0, 6)))
      .catch(() => setRecentRepositories([]));
  }, [repositoryId]);

  useEffect(() => {
    if (!repositoryId) {
      setActiveRepo(null);
      return;
    }
    api
      .getRepository(repositoryId)
      .then(({ repository }) => setActiveRepo(repository))
      .catch(() => setActiveRepo(null));
  }, [repositoryId]);

  const sidebarContent = (
    <>
      <div className="flex items-center justify-between px-6 h-16 border-b border-border shrink-0">
        <NavLink to="/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-signal-gradient flex items-center justify-center">
            <Compass size={16} className="text-white" />
          </div>
          <span className="font-display font-semibold text-ink tracking-tight">RepoMentor</span>
        </NavLink>
        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="md:hidden text-ink-muted hover:text-ink transition-colors"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {repositoryId && (
          <div className="px-3 pt-4">
            <NavLink
              to={`/dashboard/${repositoryId}`}
              end
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2.5 px-3 py-2.5 rounded-xl mb-1 border transition-colors",
                  isActive
                    ? "bg-signal-gradient-soft border-accent-indigo/25 text-ink"
                    : "border-transparent text-ink-muted hover:text-ink hover:bg-surface-hover"
                )
              }
            >
              <div className="w-6 h-6 rounded-md bg-surface-elevated border border-border flex items-center justify-center shrink-0">
                {activeRepo?.source === "github" ? (
                  <Github size={12} className="text-ink-muted" />
                ) : (
                  <FileCode2 size={12} className="text-ink-muted" />
                )}
              </div>
              <span className="text-sm font-mono truncate">{activeRepo?.name ?? "Loading..."}</span>
            </NavLink>

            <nav className="space-y-1 mt-2">
              {repoNavItems.map(({ label, to, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={`/dashboard/${repositoryId}/${to}`}
                  className={({ isActive }) =>
                    cn(
                      "relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                      isActive ? "text-ink" : "text-ink-muted hover:text-ink hover:bg-surface-hover"
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <motion.div
                          layoutId="sidebar-active"
                          className="absolute inset-0 bg-signal-gradient-soft border border-accent-indigo/20 rounded-xl"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                        />
                      )}
                      <Icon size={17} className="relative" />
                      <span className="relative">{label}</span>
                    </>
                  )}
                </NavLink>
              ))}
            </nav>
          </div>
        )}

        <div className="px-3 pt-5 pb-2">
          <div className="flex items-center justify-between px-3 mb-2">
            <span className="text-xs font-mono uppercase tracking-wide text-ink-faint flex items-center gap-1.5">
              <Clock size={12} />
              Recent
            </span>
            <NavLink to="/upload" className="text-ink-faint hover:text-accent-cyan transition-colors">
              <Plus size={14} />
            </NavLink>
          </div>
          <div className="space-y-0.5">
            {recentRepositories.length === 0 ? (
              <p className="px-3 text-xs text-ink-faint">No repositories yet.</p>
            ) : (
              recentRepositories.map((repo) => (
                <NavLink
                  key={repo.id}
                  to={`/dashboard/${repo.id}`}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-xs transition-colors",
                      isActive ? "bg-surface-hover text-ink" : "text-ink-muted hover:text-ink hover:bg-surface-hover"
                    )
                  }
                >
                  <span className="font-mono truncate">{repo.owner ? `${repo.owner}/${repo.name}` : repo.name}</span>
                  <span className="text-ink-faint shrink-0">{formatRelativeTime(repo.upload_time)}</span>
                </NavLink>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="p-3 border-t border-border shrink-0">
        <NavLink
          to="/dashboard/settings"
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
              isActive ? "bg-surface-hover text-ink" : "text-ink-muted hover:text-ink hover:bg-surface-hover"
            )
          }
        >
          <Settings size={17} />
          Settings
        </NavLink>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop: always-visible static sidebar */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 h-screen sticky top-0 border-r border-border bg-surface/50 backdrop-blur-xl">
        {sidebarContent}
      </aside>

      {/* Mobile: slide-in drawer with backdrop */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onCloseMobile}
              className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
              aria-hidden="true"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.25, ease: "easeOut" }}
              className="md:hidden fixed inset-y-0 left-0 z-50 flex flex-col w-72 bg-surface border-r border-border"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
