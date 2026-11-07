export type SizeCode = "S" | "ML" | "XL";

export type SizeStatus = "confirmed" | "pending" | "unavailable";

export type SizeRow = {
  code: SizeCode;
  /** Customer-facing label (e.g. M/L). */
  label: string;
  status: SizeStatus;
  /** Hand circumference range in mm when known. */
  circumferenceMm?: { min: number; max: number };
  /** Sample dimensions — only measured sizes may include numbers. */
  sample?: {
    overallLengthMm: number;
    middleFingerMm: number;
    /** Palm width laid flat — not a hand-size range. */
    palmWidthLaidFlatMm: number;
    cuffLengthMm: number;
  };
  note: string;
};

export function sizeLabel(code: SizeCode): string {
  return SIZE_CHART.find((row) => row.code === code)?.label ?? code;
}

export function isSizeSelectable(code: SizeCode): boolean {
  return SIZE_CHART.find((row) => row.code === code)?.status !== "unavailable";
}

/**
 * Pre-order signup is open; size buttons stay unavailable until fit trials lock.
 * M and L share one M/L slot from the measured Prototype V2 sample.
 */
export const SIZE_CHART: SizeRow[] = [
  {
    code: "S",
    label: "S",
    status: "unavailable",
    note: "Size S is not available.",
  },
  {
    code: "ML",
    label: "M/L",
    status: "unavailable",
    circumferenceMm: { min: 200, max: 215 },
    sample: {
      overallLengthMm: 260,
      middleFingerMm: 80,
      palmWidthLaidFlatMm: 95,
      cuffLengthMm: 60,
    },
    note: "M/L sample range. 95 mm is palm width laid flat, not a hand-size range. Between sizes? Choose the larger when sizes open.",
  },
  {
    code: "XL",
    label: "XL",
    status: "unavailable",
    note: "Size set finalizing. Do not scale the M/L sample until fit trials lock it.",
  },
];

export function recommendSize(circumferenceMm: number): {
  code: SizeCode | null;
  message: string;
} {
  const ml = SIZE_CHART.find((s) => s.code === "ML");
  if (
    ml?.circumferenceMm &&
    circumferenceMm >= ml.circumferenceMm.min &&
    circumferenceMm <= ml.circumferenceMm.max
  ) {
    return {
      code: "ML",
      message: `Recommended size M/L for ${circumferenceMm} mm hand circumference. Sign up and we will email and text when pre-orders open.`,
    };
  }

  return {
    code: null,
    message: `${circumferenceMm} mm is outside the M/L sample range (200 to 215 mm). That size is still being set.`,
  };
}

export const MITT_COMPATIBILITY_NOTES = {
  chenille:
    "Chenille mitts are typically roomy. The thin articulated fit is designed to slide under without fighting the cuff.",
  microfiber:
    "Standard microfiber wash mitts are the primary target. Minimal seam bulk is meant to preserve mitt feel on paint.",
  merino:
    "Merino mitts vary. If the mitt runs tight, wait for the larger sizes. They are not set yet.",
} as const;

export type MittStyle = keyof typeof MITT_COMPATIBILITY_NOTES;
