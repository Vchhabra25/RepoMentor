import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/utils/cn";
import { usePreferences } from "@/hooks/usePreferences";

interface StreamingMarkdownProps {
  content: string;
  isStreaming?: boolean;
  className?: string;
}

export function StreamingMarkdown({ content, isStreaming, className }: StreamingMarkdownProps) {
  const { preferences } = usePreferences();

  return (
    <div className={cn("prose-content", className)}>
      {preferences.richMarkdown ? (
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      ) : (
        <pre className="whitespace-pre-wrap font-body text-[0.925rem] text-ink-muted leading-relaxed">{content}</pre>
      )}
      {isStreaming && <span className="inline-block w-1.5 h-4 bg-accent-cyan ml-0.5 align-middle animate-pulseGlow" />}
    </div>
  );
}
