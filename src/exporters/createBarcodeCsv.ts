import fs from "fs/promises";
import path from "path";

import type { BarcodeInfo } from "../logic/generateBarcodeInfo";



export async function createBarcodeCSVFile(
    barcodes: BarcodeInfo[],
    outputDir: string,
    panelCode: string,
    printingDate: string
  ){
    const csvContent = barcodes
      .map(barcode => {
        return `${barcode.clientCode},${barcode.sampleID},${panelCode},${printingDate}`;
      })
      .join("\n") + "\n";
    
    const csvHeader = `ClientCode, SampleID, PanelCode, PrintingDate (${printingDate})\n`;

    const fullContent = `\n${csvHeader}${csvContent}`;
  
    await fs.mkdir(outputDir, { recursive: true });
    await fs.appendFile(
      path.join(outputDir, "barcodes.csv"),
      fullContent
    );
  
    return barcodes;
  }