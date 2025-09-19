'use client'

import ProfileCheckRoute from "@/auth/ProfileCheckRoute";
import PageMaker from "@/pages/Pagemaker";

export default function PassportPhotoPage() {
  return (
    <ProfileCheckRoute>
      <PageMaker />
    </ProfileCheckRoute>
  );
}