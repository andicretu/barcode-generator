import fs from "fs/promises";
import path from "path";


const SEQUENCE_PATH = path.resolve("last-sequence.json");

//get last used bar code sequence
export async function getLastUsedNumber(): Promise<number> {
  try {
    const data = await fs.readFile(SEQUENCE_PATH, "utf-8");
    const parsed = JSON.parse(data);
    return parsed.lastUsed ?? 0;
  } catch (err) {
    return 0;
  }
}
// write the last used number to file
export async function updateLastUsedNumber(lastUsed: number): Promise<void> {
  const data = JSON.stringify({ lastUsed }, null, 2);
  await fs.writeFile(SEQUENCE_PATH, data);
}
