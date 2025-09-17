'use client'

import CardMaker from "@/pages/CardMaker";
import ProfileCheckRoute from "@/auth/ProfileCheckRoute";

export default function CardMakerPage() {
  return (
    <ProfileCheckRoute>
      <CardMaker />
    </ProfileCheckRoute>
  );
}