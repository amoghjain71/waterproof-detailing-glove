"use client";

import { Button } from "@/components/ui/Button";

export function PrintButton() {
  return (
    <Button type="button" className="mt-8" onClick={() => window.print()}>
      Print strip
    </Button>
  );
}
