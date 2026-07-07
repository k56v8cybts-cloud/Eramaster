import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Trophy, XCircle, Clock, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MODE_LABELS = {
  bigfive: 'The Big Five',
  creatures: 'Prähistorische Lebewesen',
  milestones: 'Evolutionäre Meilensteine',
  olderthan: 'Was ist älter?',
  eons: 'Äonen-Modus',
  eras: 'Ären-Modus',
  periods: 'Perioden-Modus',
  expert: 'Expertenmodus',
};

const GAME_TYPE_LABELS = {
  training: 'Training',
  exam: 'Prüfung',
};

export function saveRun({ modeId, gameType, errors, total, elapsed }) {
  const key = `geozeit_runs_${modeId}`;
  const runs = JSON.parse(localStorage.getItem(key) || '[]');
  runs.unshift({ gameType, errors, total, elapsed, date: Date.now() });
  // Keep max 50 runs
  localStorage.setItem(key, JSON.stringify(runs.slice(0, 50)));
}

export function getRuns(modeId) {
  return JSON.parse(localStorage.getItem(`geozeit_runs_${modeId}`) || '[]');
}

function formatTime(ms) {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

function formatDate(ts) {
  return new Date(ts).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: '2-digit' });
}

export default function Leaderboard() {
  const { modeId } = useParams();
  const navigate = useNavigate();
  const [runs, setRuns] = React.useState(() => getRuns(modeId));

  const clearRuns = () => {
    localStorage.removeItem(`geozeit_runs_${modeId}`);
    setRuns([]);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="flex items-center justify-between px-3 py-2.5 max-w-md mx-auto">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(`/mode/${modeId}`)}
              className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-muted transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <h1 className="text-sm font-semibold text-foreground">Leaderboard – {MODE_LABELS[modeId]}</h1>
          </div>
          {runs.length > 0 && (
            <button onClick={clearRuns} className="text-muted-foreground hover:text-destructive transition-colors">
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="px-5 pt-6 pb-12 max-w-md mx-auto">
        {runs.length === 0 ? (
          <div className="text-center text-muted-foreground py-20">
            <Trophy className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">Noch keine Durchgänge gespeichert.</p>
            <p className="text-xs mt-1 opacity-70">Spiele Training oder Prüfung, um Ergebnisse zu sehen.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {runs.map((run, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="rounded-xl border border-border bg-card px-4 py-3 flex items-center gap-3"
              >
                <span className="text-xs font-bold text-muted-foreground w-5 shrink-0">#{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-semibold text-foreground">
                      {GAME_TYPE_LABELS[run.gameType] || run.gameType}
                    </span>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${run.errors === 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {run.errors === 0 ? '✓ Perfekt' : `${run.errors} Fehler`}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Trophy className="h-3 w-3" /> {run.total}
                    </span>
                    {run.elapsed > 0 && (
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {formatTime(run.elapsed)}
                      </span>
                    )}
                    <span>{formatDate(run.date)}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}