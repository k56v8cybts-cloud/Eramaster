import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, Flame } from 'lucide-react';

const MODES = [
  { id: 'olderthan',  label: 'Was ist älter?',            streak: true },
  { id: 'bigfive',    label: 'The Big Five' },
  { id: 'creatures',  label: 'Prähistorische Lebewesen' },
  { id: 'milestones', label: 'Evolutionäre Meilensteine' },
  { id: 'eons',       label: 'Äonen-Modus' },
  { id: 'eras',       label: 'Ären-Modus' },
  { id: 'periods',    label: 'Perioden-Modus' },
  { id: 'expert',     label: 'Expertenmodus' },
];

function getStats(modeId, isStreak) {
  const runs = JSON.parse(localStorage.getItem(`geozeit_runs_${modeId}`) || '[]');
  if (runs.length === 0) return null;
  if (isStreak) {
    const best = Math.max(...runs.map(r => r.streak || 0));
    return { best, count: runs.length };
  }
  // Punktebasierte Modi (z. B. Meilensteine)
  if (runs.some(r => typeof r.score === 'number')) {
    const bestScore = Math.max(...runs.map(r => r.score || 0));
    const maxScore = runs.find(r => r.maxScore)?.maxScore;
    return { count: runs.length, bestScore, maxScore };
  }
  const perfect = runs.filter(r => r.errors === 0).length;
  const best = runs.reduce((b, r) => (!b || r.errors <= b.errors) ? r : b, null);
  return { count: runs.length, perfect, bestErrors: best?.errors ?? '–' };
}

export default function ErfolgeContent() {
  return (
    <div className="px-5 pt-4 pb-28 max-w-md mx-auto flex flex-col gap-3">
      {MODES.map((mode, i) => {
        const stats = getStats(mode.id, mode.streak);
        return (
          <motion.div
            key={mode.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
          >
            <Link to={mode.id === 'olderthan' ? '/leaderboard/olderthan' : `/leaderboard/${mode.id}`}>
              <div className="rounded-xl border border-border bg-card px-4 py-3 flex items-center gap-3 hover:border-primary/20 transition-colors">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">{mode.label}</p>
                  {stats ? (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {mode.streak
                        ? `Beste Streak: ${stats.best} · ${stats.count} Spiele`
                        : stats.bestScore != null
                        ? `Beste Punkte: ${stats.bestScore}${stats.maxScore ? `/${stats.maxScore}` : ''} · ${stats.count} Spiele`
                        : `${stats.count} Spiele · ${stats.perfect} perfekt · Beste: ${stats.bestErrors} Fehler`}
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground mt-0.5">Noch keine Spiele</p>
                  )}
                </div>
                {mode.streak && stats ? (
                  <div className="flex items-center gap-1 text-orange-500">
                    <Flame className="h-4 w-4" />
                    <span className="text-sm font-bold">{stats.best}</span>
                  </div>
                ) : stats ? (
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Trophy className="h-4 w-4" />
                    <span className="text-sm font-bold">{stats.bestScore != null ? stats.bestScore : stats.perfect}</span>
                  </div>
                ) : (
                  <Trophy className="h-4 w-4 text-muted-foreground/30" />
                )}
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}