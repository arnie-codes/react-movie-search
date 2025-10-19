import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { TMDB_BASE_URL } from "../constants/tmdb";

const originalFetch = globalThis.fetch;

const restoreFetch = () => {
  if (originalFetch) {
    globalThis.fetch = originalFetch;
    return;
  }

  delete (globalThis as Partial<typeof globalThis>).fetch;
};

describe("fetchMoviesByTitle", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.unstubAllEnvs();
  });

  afterEach(() => {
    restoreFetch();
    vi.unstubAllEnvs();
  });

  it("throws when TMDB credentials are missing", async () => {
    vi.stubEnv("VITE_TMDB_ACCESS_TOKEN", "");
    vi.stubEnv("VITE_TMDB_API_KEY", "");

    const fetchMock = vi.fn();
    globalThis.fetch = fetchMock as typeof fetch;

    const module = await import("./fetch-movies-by-title");

    await expect(
      module.fetchMoviesByTitle({ title: "Batman" })
    ).rejects.toThrow(
      "TMDB credentials are missing. Define VITE_TMDB_ACCESS_TOKEN or VITE_TMDB_API_KEY in .env.local"
    );

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("returns an empty result without calling TMDB when the query is blank", async () => {
    vi.stubEnv("VITE_TMDB_ACCESS_TOKEN", "token-123");
    vi.stubEnv("VITE_TMDB_API_KEY", "");

    const fetchMock = vi.fn();
    globalThis.fetch = fetchMock as typeof fetch;

    const { fetchMoviesByTitle } = await import("./fetch-movies-by-title");

    const result = await fetchMoviesByTitle({ title: "   " });

    expect(result).toEqual({
      page: 1,
      results: [],
      total_pages: 0,
      total_results: 0,
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("uses the bearer token when provided", async () => {
    vi.stubEnv("VITE_TMDB_ACCESS_TOKEN", "token-123");
    vi.stubEnv("VITE_TMDB_API_KEY", "");

    const tmdbResponse = {
      page: 2,
      results: [],
      total_pages: 5,
      total_results: 100,
    };

    const jsonMock = vi.fn().mockResolvedValue(tmdbResponse);
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: jsonMock,
    } as unknown as Response);
    globalThis.fetch = fetchMock as typeof fetch;

    const { fetchMoviesByTitle } = await import("./fetch-movies-by-title");

    const result = await fetchMoviesByTitle({
      title: "Batman",
      page: 2,
      includeAdult: true,
      language: "es-MX",
    });

    expect(result).toEqual(tmdbResponse);

    const [urlArg, options] = fetchMock.mock.calls[0] as [URL, RequestInit];
    expect(urlArg.toString()).toContain(`${TMDB_BASE_URL}/search/movie`);
    expect(urlArg.searchParams.get("query")).toBe("Batman");
    expect(urlArg.searchParams.get("include_adult")).toBe("true");
    expect(urlArg.searchParams.get("language")).toBe("es-MX");
    expect(urlArg.searchParams.get("page")).toBe("2");
    expect(urlArg.searchParams.has("api_key")).toBe(false);

    const headers = options?.headers as Record<string, string> | undefined;
    expect(headers).toMatchObject({
      Accept: "application/json",
      Authorization: "Bearer token-123",
    });
  });

  it("appends the API key when only the key is configured", async () => {
    vi.stubEnv("VITE_TMDB_ACCESS_TOKEN", "");
    vi.stubEnv("VITE_TMDB_API_KEY", "api-789");

    const tmdbResponse = {
      page: 1,
      results: [],
      total_pages: 0,
      total_results: 0,
    };

    const jsonMock = vi.fn().mockResolvedValue(tmdbResponse);
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: jsonMock,
    } as unknown as Response);
    globalThis.fetch = fetchMock as typeof fetch;

    const { fetchMoviesByTitle } = await import("./fetch-movies-by-title");

    await fetchMoviesByTitle({ title: "Batman" });

    const [urlArg, options] = fetchMock.mock.calls[0] as [URL, RequestInit];
    expect(urlArg.searchParams.get("api_key")).toBe("api-789");

    const headers = options?.headers as Record<string, string> | undefined;
    expect(headers).toEqual({ Accept: "application/json" });
  });

  it("throws when TMDB responds with a non-ok status", async () => {
    vi.stubEnv("VITE_TMDB_ACCESS_TOKEN", "token-123");
    vi.stubEnv("VITE_TMDB_API_KEY", "");

    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 429,
      json: vi.fn(),
    } as unknown as Response);
    globalThis.fetch = fetchMock as typeof fetch;

    const { fetchMoviesByTitle } = await import("./fetch-movies-by-title");

    await expect(fetchMoviesByTitle({ title: "Batman" })).rejects.toThrow(
      "TMDB search failed with status 429"
    );
  });
});
