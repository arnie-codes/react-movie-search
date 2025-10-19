import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { Input } from "./input";

describe("Input", () => {
  it("renders placeholder text", () => {
    render(<Input placeholder="Search movies" />);
    expect(screen.getByPlaceholderText("Search movies")).toBeInTheDocument();
  });

  it("invokes onChange handler", () => {
    const handleChange = vi.fn();
    render(<Input value="" onChange={handleChange} />);

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "Inception" },
    });

    expect(handleChange).toHaveBeenCalled();
  });

  it("sets aria-invalid when hasError is true", () => {
    render(<Input hasError value="" onChange={() => {}} />);

    expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
  });
});
