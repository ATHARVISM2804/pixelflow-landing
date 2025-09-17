'use client'

import Resume from "@/pages/Resume";
import ProfileCheckRoute from "@/auth/ProfileCheckRoute";

export default function ResumePage() {
  return (
    <ProfileCheckRoute>
      <Resume />
    </ProfileCheckRoute>
  );
}