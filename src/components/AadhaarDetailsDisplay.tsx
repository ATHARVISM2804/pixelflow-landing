import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { FileText, Loader2 } from "lucide-react"
import Tesseract from 'tesseract.js'

// Interface for the extracted Aadhaar card details
export interface AadhaarFrontData {
  name: string
  dob: string
  gender: string
  aadhaarNumber: string
}

// Props for the component
interface AadhaarDetailsDisplayProps {
  imageData: string
  cardIndex: number
  onExtracted?: (details: AadhaarFrontData, cardIndex: number) => void
}

// Helper function to convert data URL to canvas
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

// Function to extract Aadhaar details from an image
const extractAadhaarFrontDetails = async (canvas: HTMLCanvasElement): Promise<AadhaarFrontData> => {
  const dataUrl = canvas.toDataURL('image/png')

  try {
    const { data: { text } } = await Tesseract.recognize(dataUrl, 'eng+hin', {
      logger: m => console.log('[Tesseract]', m),
    })

    console.log("Raw OCR Text:\n", text)

    // Regular expressions to extract details
    const nameMatch = text.match(/([A-Z][a-z]+ [A-Z][a-z]+)/)
    const dobMatch = text.match(/DOB[: ]+(\d{2}\/\d{2}\/\d{4})/)
    const genderMatch = text.match(/MALE|FEMALE|पुरुष|महिला/i)
    const aadhaarMatch = text.match(/\d{4} \d{4} \d{4}/)

    return {
      name: nameMatch?.[1] || 'Not found',
      dob: dobMatch?.[1] || 'Not found',
      gender: genderMatch?.[0] || 'Not found',
      aadhaarNumber: aadhaarMatch?.[0] || 'Not found',
    }
  } catch (error) {
    console.error("Error extracting Aadhaar details:", error)
    return {
      name: 'Extraction failed',
      dob: 'Extraction failed',
      gender: 'Extraction failed',
      aadhaarNumber: 'Extraction failed',
    }
  }
}

const AadhaarDetailsDisplay: React.FC<AadhaarDetailsDisplayProps> = ({ 
  imageData, 
  cardIndex,
  onExtracted
}) => {
  const [details, setDetails] = useState<AadhaarFrontData | null>(null)
  const [isExtracting, setIsExtracting] = useState(false)

  const extractDetails = async () => {
    setIsExtracting(true)
    try {
      const canvas = await dataURLToCanvas(imageData)
      const extractedDetails = await extractAadhaarFrontDetails(canvas)
      
      setDetails(extractedDetails)
      
      // Notify parent component if callback provided
      if (onExtracted) {
        onExtracted(extractedDetails, cardIndex)
      }
    } catch (error) {
      console.error("Failed to extract details:", error)
    } finally {
      setIsExtracting(false)
    }
  }

  useEffect(() => {
    // Auto-extract when component mounts or image changes
    if (imageData && !details) {
      extractDetails()
    }
  }, [imageData])

  if (!details) {
    return (
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-3 mt-3">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-medium text-white">Aadhaar Details</h4>
          <Button
            size="sm"
            disabled={isExtracting}
            onClick={extractDetails}
            className="bg-blue-500/20 text-blue-300 border-blue-500/30 hover:bg-blue-500/30"
          >
            {isExtracting ? (
              <>
                <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                Extracting...
              </>
            ) : (
              <>
                <FileText className="h-3 w-3 mr-2" />
                Extract Details
              </>
            )}
          </Button>
        </div>
        <div className="text-gray-400 text-sm text-center py-2">
          {isExtracting ? "Extracting details from image..." : "Click to extract details from Aadhaar card"}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-3 mt-3">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-medium text-white">Extracted Details</h4>
        <Button
          size="sm"
          onClick={extractDetails}
          className="bg-blue-500/20 text-blue-300 border-blue-500/30 hover:bg-blue-500/30"
        >
          <FileText className="h-3 w-3 mr-2" />
          Re-Extract
        </Button>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between p-1 bg-gray-700/30 rounded">
          <span className="text-gray-300">Name:</span>
          <span className="text-white font-medium">{details.name}</span>
        </div>
        <div className="flex justify-between p-1 bg-gray-700/30 rounded">
          <span className="text-gray-300">DOB:</span>
          <span className="text-white font-medium">{details.dob}</span>
        </div>
        <div className="flex justify-between p-1 bg-gray-700/30 rounded">
          <span className="text-gray-300">Gender:</span>
          <span className="text-white font-medium">{details.gender}</span>
        </div>
        <div className="flex justify-between p-1 bg-gray-700/30 rounded">
          <span className="text-gray-300">Aadhaar #:</span>
          <span className="text-white font-medium">{details.aadhaarNumber}</span>
        </div>
      </div>

      <div className="mt-3 pt-2 border-t border-gray-700">
        <p className="text-gray-400 text-xs">Details extracted using OCR technology. Results may not be 100% accurate.</p>
      </div>
    </div>
  )
}

export default AadhaarDetailsDisplay
