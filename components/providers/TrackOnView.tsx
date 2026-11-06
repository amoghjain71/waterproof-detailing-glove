"use client";

import { useEffect } from "react";
import { track, type TrackEvent } from "@/lib/track";

export function TrackOnView({ event, targetId }: { event: TrackEvent; targetId: string }) {
  useEffect(() => {
    const node = document.getElementById(targetId);
    if (!node) return;
    let sent = false;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting || sent) return;
      sent = true;
      track(event);
      observer.disconnect();
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [event, targetId]);

  return null;
}
