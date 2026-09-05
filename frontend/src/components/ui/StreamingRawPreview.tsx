export function StreamingRawPreview({ text }: { text: string }) {
  return (
    <div className="rounded-xl border border-border bg-base/80 p-4 font-mono text-xs text-ink-faint max-h-56 overflow-y-auto whitespace-pre-wrap leading-relaxed">
      {text || "Connecting..."}
      <span className="inline-block w-1.5 h-3.5 bg-accent-cyan ml-0.5 align-middle animate-pulseGlow" />
    </div>
  );
}
