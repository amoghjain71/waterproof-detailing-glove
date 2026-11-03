import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SkipLink } from "@/components/layout/SkipLink";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SkipLink />
      <Header />
      <main
        id="main"
        className="flex flex-1 flex-col pt-[var(--header-h)]"
        tabIndex={-1}
      >
        {children}
      </main>
      <Footer />
    </>
  );
}
