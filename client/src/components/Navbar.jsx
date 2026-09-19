// components/Navbar.jsx
import React, { useState } from 'react';
import { useAuth, DEMO_USERS } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useVoice } from '../context/VoiceContext';
import { Bell, Volume2, VolumeX, Globe, UserCheck, Shield, ChevronDown, Menu, X } from 'lucide-react';
import NotificationModal from './NotificationModal';

export default function Navbar({ activeTab, setActiveTab }) {
  const { currentUser, switchUser, loginAsRole, isFarmer, isSurveyor } = useAuth();
  const { lang, toggleLanguage, t } = useLanguage();
  const { speak, stop, isSpeaking } = useVoice();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleVoiceHelp = () => {
    if (isSpeaking) {
      stop();
    } else {
      if (lang === 'te') {
        speak("భూమిసేవకు స్వాగతం. ఇక్కడ మీరు మీ సర్వే హద్దులు, వర్షం, నేల తేమ వివరాలు చూడవచ్చు. సర్వే సమస్యలను నివేదించవచ్చు.");
      } else {
        speak("Welcome to BhoomiSeva Smart Land Assistant. View your verified cadastral boundaries, weather forecasts, soil moisture, or report survey disputes.");
      }
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            
            {/* Brand Logo & Name */}
            <div
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-3 cursor-pointer group select-none"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition transform">
                <span className="text-xl sm:text-2xl">🌾</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 group-hover:text-emerald-700 transition">
                    {t('brand_name')}
                  </span>
                  <span className="text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    {isFarmer ? 'రైతు సేవ (Farmer)' : 'సర్వేయర్ పోర్టల్ (Surveyor)'}
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-500 hidden sm:block font-medium">
                  {t('brand_subtitle')}
                </p>
              </div>
            </div>

            {/* Middle Nav Links (Desktop) */}
            <nav className="hidden lg:flex items-center gap-1 text-sm font-semibold">
              {isFarmer ? (
                <>
                  <button
                    onClick={() => setActiveTab('dashboard')}
                    className={`px-3 py-2 rounded-xl transition ${activeTab === 'dashboard' ? 'bg-emerald-50 text-emerald-800 font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
                  >
                    🏡 {t('my_land')}
                  </button>
                  <button
                    onClick={() => setActiveTab('map')}
                    className={`px-3 py-2 rounded-xl transition ${activeTab === 'map' ? 'bg-emerald-50 text-emerald-800 font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
                  >
                    🗺️ {t('land_survey')}
                  </button>
                  <button
                    onClick={() => setActiveTab('weather')}
                    className={`px-3 py-2 rounded-xl transition ${activeTab === 'weather' ? 'bg-emerald-50 text-emerald-800 font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
                  >
                    🌦️ {t('weather')}
                  </button>
                  <button
                    onClick={() => setActiveTab('soil_water')}
                    className={`px-3 py-2 rounded-xl transition ${activeTab === 'soil_water' ? 'bg-emerald-50 text-emerald-800 font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
                  >
                    🌱 {t('soil_info')} & 💧
                  </button>
                  <button
                    onClick={() => setActiveTab('report')}
                    className={`px-3 py-2 rounded-xl transition ${activeTab === 'report' ? 'bg-rose-50 text-rose-800 font-bold' : 'text-slate-600 hover:text-rose-700 hover:bg-rose-50/50'}`}
                  >
                    ⚠️ {t('report_problem')}
                  </button>
                  <button
                    onClick={() => setActiveTab('complaints')}
                    className={`px-3 py-2 rounded-xl transition ${activeTab === 'complaints' ? 'bg-emerald-50 text-emerald-800 font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
                  >
                    📋 {t('my_complaints')}
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setActiveTab('surveyor_dashboard')}
                    className={`px-3 py-2 rounded-xl transition ${activeTab === 'surveyor_dashboard' ? 'bg-indigo-50 text-indigo-900 font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
                  >
                    📊 Surveyor Dashboard
                  </button>
                  <button
                    onClick={() => setActiveTab('surveyor_map')}
                    className={`px-3 py-2 rounded-xl transition ${activeTab === 'surveyor_map' ? 'bg-indigo-50 text-indigo-900 font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
                  >
                    📐 Cadastral Editor
                  </button>
                  <button
                    onClick={() => setActiveTab('audit')}
                    className={`px-3 py-2 rounded-xl transition ${activeTab === 'audit' ? 'bg-indigo-50 text-indigo-900 font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
                  >
                    📜 Audit History
                  </button>
                </>
              )}
            </nav>

            {/* Right Action Icons */}
            <div className="flex items-center gap-2 sm:gap-3">
              
              {/* Language Switcher (EN <-> తెలుగు) */}
              <button
                onClick={toggleLanguage}
                title="భాష మార్చండి / Toggle Language"
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-700 transition"
              >
                <Globe className="w-3.5 h-3.5 text-emerald-600" />
                <span>{lang === 'en' ? 'తెలుగు' : 'English'}</span>
              </button>

              {/* Voice Guide Button */}
              <button
                onClick={handleVoiceHelp}
                title="Voice Guide / సహాయక స్వరం"
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition ${
                  isSpeaking
                    ? 'bg-rose-50 border-rose-300 text-rose-700 animate-pulse'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100'
                }`}
              >
                {isSpeaking ? <VolumeX className="w-4 h-4 text-rose-600" /> : <Volume2 className="w-4 h-4 text-emerald-600" />}
                <span className="hidden sm:inline">{isSpeaking ? t('stop_audio') : t('listen_audio')}</span>
              </button>

              {/* Notifications Bell */}
              <button
                onClick={() => setShowNotifications(true)}
                className="relative p-2 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-rose-500 border-2 border-white"></span>
              </button>

              {/* User Switcher Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition"
                >
                  <span className="text-xl">{currentUser?.avatar || '👤'}</span>
                  <div className="text-left hidden md:block">
                    <p className="text-xs font-bold text-slate-900 leading-none truncate max-w-[110px]">
                      {currentUser?.name?.split(' ')[0]}
                    </p>
                    <p className="text-[10px] text-slate-500 capitalize leading-none mt-0.5">
                      {currentUser?.role}
                    </p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-3 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900">{t('switch_role')}</p>
                      <p className="text-[11px] text-slate-500">Test Farmer or Cadastral Surveyor</p>
                    </div>

                    <div className="py-1">
                      {DEMO_USERS.map((user) => (
                        <button
                          key={user.user_id}
                          onClick={() => {
                            switchUser(user.user_id);
                            setShowUserMenu(false);
                            if (user.role === 'surveyor') {
                              setActiveTab('surveyor_dashboard');
                            } else {
                              setActiveTab('dashboard');
                            }
                          }}
                          className={`w-full text-left px-3 py-2 flex items-center gap-2.5 hover:bg-slate-50 transition text-xs ${
                            currentUser?.user_id === user.user_id ? 'bg-emerald-50 text-emerald-900 font-bold' : 'text-slate-700'
                          }`}
                        >
                          <span className="text-lg">{user.avatar}</span>
                          <div className="min-w-0 flex-1">
                            <div className="truncate font-semibold">{user.name}</div>
                            <div className="text-[10px] text-slate-400 capitalize">{user.role} • {user.user_id}</div>
                          </div>
                          {currentUser?.user_id === user.user_id && (
                            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden px-4 pt-2 pb-4 border-t border-slate-100 bg-white shadow-lg space-y-1 text-sm font-medium">
            {isFarmer ? (
              <>
                <button
                  onClick={() => { setActiveTab('dashboard'); setMobileMenuOpen(false); }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-emerald-50 text-slate-700"
                >
                  🏡 {t('my_land')}
                </button>
                <button
                  onClick={() => { setActiveTab('map'); setMobileMenuOpen(false); }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-emerald-50 text-slate-700"
                >
                  🗺️ {t('land_survey')}
                </button>
                <button
                  onClick={() => { setActiveTab('weather'); setMobileMenuOpen(false); }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-emerald-50 text-slate-700"
                >
                  🌦️ {t('weather')}
                </button>
                <button
                  onClick={() => { setActiveTab('soil_water'); setMobileMenuOpen(false); }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-emerald-50 text-slate-700"
                >
                  🌱 {t('soil_info')} & 💧 {t('water_info')}
                </button>
                <button
                  onClick={() => { setActiveTab('report'); setMobileMenuOpen(false); }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-rose-50 text-rose-700"
                >
                  ⚠️ {t('report_problem')}
                </button>
                <button
                  onClick={() => { setActiveTab('complaints'); setMobileMenuOpen(false); }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-emerald-50 text-slate-700"
                >
                  📋 {t('my_complaints')}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => { setActiveTab('surveyor_dashboard'); setMobileMenuOpen(false); }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-indigo-50 text-indigo-900"
                >
                  📊 Surveyor Dashboard
                </button>
                <button
                  onClick={() => { setActiveTab('surveyor_map'); setMobileMenuOpen(false); }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-indigo-50 text-indigo-900"
                >
                  📐 Cadastral Editor
                </button>
                <button
                  onClick={() => { setActiveTab('audit'); setMobileMenuOpen(false); }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-indigo-50 text-indigo-900"
                >
                  📜 Audit History
                </button>
              </>
            )}
          </div>
        )}
      </header>

      {/* Notifications Drawer Modal */}
      <NotificationModal
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </>
  );
}
