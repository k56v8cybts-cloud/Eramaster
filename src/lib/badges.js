// Abzeichen & Freischaltung des EpochenQuiz-Lernpfads.
// Alles wird aus den gespeicherten Läufen (geozeit_runs_*) abgeleitet –
// keine zusätzliche Datenstruktur nötig.

import { Circle, Layers, Grid3x3, GraduationCap, Skull, Footprints, Dna, Flame } from 'lucide-react';

// Reihenfolge des geführten EpochenQuiz-Pfads
export const EPOCH_ORDER = ['eons', 'eras', 'periods', 'expert'];

export const EPOCH_LABELS = {
  eons: 'Äonen',
  eras: 'Ären',
  periods: 'Perioden',
  expert: 'Experten',
};

const STREAK_GOAL = 10;

function runsFor(modeId) {
  try {
    return JSON.parse(localStorage.getItem(`geozeit_runs_${modeId}`) || '[]');
  } catch {
    return [];
  }
}

function completedErrorFree(modeId) {
  return runsFor(modeId).some((r) => r.errors === 0);
}

function reachedStreak(modeId, goal) {
  return runsFor(modeId).some((r) => (r.streak || 0) >= goal);
}

// Alle Abzeichen der Sammlung (Erfolge-Tab)
export const BADGES = [
  { id: 'eons',       modeId: 'eons',       name: 'Äonen-Meister',     icon: Circle,         color: '#0EA5B7', hint: 'Schließe den Äonen-Modus fehlerfrei ab.' },
  { id: 'eras',       modeId: 'eras',       name: 'Ären-Meister',      icon: Layers,         color: '#2A9D8F', hint: 'Schließe den Ären-Modus fehlerfrei ab.' },
  { id: 'periods',    modeId: 'periods',    name: 'Perioden-Meister',  icon: Grid3x3,        color: '#4FA64E', hint: 'Schließe den Perioden-Modus fehlerfrei ab.' },
  { id: 'expert',     modeId: 'expert',     name: 'Experten-Meister',  icon: GraduationCap,  color: '#E4572E', hint: 'Schließe den Expertenmodus fehlerfrei ab.' },
  { id: 'bigfive',    modeId: 'bigfive',    name: 'Big-Five-Kenner',   icon: Skull,          color: '#C1443B', hint: 'Schließe „The Big Five" fehlerfrei ab.' },
  { id: 'creatures',  modeId: 'creatures',  name: 'Urzeit-Kenner',     icon: Footprints,     color: '#2A9D8F', hint: 'Schließe „Prähistorische Lebewesen" fehlerfrei ab.' },
  { id: 'milestones', modeId: 'milestones', name: 'Evolutions-Meister',icon: Dna,            color: '#7C5CD6', hint: 'Schließe „Evolutionäre Meilensteine" fehlerfrei ab.' },
  { id: 'olderthan',  modeId: 'olderthan',  name: 'Zeitreisender',     icon: Flame,          color: '#E4902E', hint: `Erreiche eine Streak von ${STREAK_GOAL} bei „Was ist älter?".` },
];

// Ist das Abzeichen für einen Modus verdient?
export function hasBadge(modeId) {
  if (modeId === 'olderthan') return reachedStreak('olderthan', STREAK_GOAL);
  return completedErrorFree(modeId);
}

// Ist ein EpochenQuiz-Modus freigeschaltet? (Äonen immer; Rest nach Vor-Abzeichen)
export function isEpochUnlocked(modeId) {
  const idx = EPOCH_ORDER.indexOf(modeId);
  if (idx <= 0) return true; // Äonen immer frei; Nicht-Epochen-Modi (-1) ebenfalls
  return hasBadge(EPOCH_ORDER[idx - 1]);
}

// Nächster Epochen-Modus nach diesem (oder null)
export function nextEpochMode(modeId) {
  const idx = EPOCH_ORDER.indexOf(modeId);
  if (idx === -1 || idx === EPOCH_ORDER.length - 1) return null;
  return EPOCH_ORDER[idx + 1];
}
