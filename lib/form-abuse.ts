"use client";

import { useRef } from "react";

/** Fields every public form POST must include for honeypot + min fill time. */
export function useFormAbuseFields() {
  const startedAt = useRef(Date.now());
  return {
    website: "",
    formStartedAt: startedAt.current,
  };
}
