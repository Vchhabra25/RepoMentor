import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { RefreshCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Loader } from "@/components/ui/Loader";
import { ErrorCard } from "@/components/ui/ErrorCard";
import { StreamingRawPreview } from "@/components/ui/StreamingRawPreview";
import { usePreferences } from "@/hooks/usePreferences";
import type { UseAgentStreamResult } from "@/hooks/useAgentStream";

interface AgentStreamPanelProps<T> {
  title: string;
  icon?: LucideIcon;
  loadingMessages: string[];
  result: UseAgentStreamResult<T>;
  renderData: (data: T) => ReactNode;
  headerActions?: ReactNode;
  bodyActions?: ReactNode;
}

export function AgentStreamPanel<T>({
  title,
  icon: Icon,
  loadingMessages,
  result,
  renderData,
  headerActions,
  bodyActions,
}: AgentStreamPanelProps<T>) {
  const { status, text, data, error, regenerate } = result;
  const { preferences } = usePreferences();

  return (
    <Card padding="lg">
      <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
        <h3 className="text-base font-medium text-ink flex items-center gap-2">
          {Icon && <Icon size={16} className="text-ink-muted" />}
          {title}
        </h3>
        <div className="flex items-center gap-2">
          {status === "cached" && <Badge variant="neutral">Cached</Badge>}
          {headerActions}
          {(status === "done" || status === "cached" || status === "error") && (
            <Button variant="ghost" size="sm" icon={<RefreshCcw size={13} />} onClick={regenerate}>
              Regenerate
            </Button>
          )}
        </div>
      </div>

      {bodyActions && <div className="mb-5">{bodyActions}</div>}

      <AnimatePresence mode="wait">
        {status === "idle" || (status === "streaming" && !text) ? (
          <motion.div key="loading" exit={{ opacity: 0 }}>
            <Loader messages={loadingMessages} />
          </motion.div>
        ) : status === "error" ? (
          <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <ErrorCard message={error ?? "Something went wrong."} onRetry={regenerate} />
          </motion.div>
        ) : status === "streaming" ? (
          preferences.showStreamingPreview ? (
            <motion.div key="streaming" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <StreamingRawPreview text={text} />
            </motion.div>
          ) : (
            <motion.div key="streaming-quiet" exit={{ opacity: 0 }}>
              <Loader messages={loadingMessages} />
            </motion.div>
          )
        ) : data ? (
          <motion.div key="data" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
            {renderData(data)}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </Card>
  );
}
