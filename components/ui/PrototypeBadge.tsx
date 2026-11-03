import { CLAIM_LEVEL } from "@/lib/config";
import { copy } from "@/content/copy";

export function PrototypeBadge({ className = "" }: { className?: string }) {
  if (CLAIM_LEVEL !== "intent" || !copy.prototypeBadge) return null;

  return (
    <span
      className={`inline-flex items-center rounded-full border border-border bg-glass px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-cyan ${className}`}
    >
      {copy.prototypeBadge}
    </span>
  );
}
