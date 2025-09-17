'use client'

import Cards from "@/pages/Cards";
import ProfileCheckRoute from "@/auth/ProfileCheckRoute";

export default function CardsPage() {
  return (
    <ProfileCheckRoute>
      <Cards />
    </ProfileCheckRoute>
  );
}