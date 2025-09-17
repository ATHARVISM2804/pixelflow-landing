'use client'

import Kundali from "@/pages/Kundali";
import ProfileCheckRoute from "@/auth/ProfileCheckRoute";

export default function KundliPage() {
  return (
    <ProfileCheckRoute>
      <Kundali />
    </ProfileCheckRoute>
  );
}