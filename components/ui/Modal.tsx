"use client";

import { useEffect } from "react";

export function Modal({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-overlay flex items-center justify-center bg-band/40 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="w-full max-w-md border border-rule bg-surface p-6"
      >
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-display text-h3">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="h-12 border border-ink px-4 text-label"
          >
            Close
          </button>
        </div>
        <div className="mt-4 text-body text-ink">{children}</div>
      </div>
    </div>
  );
}
