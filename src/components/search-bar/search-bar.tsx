import { type ChangeEvent, type FormEvent } from "react";
import { Input } from "../input";
import { Button } from "../button";

export interface SearchBarProps {
  query: string;
  onQueryChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  hasError: boolean;
}

export const SearchBar = ({
  query,
  onQueryChange,
  onSubmit,
  isLoading,
  hasError,
}: SearchBarProps) => {
  return (
    <form className="flex flex-col gap-3 sm:flex-row" onSubmit={onSubmit}>
      <Input
        value={query}
        onChange={onQueryChange}
        hasError={hasError}
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
  );
};
