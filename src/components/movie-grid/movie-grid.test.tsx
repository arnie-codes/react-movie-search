import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MovieGrid } from "./movie-grid";
import type { MovieCardData } from "../../lib/map-movie-to-card";

const sampleMovies: MovieCardData[] = [
  {
    id: 1,
    title: "Inception",
    plot: "Dream heists",
    year: "2010",
    rating: "8.8 / 10",
    posterUrl: "https://example.com/poster.jpg",
  },
];

describe("MovieGrid", () => {
  it("renders empty state when there are no movies", () => {
    render(
      <MovieGrid
        ref={vi.fn()}
        movies={[]}
        isLoading={false}
        error={null}
        query=""
        isFetchingMore={false}
      />
    );

    expect(
      screen.getByText("Search for a movie to see results.")
    ).toBeInTheDocument();
  });

  it("renders movie cards when movies are present", () => {
    render(
      <MovieGrid
        ref={vi.fn()}
        movies={sampleMovies}
        isLoading={false}
        error={null}
        query="Inception"
        isFetchingMore={false}
      />
    );

    expect(screen.getByText("Inception")).toBeInTheDocument();
  });

  it("shows loading more indicator while fetching", () => {
    render(
      <MovieGrid
        ref={vi.fn()}
        movies={sampleMovies}
        isLoading={false}
        error={null}
        query="Inception"
        isFetchingMore
      />
    );

    expect(screen.getByText("Loading more results...")).toBeInTheDocument();
  });
});
