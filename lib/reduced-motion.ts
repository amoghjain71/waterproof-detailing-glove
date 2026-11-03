"use client";

import { useSyncExternalStore } from "react";

function subscribeReduced(onStoreChange: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", onStoreChange);
  return () => mq.removeEventListener("change", onStoreChange);
}

function getReducedSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getReducedServerSnapshot() {
  return false;
}

export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeReduced,
    getReducedSnapshot,
    getReducedServerSnapshot,
  );
}

function subscribeTouch(onStoreChange: () => void) {
  const mq = window.matchMedia("(hover: none), (pointer: coarse)");
  mq.addEventListener("change", onStoreChange);
  return () => mq.removeEventListener("change", onStoreChange);
}

function getTouchSnapshot() {
  return window.matchMedia("(hover: none), (pointer: coarse)").matches;
}

function getTouchServerSnapshot() {
  return false;
}

export function useIsTouch(): boolean {
  return useSyncExternalStore(
    subscribeTouch,
    getTouchSnapshot,
    getTouchServerSnapshot,
  );
}
