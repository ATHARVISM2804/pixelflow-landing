'use client'

import Dashboard from "@/pages/Dashboard";
import ProtectedRoute from "@/auth/ProtectedRoute";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <Dashboard />
      
    </ProtectedRoute>
  );
}