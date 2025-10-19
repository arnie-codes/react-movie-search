import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Card } from "./card";

describe("Card", () => {
  const baseProps = {
    title: "Inception",
    year: "2010",
    rating: "8.8 / 10",
    plot: "A skilled thief enters dreams to steal secrets.",
    imageUrl: "https://example.com/poster.jpg",
  };

  it("renders movie information", () => {
    render(<Card {...baseProps} />);

    expect(screen.getByText(baseProps.title)).toBeInTheDocument();
    expect(screen.getByText(baseProps.year)).toBeInTheDocument();
    expect(screen.getByText(baseProps.rating)).toBeInTheDocument();
    expect(screen.getByText(baseProps.plot)).toBeInTheDocument();
  });

  it("applies a default alt text when none is provided", () => {
    render(<Card {...baseProps} imageAlt={undefined} />);

    const image = screen.getByRole("img");
    expect(image).toHaveAttribute("alt", `${baseProps.title} poster`);
  });

  it("respects a custom alt text when supplied", () => {
    const customAlt = "Custom poster alt";
    render(<Card {...baseProps} imageAlt={customAlt} />);

    const image = screen.getByRole("img");
    expect(image).toHaveAttribute("alt", customAlt);
  });
});
