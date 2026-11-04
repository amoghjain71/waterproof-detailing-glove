import { BRAND, CLAIM_LEVEL, type ClaimLevel } from "@/lib/config";

type ClaimCopy = {
  headline: string;
  subline: string;
  shopCta: string;
  seeHowCta: string;
  finalCta: string;
  prototypeBadge: string | null;
};

const COPY_BY_CLAIM: Record<ClaimLevel, ClaimCopy> = {
  intent: {
    headline: "Wet job. Dry hands.",
    subline: "A thin waterproof glove that lives under your wash mitt.",
    shopCta: "Shop the glove",
    seeHowCta: "See how it works",
    finalCta: "Wet job. Dry hands.",
    prototypeBadge: "Prototype V2. Testing in progress.",
  },
  proven: {
    headline: "Wet job. Dry hands.",
    subline: "A thin waterproof glove that lives under your wash mitt.",
    shopCta: "Shop the glove",
    seeHowCta: "See how it works",
    finalCta: "Wet job. Dry hands.",
    prototypeBadge: null,
  },
};

export const copy = {
  brand: BRAND.name,
  productName: BRAND.productName,
  claimLevel: CLAIM_LEVEL,
  ...COPY_BY_CLAIM[CLAIM_LEVEL],
  valueProposition:
    "Put the glove on once at the start of a wash, swap mitts in seconds, leave mitts soaking in the bucket without flooding your hands, and finish with warmer, drier hands.",
  keywordMarquee: [
    "THIN.",
    "SEALED.",
    "UNDER ANY MITT.",
    "SWAP IN SECONDS.",
    "KEEP THE BUCKET OUT.",
  ],
  problemStats: [
    {
      value: "9 in 10",
      label: "get cold, wet hands while washing",
    },
    {
      value: "82%",
      label: "want waterproof protection",
    },
    {
      value: "64%",
      label: "call chemical skin exposure a meaningful problem",
    },
  ],
  pivotCards: [
    {
      title: "We started with a lined mitt.",
      body: "The first idea was a wash mitt with a waterproof liner built in. Detailers swap mitts too often slowing down their details.",
    },
    {
      title: "Detailers told us what mattered.",
      body: "'I swap 2 to 4 mitts a wash.', 'Keep the inside dry in the bucket.', 'Don't let a strap scratch the paint.'",
      attribution: "From our survey",
    },
    {
      title: "So we built the glove under any mitt.",
      body: "Wear it once. Keep swapping mitts. Designed to stay thin, sealed at the cuff, and paint-safe under your wash mitt.",
    },
  ],
  underTheMitt: "Put it on once. Swap mitts in seconds.",
  testedHeading: "We show every result, passed or not.",
  compareIntro:
    "Most options pick a side: clearcoat safety or dry hands. An under-mitt glove does both.",
  compareRows: [
    {
      feature: "Paint-safe contact",
      mitt: "Yes",
      nitrile: "Usually",
      thickNeo: "Bulky risk",
      ours: "Yes — under mitt",
    },
    {
      feature: "Keeps bucket water off hands",
      mitt: "No",
      nitrile: "Cuff leaks",
      thickNeo: "Partial",
      ours: "Designed to",
    },
    {
      feature: "Fits under wash mitt",
      mitt: "N/A",
      nitrile: "Loose",
      thickNeo: "Too bulky",
      ours: "Built for it",
    },
    {
      feature: "Finger dexterity",
      mitt: "Mitt feel",
      nitrile: "Tears / sweat",
      thickNeo: "Poor",
      ours: "Articulated",
    },
    {
      feature: "Swap mitts mid-wash",
      mitt: "Swap wet mitts",
      nitrile: "Same gloves",
      thickNeo: "Awkward",
      ours: "Put on once",
    },
  ],
  meetAnnotations: [
    { at: 0.15, label: "Articulated fingers" },
    { at: 0.4, label: "25 mm strap" },
    { at: 0.65, label: "Silicone sealing lip" },
    { at: 0.85, label: "Bonded seams" },
  ],
  layers: [
    {
      id: "outer",
      title: "Outer facing",
      body: "Matte-black stretch nylon with a water-repellent surface.",
    },
    {
      id: "core",
      title: "Core",
      body: "Closed-cell neoprene foam, target 1.0 mm.",
    },
    {
      id: "inner",
      title: "Inner facing",
      body: "Smooth, low-friction polyester tricot.",
    },
  ],
  makingSteps: [
    { title: "Inspect laminate", video: "making-inspect" as const },
    { title: "Cut mirrored left / right", video: "making-cut" as const },
    { title: "Bond the body", video: "making-bond" as const },
    { title: "Seal every joint", video: "making-seal" as const },
    { title: "Attach lip and strap", video: "making-strap" as const },
    { title: "Finish", video: "making-finish" as const },
    { title: "Cure and test", video: "making-leak-test" as const },
  ],
  inUseSlides: [
    {
      id: "wash",
      title: "Full wash",
      body: "Wear the glove once. Your hands stay behind a thin barrier designed to keep water out.",
      video: "full-wash-in-use" as const,
    },
    {
      id: "bucket",
      title: "Bucket, then dry reveal",
      body: "Leave mitts soaking in the bucket without flooding your hands every dip.",
      video: "bucket-dip-dry-reveal" as const,
    },
    {
      id: "dexterity",
      title: "Dexterity under a mitt",
      body: "Articulated fingers and minimal seam bulk are built for triggers, clips, and real wash motions.",
      video: "dexterity-test" as const,
    },
  ],
} as const;

export function getClaimCopy(level: ClaimLevel = CLAIM_LEVEL): ClaimCopy {
  return COPY_BY_CLAIM[level];
}
