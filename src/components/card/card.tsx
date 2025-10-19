import { type ImgHTMLAttributes } from "react";

export interface CardProps {
  imageUrl: string;
  title: string;
  year: string;
  rating: string;
  plot: string;
  imageAlt?: string;
  imageProps?: ImgHTMLAttributes<HTMLImageElement>;
}

export const Card = ({
  imageUrl,
  title,
  year,
  rating,
  plot,
  imageAlt = `${title} poster`,
  imageProps,
}: CardProps) => {
  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="aspect-[16/9] w-full overflow-hidden bg-gray-100">
        <img
          src={imageUrl}
          alt={imageAlt}
          loading="lazy"
          className="h-full w-full object-cover object-center transition-transform duration-300 hover:scale-105"
          {...imageProps}
        />
      </div>
      <div className="flex flex-1 flex-col gap-1 p-2 text-gray-900">
        <header className="flex items-start justify-between">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        </header>
        <div className="flex flex-col items-center gap-1">
          <div className="w-full flex justify-between items-center">
            <span>Year:</span>
            <span className="text-sm text-gray-500">{year}</span>
          </div>
          <div className="w-full flex justify-between items-center">
            <span>Rating:</span>
            <span className="text-sm text-gray-500">{rating} / 10</span>
          </div>
        </div>
        <span>Plot:</span>
        <span className="text-sm text-gray-500">{plot}</span>
      </div>
    </article>
  );
};
