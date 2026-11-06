import Image from "next/image";
import { IMAGE_SLOTS, type ImageSlotId } from "@/content/images";

export function ImageSlot({
  id,
  priority = false,
  sizes = "(max-width: 1024px) 100vw, 55vw",
  fit = "contain",
}: {
  id: ImageSlotId;
  priority?: boolean;
  sizes?: string;
  fit?: "contain" | "cover";
}) {
  const slot = IMAGE_SLOTS[id];

  if (!slot.src) {
    return (
      <div className="flex aspect-portrait w-full items-center justify-center bg-surface p-6 text-label text-ink-muted">
        {slot.label}
      </div>
    );
  }

  return (
    <Image
      src={slot.src}
      alt={slot.alt}
      fill
      sizes={sizes}
      priority={priority}
      className={fit === "cover" ? "object-cover" : "object-contain p-4"}
    />
  );
}
