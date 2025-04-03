// Logic and config
import {
    generateBarcodeInfo,
    validateClientCode,
    formatDate,
    type BarcodeConfig,
  } from "./logic";
  
  // Exporters
  import { createBarcodeSVG } from "./exporters/createBarcodeSvg";
  import { createBarcodeCSVFile } from "./exporters/createBarcodeCsv";
  

async function main() {
    try {
      
      const barcodeConfig: BarcodeConfig = {
        clientCode: "DK010",
        panelCode: "APVAB",
        count: 10,
        outputDir: "./barcodes",
      };
      
      console.log("Generating barcodes...");
      const barcodes = await generateBarcodeInfo(barcodeConfig);
  
      const labelCretaionDate = formatDate(new Date());; // or use formatDate(new Date())
      await createBarcodeCSVFile(barcodes, barcodeConfig.outputDir, barcodeConfig.panelCode, labelCretaionDate);
  

  
      console.log(`Generated ${barcodes.length} barcodes.`);
      console.log("Barcodes saved to CSV file in the output directory.");
    } catch (error) {
      console.error("Error generating barcodes:", error);
    }
  }
  
  // Run the main function
    main();