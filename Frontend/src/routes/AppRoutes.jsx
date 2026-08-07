import { Routes, Route, Outlet } from "react-router-dom";

import LandingPage from "../pages/LandingPage";
import Login from "../pages/Login";
import Register from "../pages/Register";
import OTPVerification from "../pages/OTPVerification";
import ForgotPassword from "../pages/ForgotPassword";
import Profile from "../pages/Profile";
import Settings from "../pages/Settings";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ProtectedRoute from "../components/ProtectedRoute";
import Dashboard from "../pages/Dashboard";
import SeatExchange from "../components/SeatExchange";
import PNRVerification from "../components/PNRVerification";
import FamilyLinking from "../components/FamilyLinking";
import QRVerification from "../components/QRVerification";

import AIRecommendation from "../components/AiRecommendation";
import JourneyCompanion from "../components/JourneyCompanion";
import AIChatbot from "../components/AIChatbot";
import CoachHeatmap from "../components/CoachHeatmap";

import LiveCoachMap from "../components/LiveCoachMap";
import TrainInformation from "../components/TrainInformation";
import StationNavigator from "../components/StationNavigator";
import RewardSystem from "../components/RewardSystem";

import LostItemAI from "../components/LostItemAI";
import CrowdDensity from "../components/CrowdDensity";
import WomenSafety from "../components/WomenSafety";
import EmergencyMedical from "../components/EmergencyMedical";

/*
=================================================
Future Modules (Other Developers)

AI Recommendation
Journey Companion
AI Chatbot
Lost Item AI
Crowd Density
Women Safety
Emergency Medical
Seat Exchange
PNR Verification
Coach Heatmap
Station Navigator

These modules will be injected inside
the Outlet area below.
=================================================
*/

const DashboardLayout = () => {
  return (
    <>
      <Navbar />

      <div className="app-layout">
        <Sidebar />

        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </>
  );
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}

      <Route path="/" element={<LandingPage />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route path="/otp" element={<OTPVerification />} />

      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Protected Routes */}

      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/Dashboard" element={<Dashboard />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/seat-exchange" element={<SeatExchange />} />
        <Route path="/pnr-verification" element={<PNRVerification />} />
        <Route path="/family-linking" element={<FamilyLinking />} />
        <Route path="/qr-verification" element={<QRVerification />} />

        <Route path="/ai-recommendation" element={<AIRecommendation />} />
        <Route path="/journey-companion" element={<JourneyCompanion />} />
        <Route path="/chatbot" element={<AIChatbot />} />
        <Route path="/coach-heatmap" element={<CoachHeatmap />} />

        <Route path="/live-coach-map" element={<LiveCoachMap />} />
        <Route path="/train-information" element={<TrainInformation />} />
        <Route path="/station-navigator" element={<StationNavigator />} />
        <Route path="/reward-system" element={<RewardSystem />} />

        <Route path="/lost-item-ai" element={<LostItemAI />} />
        <Route path="/crowd-density" element={<CrowdDensity />} />
        <Route path="/women-safety" element={<WomenSafety />} />
        <Route path="/emergency-medical" element={<EmergencyMedical />} />

        <Route path="/profile" element={<Profile />} />

        <Route path="/settings" element={<Settings />} />

        {/*
        =========================================
        Future Routes By Other Developers

        <Route path="/ai-recommendation" />
        <Route path="/journey-companion" />
        <Route path="/ai-chatbot" />
        <Route path="/lost-item-ai" />
        <Route path="/crowd-density" />
        <Route path="/women-safety" />
        <Route path="/emergency-medical" />
        =========================================
        */}
      </Route>
    </Routes>
  );
};

export default AppRoutes;
