export function VideoCaption({
  show = true,
  className = "",
}: {
  show?: boolean;
  className?: string;
}) {
  if (!show) return null;

  return <span className={`concept-mark inline-block ${className}`} aria-hidden />;
}
