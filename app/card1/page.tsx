'use client'

import Cards from "@/pages/Cards";
import ProfileCheckRoute from "@/auth/ProfileCheckRoute";

export default function Card1Page() {
  return (
    <ProfileCheckRoute>
      <Cards />
    </ProfileCheckRoute>
  );
}