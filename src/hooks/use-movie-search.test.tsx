import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { act, render, waitFor, cleanup } from "@testing-library/react";
import { useEffect } from "react";
import { useMovieSearch } from "./use-movie-search";
import * as fetchModule from "../api/fetch-movies-by-title";
import type { TMDBSearchMoviesResponse } from "../types/movie";

const originalIntersectionObserver = globalThis.IntersectionObserver;

const createResponse = (
  titles: string[],
  page = 1,
  totalPages = 1
): TMDBSearchMoviesResponse => ({
  page,
  total_pages: totalPages,
  total_results: titles.length,
  results: titles.map((title, index) => ({
    id: index + 1,
    title,
    release_date: "2024-05-17",
    overview: "Synopsis",
    vote_average: 7.4,
    poster_path: "/poster.jpg",
  })),
});

interface HookHarnessProps {
  onRender: (value: ReturnType<typeof useMovieSearch>) => void;
}

const HookHarness = ({ onRender }: HookHarnessProps) => {
  const hookValue = useMovieSearch();

  useEffect(() => {
    onRender(hookValue);
  });

  return null;
};

describe("useMovieSearch", () => {
  const fetchMoviesByTitleMock = vi.spyOn(fetchModule, "fetchMoviesByTitle");
  const observeMock = vi.fn();
  const disconnectMock = vi.fn();

  beforeEach(() => {
    fetchMoviesByTitleMock.mockReset();
    observeMock.mockReset();
    disconnectMock.mockReset();
    globalThis.IntersectionObserver = vi.fn(() => ({
      observe: observeMock,
      disconnect: disconnectMock,
      unobserve: vi.fn(),
      takeRecords: vi.fn(),
    })) as unknown as typeof IntersectionObserver;
  });

  afterEach(() => {
    cleanup();
    globalThis.IntersectionObserver = originalIntersectionObserver;
  });

  const renderHookHarness = () => {
    const latest: { current: ReturnType<typeof useMovieSearch> | null } = {
      current: null,
    };

    render(
      <HookHarness
        onRender={(value) => {
          latest.current = value;
        }}
      />
    );

    return latest;
  };

  it("loads movies on submit", async () => {
    fetchMoviesByTitleMock.mockResolvedValue(createResponse(["Inception"]));

    const hookRef = renderHookHarness();

    await waitFor(() => expect(hookRef.current).not.toBeNull());

    await act(async () => {
      hookRef.current?.setQuery("Inception");
      await hookRef.current?.handleSubmit();
    });

    expect(fetchMoviesByTitleMock).toHaveBeenCalledWith({
      title: "Inception",
      page: 1,
    });
    expect(hookRef.current?.movies).toHaveLength(1);
    expect(hookRef.current?.movies[0]?.title).toBe("Inception");
  });

  it("appends movies when loading more pages", async () => {
    fetchMoviesByTitleMock
      .mockResolvedValueOnce(createResponse(["Inception"], 1, 2))
      .mockResolvedValueOnce(createResponse(["Oppenheimer"], 2, 2));

    const hookRef = renderHookHarness();
    await waitFor(() => expect(hookRef.current).not.toBeNull());

    await act(async () => {
      hookRef.current?.setQuery("Nolan");
      await hookRef.current?.handleSubmit();
    });

    await act(async () => {
      await hookRef.current?.handleLoadMore();
    });

    expect(fetchMoviesByTitleMock).toHaveBeenLastCalledWith({
      title: "Nolan",
      page: 2,
    });
    expect(hookRef.current?.movies.map((movie) => movie.title)).toEqual([
      "Inception",
      "Oppenheimer",
    ]);
  });

  it("does not fetch when query is emptied", async () => {
    fetchMoviesByTitleMock.mockResolvedValue(createResponse(["Inception"]));

    const hookRef = renderHookHarness();
    await waitFor(() => expect(hookRef.current).not.toBeNull());

    await act(async () => {
      hookRef.current?.setQuery("Inception");
      await hookRef.current?.handleSubmit();
    });

    await act(async () => {
      hookRef.current?.setQuery("");
      await hookRef.current?.handleSubmit();
    });

    expect(fetchMoviesByTitleMock).toHaveBeenCalledTimes(1);
    expect(hookRef.current?.movies).toHaveLength(0);
  });

  it("surfaces errors from fetch failures", async () => {
    fetchMoviesByTitleMock.mockRejectedValue(new Error("Network failure"));

    const hookRef = renderHookHarness();
    await waitFor(() => expect(hookRef.current).not.toBeNull());

    await act(async () => {
      hookRef.current?.setQuery("Inception");
      await hookRef.current?.handleSubmit();
    });

    expect(hookRef.current?.error).toBe("Network failure");
    expect(hookRef.current?.movies).toHaveLength(0);
  });
});
