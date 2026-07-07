import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
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

export default function BigFiveKnowledge() {
  const navigate = useNavigate();

  const rows = [];
  PHANEROZOIC_PERIODS.forEach(period => {
    const extinction = EXTINCTION_BY_ID[period.id] || null;
    rows.push({ type: 'period', data: period, extinction });
    const boundary = BOUNDARIES.find(b => b.lower === period.id);
    if (boundary) {
      const bExtinction = EXTINCTION_BY_ID[boundary.id] || null;
      rows.push({ type: 'boundary', data: boundary, extinction: bExtinction });
    }
  });

  return (
    <div className="flex flex-col bg-background" style={{ height: '100dvh' }}>
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="flex items-center gap-3 px-3 py-2.5">
          <Button variant="ghost" size="icon" onClick={() => navigate('/mode/bigfive')} className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-sm font-semibold text-foreground">The Big Five – Zeitstrahl</h1>
        </div>
        <div className="flex border-t border-border bg-muted/50">
          <div className="flex-1 text-[10px] font-semibold text-muted-foreground text-center py-1.5">Periode / Ereignis</div>
          <div className="text-[10px] font-semibold text-muted-foreground text-center py-1.5" style={{ width: '22%', minWidth: 52 }}>Ma</div>
        </div>
      </div>

      <div className="flex-1 overflow-auto hide-scrollbar">
        <div className="flex w-full">
          {/* Period + boundary column */}
          <div className="flex flex-col flex-1">
            {rows.map(row => {
              if (row.type === 'period') {
                const h = calcPeriodHeight(row.data);
                const isExtinction = !!row.extinction;
                const bg = isExtinction ? '#7f1d1d' : row.data.color;
                const textColor = isExtinction ? '#fca5a5' : getContrastColor(row.data.color);
                return (
                  <div
                    key={row.data.id}
                    className="flex flex-col items-center justify-center border-b border-black/10 select-none px-1"
                    style={{ height: `${h}px`, backgroundColor: bg, color: textColor }}
                  >
                    <span className="text-xs font-semibold text-center break-words"
                      style={{ textShadow: '0 1px 2px rgba(0,0,0,0.2)', lineHeight: 1.25 }} lang="de">
                      {row.data.name}
                    </span>
                    {isExtinction && (
                      <span className="text-[9px] font-medium text-center mt-0.5 opacity-90" style={{ lineHeight: 1.2 }}>
                        {row.extinction.fullName}
                      </span>
                    )}
                  </div>
                );
              } else {
                const isExtinction = !!row.extinction;
                return (
                  <div
                    key={row.data.id}
                    className="flex items-center justify-between px-2 border-y select-none"
                    style={{
                      height: `${BOUNDARY_HEIGHT}px`,
                      backgroundColor: isExtinction ? '#7f1d1d' : '#1e293b',
                      borderColor: isExtinction ? '#991b1b' : '#334155',
                      color: isExtinction ? '#fca5a5' : '#475569',
                    }}
                  >
                    <span className="text-[9px] font-bold tracking-wide pointer-events-none truncate">
                      {isExtinction ? row.extinction.fullName : ''}
                    </span>
                  </div>
                );
              }
            })}
          </div>

          {/* Ma column */}
          <div className="flex flex-col" style={{ width: '22%', minWidth: 52 }}>
            {rows.map(row => {
              if (row.type === 'period') {
                return (
                  <div key={row.data.id + '-ma'} className="flex items-start justify-center border-b border-border/30 bg-muted/30"
                    style={{ height: `${calcPeriodHeight(row.data)}px` }}>
                    <span className="text-[10px] font-medium text-muted-foreground mt-1">{row.data.start_ma}</span>
                  </div>
                );
              } else {
                const lowerPeriod = PHANEROZOIC_PERIODS.find(p => p.id === row.data.lower);
                return (
                  <div key={row.data.id + '-ma'} className="flex items-center justify-center bg-muted/50"
                    style={{ height: `${BOUNDARY_HEIGHT}px` }}>
                    <span className="text-[9px] font-semibold text-muted-foreground">{lowerPeriod?.end_ma ?? ''}</span>
                  </div>
                );
              }
            })}
          </div>
        </div>
      </div>
    </div>
  );
}