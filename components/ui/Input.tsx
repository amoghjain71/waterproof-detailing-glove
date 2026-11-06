"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, className, id, disabled, ...props },
  ref,
) {
  const inputId = id ?? props.name;
  const errorId = error && inputId ? `${inputId}-error` : undefined;

  return (
    <label className="block text-label text-ink" htmlFor={inputId}>
      {label}
      <input
        ref={ref}
        id={inputId}
        disabled={disabled}
        aria-invalid={error ? true : undefined}
        aria-describedby={errorId}
        className={cn(
          "mt-2 h-12 w-full rounded border border-rule bg-surface px-4 text-body text-ink transition-colors duration-200 ease-wash",
          "hover:border-ink focus-visible:border-brand",
          "disabled:pointer-events-none disabled:opacity-40",
          error && "border-ink",
          className,
        )}
        {...props}
      />
      {error ? (
        <span id={errorId} role="alert" className="mt-2 block text-label text-ink">
          {error}
        </span>
      ) : null}
    </label>
  );
});
