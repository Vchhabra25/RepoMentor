
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MedicalHistory from "./pages/MedicalHistory";
import Dashboard from "./pages/Dashboard";
import SymptomTracker from "./pages/SymptomTracker";
import ConsultDoctor from "./pages/ConsultDoctor";
import Emergency from "./pages/Emergency";
import DietPlan from "./pages/DietPlan";
import UltrasoundTracker from "./pages/UltrasoundTracker";
import MedicalRecords from "./pages/MedicalRecords";
import MedicineReminder from "./pages/MedicineReminder";
import FamilyAlerts from "./pages/FamilyAlerts";
import RiskPrediction from "./pages/RiskPrediction";
import NotFound from "./pages/NotFound";
import WeeklySchedule from "./pages/WeeklySchedule";
import Settings from "./pages/Settings";
import PredictionHistory from "./pages/PredictionHistory";
import Profile from "./pages/Profile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/medical-history" element={<MedicalHistory />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/symptom-tracker" element={<SymptomTracker />} />
          <Route path="/consult-doctor" element={<ConsultDoctor />} />
          <Route path="/emergency" element={<Emergency />} />
          <Route path="/diet-plan" element={<DietPlan />} />
          <Route path="/ultrasound-tracker" element={<UltrasoundTracker />} />
          <Route path="/medical-records" element={<MedicalRecords />} />
          <Route path="/medicine-reminder" element={<MedicineReminder />} />
          <Route path="/family-alerts" element={<FamilyAlerts />} />
          <Route path="/risk-prediction" element={<RiskPrediction />} />
          <Route path="/weekly-schedule" element={<WeeklySchedule />} />
          <Route path="/prediction-history" element={<PredictionHistory />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
