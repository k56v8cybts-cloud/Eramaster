import React, { createContext, useState, useContext } from 'react';

// Lokaler Profil-/Auth-Ersatz (kein Server, kein Base44).
// Der Name wird nur im Browser gespeichert.

const AuthContext = createContext();
const PROFILE_KEY = 'geozeit_profile';

function loadProfile() {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return { full_name: '', email: '' };
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(loadProfile);

  const updateProfile = (partial) => {
    setUser((prev) => {
      const next = { ...prev, ...partial };
      localStorage.setItem(PROFILE_KEY, JSON.stringify(next));
      return next;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: true,
        isLoadingAuth: false,
        isLoadingPublicSettings: false,
        authError: null,
        authChecked: true,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
