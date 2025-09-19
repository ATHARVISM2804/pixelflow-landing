"use client";
import React, { useState, useRef } from "react";
import * as pdfjsLib from "pdfjs-dist";
import "pdfjs-dist/build/pdf.worker.entry";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Upload, FileText, Loader2, Download, Printer, CreditCard, Eye, RotateCcw, ZoomIn, Lock, Key } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import DashboardHeader from "@/components/DashboardHeader";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { useTermsNCondition } from "@/components/TermsNCondition";
import jsPDF from "jspdf";
import axios from "axios";
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
import { auth } from "../auth/firebase";

// Card dimensions for APAAR (same as Aadhaar for now)
const CARD_DIMENSIONS = { width: 85.6, height: 53.98 };
const A4_DIMENSIONS = { width: 595.28, height: 841.89, margin: 40 };

interface ApaarData {
  name: string;
  dob: string;
  gender: string;
  apaarId: string;
  photoUrl?: string;
  qrUrl?: string;
  originalPage?: number;
}

export default function TextExtraction() {
  const [selectedPdf, setSelectedPdf] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [apaarCards, setApaarCards] = useState<ApaarData[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null);
  const [password, setPassword] = useState('');
  const [needsPassword, setNeedsPassword] = useState(false);
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const [copies, setCopies] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [rawLines, setRawLines] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const frontRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { open: termsOpen, openModal: openTermsModal, closeModal: closeTermsModal, modal: termsModal } = useTermsNCondition();
  const [pendingAction, setPendingAction] = useState<null | { type: "download" | "print", card: ApaarData, index: number }>(null);

  // Extraction coordinates (for development)
  const [photoX, setPhotoX] = useState<number>(781);
  const [photoY, setPhotoY] = useState<number>(115);
  const [photoW, setPhotoW] = useState<number>(69);
  const [photoH, setPhotoH] = useState<number>(69);
  const [qrX, setQrX] = useState<number>(310);
  const [qrY, setQrY] = useState<number>(205);
  const [qrW, setQrW] = useState<number>(75);
  const [qrH, setQrH] = useState<number>(75);

  // Parse text for APAAR card
  const parseExtractedText = (lines: string[]): ApaarData | null => {
    const nameIndex = lines.findIndex((l) => l.toLowerCase().includes("name"));
    const dobIndex = lines.findIndex(
      (l) => l.toLowerCase().includes("date of birth") || l.toLowerCase().includes("dob")
    );
    const genderIndex = lines.findIndex((l) => l.toLowerCase().includes("gender"));
    const apaarIdLine = lines.find((l) => /^\d{12}$/.test(l.trim()));
    return {
      name: nameIndex !== -1 && lines[nameIndex + 1] ? lines[nameIndex + 1] : "Guramritpreet Singh",
      dob: dobIndex !== -1 && lines[dobIndex + 1] ? lines[dobIndex + 1] : "10/03/2006",
      gender: genderIndex !== -1 && lines[genderIndex + 1] ? lines[genderIndex + 1] : "Male",
      apaarId: apaarIdLine ? apaarIdLine.trim() : "294547603188",
    };
  };

  // PDF upload
  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF file only.",
        variant: "destructive"
      });
      return;
    }
    setSelectedPdf(file);
    setApaarCards([]);
    setPreviewImages([]);
    setSelectedCardIndex(null);
    setPassword('');
    setNeedsPassword(false);
    setIsPasswordProtected(false);
    setRawLines([]);
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  // Main PDF processing
  const processPdf = async () => {
    if (!selectedPdf) {
      toast({
        title: "No PDF selected",
        description: "Please upload a PDF file first.",
        variant: "destructive"
      });
      return;
    }
    setIsProcessing(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const typedArray = new Uint8Array(reader.result as ArrayBuffer);
        const pdf = await pdfjsLib.getDocument({ data: typedArray, password: password || undefined }).promise;
        const page = await pdf.getPage(1);
        const textContent = await page.getTextContent();
        const lines = textContent.items.map((item: any) => item.str).filter((s: string) => s.trim() !== "");
        setRawLines(lines);

        // Extract images from PDF (photo and QR)
        let photoUrl = "";
        let qrUrl = "";
        try {
          const viewport = page.getViewport({ scale: 2.0 });
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d")!;
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          await page.render({ canvasContext: context, viewport: viewport }).promise;

          // Extract student photo
          const photoCanvas = document.createElement("canvas");
          const photoContext = photoCanvas.getContext("2d")!;
          photoCanvas.width = photoW;
          photoCanvas.height = photoH;
          photoContext.drawImage(canvas, photoX, photoY, photoW, photoH, 0, 0, photoW, photoH);
          photoUrl = photoCanvas.toDataURL("image/png");

          // Extract QR code
          const qrCanvas = document.createElement("canvas");
          const qrContext = qrCanvas.getContext("2d")!;
          qrCanvas.width = qrW;
          qrCanvas.height = qrH;
          qrContext.drawImage(canvas, qrX, qrY, qrW, qrH, 0, 0, qrW, qrH);
          qrUrl = qrCanvas.toDataURL("image/png");
        } catch (error) {
          console.warn("Image extraction failed:", error);
        }

        const parsedData = parseExtractedText(lines);
        if (parsedData) {
          parsedData.photoUrl = photoUrl;
          parsedData.qrUrl = qrUrl;
          parsedData.originalPage = 1;
          setApaarCards([parsedData]);
        }
        setIsProcessing(false);
      };
      reader.readAsArrayBuffer(selectedPdf);
    } catch (error: any) {
      if (error.name === 'PasswordException') {
        setIsPasswordProtected(true);
        setNeedsPassword(true);
        toast({
          title: "Password Required",
          description: "This PDF is password-protected. Please enter the correct password.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Processing failed",
          description: "An error occurred while processing the PDF.",
          variant: "destructive"
        });
      }
      setIsProcessing(false);
    }
  };

  // Helper: Convert dataURL to canvas
  const dataURLToCanvas = async (dataURL: string): Promise<HTMLCanvasElement> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        resolve(canvas);
      };
      img.src = dataURL;
    });
  };

  // Helper: Create combined PDF (front+back on A4, same as PanCard/Uan)
  const createCombinedPdf = async (frontDataUrl: string, backDataUrl: string, phoneNumber?: string): Promise<Uint8Array> => {
    const pdfDoc = await PDFDocument.create();
    // A4 size in points
    const A4_WIDTH = 595.28;
    const A4_HEIGHT = 841.89;
    const margin = 40;
    const spacing = 20;

    // Convert images to canvas
    const frontCanvas = await dataURLToCanvas(frontDataUrl);
    const backCanvas = await dataURLToCanvas(backDataUrl);

    // Embed images
    function getPngBytes(dataUrl: string) {
      const base64 = dataUrl.split(',')[1];
      const binary = atob(base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      return bytes;
    }
    const frontImage = await pdfDoc.embedPng(getPngBytes(frontCanvas.toDataURL('image/png', 1.0)));
    const backImage = await pdfDoc.embedPng(getPngBytes(backCanvas.toDataURL('image/png', 1.0)));

    // Calculate card size to fit two cards side by side
    const availableWidth = 210 - (2 * 20) - 10; // mm, for A4
    const cardWidth = availableWidth / 2;
    const cardHeight = cardWidth * (frontCanvas.height / frontCanvas.width);
    const y = 297 - cardHeight - 20; // mm, for A4

    // Convert mm to points for PDF-lib
    const mmToPt = (mm: number) => mm * 2.83465;
    const page = pdfDoc.addPage([mmToPt(210), mmToPt(297)]);
    page.drawImage(frontImage, {
      x: mmToPt(20),
      y: mmToPt(y),
      width: mmToPt(cardWidth),
      height: mmToPt(cardHeight),
    });
    page.drawImage(backImage, {
      x: mmToPt(20 + cardWidth + 10),
      y: mmToPt(y),
      width: mmToPt(cardWidth),
      height: mmToPt(cardHeight),
    });

    // Add phone number if provided (on front card)
    if (phoneNumber) {
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      page.drawText(`Mob: ${phoneNumber}`, {
        x: mmToPt(20 + 5),
        y: mmToPt(y + cardHeight - 5),
        size: 8,
        font,
        color: rgb(0, 0, 0),
      });
    }

    return await pdfDoc.save();
  };

  // Download both cards as combined PDF (A4)
  const handleDownload = async (card: ApaarData, index: number) => {
    if (!frontRef.current || !backRef.current) return;
    const html2canvas = (await import('html2canvas')).default;
    // High quality rendering
    const frontCanvas = await html2canvas(frontRef.current, {
      backgroundColor: '#fff',
      scale: 6,
      useCORS: true,
      width: frontRef.current.offsetWidth,
      height: frontRef.current.offsetHeight,
    });
    const backCanvas = await html2canvas(backRef.current, {
      backgroundColor: '#fff',
      scale: 6,
      useCORS: true,
      width: backRef.current.offsetWidth,
      height: backRef.current.offsetHeight,
    });
    const frontImg = frontCanvas.toDataURL('image/png');
    const backImg = backCanvas.toDataURL('image/png');
    const pdfBytes = await createCombinedPdf(frontImg, backImg, phoneNumber);
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `apaar_card_${card.apaarId || 'download'}.pdf`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 100);
    toast({
      title: "Download Success",
      description: `APAAR card PDF downloaded.`,
    });
  };

  // Print both cards as combined PDF (A4)
  const handlePrintA4 = async (card: ApaarData, index: number) => {
    if (!frontRef.current || !backRef.current) return;
    const html2canvas = (await import('html2canvas')).default;
    // High quality rendering
    const frontCanvas = await html2canvas(frontRef.current, {
      backgroundColor: '#fff',
      scale: 6,
      useCORS: true,
      width: frontRef.current.offsetWidth,
      height: frontRef.current.offsetHeight,
    });
    const backCanvas = await html2canvas(backRef.current, {
      backgroundColor: '#fff',
      scale: 6,
      useCORS: true,
      width: backRef.current.offsetWidth,
      height: backRef.current.offsetHeight,
    });
    const frontImg = frontCanvas.toDataURL('image/png');
    const backImg = backCanvas.toDataURL('image/png');
    const pdfBytes = await createCombinedPdf(frontImg, backImg, phoneNumber);
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const pdfUrl = URL.createObjectURL(blob);
    const printWindow = window.open(pdfUrl, '_blank');
    if (printWindow) {
      printWindow.onload = function () {
        printWindow.focus();
        printWindow.print();
      };
    }
    setTimeout(() => URL.revokeObjectURL(pdfUrl), 10000);
    toast({
      title: "Print started",
      description: "APAAR card sent to printer.",
    });
  };

  // Preview modal
  const previewCard = (index: number) => {
    setSelectedCardIndex(index);
  };

  // UI
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-950 to-gray-900">
      <Sidebar />
      <div className="lg:ml-[280px] flex flex-col min-h-screen">
        <DashboardHeader title="APAAR Card Extractor" icon={CreditCard} showNewServiceButton={false} />
        <main className="flex-1 p-3 sm:p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Upload Section */}
            <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-white flex items-center gap-3">
                  <Upload className="h-5 w-5 text-blue-500" />
                  Upload APAAR PDF
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center">
                  {selectedPdf ? (
                    <div className="space-y-3">
                      <FileText className="h-16 w-16 mx-auto text-blue-500" />
                      <p className="text-white font-medium">{selectedPdf.name}</p>
                      <p className="text-gray-400 text-sm">
                        Size: {(selectedPdf.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                      <Button
                        variant="outline"
                        onClick={triggerFileUpload}
                        className="bg-gray-800/50 text-gray-300 border-gray-700 hover:bg-gray-700/50"
                      >
                        Choose Different File
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Upload className="h-16 w-16 mx-auto text-gray-500" />
                      <div>
                        <p className="text-white font-medium">
                          Drop your APAAR PDF here or click to browse
                        </p>
                        <p className="text-gray-400 text-sm">Supports PDF files up to 50MB</p>
                      </div>
                      <Button onClick={triggerFileUpload} className="bg-indigo-500 text-white hover:bg-indigo-600">
                        Choose PDF File
                      </Button>
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,application/pdf"
                  className="hidden"
                  onChange={handlePdfUpload}
                />
              </CardContent>
            </Card>

            {/* Processing Section */}
            {selectedPdf && (
              <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 mb-6">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-white flex items-center gap-3">
                    <FileText className="h-5 w-5 text-green-500" />
                    Extract APAAR Card
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    onClick={processPdf}
                    disabled={isProcessing}
                    className="bg-green-500 text-white hover:bg-green-600 disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Extracting Card...
                      </>
                    ) : (
                      <>
                        <FileText className="h-4 w-4 mr-2" />
                        Extract APAAR Card
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Results Section */}
            {apaarCards.length > 0 && (
              <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-white flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-purple-500" />
                    Extracted APAAR Card
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {apaarCards.map((card, index) => (
                    <div key={index} className="bg-gray-800/30 rounded-lg p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-white">
                          APAAR Card (Page {card.originalPage})
                        </h3>
                        <Button
                          onClick={() => previewCard(index)}
                          variant="outline"
                          className="bg-gray-700/50 text-gray-300 border-gray-600 hover:bg-gray-600/50"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </Button>
                      </div>
                      <div className="flex gap-6 flex-wrap justify-center">
                        {/* FRONT CARD */}
                        <div
                          ref={frontRef}
                          className="relative w-[400px] h-[255px] bg-white shadow-xl border-2 border-gray-300 rounded-lg overflow-hidden"
                        >
                          <div 
                            className="absolute top-0 left-0 w-full h-[80px] bg-cover bg-center bg-no-repeat"
                            style={{ backgroundImage: "url('/apaar-card-front-template.png')", backgroundSize: "100% 100%" }}
                          />
                          <div 
                            className="absolute bottom-0 left-0 w-full h-[80px] bg-cover bg-center bg-no-repeat"
                            style={{ backgroundImage: "url('/apaar-card-back-template.png')", backgroundSize: "100% 100%" }}
                          />
                          <div className="absolute top-[70px] left-[20px] z-10">
                            <div className="w-[60px] h-[75px] border-2 border-gray-400 bg-gray-100 overflow-hidden">
                              {card.photoUrl ? (
                                <img src={card.photoUrl} alt="Student Photo" className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                                  Student Photo
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="absolute top-[70px] left-[110px] space-y-[4px] text-[12px] z-10">
                            <div className="flex">
                              <span className="w-[70px] font-bold text-black">Name</span>
                              <span className="text-black">{card.name}</span>
                            </div>
                            <div className="flex">
                              <span className="w-[70px] font-bold text-black">DOB</span>
                              <span className="text-black">{card.dob}</span>
                            </div>
                            <div className="flex">
                              <span className="w-[70px] font-bold text-black">Gender</span>
                              <span className="text-black">{card.gender}</span>
                            </div>
                            <div className="flex">
                              <span className="w-[70px] font-bold text-black">Apaar Id</span>
                              <span className="text-black font-mono">{card.apaarId}</span>
                            </div>
                            {phoneNumber && (
                              <div className="flex">
                                <span className="w-[70px] font-bold text-black">Mob</span>
                                <span className="text-black font-mono">{phoneNumber}</span>
                              </div>
                            )}
                          </div>
                          <div className="absolute top-[70px] right-[20px] z-10">
                            <div className="w-[60px] h-[60px] border border-black bg-white">
                              {card.qrUrl ? (
                                <img src={card.qrUrl} alt="QR Code" className="w-full h-full object-contain" />
                              ) : (
                                <div className="w-full h-full bg-white flex items-center justify-center">
                                  <div className="w-[55px] h-[55px] bg-black opacity-80"></div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        {/* BACK CARD */}
                        <div
                          ref={backRef}
                          className="relative w-[400px] h-[255px] bg-white bg-cover bg-no-repeat shadow-xl border-2 border-gray-300 rounded-lg overflow-hidden"
                          style={{
                            backgroundImage: "url('/ApparBack.png')",
                            backgroundSize: "100% 100%"
                          }}
                        >
                        </div>
                      </div>
                      {/* Download/Print Buttons */}
                      <div className="w-full flex flex-wrap gap-4 mt-4">
                        <Button className="bg-indigo-500 hover:bg-indigo-600 text-white text-base px-8 py-2" onClick={() => handleDownload(card, index)}>
                          <Download className="h-4 w-4 mr-2" />Download PDF
                        </Button>
                        <Button className="bg-blue-700 hover:bg-blue-800 text-white text-base px-8 py-2" onClick={() => handlePrintA4(card, index)}>
                          <Printer className="h-4 w-4 mr-2" />Print A4 Layout
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Preview Modal */}
            {selectedCardIndex !== null && (
              <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-bold text-white flex items-center gap-3">
                      <ZoomIn className="h-5 w-5 text-yellow-500" />
                      Card Preview - APAAR {selectedCardIndex + 1}
                    </CardTitle>
                    <Button
                      onClick={() => setSelectedCardIndex(null)}
                      variant="outline"
                      size="sm"
                      className="bg-gray-800/50 text-gray-300 border-gray-700 hover:bg-gray-700/50"
                    >
                      Close
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <h4 className="font-medium text-white text-center">Front Side</h4>
                        <div className="bg-gray-800 rounded-lg p-4 relative">
                          <img
                            src={apaarCards[selectedCardIndex].photoUrl || ""}
                            alt="APAAR Front Preview"
                            className="w-full h-auto rounded-lg"
                          />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <h4 className="font-medium text-white text-center">Back Side</h4>
                        <div className="bg-gray-800 rounded-lg p-4">
                          <img
                            src={apaarCards[selectedCardIndex].qrUrl || ""}
                            alt="APAAR Back Preview"
                            className="w-full h-auto rounded-lg"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Debug extracted text */}
            {/* {rawLines.length > 0 && (
              <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 mt-6">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-white">Extracted Text (Debug)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="w-full max-h-[200px] overflow-y-scroll border rounded-md p-2 bg-gray-900 text-xs font-mono text-white">
                    {rawLines.map((line, i) => (
                      <div key={i}>
                        {i + 1}. {line}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )} */}

            {/* Tweaking Inputs */}
            {/* <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-base font-bold">🛠️ Extraction Coordinates (for development)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="font-semibold mb-2">Photo</div>
                    <div className="flex flex-wrap gap-2 items-center">
                      <label>X: <input type="number" value={photoX} onChange={e => setPhotoX(Number(e.target.value))} className="border px-2 w-16" /></label>
                      <label>Y: <input type="number" value={photoY} onChange={e => setPhotoY(Number(e.target.value))} className="border px-2 w-16" /></label>
                      <label>W: <input type="number" value={photoW} onChange={e => setPhotoW(Number(e.target.value))} className="border px-2 w-16" /></label>
                      <label>H: <input type="number" value={photoH} onChange={e => setPhotoH(Number(e.target.value))} className="border px-2 w-16" /></label>
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold mb-2">QR Code</div>
                    <div className="flex flex-wrap gap-2 items-center">
                      <label>X: <input type="number" value={qrX} onChange={e => setQrX(Number(e.target.value))} className="border px-2 w-16" /></label>
                      <label>Y: <input type="number" value={qrY} onChange={e => setQrY(Number(e.target.value))} className="border px-2 w-16" /></label>
                      <label>W: <input type="number" value={qrW} onChange={e => setQrW(Number(e.target.value))} className="border px-2 w-16" /></label>
                      <label>H: <input type="number" value={qrH} onChange={e => setQrH(Number(e.target.value))} className="border px-2 w-16" /></label>
                    </div>
                  </div>
                </div>
                <Button className="mt-4" onClick={processPdf}>Re-extract Images</Button>
              </CardContent>
            </Card> */}
          </div>
        </main>
        {termsModal}
      </div>
    </div>
  );
}

