import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { buildTimeline, calcHeight } from '@/lib/geoUtils';
import { CREATURES } from '@/lib/creaturesData';
import { motion, AnimatePresence } from 'framer-motion';

function getContrastColor(hex) {
  const c = hex.replace('#', '');
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.55 ? '#1a1a2e' : '#ffffff';
}

// Group creatures by their primary period
const CREATURES_BY_PERIOD = CREATURES.reduce((acc, c) => {
  if (!acc[c.period]) acc[c.period] = [];
  acc[c.period].push(c);
  return acc;
}, {});

export default function CreaturesKnowledge() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const timeline = buildTimeline();

  function calcEraHeight(era) {
    if (era.periods?.length > 0) return era.periods.reduce((s, p) => s + Math.max(52, calcHeight(p)), 0);
    return Math.max(52, calcHeight(era));
  }
  function calcEonHeight(eon) {
    if (eon.eras?.length > 0) return eon.eras.reduce((s, era) => s + calcEraHeight(era), 0);
    return Math.max(52, calcHeight(eon));
  }

  function NonClickableTile({ item, height }) {
    const textColor = getContrastColor(item.color);
    return (
      <div className="flex items-center justify-center border-b border-black/10 select-none"
        style={{ height: `${height}px`, backgroundColor: item.color, color: textColor }}>
        <span className="text-xs font-semibold text-center px-1 break-words"
          style={{ textShadow: '0 1px 2px rgba(0,0,0,0.15)', lineHeight: 1.25 }} lang="de">
          {item.name}
        </span>
      </div>
    );
  }

  function PeriodTileWithCreatures({ period }) {
    const creatures = CREATURES_BY_PERIOD[period.id] || [];
    const h = Math.max(52, calcHeight(period));
    const textColor = getContrastColor(period.color);
    return (
      <div className="relative flex flex-col items-center justify-start border-b border-black/10 select-none px-1 py-1"
        style={{ height: `${h}px`, backgroundColor: period.color, color: textColor, overflow: 'hidden' }}>
        <span className="text-xs font-semibold text-center break-words w-full"
          style={{ textShadow: '0 1px 2px rgba(0,0,0,0.15)', lineHeight: 1.25 }} lang="de">
          {period.name}
        </span>
        <div className="flex flex-wrap gap-0.5 justify-center mt-0.5">
          {creatures.map(c => (
            <button
              key={c.id}
              className="rounded overflow-hidden border border-white/30 hover:border-white transition-all"
              style={{ width: 20, height: 20 }}
              onClick={() => setSelected(c)}
              title={c.name}
            >
              <img src={c.image} alt={c.name} className="w-full h-full object-cover"
                onError={(e) => { e.target.style.display = 'none'; }} />
            </button>
          ))}
        </div>
        {h >= 50 && (
          <span className="absolute bottom-0.5 right-1 text-[9px] opacity-50 pointer-events-none"
            style={{ color: textColor }}>{period.start_ma}</span>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-background" style={{ height: '100dvh' }}>
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="flex items-center gap-3 px-3 py-2.5">
          <Button variant="ghost" size="icon" onClick={() => navigate('/mode/creatures')} className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-sm font-semibold text-foreground">Prähistorische Lebewesen – Zeitstrahl</h1>
        </div>
        <div className="flex border-t border-border bg-muted/50">
          <div className="text-[10px] font-semibold text-muted-foreground text-center py-1.5" style={{ width: '22%' }}>Äon</div>
          <div className="text-[10px] font-semibold text-muted-foreground text-center py-1.5" style={{ width: '26%' }}>Ära</div>
          <div className="text-[10px] font-semibold text-muted-foreground text-center py-1.5" style={{ width: '32%' }}>Periode</div>
          <div className="text-[10px] font-semibold text-muted-foreground text-center py-1.5" style={{ width: '20%' }}>Ma</div>
        </div>
      </div>

      <div className="flex-1 overflow-auto hide-scrollbar">
        <div className="flex w-full">
          {/* Eon */}
          <div className="flex flex-col" style={{ width: '22%', minWidth: 56 }}>
            {timeline.map(eon => <NonClickableTile key={eon.id} item={eon} height={calcEonHeight(eon)} />)}
          </div>
          {/* Era */}
          <div className="flex flex-col" style={{ width: '26%', minWidth: 64 }}>
            {timeline.map(eon =>
              eon.eras.length > 0
                ? eon.eras.map(era => <NonClickableTile key={era.id} item={era} height={calcEraHeight(era)} />)
                : <NonClickableTile key={eon.id + '-era'} item={eon} height={calcEonHeight(eon)} />
            )}
          </div>
          {/* Period with creature thumbnails */}
          <div className="flex flex-col" style={{ width: '32%', minWidth: 72 }}>
            {timeline.map(eon =>
              eon.eras.length > 0
                ? eon.eras.map(era =>
                    era.periods.length > 0
                      ? era.periods.map(period => <PeriodTileWithCreatures key={period.id} period={period} />)
                      : <NonClickableTile key={era.id + '-period'} item={era} height={calcEraHeight(era)} />
                  )
                : <NonClickableTile key={eon.id + '-period'} item={eon} height={calcEonHeight(eon)} />
            )}
          </div>
          {/* Ma */}
          <div className="flex flex-col" style={{ width: '20%', minWidth: 48 }}>
            {timeline.map(eon =>
              eon.eras.length > 0
                ? eon.eras.map(era =>
                    era.periods.length > 0
                      ? era.periods.map(period => {
                          const h = Math.max(52, calcHeight(period));
                          return (
                            <div key={period.id + '-ma'} className="flex items-start justify-center border-b border-border/30 bg-muted/30" style={{ height: `${h}px` }}>
                              <span className="text-[10px] font-medium text-muted-foreground mt-1">{period.start_ma}</span>
                            </div>
                          );
                        })
                      : <div key={era.id + '-ma'} className="flex items-start justify-center border-b border-border/30 bg-muted/30" style={{ height: `${calcEraHeight(era)}px` }}>
                          <span className="text-[10px] font-medium text-muted-foreground mt-1">{era.start_ma}</span>
                        </div>
                  )
                : <div key={eon.id + '-ma'} className="flex items-start justify-center border-b border-border/30 bg-muted/30" style={{ height: `${calcEonHeight(eon)}px` }}>
                    <span className="text-[10px] font-medium text-muted-foreground mt-1">{eon.start_ma}</span>
                  </div>
            )}
          </div>
        </div>
      </div>

      {/* Info overlay */}
      <AnimatePresence>
        {selected && (
          <motion.div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}>
            <motion.div className="w-full max-w-lg bg-card rounded-t-2xl shadow-2xl overflow-hidden"
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              onClick={e => e.stopPropagation()}>
              <div className="h-2 bg-primary" />
              <div className="flex gap-4 px-5 pt-4 pb-2">
                <img src={selected.image} alt={selected.name}
                  className="w-20 h-20 object-cover rounded-xl border border-border flex-shrink-0 bg-muted"
                  onError={(e) => { e.target.style.display = 'none'; }} />
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-lg font-display font-bold text-foreground">{selected.name}</h2>
                      <p className="text-xs text-muted-foreground mt-0.5">{selected.periodName} · {selected.start_ma} – {selected.end_ma} Ma</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => setSelected(null)} className="h-8 w-8 -mr-2 -mt-1">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="px-5 pb-6">
                <p className="text-sm text-foreground leading-relaxed">{selected.fact}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}