import { SHOW_CONCEPT_LABEL } from "@/lib/config";

export function VideoCaption({
  show = SHOW_CONCEPT_LABEL,
  className = "",
}: {
  show?: boolean;
  className?: string;
}) {
  if (!show) return null;

  return (
    <p
      className={`text-[11px] uppercase tracking-[0.16em] text-muted ${className}`}
    >
      Concept visualization
    </p>
  );
}
