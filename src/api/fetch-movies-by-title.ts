import { TMDB_BASE_URL } from "../constants/tmdb";
import type { TMDBSearchMoviesResponse } from "../types/movie";

const ENV_ACCESS_TOKEN = import.meta.env.VITE_TMDB_ACCESS_TOKEN ?? "";
const ENV_API_KEY = import.meta.env.VITE_TMDB_API_KEY ?? "";

export interface FetchMoviesByTitleOptions {
  title: string;
  signal?: AbortSignal;
  language?: string;
  includeAdult?: boolean;
  page?: number;
}

export const fetchMoviesByTitle = async ({
  title,
  signal,
  language = "en-US",
  includeAdult = false,
  page = 1,
}: FetchMoviesByTitleOptions): Promise<TMDBSearchMoviesResponse> => {
  if (!ENV_ACCESS_TOKEN && !ENV_API_KEY) {
    throw new Error(
      "TMDB credentials are missing. Define VITE_TMDB_ACCESS_TOKEN or VITE_TMDB_API_KEY in .env.local"
    );
  }

  const trimmedTitle = title.trim();
  if (!trimmedTitle) {
    return {
      page: 1,
      results: [],
      total_pages: 0,
      total_results: 0,
    };
  }

  const url = new URL(`${TMDB_BASE_URL}/search/movie`);
  url.searchParams.set("query", trimmedTitle);
  url.searchParams.set("language", language);
  url.searchParams.set("include_adult", includeAdult ? "true" : "false");
  url.searchParams.set("page", page.toString());

  const headers: HeadersInit = {
    Accept: "application/json",
  };

  if (ENV_ACCESS_TOKEN) {
    headers.Authorization = `Bearer ${ENV_ACCESS_TOKEN}`;
  } else {
    url.searchParams.set("api_key", ENV_API_KEY);
  }

  const response = await fetch(url, {
    headers,
    signal,
  });

  if (!response.ok) {
    throw new Error(`TMDB search failed with status ${response.status}`);
  }

  const data = (await response.json()) as TMDBSearchMoviesResponse;

  return data;
};
