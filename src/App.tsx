import { useCallback, useState, type ChangeEvent, type FormEvent } from "react";
import { Input } from "./components/input";
import { Button } from "./components/button";
import { Card } from "./components/card";
import { fetchMoviesByTitle } from "./api/fetch-movies-by-title";
import { TMDB_IMAGE_BASE_URL } from "./constants/tmdb";

interface MovieCardData {
  id: number;
  title: string;
  year: string;
  rating: string;
  plot: string;
  posterUrl: string;
}

const POSTER_PLACEHOLDER = "https://placehold.co/400x600?text=No+Poster";

export function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState<MovieCardData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleQueryChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setQuery(event.target.value);
    },
    []
  );

  const handleSearch = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetchMoviesByTitle({ title: query });
        const mappedMovies = response.results.map((movie) => {
          const releaseYear = movie.release_date
            ? movie.release_date.slice(0, 4)
            : "Unknown";
          const rating = movie.vote_average
            ? movie.vote_average.toFixed(1)
            : "NR";
          const posterUrl = movie.poster_path
            ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}`
            : POSTER_PLACEHOLDER;

          return {
            id: movie.id,
            title: movie.title,
            year: releaseYear,
            rating,
            plot: movie.overview || "No synopsis available.",
            posterUrl,
          };
        });

        setMovies(mappedMovies);
      } catch (fetchError) {
        setError(
          fetchError instanceof Error
            ? fetchError.message
            : "Unable to fetch movies right now."
        );
        setMovies([]);
      } finally {
        setIsLoading(false);
      }
    },
    [query]
  );

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 p-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold text-gray-900">MovieSeek</h1>
        <p className="text-sm text-gray-600">Search films powered by TMDB</p>
      </header>

      <form className="flex flex-col gap-3 sm:flex-row" onSubmit={handleSearch}>
        <Input
          value={query}
          onChange={handleQueryChange}
          hasError={Boolean(error)}
          aria-label="Movie title"
        />
        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          disabled={isLoading}
        >
          {isLoading ? "Searching" : "Search"}
        </Button>
      </form>

      {error ? (
        <p
          className="rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      <section
        aria-live="polite"
        className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
      >
        {movies.length === 0 && !isLoading ? (
          <p className="col-span-full rounded-md border border-gray-200 bg-white px-4 py-6 text-center text-sm text-gray-600">
            {query
              ? "No results found. Try a different title."
              : "Search for a movie to see results."}
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
      </section>
    </div>
  );
}

export default App;
