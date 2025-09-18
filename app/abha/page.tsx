'use client'

import ProfileCheckRoute from "@/auth/ProfileCheckRoute";
import Aayushmaan from "@/pages/Aayushmaan";

export default function AayushmaanPage() {
  return (
    <ProfileCheckRoute>
      <Aayushmaan />
    </ProfileCheckRoute>
  );
}