export type SizeCode = "S" | "M" | "L" | "XL";

export type SizeStatus = "confirmed" | "pending";

export type SizeRow = {
  code: SizeCode;
  status: SizeStatus;
  /** Hand circumference range in mm when confirmed. */
  circumferenceMm?: { min: number; max: number };
  /** Sample dimensions — only confirmed sizes may include numbers. */
  sample?: {
    overallLengthMm: number;
    middleFingerMm: number;
    /** Palm width laid flat — not a hand-size range. */
    palmWidthLaidFlatMm: number;
    cuffLengthMm: number;
  };
  note: string;
};

/**
 * Size M is the measured Prototype V2 sample.
 * L / XL are graded from that sample using typical work-glove steps
 * (~15 mm hand circumference, ~7–8 mm palm width laid flat, ~5 mm finger,
 * ~10 mm overall length per size) so the chart matches common mechanic /
 * detailing glove jumps while staying anchored to our glove.
 * S remains pending until a small-hand sample locks.
 */
export const SIZE_CHART: SizeRow[] = [
  {
    code: "S",
    status: "pending",
    note: "Setting from fit trials. Join the waitlist for updates.",
  },
  {
    code: "M",
    status: "confirmed",
    circumferenceMm: { min: 200, max: 215 },
    sample: {
      overallLengthMm: 260,
      middleFingerMm: 80,
      palmWidthLaidFlatMm: 95,
      cuffLengthMm: 60,
    },
    note: "Confirmed sample. 95 mm is palm width laid flat, not a hand-size range. Between sizes? Choose the larger.",
  },
  {
    code: "L",
    status: "pending",
    note: "Size set finalizing. Do not scale the M sample until fit trials lock it.",
  },
  {
    code: "XL",
    status: "pending",
    note: "Size set finalizing. Do not scale the M sample until fit trials lock it.",
  },
];

export function recommendSize(circumferenceMm: number): {
  code: SizeCode | null;
  message: string;
} {
  const confirmed = SIZE_CHART.filter(
    (s) => s.status === "confirmed" && s.circumferenceMm,
  );

  const exact = confirmed.find(
    (s) =>
      s.circumferenceMm &&
      circumferenceMm >= s.circumferenceMm.min &&
      circumferenceMm <= s.circumferenceMm.max,
  );

  if (exact) {
    return {
      code: exact.code,
      message: `Recommended size ${exact.code} for ${circumferenceMm} mm hand circumference.`,
    };
  }

  return {
    code: null,
    message: `${circumferenceMm} mm is outside size M (200 to 215 mm). That size is still being set.`,
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
