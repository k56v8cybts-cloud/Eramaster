import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Trophy, Flame, Trash2 } from 'lucide-react';

function formatDate(ts) {
  return new Date(ts).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: '2-digit' });
}

export default function OlderThanLeaderboard() {
  const navigate = useNavigate();
  const [runs, setRuns] = React.useState(() => {
    const raw = JSON.parse(localStorage.getItem('geozeit_runs_olderthan') || '[]');
    return raw.sort((a, b) => (b.streak || 0) - (a.streak || 0));
  });

  const clearRuns = () => {
    localStorage.removeItem('geozeit_runs_olderthan');
    setRuns([]);
  };

  const best = runs.length > 0 ? runs[0].streak || 0 : 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="flex items-center justify-between px-3 py-2.5 max-w-md mx-auto">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/mode/olderthan')}
              className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-muted transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <h1 className="text-sm font-semibold text-foreground">Leaderboard – Was ist älter?</h1>
          </div>
          {runs.length > 0 && (
            <button onClick={clearRuns} className="text-muted-foreground hover:text-destructive transition-colors">
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="px-5 pt-6 pb-12 max-w-md mx-auto">
        {/* Best streak banner */}
        {best > 0 && (
          <div className="rounded-xl bg-orange-500/10 border border-orange-500/30 px-4 py-3 flex items-center gap-3 mb-5">
            <Flame className="h-6 w-6 text-orange-500 shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Beste Streak</p>
              <p className="text-2xl font-bold text-orange-500">{best}</p>
            </div>
          </div>
        )}

        {runs.length === 0 ? (
          <div className="text-center text-muted-foreground py-20">
            <Trophy className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">Noch keine Durchgänge gespeichert.</p>
            <p className="text-xs mt-1 opacity-70">Spiele Training, um deine Streak zu starten.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {runs.slice(0, 10).map((run, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="rounded-xl border border-border bg-card px-4 py-3 flex items-center gap-3"
              >
                <span className="text-xs font-bold text-muted-foreground w-5 shrink-0">#{i + 1}</span>
                <div className="flex-1 flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-orange-500">
                    <Flame className="h-4 w-4" />
                    <span className="text-lg font-bold">{run.streak || 0}</span>
                  </div>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
                    (run.streak || 0) >= 10 ? 'bg-orange-100 text-orange-700' :
                    (run.streak || 0) >= 5 ? 'bg-yellow-100 text-yellow-700' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {(run.streak || 0) >= 10 ? '🔥 Heiß!' : (run.streak || 0) >= 5 ? '⚡ Gut!' : 'Versuch'}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">{formatDate(run.date)}</span>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}