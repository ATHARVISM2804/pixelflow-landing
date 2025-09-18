'use client'

import ProtectedRoute from "@/auth/ProtectedRoute";
import AddMoney from "@/pages/AddMoney";

export default function AdminPage() {
  return (
    <ProtectedRoute>
      <AddMoney />
    </ProtectedRoute>
  );
}