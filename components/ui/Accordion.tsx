"use client";

import { useState } from "react";

export type AccordionItem = {
  id: string;
  title: string;
  body: string;
};

export function Accordion({
  items,
  defaultOpen = [],
}: {
  items: readonly AccordionItem[];
  defaultOpen?: string[];
}) {
  const [open, setOpen] = useState<string[]>(defaultOpen);

  return (
    <div className="border-t border-rule">
      {items.map((item) => {
        const isOpen = open.includes(item.id);
        return (
          <div key={item.id} className="border-b border-rule">
            <h3>
              <button
                type="button"
                className="flex w-full items-center justify-between gap-4 py-4 text-left text-body text-ink hover:text-brand"
                aria-expanded={isOpen}
                onClick={() =>
                  setOpen((current) =>
                    current.includes(item.id)
                      ? current.filter((id) => id !== item.id)
                      : [...current, item.id],
                  )
                }
              >
                {item.title}
                <span className="text-label text-ink-muted" aria-hidden>
                  {isOpen ? "Hide" : "Show"}
                </span>
              </button>
            </h3>
            {isOpen ? (
              <p className="measure pb-4 text-body text-ink-muted">{item.body}</p>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
