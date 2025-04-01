import fs from "fs/promises";
import path from "path";

import { createBarcodeSVG } from "../exporters/createBarcodeSvg";
import { getLastUsedNumber } from "../logic/sequenceTracker";
import type { BarcodeConfig } from "../logic/types"; // if used here

function generateSampleID(prefix: string, index: number): string {
    // Pad the index to make it at least 9 digits to start at 10 chars
    const paddedIndex = index.toString().padStart(9, "0");
    return `${prefix}${paddedIndex}`;
}

export class BarcodeInfo {
  constructor(public readonly clientCode: string, public readonly sampleID: string){}

  toFileName(): string {
    return `${this.clientCode}_${this.sampleID}.svg`;
  }
}

// Generate barcode info
export async function generateBarcodeInfo(config: BarcodeConfig): Promise<BarcodeInfo[]> {
  const lastUsed = await getLastUsedNumber();
  const {
    clientCode,
    panelCode,
    count,
    outputDir,
    startNumber = lastUsed + 1,
  } = config;

  const barcodes: BarcodeInfo[] = [];

  const samplingDate = "Sampling date:";
  
  for (let i = 0; i < count; i++) {
    const index = startNumber + i;
    const sampleID = generateSampleID("A", index);
    const barcode = `${clientCode}|${sampleID}`;
    barcodes.push(new BarcodeInfo(clientCode, sampleID));
    const svg = createBarcodeSVG(clientCode, sampleID, panelCode);
    
    // Save the SVG file
    const filename = `${barcode.replace("|", "_")}.svg`;
    await fs.writeFile(path.join(outputDir, barcodes[i]!.toFileName()), svg);
    
    console.log(`Generated barcode: ${barcode}`);
  }
  
  return barcodes;
}
