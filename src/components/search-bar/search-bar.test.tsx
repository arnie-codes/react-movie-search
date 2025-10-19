import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { SearchBar } from "./search-bar";

const setup = () => {
  const onQueryChange = vi.fn();
  const onSubmit = vi.fn((event) => event.preventDefault());

  render(
    <SearchBar
      query=""
      onQueryChange={onQueryChange}
      onSubmit={onSubmit}
      isLoading={false}
      hasError={false}
    />
  );

  return { onQueryChange, onSubmit };
};

describe("SearchBar", () => {
  it("renders search input and button", () => {
    setup();

    expect(
      screen.getByRole("textbox", { name: "Movie title" })
    ).toBeInTheDocument();
  });

  it("submits the form when requested", () => {
    const { onSubmit } = setup();

    fireEvent.submit(screen.getByLabelText("Movie search form"));
    expect(onSubmit).toHaveBeenCalled();
  });

  it("displays loading state on the button", () => {
    render(
      <SearchBar
        query=""
        onQueryChange={() => {}}
        onSubmit={(event) => event.preventDefault()}
        isLoading
        hasError={false}
      />
    );

    expect(screen.getByRole("button", { name: "Loading..." })).toBeDisabled();
  });

  it("invokes onQueryChange when typing", () => {
    const { onQueryChange } = setup();

    fireEvent.change(screen.getByRole("textbox", { name: "Movie title" }), {
      target: { value: "Interstellar" },
    });

    expect(onQueryChange).toHaveBeenCalled();
  });
});
