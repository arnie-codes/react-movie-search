# React Movie Search

A tiny TMDB-powered movie search app built with Vite, React 19, Tailwind 4, and Vitest.

## Prerequisites

- Node.js 20+
- npm (ships with Node). pnpm/yarn work too, but commands here use npm.
- TMDB API credentials: either a **read access token** or an **API key**.

Create a `.env.local` at the project root with one of:

```
VITE_TMDB_ACCESS_TOKEN=your_tmdb_read_access_token
# or
VITE_TMDB_API_KEY=your_tmdb_api_key
```

## Install

```bash
npm install
```

## Develop

```bash
npm run dev
```

Vite prints a local URL (default `http://localhost:5173`).

## Tests

```bash
npm test
```

Vitest runs in watch mode by default. Press `q` to exit.

## Lint

```bash
npm run lint
```

## Build

```bash
npm run build
```
