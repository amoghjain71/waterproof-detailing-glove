export type VideoId =
  | "hero-droplets"
  | "problem-cold-hands"
  | "glove-on-strap"
  | "mitt-swap"
  | "bucket-dip-dry-reveal"
  | "full-wash-in-use"
  | "cuff-seal-macro"
  | "layers-macro"
  | "dexterity-test"
  | "durability-montage"
  | "making-lamination-cutting"
  | "making-seal-bonding"
  | "making-leak-test"
  | "making-inspect"
  | "making-cut"
  | "making-bond"
  | "making-seal"
  | "making-reinforce"
  | "making-strap"
  | "making-finish"
  | "making-test"
  | "sizing-measure"
  | "winter-mobile-detailer"
  | "product-turntable"
  | "closing-cta-pair"
  | "social-vertical-droplets";

export type VideoEntry = {
  id: VideoId;
  filename: string;
  src: string;
  webmSrc?: string;
  poster?: string;
  label: string;
  concept?: boolean;
  scrub?: boolean;
};

export const VIDEOS: Record<VideoId, VideoEntry> = {
  "hero-droplets": {
    id: "hero-droplets",
    filename: "hero-droplets.mp4",
    src: "/videos/hero-droplets.mp4",
    label: "Water beading on matte black glove",
    concept: true,
  },
  "problem-cold-hands": {
    id: "problem-cold-hands",
    filename: "problem-cold-hands.mp4",
    src: "/videos/problem-cold-hands.mp4",
    label: "Cold wet hands during a wash",
    concept: true,
  },
  "glove-on-strap": {
    id: "glove-on-strap",
    filename: "glove-on-strap.mp4",
    src: "/videos/glove-on-strap.mp4",
    label: "Glove on with wrist strap",
    concept: true,
  },
  "mitt-swap": {
    id: "mitt-swap",
    filename: "mitt-swap.mp4",
    src: "/videos/mitt-swap.mp4",
    label: "Swapping wash mitts over the glove",
    concept: true,
  },
  "bucket-dip-dry-reveal": {
    id: "bucket-dip-dry-reveal",
    filename: "bucket-dip-dry-reveal.mp4",
    src: "/videos/bucket-dip-dry-reveal.mp4",
    label: "Bucket dip and dry-hand reveal",
    concept: true,
  },
  "full-wash-in-use": {
    id: "full-wash-in-use",
    filename: "full-wash-in-use.mp4",
    src: "/videos/full-wash-in-use.mp4",
    label: "Full wash with glove under mitt",
    concept: true,
  },
  "cuff-seal-macro": {
    id: "cuff-seal-macro",
    filename: "cuff-seal-macro.mp4",
    src: "/videos/cuff-seal-macro.mp4",
    label: "Macro of cuff seal and strap",
    concept: true,
  },
  "layers-macro": {
    id: "layers-macro",
    filename: "layers-macro.mp4",
    src: "/videos/layers-macro.mp4",
    label: "Three-layer laminate macro",
    concept: true,
  },
  "dexterity-test": {
    id: "dexterity-test",
    filename: "dexterity-test.mp4",
    src: "/videos/dexterity-test.mp4",
    label: "Dexterity under a wash mitt",
    concept: true,
  },
  "durability-montage": {
    id: "durability-montage",
    filename: "durability-montage.mp4",
    src: "/videos/durability-montage.mp4",
    label: "Durability and reliability montage",
    concept: true,
  },
  "making-lamination-cutting": {
    id: "making-lamination-cutting",
    filename: "making-lamination-cutting.mp4",
    src: "/videos/making-lamination-cutting.mp4",
    label: "Lamination and cutting",
    concept: true,
  },
  "making-seal-bonding": {
    id: "making-seal-bonding",
    filename: "making-seal-bonding.mp4",
    src: "/videos/making-seal-bonding.mp4",
    label: "Seal bonding process",
    concept: true,
  },
  "making-leak-test": {
    id: "making-leak-test",
    filename: "making-leak-test.mp4",
    src: "/videos/making-leak-test.mp4",
    label: "Leak testing",
    concept: true,
  },
  "making-inspect": {
    id: "making-inspect",
    filename: "clips/making-inspect.mp4",
    src: "/videos/clips/making-inspect.mp4",
    label: "Inspecting laminate roll before cutting",
    concept: true,
  },
  "making-cut": {
    id: "making-cut",
    filename: "clips/making-cut.mp4",
    src: "/videos/clips/making-cut.mp4",
    label: "Marking and cutting mirrored left/right panels",
    concept: true,
  },
  "making-bond": {
    id: "making-bond",
    filename: "clips/making-bond.mp4",
    src: "/videos/clips/making-bond.mp4",
    label: "Bonding the glove body with seam adhesive",
    concept: true,
  },
  "making-seal": {
    id: "making-seal",
    filename: "clips/making-seal.mp4",
    src: "/videos/clips/making-seal.mp4",
    label: "Sealing joints with seam tape",
    concept: true,
  },
  "making-reinforce": {
    id: "making-reinforce",
    filename: "clips/making-reinforce.mp4",
    src: "/videos/clips/making-reinforce.mp4",
    label: "Light reinforcement at stress points",
    concept: true,
  },
  "making-strap": {
    id: "making-strap",
    filename: "clips/making-strap.mp4",
    src: "/videos/clips/making-strap.mp4",
    label: "Attaching and securing wrist strap",
    concept: true,
  },
  "making-finish": {
    id: "making-finish",
    filename: "clips/making-finish.mp4",
    src: "/videos/clips/making-finish.mp4",
    label: "Finished pairs stacked for inspection",
    concept: true,
  },
  "making-test": {
    id: "making-test",
    filename: "clips/making-test.mp4",
    src: "/videos/clips/making-test.mp4",
    label: "Water validation on a finished glove",
    concept: true,
  },
  "sizing-measure": {
    id: "sizing-measure",
    filename: "sizing-measure.mp4",
    src: "/videos/sizing-measure.mp4",
    label: "How to measure hand circumference",
    concept: true,
  },
  "winter-mobile-detailer": {
    id: "winter-mobile-detailer",
    filename: "winter-mobile-detailer.mp4",
    src: "/videos/winter-mobile-detailer.mp4",
    label: "Winter mobile detailing context",
    concept: true,
  },
  "product-turntable": {
    id: "product-turntable",
    filename: "product-turntable.mp4",
    src: "/videos/product-turntable.mp4",
    label: "Product turntable",
    concept: true,
    scrub: true,
  },
  "closing-cta-pair": {
    id: "closing-cta-pair",
    filename: "closing-cta-pair.mp4",
    src: "/videos/closing-cta-pair.mp4",
    label: "Closing CTA pair shot",
    concept: true,
  },
  "social-vertical-droplets": {
    id: "social-vertical-droplets",
    filename: "social-vertical-droplets.mp4",
    src: "/videos/social-vertical-droplets.mp4",
    label: "Vertical droplets social cut",
    concept: true,
  },
};

export function getVideo(id: VideoId): VideoEntry {
  return VIDEOS[id];
}
