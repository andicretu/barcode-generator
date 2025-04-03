import fs from "fs/promises";
import path from "path";

const TRACKER_PATH = path.resolve("used-sample-ids.json");

export async function loadUsedSampleIDs(): Promise<Set<string>> {
    try {
      const data = await fs.readFile(TRACKER_PATH, "utf-8");
      const parsed = JSON.parse(data);
      return new Set(parsed.usedSampleIDs ?? []);
    } catch (err) {
      return new Set();
    }
};

export async function saveUsedSampleIDs(set: Set<string>): Promise<void> {
    const data = {
        usedSampleIDs: Array.from(set)
    };
    await fs.writeFile(TRACKER_PATH, JSON.stringify(data, null, 2));
}