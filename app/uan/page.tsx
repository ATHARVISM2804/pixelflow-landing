'use client'

import ProfileCheckRoute from "@/auth/ProfileCheckRoute";
import Uan from "@/pages/Uan";

export default function UanPage() {
  return (
    <ProfileCheckRoute>
      <Uan />
    </ProfileCheckRoute>
  );
}