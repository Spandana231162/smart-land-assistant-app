// context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const DEMO_USERS = [
  {
    user_id: "FAR-101",
    name: "Ramesh Kumar (రమేష్ కుమార్)",
    role: "farmer",
    phone: "+91 98480 12345",
    location: "Kondapur, Ghatkesar, Ranga Reddy",
    passbook_number: "TG-RR-142-9982",
    land_ids: ["LAND-TG-501", "LAND-TG-502"],
    avatar: "👨‍🌾"
  },
  {
    user_id: "FAR-102",
    name: "Lakshmi Devi (లక్ష్మీ దేవి)",
    role: "farmer",
    phone: "+91 94401 67890",
    location: "Shabad Mandal, Ranga Reddy",
    passbook_number: "TG-RR-143-4412",
    land_ids: ["LAND-TG-503"],
    avatar: "👩‍🌾"
  },
  {
    user_id: "SUR-502",
    name: "Srikanth Rao (శ్రీకాంత్ రావు)",
    role: "surveyor",
    phone: "+91 91234 56789",
    designation: "Senior Cadastral Land Surveyor",
    department: "Survey, Settlement & Land Records Dept",
    jurisdiction: "Ranga Reddy West Sub-Division",
    avatar: "👨‍💼"
  }
];

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('bhoomi_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return DEMO_USERS[0]; // default to Farmer Ramesh Kumar
  });

  const [activeLandId, setActiveLandId] = useState("LAND-TG-501");

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('bhoomi_user', JSON.stringify(currentUser));
      if (currentUser.role === 'farmer' && currentUser.land_ids?.length) {
        if (!currentUser.land_ids.includes(activeLandId)) {
          setActiveLandId(currentUser.land_ids[0]);
        }
      }
    }
  }, [currentUser]);

  const switchUser = (userId) => {
    const found = DEMO_USERS.find(u => u.user_id === userId);
    if (found) {
      setCurrentUser(found);
      if (found.role === 'farmer' && found.land_ids?.length) {
        setActiveLandId(found.land_ids[0]);
      }
    }
  };

  const loginAsRole = (role) => {
    const user = DEMO_USERS.find(u => u.role === role) || DEMO_USERS[0];
    setCurrentUser(user);
    if (user.role === 'farmer' && user.land_ids?.length) {
      setActiveLandId(user.land_ids[0]);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('bhoomi_user');
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      switchUser,
      loginAsRole,
      logout,
      activeLandId,
      setActiveLandId,
      isFarmer: currentUser?.role === 'farmer',
      isSurveyor: currentUser?.role === 'surveyor'
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
