import { forwardRef } from "react";
import type { MovieCardData } from "../../lib/map-movie-to-card";
import { Card } from "../card";

export interface MovieGridProps {
  movies: MovieCardData[];
  isLoading: boolean;
  error: string | null;
  query: string;
  emptyMessage?: string;
  loadingMoreLabel?: string;
  isFetchingMore: boolean;
}

export const MovieGrid = forwardRef<HTMLDivElement, MovieGridProps>(
  (
    {
      movies,
      isLoading,
      error,
      query,
      emptyMessage = "Search for a movie to see results.",
      loadingMoreLabel = "Loading more results...",
      isFetchingMore,
    },
    sentinelRef
  ) => {
    const showEmptyState = movies.length === 0 && !isLoading && !error;

    return (
      <section
        aria-live="polite"
        className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
      >
        {showEmptyState ? (
          <p className="col-span-full rounded-md border border-gray-200 bg-white px-4 py-6 text-center text-sm text-gray-600">
            {query ? "No results found. Try a different title." : emptyMessage}
          </p>
        ) : (
          movies.map((movie) => (
            <Card
              key={movie.id}
              title={movie.title}
              plot={movie.plot}
              imageUrl={movie.posterUrl}
              year={movie.year}
              rating={movie.rating}
            />
          ))
        )}
        <div
          ref={sentinelRef}
          className="col-span-full h-1 w-full"
          aria-hidden="true"
        />
        {isFetchingMore ? (
          <p
            className="col-span-full text-center text-sm text-gray-600"
            aria-live="polite"
          >
            {loadingMoreLabel}
          </p>
        ) : null}
      </section>
    );
  }
);
