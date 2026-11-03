"use client";

import { FormEvent, useState } from "react";
import { PageHero } from "@/components/ui/PageHero";
import { BRAND } from "@/lib/config";

type Status = "idle" | "ok" | "error";

export default function ContactPage() {
  const [status, setStatus] = useState<Status>("idle");
  const [topic, setTopic] = useState("general");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const payload = {
      name: String(data.get("name") || ""),
      email: String(data.get("email") || ""),
      topic: String(data.get("topic") || topic),
      message: String(data.get("message") || ""),
    };
    if (!payload.email.includes("@") || payload.message.length < 5) {
      setStatus("error");
      return;
    }
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("contact failed");
      setStatus("ok");
      e.currentTarget.reset();
      setTopic("general");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div>
      <PageHero
        eyebrow="Contact"
        title={`Talk to ${BRAND.name}`}
        description="Fit trials, pre-order timing, wholesale, or press — send a note. Messages validate with zod, log server-side, and append to data/submissions.json in development."
      />

      <section className="mx-auto grid max-w-5xl gap-10 px-4 py-14 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div className="space-y-4 text-sm text-muted">
          <p>
            Prefer product questions first? Check{" "}
            <a href="/faq" className="text-cyan">
              FAQ
            </a>{" "}
            and{" "}
            <a href="/tested" className="text-cyan">
              Tested
            </a>{" "}
            for claims status.
          </p>
          <ul className="space-y-2 rounded-2xl border border-border bg-glass p-5">
            <li>Pre-order & shipping timing</li>
            <li>Fit trials / sizing feedback</li>
            <li>Wholesale & shop inquiries</li>
            <li>Press & partnership</li>
          </ul>
        </div>

        <form
          onSubmit={onSubmit}
          className="space-y-4 rounded-2xl border border-border bg-glass p-6"
        >
          <div>
            <label
              htmlFor="name"
              className="text-xs uppercase tracking-[0.14em] text-muted"
            >
              Name
            </label>
            <input
              id="name"
              name="name"
              required
              className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-cyan/60"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="text-xs uppercase tracking-[0.14em] text-muted"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-cyan/60"
            />
          </div>
          <div>
            <label
              htmlFor="topic"
              className="text-xs uppercase tracking-[0.14em] text-muted"
            >
              Topic
            </label>
            <select
              id="topic"
              name="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-cyan/60"
            >
              <option value="general">General</option>
              <option value="preorder">Pre-order</option>
              <option value="sizing">Sizing / fit trials</option>
              <option value="wholesale">Wholesale</option>
              <option value="press">Press</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="message"
              className="text-xs uppercase tracking-[0.14em] text-muted"
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={6}
              className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-cyan/60"
            />
          </div>
          <button
            type="submit"
            className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-white"
          >
            Send message
          </button>
          {status === "ok" ? (
            <p className="text-xs text-cyan">Message sent (logged + saved).</p>
          ) : null}
          {status === "error" ? (
            <p className="text-xs text-red-300">
              Check email and message length (5+ characters).
            </p>
          ) : null}
        </form>
      </section>
    </div>
  );
}
