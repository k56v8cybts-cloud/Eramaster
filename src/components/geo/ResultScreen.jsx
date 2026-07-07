import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, XCircle, Clock, ArrowLeft, RotateCcw, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ResultScreen({ errors, total, elapsed, failed, gameType, onReplay, onModeMenu }) {
  const perfect = errors === 0;
  const good = errors <= 3;

  const badge = failed
    ? { label: 'Prüfung nicht bestanden', emoji: '❌' }
    : perfect
    ? { label: 'Perfekt!', emoji: '🏆' }
    : good
    ? { label: 'Sehr gut!', emoji: '🌟' }
    : { label: 'Geschafft!', emoji: '✅' };

  const formatTime = (ms) => {
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="text-center px-6 max-w-sm w-full">
        <motion.div
          className="text-6xl mb-4"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
        >
          {badge.emoji}
        </motion.div>

        <motion.h1
          className="text-3xl font-display font-bold text-foreground mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {badge.label}
        </motion.h1>

        <motion.p
          className="text-muted-foreground mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {failed
            ? `${total - (total - 1)} Fehler im ersten Versuch`
            : `Alle ${total} Begriffe zugeordnet`}
        </motion.p>

        <motion.div
          className="flex justify-center gap-8 mb-10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="text-center">
            <div className="flex items-center justify-center gap-1.5 text-destructive mb-1">
              <XCircle className="h-4 w-4" />
              <span className="text-2xl font-bold">{errors}</span>
            </div>
            <p className="text-xs text-muted-foreground">Fehler</p>
          </div>
          {!failed && (
            <div className="text-center">
              <div className="flex items-center justify-center gap-1.5 text-primary mb-1">
                <Trophy className="h-4 w-4" />
                <span className="text-2xl font-bold">{total}</span>
              </div>
              <p className="text-xs text-muted-foreground">Begriffe</p>
            </div>
          )}
          {elapsed > 0 && (
            <div className="text-center">
              <div className="flex items-center justify-center gap-1.5 text-muted-foreground mb-1">
                <Clock className="h-4 w-4" />
                <span className="text-2xl font-bold">{formatTime(elapsed)}</span>
              </div>
              <p className="text-xs text-muted-foreground">Zeit</p>
            </div>
          )}
        </motion.div>

        <motion.div
          className="flex flex-col gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Button onClick={onReplay} className="w-full gap-2">
            <RotateCcw className="h-4 w-4" />
            Nochmal spielen
          </Button>
          <Button variant="outline" onClick={onModeMenu} className="w-full gap-2">
            <ArrowLeft className="h-4 w-4" />
            Zurück zur Modusübersicht
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}