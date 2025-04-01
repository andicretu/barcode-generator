import fs from "fs/promises";
import path from "path";

import type { BarcodeInfo } from "../logic/generateInfo"; // assuming BarcodeInfo is defined there



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
      .join("\n");
    
    const csvHeader = "ClientCode,SampleID,PanelCode,SamplingDate\n";
  
    await fs.mkdir(outputDir, { recursive: true });
    await fs.writeFile(
      path.join(outputDir, "barcodes.csv"),
      csvHeader + csvContent
    );
  
    return barcodes;
  }