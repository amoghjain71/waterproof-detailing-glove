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
    note: "Setting from fit trials. Join the waitlist for updates.",
  },
  {
    code: "XL",
    status: "pending",
    note: "Setting from fit trials. Join the waitlist for updates.",
  },
];

export function recommendSize(circumferenceMm: number): {
  code: SizeCode | null;
  message: string;
} {
  const confirmed = SIZE_CHART.find(
    (s) =>
      s.status === "confirmed" &&
      s.circumferenceMm &&
      circumferenceMm >= s.circumferenceMm.min &&
      circumferenceMm <= s.circumferenceMm.max,
  );

  if (confirmed) {
    return {
      code: confirmed.code,
      message: `Recommended size ${confirmed.code} for ${circumferenceMm} mm hand circumference.`,
    };
  }

  return {
    code: null,
    message:
      "Size set finalizing — join the waitlist. Only size M (200–215 mm) is confirmed so far; we will not invent S, L, or XL ranges.",
  };
}

export const MITT_COMPATIBILITY_NOTES = {
  chenille:
    "Chenille mitts are typically roomy. The thin articulated fit is designed to slide under without fighting the cuff.",
  microfiber:
    "Standard microfiber wash mitts are the primary target. Minimal seam bulk is meant to preserve mitt feel on paint.",
  merino:
    "Merino mitts vary in lining thickness. If the mitt runs tight, choose the larger glove size once L/XL ranges lock.",
} as const;

export type MittStyle = keyof typeof MITT_COMPATIBILITY_NOTES;
