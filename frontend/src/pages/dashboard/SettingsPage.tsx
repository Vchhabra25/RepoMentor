import { ShieldCheck, ShieldAlert, Flame, Moon, Info, LogOut, Cpu, Zap, FileText, Trash2 } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Toggle } from "@/components/ui/Toggle";
import { useAuth } from "@/hooks/useAuth";
import { usePreferences, PREFERENCES_STORAGE_KEY } from "@/hooks/usePreferences";

export default function SettingsPage() {
  const { user, isConfigured, logout } = useAuth();
  const { preferences, update } = usePreferences();

  function clearCache() {
    localStorage.removeItem(PREFERENCES_STORAGE_KEY);
    window.location.reload();
  }

  return (
    <div>
      <SectionHeader eyebrow="Workspace" title="Settings" description="Account, AI behavior, and app information." />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card padding="lg">
          <div className="flex items-center gap-2 mb-5">
            <Cpu size={17} className="text-accent-cyan" />
            <h3 className="text-base font-medium text-ink">AI provider</h3>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-ink-muted">Active provider</span>
              <Badge variant="cyan">Claude (Anthropic)</Badge>
            </div>
            <p className="text-xs text-ink-faint leading-relaxed">
              The AI Orchestrator is provider-agnostic — additional providers can be added later without changing
              agents, prompts, or the frontend.
            </p>
          </div>
        </Card>

        <Card padding="lg">
          <div className="flex items-center gap-2 mb-5">
            <Zap size={17} className="text-accent-amber" />
            <h3 className="text-base font-medium text-ink">Streaming</h3>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-ink">Show live streaming preview</p>
              <p className="text-xs text-ink-faint mt-0.5">
                Display the AI's raw output as it generates, before it's formatted.
              </p>
            </div>
            <Toggle
              checked={preferences.showStreamingPreview}
              onChange={(v) => update({ showStreamingPreview: v })}
              label="Show live streaming preview"
            />
          </div>
        </Card>

        <Card padding="lg">
          <div className="flex items-center gap-2 mb-5">
            <FileText size={17} className="text-ink-muted" />
            <h3 className="text-base font-medium text-ink">Markdown rendering</h3>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-ink">Rich formatting</p>
              <p className="text-xs text-ink-faint mt-0.5">Render AI responses as styled markdown instead of plain text.</p>
            </div>
            <Toggle checked={preferences.richMarkdown} onChange={(v) => update({ richMarkdown: v })} label="Rich markdown formatting" />
          </div>
        </Card>

        <Card padding="lg">
          <div className="flex items-center gap-2 mb-5">
            <Trash2 size={17} className="text-state-danger" />
            <h3 className="text-base font-medium text-ink">Clear local cache</h3>
          </div>
          <p className="text-sm text-ink-muted mb-4">
            Resets locally stored preferences and reloads the app. AI response caching itself lives server-side, keyed
            to each repository's analysis.
          </p>
          <Button variant="outline" size="sm" icon={<Trash2 size={14} />} onClick={clearCache}>
            Clear cache
          </Button>
        </Card>

        <Card padding="lg">
          <div className="flex items-center gap-2 mb-5">
            {user ? (
              <ShieldCheck size={17} className="text-state-success" />
            ) : (
              <ShieldAlert size={17} className="text-accent-amber" />
            )}
            <h3 className="text-base font-medium text-ink">Authentication status</h3>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-ink-muted">Signed in</span>
              <Badge variant={user ? "success" : "neutral"}>{user ? "Yes" : "No"}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-muted">Account type</span>
              <span className="text-ink font-mono">{user?.isAnonymous ? "Guest" : user ? "Google" : "—"}</span>
            </div>
            {user && (
              <Button variant="outline" size="sm" className="mt-2" icon={<LogOut size={14} />} onClick={logout}>
                Sign out
              </Button>
            )}
          </div>
        </Card>

        <Card padding="lg">
          <div className="flex items-center gap-2 mb-5">
            <Flame size={17} className="text-accent-amber" />
            <h3 className="text-base font-medium text-ink">Firebase status</h3>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-ink-muted">Configuration</span>
              <Badge variant={isConfigured ? "success" : "danger"}>{isConfigured ? "Connected" : "Not configured"}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-muted">Firestore</span>
              <Badge variant={isConfigured ? "success" : "neutral"}>{isConfigured ? "Initialized" : "Idle"}</Badge>
            </div>
          </div>
        </Card>

        <Card padding="lg">
          <div className="flex items-center gap-2 mb-5">
            <Moon size={17} className="text-accent-cyan" />
            <h3 className="text-base font-medium text-ink">Theme</h3>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-ink-muted">Appearance</span>
            <span className="text-ink font-mono">Dark (default)</span>
          </div>
        </Card>

        <Card padding="lg">
          <div className="flex items-center gap-2 mb-5">
            <Info size={17} className="text-ink-muted" />
            <h3 className="text-base font-medium text-ink">About</h3>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-ink-muted">Version</span>
              <span className="text-ink font-mono">0.2.0 — AI layer live</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-muted">Build</span>
              <span className="text-ink font-mono">Repository Intelligence + AI Orchestrator</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
