'use client'

import IdCard from "@/pages/IdCard";
import ProfileCheckRoute from "@/auth/ProfileCheckRoute";

export default function IdCardPage() {
  return (
    <ProfileCheckRoute>
      <IdCard />
    </ProfileCheckRoute>
  );
}