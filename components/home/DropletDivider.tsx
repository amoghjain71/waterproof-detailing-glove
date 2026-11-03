export function DropletDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex justify-center py-6 ${className}`} aria-hidden>
      <svg width="48" height="24" viewBox="0 0 48 24" fill="none">
        <path
          d="M8 12c0-4 4-10 4-10s4 6 4 10a4 4 0 1 1-8 0zm12 0c0-4 4-10 4-10s4 6 4 10a4 4 0 1 1-8 0zm12 0c0-4 4-10 4-10s4 6 4 10a4 4 0 1 1-8 0z"
          fill="url(#dropGrad)"
          opacity="0.85"
        />
        <defs>
          <linearGradient id="dropGrad" x1="0" y1="0" x2="48" y2="24">
            <stop stopColor="#1F7BFF" />
            <stop offset="1" stopColor="#7FD6FF" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
