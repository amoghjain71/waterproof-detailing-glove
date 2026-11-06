import Image from "next/image";

export function FounderNote() {
  return (
    <section className="relative border-t border-rule px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl items-start gap-10 lg:grid-cols-12">
        <div className="overflow-hidden border border-rule lg:col-span-5">
          <Image
            src="/images/about/founder.jpg"
            alt="Amogh, founder of 2HANDS"
            width={960}
            height={1200}
            className="aspect-portrait w-full object-cover"
          />
        </div>
        <div className="lg:col-span-7">
          <h2 data-path-point className="relative z-10 font-display text-h2">
            Why I am building this
          </h2>
          <div className="relative z-10 mt-6 max-w-xl space-y-4 text-body text-ink">
            <p>
              I wash cars in the Pacific Northwest. Every mitt soaks through, and I swap two
              to four of them on a full wash. My hands get cold and wet.
            </p>
            <p>
              I asked 62 detailers in eight states. Most of them had the same problem. I
              started with a lined mitt. That cannot stay dry inside once it goes back in the
              bucket. So the product changed.
            </p>
            <p>
              2HANDS is a thin glove you put on once. Any mitt slides over it. The mitt can
              soak. The strap sits under the mitt, away from the paint. The sample is still
              in testing. Leak, cuff, flex, and strap tests are planned. I will publish the
              results, including failures.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
