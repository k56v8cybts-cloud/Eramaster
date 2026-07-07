import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Trash2, Moon, Sun, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/AuthContext';

const themeOptions = [
  { id: 'system', label: 'System',  icon: Monitor },
  { id: 'light',  label: 'Hell',    icon: Sun },
  { id: 'dark',   label: 'Dunkel',  icon: Moon },
];

export default function ProfileContent() {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.full_name || '');
  const [confirmReset, setConfirmReset] = useState(false);
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

  const handleNameBlur = () => {
    updateProfile({ full_name: name.trim() });
  };

  const handleResetData = () => {
    if (!confirmReset) { setConfirmReset(true); return; }
    // Alle lokal gespeicherten Spieldaten entfernen (Läufe, Erfolge, Profil, Theme)
    Object.keys(localStorage)
      .filter((k) => k.startsWith('geozeit_'))
      .forEach((k) => localStorage.removeItem(k));
    window.location.href = '/';
  };

  return (
    <div className="px-5 pt-4 pb-28 max-w-md mx-auto flex flex-col gap-6">
      {/* User info */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-border bg-card p-5 flex items-center gap-4"
      >
        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <User className="h-7 w-7 text-primary" />
        </div>
        <div className="flex-1">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Dein Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={handleNameBlur}
            placeholder="Name eingeben"
            className="w-full mt-1 bg-transparent font-semibold text-foreground outline-none placeholder:text-muted-foreground/60 placeholder:font-normal"
          />
        </div>
      </motion.div>

      {/* Theme */}
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

      {/* Data actions */}
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
            Löscht alle Läufe, Erfolge und den Namen. Nochmal tippen zum Bestätigen.
          </p>
        )}
      </motion.div>
    </div>
  );
}
