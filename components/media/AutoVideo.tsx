"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { getVideo, type VideoId } from "@/content/videos";
import { VideoCaption } from "@/components/media/VideoCaption";
import { usePrefersReducedMotion } from "@/lib/reduced-motion";
import { cn } from "@/lib/utils";

export type AutoVideoHandle = {
  setProgress: (progress01: number) => void;
  play: () => void;
  pause: () => void;
  el: HTMLVideoElement | null;
};

type AutoVideoProps = {
  id: VideoId;
  className?: string;
  /** Scroll-scrub mode: pause autoplay and drive currentTime externally. */
  scrub?: boolean;
  showCaption?: boolean;
  poster?: string;
  /** Force show missing placeholder (testing). */
  forceMissing?: boolean;
  /** Eager load for above-the-fold hero media. */
  priority?: boolean;
};

export const AutoVideo = forwardRef<AutoVideoHandle, AutoVideoProps>(
  function AutoVideo(
    {
      id,
      className,
      scrub = false,
      showCaption,
      poster,
      forceMissing = false,
      priority = false,
    },
    ref,
  ) {
    const entry = getVideo(id);
    const videoRef = useRef<HTMLVideoElement>(null);
    const targetTime = useRef(0);
    const rafRef = useRef(0);
    const [ready, setReady] = useState(false);
    const [missing, setMissing] = useState(forceMissing);
    const [manualPlay, setManualPlay] = useState(false);
    const reduced = usePrefersReducedMotion();
    const isDev = process.env.NODE_ENV === "development";

    useImperativeHandle(ref, () => ({
      setProgress: (p: number) => {
        const el = videoRef.current;
        if (!el || !el.duration) return;
        targetTime.current = Math.max(0, Math.min(1, p)) * el.duration;
      },
      play: () => void videoRef.current?.play(),
      pause: () => videoRef.current?.pause(),
      el: videoRef.current,
    }));

    useEffect(() => {
      if (!scrub || reduced) return;
      const tick = () => {
        const el = videoRef.current;
        if (el && el.duration) {
          const cur = el.currentTime;
          const next = cur + (targetTime.current - cur) * 0.18;
          if (Math.abs(next - cur) > 0.01) {
            el.currentTime = next;
          }
        }
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(rafRef.current);
    }, [scrub, reduced]);

    const tryPlay = useCallback(() => {
      const el = videoRef.current;
      if (!el || scrub || reduced) return;
      void el.play().catch(() => {
        /* autoplay may be blocked */
      });
    }, [scrub, reduced]);

    useEffect(() => {
      const el = videoRef.current;
      if (!el || scrub || reduced) return;

      if (priority) {
        tryPlay();
      }

      const io = new IntersectionObserver(
        ([entryObs]) => {
          if (entryObs?.isIntersecting) tryPlay();
          else el.pause();
        },
        { threshold: priority ? 0.05 : 0.35, rootMargin: priority ? "0px" : "80px" },
      );
      io.observe(el);
      return () => io.disconnect();
    }, [scrub, reduced, tryPlay, priority]);

    const onError = () => setMissing(true);

    if (missing) {
      return (
        <div
          className={cn("relative overflow-hidden", className)}
          role="img"
          aria-label={entry.label}
        >
          <div className="video-placeholder absolute inset-0" />
          <div className="relative flex aspect-video w-full items-center justify-center p-6">
            {isDev ? (
              <p className="rounded-full border border-border bg-background/60 px-4 py-2 text-xs text-cyan">
                Video: {entry.filename}
              </p>
            ) : (
              <p className="text-sm text-muted">{entry.label}</p>
            )}
          </div>
          {(showCaption ?? entry.concept) ? (
            <div className="absolute bottom-3 left-3">
              <VideoCaption />
            </div>
          ) : null}
        </div>
      );
    }

    return (
      <figure className={cn("relative m-0 overflow-hidden bg-black", className)}>
        <video
          ref={videoRef}
          className={cn(
            "h-full w-full object-cover transition-opacity duration-500",
            ready ? "opacity-100" : "opacity-0",
            reduced && "duration-0",
          )}
          muted
          loop={!scrub}
          playsInline
          preload={priority ? "auto" : "metadata"}
          poster={poster ?? entry.poster}
          onCanPlay={() => setReady(true)}
          onError={onError}
          controls={reduced && manualPlay}
          aria-label={entry.label}
        >
          {entry.webmSrc ? (
            <source src={entry.webmSrc} type="video/webm" />
          ) : null}
          <source src={entry.src} type="video/mp4" />
        </video>

        {reduced && !manualPlay ? (
          <button
            type="button"
            className="absolute inset-0 flex items-center justify-center bg-black/35 text-sm font-medium text-white"
            onClick={() => {
              setManualPlay(true);
              void videoRef.current?.play();
            }}
          >
            Play video
          </button>
        ) : null}

        {(showCaption ?? entry.concept) ? (
          <figcaption className="absolute bottom-3 left-3 z-10">
            <VideoCaption />
          </figcaption>
        ) : null}

        <span className="sr-only">{entry.label}</span>
      </figure>
    );
  },
);
