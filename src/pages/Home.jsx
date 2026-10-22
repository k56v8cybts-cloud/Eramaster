import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Hourglass, Skull, Footprints, Dna, HelpCircle, Trophy, Settings, Gamepad2, ChevronRight } from 'lucide-react';
import ProfileContent from '@/components/ProfileContent';
import ErfolgeContent from '@/components/ErfolgeContent';

const TABS = [
  { id: 'spielen', label: 'Spielen', icon: Gamepad2 },
  { id: 'trophäen', label: 'Erfolge', icon: Trophy },
  { id: 'einstellungen', label: 'Einstellungen', icon: Settings },
];

const modes = [
  { id: 'olderthan', to: '/mode/olderthan', title: 'Was ist älter?', description: 'Vergleiche zwei Elemente – welches liegt zeitlich früher?', icon: HelpCircle, color: '#E4902E' },
  { id: 'milestones', to: '/mode/milestones', title: 'Evolutionäre Meilensteine', description: 'Platziere Schlüsselereignisse der Evolution auf dem Zeitstrahl.', icon: Dna, color: '#7C5CD6' },
  { id: 'creatures', to: '/mode/creatures', title: 'Prähistorische Lebewesen', description: 'Ordne ikonische Urzeitwesen ihrer Periode zu.', icon: Footprints, color: '#2A9D8F' },
  { id: 'bigfive', to: '/mode/bigfive', title: 'The Big Five', description: 'Finde die fünf großen Massenaussterben im Zeitstrahl.', icon: Skull, color: '#C1443B' },
  { id: 'epochenquiz', to: '/epochenquiz', title: 'EpochenQuiz', description: 'Äonen, Ären, Perioden & Expertenmodus der Zeitskala.', icon: Hourglass, color: '#0E8CA8' },
];

function SpieleTab() {
  return (
    <div className="px-4 max-w-md mx-auto pb-28 pt-3">
      <div className="flex flex-col gap-2.5">
        {modes.map((mode, i) => (
          <motion.div
            key={mode.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
          >
            <Link to={mode.to}>
              <div className="group relative overflow-hidden rounded-2xl border border-border/70 bg-card hover:border-border transition-all duration-200 active:scale-[0.98]">
                <div className="absolute left-0 top-0 bottom-0 w-1 group-hover:w-1.5 transition-all duration-200" style={{ backgroundColor: mode.color }} />
                <div className="flex items-center gap-3.5 pl-5 pr-4 py-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: mode.color + '18' }}>
                    <mode.icon className="h-5 w-5" style={{ color: mode.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground text-sm">{mode.title}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed line-clamp-1">{mode.description}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors flex-shrink-0" />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const [activeTab, setActiveTab] = useState('spielen');

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-hidden">
      {/* Hero header */}
      <div className="relative overflow-hidden shrink-0 border-b border-border/60">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/8 to-transparent" />
        {/* feine Zeitstrahl-Grundlinie als wissenschaftliches Motiv */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-border" />
        <div className="relative px-5 pt-14 pb-7 text-center max-w-md mx-auto">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-3">
              4,6 Mrd. Jahre Erdgeschichte
            </p>
            <h1 className="text-5xl font-display font-bold text-foreground tracking-tight leading-none">
              Era<span className="text-primary">master</span>
            </h1>
            <p className="text-muted-foreground mt-3 text-sm leading-relaxed max-w-xs mx-auto">
              Verstehe die geologische Zeit – Schritt für Schritt, spielerisch.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 max-w-md mx-auto w-full mb-2 mt-3 shrink-0">
        <div className="flex gap-1.5 bg-muted/70 rounded-2xl p-1">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all select-none ${
                activeTab === id
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}>

            {activeTab === 'spielen' && <SpieleTab />}
            {activeTab === 'trophäen' && <ErfolgeContent />}
            {activeTab === 'einstellungen' && <ProfileContent />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>);

}
