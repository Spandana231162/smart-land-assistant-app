// App.jsx
import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { VoiceProvider } from './context/VoiceContext';
import Navbar from './components/Navbar';
import HomeLanding from './pages/HomeLanding';

// Farmer Pages
import FarmerDashboard from './pages/farmer/FarmerDashboard';
import MyLandView from './pages/farmer/MyLandView';
import LandSurveyMapPage from './pages/farmer/LandSurveyMapPage';
import WeatherGuidance from './pages/farmer/WeatherGuidance';
import SoilAndWaterView from './pages/farmer/SoilAndWaterView';
import ReportProblemForm from './pages/farmer/ReportProblemForm';
import RequestResurveyForm from './pages/farmer/RequestResurveyForm';
import DisputedAreaView from './pages/farmer/DisputedAreaView';
import NeighboringLands from './pages/farmer/NeighboringLands';
import ComplaintsTracker from './pages/farmer/ComplaintsTracker';
import FarmerSafety from './pages/farmer/FarmerSafety';
import FarmerProfile from './pages/farmer/FarmerProfile';

// Surveyor Pages
import SurveyorDashboard from './pages/surveyor/SurveyorDashboard';
import CadastralEditorMap from './pages/surveyor/CadastralEditorMap';
import AuditHistoryView from './pages/surveyor/AuditHistoryView';

function MainApp() {
  const { currentUser, isFarmer, isSurveyor } = useAuth();
  const [activeTab, setActiveTab] = useState('landing'); // default starts at home landing or dashboard

  // Render view based on active tab and role
  const renderContent = () => {
    // If landing page selected
    if (activeTab === 'landing') {
      return (
        <HomeLanding
          onSelectFlow={(destinationTab) => setActiveTab(destinationTab)}
        />
      );
    }

    // Surveyor Routes
    if (isSurveyor) {
      switch (activeTab) {
        case 'surveyor_map':
          return <CadastralEditorMap />;
        case 'audit':
          return <AuditHistoryView />;
        case 'surveyor_dashboard':
        default:
          return <SurveyorDashboard setActiveTab={setActiveTab} />;
      }
    }

    // Farmer Routes
    switch (activeTab) {
      case 'my_land':
        return <MyLandView setActiveTab={setActiveTab} />;
      case 'map':
        return <LandSurveyMapPage setActiveTab={setActiveTab} />;
      case 'weather':
        return <WeatherGuidance setActiveTab={setActiveTab} />;
      case 'soil_water':
        return <SoilAndWaterView setActiveTab={setActiveTab} />;
      case 'report':
        return <ReportProblemForm setActiveTab={setActiveTab} />;
      case 'resurvey':
        return <RequestResurveyForm setActiveTab={setActiveTab} />;
      case 'dispute':
        return <DisputedAreaView setActiveTab={setActiveTab} />;
      case 'neighbors':
        return <NeighboringLands setActiveTab={setActiveTab} />;
      case 'complaints':
        return <ComplaintsTracker setActiveTab={setActiveTab} />;
      case 'safety':
        return <FarmerSafety setActiveTab={setActiveTab} />;
      case 'profile':
        return <FarmerProfile setActiveTab={setActiveTab} />;
      case 'dashboard':
      default:
        return <FarmerDashboard setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4 min-h-screen bg-slate-50 flex flex-col justify-between text-slate-800">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 pb-12">
        {renderContent()}
      </main>

      {/* Global Prototype & Compliance Disclaimer Ribbon (Section 24) */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-4 px-4 text-center text-xs">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-emerald-400 font-bold">🌾 BhoomiSeva (భూమిసేవ)</span>
            <span>• Smart Land & Farmer Assistance Platform</span>
          </div>
          <p className="text-[11px] text-slate-500">
            [Official Record / Sensor Data / Agromet API Sync / DGPS Cadastre] • Section 24 Prototype Compliant
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <VoiceProvider>
        <AuthProvider>
          <MainApp />
        </AuthProvider>
      </VoiceProvider>
    </LanguageProvider>
  );
}
