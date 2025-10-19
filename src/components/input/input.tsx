import { forwardRef, type InputHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", hasError = false, ...props }, ref) => {
    const { "aria-label": ariaLabel, ...restProps } = props;

    const baseStyles =
      "w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 placeholder-gray-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 focus:ring-offset-white";
    const errorStyles = hasError
      ? "border-red-500 focus:ring-red-500"
      : "border-gray-300";

    const classes = [baseStyles, errorStyles, className]
      .filter(Boolean)
      .join(" ");

    return (
      <input
        ref={ref}
        className={classes}
        placeholder="Enter movie name here..."
        aria-invalid={hasError}
        aria-label={ariaLabel ?? "Search input"}
        {...restProps}
      />
    );
  }
);

Input.displayName = "Input";
