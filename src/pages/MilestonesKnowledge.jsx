import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, X as XIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { buildTimeline, calcHeight } from '@/lib/geoUtils';
import { MILESTONES, CATEGORY_COLORS, CATEGORY_LABELS, isRange, getMa } from '@/lib/milestonesData';
import { motion, AnimatePresence } from 'framer-motion';

function getContrastColor(hex) {
  const c = hex.replace('#', '');
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.55 ? '#1a1a2e' : '#ffffff';
}

// Group milestones by period/era/eon
function buildMilestoneMap() {
  const byPeriod = {};
  const byEra = {};
  const byEon = {};
  for (const m of MILESTONES) {
    const ma = getMa(m);
    // find matching period across all eons/eras
    outer: for (const eon of buildTimeline()) {
      if (ma <= eon.start_ma && ma >= eon.end_ma) {
        for (const era of eon.eras) {
          if (ma <= era.start_ma && ma >= era.end_ma) {
            if (!byEra[era.id]) byEra[era.id] = [];
            byEra[era.id].push(m);
            if (era.periods.length > 0) {
              for (const p of era.periods) {
                if (ma <= p.start_ma && ma >= p.end_ma) {
                  if (!byPeriod[p.id]) byPeriod[p.id] = [];
                  byPeriod[p.id].push(m);
                  break outer;
                }
              }
            }
            break outer;
          }
        }
        if (!byEon[eon.id]) byEon[eon.id] = [];
        byEon[eon.id].push(m);
        break;
      }
    }
  }
  return { byPeriod, byEra, byEon };
}

