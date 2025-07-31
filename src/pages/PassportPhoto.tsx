import React from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import {
  Download,
  Upload,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Share,
  Info,
} from "lucide-react"

export function PassportPhoto() {
  return (
    <div className="flex-1 space-y-6 p-8 bg-background">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Passport Size Photo</h1>
          <p className="text-muted-foreground">Create passport size photos in one click</p>
        </div>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
          New Service Request
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Form Section */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-card-foreground">
              <div className="flex items-center gap-2">
                <Info className="h-5 w-5 text-primary" />
                Information
              </div>
            </CardTitle>
            <div className="space-y-2 mt-2">
              <p className="text-primary text-sm">Hindi: फोटो अपलोड करने से पहले, फोटो का आकार करें 35 x 17 मि (280 x 210 पिक्सेल) ।</p>
              <p className="text-muted-foreground text-sm">English: Before uploading the photo, resize the photo to 35 x 17 or 280 x 210 pixels.</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-foreground">Select Photo</Label>
              <div className="mt-2 flex items-center gap-4">
                <Button variant="outline" className="w-full">
                  Choose File
                </Button>
                <Button variant="outline">
                  Multiple
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-foreground">Name</Label>
                <Input 
                  placeholder="Enter name" 
                  className="mt-1 bg-input border-border text-foreground" 
                />
              </div>

              <div>
                <Label className="text-foreground">Date</Label>
                <Input type="date" className="mt-1 bg-slate-700/50 border-slate-600 text-white" />
              </div>

              <div>
                <Label className="text-foreground">Number</Label>
                <Input type="number" placeholder="Images range 1 to 30" className="mt-1 bg-slate-700/50 border-slate-600 text-white" />
              </div>

              <div>
                <Label className="text-foreground">Page Size</Label>
                <Select>
                  <SelectTrigger className="mt-1 bg-slate-700/50 border-slate-600 text-white">
                    <SelectValue placeholder="A4-Full page (30 photos)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="a4-full">A4-Full page (30 photos)</SelectItem>
                    <SelectItem value="a4-half">A4-Half page (15 photos)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-foreground">Background Color</Label>
                <Input type="color" className="mt-1 h-10 bg-slate-700/50 border-slate-600" />
              </div>

              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                Submit
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Preview Section */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-card-foreground flex items-center justify-between">
              <span>A4 size PDF</span>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" className="hover:bg-accent hover:text-accent-foreground">
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" className="hover:bg-accent hover:text-accent-foreground">
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" className="hover:bg-accent hover:text-accent-foreground">
                  <RotateCw className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" className="hover:bg-accent hover:text-accent-foreground">
                  <Share className="h-4 w-4" />
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-[1/1.4] bg-muted rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">Preview will appear here</p>
            </div>
            <Button className="w-full mt-4 bg-primary text-primary-foreground hover:bg-primary/90">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default PassportPhoto
