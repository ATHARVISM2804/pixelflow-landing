'use client'

import React, { useState, useRef, useEffect } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Upload,
  Download,
  FileText,
  Scissors,
  Eye,
  Loader2,
  CreditCard,
  RotateCcw,
  ZoomIn,
  Lock,
  Key,
  Printer
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Sidebar from "@/components/Sidebar"
import DashboardHeader from "@/components/DashboardHeader"
import { useToast } from "@/components/ui/use-toast"
import { useTermsNCondition } from "@/components/TermsNCondition"
import * as pdfjsLib from 'pdfjs-dist'
import axios from "axios"
import { auth } from "../auth/firebase"
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import dynamic from "next/dynamic"
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface AbcCardData {
  name: string;
  dob: string;
  gender: string;
  apaarId: string;
  photoUrl?: string;
  qrUrl?: string;
  originalPage?: number;
}

function AbcCard() {
  const [selectedPdf, setSelectedPdf] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [abcCards, setAbcCards] = useState<AbcCardData[]>([])
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null)
  const [password, setPassword] = useState('')
  const [needsPassword, setNeedsPassword] = useState(false)
  const [isPasswordProtected, setIsPasswordProtected] = useState(false)
  const [copies, setCopies] = useState(1)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [rawLines, setRawLines] = useState<string[]>([])
  const [a4PdfUrl, setA4PdfUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null)
  const frontRef = useRef<HTMLDivElement>(null)
  const backRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()
  const { openModal, modal } = useTermsNCondition()

  // Extraction coordinates (for development)
  const [photoX, setPhotoX] = useState<number>(781);
  const [photoY, setPhotoY] = useState<number>(115);
  const [photoW, setPhotoW] = useState<number>(69);
  const [photoH, setPhotoH] = useState<number>(69);
  const [qrX, setQrX] = useState<number>(310);
  const [qrY, setQrY] = useState<number>(205);
  const [qrW, setQrW] = useState<number>(75);
  const [qrH, setQrH] = useState<number>(75);

  const uid = auth.currentUser?.uid;
  const [pendingAction, setPendingAction] = useState<null | { type: "download" | "print", card: AbcCardData, index: number }>(null);

  // Helper function to download image
  const downloadImage = (imageUrl: string, filename: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({
      title: "Download Success",
      description: `${filename} downloaded successfully.`,
    });
  };

  // Parse text for ABC card (similar to APAAR)
  const parseExtractedText = (lines: string[]): AbcCardData | null => {
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

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.type !== 'application/pdf') {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF file only.",
          variant: "destructive"
        })
        return
      }
      setSelectedPdf(file)
      setAbcCards([])
      setSelectedCardIndex(null)
      setPassword('')
      setNeedsPassword(false)
      setIsPasswordProtected(false)
      setRawLines([])
    }
  }

  const triggerFileUpload = () => {
    fileInputRef.current?.click()
  }

  // Configure PDF.js worker
  if (typeof window !== 'undefined' && (pdfjsLib as any).GlobalWorkerOptions) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
  }

  // Update extraction coordinates based on the APAAR card region shown in the image
  const [devPhotoX, setDevPhotoX] = useState(141);
  const [devPhotoY, setDevPhotoY] = useState(12);
  const [devPhotoW, setDevPhotoW] = useState(310);
  const [devPhotoH, setDevPhotoH] = useState(180);

  // Main PDF processing - now crops card first, then applies overlays
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
        
        // Extract the specific APAAR card region first
        let croppedCardImage = "";
        try {
          const viewport = page.getViewport({ scale: 3.0 }); // Increase scale for higher quality
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d")!;
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          await page.render({ canvasContext: context, viewport: viewport }).promise;

          // Crop the APAAR card region using default coordinates
          const cropCanvas = document.createElement("canvas");
          cropCanvas.width = devPhotoW * 3; // scale coordinates
          cropCanvas.height = devPhotoH * 3;
          cropCanvas.getContext("2d")!.drawImage(
            canvas,
            devPhotoX * 3, devPhotoY * 3, devPhotoW * 3, devPhotoH * 3,
            0, 0, devPhotoW * 3, devPhotoH * 3
          );
          croppedCardImage = cropCanvas.toDataURL("image/png");
        } catch (error) {
          console.warn("Card cropping failed:", error);
        }

        // Create ABC card with overlays applied to the cropped card
        const abcCardWithOverlays = await createAbcCardWithOverlays(croppedCardImage);
        
        const parsedData: AbcCardData = {
          name: "ABC Card Holder",
          dob: "01/01/2000",
          gender: "N/A",
          apaarId: "ABC123456789",
          photoUrl: abcCardWithOverlays,
          qrUrl: "", // Not needed for single card
          originalPage: 1
        };

        setAbcCards([parsedData]);
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

  // For development: extract card region using custom coordinates, then apply overlays
  const extractDevCardRegion = async () => {
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
        const viewport = page.getViewport({ scale: 3.0 }); // Increase scale for higher quality
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d")!;
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        await page.render({ canvasContext: context, viewport: viewport }).promise;

        // Extract region using dev coordinates
        const devCanvas = document.createElement("canvas");
        devCanvas.width = devPhotoW * 3;
        devCanvas.height = devPhotoH * 3;
        devCanvas.getContext("2d")!.drawImage(
          canvas,
          devPhotoX * 3, devPhotoY * 3, devPhotoW * 3, devPhotoH * 3,
          0, 0, devPhotoW * 3, devPhotoH * 3
        );
        const devCardImage = devCanvas.toDataURL("image/png");

        // Apply ABC overlays to the extracted card region
        const abcCardWithOverlays = await createAbcCardWithOverlays(devCardImage);

        setAbcCards([{
          name: "Dev Extracted Card",
          dob: "",
          gender: "",
          apaarId: "",
          photoUrl: abcCardWithOverlays,
          qrUrl: "",
          originalPage: 1
        }]);
        setIsProcessing(false);
      };
      reader.readAsArrayBuffer(selectedPdf);
    } catch (error) {
      toast({
        title: "Dev Extraction failed",
        description: "Error extracting card with custom coordinates.",
        variant: "destructive"
      });
      setIsProcessing(false);
    }
  };

  // Create ABC card with top and bottom overlays
  const createAbcCardWithOverlays = async (originalImage: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = async () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw original image
        ctx.drawImage(img, 0, 0);

        // Load and draw top overlay
        const topOverlay = new Image();
        topOverlay.onload = () => {
          // Decrease overlay height from 30% to 20.5%
          const TopoverlayHeight = canvas.height * 0.215;
          const bottomoverlayHeight = canvas.height * 0.22;
          ctx.drawImage(topOverlay, 0, 0, canvas.width, TopoverlayHeight);

          // Load and draw bottom overlay
          const bottomOverlay = new Image();
          bottomOverlay.onload = () => {
            // Decrease overlay height from 30% to 22%
            const overlayHeight = canvas.height * 0.22;
            const bottomY = canvas.height - overlayHeight;
            ctx.drawImage(bottomOverlay, 0, bottomY, canvas.width, bottomoverlayHeight);

            resolve(canvas.toDataURL('image/png', 1.0)); // Use max quality
          };
          bottomOverlay.src = '/ABCBottom.png';
        };
        topOverlay.src = '/ABCTop.png';
      };
      img.src = originalImage;
    });
  };

  // Helper: Convert dataURL to canvas
  const dataURLToCanvas = async (dataURL: string): Promise<HTMLCanvasElement> => {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')!
        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0)
        resolve(canvas)
      }
      img.src = dataURL
    })
  }

  // Helper: Create combined PDF (just one card, improved layout)
  const createCombinedPdf = async (cardDataUrl: string): Promise<Uint8Array> => {
    const pdfDoc = await PDFDocument.create();
    const A4_WIDTH = 595.28;
    const A4_HEIGHT = 841.89;
    const margin = 40;

    // Convert image to canvas
    const cardCanvas = await dataURLToCanvas(cardDataUrl);

    // Embed image
    function getPngBytes(dataUrl: string) {
      const base64 = dataUrl.split(',')[1];
      const binary = atob(base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      return bytes;
    }
    const cardImage = await pdfDoc.embedPng(getPngBytes(cardCanvas.toDataURL('image/png', 1.0)));

    // Calculate card size to fit on A4, keeping aspect ratio and using most of the width
    const availableWidth = A4_WIDTH - (2 * margin);
    const availableHeight = A4_HEIGHT - (2 * margin);
    const cardAspectRatio = cardCanvas.width / cardCanvas.height;
    
    let cardWidth = availableWidth;
    let cardHeight = cardWidth / cardAspectRatio;

    if (cardHeight > availableHeight) {
      cardHeight = availableHeight;
      cardWidth = cardHeight * cardAspectRatio;
    }

    // Place card at the top of the page with margin
    const x = (A4_WIDTH - cardWidth) / 2;
    const y = A4_HEIGHT - cardHeight - margin; // Top of page with margin

    const page = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);
    
    // Add border around the card
    page.drawRectangle({
      x: x - 2,
      y: y - 2,
      width: cardWidth + 4,
      height: cardHeight + 4,
      borderColor: rgb(0, 0, 0),
      borderWidth: 2,
    });

    page.drawImage(cardImage, {
      x,
      y,
      width: cardWidth,
      height: cardHeight,
    });

    return await pdfDoc.save();
  };

  // Generate and set A4 PDF preview URL
  const generateA4PdfPreview = async (card: AbcCardData) => {
    if (!card.photoUrl) return;
    const pdfBytes = await createCombinedPdf(card.photoUrl);
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    setA4PdfUrl(url);
  };

  // When abcCards is updated, generate A4 preview
  useEffect(() => {
    if (abcCards.length > 0 && abcCards[0].photoUrl) {
      generateA4PdfPreview(abcCards[0]);
    } else {
      setA4PdfUrl(null);
    }
    // eslint-disable-next-line
  }, [abcCards]);

  // Modified download function to show terms modal
  const handleDownloadAction = async (card: AbcCardData, index: number) => {
    setPendingAction({ type: "download", card, index });
    openModal();
  };

  // Modified print function to show terms modal  
  const handlePrintAction = async (card: AbcCardData, index: number) => {
    setPendingAction({ type: "print", card, index });
    openModal();
  };

  // Effect to handle the action after agreeing to terms
  useEffect(() => {
    if (!modal.props?.open && pendingAction) {
      // Only proceed if modal was just closed and there is a pending action
      const { type, card, index } = pendingAction;
      setPendingAction(null);
      if (type === "download") {
        // Original download logic
        (async () => {
          try {
            const transaction = {
              uid: uid,
              cardName: 'ABC',
              amount: 2,
              type: 'CARD_CREATION',
              date: new Date().toISOString(),
              metadata: { page: card.originalPage }
            };
            await axios.post(`${BACKEND_URL}/api/transactions/card`, transaction);
            toast({
              title: "Transaction Success",
              description: "Transaction and download started.",
            });
            await handleDownload(card, index);
          } catch (err: any) {
            toast({
              title: "API Error",
              description: err?.response?.data?.message || err.message || "Failed to create transaction.",
              variant: "destructive"
            });
          }
        })();
      } else if (type === "print") {
        // Original print logic
        handlePrintA4(card, index);
      }
    }
  }, [modal.props?.open, pendingAction, uid, toast]);

  // Download single card as PDF
  const handleDownload = async (card: AbcCardData, index: number) => {
    if (!card.photoUrl) return;
    try {
      const pdfBytes = await createCombinedPdf(card.photoUrl);
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `abc_card_${card.apaarId || 'download'}.pdf`;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 100);
      toast({
        title: "Download Success",
        description: `ABC card PDF downloaded.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create PDF.",
        variant: "destructive"
      });
    }
  };

  // Print single card
  const handlePrintA4 = async (card: AbcCardData, index: number) => {
    if (!card.photoUrl) return;
    try {
      const pdfBytes = await createCombinedPdf(card.photoUrl);
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
        description: "ABC card sent to printer.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate PDF for printing.",
        variant: "destructive"
      });
    }
  };

  const previewCard = (index: number) => {
    setSelectedCardIndex(index);
  };

  // For development: extract card region using custom coordinates, then apply overlays
  const extractDevCard = async () => {
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
        const viewport = page.getViewport({ scale: 3.0 }); // Increase scale for higher quality
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d")!;
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        await page.render({ canvasContext: context, viewport: viewport }).promise;

        // Extract region using dev coordinates
        const devCanvas = document.createElement("canvas");
        devCanvas.width = devPhotoW * 3;
        devCanvas.height = devPhotoH * 3;
        devCanvas.getContext("2d")!.drawImage(
          canvas,
          devPhotoX * 3, devPhotoY * 3, devPhotoW * 3, devPhotoH * 3,
          0, 0, devPhotoW * 3, devPhotoH * 3
        );
        const devCardImage = devCanvas.toDataURL("image/png");

        // Apply ABC overlays to the extracted card region
        const abcCardWithOverlays = await createAbcCardWithOverlays(devCardImage);

        setAbcCards([{
          name: "Dev Extracted Card",
          dob: "",
          gender: "",
          apaarId: "",
          photoUrl: abcCardWithOverlays,
          qrUrl: "",
          originalPage: 1
        }]);
        setIsProcessing(false);
      };
      reader.readAsArrayBuffer(selectedPdf);
    } catch (error) {
      toast({
        title: "Dev Extraction failed",
        description: "Error extracting card with custom coordinates.",
        variant: "destructive"
      });
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-950 to-gray-900">
      <Sidebar />
      <div className="lg:ml-[280px] flex flex-col min-h-screen">
        <DashboardHeader title="Make ABC Card (Cards)" icon={CreditCard} showNewServiceButton={false} />
        <main className="flex-1 p-3 sm:p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Notice */}
            <div className="w-full flex justify-center">
              <div className="bg-green-900/90 text-green-200 font-semibold rounded-lg px-8 py-4 mb-4 text-center max-w-2xl">
                <span className="text-lg font-bold">Notice</span>
                <br />
                We only support original ABC PDF files. Please do not upload any other file.
              </div>
            </div>
            {/* Main two-column layout */}
            <div className="flex flex-col md:flex-row gap-6">
              {/* Left: Upload/Form */}
              <div className="flex-1 min-w-[320px]">
                <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-white flex items-center gap-3">
                      <Upload className="h-5 w-5 text-blue-500" />
                      Make ABC Card (Cards)
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
                              Select ABC Card <span className="text-red-400">*</span>
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
                    {selectedPdf && (
                      <div className="pt-4 flex flex-col gap-2">
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
                              Submit
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              {/* Right: Card Preview */}
              <div className="flex-1 min-w-[320px]">
                <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-white flex items-center gap-3">
                      Front and Back
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center">
                      <div className="w-full aspect-[1.6/1] bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center mb-4">
                        {abcCards.length > 0 && abcCards[0].photoUrl ? (
                          <img
                            src={abcCards[0].photoUrl}
                            alt="ABC Card Preview"
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <div className="text-gray-500 text-center w-full">Card preview will appear here</div>
                        )}
                      </div>
                      <Button
                        onClick={() => {
                          if (abcCards.length > 0 && abcCards[0].photoUrl) {
                            downloadImage(abcCards[0].photoUrl, "abc_card.png");
                          }
                        }}
                        className="bg-indigo-500 text-white hover:bg-indigo-600"
                        disabled={!(abcCards.length > 0 && abcCards[0].photoUrl)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            {/* A4 PDF Preview */}
            <div>
              <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 mt-6">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-white flex items-center gap-3">
                    A4 size PDF.
                  </CardTitle>
                  <div className="text-gray-400 text-xs mt-1">
                    This is A4 size page. This page might not work for PVC card.
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="w-full bg-black rounded-lg overflow-hidden border border-gray-800">
                    {a4PdfUrl ? (
                      <iframe
                        src={a4PdfUrl}
                        title="A4 PDF Preview"
                        className="w-full min-h-[400px] rounded-lg"
                      />
                    ) : (
                      <div className="text-gray-500 text-center py-16">A4 PDF preview will appear here</div>
                    )}
                  </div>
                  <div className="flex justify-center mt-4">
                    <Button
                      onClick={() => {
                        if (a4PdfUrl) {
                          const link = document.createElement('a');
                          link.href = a4PdfUrl;
                          link.download = "abc_card_a4.pdf";
                          link.click();
                        }
                      }}
                      className="bg-indigo-500 text-white hover:bg-indigo-600"
                      disabled={!a4PdfUrl}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            {/* ...existing debug/dev sections if needed... */}
          </div>
        </main>
        {modal}
      </div>
    </div>
  )
}

export default AbcCard;
                     