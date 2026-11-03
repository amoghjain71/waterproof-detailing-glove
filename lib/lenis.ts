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
