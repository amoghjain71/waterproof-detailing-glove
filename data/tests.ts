export type TestStatus = "planned" | "in_testing" | "passed" | "failed";

export type TestGate = {
  id: string;
  code: string;
  name: string;
  method: string;
  sampleCount: string;
  passMeans: string;
  status: TestStatus;
  optional?: boolean;
};

/** Default every status to planned until real results land. */
export const TEST_GATES: TestGate[] = [
  {
    id: "v01",
    code: "V01",
    name: "Body leakage",
    method:
      "Fingers and body immersed 20 mm below the opening for 10 minutes with 50 finger flexes; dry indicator inside.",
    sampleCount: "3 pairs",
    passMeans: "No wet spots on the dry indicator.",
    status: "planned",
  },
  {
    id: "v02",
    code: "V02",
    name: "Worn-cuff test",
    method:
      "10 minutes of water-only washing under a mitt with wrist flexion on wearers.",
    sampleCount: "6 wearers",
    passMeans: "No visible water ingress at the cuff.",
    status: "planned",
  },
  {
    id: "v03",
    code: "V03",
    name: "Flex and don/doff",
    method:
      "1,000 finger open/close cycles plus 100 don/doff cycles, then retest leakage.",
    sampleCount: "Per protocol sample set",
    passMeans: "Leakage retest still meets V01 pass criteria.",
    status: "planned",
  },
  {
    id: "v04",
    code: "V04",
    name: "Closure",
    method: "500 strap open/close cycles including 100 wet cycles.",
    sampleCount: "Per protocol sample set",
    passMeans: "Strap remains operable; no hardware failure.",
    status: "planned",
  },
  {
    id: "v05",
    code: "V05",
    name: "Care durability",
    method: "10 rinse and air-dry cycles; measure dimension change.",
    sampleCount: "Per protocol sample set",
    passMeans: "Dimension change within 3%.",
    status: "planned",
  },
  {
    id: "v06",
    code: "V06",
    name: "Chemical compatibility",
    method:
      "Tested against real detailing products; exposure list pending lock.",
    sampleCount: "Pending exposure list",
    passMeans: "Pass criteria set once the product list is final. Not a chemical-resistance claim yet.",
    status: "planned",
  },
  {
    id: "v07",
    code: "V07",
    name: "Fit and mitt compatibility",
    method:
      "Dexterity, coin pickup, spray-trigger operation, wet insertion and removal under real mitts.",
    sampleCount: "Wearer panel under real mitts",
    passMeans: "Usable dexterity and reliable mitt on/off while worn.",
    status: "planned",
  },
  {
    id: "v08",
    code: "V08",
    name: "Cold-water comfort",
    method: "Comfort-only evaluation in cool water washes.",
    sampleCount: "Optional comfort panel",
    passMeans: "Comfort notes only. No temperature rating.",
    status: "planned",
    optional: true,
  },
];

export const NOT_CLAIMING_YET = [
  "A lab certificate",
  "Proof against detailing chemicals",
  "A temperature rating",
  "Safety-equipment status",
  "A lifetime",
] as const;
