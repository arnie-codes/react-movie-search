import { describe, expect, it } from "vitest";
import {
  mapMovieToCardData,
  MOVIE_POSTER_PLACEHOLDER,
} from "./map-movie-to-card";
import type { TMDBMovieResult } from "../types/movie";

const createBaseMovie = (): TMDBMovieResult => ({
  id: 1,
  title: "Sample Movie",
  release_date: "2024-05-17",
  overview: "Synopsis",
  vote_average: 7.345,
  poster_path: "/poster.jpg",
});

const buildResult = (
  overrides: Partial<TMDBMovieResult> = {}
): TMDBMovieResult => ({
  ...createBaseMovie(),
  ...overrides,
});

describe("mapMovieToCardData", () => {
  it("maps full movie data", () => {
    const movie = createBaseMovie();

    const mapped = mapMovieToCardData(movie);

    expect(mapped).toEqual({
      id: movie.id,
      title: movie.title,
      year: "2024",
      rating: "7.3 / 10",
      plot: movie.overview,
      posterUrl: `https://image.tmdb.org/t/p/w342${movie.poster_path}`,
    });
  });

  it("falls back when optional fields are missing", () => {
    const movie = buildResult({
      release_date: "",
      vote_average: 0,
      poster_path: null,
      overview: "",
    });

    const mapped = mapMovieToCardData(movie);

    expect(mapped.year).toBe("Unknown");
    expect(mapped.rating).toBe("Not Rated");
    expect(mapped.posterUrl).toBe(MOVIE_POSTER_PLACEHOLDER);
    expect(mapped.plot).toBe("No synopsis available.");
  });
});
