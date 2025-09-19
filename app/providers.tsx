'use client'

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "@/auth/AuthContext";
import { WalletProvider } from "@/context/WalletContext";
import { useState } from "react";

// Create a wrapper component to access auth context
function WalletProviderWrapper({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  
  return (
    <WalletProvider userId={user?.uid}>
      {children}
    </WalletProvider>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <WalletProviderWrapper>
            <Toaster />
            <Sonner />
            {children}
          </WalletProviderWrapper>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}