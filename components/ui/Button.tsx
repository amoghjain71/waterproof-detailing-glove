"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Magnetic } from "@/components/ui/Magnetic";

type ButtonProps = {
  href?: string;
  children: React.ReactNode;
  variant?: "primary" | "ghost" | "outline";
  magnetic?: boolean;
  className?: string;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
};

const variants = {
  primary:
    "bg-accent text-white hover:bg-[color-mix(in_oklab,var(--accent)_88%,white)]",
  ghost: "bg-transparent text-foreground hover:bg-white/5",
  outline: "bg-transparent border border-border text-foreground hover:border-cyan/50",
};

export function Button({
  href,
  children,
  variant = "primary",
  magnetic = false,
  className,
  type = "button",
  onClick,
  disabled,
}: ButtonProps) {
  const classes = cn(
    "btn-ripple relative inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium tracking-wide transition-[transform,background-color,border-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
    variants[variant],
    disabled && "pointer-events-none opacity-50",
    className,
  );

  const inner = href ? (
    <Link href={href} className={classes} onClick={onClick}>
      <span className="relative z-10">{children}</span>
    </Link>
  ) : (
    <button type={type} className={classes} onClick={onClick} disabled={disabled}>
      <span className="relative z-10">{children}</span>
    </button>
  );

  if (magnetic) {
    return <Magnetic>{inner}</Magnetic>;
  }

  return inner;
}
