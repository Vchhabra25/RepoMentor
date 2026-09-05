import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "@/components/ui/Badge";

describe("Badge", () => {
  it("renders its label", () => {
    render(<Badge>Ready</Badge>);
    expect(screen.getByText("Ready")).toBeInTheDocument();
  });

  it("renders an icon when provided", () => {
    render(<Badge icon={<span data-testid="badge-icon" />}>Cached</Badge>);
    expect(screen.getByTestId("badge-icon")).toBeInTheDocument();
  });
});
