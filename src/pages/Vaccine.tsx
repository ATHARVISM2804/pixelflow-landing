'use client'

import React, { useState, useRef } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Upload,
    FileText,
    Loader2,
    CreditCard,
    Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/Sidebar";
import DashboardHeader from "@/components/DashboardHeader";
import { useToast } from "@/components/ui/use-toast";
import * as pdfjsLib from "pdfjs-dist";
import "pdfjs-dist/build/pdf.worker.entry";
import NationalEmblem from './National-Emblem.png'
import narendramodi from './NarendraModi.png'
import jsPDF from 'jspdf';
import axios from "axios";
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
import { auth } from "../auth/firebase";

interface VaccinationData {
    certificateId: string;
    name: string;
    age: string;
    gender: string;
    idVerified: string;
    uniqueHealthId?: string;
    referenceId: string;
    status: string;
    vaccine: string;
    vaccineType: string;
    manufacturer: string;
    dose1: string;
    batch1: string;
    dose2: string;
    batch2: string;
    vaccinator: string;
    location: string;
    qrCodeDataUrl?: string;
}

// bilingual labels
const labels = {
    beneficiaryName: "Beneficiary Name / ਲਾਭਪਾਤਰੀ ਦਾ ਨਾਮ",
    gender: "Gender / ਲਿੰਗ",
    idVerified: "ID Verified / ਪਛਾਣ ਪ੍ਰਮਾਣਿਤ",
    uniqueHealthId: "Unique Health ID (UHID)",
    referenceId: "Beneficiary Reference ID",
    vaccinationName: "Vaccination Name / ਟੀਕੇ ਦਾ ਨਾਮ",
    dose1: "Date of 1st Dose / ਪਹਿਲੀ ਖੁਰਾਕ ਦੀ ਮਿਤੀ",
    dose2: "Date of 2nd Dose / ਦੂਜੀ ਖੁਰਾਕ ਦੀ ਮਿਤੀ",
    precaution: "Precaution dose",
    vaccinatedBy: "Vaccinated by / ਟੀਕਾਕਰਮੀ",
    vaccinationAt: "Vaccination at / ਟੀਕਾਕਰਨ ਦੀ ਜਗਾ"
};

