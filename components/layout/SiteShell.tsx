import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SkipLink } from "@/components/layout/SkipLink";
import { ScrollPath } from "@/components/layout/ScrollPath";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-full w-full min-w-0 flex-1 flex-col">
      <ScrollPath />
      <SkipLink />
      <Header />
      <main
        id="main"
        className="relative z-10 flex w-full min-w-0 flex-1 flex-col overflow-x-clip pt-header"
        tabIndex={-1}
      >
        {children}
      </main>
      <Footer />
    </div>
  );
}
