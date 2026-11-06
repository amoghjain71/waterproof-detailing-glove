"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AutoVideo } from "@/components/media/AutoVideo";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { track } from "@/lib/track";

type Unit = "mm" | "in";

function toMm(value: number, unit: Unit) {
  return unit === "in" ? value * 25.4 : value;
}

export function SizeFit({
  open,
  onOpenChange,
  onUseM,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUseM?: () => void;
}) {
  const [unit, setUnit] = useState<Unit>("mm");
  const [raw, setRaw] = useState("205");
  const [email, setEmail] = useState("");
  const [notice, setNotice] = useState<"idle" | "sending" | "ok" | "error">("idle");

  useEffect(() => {
    if (open) track("open_size_calculator");
  }, [open]);

  const mm = useMemo(() => Math.round(toMm(Number(raw) || 0, unit)), [raw, unit]);
  const isM = mm >= 200 && mm <= 215;

  async function notify(event: FormEvent) {
    event.preventDefault();
    if (!email.includes("@")) {
      setNotice("error");
      return;
    }
    setNotice("sending");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "size-calculator" }),
      });
      if (!res.ok) throw new Error("notify failed");
      track("notify_size", { size: "pending" });
      track("join_waitlist", { source: "size-calculator" });
      setNotice("ok");
      setEmail("");
    } catch {
      setNotice("error");
    }
  }

  return (
    <section id="sizing" className="border-t border-rule px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl items-start gap-10 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-h2">Size and fit</h2>
          <p className="mt-4 max-w-xl text-body text-ink">
            Measure around the widest knuckles, fingers together, thumb out. Snug, not
            squeezed. Between sizes, choose the larger.
          </p>
          <p className="mt-4 text-body text-ink-muted">
            M is the only confirmed size: 200 to 215 mm. S, L and XL are still being set.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button type="button" onClick={() => onOpenChange(true)}>
              Open size calculator
            </Button>
            <Button href="/measure" variant="outline">
              Print measuring strip
            </Button>
          </div>
          {onUseM ? (
            <button type="button" className="mt-4 text-label text-brand" onClick={onUseM}>
              Use size M
            </button>
          ) : null}
        </div>
        <div className="overflow-hidden border border-rule">
          <AutoVideo id="sizing-measure" className="aspect-mitt w-full" />
        </div>
      </div>

      <Modal open={open} title="Size calculator" onClose={() => onOpenChange(false)}>
        <p className="text-body text-ink-muted">
          Hand circumference in {unit}. Measure the widest knuckles.
        </p>
        <div className="mt-4 flex gap-2">
          {(["mm", "in"] as Unit[]).map((option) => (
            <button
              key={option}
              type="button"
              className="h-12 border border-rule px-4 text-label"
              aria-pressed={unit === option}
              onClick={() => setUnit(option)}
            >
              {option}
            </button>
          ))}
        </div>
        <label className="mt-4 block text-label text-ink">
          Circumference
          <input
            className="mt-2 h-12 w-full border border-rule bg-surface px-4 text-body"
            inputMode="decimal"
            value={raw}
            onChange={(event) => setRaw(event.target.value)}
          />
        </label>
        <p className="mt-4 text-body text-ink">
          {isM
            ? `${mm} mm recommends size M.`
            : `${mm || 0} mm: size set finalizing.`}
        </p>
        {isM ? (
          <Button
            className="mt-4"
            type="button"
            onClick={() => {
              onUseM?.();
              onOpenChange(false);
            }}
          >
            Use size M
          </Button>
        ) : (
          <form className="mt-4" onSubmit={notify}>
            <Input
              label="Email"
              name="calc-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              error={notice === "error" ? "Enter a valid email." : undefined}
            />
            <Button className="mt-3" type="submit" loading={notice === "sending"}>
              Notify me
            </Button>
            {notice === "ok" ? (
              <p className="mt-2 text-label text-ink">You are on the list.</p>
            ) : null}
          </form>
        )}
        <Link href="/measure" className="mt-4 inline-flex text-label text-brand">
          Print a 1:1 measuring strip
        </Link>
      </Modal>
    </section>
  );
}
