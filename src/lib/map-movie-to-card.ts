import { TMDB_IMAGE_BASE_URL } from "../constants/tmdb";
import type { TMDBMovieResult } from "../types/movie";

export interface MovieCardData {
  id: number;
  title: string;
  year: string;
  rating: string;
  plot: string;
  posterUrl: string;
}

export const MOVIE_POSTER_PLACEHOLDER =
  "https://placehold.co/400x600?text=No+Poster";

export const mapMovieToCardData = (movie: TMDBMovieResult): MovieCardData => {
  const releaseYear = movie.release_date
    ? movie.release_date.slice(0, 4)
    : "Unknown";
  const rating = movie.vote_average
    ? `${movie.vote_average.toFixed(1)} / 10`
    : "Not Rated";
  const posterUrl = movie.poster_path
    ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}`
    : MOVIE_POSTER_PLACEHOLDER;

  return {
    id: movie.id,
    title: movie.title,
    year: releaseYear,
    rating,
    plot: movie.overview || "No synopsis available.",
    posterUrl,
  };
};
