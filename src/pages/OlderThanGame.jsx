import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Flame, Trophy, Zap, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { pickPair } from '@/lib/olderThanData';
import { getRuns } from './Leaderboard';

const TYPE_COLORS = {
  'Äon':              '#9AD9F5',
  'Ära':              '#67C5CA',
  'Periode':          '#7FC64E',
  'Lebewesen':        '#15803d',
  'Ereignis':         '#7c3aed',
  'Massenaussterben': '#7f1d1d',
};

function saveStreakRun(streak) {
  const key = 'geozeit_runs_olderthan';
  const runs = JSON.parse(localStorage.getItem(key) || '[]');
  runs.unshift({ streak, date: Date.now() });
  localStorage.setItem(key, JSON.stringify(runs.slice(0, 50)));
}

// Formatiert einen Zeitpunkt (in Ma) als deutschen Text, z. B.
// "vor etwa 145 Millionen Jahren" oder "vor etwa 11.700 Jahren" / "heute".
function pointPhrase(ma) {
  if (ma <= 0) return 'heute';
  if (ma < 1) {
    const years = Math.round(ma * 1_000_000);
    return `vor etwa ${years.toLocaleString('de-DE')} Jahren`;
  }
  const value = ma >= 100 ? Math.round(ma) : Math.round(ma * 10) / 10;
  return `vor etwa ${value.toLocaleString('de-DE')} Millionen Jahren`;
}

// Zeitangabe eines Elements: Zeitpunkt oder Zeitspanne.
function formatAge(item) {
  const start = item.start_ma;
  const end = item.end_ma ?? item.start_ma;
  if (Math.abs(start - end) < 0.001) {
    return pointPhrase(start);
  }
  const endPhrase = end <= 0 ? 'bis heute' : `bis ${pointPhrase(end)}`;
  return `von ${pointPhrase(start)} ${endPhrase}`;
}

function ItemCard({ item, state, revealed, onClick, disabled }) {
  const isCorrect = state === 'correct';
  const isWrong = state === 'wrong';

  let bg = 'bg-card hover:bg-card/80';
  let border = 'border-border';
  let scale = disabled ? '' : 'cursor-pointer active:scale-[0.97]';

  if (isCorrect) { bg = 'bg-green-500/20'; border = 'border-green-500'; }
  if (isWrong) { bg = 'bg-red-500/20'; border = 'border-red-500'; }

  const typeColor = TYPE_COLORS[item.type] || '#94a3b8';

  return (
    <motion.div
      layout
      onClick={!disabled ? onClick : undefined}
      className={`relative flex flex-col items-center justify-center rounded-2xl border-2 p-5 select-none transition-colors ${bg} ${border} ${scale}`}
      style={{ minHeight: 160 }}
      whileTap={!disabled ? { scale: 0.96 } : {}}
    >
      {/* Type badge */}
      <span
        className="absolute top-3 left-3 text-[10px] font-semibold px-2 py-0.5 rounded-full"
        style={{ backgroundColor: typeColor + '33', color: typeColor }}
      >
        {item.type}
      </span>

      {/* Result icon */}
      {(isCorrect || isWrong) && (
        <motion.span
          className="absolute top-3 right-3 text-lg"
          initial={{ scale: 0 }} animate={{ scale: 1 }}
        >
          {isCorrect ? '✓' : '✗'}
        </motion.span>
      )}

      {/* Image */}
      {item.image && (
        <img
          src={item.image}
          alt={item.name}
          className="w-20 h-20 object-cover rounded-xl mb-3 border border-border"
          onError={e => { e.target.style.display = 'none'; }}
        />
      )}

      {/* Name */}
      <p className="text-base font-display font-bold text-foreground text-center leading-tight">
        {item.name}
      </p>

      {/* Reveal time span on result – for BOTH cards */}
      {revealed && (
        <motion.p
          className="text-xs text-muted-foreground mt-1.5 text-center leading-snug px-1"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        >
          {formatAge(item)}
        </motion.p>
      )}
    </motion.div>
  );
}

