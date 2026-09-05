import { useCallback, useEffect, useRef, useState } from "react";
import type { AgentStreamEvent } from "@/types/ai";
import { ApiError } from "@/services/api";

export type AgentStreamStatus = "idle" | "streaming" | "done" | "cached" | "error";

export interface UseAgentStreamResult<T> {
  status: AgentStreamStatus;
  /** Raw text accumulated so far — only populated for a freshly-generated (non-cached) stream. */
  text: string;
  /** Parsed structured response, available once status is "done" or "cached". */
  data: T | null;
  error: string | null;
  isActive: boolean;
  /** Re-runs the agent from scratch (bypasses nothing server-side, but forces a fresh client call). */
  regenerate: () => void;
}

/**
 * Drives a single AI Orchestrator SSE stream. `streamFactory` is called
 * once per run and must return the async generator for that run (so a
 * fresh AbortController/fetch is created each time regenerate() fires).
 *
 * Streams start automatically when `deps` change (e.g. a repository id or
 * a folder/file path); pass `enabled={false}` to wait for an explicit
 * trigger (regenerate()) instead — used for expensive/optional agents.
 */
export function useAgentStream<T>(
  streamFactory: (signal: AbortSignal) => AsyncGenerator<AgentStreamEvent<T>>,
  deps: React.DependencyList,
  options?: { enabled?: boolean }
): UseAgentStreamResult<T> {
  const enabled = options?.enabled ?? true;
  const [status, setStatus] = useState<AgentStreamStatus>("idle");
  const [text, setText] = useState("");
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const runIdRef = useRef(0);

  const run = useCallback(() => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    const runId = ++runIdRef.current;

    setStatus("streaming");
    setText("");
    setData(null);
    setError(null);

    (async () => {
      try {
        for await (const event of streamFactory(controller.signal)) {
          if (runId !== runIdRef.current) return; // superseded by a newer run

          switch (event.type) {
            case "chunk":
              setText((prev) => prev + event.text);
              break;
            case "cached":
              setData(event.data as T);
              setStatus("cached");
              break;
            case "done":
              setData(event.data as T);
              setStatus("done");
              break;
            case "error":
              setError(event.message);
              setStatus("error");
              break;
          }
        }
      } catch (err) {
        if (runId !== runIdRef.current) return;
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError(err instanceof ApiError ? err.message : "Lost connection to the AI service.");
        setStatus("error");
      }
    })();
  }, [streamFactory]);

  useEffect(() => {
    if (!enabled) return;
    run();
    return () => {
      abortRef.current?.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, ...deps]);

  return { status, text, data, error, isActive: status === "streaming", regenerate: run };
}
