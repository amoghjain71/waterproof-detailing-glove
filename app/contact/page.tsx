"use client";

import { FormEvent, useState } from "react";
import { PageHero } from "@/components/ui/PageHero";
import { Button } from "@/components/ui/Button";

type Status = "idle" | "sending" | "ok" | "error";

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
    setStatus("sending");
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
        title="Contact"
        description="Fit trials, pre-order timing, wholesale, or press. Send a note."
      />

      <section className="mx-auto grid max-w-5xl gap-10 px-4 py-14 lg:split-5-7 lg:px-8">
        <div className="space-y-4 text-label text-ink-muted">
          <p>
            Prefer product questions first? Check{" "}
            <a href="/faq" className="text-brand">
              FAQ
            </a>{" "}
            and{" "}
            <a href="/tested" className="text-brand">
              Tested
            </a>{" "}
            for what is tested and what is not.
          </p>
          <ul className="space-y-2 rounded border border-rule bg-surface p-5">
            <li>Pre-order & shipping timing</li>
            <li>Fit trials / sizing feedback</li>
            <li>Wholesale & shop inquiries</li>
            <li>Press & partnership</li>
          </ul>
        </div>

        <form
          onSubmit={onSubmit}
          className="space-y-4 rounded border border-rule bg-surface p-6"
        >
          <div>
            <label
              htmlFor="name"
              className="text-label text-ink-muted"
            >
              Name
            </label>
            <input
              id="name"
              name="name"
              required
              className="mt-2 h-12 w-full border border-rule bg-ground px-4 text-body outline-none focus:border-brand"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="text-label text-ink-muted"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-2 h-12 w-full border border-rule bg-ground px-4 text-body outline-none focus:border-brand"
            />
          </div>
          <div>
            <label
              htmlFor="topic"
              className="text-label text-ink-muted"
            >
              Topic
            </label>
            <select
              id="topic"
              name="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="mt-2 h-12 w-full border border-rule bg-ground px-4 text-body outline-none focus:border-brand"
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
              className="text-label text-ink-muted"
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={6}
              className="mt-2 w-full border border-rule bg-ground px-4 py-3 text-body outline-none focus:border-brand"
            />
          </div>
          <Button type="submit" loading={status === "sending"} error={status === "error"}>
            Send message
          </Button>
          {status === "ok" ? (
            <p className="text-label text-ink">Message sent.</p>
          ) : null}
          {status === "error" ? (
            <p className="text-label text-ink">
              Check email and message length (5+ characters).
            </p>
          ) : null}
        </form>
      </section>
    </div>
  );
}
