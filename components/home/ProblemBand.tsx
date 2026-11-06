export function ProblemBand() {
  return (
    <section className="bg-band px-4 py-16 text-on-band sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <h2 className="font-display max-w-4xl text-h2">
          Bucket water soaks through a wash mitt in seconds.
        </h2>
        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <p className="text-body">
            Cold, wet mornings: 90.9% of surveyed detailers use mitts that soak through, so
            hands go cold in the Pacific Northwest and in winter.
          </p>
          <p className="text-body">
            Harsh products, all year: 64% called chemical skin exposure a meaningful problem,
            including in warm states like CA, TX and FL.
          </p>
        </div>
        <p className="mt-8 text-label text-on-band">
          Founder survey, n=62, in WA, OR, CA, TX, FL, MI, KS and IN.
        </p>
      </div>
    </section>
  );
}
