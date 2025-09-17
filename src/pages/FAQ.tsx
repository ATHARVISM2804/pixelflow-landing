'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { HelpCircle, Search, ChevronDown, ChevronRight } from "lucide-react"
import Sidebar from "@/components/Sidebar"
import DashboardHeader from "@/components/DashboardHeader"

const faqData = [
  {
    category: "General",
    questions: [
      {
        question: "What is ID Maker?",
        answer: "ID Maker is a comprehensive platform that allows you to create various types of identification cards including Aadhaar, PAN, Voter ID, and more. Our service provides easy-to-use tools for generating professional ID cards quickly and securely."
      },
      {
        question: "Is the service free?",
        answer: "We offer both free and premium services. Many basic card generation features are available for free, while advanced features and premium templates require a subscription or one-time payment."
      },
      {
        question: "How secure is my data?",
        answer: "We take data security very seriously. All your personal information is encrypted and stored securely. We never share your data with third parties without your explicit consent."
      }
    ]
  },
  {
    category: "Account & Billing",
    questions: [
      {
        question: "How do I create an account?",
        answer: "You can create an account by clicking the 'Sign Up' button on our homepage. You can register using your email address or sign up with Google/Facebook for faster registration."
      },
      {
        question: "What payment methods do you accept?",
        answer: "We accept various payment methods including UPI, credit/debit cards, net banking, and digital wallets. All payments are processed securely through our payment partners."
      },
      {
        question: "Can I get a refund?",
        answer: "Yes, we offer refunds within 7 days of purchase if you're not satisfied with our service. Please contact our support team with your order details for refund processing."
      }
    ]
  },
  {
    category: "Card Generation",
    questions: [
      {
        question: "What types of cards can I create?",
        answer: "You can create various types of cards including Aadhaar cards, PAN cards, Voter ID cards, Driving License, Ration cards, Health insurance cards (Ayushman), and many more state-specific cards."
      },
      {
        question: "How long does it take to generate a card?",
        answer: "Most cards are generated instantly. However, some complex cards or during high traffic periods might take a few minutes to process."
      },
      {
        question: "Can I edit a card after it's generated?",
        answer: "Yes, you can edit most card details before finalizing. Once downloaded, you'll need to generate a new card with the updated information."
      },
      {
        question: "What file formats are available for download?",
        answer: "Cards can be downloaded in various formats including PDF, PNG, and JPEG. PDF format is recommended for printing purposes."
      }
    ]
  },
  {
    category: "Technical Support",
    questions: [
      {
        question: "The website is not loading properly. What should I do?",
        answer: "Try clearing your browser cache and cookies, or try using a different browser. If the problem persists, please contact our technical support team."
      },
      {
        question: "I'm having trouble uploading my photo. What are the requirements?",
        answer: "Photos should be in JPEG or PNG format, with a maximum size of 5MB. The recommended resolution is 300x300 pixels or higher for best quality."
      },
      {
        question: "Can I use the service on mobile devices?",
        answer: "Yes, our platform is fully responsive and works on all devices including smartphones and tablets. We also have mobile apps available for download."
      }
    ]
  }
]

export function FAQ() {
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const toggleExpanded = (id: string) => {
    setExpandedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  const filteredFAQ = faqData.map(category => ({
    ...category,
    questions: category.questions.filter(
      q => q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
           q.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-950 to-gray-900">
      <Sidebar />

      <div className="lg:ml-[280px] flex flex-col min-h-screen">
        <DashboardHeader title="Frequently Asked Questions" icon={HelpCircle} showNewServiceButton={false} />

        <main className="flex-1 p-3 sm:p-6">
          <div className="mb-6">
            <p className="text-gray-400 text-sm mb-4">Find answers to commonly asked questions about our services</p>
            
            {/* Search */}
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search FAQ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500"
              />
            </div>
          </div>

          <div className="space-y-6">
            {filteredFAQ.map((category, categoryIndex) => (
              <Card key={categoryIndex} className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50">
                <CardHeader>
                  <CardTitle className="text-white text-xl">{category.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {category.questions.map((faq, faqIndex) => {
                      const itemId = `${categoryIndex}-${faqIndex}`
                      const isExpanded = expandedItems.includes(itemId)
                      
                      return (
                        <div key={faqIndex} className="border-b border-gray-700/50 last:border-b-0 pb-4 last:pb-0">
                          <Button
                            variant="ghost"
                            onClick={() => toggleExpanded(itemId)}
                            className="w-full text-left p-0 h-auto hover:bg-transparent justify-start"
                          >
                            <div className="flex items-center gap-3 w-full">
                              {isExpanded ? (
                                <ChevronDown className="h-4 w-4 text-indigo-400 flex-shrink-0" />
                              ) : (
                                <ChevronRight className="h-4 w-4 text-indigo-400 flex-shrink-0" />
                              )}
                              <span className="text-white font-medium text-left">{faq.question}</span>
                            </div>
                          </Button>
                          
                          {isExpanded && (
                            <div className="mt-3 ml-7">
                              <p className="text-gray-300 text-sm leading-relaxed">{faq.answer}</p>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredFAQ.length === 0 && searchTerm && (
              <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50">
                <CardContent className="p-8 text-center">
                  <HelpCircle className="h-12 w-12 mx-auto mb-4 text-gray-500" />
                  <h3 className="text-white text-lg font-medium mb-2">No results found</h3>
                  <p className="text-gray-400 text-sm">
                    We couldn't find any FAQ items matching "{searchTerm}". 
                    Try searching with different keywords or contact our support team.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Contact Support Section */}
          <Card className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 mt-8">
            <CardContent className="p-6 text-center">
              <h3 className="text-black text-lg font-semibold mb-2">Still have questions?</h3>
              <p className="text-gray-700 text-sm mb-4">
                Can't find the answer you're looking for? Our support team is here to help.
              </p>
              <Button 
                onClick={() => window.location.href = '/contact'}
                className="bg-indigo-500 hover:bg-indigo-600 text-white"
              >
                Contact Support
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}

export default FAQ

