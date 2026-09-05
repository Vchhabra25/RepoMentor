import { useMemo, useState } from "react";
import { Zap, Search, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { RequiresIntelligenceAnalysis } from "@/components/ai/RequiresIntelligenceAnalysis";
import { AgentStreamPanel } from "@/components/ai/AgentStreamPanel";
import { useAgentStream } from "@/hooks/useAgentStream";
import { useRepositoryWorkspace } from "@/hooks/useRepositoryWorkspace";
import { aiApi } from "@/services/api";
import type { ApiDocumentationResponse, ApiEndpointDoc } from "@/types/ai";
import { cn } from "@/utils/cn";

const LOADING_MESSAGES = ["📂 Reading route files...", "🔍 Following imports...", "⚡ Connecting components..."];

const methodStyles: Record<string, string> = {
  GET: "text-accent-cyan bg-accent-cyan/10 border-accent-cyan/20",
  POST: "text-state-success bg-state-success/10 border-state-success/20",
  PUT: "text-accent-amber bg-accent-amber/10 border-accent-amber/20",
  PATCH: "text-accent-amber bg-accent-amber/10 border-accent-amber/20",
  DELETE: "text-state-danger bg-state-danger/10 border-state-danger/20",
};

function EndpointCard({ endpoint }: { endpoint: ApiEndpointDoc }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card padding="md" className="overflow-hidden">
      <button onClick={() => setIsOpen((v) => !v)} className="w-full flex items-center gap-4 text-left">
        <span
          className={cn(
            "text-xs font-mono font-medium px-2.5 py-1 rounded-md border w-16 text-center shrink-0",
            methodStyles[endpoint.method] ?? "text-ink-muted bg-surface-hover border-border"
          )}
        >
          {endpoint.method}
        </span>
        <span className="text-sm font-mono text-ink truncate flex-1">{endpoint.endpoint}</span>
        <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={15} className="text-ink-muted" />
        </motion.span>
      </button>
      <p className="text-sm text-ink-muted mt-2.5 ml-[76px]">{endpoint.purpose}</p>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <div className="ml-[76px] mt-4 pt-4 border-t border-border grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-ink-faint mb-1">Request</p>
                <p className="text-ink-muted font-mono text-xs">{endpoint.request}</p>
              </div>
              <div>
                <p className="text-xs text-ink-faint mb-1">Response</p>
                <p className="text-ink-muted font-mono text-xs">{endpoint.response}</p>
              </div>
              <div>
                <p className="text-xs text-ink-faint mb-1">Authentication</p>
                <p className="text-ink-muted font-mono text-xs">{endpoint.authentication}</p>
              </div>
              <div>
                <p className="text-xs text-ink-faint mb-1">Errors</p>
                {endpoint.errors.length === 0 ? (
                  <p className="text-ink-faint text-xs">None documented</p>
                ) : (
                  <ul className="space-y-1">
                    {endpoint.errors.map((e) => (
                      <li key={e} className="text-ink-muted font-mono text-xs">
                        {e}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

function ApiExplorerContent() {
  const { repository } = useRepositoryWorkspace();
  const [query, setQuery] = useState("");

  const result = useAgentStream<ApiDocumentationResponse>(
    (signal) => aiApi.apiDocumentation(repository!.id, signal),
    [repository?.id]
  );

  const filtered = useMemo(() => {
    if (!result.data) return [];
    if (!query.trim()) return result.data.endpoints;
    const q = query.toLowerCase();
    return result.data.endpoints.filter(
      (e) => e.endpoint.toLowerCase().includes(q) || e.method.toLowerCase().includes(q) || e.purpose.toLowerCase().includes(q)
    );
  }, [result.data, query]);

  return (
    <AgentStreamPanel
      title="Endpoints"
      icon={Zap}
      loadingMessages={LOADING_MESSAGES}
      result={result}
      bodyActions={
        result.data && result.data.endpoints.length > 0 ? (
          <div className="flex items-center gap-2 bg-surface-elevated border border-border rounded-lg px-3 py-2 max-w-sm">
            <Search size={14} className="text-ink-faint" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search endpoints..."
              className="bg-transparent text-sm text-ink placeholder:text-ink-faint focus:outline-none flex-1"
            />
          </div>
        ) : undefined
      }
      renderData={() =>
        filtered.length === 0 ? (
          <p className="text-sm text-ink-faint text-center py-8">
            {result.data?.endpoints.length === 0
              ? "No API endpoints were found in this repository's routes or entry points."
              : "No endpoints match your search."}
          </p>
        ) : (
          <div className="space-y-3">
            {filtered.map((endpoint, i) => (
              <EndpointCard key={`${endpoint.method}-${endpoint.endpoint}-${i}`} endpoint={endpoint} />
            ))}
          </div>
        )
      }
    />
  );
}

export default function ApiExplorerPage() {
  return (
    <div>
      <SectionHeader
        eyebrow="AI-generated"
        title="API Explorer"
        description="Endpoints documented from this repository's route and controller source."
      />
      <RequiresIntelligenceAnalysis>
        <ApiExplorerContent />
      </RequiresIntelligenceAnalysis>
    </div>
  );
}
