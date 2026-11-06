export type TesterQuote = {
  name: string;
  city: string;
  date: string;
  quote: string;
  photo?: string;
};

/** Leave empty until a real tester sends a quote and a photo. */
export const TESTERS: readonly TesterQuote[] = [];
