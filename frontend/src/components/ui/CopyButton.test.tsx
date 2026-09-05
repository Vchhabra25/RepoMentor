import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CopyButton } from "@/components/ui/CopyButton";

describe("CopyButton", () => {
  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
    });
  });

  it("copies the given text to the clipboard on click", async () => {
    render(<CopyButton text="hello world" />);
    await userEvent.click(screen.getByRole("button"));
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("hello world");
  });

  it("shows a confirmation state after copying", async () => {
    render(<CopyButton text="hello world" />);
    await userEvent.click(screen.getByRole("button"));
    await waitFor(() => expect(screen.getByText("Copied")).toBeInTheDocument());
  });
});
