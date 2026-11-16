/**
 * Intellectual property flags and public notices.
 * Set PATENT_FILING_DATE from the USPTO filing receipt (YYYY-MM-DD).
 * Set NONPROVISIONAL_FILED to true when the full (nonprovisional) application is filed.
 */
export const IP = {
  PATENT_PENDING: true,
  /** USPTO filing receipt date as YYYY-MM-DD. Required while PATENT_PENDING is true. */
  PATENT_FILING_DATE: "2026-11-11",
  NONPROVISIONAL_FILED: false,
  NOTICE: "Patent pending.",
  LONG_NOTICE: "We have filed a U.S. patent application for this product.",
} as const;
