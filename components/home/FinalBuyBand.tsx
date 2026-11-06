"use client";

import { FormEvent, useState } from "react";
import type { SizeCode } from "@/data/sizes";
import type { BundleId } from "@/lib/config";
import { BuyModule } from "@/components/home/BuyModule";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { track } from "@/lib/track";

export function FinalBuyBand({
  size,
  bundleId,
  onSize,
  onBundle,
  onOpenSizer,
}: {
  size: SizeCode;
  bundleId: BundleId;
  onSize: (size: SizeCode) => void;
  onBundle: (id: BundleId) => void;
  onOpenSizer: () => void;
}) {
  const [email, setEmail] = useState("");
  const [notice, setNotice] = useState<"idle" | "sending" | "ok" | "error">("idle");

  async function join(event: FormEvent) {
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
        body: JSON.stringify({ email, source: "final-band" }),
      });
      if (!res.ok) throw new Error("waitlist failed");
      track("join_waitlist", { source: "final-band" });
      setNotice("ok");
      setEmail("");
    } catch {
      setNotice("error");
    }
  }

  return (
    <section className="bg-band px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2">
        <h2 className="font-display text-h1 text-on-band">Wet job. Dry hands.</h2>
        <div className="border border-rule bg-surface p-6">
          <BuyModule
            size={size}
            bundleId={bundleId}
            onSize={onSize}
            onBundle={onBundle}
            onOpenSizer={onOpenSizer}
          />
          <form className="mt-8 border-t border-rule pt-6" onSubmit={join}>
            <p className="text-body text-ink">Not ready to pre-order?</p>
            <div className="mt-3">
              <Input
                label="Email"
                name="final-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                error={notice === "error" ? "Enter a valid email." : undefined}
              />
            </div>
            <Button className="mt-3" type="submit" loading={notice === "sending"}>
              Send me updates
            </Button>
            {notice === "ok" ? (
              <p className="mt-2 text-label text-ink">You are on the list.</p>
            ) : null}
          </form>
        </div>
      </div>
    </section>
  );
}
