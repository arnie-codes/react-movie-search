import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { Button } from "./button";

describe("Button", () => {
  it("renders the provided label", () => {
    render(<Button>Search</Button>);
    expect(screen.getByRole("button", { name: "Search" })).toBeInTheDocument();
  });

  it("calls onClick when pressed", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Search</Button>);

    fireEvent.click(screen.getByRole("button", { name: "Search" }));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("disables interaction while loading", () => {
    render(
      <Button isLoading loadingText="Loading">
        Search
      </Button>
    );

    const button = screen.getByRole("button", { name: "Loading" });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
  });
});
