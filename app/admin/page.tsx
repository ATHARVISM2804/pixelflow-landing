'use client'

import AdminPanel from "@/pages/AdminPanel";
import ProtectedRoute from "@/auth/ProtectedRoute";

export default function AdminPage() {
  return (
    <ProtectedRoute>
      <AdminPanel />
    </ProtectedRoute>
  );
}