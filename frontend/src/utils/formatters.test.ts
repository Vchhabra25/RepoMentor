import { describe, it, expect, vi, afterEach } from "vitest";
import { formatRelativeTime, formatBytes, initialsFromName } from "@/utils/formatters";

describe("formatRelativeTime", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns 'just now' for timestamps under a minute old", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:00:30Z"));
    expect(formatRelativeTime("2026-01-01T00:00:00Z")).toBe("just now");
  });

  it("returns minutes for timestamps under an hour old", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:10:00Z"));
    expect(formatRelativeTime("2026-01-01T00:00:00Z")).toBe("10m ago");
  });

  it("returns hours for timestamps under a day old", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T05:00:00Z"));
    expect(formatRelativeTime("2026-01-01T00:00:00Z")).toBe("5h ago");
  });

  it("returns days for timestamps a day or more old", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-04T00:00:00Z"));
    expect(formatRelativeTime("2026-01-01T00:00:00Z")).toBe("3d ago");
  });
});

describe("formatBytes", () => {
  it("formats zero bytes", () => {
    expect(formatBytes(0)).toBe("0 B");
  });

  it("formats bytes under 1KB with no decimal", () => {
    expect(formatBytes(512)).toBe("512 B");
  });

  it("formats kilobytes with one decimal place", () => {
    expect(formatBytes(2048)).toBe("2.0 KB");
  });

  it("formats megabytes", () => {
    expect(formatBytes(5 * 1024 * 1024)).toBe("5.0 MB");
  });
});

describe("initialsFromName", () => {
  it("returns ? for null or undefined", () => {
    expect(initialsFromName(null)).toBe("?");
    expect(initialsFromName(undefined)).toBe("?");
  });

  it("returns initials for a two-word name", () => {
    expect(initialsFromName("Ada Lovelace")).toBe("AL");
  });

  it("returns a single initial for a one-word name", () => {
    expect(initialsFromName("Ada")).toBe("A");
  });
});
