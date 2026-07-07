import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, X as XIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function GameHeader({
  currentItem,
  errors,
  solved,
  total,
  gameType,
  onBack,
}) {
  const progress = total > 0 ? (solved / total) : 0;

  return (
    <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border">
      {/* Top bar */}
      <div className="flex items-center gap-2 px-2 py-2">
        <Button variant="ghost" size="icon" onClick={onBack} className="h-8 w-8 shrink-0">
          <ArrowLeft className="h-4 w-4" />
        </Button>

        {/* Progress bar + stats */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-muted-foreground">{solved} / {total}</span>
            <div className="flex items-center gap-2">
              {gameType === 'exam' && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-destructive/10 text-destructive uppercase tracking-wider">
                  Prüfung
                </span>
              )}
              <span className="flex items-center gap-1 text-xs text-destructive font-medium">
                <XIcon className="h-3 w-3" />
                {errors}
              </span>
            </div>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${progress * 100}%` }}
              transition={{ type: 'spring', stiffness: 120, damping: 20 }}
            />
          </div>
        </div>
      </div>

      {/* Current question */}
      <AnimatePresence mode="wait">
        {currentItem && (
          <motion.div
            key={currentItem.id}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            className="px-4 pb-2.5 text-center"
          >
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-0.5">Finde</p>
            <p className="text-xl font-display font-bold text-foreground">{currentItem.name}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Column headers */}
      <div className="flex border-t border-border/60 bg-muted/30">
        <div className="text-[10px] font-semibold text-muted-foreground text-center py-1" style={{ width: '22%' }}>Äon</div>
        <div className="text-[10px] font-semibold text-muted-foreground text-center py-1" style={{ width: '26%' }}>Ära</div>
        <div className="text-[10px] font-semibold text-muted-foreground text-center py-1" style={{ width: '32%' }}>Periode</div>
        <div className="text-[10px] font-semibold text-muted-foreground text-center py-1" style={{ width: '20%' }}>Ma</div>
      </div>
    </div>
  );
}