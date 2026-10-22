import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Circle, Layers, Grid3x3, GraduationCap, ChevronRight, Lock, Check } from 'lucide-react';
import { EPOCH_ORDER, EPOCH_LABELS, isEpochUnlocked, hasBadge } from '@/lib/badges';

const EPOCH_MODES = [
  { id: 'eons', title: 'Äonen', description: 'Ordne die vier geologischen Äonen richtig zu.', icon: Circle, color: '#0EA5B7' },
  { id: 'eras', title: 'Ären', description: 'Ordne die geologischen Ären richtig zu.', icon: Layers, color: '#2A9D8F' },
  { id: 'periods', title: 'Perioden', description: 'Finde alle geologischen Perioden.', icon: Grid3x3, color: '#4FA64E' },
  { id: 'expert', title: 'Experten', description: 'Alle Ebenen ohne Beschriftung – die größte Herausforderung.', icon: GraduationCap, color: '#E4572E' },
];

function LockedCard({ mode, prevLabel }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-muted/30">
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-border" />
      <div className="flex items-center gap-3.5 pl-5 pr-4 py-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center bg-muted">
          <Lock className="h-4 w-4 text-muted-foreground/60" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-muted-foreground text-sm">{mode.title}</h3>
          <p className="text-xs text-muted-foreground/70 mt-0.5 leading-relaxed">
            Erst nach dem Abzeichen „{prevLabel}-Meister" freigeschaltet
          </p>
        </div>
      </div>
    </div>
  );
}

function UnlockedCard({ mode, earned }) {
  return (
    <Link to={`/mode/${mode.id}`}>
      <div className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card hover:border-border transition-all duration-200 active:scale-[0.98]">
        <div className="absolute left-0 top-0 bottom-0 w-1 group-hover:w-1.5 transition-all duration-200" style={{ backgroundColor: mode.color }} />
        <div className="flex items-center gap-3.5 pl-5 pr-4 py-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: mode.color + '18' }}>
            <mode.icon className="h-5 w-5" style={{ color: mode.color }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="font-semibold text-foreground text-sm">{mode.title}</h3>
              {earned && (
                <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                  style={{ backgroundColor: mode.color + '20', color: mode.color }}>
                  <Check className="h-2.5 w-2.5" /> Abzeichen
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed line-clamp-1">{mode.description}</p>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors flex-shrink-0" />
        </div>
      </div>
    </Link>
  );
}

export default function EpochGroup() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background overflow-auto">
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent" />
        <div className="relative px-4 pt-12 pb-7 max-w-md mx-auto">
          <button
            onClick={() => navigate('/')}
            className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Zurück
          </button>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold mb-3 uppercase tracking-wider bg-primary/10 text-primary">
            Epochen-Quiz
          </div>
          <h1 className="text-3xl font-display font-bold text-foreground mb-2 tracking-tight">
            Die geologische Zeitskala
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
            Arbeite dich Schritt für Schritt vor: Schließe jeden Modus fehlerfrei ab, um das
            Abzeichen zu erhalten und die nächste Stufe freizuschalten.
          </p>
        </div>
      </div>

      {/* Modi (Lernpfad) */}
      <div className="px-4 pt-5 pb-12 max-w-md mx-auto">
        <div className="flex flex-col gap-2.5">
          {EPOCH_MODES.map((mode, i) => {
            const unlocked = isEpochUnlocked(mode.id);
            const earned = hasBadge(mode.id);
            const idx = EPOCH_ORDER.indexOf(mode.id);
            const prevLabel = idx > 0 ? EPOCH_LABELS[EPOCH_ORDER[idx - 1]] : '';
            return (
              <motion.div
                key={mode.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 + i * 0.06 }}
              >
                {unlocked
                  ? <UnlockedCard mode={mode} earned={earned} />
                  : <LockedCard mode={mode} prevLabel={prevLabel} />}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
