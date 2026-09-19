// context/LanguageContext.jsx
import React, { createContext, useContext, useState } from 'react';

const translations = {
  en: {
    brand_name: "BhoomiSeva",
    brand_subtitle: "Smart Land & Farmer Assistance System",
    hero_title: "Smart Land & Farmer Assistance System",
    hero_subtitle: "Verified Land Information, Easy Survey Services & Smart Farming Guidance",
    farmer_login: "Farmer Login",
    surveyor_login: "Surveyor Login",
    about: "About System",
    help_guide: "Help & Voice Guide",
    switch_role: "Switch Role",
    logged_in_as: "Logged in as",
    data_verified_notice: "Verified Official Survey Data",
    data_demo_notice: "Sample Prototype Data (Testing Mode)",
    
    // Core Pillars
    pillar1_title: "Verified Land Survey",
    pillar1_desc: "Access official cadastral boundaries, GPS corner stones, and verified acreage without bureaucratic delays.",
    pillar2_title: "Weather & Soil Guidance",
    pillar2_desc: "Real-time irrigation planning, soil moisture % tracking, and proactive extreme weather alerts.",
    pillar3_title: "Easy Complaints & Re-Survey",
    pillar3_desc: "Report boundary disputes, pinpoint encroachment on map, and track 8-stage resurvey progress directly.",

    // Dashboard Modules
    my_land: "My Land",
    land_survey: "Land Survey Map",
    weather: "Weather & Rain",
    soil_info: "Soil Information",
    water_info: "Water & Groundwater",
    report_problem: "Report Survey Problem",
    neighbor_lands: "Neighboring Lands",
    request_resurvey: "Request Re-Survey",
    upload_evidence: "Upload Evidence",
    my_complaints: "My Complaints & Requests",
    notifications: "Notifications",
    my_profile: "My Profile",
    farmer_safety: "Farmer Safety Precautions",

    // Common labels
    survey_no: "Survey Number",
    area_name: "Area Name",
    total_area: "Total Area",
    acres: "Acres",
    owner_name: "Present Owner",
    previous_owner: "Previous Owner",
    last_survey: "Last Survey Date",
    status: "Status",
    verified: "Verified",
    disputed: "Disputed Area",
    pending: "Verification Pending",
    reported_incorrect: "Reported Incorrect",
    listen_audio: "Listen (Voice)",
    stop_audio: "Stop Voice",
    submit: "Submit",
    cancel: "Cancel",
    close: "Close",
    loading: "Loading...",
    view_details: "View Details",
    track_status: "Track Status"
  },
  te: {
    brand_name: "భూమిసేవ",
    brand_subtitle: "స్మార్ట్ భూమి & రైతు సహాయక వ్యవస్థ",
    hero_title: "స్మార్ట్ ల్యాండ్ & రైతు సహాయక వ్యవస్థ",
    hero_subtitle: "ధృవీకరించబడిన భూమి సమాచారం, సులభమైన సర్వే సేవలు మరియు స్మార్ట్ వ్యవసాయ మార్గదర్శకత్వం",
    farmer_login: "రైతు లాగిన్",
    surveyor_login: "సర్వేయర్ లాగిన్",
    about: "వ్యవస్థ గురించి",
    help_guide: "సహాయం & వాయిస్ గైడ్",
    switch_role: "వినియోగదారు మార్చండి",
    logged_in_as: "ప్రస్తుత వినియోగదారు",
    data_verified_notice: "ధృవీకరించబడిన అధికారిక సర్వే డేటా",
    data_demo_notice: "నమూనా ప్రదర్శన డేటా (పరీక్ష విధానం)",

    // Core Pillars
    pillar1_title: "ధృవీకరించబడిన భూమి సర్వే",
    pillar1_desc: "అధికారిక హద్దులు, జీపీఎస్ కొలతలు మరియు విస్తీర్ణం వివరాలను సులభంగా వీక్షించండి.",
    pillar2_title: "వాతావరణం & నేల సలహాలు",
    pillar2_desc: "తేమ శాతం, నీటిపారుదల సమయం మరియు తీవ్రమైన వర్ష సూచనల తక్షణ హెచ్చరికలు.",
    pillar3_title: "సర్వే ఫిర్యాదులు & పునఃసర్వే",
    pillar3_desc: "హద్దుల సమస్యలను మ్యాప్‌లో గుర్తించి నివేదించండి మరియు పునఃసర్వే పురోగతిని ట్రాక్ చేయండి.",

    // Dashboard Modules
    my_land: "🏡 నా భూమి",
    land_survey: "🗺️ భూమి సర్వే మ్యాప్",
    weather: "🌦️ వాతావరణం",
    soil_info: "🌱 నేల సమాచారం",
    water_info: "💧 నీటి లభ్యత",
    report_problem: "⚠️ సర్వే సమస్య ఫిర్యాదు",
    neighbor_lands: "📍 పొరుగు భూములు",
    request_resurvey: "📄 పునఃసర్వే దరఖాస్తు",
    upload_evidence: "📤 ఆధారాలు / ఫోటోలు",
    my_complaints: "📋 నా ఫిర్యాదులు & స్థితి",
    notifications: "🔔 నోటిఫికేషన్లు",
    my_profile: "👤 నా ప్రొఫైల్",
    farmer_safety: "🛡️ రైతు భద్రతా జాగ్రత్తలు",

    // Common labels
    survey_no: "సర్వే నంబర్",
    area_name: "ప్రాంతం పేరు",
    total_area: "మొత్తం విస్తీర్ణం",
    acres: "ఎకరాలు",
    owner_name: "ప్రస్తుత యజమాని",
    previous_owner: "పూర్వ యజమాని",
    last_survey: "చివరి సర్వే తేదీ",
    status: "స్థితి",
    verified: "ధృవీకరించబడింది",
    disputed: "వివాదాస్పద ప్రాంతం",
    pending: "సర్వే పెండింగ్‌లో ఉంది",
    reported_incorrect: "తప్పుగా నివేదించబడింది",
    listen_audio: "వినండి (వాయిస్)",
    stop_audio: "ఆపండి",
    submit: "సమర్పించండి",
    cancel: "రద్దు చేయండి",
    close: "మూసివేయండి",
    loading: "లోడ్ అవుతోంది...",
    view_details: "వివరాలు చూడండి",
    track_status: "స్థితిని ట్రాక్ చేయండి"
  }
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en'); // 'en' or 'te'

  const t = (key) => {
    return translations[lang]?.[key] || translations['en']?.[key] || key;
  };

  const toggleLanguage = () => {
    setLang(prev => (prev === 'en' ? 'te' : 'en'));
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
