"use client";

import { Preloader } from "@/components/home/Preloader";
import { HeroSection } from "@/components/home/HeroSection";
import { KeywordMarquee } from "@/components/home/KeywordMarquee";
import { ProblemSection } from "@/components/home/ProblemSection";
import { PivotSection } from "@/components/home/PivotSection";
import { MeetGloveSection } from "@/components/home/MeetGloveSection";
import { LayersSection } from "@/components/home/LayersSection";
import { CuffSealSection } from "@/components/home/CuffSealSection";
import { UnderMittSection } from "@/components/home/UnderMittSection";
import { InUseSection } from "@/components/home/InUseSection";
import { CompareSection } from "@/components/home/CompareSection";
import { MakingPreviewSection } from "@/components/home/MakingPreviewSection";
import { ProvenSection } from "@/components/home/ProvenSection";
import { SizeTeaserSection } from "@/components/home/SizeTeaserSection";
import { SurveyWallSection } from "@/components/home/SurveyWallSection";
import { FinalCtaSection } from "@/components/home/FinalCtaSection";
import { HomeFaqSection } from "@/components/home/HomeFaqSection";
import { SkipSectionButton } from "@/components/home/SkipSectionButton";

export function HomeStory() {
  return (
    <div className="relative">
      <SkipSectionButton />
      <Preloader />
      {/* 1–2 */}
      <HeroSection />
      {/* 3 */}
      <KeywordMarquee />
      {/* 4 */}
      <ProblemSection />
      {/* 5 */}
      <PivotSection />
      {/* 6 */}
      <MeetGloveSection />
      {/* 7 */}
      <LayersSection />
      {/* 8 */}
      <CuffSealSection />
      {/* 9 */}
      <UnderMittSection />
      {/* 10 */}
      <InUseSection />
      {/* 11 */}
      <CompareSection />
      {/* 12 */}
      <MakingPreviewSection />
      {/* 13 */}
      <ProvenSection />
      {/* 14 */}
      <SizeTeaserSection />
      {/* 15 */}
      <SurveyWallSection />
      {/* 16 */}
      <FinalCtaSection />
      {/* 17 FAQ — footer is global SiteShell */}
      <HomeFaqSection />
    </div>
  );
}
