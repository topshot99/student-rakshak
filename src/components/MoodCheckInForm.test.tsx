import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MoodCheckInForm } from "@/components/MoodCheckInForm";

describe("MoodCheckInForm", () => {
  it("submits check-in values", () => {
    const handleSubmit = vi.fn();
    render(<MoodCheckInForm latestCheckIn={null} onSubmit={handleSubmit} />);

    fireEvent.change(screen.getByTestId("mood-range"), { target: { value: "8" } });
    fireEvent.click(screen.getByRole("button", { name: "Comparison" }));
    fireEvent.click(screen.getByRole("button", { name: "Save check-in" }));

    expect(handleSubmit).toHaveBeenCalledTimes(1);
    expect(handleSubmit.mock.calls[0][0]).toMatchObject({
      mood: 8,
      triggers: ["Comparison"],
    });
  });
});

