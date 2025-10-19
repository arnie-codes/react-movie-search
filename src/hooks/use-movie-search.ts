import { useCallback, useEffect, useRef, useState } from "react";
import { fetchMoviesByTitle } from "../api/fetch-movies-by-title";
import type { MovieCardData } from "../lib/map-movie-to-card";
import { mapMovieToCardData } from "../lib/map-movie-to-card";

interface UseMovieSearchOptions {
  initialQuery?: string;
}

interface UseMovieSearchResult {
  query: string;
  setQuery: (value: string) => void;
  movies: MovieCardData[];
  error: string | null;
  isInitialLoading: boolean;
  isFetchingMore: boolean;
  handleSubmit: () => Promise<void>;
  handleLoadMore: () => Promise<void>;
  sentinelRef: (node: HTMLDivElement | null) => void;
}

export const useMovieSearch = ({
  initialQuery = "",
}: UseMovieSearchOptions = {}): UseMovieSearchResult => {
  const [query, setQuery] = useState(initialQuery);
  const [movies, setMovies] = useState<MovieCardData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const observerRef = useRef<IntersectionObserver | null>(null);
  // Sentinel lives at the bottom of the grid - when it intersects, we fetch the next page.
  const sentinelNodeRef = useRef<HTMLDivElement | null>(null);

  const resetState = useCallback(() => {
    setMovies([]);
    setError(null);
    setPage(0);
    setTotalPages(0);
  }, []);

  const loadPage = useCallback(
    async (pageToLoad: number) => {
      if (!query.trim()) {
        resetState();
        return;
      }

      const response = await fetchMoviesByTitle({
        title: query,
        page: pageToLoad,
      });
      const mappedMovies = response.results.map(mapMovieToCardData);

      setMovies((previous) =>
        pageToLoad === 1 ? mappedMovies : [...previous, ...mappedMovies]
      );
      setPage(response.page ?? pageToLoad);
      setTotalPages(response.total_pages ?? response.page ?? pageToLoad);
    },
    [query, resetState]
  );

  const handleSubmit = useCallback(async () => {
    setIsInitialLoading(true);
    setError(null);

    try {
      await loadPage(1);
    } catch (fetchError) {
      setError(
        fetchError instanceof Error
          ? fetchError.message
          : "Unable to fetch movies right now."
      );
      resetState();
    } finally {
      setIsInitialLoading(false);
    }
  }, [loadPage, resetState]);

  const handleLoadMore = useCallback(async () => {
    if (isInitialLoading || isFetchingMore) {
      return;
    }

    if (!query.trim()) {
      return;
    }

    const nextPage = page + 1;
    if (totalPages && nextPage > totalPages) {
      return;
    }

    setIsFetchingMore(true);

    try {
      await loadPage(nextPage);
    } catch (fetchError) {
      setError(
        fetchError instanceof Error
          ? fetchError.message
          : "Unable to load more movies right now."
      );
    } finally {
      setIsFetchingMore(false);
    }
  }, [isInitialLoading, isFetchingMore, loadPage, page, query, totalPages]);

  useEffect(() => {
    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    const sentinel = sentinelNodeRef.current;

    if (!sentinel) {
      return;
    }

    if (!query || !movies.length) {
      observerRef.current?.disconnect();
      return;
    }

    if (totalPages && page >= totalPages) {
      observerRef.current?.disconnect();
      return;
    }

    observerRef.current?.disconnect();

    // Observe the sentinel so scrolling near the bottom loads the next page.
    observerRef.current = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        void handleLoadMore();
      }
    });

    observerRef.current.observe(sentinel);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [handleLoadMore, movies.length, page, query, totalPages]);

  // Expose a ref callback so the grid can hand us the sentinel DOM node to observe.
  const sentinelRef = useCallback((node: HTMLDivElement | null) => {
    sentinelNodeRef.current = node;
  }, []);

  return {
    query,
    setQuery,
    movies,
    error,
    isInitialLoading,
    isFetchingMore,
    handleSubmit,
    handleLoadMore,
    sentinelRef,
  };
};
