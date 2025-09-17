'use client'

import PdfProcessor from "@/pages/PdfProcessor";
import ProfileCheckRoute from "@/auth/ProfileCheckRoute";

export default function AadhaarPage() {
  return (
    <ProfileCheckRoute>
      <PdfProcessor />
    </ProfileCheckRoute>
  );
}