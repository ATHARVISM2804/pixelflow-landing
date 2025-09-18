'use client'

import ProfileCheckRoute from "@/auth/ProfileCheckRoute";
import DidCard from "@/pages/DidCard";

export default function DidPage() {
  return (
    <ProfileCheckRoute>
      <DidCard />
    </ProfileCheckRoute>
  );
}