'use client'

import React from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Shield,
  Clock,
  RefreshCw,
  CreditCard,
  Mail,
  CheckCircle,
  AlertTriangle,
  Home,
  ArrowLeft
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Sidebar from "@/components/Sidebar"
import DashboardHeader from "@/components/DashboardHeader"
import Link from "next/link"

export function RefundPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-950 to-gray-900">
      <Sidebar />

      {/* Main Content */}
      <div className="lg:ml-[280px] flex flex-col min-h-screen">
        <DashboardHeader title="Refund & Cancellation Policy" icon={Shield} showNewServiceButton={false} />

        <main className="flex-1 p-3 sm:p-6 space-y-4 sm:space-y-6">
          {/* Back Navigation */}
          <div className="flex items-center gap-4 mb-6">
            <Link href="/dashboard">
              <Button variant="outline" className="bg-gray-800/50 border-gray-700/50 text-gray-300 hover:bg-gray-700/50">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>

          {/* Header Card */}
          <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50">
            <CardContent className="p-6">
              <div className="text-center">
                <Shield className="h-16 w-16 mx-auto mb-4 text-blue-500" />
                <h1 className="text-3xl font-bold text-white mb-2">Refund and Cancellation Policy</h1>
                <p className="text-gray-400 text-lg">Effective Date: September 18, 2025</p>
                <p className="text-gray-300 mt-4 max-w-4xl mx-auto">
                  At <span className="font-semibold text-blue-400">ID Card Store</span>, we place the utmost importance on delivering services that meet and exceed customer expectations. While we strive for excellence in every interaction, we recognize that circumstances may occasionally require cancellations or refunds.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Section 1: Cancellation Policy */}
          <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-3">
                <RefreshCw className="h-6 w-6 text-orange-500" />
                1. Cancellation Policy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300">
                We understand that customers may sometimes need to cancel their service requests due to personal, financial, or operational reasons. To facilitate this:
              </p>
              
              <div className="space-y-4">
                <div className="bg-gray-800/30 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                    <Mail className="h-4 w-4 text-blue-400" />
                    How to Cancel:
                  </h4>
                  <p className="text-gray-300 text-sm">
                    Customers may request a cancellation by sending an email to{' '}
                    <a href="mailto:support@idcard.store" className="text-blue-400 hover:text-blue-300 underline">
                      support@idcard.store
                    </a>{' '}
                    with the subject line "Service Cancellation Request". Please include your order number, registered email address, and the reason for cancellation.
                  </p>
                </div>

                <div className="bg-gray-800/30 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    Acknowledgment of Cancellation:
                  </h4>
                  <p className="text-gray-300 text-sm">
                    Once we receive your cancellation request, you will receive an acknowledgment email within{' '}
                    <span className="font-semibold text-blue-400">24 working hours</span>.
                  </p>
                </div>

                <div className="bg-gray-800/30 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-yellow-400" />
                    Resolution Timeline:
                  </h4>
                  <p className="text-gray-300 text-sm">
                    Our support team will review the request, verify service usage, and provide a resolution within{' '}
                    <span className="font-semibold text-yellow-400">48 hours</span>.
                  </p>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-300 mb-2 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Service Already in Use:
                  </h4>
                  <p className="text-yellow-200 text-sm">
                    If the service has been substantially used or delivered, cancellation may not be eligible for a refund. However, partial refunds may be considered at our discretion.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 2: Refund Policy */}
          <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-3">
                <CreditCard className="h-6 w-6 text-green-500" />
                2. Refund Policy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                <p className="text-green-200 font-semibold text-center">
                  🎯 100% Refund Guarantee
                </p>
                <p className="text-green-300 text-sm text-center mt-2">
                  We are confident in the quality of our services and products.
                </p>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-800/30 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-3">Eligibility:</h4>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                      Refunds are applicable in cases of service failure, technical issues on our part, or if the service delivered does not match the agreed description.
                    </li>
                    <li className="flex items-start gap-2">
                      <Clock className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                      Refund requests must be made within <span className="font-semibold">7 days</span> of the original transaction.
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                      Refunds are not applicable for violations of our Terms of Service or in cases where fraudulent or misleading information has been provided.
                    </li>
                  </ul>
                </div>

                <div className="bg-gray-800/30 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-3">Mode of Refund:</h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <CreditCard className="h-5 w-5 text-blue-400 mt-0.5" />
                      <div>
                        <p className="text-white font-medium">Credit Card Payments:</p>
                        <p className="text-gray-300 text-sm">The refund will be credited back to the original card used during the purchase.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Shield className="h-5 w-5 text-green-400 mt-0.5" />
                      <div>
                        <p className="text-white font-medium">Payment Gateway Transactions:</p>
                        <p className="text-gray-300 text-sm">UPI, Wallets, Net Banking - The refund will be transferred back to the same account used for payment.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-purple-400 mt-0.5" />
                      <div>
                        <p className="text-white font-medium">Other Modes:</p>
                        <p className="text-gray-300 text-sm">If you have used an alternate payment channel, our support team will guide you on the refund process.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800/30 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-3">Processing and Timeline:</h4>
                  <div className="space-y-2 text-gray-300 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span>Refund requests will be processed internally within <span className="font-semibold">24–48 hours</span> of approval.</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span>Once processed, the refund will be initiated through the respective payment provider.</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                      <span>Depending on your bank or gateway, the amount may reflect within <span className="font-semibold">5–7 working days</span>.</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      <span>Customers will receive a confirmation email once the refund has been initiated.</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 3: Important Notes */}
          <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-3">
                <AlertTriangle className="h-6 w-6 text-yellow-500" />
                3. Important Notes on Refunds
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                  <Shield className="h-8 w-8 text-blue-400 mb-3" />
                  <h5 className="font-semibold text-white mb-2">Verification</h5>
                  <p className="text-blue-200 text-sm">
                    All refund requests are subject to verification of the customer's identity, service usage records, and payment details.
                  </p>
                </div>
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                  <CheckCircle className="h-8 w-8 text-green-400 mb-3" />
                  <h5 className="font-semibold text-white mb-2">Disputes</h5>
                  <p className="text-green-200 text-sm">
                    In the unlikely event of a dispute, our internal resolution team will work with you to resolve the matter in a fair and transparent manner.
                  </p>
                </div>
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                  <AlertTriangle className="h-8 w-8 text-red-400 mb-3" />
                  <h5 className="font-semibold text-white mb-2">Final Decision</h5>
                  <p className="text-red-200 text-sm">
                    The decision of ID Card Store regarding refund eligibility will be final and binding.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 4: Customer Support */}
          <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-3">
                <Mail className="h-6 w-6 text-blue-500" />
                4. Customer Support Availability
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300 mb-4">
                We believe in providing proactive and accessible support to all customers.
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-800/30 rounded-lg p-4">
                  <h5 className="font-semibold text-white mb-2 flex items-center gap-2">
                    <Mail className="h-4 w-4 text-blue-400" />
                    Contact Method:
                  </h5>
                  <p className="text-gray-300 text-sm mb-3">
                    All queries, complaints, or refund/cancellation requests should be directed to:
                  </p>
                  <a 
                    href="mailto:support@idcard.store" 
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium inline-flex items-center gap-2 transition-colors"
                  >
                    <Mail className="h-4 w-4" />
                    support@idcard.store
                  </a>
                </div>

                <div className="bg-gray-800/30 rounded-lg p-4">
                  <h5 className="font-semibold text-white mb-2 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-green-400" />
                    Response Times:
                  </h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Response Time:</span>
                      <span className="text-green-400 font-medium">24 hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Resolution Time:</span>
                      <span className="text-blue-400 font-medium">48 hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Support Hours:</span>
                      <span className="text-yellow-400 font-medium">Mon-Sat</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 5: Privacy & Terms */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-3">
                  <Shield className="h-6 w-6 text-purple-500" />
                  5. Privacy Commitment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-gray-300 text-sm">
                  We value your trust and are committed to ensuring the confidentiality and security of your personal information.
                </p>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    Personal details are handled in strict accordance with our Privacy Policy.
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    We will never disclose, sell, or misuse your information.
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-3">
                  <Shield className="h-6 w-6 text-indigo-500" />
                  6. Terms of Service
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-gray-300 text-sm">
                  This Refund and Cancellation Policy forms an integral part of our Terms of Service.
                </p>
                <p className="text-gray-300 text-sm">
                  By availing our services, you agree to comply with these terms and acknowledge that refunds and cancellations are governed by the rules outlined herein.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Contact CTA */}
          <Card className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-xl border border-blue-500/30">
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-bold text-white mb-2">Need Help?</h3>
              <p className="text-gray-300 mb-4">
                If you have any questions about our refund and cancellation policy, we're here to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a 
                  href="mailto:support@idcard.store"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium inline-flex items-center gap-2 transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  Contact Support
                </a>
                <Link href="/dashboard">
                  <Button variant="outline" className="bg-gray-800/50 border-gray-700/50 text-gray-300 hover:bg-gray-700/50">
                    <Home className="h-4 w-4 mr-2" />
                    Back to Dashboard
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}

export default RefundPolicy