import type Lenis from "lenis";

let lenisInstance: Lenis | null = null;

export function setLenis(instance: Lenis | null) {
  lenisInstance = instance;
}

export function getLenis() {
  return lenisInstance;
}

/** Smooth scroll helper that prefers Lenis when available. */
export function scrollToY(y: number, immediate = false) {
  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(y, { immediate, force: true });
    return;
  }
  window.scrollTo({ top: y, behavior: immediate ? "auto" : "smooth" });
}

/** Smooth-scroll to an element id, clearing the fixed header. */
export function scrollToId(id: string, immediate = false) {
  const el = document.getElementById(id);
  if (!el) return false;
  const header = document.querySelector("header");
  const offset = header ? header.getBoundingClientRect().height + 8 : 0;
  const y = el.getBoundingClientRect().top + window.scrollY - offset;
  scrollToY(Math.max(0, y), immediate);
  return true;
}
