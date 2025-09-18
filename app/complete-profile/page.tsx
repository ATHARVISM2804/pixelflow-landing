'use client'

import ProtectedRoute from "@/auth/ProtectedRoute";
import CompleteSignup from "@/components/CompleteSignup";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <CompleteSignup />
    </ProtectedRoute>
  );
}