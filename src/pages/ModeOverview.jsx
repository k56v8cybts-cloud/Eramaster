import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Dumbbell, ShieldAlert, BookOpen, Trophy, ChevronRight } from 'lucide-react';

const MODE_META = {
  olderthan: { title: 'Was ist älter?', description: 'Vergleiche zwei zeitdatierte Elemente und entscheide, welches zeitlich früher liegt. Baue eine möglichst lange Streak!', color: '#f59e0b' },
  milestones: { title: 'Evolutionäre Meilensteine', description: 'Platziere evolutionäre Schlüsselereignisse auf dem Zeitstrahl – von LUCA bis zur Säuger-Radiation.', color: '#7c3aed' },
  creatures: { title: 'Prähistorische Lebewesen', description: 'Tippe die richtige Periode an, in der das gezeigte Lebewesen gelebt hat.', color: '#15803d' },
  bigfive: { title: 'The Big Five', description: 'Identifiziere die fünf großen Massenaussterben anhand ihrer Zeitgrenzen im Zeitstrahl.', color: '#7f1d1d' },
  eons: { title: 'Äonen-Modus', description: 'Klicke den richtigen Äon auf dem Zeitstrahl an.', color: '#9AD9F5' },
  eras: { title: 'Ären-Modus', description: 'Klicke die richtige Ära auf dem Zeitstrahl an.', color: '#67C5CA' },
  periods: { title: 'Perioden-Modus', description: 'Klicke die richtige Periode auf dem Zeitstrahl an.', color: '#7FC64E' },
  expert: { title: 'Expertenmodus', description: 'Alle Kacheln ohne Beschriftung – Äone, Ären und Perioden.', color: '#F04028' },
};

const options = [
  { id: 'training', title: 'Training', description: 'Unbegrenzte Versuche – lerne in deinem eigenen Tempo.', icon: Dumbbell, accent: '#3b82f6' },
  { id: 'exam', title: 'Prüfung', description: 'Ein Fehler – Spiel vorbei. Schaffst du einen fehlerfreien Run?', icon: ShieldAlert, accent: '#ef4444' },
  { id: 'view', title: 'Zeitstrahl ansehen', description: 'Vollständig beschriftet, alle Kacheln anklickbar mit Infos.', icon: BookOpen, accent: '#8b5cf6' },
  { id: 'leaderboard', title: 'Leaderboard', description: 'Deine bisherigen Ergebnisse im Überblick.', icon: Trophy, accent: '#f59e0b' },
];

export default function ModeOverview() {
  const { modeId } = useParams();
  const navigate = useNavigate();
  const meta = MODE_META[modeId];

  if (!meta) {
    navigate('/');
    return null;
  }

  const handleOption = (optionId) => {
    if (modeId === 'olderthan') {
      if (optionId === 'training') navigate('/olderthan/play');
      else if (optionId === 'leaderboard') navigate('/leaderboard/olderthan');
      return;
    }
    if (modeId === 'milestones') {
      if (optionId === 'training' || optionId === 'exam') navigate(`/milestones/${optionId}`);
      else if (optionId === 'view') navigate('/milestones/knowledge');
      else if (optionId === 'leaderboard') navigate('/leaderboard/milestones');
    } else if (modeId === 'creatures') {
      if (optionId === 'training' || optionId === 'exam') navigate(`/creatures/${optionId}`);
      else if (optionId === 'view') navigate('/creatures/knowledge');
      else if (optionId === 'leaderboard') navigate('/leaderboard/creatures');
    } else if (modeId === 'bigfive') {
      if (optionId === 'training' || optionId === 'exam') navigate(`/bigfive/${optionId}`);
      else if (optionId === 'view') navigate('/bigfive/knowledge');
      else if (optionId === 'leaderboard') navigate('/leaderboard/bigfive');
    } else {
      if (optionId === 'training' || optionId === 'exam') navigate(`/game/${modeId}/${optionId}`);
      else if (optionId === 'view') navigate(`/knowledge/${modeId}`);
      else if (optionId === 'leaderboard') navigate(`/leaderboard/${modeId}`);
    }
  };

  const filteredOptions = options.filter(opt => {
    if (modeId === 'olderthan') return opt.id === 'training' || opt.id === 'leaderboard';
    return true;
  });

  return (
    <div className="min-h-screen bg-background overflow-auto">
      {/* Hero banner with mode color gradient */}
      <motion.div
        className="relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(160deg, ${meta.color}30 0%, ${meta.color}10 50%, transparent 100%)` }}
        />
        {/* Decorative circle */}
        <div
          className="absolute -right-12 -top-12 w-48 h-48 rounded-full opacity-10"
          style={{ backgroundColor: meta.color }}
        />
        <div className="relative px-4 pt-12 pb-8 max-w-md mx-auto">
          <button
            onClick={() => navigate('/')}
            className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Zurück
          </button>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06 }}
          >
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-3 uppercase tracking-wide"
              style={{ backgroundColor: meta.color + '25', color: meta.color }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: meta.color }} />
              Spielmodus
            </div>
            <h1 className="text-3xl font-display font-bold text-foreground mb-2">{meta.title}</h1>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">{meta.description}</p>
          </motion.div>
        </div>
      </motion.div>

      {/* Options list */}
      <div className="px-4 pb-12 max-w-md mx-auto">
        <div className="flex flex-col gap-2.5">
          {filteredOptions.map((opt, i) => (
            <motion.button
              key={opt.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.07 }}
              onClick={() => handleOption(opt.id)}
              className="w-full text-left rounded-2xl border border-border/60 bg-card p-4 transition-all hover:shadow-lg hover:shadow-black/5 active:scale-[0.98] group"
            >
              <div className="flex items-center gap-3.5">
                <div
                  className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105"
                  style={{ backgroundColor: opt.accent + '18' }}
                >
                  <opt.icon className="h-5 w-5" style={{ color: opt.accent }} />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground text-sm">{opt.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{opt.description}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors flex-shrink-0" />
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}