import { ImageSlot } from "@/components/media/ImageSlot";
import { TesterQuotes } from "@/components/about/TesterQuotes";
import { PARTNERSHIP_EMAIL } from "@/lib/config";

export function AboutContent() {
  return (
    <div>
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl items-start gap-10 lg:grid-cols-12">
          <div className="relative aspect-portrait overflow-hidden border border-rule lg:col-span-5">
            <ImageSlot id="founder" fit="cover" priority sizes="(max-width: 1024px) 100vw, 40vw" />
          </div>
          <div className="lg:col-span-7">
            <h1 className="font-display text-h1">About</h1>
            <div className="mt-6 max-w-xl space-y-4 text-body text-ink">
              <p>
                I wash cars in the Pacific Northwest. Mitts soak through, and I swap two
                to four of them on a full wash.
              </p>
              <p>
                I asked 62 detailers in eight states. Most of them had the same problem.
                I started with a lined mitt. That cannot stay dry inside once it goes
                back in the bucket.
              </p>
              <p>
                So the product is a thin glove you put on once. Any mitt slides over it.
                The strap sits under the mitt. Leak, cuff, flex, and strap tests are
                still planned. I will publish the results, including failures.
              </p>
              <p>
                Email{" "}
                <a href={`mailto:${PARTNERSHIP_EMAIL}`} className="text-brand">
                  {PARTNERSHIP_EMAIL}
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </section>
      <TesterQuotes />
    </div>
  );
}
