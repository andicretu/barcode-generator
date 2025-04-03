import fs from "fs/promises";
import path from "path";

import type { BarcodeInfo } from "../logic/generateBarcodeInfo";



export async function createBarcodeCSVFile(
    barcodes: BarcodeInfo[],
    outputDir: string,
    panelCode: string,
    samplingDate: string
  ){
    const csvContent = barcodes
      .map(barcode => {
        return `${barcode.clientCode},${barcode.sampleID},${panelCode},${samplingDate}`;
      })
      .join("\n") + "\n";
    
    const csvHeader = `ClientCode, SampleID, PanelCode, SamplingDate (${samplingDate})\n`;

    const fullContent = `\n${csvHeader}${csvContent}`;
  
    await fs.mkdir(outputDir, { recursive: true });
    await fs.appendFile(
      path.join(outputDir, "barcodes.csv"),
      fullContent
    );
  
    return barcodes;
  }