export default function MilestonesKnowledge() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const [filterCategory, setFilterCategory] = useState(null);
  const timeline = buildTimeline();
  const { byPeriod, byEra, byEon } = buildMilestoneMap();

  const categories = [...new Set(MILESTONES.map(m => m.category))];

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

  function MilestoneChips({ items }) {
    const visible = filterCategory
      ? items.filter(m => m.category === filterCategory)
      : items;
    if (visible.length === 0) return null;
    return (
      <div className="flex flex-wrap gap-0.5 justify-center mt-0.5">
        {visible.map(m => (
          <button
            key={m.id}
            onClick={() => setSelected(m)}
            className="text-[8px] font-semibold px-1 py-0.5 rounded leading-tight border transition-colors"
            style={{
              backgroundColor: (CATEGORY_COLORS[m.category] || '#6366f1') + '30',
              borderColor: CATEGORY_COLORS[m.category] || '#6366f1',
              color: CATEGORY_COLORS[m.category] || '#6366f1',
            }}
          >
            {m.shortName}
          </button>
        ))}
      </div>
    );
  }

  function PeriodTileWithMilestones({ period }) {
    const milestones = byPeriod[period.id] || [];
    const h = Math.max(52, calcHeight(period));
    const textColor = getContrastColor(period.color);
    return (
      <div className="relative flex flex-col items-center justify-start border-b border-black/10 select-none px-1 py-1"
        style={{ height: `${h}px`, backgroundColor: period.color, color: textColor, overflow: 'hidden' }}>
        <span className="text-xs font-semibold text-center break-words w-full"
          style={{ textShadow: '0 1px 2px rgba(0,0,0,0.15)', lineHeight: 1.25 }} lang="de">
          {period.name}
        </span>
        <MilestoneChips items={milestones} />
      </div>
    );
  }

  function EraTileWithMilestones({ era }) {
    const milestones = byEra[era.id] || [];
    const h = calcEraHeight(era);
    const textColor = getContrastColor(era.color);
    return (
      <div className="relative flex flex-col items-center justify-start border-b border-black/10 select-none px-1 py-1"
        style={{ height: `${h}px`, backgroundColor: era.color, color: textColor, overflow: 'hidden' }}>
        <span className="text-xs font-semibold text-center break-words w-full"
          style={{ textShadow: '0 1px 2px rgba(0,0,0,0.15)', lineHeight: 1.25 }} lang="de">
          {era.name}
        </span>
        <MilestoneChips items={milestones} />
      </div>
    );
  }

  function EonTileWithMilestones({ eon }) {
    const milestones = byEon[eon.id] || [];
    const h = calcEonHeight(eon);
    const textColor = getContrastColor(eon.color);
    return (
      <div className="relative flex flex-col items-center justify-start border-b border-black/10 select-none px-1 py-1"
        style={{ height: `${h}px`, backgroundColor: eon.color, color: textColor, overflow: 'hidden' }}>
        <span className="text-xs font-semibold text-center break-words w-full"
          style={{ textShadow: '0 1px 2px rgba(0,0,0,0.15)', lineHeight: 1.25 }} lang="de">
          {eon.name}
        </span>
        <MilestoneChips items={milestones} />
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-background" style={{ height: '100dvh' }}>
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="flex items-center gap-3 px-3 py-2.5">
          <Button variant="ghost" size="icon" onClick={() => navigate('/mode/milestones')} className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="flex-1 text-sm font-semibold text-foreground">Evolutionäre Meilensteine – Zeitstrahl</h1>
        </div>
        {/* Category filter chips */}
        <div className="px-3 pb-2 flex gap-1.5 overflow-x-auto hide-scrollbar">
          <button
            onClick={() => setFilterCategory(null)}
            className={`flex-shrink-0 text-[10px] font-semibold px-2.5 py-1 rounded-full border transition-colors ${
              !filterCategory ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground'
            }`}
          >
            Alle
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat === filterCategory ? null : cat)}
              className={`flex-shrink-0 text-[10px] font-semibold px-2.5 py-1 rounded-full border transition-colors ${
                filterCategory === cat ? 'text-white border-current' : 'border-border text-muted-foreground'
              }`}
              style={filterCategory === cat ? { borderColor: CATEGORY_COLORS[cat], color: CATEGORY_COLORS[cat], backgroundColor: CATEGORY_COLORS[cat] + '20' } : {}}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
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
            {timeline.map(eon => <EonTileWithMilestones key={eon.id} eon={eon} />)}
          </div>
          {/* Era */}
          <div className="flex flex-col" style={{ width: '26%', minWidth: 64 }}>
            {timeline.map(eon =>
              eon.eras.length > 0
                ? eon.eras.map(era => <EraTileWithMilestones key={era.id} era={era} />)
                : <NonClickableTile key={eon.id + '-era'} item={eon} height={calcEonHeight(eon)} />
            )}
          </div>
          {/* Period with milestone chips */}
          <div className="flex flex-col" style={{ width: '32%', minWidth: 72 }}>
            {timeline.map(eon =>
              eon.eras.length > 0
                ? eon.eras.map(era =>
                    era.periods.length > 0
                      ? era.periods.map(period => <PeriodTileWithMilestones key={period.id} period={period} />)
                      : <NonClickableTile key={era.id + '-period'} item={era} height={calcEraHeight(era)} />
                  )
                : <NonClickableTile key={eon.id + '-period'} item={eon} height={calcEonHeight(eon)} />
            )}
          </div>
          {/* Ma */}
          <div className="relative flex flex-col" style={{ width: '20%', minWidth: 48 }}>
            <span className="absolute left-0 right-0 top-0 text-center text-[10px] font-semibold text-muted-foreground">0</span>
            {timeline.map(eon =>
              eon.eras.length > 0
                ? eon.eras.map(era =>
                    era.periods.length > 0
                      ? era.periods.map(period => (
                          <div key={period.id + '-ma'} className="relative" style={{ height: `${Math.max(52, calcHeight(period))}px` }}>
                            <span className="absolute left-0 right-0 bottom-0 translate-y-1/2 text-center text-[10px] font-medium text-muted-foreground">
                              {period.start_ma}
                            </span>
                          </div>
                        ))
                      : <div key={era.id + '-ma'} className="relative" style={{ height: `${calcEraHeight(era)}px` }}>
                          <span className="absolute left-0 right-0 bottom-0 translate-y-1/2 text-center text-[10px] font-medium text-muted-foreground">
                            {era.start_ma}
                          </span>
                        </div>
                  )
                : <div key={eon.id + '-ma'} className="relative" style={{ height: `${calcEonHeight(eon)}px` }}>
                    <span className="absolute left-0 right-0 bottom-0 translate-y-1/2 text-center text-[10px] font-medium text-muted-foreground">
                      {eon.start_ma}
                    </span>
                  </div>
            )}
          </div>
        </div>
      </div>

      {/* Info modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              className="w-full max-w-lg bg-card rounded-t-2xl shadow-2xl overflow-hidden"
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="h-2" style={{ backgroundColor: CATEGORY_COLORS[selected.category] || '#6366f1' }} />
              <div className="px-5 pt-4 pb-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider"
                      style={{ color: CATEGORY_COLORS[selected.category] || '#6366f1' }}>
                      {CATEGORY_LABELS[selected.category]}
                    </span>
                    <h2 className="text-lg font-display font-bold text-foreground mt-0.5">{selected.name}</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {isRange(selected)
                        ? `${selected.ma_from}–${selected.ma_to} Ma`
                        : `~${selected.ma} Ma`}
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setSelected(null)} className="h-8 w-8 -mr-2 -mt-1">
                    <XIcon className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-foreground leading-relaxed">{selected.fact}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}