import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { MessageSquare, Mail, Phone, MapPin, Send, Clock } from "lucide-react"
import Sidebar from "@/components/Sidebar"
import DashboardHeader from "@/components/DashboardHeader"

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log('Contact form submitted:', formData)
    // Reset form
    setFormData({ name: '', email: '', subject: '', message: '' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-950 to-gray-900">
      <Sidebar />

      <div className="lg:ml-[280px] flex flex-col min-h-screen">
        <DashboardHeader title="Contact Us" icon={MessageSquare} showNewServiceButton={false} />

        <main className="flex-1 p-3 sm:p-6">
          <div className="mb-6">
            <p className="text-gray-400 text-sm">Get in touch with us for any questions or support</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Contact Information */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50">
                <CardHeader>
                  <CardTitle className="text-white text-xl">Get In Touch</CardTitle>
                  <p className="text-gray-400 text-sm">We're here to help and answer any question you might have</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-indigo-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="h-6 w-6 text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">Email</h3>
                      <p className="text-gray-400 text-sm">support@idmaker.com</p>
                      <p className="text-gray-400 text-sm">info@idmaker.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="h-6 w-6 text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">Phone</h3>
                      <p className="text-gray-400 text-sm">+91 9876543210</p>
                      <p className="text-gray-400 text-sm">+91 8765432109</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-6 w-6 text-orange-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">Address</h3>
                      <p className="text-gray-400 text-sm">123 Tech Street</p>
                      <p className="text-gray-400 text-sm">Mumbai, Maharashtra 400001</p>
                      <p className="text-gray-400 text-sm">India</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="h-6 w-6 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">Business Hours</h3>
                      <p className="text-gray-400 text-sm">Monday - Friday: 9:00 AM - 6:00 PM</p>
                      <p className="text-gray-400 text-sm">Saturday: 10:00 AM - 4:00 PM</p>
                      <p className="text-gray-400 text-sm">Sunday: Closed</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50">
                <CardHeader>
                  <CardTitle className="text-white text-xl">Send us a Message</CardTitle>
                  <p className="text-gray-400 text-sm">Fill out the form below and we'll get back to you as soon as possible</p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-white text-sm">Name *</Label>
                        <Input
                          placeholder="Your full name"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className="mt-1 bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500"
                          required
                        />
                      </div>
                      <div>
                        <Label className="text-white text-sm">Email *</Label>
                        <Input
                          type="email"
                          placeholder="your.email@example.com"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="mt-1 bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-white text-sm">Subject *</Label>
                      <Input
                        placeholder="What is this regarding?"
                        value={formData.subject}
                        onChange={(e) => handleInputChange('subject', e.target.value)}
                        className="mt-1 bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500"
                        required
                      />
                    </div>

                    <div>
                      <Label className="text-white text-sm">Message *</Label>
                      <Textarea
                        placeholder="Please describe your question or issue in detail..."
                        value={formData.message}
                        onChange={(e) => handleInputChange('message', e.target.value)}
                        className="mt-1 bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500 h-32"
                        required
                      />
                    </div>

                    <Button 
                      type="submit"
                      className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Contact
