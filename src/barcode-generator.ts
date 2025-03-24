// Blood Sample Barcode Generator
// This script generates barcodes according to the required format:
// ClientCode|SampleID with Panel Code and Sampling Date displayed separately

import JsBarcode from "jsbarcode";
import { DOMImplementation, XMLSerializer } from "@xmldom/xmldom";
import fs from "fs/promises";
import path from "path";
import { createCanvas } from "canvas";
import type { BarcodeConfig } from "./types"; //configuration


// Ensure alphanumeric characters only
function validateAlphaNumeric(input: string): boolean {
  return /^[A-Za-z0-9]+$/.test(input);
}

// Generate a sample ID (alphanumeric, ideally 10 chars, max 16)
function generateSampleID(prefix: string, index: number): string {
  // Pad the index to make it at least 7 digits to get close to 10 chars total
  const paddedIndex = index.toString().padStart(7, "0");
  return `${prefix}${paddedIndex}`;
}

// Format date as DD/MM/YYYY
function formatDate(date: Date): string {
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

// Create barcode SVG string
function createBarcodeSVG(
  clientCode: string,
  sampleID: string,
  panelCode: string,
  samplingDate: string
): string {
  // Create a canvas for JsBarcode
  const canvas = createCanvas(600, 300);
  
  // Format the barcode text: ClientCode|SampleID
  const barcodeText = `${clientCode}|${sampleID}`;
  
  // Generate the barcode
  JsBarcode(canvas, barcodeText, {
    format: "CODE128",
    width: 2,
    height: 50,
    displayValue: false
  });
  
  // Create SVG document for the full label
  const impl = new DOMImplementation();
  const svgDoc = impl.createDocument("http://www.w3.org/2000/svg", "svg", null);
  const svgRoot = svgDoc.documentElement!;
  
  // Label dimensions: 8.5cm x 1.4cm (convert to pixels, assuming 96dpi)
  const width = Math.round(8.5 * 37.8); // 8.5cm to pixels
  const height = Math.round(1.4 * 37.8); // 1.4cm to pixels

  const background = svgDoc.createElement("rect");
    background.setAttribute("x", "0");
    background.setAttribute("y", "0");
    background.setAttribute("width", width.toString());
    background.setAttribute("height", height.toString());
    background.setAttribute("fill", "white");
      
  svgRoot.setAttribute("width", width.toString());
  svgRoot.setAttribute("height", height.toString());
  svgRoot.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svgRoot.setAttribute("style", "border: 1px solid red;");
  svgRoot.appendChild(background);

  
  // Convert canvas to data URL and extract base64 image data
  const barcodeDataURL = canvas.toDataURL("image/png");
  
  // Add the barcode image
  const image = svgDoc.createElement("image");
  image.setAttribute("x", "10");
  image.setAttribute("y", "0");
  image.setAttribute("width", Math.round(width * 0.7).toString());
  image.setAttribute("height", "20");
  image.setAttribute("href", barcodeDataURL);
  svgRoot.appendChild(image);
  
  // Add text elements for the data
  const barcodeText1 = svgDoc.createElement("text");
  barcodeText1.setAttribute("x", "10");
  barcodeText1.setAttribute("y", (height - 25).toString());
  barcodeText1.setAttribute("font-family", "Arial");
  barcodeText1.setAttribute("font-size", "12");
  barcodeText1.textContent = `Panel Code: ${panelCode}`;
  svgRoot.appendChild(barcodeText1);
  
  const barcodeText2 = svgDoc.createElement("text");
  barcodeText2.setAttribute("x", "10");
  barcodeText2.setAttribute("y", (height - 14).toString());
  barcodeText2.setAttribute("font-family", "Arial");
  barcodeText2.setAttribute("font-size", "12");
  barcodeText2.textContent = `Sampling Date: ${samplingDate}`;
  svgRoot.appendChild(barcodeText2);
  
  const barcodeText3 = svgDoc.createElement("text");
  barcodeText3.setAttribute("x", "10");
  barcodeText3.setAttribute("y", (height - 2).toString());
  barcodeText3.setAttribute("font-family", "Arial");
  barcodeText3.setAttribute("font-size", "12");
  barcodeText3.textContent = barcodeText;
  svgRoot.appendChild(barcodeText3);
  
  // Serialize the SVG document to a string
  const serializer = new XMLSerializer();
  return serializer.serializeToString(svgDoc);
}

// Main function to generate barcodes
async function generateBarcodes(config: BarcodeConfig): Promise<string[]> {
  const {
    clientCode,
    panelCode,
    count,
    outputDir,
    startNumber = 1,
    dateFormat
  } = config;
  
  // Validate clientCode and panelCode
  if (!validateAlphaNumeric(clientCode) || !validateAlphaNumeric(panelCode)) {
    throw new Error("Client code and panel code must contain only alphanumeric characters.");
  }
  
  // Create output directory if it doesn't exist
  await fs.mkdir(outputDir, { recursive: true });
  
  // Generate barcodes
  const barcodes: string[] = [];
  const samplingDate = dateFormat || formatDate(new Date());
  
  for (let i = 0; i < count; i++) {
    const index = startNumber + i;
    const sampleID = generateSampleID("A", index);
    const barcode = `${clientCode}|${sampleID}`;
    barcodes.push(barcode);
    
    // Create SVG for this barcode
    const svg = createBarcodeSVG(clientCode, sampleID, panelCode, samplingDate);
    
    // Save the SVG file
    const filename = `${barcode.replace("|", "_")}.svg`;
    await fs.writeFile(path.join(outputDir, filename), svg);
    
    console.log(`Generated barcode: ${barcode}`);
  }
  
  // Create a CSV file of all generated barcodes for reference
  const csvContent = barcodes
    .map(barcode => {
      const [clientCode, sampleID] = barcode.split("|");
      return `${clientCode},${sampleID},${panelCode},${samplingDate}`;
    })
    .join("\n");
  
  const csvHeader = "ClientCode,SampleID,PanelCode,SamplingDate\n";
  await fs.writeFile(
    path.join(outputDir, "barcodes.csv"),
    csvHeader + csvContent
  );
  
  return barcodes;
}

// Example usage
async function main() {
  try {
    const barcodeConfig: BarcodeConfig = {
      clientCode: "DK010",
      panelCode: "APVAB",
      count: 10,
      outputDir: "./barcodes",
      startNumber: 1,
      dateFormat: formatDate(new Date()) // Today's date
    };
    
    console.log("Generating barcodes...");
    const barcodes = await generateBarcodes(barcodeConfig);
    console.log(`Generated ${barcodes.length} barcodes.`);
    console.log("Barcodes saved to CSV file in the output directory.");
  } catch (error) {
    console.error("Error generating barcodes:", error);
  }
}

// Run the main function
main();