import { BRAND } from "@/lib/config";
import { IP } from "@/lib/ip";

/**
 * Print copy for physical packaging. Keep in sync with site IP notices.
 */
export const packagingCopy = {
  paperSleeve: {
    brand: BRAND.name,
    product: BRAND.productName,
    patentNotice: IP.NOTICE,
    lines: [
      BRAND.name,
      BRAND.productName,
      BRAND.tagline,
      IP.NOTICE,
    ],
  },
  careCard: {
    title: "Care",
    patentNotice: IP.NOTICE,
    lines: [
      "Rinse after use. Hang to dry.",
      "Do not machine wash or tumble dry until care tests finish.",
      IP.NOTICE,
    ],
  },
} as const;
