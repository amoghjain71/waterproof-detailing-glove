export type ImageSlotId =
  | "back-of-hand"
  | "palm"
  | "pair"
  | "cuff"
  | "inside"
  | "beading"
  | "packaging"
  | "founder";

export type ImageSlot = {
  id: ImageSlotId;
  src: string | null;
  alt: string;
  label: string;
};

/** Swap `src` when a real photo replaces a placeholder. Null renders the label. */
export const IMAGE_SLOTS: Record<ImageSlotId, ImageSlot> = {
  "back-of-hand": {
    id: "back-of-hand",
    src: "/images/glove/01-back-of-hand.jpg",
    alt: "Back of the glove on a hand, strap at the wrist",
    label: "Back of hand",
  },
  palm: {
    id: "palm",
    src: "/images/glove/03-palm-view.jpg",
    alt: "Palm of the glove",
    label: "Palm",
  },
  pair: {
    id: "pair",
    src: "/images/glove/02-pair-flat-lay.jpg",
    alt: "Left and right glove laid flat",
    label: "Pair",
  },
  cuff: {
    id: "cuff",
    src: "/images/glove/07-cuff-strap.jpg",
    alt: "Cuff and 25 mm strap",
    label: "Cuff and strap",
  },
  inside: {
    id: "inside",
    src: "/images/glove/08-inside-cuff.jpg",
    alt: "Inside the cuff and silicone lip",
    label: "Inside the cuff",
  },
  beading: {
    id: "beading",
    src: "/images/glove/04-water-beading.jpg",
    alt: "Water on the matte outer shell",
    label: "Water on the shell",
  },
  packaging: {
    id: "packaging",
    src: "/images/glove/10-packaging.jpg",
    alt: "The pair with its sleeve",
    label: "Packaging",
  },
  founder: {
    id: "founder",
    src: "/images/about/founder.jpg",
    alt: "Amogh, founder of 2HANDS",
    label: "Founder",
  },
};
