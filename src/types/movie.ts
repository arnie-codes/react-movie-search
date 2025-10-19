export interface Movie {
  id: number;
  title: string;
  releaseYear: string | null;
  overview: string;
  voteAverage: number;
  posterPath: string | null;
}

export interface TMDBMovieResult {
  id: number;
  title: string;
  release_date: string;
  overview: string;
  vote_average: number;
  poster_path: string | null;
}

export interface TMDBSearchMoviesResponse {
  page: number;
  results: TMDBMovieResult[];
  total_pages: number;
  total_results: number;
}
