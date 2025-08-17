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
import FreeCards from "./pages/FreeCards";
import StateCards from "./pages/StateCards";
import CardMaker from "./pages/CardMaker";
import Aadhar from "./pages/Aadhar.tsx";
import PdfProcessor from "./pages/PdfProcessor";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import Profile from "./pages/Profile";
import PdfTextExtractor from "./pages/Dummy.tsx";
import AadhaarOverlayPDF from "./components/AadhaarOverlayPDF.tsx";
import PanCard from "./pages/PanCard.tsx";
import Voter from "./pages/Voter.tsx";
// import Dummy from "./pages/Dummy.tsx";

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
            <Route path="/overlay" element={<AadhaarOverlayPDF />} />
            <Route path="/text" element={<PdfTextExtractor />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/passport-photo" element={<ProtectedRoute><PassportPhoto /></ProtectedRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/cards" element={<ProtectedRoute><Cards /></ProtectedRoute>} />
            <Route path="/id-card" element={<ProtectedRoute><IdCard /></ProtectedRoute>} />
            <Route path="/kundli" element={<ProtectedRoute><Kundali /></ProtectedRoute>} />
            <Route path="/editor" element={<ProtectedRoute><Editor /></ProtectedRoute>} />
            <Route path="/aadhaar" element={<ProtectedRoute><PdfProcessor /></ProtectedRoute>} />
            <Route path="/voter" element={<ProtectedRoute><Voter /></ProtectedRoute>} />
            <Route path="/resume" element={<ProtectedRoute><Resume /></ProtectedRoute>} />
            <Route path="/voter-slip" element={<ProtectedRoute><VoterSlip /></ProtectedRoute>} />
            <Route path="/impds-ration" element={<ProtectedRoute><IMPDSRation /></ProtectedRoute>} />
            <Route path="/driving-license" element={<ProtectedRoute><DrivingLicense /></ProtectedRoute>} />
            <Route path="/aepds-ration" element={<ProtectedRoute><AePDSRation /></ProtectedRoute>} />
            <Route path="/page-maker" element={<ProtectedRoute><PageMaker /></ProtectedRoute>} />
            <Route path="/add-money" element={<ProtectedRoute><AddMoney /></ProtectedRoute>} />
            <Route path="/free-cards" element={<FreeCards />} />
            <Route path="/free-cards/:stateCode" element={<StateCards />} />
            <Route path="/card/:cardType/:stateCode" element={<CardMaker />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/pan" element={<PanCard />} />
            {/* <Route path="/dummy" element={<Dummy />} /> */}
            {/* <Route path="/aadhaar" element={<ProtectedRoute><Aadhar /></ProtectedRoute>} /> */}
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
