// PdfCropper.tsx
'use client';

import React, { useState, useRef } from 'react';
import { PDFDocument } from 'pdf-lib';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, Download, FileText } from "lucide-react"
import Sidebar from "@/components/Sidebar"
import DashboardHeader from "@/components/DashboardHeader"
import { useToast } from "@/components/ui/use-toast"

export default function PdfCropper() {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const arrayBuffer = reader.result as ArrayBuffer;
          const croppedPdfBytes = await cropPdf(arrayBuffer);

          const blob = new Blob([croppedPdfBytes], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          setPdfUrl(url);
          
          toast({
            title: "PDF cropped successfully",
            description: "Your PDF has been cropped to the left half.",
          });
        } catch (error) {
          console.error('Error processing PDF:', error);
          toast({
            title: "Error processing PDF",
            description: "Failed to crop the PDF. Please try again.",
            variant: "destructive"
          });
        } finally {
          setIsProcessing(false);
        }
      };
      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error('Error reading file:', error);
      toast({
        title: "Error reading file",
        description: "Failed to read the PDF file.",
        variant: "destructive"
      });
      setIsProcessing(false);
    }
  };

  const cropPdf = async (pdfBytes: ArrayBuffer): Promise<Uint8Array> => {
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pages = pdfDoc.getPages();

    pages.forEach((page) => {
      const { width, height } = page.getSize();
      // Crop to left half
      page.setCropBox(width/11, height/11, 2*width/5, height/5.4);
    });

    return await pdfDoc.save();
  };

  const downloadCroppedPdf = () => {
    if (pdfUrl) {
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = 'cropped.pdf';
      link.click();
      
      toast({
        title: "Download started",
        description: "Cropped PDF is being downloaded.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-950 to-gray-900">
      <Sidebar />

      <div className="lg:ml-[280px] flex flex-col min-h-screen">
        <DashboardHeader title="PDF Cropper" icon={FileText} showNewServiceButton={false} />

        <main className="flex-1 p-3 sm:p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Upload Section */}
            <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-white flex items-center gap-3">
                  <Upload className="h-5 w-5 text-blue-500" />
                  Crop PDF to Left Half
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center">
                  <div className="space-y-3">
                    <Upload className="h-16 w-16 mx-auto text-gray-500" />
                    <div>
                      <p className="text-white font-medium">Upload your PDF to crop it to the left half</p>
                      <p className="text-gray-400 text-sm">Supports PDF files up to 50MB</p>
                    </div>
                    <Button 
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isProcessing}
                      className="bg-indigo-500 text-white hover:bg-indigo-600"
                    >
                      {isProcessing ? 'Processing...' : 'Upload PDF'}
                    </Button>
                  </div>
                </div>
                <input
                  type="file"
                  accept="application/pdf"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
              </CardContent>
            </Card>

            {/* Preview Section */}
            {pdfUrl && (
              <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-white flex items-center gap-3">
                    <FileText className="h-5 w-5 text-green-500" />
                    Cropped PDF Preview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-gray-800 rounded-lg p-4">
                    <iframe 
                      src={pdfUrl} 
                      width="100%" 
                      height="600px" 
                      title="Cropped PDF Preview"
                      className="rounded-lg border border-gray-700"
                    />
                  </div>
                  <div className="flex justify-center">
                    <Button
                      onClick={downloadCroppedPdf}
                      className="bg-green-500 text-white hover:bg-green-600"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Cropped PDF
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Instructions */}
            <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-white">How to Use PDF Cropper</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-gray-300 text-sm">
                  <div className="flex gap-3">
                    <span className="bg-indigo-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</span>
                    <p>Upload your PDF file using the upload area above</p>
                  </div>
                  <div className="flex gap-3">
                    <span className="bg-indigo-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</span>
                    <p>The system will automatically crop each page to show only the left half</p>
                  </div>
                  <div className="flex gap-3">
                    <span className="bg-indigo-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</span>
                    <p>Preview the cropped PDF in the preview section</p>
                  </div>
                  <div className="flex gap-3">
                    <span className="bg-indigo-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">4</span>
                    <p>Download the cropped PDF file</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