export function Vaccine() {
    const [selectedPdf, setSelectedPdf] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [cardData, setCardData] = useState<VaccinationData | null>(null);
    const [rawLines, setRawLines] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const frontRef = useRef<HTMLDivElement>(null);
    const backRef = useRef<HTMLDivElement>(null);
    const { toast } = useToast();

    const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
        setCardData(null);
        setRawLines([]);
    };

    const triggerFileUpload = () => {
        fileInputRef.current?.click();
    };

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
                const pdf = await pdfjsLib.getDocument(typedArray).promise;
                const page = await pdf.getPage(1);
                const textContent = await page.getTextContent();

                const lines = textContent.items
                    .map((item: any) => item.str)
                    .filter((s: string) => s.trim() !== "");
                setRawLines(lines);

                const dataStart = lines.findIndex(l => /^\d{9,}$/.test(l.trim()));
                const info = lines.slice(dataStart);

                // Extract QR code
                let qrCodeDataUrl = "";
                try {
                    const viewport = page.getViewport({ scale: 2.0 });
                    const canvas = document.createElement('canvas');
                    const context = canvas.getContext('2d')!;
                    canvas.height = viewport.height;
                    canvas.width = viewport.width;

                    await page.render({
                        canvasContext: context,
                        viewport: viewport
                    }).promise;

                    // Convert canvas to image data
                    const imageData = canvas.toDataURL('image/png');
                    
                    // For QR code extraction, we'll crop the bottom-right area where QR codes are typically located
                    const qrCanvas = document.createElement('canvas');
                    const qrContext = qrCanvas.getContext('2d')!;
                    const qrSize = 430; // Size of QR code area to extract
                    qrCanvas.width = qrSize;
                    qrCanvas.height = qrSize;

                    const img = new Image();
                    img.onload = () => {
                        // Crop from bottom-right corner (typical QR location)
                        const sourceX = img.width - qrSize - 50;
                        const sourceY = img.height - qrSize - 97;
                        qrContext.drawImage(img, sourceX, sourceY, qrSize, qrSize, 0, 0, qrSize, qrSize);
                        qrCodeDataUrl = qrCanvas.toDataURL('image/png');
                        
                        // Update data with QR code
                        const data: VaccinationData = {
                            certificateId: info[0] || "",
                            name: info[1] || "",
                            age: info[2] || "",
                            gender: info[3] || "",
                            idVerified: info[4] || "",
                            referenceId: info[5] || "",
                            status: info[6] || "",
                            vaccine: info[7] || "",
                            vaccineType: info[8] || "",
                            manufacturer: info[9] || "",
                            dose1: info[11] || "",
                            batch1: info[12] || "",
                            dose2: info[14] || "",
                            batch2: info[15] || "",
                            vaccinator: info[16] || "",
                            location: info[17] || "",
                            qrCodeDataUrl: qrCodeDataUrl
                        };

                        setCardData(data);
                        toast({
                            title: "Extraction Success",
                            description: "Vaccination card data and QR code extracted.",
                        });
                        setIsProcessing(false);
                    };
                    img.src = imageData;
                } catch (qrError) {
                    console.warn("QR extraction failed:", qrError);
                    // Fallback without QR code
                    const data: VaccinationData = {
                        certificateId: info[0] || "",
                        name: info[1] || "",
                        age: info[2] || "",
                        gender: info[3] || "",
                        idVerified: info[4] || "",
                        referenceId: info[5] || "",
                        status: info[6] || "",
                        vaccine: info[7] || "",
                        vaccineType: info[8] || "",
                        manufacturer: info[9] || "",
                        dose1: info[11] || "",
                        batch1: info[12] || "",
                        dose2: info[14] || "",
                        batch2: info[15] || "",
                        vaccinator: info[16] || "",
                        location: info[17] || "",
                        qrCodeDataUrl: ""
                    };

                    setCardData(data);
                    toast({
                        title: "Extraction Success",
                        description: "Vaccination card data extracted (QR code extraction failed).",
                    });
                    setIsProcessing(false);
                }
            };
            reader.readAsArrayBuffer(selectedPdf);
        } catch (error) {
            toast({
                title: "Processing failed",
                description: "An error occurred while processing the PDF.",
                variant: "destructive"
            });
            setIsProcessing(false);
        }
    };

    // Download and API logic
    const handleDownload = async () => {
        if (!cardData) return;
        if (!window.confirm("Are you sure you want to download the vaccination card PDF?")) return;
        try {
            // Transaction API call
            const transaction = {
                uid: auth.currentUser?.uid,
                cardName: 'Vaccine',
                amount: 2, // or any logic for pricing
                type: 'CARD_CREATION',
                date: new Date().toISOString(),
                metadata: { certificateId: cardData.certificateId }
            };
            await axios.post(`${BACKEND_URL}/api/transactions/card`, transaction);

            // PDF generation
            const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [650, 400] });
            const html2canvas = (await import('html2canvas')).default;
            const front = frontRef.current;
            const back = backRef.current;
            if (front && back) {
                const width = front.offsetWidth;
                const height = front.offsetHeight;
                const frontCanvas = await html2canvas(front, { backgroundColor: '#fff', scale: 1, width, height });
                const backCanvas = await html2canvas(back, { backgroundColor: '#fff', scale: 1, width, height });
                const frontImg = frontCanvas.toDataURL('image/png');
                const backImg = backCanvas.toDataURL('image/png');
                pdf.addImage(frontImg, 'PNG', 0, 0, width, height);
                pdf.addPage([width, height], 'landscape');
                pdf.addImage(backImg, 'PNG', 0, 0, width, height);
                pdf.save(`vaccination_card_${cardData.certificateId || 'download'}.pdf`);
            }
        } catch (err: any) {
            toast({
                title: "Download Error",
                description: err?.response?.data?.message || err.message || "Failed to download vaccination card.",
                variant: "destructive"
            });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-950 to-gray-900">
            <Sidebar />
            <div className="lg:ml-[280px] flex flex-col min-h-screen">
                <DashboardHeader
                    title="Vaccination Card Extractor"
                    icon={CreditCard}
                    showNewServiceButton={false}
                />
                <main className="flex-1 p-3 sm:p-6">
                    <div className="max-w-6xl mx-auto space-y-6">

                        {/* Upload Section */}
                        <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50">
                            <CardHeader>
                                <CardTitle className="text-xl font-bold text-white flex items-center gap-3">
                                    <Upload className="h-5 w-5 text-blue-500" />
                                    Upload Vaccination PDF
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
                                                    Drop your Vaccination PDF here or click to browse
                                                </p>
                                                <p className="text-gray-400 text-sm">
                                                    Supports PDF files up to 50MB
                                                </p>
                                            </div>
                                            <Button
                                                onClick={triggerFileUpload}
                                                className="bg-indigo-500 text-white hover:bg-indigo-600"
                                            >
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
                            <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50">
                                <CardHeader>
                                    <CardTitle className="text-xl font-bold text-white flex items-center gap-3">
                                        <CreditCard className="h-5 w-5 text-green-500" />
                                        Extract Vaccination Card
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
                                                Extract Vaccination Card
                                            </>
                                        )}
                                    </Button>
                                </CardContent>
                            </Card>
                        )}

                        {/* Card Preview */}
                        {cardData && (
                            <div className="flex gap-6 flex-wrap justify-center">
                                {/* FRONT */}
                                <div
                                    ref={frontRef}
                                    className="vaccine-card-front relative w-[650px] h-[400px] bg-cover bg-white bg-no-repeat shadow-lg border rounded-xl p-6"
                                    style={{ backgroundImage: "url('/card-front-template.png')" }}
                                >
                                    {/* National Emblem overlay */}
                                    <img
                                        src={NationalEmblem}
                                        // src={NationalEmblem}
                                        alt="National Emblem"
                                        className="absolute top-3 left-6 w-[80px] h-[100px] object-contain z-10"
                                        style={{ pointerEvents: "none" }}
                                    />

                                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-full text-center">
                                        <p className="font-bold text-2xl">Ministry of Health & Family Welfare</p>
                                        <p className="text-gray-600 text-2xl">Government of India</p>
                                        <p className="font-bold text-lg underline">Vaccination Card</p>
                                    </div>

                                    <div className="translate-y-8">
                                        <p className="absolute top-[63px] right-[80px] text-base font-bold text-black">
                                            Certificate ID: {cardData.certificateId}
                                        </p>

                                        <p className="absolute top-[58px] left-[40px] text-red-500 text-2xl font-bold underline">Benificiary Details</p>

                                        {/* Details Section */}
                                        <div className="absolute top-[90px] left-[40px] space-y-1 text-sm text-black">
                                            <div className="grid grid-cols-2 gap-x-6 gap-y-1">
                                                <span className="font-bold">{labels.beneficiaryName}</span>
                                                <span>{cardData.name} ({cardData.age})</span>
                                                <span className="font-bold">{labels.gender}</span>
                                                <span>{cardData.gender}</span>
                                                <span className="font-bold">{labels.idVerified}</span>
                                                <span>{cardData.idVerified}</span>
                                                <span className="font-bold">{labels.uniqueHealthId}</span>
                                                <span>{cardData.uniqueHealthId || ""}</span>
                                                <span className="font-bold">{labels.referenceId}</span>
                                                <span>{cardData.referenceId}</span>
                                                <span className="font-bold">{labels.vaccinationName}</span>
                                                <span>{cardData.vaccine}</span>
                                                <span className="font-bold">{labels.dose1}</span>
                                                <span>{cardData.dose1} (Batch {cardData.batch1})</span>
                                                <span className="font-bold">{labels.dose2}</span>
                                                <span>{cardData.dose2} (Batch {cardData.batch2})</span>
                                                <span className="font-bold">{labels.precaution}</span>
                                                <span></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>


                                {/* BACK */}
                                <div
                                    ref={backRef}
                                    className="vaccine-card-back relative w-[650px] h-[400px] bg-cover bg-white bg-no-repeat shadow-lg border rounded-xl p-6"
                                    style={{ backgroundImage: "url('/card-back-template.png')" }}
                                >
                                    {/* Top left: Vaccinated by / at */}
                                    <div className="absolute top-6 left-6 text-[17px] leading-tight">
                                        <div className="flex gap-2 items-center">
                                            <span className="font-bold">{labels.vaccinatedBy}:</span>
                                            <span>{cardData.vaccinator}</span>
                                        </div>
                                        <div className="flex gap-2 items-center mt-1">
                                            <span className="font-bold">{labels.vaccinationAt}:</span>
                                            <span>{cardData.location}</span>
                                        </div>
                                    </div>
                                    {/* Top right: Name and location */}
                                    {/* <div className="absolute top-6 right-6 text-right text-[17px] leading-tight">
                                    <div className="font-bold">{cardData.name}</div>
                                    <div>{cardData.location}</div>
                                  </div> */}
                                    {/* Center left: Motivational quote (positioned as in image) */}
                                    <div className="absolute left-[35px] top-[100px] w-[340px]">
                                            <p className="font-bold text-[28px] leading-tight text-black mb-2">
                                                “ਦਵਾਈ ਵੀ ਅਤੇ ਕੜਾਈ ਵੀ |”
                                            </p>
                                        <div className="transform translate-x-[50%] translate-y-[-5%]">
                                            <p className="font-bold text-[22px] leading-tight text-black mb-2">
                                                Together, India<br />will defeat<br />
                                                <span className="text-black font-extrabold text-[26px]">COVID-19</span>
                                            </p>
                                            <p className="text-[18px] text-black font-medium mt-2">- ਪ੍ਰਧਾਨ ਮੰਤਰੀ</p>
                                        </div>
                                    </div>
                                    {/* Modi image at bottom left (keep size and position unchanged) */}
                                    <img
                                        src={narendramodi}
                                        alt="Narendra Modi"
                                        className="absolute left-6 bottom-[65px] w-[220px] h-[220px] object-contain z-10"
                                        style={{ pointerEvents: "none" }}
                                    />
                                    {/* Bottom left: Disclaimer */}
                                    <div className="absolute left-6 bottom-6 w-[340px] text-[11px] text-gray-700">
                                        The information on the card is a copy provided by the beneficiary, based on publicly available data, and is for reference/personal use only, not a valid document.
                                    </div>
                                    {/* Bottom right: QR Code */}
                                    <div className="absolute right-6 bottom-6 flex translate-x-3 flex-col items-center">
                                        {cardData.qrCodeDataUrl ? (
                                            <div className="flex flex-col items-center">
                                                <img 
                                                    src={cardData.qrCodeDataUrl} 
                                                    alt="QR Code" 
                                                    className="w-[240px] p-2 h-[240px] object-contain border border-gray-300"
                                                />
                                                <p className="text-[12px] text-black font-bold mt-2 text-center">
                                                    Scan QR Code on https://verify.cowin.gov.in
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="w-[150px] h-[150px] border-2 border-dashed border-gray-400 flex items-center justify-center">
                                                <p className="text-[10px] text-gray-600 text-center">QR Code<br/>Not Available</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Download Button */}
                                <div className="w-full flex justify-center mt-4">
                                    <Button className="bg-indigo-500 hover:bg-indigo-600 text-white text-base px-8 py-2" onClick={handleDownload}>
                                        <Download className="h-4 w-4 mr-2" />Download PDF
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Debug extracted text */}
                        {rawLines.length > 0 && (
                            <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50">
                                <CardHeader>
                                    <CardTitle className="text-lg font-bold text-white">Extracted Text (Debug)</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="w-full max-h-[200px] overflow-y-scroll border rounded-md p-2 bg-gray-900 text-xs font-mono text-white">
                                        {rawLines.map((line, i) => (
                                            <div key={i}>{i + 1}. {line}</div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Vaccine;

