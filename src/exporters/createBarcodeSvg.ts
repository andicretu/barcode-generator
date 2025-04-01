import { createCanvas } from "canvas";
import JsBarcode from "jsbarcode";
import { DOMImplementation, XMLSerializer } from "@xmldom/xmldom";


export function createBarcodeSVG(
  clientCode: string,
  sampleID: string,
  panelCode: string,
  //samplingDate: string
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
    displayValue: false,
    margin: 0

  });
  
  // Create SVG document for the full label
  const impl = new DOMImplementation();
  const svgDoc = impl.createDocument("http://www.w3.org/2000/svg", "svg", null);
  const svgRoot = svgDoc.documentElement!;
  
  // Label dimensions: 8.5cm x 1.4cm (convert to pixels, assuming 96dpi)
  const width = Math.round(8.5 * 37.8); // 8.5cm to pixels
  const height = Math.round(1.4 * 37.8); // 1.4cm to pixels

  const background = svgDoc.createElement("rect"); //add white background
    background.setAttribute("x", "0");
    background.setAttribute("y", "0");
    background.setAttribute("width", width.toString());
    background.setAttribute("height", height.toString());
    background.setAttribute("fill", "white");
      
  svgRoot.setAttribute("width", width.toString());
  svgRoot.setAttribute("height", height.toString());
  svgRoot.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svgRoot.appendChild(background);
  
  // Convert canvas to data URL and extract base64 image data
  const barcodeDataURL = canvas.toDataURL("image/png");
  
  // Add the barcode image
  const image = svgDoc.createElement("image");
  image.setAttribute("x", "0");
  image.setAttribute("y", "5");
  image.setAttribute("width", Math.round(width * 0.7).toString());
  image.setAttribute("height", "30");
  image.setAttribute("href", barcodeDataURL);
  svgRoot.appendChild(image);
  
  // Add text elements for the data
  const barcodeText1 = svgDoc.createElement("text");
  barcodeText1.setAttribute("x", "220");
  barcodeText1.setAttribute("y", (height - 40).toString());
  barcodeText1.setAttribute("font-family", "Arial");
  barcodeText1.setAttribute("font-size", "10");
  barcodeText1.textContent = `Panel Code: ${panelCode}`;
  svgRoot.appendChild(barcodeText1);
  
  const barcodeText2 = svgDoc.createElement("text");
  barcodeText2.setAttribute("x", "220");
  barcodeText2.setAttribute("y", (height - 30).toString());
  barcodeText2.setAttribute("font-family", "Arial");
  barcodeText2.setAttribute("font-size", "10");
  barcodeText2.textContent = `Sampling Date: `;
  svgRoot.appendChild(barcodeText2);
  
  const barcodeText3 = svgDoc.createElement("text");
  barcodeText3.setAttribute("x", "90");
  barcodeText3.setAttribute("y", (height - 6).toString());
  barcodeText3.setAttribute("font-family", "Arial");
  barcodeText3.setAttribute("font-size", "10");
  barcodeText3.textContent = barcodeText;
  svgRoot.appendChild(barcodeText3);
  
  // Serialize the SVG document to a string
  const serializer = new XMLSerializer();
  return serializer.serializeToString(svgDoc);
}
