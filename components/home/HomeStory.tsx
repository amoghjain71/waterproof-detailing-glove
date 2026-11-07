"use client";

import { useRef, useState } from "react";
import type { SizeCode } from "@/data/sizes";
import type { BundleId } from "@/lib/config";
import { CompareSection } from "@/components/home/CompareSection";
import { FounderNote } from "@/components/home/FounderNote";
import { HomeHero } from "@/components/home/HomeHero";
import { HowItWorks } from "@/components/home/HowItWorks";
import { ProblemBand } from "@/components/home/ProblemBand";
import { SizeFit } from "@/components/home/SizeFit";
import { SpecSheet } from "@/components/home/SpecSheet";
import { StickyBuyBar } from "@/components/home/StickyBuyBar";
import { TestPreview } from "@/components/home/TestPreview";
import { WhatItIs } from "@/components/home/WhatItIs";
import { WhyGlove } from "@/components/home/WhyGlove";
import { ScrollPath } from "@/components/layout/ScrollPath";

export function HomeStory() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<SizeCode>("ML");
  const [bundleId, setBundleId] = useState<BundleId>("single");
  const [sizerOpen, setSizerOpen] = useState(false);

  return (
    <div ref={rootRef} className="relative w-full min-w-0 pb-sticky-buy">
      <ScrollPath containerRef={rootRef} />
      <HomeHero
        size={size}
        bundleId={bundleId}
        onSize={setSize}
        onBundle={setBundleId}
        onOpenSizer={() => setSizerOpen(true)}
      />
      <ProblemBand />
      <HowItWorks />
      <WhyGlove />
      <WhatItIs />
      <SpecSheet />
      <CompareSection />
      <TestPreview />
      <FounderNote />
      <SizeFit
        open={sizerOpen}
        onOpenChange={setSizerOpen}
        onUseM={() => {
          setSize("ML");
          document.getElementById("buy")?.scrollIntoView({ behavior: "smooth" });
        }}
      />
      <StickyBuyBar size={size} bundleId={bundleId} />
    </div>
  );
}