export default function OlderThanGame() {
  const navigate = useNavigate();
  const [pair, setPair] = useState(() => pickPair());
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(() => {
    const runs = getRuns('olderthan');
    return runs.length > 0 ? Math.max(...runs.map(r => r.streak || 0)) : 0;
  });
  const [feedback, setFeedback] = useState(null); // { correct: id, wrong: id, wasCorrect: bool } | null
  const [gameOver, setGameOver] = useState(false);
  const [finalStreak, setFinalStreak] = useState(0);

  const handleChoice = useCallback((chosen) => {
    if (feedback) return;
    const [a, b] = pair;
    const correctItem = a.start_ma >= b.start_ma ? a : b;
    const wasCorrect = chosen.id === correctItem.id;

    if (wasCorrect) {
      setFeedback({ correct: chosen.id, wrong: null, wasCorrect: true });
      setStreak(s => s + 1);
    } else {
      setFeedback({ correct: correctItem.id, wrong: chosen.id, wasCorrect: false });
      const newStreak = streak;
      setFinalStreak(newStreak);
      if (newStreak > bestStreak) setBestStreak(newStreak);
      saveStreakRun(newStreak);
    }
  }, [pair, feedback, streak, bestStreak]);

  const handleContinue = useCallback(() => {
    if (!feedback) return;
    if (!feedback.wasCorrect) {
      setGameOver(true);
    } else {
      setPair(pickPair());
      setFeedback(null);
    }
  }, [feedback]);

  const restart = useCallback(() => {
    setStreak(0);
    setPair(pickPair());
    setFeedback(null);
    setGameOver(false);
  }, []);

  const [left, right] = pair;

  if (gameOver) {
    const isNewBest = finalStreak >= bestStreak && finalStreak > 0;
    return (
      <div className="flex flex-col bg-background" style={{ height: '100dvh' }}>
        <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border">
          <div className="flex items-center gap-3 px-3 py-2.5">
            <Button variant="ghost" size="icon" onClick={() => navigate('/mode/olderthan')} className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-sm font-semibold text-foreground">Was ist älter?</h1>
          </div>
        </div>

        <motion.div
          className="flex-1 flex flex-col items-center justify-center px-6 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="text-6xl mb-4">{isNewBest ? '🏆' : finalStreak >= 5 ? '🔥' : '💀'}</div>
          <h2 className="text-3xl font-display font-bold text-foreground mb-2">
            {isNewBest ? 'Neuer Rekord!' : 'Streak beendet!'}
          </h2>

          <div className="flex gap-8 my-8">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1.5 text-orange-500 mb-1">
                <Flame className="h-5 w-5" />
                <span className="text-3xl font-bold">{finalStreak}</span>
              </div>
              <p className="text-xs text-muted-foreground">Streak</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1.5 text-yellow-500 mb-1">
                <Trophy className="h-5 w-5" />
                <span className="text-3xl font-bold">{bestStreak}</span>
              </div>
              <p className="text-xs text-muted-foreground">Bestleistung</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 w-full max-w-xs">
            <Button onClick={restart} className="w-full gap-2">
              <Zap className="h-4 w-4" />
              Nochmal spielen
            </Button>
            <Button variant="outline" onClick={() => navigate('/leaderboard/olderthan')} className="w-full gap-2">
              <Trophy className="h-4 w-4" />
              Leaderboard
            </Button>
            <Button variant="ghost" onClick={() => navigate('/mode/olderthan')} className="w-full gap-2">
              <ArrowLeft className="h-4 w-4" />
              Zurück
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-background" style={{ height: '100dvh' }}>
      {/* Header */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="flex items-center justify-between px-3 py-2.5">
          <Button variant="ghost" size="icon" onClick={() => navigate('/mode/olderthan')} className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-orange-500">
              <Flame className="h-4 w-4" />
              <span className="text-sm font-bold">{streak}</span>
            </div>
            <div className="flex items-center gap-1.5 text-yellow-500">
              <Trophy className="h-4 w-4" />
              <span className="text-sm font-semibold text-muted-foreground">{bestStreak}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 flex flex-col px-4 py-4 gap-4 overflow-hidden">
        <motion.p
          className="text-center text-sm font-semibold text-muted-foreground"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        >
          Was ist <span className="text-foreground font-bold">älter</span>?
        </motion.p>

        <AnimatePresence mode="wait">
          <motion.div
            key={left.id + right.id}
            className="flex-1 grid grid-cols-2 gap-3"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.2 }}
          >
            <ItemCard
              item={left}
              state={feedback ? (feedback.correct === left.id ? 'correct' : feedback.wrong === left.id ? 'wrong' : null) : null}
              revealed={!!feedback}
              onClick={() => handleChoice(left)}
              disabled={!!feedback}
            />
            <ItemCard
              item={right}
              state={feedback ? (feedback.correct === right.id ? 'correct' : feedback.wrong === right.id ? 'wrong' : null) : null}
              revealed={!!feedback}
              onClick={() => handleChoice(right)}
              disabled={!!feedback}
            />
          </motion.div>
        </AnimatePresence>

        {/* VS divider or Weiter button */}
        <div className="flex items-center justify-center">
          {feedback ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-xs"
            >
              <Button
                onClick={handleContinue}
                className={`w-full gap-2 ${feedback.wasCorrect ? 'bg-green-600 hover:bg-green-700' : 'bg-destructive hover:bg-destructive/90'}`}
              >
                {feedback.wasCorrect ? (
                  <>Weiter <ChevronRight className="h-4 w-4" /></>
                ) : (
                  <>Ergebnis ansehen <ChevronRight className="h-4 w-4" /></>
                )}
              </Button>
            </motion.div>
          ) : (
            <span className="text-xs font-bold text-muted-foreground/40 tracking-widest">VS</span>
          )}
        </div>
      </div>
    </div>
  );
}