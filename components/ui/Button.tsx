"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonProps = {
  href?: string;
  children: React.ReactNode;
  variant?: "primary" | "outline" | "band";
  className?: string;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  error?: boolean;
};

const variants = {
  primary:
    "border border-brand bg-brand text-on-brand hover:bg-brand-hover active:bg-brand-hover",
  outline:
    "border border-ink bg-transparent text-ink hover:bg-surface active:bg-surface",
  band: "border border-rule bg-transparent text-on-band hover:bg-surface hover:text-ink active:bg-surface active:text-ink",
};

export function Button({
  href,
  children,
  variant = "primary",
  className,
  type = "button",
  onClick,
  disabled,
  loading = false,
  error = false,
}: ButtonProps) {
  const classes = cn(
    "inline-flex h-12 items-center justify-center gap-2 rounded px-4 text-label font-medium transition-colors duration-200 ease-wash",
    variants[variant],
    (disabled || loading) && "pointer-events-none opacity-40",
    error && "border-ink",
    className,
  );

  const content = (
    <>
      {loading ? <span className="spinner" aria-hidden /> : null}
      <span>{children}</span>
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={classes}
        onClick={onClick}
        aria-disabled={disabled || loading || undefined}
        aria-busy={loading || undefined}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
    >
      {content}
    </button>
  );
}
