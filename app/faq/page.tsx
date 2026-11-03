"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageHero } from "@/components/ui/PageHero";
import { faqItems } from "@/content/faq";
import { FRAMER_EASE } from "@/lib/utils";

export default function FaqPage() {
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(faqItems[0]?.id ?? null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return faqItems;
    return faqItems.filter(
      (item) =>
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <div>
      <PageHero
        eyebrow="Support"
        title="FAQ"
        description="Fit under mitts, cuff seal, care, sizing, shipping, returns, and honest answers about testing — written to the claims guardrails."
      />

      <section className="mx-auto max-w-3xl px-4 py-14 lg:px-8">
        <label className="block text-xs uppercase tracking-[0.14em] text-muted">
          Search
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. strap, sizing, chemicals"
            className="mt-2 w-full rounded-full border border-border bg-glass px-4 py-3 text-sm outline-none focus:border-cyan/60"
          />
        </label>

        <div className="mt-8 divide-y divide-border rounded-2xl border border-border bg-glass">
          {filtered.map((item) => {
            const open = openId === item.id;
            return (
              <div key={item.id}>
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  aria-expanded={open}
                  onClick={() => setOpenId(open ? null : item.id)}
                >
                  <span className="text-sm font-medium sm:text-base">
                    {item.question}
                  </span>
                  <span className="text-cyan" aria-hidden>
                    {open ? "−" : "+"}
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {open ? (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: FRAMER_EASE }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-5 text-sm leading-relaxed text-muted">
                        {item.answer}
                      </p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            );
          })}
          {filtered.length === 0 ? (
            <p className="px-5 py-8 text-sm text-muted">
              No matches. Try another keyword or{" "}
              <a href="/contact" className="text-cyan">
                contact us
              </a>
              .
            </p>
          ) : null}
        </div>
      </section>
    </div>
  );
}
