export function DropletDivider({ className="" }: { className?: string }) {
  return (
    <div className={`flex justify-center py-6 ${className}`} aria-hidden>
      <svg width="48" height="24" viewBox="0 0 48 24" fill="none">
        <path
          d="M8 12c0-4 4-10 4-10s4 6 4 10a4 4 0 1 1-8 0zm12 0c0-4 4-10 4-10s4 6 4 10a4 4 0 1 1-8 0zm12 0c0-4 4-10 4-10s4 6 4 10a4 4 0 1 1-8 0z"
          fill="var(--ink)"
          opacity="0.85"
        />
      </svg>
    </div>
  );
}
