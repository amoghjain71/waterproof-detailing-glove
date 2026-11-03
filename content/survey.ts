import { SURVEY_FOOTNOTE } from "@/lib/config";

export const surveyMeta = {
  n: 62,
  regions: ["WA", "OR", "CA", "TX", "FL", "MI", "KS", "IN"] as const,
  footnote: SURVEY_FOOTNOTE,
  type: "Founder-run survey" as const,
};

export const surveyStats = [
  {
    id: "wash-frequency",
    text: "More than 70% wash multiple times a week; about 10% wash multiple times a day.",
  },
  {
    id: "absorbent-mitts",
    text: "90.9% use mitts that absorb water right away.",
  },
  {
    id: "cold-wet",
    text: "About 9 in 10 get cold, wet hands while washing.",
  },
  {
    id: "chemical",
    text: "64% call chemical skin exposure a meaningful problem.",
  },
  {
    id: "interest",
    text: "82% are interested in waterproof protection.",
  },
] as const;

/** Survey-sourced statements — label as "From our survey", never as customer reviews. */
export const surveyQuotes = [
  {
    id: "q1",
    text: "I swap 2 to 4 mitts a wash. Each mitt is only in my hand for 15 to 30 seconds.",
  },
  {
    id: "q2",
    text: "Keep the inside dry when the mitt goes back in the bucket.",
  },
  {
    id: "q3",
    text: "Don't let a strap scratch the paint.",
  },
  {
    id: "q4",
    text: "Cold, wet hands are just part of the wash — unless something changes.",
  },
  {
    id: "q5",
    text: "I want protection without giving up mitt feel on paint.",
  },
  {
    id: "q6",
    text: "Nitriles tear when I'm scrubbing. Thick neoprene is too bulky under a mitt.",
  },
] as const;
