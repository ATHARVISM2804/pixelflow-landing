// AadhaarOverlayPDF.tsx
import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { saveAs } from 'file-saver';

const AadhaarOverlayPDF = () => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handlePDFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setPdfFile(e.target.files[0]);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const overlayImageOnPDF = async () => {
    if (!pdfFile || !imageFile) return;

    const pdfBytes = await pdfFile.arrayBuffer();
    const imageBytes = await imageFile.arrayBuffer();

    const pdfDoc = await PDFDocument.load(pdfBytes);
    const page = pdfDoc.getPages()[0];

    const pngImage = await pdfDoc.embedPng(imageBytes);
    const { width, height } = page.getSize();

    const imageDims = pngImage.scale(0.5); // Adjust size as needed

    // Place image at bottom-right
    const x = width - imageDims.width - 20;
    const y = 20;

    page.drawImage(pngImage, {
      x,
      y,
      width: imageDims.width,
      height: imageDims.height,
    });

    const modifiedPdfBytes = await pdfDoc.save();
    const blob = new Blob([modifiedPdfBytes], { type: 'application/pdf' });
    saveAs(blob, 'modified-aadhaar.pdf');
  };

  return (
    <div className="space-y-4 p-4">
      <input type="file" accept="application/pdf" onChange={handlePDFChange} />
      <input type="file" accept="image/*" onChange={handleImageChange} />
      <button
        onClick={overlayImageOnPDF}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Overlay Image on PDF
      </button>
    </div>
  );
};

export default AadhaarOverlayPDF;
