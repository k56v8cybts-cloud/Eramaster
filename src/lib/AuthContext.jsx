import React, { createContext, useState, useContext, useEffect } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { pullAndMerge, startSync, stopSync, clearCloud } from '@/lib/cloudSync';

// Anmeldung mit Google (Firebase). Ohne Login funktioniert die App weiterhin,
// der Fortschritt bleibt dann nur lokal auf dem Gerät.

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const u = {
          uid: fbUser.uid,
          full_name: fbUser.displayName || '',
          email: fbUser.email || '',
          photoURL: fbUser.photoURL || '',
        };
        setUser(u);
        try {
          localStorage.setItem(
            'geozeit_profile',
            JSON.stringify({ full_name: u.full_name, email: u.email })
          );
        } catch {
          // ignore
        }
        setSyncing(true);
        try {
          await pullAndMerge(fbUser.uid);
        } catch (e) {
          console.error('Synchronisation fehlgeschlagen:', e);
        }
        startSync(fbUser.uid);
        setSyncing(false);
      } else {
        stopSync();
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const signInWithGoogle = async () => {
    await signInWithPopup(auth, googleProvider);
  };

  const logout = async () => {
    await signOut(auth);
  };

  const resetCloudProgress = async () => {
    if (user) await clearCloud(user.uid);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        syncing,
        signInWithGoogle,
        logout,
        resetCloudProgress,
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
