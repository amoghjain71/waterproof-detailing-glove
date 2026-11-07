import { scrollToId } from "@/lib/lenis";

/** True when href is an in-page section hash (`/#id` or `#id`). */
export function hashIdFromHref(href: string): string | null {
  if (href.startsWith("/#")) return href.slice(2);
  if (href.startsWith("#") && href.length > 1) return href.slice(1);
  return null;
}

/**
 * Smooth-scroll to a home section when already on `/`.
 * Returns true if the default navigation was handled.
 */
export function handleHomeSectionNav(
  href: string,
  pathname: string,
  event?: { preventDefault: () => void },
): boolean {
  const id = hashIdFromHref(href);
  if (!id || pathname !== "/") return false;
  event?.preventDefault();
  scrollToId(id);
  if (typeof window !== "undefined") {
    window.history.replaceState(null, "", `/#${id}`);
  }
  return true;
}
