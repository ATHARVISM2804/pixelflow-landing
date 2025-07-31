import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/passport-photo" element={<PassportPhoto />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/cards" element={<Cards />} />
          <Route path="/id-card" element={<IdCard />} />
          <Route path="/kundli" element={<Kundali />} />
          <Route path="/editor" element={<Editor />} />
          <Route path="/resume" element={<Resume />} />
          <Route path="/voter-slip" element={<VoterSlip />} />
          <Route path="/impds-ration" element={<IMPDSRation />} />
          <Route path="/driving-license" element={<DrivingLicense />} />
          <Route path="/aepds-ration" element={<AePDSRation />} />
          <Route path="/page-maker" element={<PageMaker />} />
          <Route path="/add-money" element={<AddMoney />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
