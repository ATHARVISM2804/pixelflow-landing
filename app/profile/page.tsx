'use client'

import Profile from "@/pages/Profile";
import ProtectedRoute from "@/auth/ProtectedRoute";

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <Profile />
    </ProtectedRoute>
  );
}