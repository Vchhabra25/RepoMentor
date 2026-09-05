import { useEffect, useId, useRef, useState } from "react";

let didInit = false;

async function ensureInitialized() {
  const mermaid = (await import("mermaid")).default;
  if (didInit) return mermaid;
  mermaid.initialize({
    startOnLoad: false,
    theme: "dark",
    securityLevel: "strict",
    fontFamily: "Inter, sans-serif",
    themeVariables: {
      background: "#12151D",
      primaryColor: "#171B26",
      primaryTextColor: "#E8EAF0",
      primaryBorderColor: "#7C6CF0",
      lineColor: "#565D72",
      secondaryColor: "#171B26",
      tertiaryColor: "#0A0C11",
      fontSize: "14px",
    },
  });
  didInit = true;
  return mermaid;
}

export function MermaidDiagram({ chart }: { chart: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const rawId = useId().replace(/[^a-zA-Z0-9]/g, "");

  useEffect(() => {
    if (!chart?.trim()) return;
    let cancelled = false;

    ensureInitialized()
      .then((mermaid) => mermaid.render(`mermaid-${rawId}`, chart))
      .then(({ svg }) => {
        if (!cancelled && containerRef.current) {
          containerRef.current.innerHTML = svg;
        }
      })
      .catch(() => {
        if (!cancelled) setError("Couldn't render this diagram.");
      });

    return () => {
      cancelled = true;
    };
  }, [chart, rawId]);

  if (!chart?.trim()) return null;

  if (error) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-surface/40 p-6 text-center">
        <p className="text-sm text-ink-faint">{error}</p>
      </div>
    );
  }

  return <div ref={containerRef} className="overflow-x-auto rounded-xl border border-border bg-base/60 p-4" />;
}
