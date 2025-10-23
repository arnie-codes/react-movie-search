import { useState } from "react";

export const useFavouritedMovies = () => {
  const [favorites, setFavorites] = useState<number[]>(() => {
    return JSON.parse(localStorage.getItem("favorites") || "[]");
  });

  const handleFavorite = (id: number) => {
    const newFavorites = favorites.includes(id)
      ? favorites.filter((favorite) => favorite !== id)
      : [...favorites, id];
    setFavorites(newFavorites);
    localStorage.setItem("favorites", JSON.stringify(newFavorites));
  };

  return { favorites, handleFavorite };
};
