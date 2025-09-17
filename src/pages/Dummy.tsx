'use client'

// PdfTextExtractor.tsx
import React, { useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import "pdfjs-dist/build/pdf.worker.entry";

const PdfTextExtractor: React.FC = () => {
  const [text, setText] = useState<string>("");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileReader = new FileReader();

    fileReader.onload = async () => {
      const typedarray = new Uint8Array(fileReader.result as ArrayBuffer);

      const loadingTask = pdfjsLib.getDocument({ data: typedarray });
      const pdf = await loadingTask.promise;

      let extractedText = "";

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const strings = content.items.map((item: any) => item.str);
        extractedText += strings.join(" ") + "\n\n";
      }

      setText(extractedText);
    };

    fileReader.readAsArrayBuffer(file);
  };

  return (
    <div className="p-4">
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      <h3 className="font-bold mt-4">Extracted Text:</h3>
      <pre className="whitespace-pre-wrap bg-gray-100 p-4 rounded">{text}</pre>
    </div>
  );
};

export default PdfTextExtractor;

