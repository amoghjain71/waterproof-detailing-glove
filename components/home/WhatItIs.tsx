import { AutoVideo } from "@/components/media/AutoVideo";
import { CuffSealSection } from "@/components/home/CuffSealSection";
import { LayersSection } from "@/components/home/LayersSection";
import { MeetGloveSection } from "@/components/home/MeetGloveSection";

export function WhatItIs() {
  return (
    <div>
      <MeetGloveSection />
      <LayersSection />
      <CuffSealSection />
      <section className="relative border-t border-rule px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 data-path-point className="relative z-10 font-display text-h2">
              Fits how you wash
            </h2>
            <p className="relative z-10 mt-4 max-w-xl text-body text-ink">
              Articulated fingers are built for triggers, clips, and the motions of a real
              wash. Designed to stay thin under the mitt.
            </p>
          </div>
          <div className="overflow-hidden border border-rule lg:col-span-7">
            <AutoVideo id="dexterity-test" className="aspect-mitt w-full" />
          </div>
        </div>
      </section>
    </div>
  );
}
