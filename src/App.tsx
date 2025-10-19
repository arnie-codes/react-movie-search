import { useCallback, type ChangeEvent, type FormEvent } from "react";
import { SearchBar } from "./components/search-bar";
import { MovieGrid } from "./components/movie-grid";
import { useMovieSearch } from "./hooks/use-movie-search";

export function App() {
  const {
    query,
    setQuery,
    movies,
    error,
    isInitialLoading,
    isFetchingMore,
    handleSubmit,
    sentinelRef,
  } = useMovieSearch();

  const handleQueryChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setQuery(event.target.value);
    },
    [setQuery]
  );

  const handleSearch = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      await handleSubmit();
    },
    [handleSubmit]
  );

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 p-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold text-gray-900">MovieSeek</h1>
      </header>

      <SearchBar
        query={query}
        onQueryChange={handleQueryChange}
        onSubmit={handleSearch}
        isLoading={isInitialLoading}
        hasError={Boolean(error)}
      />

      {error ? (
        <p
          className="rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      <MovieGrid
        ref={sentinelRef}
        movies={movies}
        isLoading={isInitialLoading}
        error={error}
        query={query}
        isFetchingMore={isFetchingMore}
      />
    </div>
  );
}

export default App;
