import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers about fit under mitts, cuff seal, care, sizing, shipping, returns, and testing status.",
};

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return children;
}
