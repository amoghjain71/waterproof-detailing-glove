"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";

export function SplitChars({
  text,
  className,
  charClassName = "split-char inline-block",
}: {
  text: string;
  className?: string;
  charClassName?: string;
}) {
  /** Keep words intact so huge display type never wraps mid-word (e.g. D|RY). */
  const words = useMemo(() => text.split(/(\s+)/), [text]);

  return (
    <span className={cn("split-chars", className)} aria-label={text}>
      {words.map((word, wi) => {
        if (/^\s+$/.test(word)) {
          return (
            <span key={`sp-${wi}`} className="inline" aria-hidden>
              {" "}
            </span>
          );
        }
        return (
          <span
            key={`w-${wi}`}
            className="inline-block whitespace-nowrap"
            aria-hidden
          >
            {Array.from(word).map((ch, i) => (
              <span key={`${ch}-${i}`} className={charClassName}>
                {ch}
              </span>
            ))}
          </span>
        );
      })}
    </span>
  );
}

export function SplitLines({
  text,
  className,
  lineClassName = "split-line block overflow-hidden",
  innerClassName = "split-line-inner inline-block",
}: {
  text: string;
  className?: string;
  lineClassName?: string;
  innerClassName?: string;
}) {
  const lines = useMemo(() => text.split("\n"), [text]);

  return (
    <span className={className}>
      {lines.map((line, i) => (
        <span key={i} className={lineClassName}>
          <span className={innerClassName}>
            <SplitChars text={line} />
          </span>
        </span>
      ))}
    </span>
  );
}
