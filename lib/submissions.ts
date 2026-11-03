import { promises as fs } from "fs";
import path from "path";

const FILE = path.join(process.cwd(), "data", "submissions.json");

export type Submission =
  | {
      type: "waitlist";
      email: string;
      size?: string;
      source?: string;
      at: string;
    }
  | {
      type: "contact";
      name: string;
      email: string;
      topic?: string;
      message: string;
      at: string;
    };

export async function appendSubmission(entry: Submission): Promise<void> {
  let current: Submission[] = [];
  try {
    const raw = await fs.readFile(FILE, "utf8");
    current = JSON.parse(raw) as Submission[];
    if (!Array.isArray(current)) current = [];
  } catch {
    current = [];
  }
  current.push(entry);
  await fs.writeFile(FILE, JSON.stringify(current, null, 2), "utf8");
}
