import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/storage", async () => {
  const actual = await vi.importActual<typeof import("@/lib/storage")>("@/lib/storage");
  return {
    ...actual,
    loadState: vi.fn(() => actual.emptyState),
    saveState: vi.fn(),
  };
});

import Home from "@/app/page";

describe("Home integration flow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(Date, "now").mockReturnValue(1_700_000_000_000);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("completes onboarding and shows the latest saved check-in", async () => {
    const user = userEvent.setup();
    render(<Home />);

    await user.type(screen.getByLabelText("Your name"), "Test Student");
    await user.click(screen.getByRole("button", { name: "Start tracking" }));

    expect(screen.getByText(/Hi Test Student,/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Daily check-in" })).toBeInTheDocument();

    fireEvent.change(screen.getByTestId("mood-range"), { target: { value: "9" } });
    fireEvent.change(screen.getByTestId("stress-range"), { target: { value: "7" } });
    await user.click(screen.getByRole("button", { name: "Save check-in" }));

    expect(screen.getByText(/Last check-in mood:/i)).toBeInTheDocument();
    expect(screen.getByText("9/10")).toBeInTheDocument();
    expect(screen.getByText("7/10")).toBeInTheDocument();
  });
});
