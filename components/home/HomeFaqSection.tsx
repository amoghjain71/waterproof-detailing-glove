"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { faqItems } from "@/content/faq";
import { FRAMER_EASE } from "@/lib/utils";

export function HomeFaqSection() {
  const preview = faqItems.slice(0, 6);
  const [openId, setOpenId] = useState<string | null>(preview[0]?.id ?? null);

  return (
    <section className="border-t border-border px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-cyan">FAQ</p>
            <h2 className="font-display mt-3 text-3xl uppercase tracking-tight sm:text-5xl">
              Quick answers
            </h2>
          </div>
          <Link
            href="/faq"
            className="shrink-0 text-sm text-cyan underline-offset-4 hover:underline"
          >
            See all
          </Link>
        </div>

        <div className="mt-10 divide-y divide-border rounded-2xl border border-border bg-glass">
          {preview.map((item) => {
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
        </div>
      </div>
    </section>
  );
}
