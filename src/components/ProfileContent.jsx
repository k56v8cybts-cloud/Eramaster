import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Trash2, LogOut, Moon, Sun, Monitor, Cloud, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/AuthContext';

const themeOptions = [
  { id: 'system', label: 'System',  icon: Monitor },
  { id: 'light',  label: 'Hell',    icon: Sun },
  { id: 'dark',   label: 'Dunkel',  icon: Moon },
];

// Google-Logo (mehrfarbiges "G")
function GoogleIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
      <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
      <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
      <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571.001-.001.002-.001.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
    </svg>
  );
}

export default function ProfileContent() {
  const { user, isAuthenticated, syncing, signInWithGoogle, logout, resetCloudProgress } = useAuth();
  const [confirmReset, setConfirmReset] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const [error, setError] = useState('');
  const [theme, setTheme] = useState(() => localStorage.getItem('geozeit_theme') || 'system');

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
    } else {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
    localStorage.setItem('geozeit_theme', theme);
  }, [theme]);

  const handleSignIn = async () => {
    setError('');
    setSigningIn(true);
    try {
      await signInWithGoogle();
    } catch (e) {
      if (e?.code !== 'auth/popup-closed-by-user' && e?.code !== 'auth/cancelled-popup-request') {
        setError('Anmeldung fehlgeschlagen. Bitte erneut versuchen.');
      }
    } finally {
      setSigningIn(false);
    }
  };

  const handleResetData = async () => {
    if (!confirmReset) { setConfirmReset(true); return; }
    try {
      await resetCloudProgress();
    } catch {
      // ignore
    }
    Object.keys(localStorage)
      .filter((k) => k.startsWith('geozeit_'))
      .forEach((k) => localStorage.removeItem(k));
    window.location.href = '/';
  };

  return (
    <div className="px-5 pt-4 pb-28 max-w-md mx-auto flex flex-col gap-6">
      {/* Konto */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-border bg-card p-5 flex flex-col gap-4"
      >
        {isAuthenticated ? (
          <>
            <div className="flex items-center gap-4">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="" className="w-14 h-14 rounded-full shrink-0 object-cover" referrerPolicy="no-referrer" />
              ) : (
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <User className="h-7 w-7 text-primary" />
                </div>
              )}
              <div className="min-w-0">
                <p className="font-semibold text-foreground truncate">{user?.full_name || 'Angemeldet'}</p>
                <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {syncing ? (
                <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Fortschritt wird synchronisiert…</>
              ) : (
                <><Cloud className="h-3.5 w-3.5" /> Dein Fortschritt wird in deinem Konto gespeichert.</>
              )}
            </div>
            <Button variant="outline" className="w-full gap-2 select-none" onClick={logout}>
              <LogOut className="h-4 w-4" />
              Abmelden
            </Button>
          </>
        ) : (
          <>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <User className="h-7 w-7 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Nicht angemeldet</p>
                <p className="text-sm text-muted-foreground">Fortschritt nur auf diesem Gerät</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Melde dich mit Google an, um deinen Fortschritt zu sichern und auf allen Geräten zu nutzen.
            </p>
            <Button
              variant="outline"
              className="w-full gap-3 select-none h-11"
              onClick={handleSignIn}
              disabled={signingIn}
            >
              {signingIn ? <Loader2 className="h-5 w-5 animate-spin" /> : <GoogleIcon className="h-5 w-5" />}
              Mit Google anmelden
            </Button>
            {error && <p className="text-xs text-destructive text-center">{error}</p>}
          </>
        )}
      </motion.div>

      {/* Erscheinungsbild */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="rounded-2xl border border-border bg-card p-5"
      >
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Erscheinungsbild</p>
        <div className="grid grid-cols-3 gap-2">
          {themeOptions.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTheme(id)}
              className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border-2 transition-colors select-none ${
                theme === id ? 'border-primary bg-primary/5 text-primary' : 'border-border text-muted-foreground hover:bg-muted'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{label}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Daten */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl border border-border bg-card p-5 flex flex-col gap-3"
      >
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Daten</p>
        <Button
          variant={confirmReset ? 'destructive' : 'outline'}
          className="w-full gap-2 select-none"
          onClick={handleResetData}
        >
          <Trash2 className="h-4 w-4" />
          {confirmReset ? 'Wirklich zurücksetzen?' : 'Alle Daten zurücksetzen'}
        </Button>
        {confirmReset && (
          <p className="text-xs text-muted-foreground text-center">
            Löscht alle Läufe und Erfolge{isAuthenticated ? ' – auch in deinem Konto' : ''}. Nochmal tippen zum Bestätigen.
          </p>
        )}
      </motion.div>
    </div>
  );
}
