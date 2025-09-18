'use client'

import ProfileCheckRoute from "@/auth/ProfileCheckRoute";
import Apaar from "@/pages/Apaar";

export default function ApaarPage() {
  return (
    <ProfileCheckRoute>
      <Apaar />
    </ProfileCheckRoute>
  );
}