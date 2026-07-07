import React from 'react';
import { motion } from 'framer-motion';
import {
  PHANEROZOIC_PERIODS, BOUNDARIES, EXTINCTION_BY_ID,
  calcPeriodHeight, BOUNDARY_HEIGHT,
} from '@/lib/bigFiveData';

function getContrastColor(hex) {
  const c = hex.replace('#', '');
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.55 ? '#1a1a2e' : '#ffffff';
}

// A normal (non-clickable) period tile
function PeriodTile({ period, height }) {
  const textColor = getContrastColor(period.color);
  return (
    <div
      className="flex items-center justify-center border-b border-black/10 select-none"
      style={{ height: `${height}px`, backgroundColor: period.color, color: textColor }}
    >
      <span className="text-xs font-semibold text-center px-1 break-words"
        style={{ textShadow: '0 1px 2px rgba(0,0,0,0.15)', lineHeight: 1.25 }} lang="de">
        {period.name}
      </span>
    </div>
  );
}

// A clickable period tile (for Kellwasser / Devon)
function ClickablePeriodTile({ period, height, feedbackState, solved, onClick, extinctionName }) {
  const isSolvedOrReveal = solved || feedbackState === 'correct' || feedbackState === 'reveal';
  const isWrong = feedbackState === 'wrong';

  let bg = period.color;
  let textColor = getContrastColor(period.color);

  if (isSolvedOrReveal) { bg = '#16a34a'; textColor = '#fff'; }
  else if (isWrong) { bg = '#dc2626'; textColor = '#fff'; }

  return (
    <motion.div
      className="flex flex-col items-center justify-center border-b border-black/10 select-none cursor-pointer relative"
      style={{ height: `${height}px`, backgroundColor: bg, color: textColor }}
      whileTap={!solved ? { scale: 0.97 } : {}}
      onClick={!solved ? onClick : undefined}
    >
      <span className="text-xs font-semibold text-center px-1 break-words"
        style={{ textShadow: '0 1px 2px rgba(0,0,0,0.15)', lineHeight: 1.25 }} lang="de">
        {period.name}
      </span>
      {isSolvedOrReveal && extinctionName && (
        <span className="text-[9px] font-medium text-center px-1 mt-0.5 opacity-90"
          style={{ lineHeight: 1.2 }}>
          {extinctionName}
        </span>
      )}
    </motion.div>
  );
}

// A clickable boundary tile (line between periods)
function BoundaryTile({ boundary, feedbackState, solved, onClick, extinctionName }) {
  const isSolvedOrReveal = solved || feedbackState === 'correct' || feedbackState === 'reveal';
  const isWrong = feedbackState === 'wrong';

  let bg = '#1e293b';
  let border = '#334155';
  let textColor = '#94a3b8';

  if (isSolvedOrReveal) { bg = '#16a34a'; border = '#15803d'; textColor = '#fff'; }
  else if (isWrong) { bg = '#dc2626'; border = '#b91c1c'; textColor = '#fff'; }

  return (
    <motion.div
      className="flex items-center justify-center border-y select-none cursor-pointer z-10 relative px-2"
      style={{ height: `${BOUNDARY_HEIGHT}px`, backgroundColor: bg, borderColor: border, color: textColor }}
      whileTap={!solved ? { scale: 0.97 } : {}}
      onClick={!solved ? onClick : undefined}
    >
      {isSolvedOrReveal && extinctionName ? (
        <span className="text-[9px] font-bold pointer-events-none truncate">{extinctionName}</span>
      ) : (
        <span className="text-[10px] font-bold tracking-widest pointer-events-none">
          {isWrong ? '✗' : '─────'}
        </span>
      )}
    </motion.div>
  );
}

// A plain (non-clickable) boundary line
function PlainBoundaryLine() {
  return (
    <div
      className="border-y border-border/40 bg-slate-800/60"
      style={{ height: `${BOUNDARY_HEIGHT}px` }}
    />
  );
}

function MaCell({ value, height }) {
  return (
    <div className="flex items-start justify-center border-b border-border/30 bg-muted/30" style={{ height: `${height}px` }}>
      <span className="text-[10px] font-medium text-muted-foreground mt-1">{value}</span>
    </div>
  );
}

function MaBoundaryCell({ value }) {
  return (
    <div className="flex items-center justify-center bg-muted/50" style={{ height: `${BOUNDARY_HEIGHT}px` }}>
      <span className="text-[9px] font-semibold text-muted-foreground">{value}</span>
    </div>
  );
}

export default function BigFiveTimeline({ feedbackMap = {}, solvedSet = new Set(), onBoundaryClick }) {
  // Build rows: interleave periods and boundaries
  const rows = [];
  PHANEROZOIC_PERIODS.forEach(period => {
    const extinction = EXTINCTION_BY_ID[period.id]; // e.g. devonian → Kellwasser
    rows.push({ type: 'period', data: period, extinction: extinction || null });
    const boundary = BOUNDARIES.find(b => b.lower === period.id);
    if (boundary) {
      const bExtinction = EXTINCTION_BY_ID[boundary.id] || null;
      rows.push({ type: 'boundary', data: boundary, extinction: bExtinction });
    }
  });

  return (
    <div className="flex w-full">
      {/* Main column */}
      <div className="flex flex-col flex-1">
        {rows.map(row => {
          if (row.type === 'period') {
            const h = calcPeriodHeight(row.data);
            if (row.extinction) {
              // Clickable period (Kellwasser / Devon)
              const solved = solvedSet.has(row.data.id);
              return (
                <ClickablePeriodTile
                  key={row.data.id}
                  period={row.data}
                  height={h}
                  feedbackState={feedbackMap[row.data.id]}
                  solved={solved}
                  extinctionName={row.extinction.fullName}
                  onClick={() => onBoundaryClick?.({ id: row.data.id, type: 'period' })}
                />
              );
            }
            return <PeriodTile key={row.data.id} period={row.data} height={h} />;
          } else {
            // boundary
            if (row.extinction) {
              const solved = solvedSet.has(row.data.id);
              return (
                <BoundaryTile
                  key={row.data.id}
                  boundary={row.data}
                  feedbackState={feedbackMap[row.data.id]}
                  solved={solved}
                  extinctionName={row.extinction.fullName}
                  onClick={() => onBoundaryClick?.({ id: row.data.id, type: 'boundary' })}
                />
              );
            }
            return <PlainBoundaryLine key={row.data.id} />;
          }
        })}
      </div>

      {/* Ma column */}
      <div className="flex flex-col" style={{ width: '22%', minWidth: 52 }}>
        {rows.map(row => {
          if (row.type === 'period') {
            return <MaCell key={row.data.id + '-ma'} value={row.data.start_ma} height={calcPeriodHeight(row.data)} />;
          } else {
            const lowerPeriod = PHANEROZOIC_PERIODS.find(p => p.id === row.data.lower);
            return <MaBoundaryCell key={row.data.id + '-ma'} value={lowerPeriod?.end_ma ?? ''} />;
          }
        })}
      </div>
    </div>
  );
}