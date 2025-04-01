// Logic and config
import {
    generateBarcodeInfo,
    validateClientCode,
    formatDate,
    type BarcodeConfig,
    getLastUsedNumber,
    updateLastUsedNumber,
  } from "./logic";
  
  // Exporters
  import { createBarcodeSVG } from "./exporters/createBarcodeSvg";
  import { createBarcodeCSVFile } from "./exporters/createBarcodeCsv";
  

async function main() {
    try {
      const lastUsed = await getLastUsedNumber();
      console.log(`Last used number: ${lastUsed}`);
      
      const barcodeConfig: BarcodeConfig = {
        clientCode: "DK010",
        panelCode: "APVAB",
        count: 10,
        outputDir: "./barcodes",
        startNumber: lastUsed + 1,
      };
      
      console.log("Generating barcodes...");
      const barcodes = await generateBarcodeInfo(barcodeConfig);
  
      const labelCretaionDate = formatDate(new Date());; // or use formatDate(new Date())
      await createBarcodeCSVFile(barcodes, barcodeConfig.outputDir, barcodeConfig.panelCode, labelCretaionDate);
  
  
      const newLastUsed = (barcodeConfig.startNumber ?? 1) + barcodeConfig.count - 1;
      await updateLastUsedNumber(newLastUsed);
  
      console.log(`Generated ${barcodes.length} barcodes.`);
      console.log("Barcodes saved to CSV file in the output directory.");
    } catch (error) {
      console.error("Error generating barcodes:", error);
    }
  }
  
  // Run the main function
    main();