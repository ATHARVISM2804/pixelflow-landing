'use client'

import ProfileCheckRoute from "@/auth/ProfileCheckRoute";
import AbcCard from "@/pages/AbcCard";

export default function AayushmaanPage() {
  return (
    <ProfileCheckRoute>
      <AbcCard />
    </ProfileCheckRoute>
  );
}