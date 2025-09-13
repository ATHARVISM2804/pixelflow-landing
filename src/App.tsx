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
import ProfileCheckRoute from './auth/ProfileCheckRoute.tsx'
import FreeCards from "./pages/FreeCards";
import StateCards from "./pages/StateCards";
import CardMaker from "./pages/CardMaker";
import PdfProcessor from "./pages/PdfProcessor";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import Profile from "./pages/Profile";
import PdfTextExtractor from "./pages/Dummy.tsx";
import AadhaarOverlayPDF from "./components/AadhaarOverlayPDF.tsx";
import PanCard from "./pages/PanCard.tsx";
import Voter from "./pages/Voter.tsx";
import DidCard from "./pages/DidCard.tsx";
import Uan from "./pages/Uan.tsx";
import Apaar from "./pages/Apaar.tsx";
import Aayushmaan from "./pages/Aayushmaan.tsx";
import VaccinationCard from "./pages/Vaccine.tsx";
import CompleteSignup from "./components/CompleteSignup.tsx";
import RemoveBg from "./pages/RemoveBg.tsx";

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
            <Route path="/vaccination" element={<VaccinationCard />} />
            <Route path="/text" element={<PdfTextExtractor />} />
            <Route path="/complete-profile" element={<ProtectedRoute><CompleteSignup /></ProtectedRoute>} />
            <Route path="/remove-bg" element={<ProtectedRoute><RemoveBg /></ProtectedRoute>} />

            {/* Protected Routes without Profile Completion Requirement */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/free-cards" element={<FreeCards />} />
            <Route path="/free-cards/:stateCode" element={<StateCards />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

            {/* Protected Routes with Profile Completion Required */}
            <Route path="/did" element={<ProfileCheckRoute><DidCard /></ProfileCheckRoute>} />
            <Route path="/abha" element={<ProfileCheckRoute><Aayushmaan /></ProfileCheckRoute>} />
            <Route path="/uan" element={<ProfileCheckRoute><Uan /></ProfileCheckRoute>} />
            <Route path="/apaar" element={<ProfileCheckRoute><Apaar /></ProfileCheckRoute>} />
            <Route path="/passport-photo" element={<ProfileCheckRoute><PassportPhoto /></ProfileCheckRoute>} />
            <Route path="/cards" element={<ProfileCheckRoute><Cards /></ProfileCheckRoute>} />
            <Route path="/id-card" element={<ProfileCheckRoute><IdCard /></ProfileCheckRoute>} />
            <Route path="/kundli" element={<ProfileCheckRoute><Kundali /></ProfileCheckRoute>} />
            <Route path="/editor" element={<ProfileCheckRoute><Editor /></ProfileCheckRoute>} />
            <Route path="/aadhaar" element={<ProfileCheckRoute><PdfProcessor /></ProfileCheckRoute>} />
            <Route path="/voter" element={<ProfileCheckRoute><Voter /></ProfileCheckRoute>} />
            <Route path="/resume" element={<ProfileCheckRoute><Resume /></ProfileCheckRoute>} />
            <Route path="/voter-slip" element={<ProfileCheckRoute><VoterSlip /></ProfileCheckRoute>} />
            <Route path="/impds-ration" element={<ProfileCheckRoute><IMPDSRation /></ProfileCheckRoute>} />
            <Route path="/driving-license" element={<ProfileCheckRoute><DrivingLicense /></ProfileCheckRoute>} />
            <Route path="/aepds-ration" element={<ProfileCheckRoute><AePDSRation /></ProfileCheckRoute>} />
            <Route path="/page-maker" element={<ProfileCheckRoute><PageMaker /></ProfileCheckRoute>} />
            <Route path="/add-money" element={<ProfileCheckRoute><AddMoney /></ProfileCheckRoute>} />
            <Route path="/card/:cardType/:stateCode" element={<ProfileCheckRoute><CardMaker /></ProfileCheckRoute>} />
            <Route path="/pan" element={<PanCard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
