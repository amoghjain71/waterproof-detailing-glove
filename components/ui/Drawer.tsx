"use client";

import { useEffect } from "react";

export function Drawer({
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
    <>
      <button
        type="button"
        aria-label="Close"
        className="fixed inset-0 z-overlay bg-band/40"
        onClick={onClose}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="fixed bottom-0 right-0 top-0 z-drawer flex w-full max-w-md flex-col border-l border-rule bg-ground"
      >
        <div className="flex items-center justify-between border-b border-rule px-4 py-4">
          <h2 className="font-display text-h3">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="h-12 border border-ink px-4 text-label"
          >
            Close
          </button>
        </div>
        {children}
      </aside>
    </>
  );
}
