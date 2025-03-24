
import type { BarcodeConfig } from "./types";
  
  export function formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
  
  export const barcodeConfig: BarcodeConfig = {
    clientCode: "DK010",
    panelCode: "APVAB",
    count: 10,
    outputDir: "./output/barcodes",
    startNumber: 1,
    dateFormat: formatDate(new Date())
  };
  