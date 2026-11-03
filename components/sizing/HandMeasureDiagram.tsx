"use client";

type HandMeasureDiagramProps = {
  mm: number;
  scale?: number;
  className?: string;
};

/**
 * Clean hand silhouette (fingers together, thumb out) with a knuckle
 * circumference callout that tracks the size slider.
 */
export function HandMeasureDiagram({
  mm,
  scale = 1,
  className = "",
}: HandMeasureDiagramProps) {
  // Knuckles sit ~58% down this silhouette
  const bandY = 58;
  const bandW = 38 + (scale - 1) * 14;

  return (
    <div
      className={`relative mx-auto aspect-[3/4] w-full max-w-[220px] transition-transform duration-500 ${className}`}
      style={{ transform: `scale(${scale})` }}
      aria-hidden
    >
      <div
        className="absolute inset-0 bg-cyan"
        style={{
          WebkitMaskImage: "url(/images/hand-measure.png)",
          maskImage: "url(/images/hand-measure.png)",
          WebkitMaskSize: "contain",
          maskSize: "contain",
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskPosition: "center",
          maskPosition: "center",
        }}
      />

      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full overflow-visible">
        <path
          d={`M ${50 - bandW / 2} ${bandY} Q 50 ${bandY + 5.5} ${50 + bandW / 2} ${bandY}`}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="1.5"
          strokeDasharray="2.4 2.2"
          strokeLinecap="round"
        />
        <path
          d={`M ${50 - bandW / 2} ${bandY} Q 50 ${bandY - 3} ${50 + bandW / 2} ${bandY}`}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="1.5"
          strokeDasharray="2.4 2.2"
          strokeLinecap="round"
          opacity="0.5"
        />
        <line
          x1={50 + bandW / 2}
          y1={bandY}
          x2={72}
          y2={bandY}
          stroke="var(--accent)"
          strokeWidth="1.1"
          strokeLinecap="round"
        />
        <rect
          x="73"
          y={bandY - 4.2}
          width="22"
          height="8.2"
          rx="2.2"
          fill="#0a0b0d"
          stroke="var(--accent)"
          strokeWidth="0.7"
        />
        <text
          x="84"
          y={bandY + 1.3}
          textAnchor="middle"
          fill="var(--accent)"
          fontSize="3.8"
          fontFamily="var(--font-body), system-ui, sans-serif"
          fontWeight="600"
        >
          {`${mm} mm`}
        </text>
      </svg>
    </div>
  );
}
