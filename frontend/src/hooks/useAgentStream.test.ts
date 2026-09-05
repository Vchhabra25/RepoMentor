import { describe, it, expect, vi } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import { useAgentStream } from "@/hooks/useAgentStream";
import type { AgentStreamEvent } from "@/types/ai";

interface FakeData {
  value: string;
}

async function* fakeStream(events: AgentStreamEvent<FakeData>[]): AsyncGenerator<AgentStreamEvent<FakeData>> {
  for (const event of events) {
    yield event;
  }
}

describe("useAgentStream", () => {
  it("accumulates chunks and lands on done with parsed data", async () => {
    const events: AgentStreamEvent<FakeData>[] = [
      { type: "chunk", text: '{"value":' },
      { type: "chunk", text: '"hello"}' },
      { type: "done", data: { value: "hello" }, from_cache: false },
    ];

    const { result } = renderHook(() =>
      useAgentStream<FakeData>(() => fakeStream(events), [])
    );

    await waitFor(() => expect(result.current.status).toBe("done"));
    expect(result.current.text).toBe('{"value":"hello"}');
    expect(result.current.data).toEqual({ value: "hello" });
  });

  it("goes straight to cached status on a cache-hit event", async () => {
    const events: AgentStreamEvent<FakeData>[] = [{ type: "cached", data: { value: "from cache" } }];

    const { result } = renderHook(() => useAgentStream<FakeData>(() => fakeStream(events), []));

    await waitFor(() => expect(result.current.status).toBe("cached"));
    expect(result.current.data).toEqual({ value: "from cache" });
  });

  it("surfaces an error event as error status with a message", async () => {
    const events: AgentStreamEvent<FakeData>[] = [{ type: "error", message: "Something broke" }];

    const { result } = renderHook(() => useAgentStream<FakeData>(() => fakeStream(events), []));

    await waitFor(() => expect(result.current.status).toBe("error"));
    expect(result.current.error).toBe("Something broke");
  });

  it("does not start when enabled is false", async () => {
    const factory = vi.fn(() => fakeStream([{ type: "done", data: { value: "x" }, from_cache: false }]));

    const { result } = renderHook(() => useAgentStream<FakeData>(factory, [], { enabled: false }));

    expect(factory).not.toHaveBeenCalled();
    expect(result.current.status).toBe("idle");
  });

  it("regenerate() re-runs the stream from scratch", async () => {
    let callCount = 0;
    const factory = () => {
      callCount += 1;
      return fakeStream([{ type: "done", data: { value: `run-${callCount}` }, from_cache: false }]);
    };

    const { result } = renderHook(() => useAgentStream<FakeData>(factory, []));

    await waitFor(() => expect(result.current.status).toBe("done"));
    expect(result.current.data).toEqual({ value: "run-1" });

    act(() => {
      result.current.regenerate();
    });

    await waitFor(() => expect(result.current.data).toEqual({ value: "run-2" }));
  });
});
