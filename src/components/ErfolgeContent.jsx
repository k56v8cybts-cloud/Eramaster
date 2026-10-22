import React from 'react';
import { motion } from 'framer-motion';
import { HelpCircle } from 'lucide-react';
import { BADGES, hasBadge } from '@/lib/badges';

export default function ErfolgeContent() {
  const earned = BADGES.filter((b) => hasBadge(b.modeId));
  const earnedCount = earned.length;

  return (
    <div className="px-5 pt-4 pb-28 max-w-md mx-auto">
      {/* Fortschritt */}
      <div className="mb-5 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Abzeichen</p>
        <p className="text-2xl font-display font-bold text-foreground mt-1">
          {earnedCount}<span className="text-muted-foreground text-lg"> / {BADGES.length}</span>
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Schließe Modi fehlerfrei ab, um Abzeichen freizuschalten.
        </p>
      </div>

      {/* Abzeichen-Raster */}
      <div className="grid grid-cols-3 gap-3">
        {BADGES.map((badge, i) => {
          const unlocked = hasBadge(badge.modeId);
          const Icon = badge.icon;
          return (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04 }}
              className="flex flex-col items-center text-center gap-2"
            >
              {unlocked ? (
                <>
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center border-2"
                    style={{ backgroundColor: badge.color + '1A', borderColor: badge.color }}
                  >
                    <Icon className="h-7 w-7" style={{ color: badge.color }} />
                  </div>
                  <span className="text-[11px] font-semibold text-foreground leading-tight">{badge.name}</span>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center border-2 border-dashed border-border bg-muted/40">
                    <HelpCircle className="h-6 w-6 text-muted-foreground/30" />
                  </div>
                  <span className="text-[11px] font-semibold text-muted-foreground/40 leading-tight">???</span>
                </>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
