'use client'

import PassportPhoto from "@/pages/PassportPhoto";
import ProfileCheckRoute from "@/auth/ProfileCheckRoute";

export default function PassportPhotoPage() {
  return (
    <ProfileCheckRoute>
      <PassportPhoto />
    </ProfileCheckRoute>
  );
}