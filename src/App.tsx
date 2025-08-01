import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard.tsx";
import PassportPhoto from "./pages/PassportPhoto.tsx";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import VoterSlip from "./pages/VoterSlip";
import IMPDSRation from "./pages/IMPDSRation";
import DrivingLicense from "./pages/DrivingLicense";
import AePDSRation from "./pages/AePDSRation";
import Cards from "./pages/Cards";
import IdCard from "./pages/IdCard";
import Kundali from "./pages/Kundali";
import Editor from "./pages/Editor";
import Resume from "./pages/Resume";
import PageMaker from "./pages/Pagemaker.tsx";
import AddMoney from "./pages/AddMoney.tsx";
import ProtectedRoute from './auth/ProtectedRoute.tsx'


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>

            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/passport-photo" element={<ProtectedRoute><PassportPhoto /></ProtectedRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/cards" element={<ProtectedRoute><Cards /></ProtectedRoute>} />
            <Route path="/id-card" element={<ProtectedRoute><IdCard /></ProtectedRoute>} />
            <Route path="/kundli" element={<ProtectedRoute><Kundali /></ProtectedRoute>} />
            <Route path="/editor" element={<ProtectedRoute><Editor /></ProtectedRoute>} />
            <Route path="/resume" element={<ProtectedRoute><Resume /></ProtectedRoute>} />
            <Route path="/voter-slip" element={<ProtectedRoute><VoterSlip /></ProtectedRoute>} />
            <Route path="/impds-ration" element={<ProtectedRoute><IMPDSRation /></ProtectedRoute>} />
            <Route path="/driving-license" element={<ProtectedRoute><DrivingLicense /></ProtectedRoute>} />
            <Route path="/aepds-ration" element={<ProtectedRoute><AePDSRation /></ProtectedRoute>} />
            <Route path="/page-maker" element={<ProtectedRoute><PageMaker /></ProtectedRoute>} />
            <Route path="/add-money" element={<ProtectedRoute><AddMoney /></ProtectedRoute>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
