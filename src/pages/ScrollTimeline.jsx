import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import GEO_DATA from '@/lib/geoData';
import InfoOverlay from '@/components/geo/InfoOverlay';

// Echter linearer Maßstab: 5 CSS-px pro Million Jahre.
const PX_PER_MA = 5;
const THIN_TILE_PX = 26; // darunter: seitliches Label mit Verbindungslinie

const EONS = GEO_DATA.filter((d) => d.level === 'eon');
const ERAS = GEO_DATA.filter((d) => d.level === 'era');
const PERIODS = GEO_DATA.filter((d) => d.level === 'period');
const TOTAL_MA = Math.max(...EONS.map((e) => e.start_ma)); // 4600

function getContrast(hex) {
  const c = hex.replace('#', '');
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.55 ? '#1a1a2e' : '#ffffff';
}

// "250 Ma", "1,2 Ga", "0" → als Lineal-/Readout-Beschriftung
function fmtMa(ma) {
  if (ma >= 1000) {
    const ga = ma / 1000;
    return `${ga.toLocaleString('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} Ga`;
  }
  return `${Math.round(ma)} Ma`;
}

function unitAt(units, ma) {
  return units.find((u) => ma <= u.start_ma && ma >= u.end_ma) || null;
}
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

// --- Statische Kachel-Ebene (rendert einmal, kein Re-Render beim Scrollen) ---

function Tile({ item, left, width, onSelect }) {
  const top = item.end_ma * PX_PER_MA;
  const height = (item.start_ma - item.end_ma) * PX_PER_MA;
  const thin = height < THIN_TILE_PX;
  const textColor = getContrast(item.color);

  return (
    <>
      <div
        className="absolute flex items-center justify-center border-b border-black/10 cursor-pointer overflow-hidden"
        style={{ top, height, left, width, backgroundColor: item.color }}
        onClick={() => onSelect(item)}
      >
        {!thin && (
          <span className="text-[11px] font-semibold text-center px-1 break-words leading-tight"
            style={{ color: textColor, textShadow: '0 1px 2px rgba(0,0,0,0.15)' }} lang="de">
            {item.name}
          </span>
        )}
      </div>
      {thin && (
        // Seitliches Label mit Verbindungslinie für sehr dünne Kacheln (z. B. Quartär)
        <div className="absolute flex items-center pointer-events-none" style={{ top: top + height / 2 - 9, left }}>
          <span className="block h-px bg-foreground/40" style={{ width: width + 6 }} />
          <span className="ml-1 whitespace-nowrap rounded-md border border-border bg-card px-1.5 py-0.5 text-[10px] font-semibold text-foreground pointer-events-auto cursor-pointer shadow-sm"
            onClick={() => onSelect(item)}>
            {item.name}
          </span>
        </div>
      )}
    </>
  );
}

const TilesLayer = React.memo(function TilesLayer({ onSelect, ticks, cols }) {
  return (
    <div className="absolute inset-0">
      {/* Äon */}
      {EONS.map((e) => <Tile key={e.id} item={e} left={cols.eon.left} width={cols.eon.width} onSelect={onSelect} />)}
      {/* Ära */}
      {ERAS.map((e) => <Tile key={e.id} item={e} left={cols.era.left} width={cols.era.width} onSelect={onSelect} />)}
      {/* Periode */}
      {PERIODS.map((p) => <Tile key={p.id} item={p} left={cols.period.left} width={cols.period.width} onSelect={onSelect} />)}

      {/* Lineal rechts */}
      <div className="absolute top-0 bottom-0" style={{ left: cols.ruler.left, width: cols.ruler.width }}>
        {ticks.map((t) => (
          <div key={t.ma} className="absolute flex items-center" style={{ top: t.ma * PX_PER_MA, right: 0 }}>
            {t.major && (
              <span className="absolute right-full mr-1 -translate-y-1/2 text-[10px] font-medium text-muted-foreground tabular-nums whitespace-nowrap">
                {t.ma === 0 ? 'heute' : fmtMa(t.ma)}
              </span>
            )}
            <span
              className="block bg-muted-foreground"
              style={{ height: t.major ? 1.5 : 1, width: t.major ? 18 : t.medium ? 11 : 6, opacity: t.major ? 0.9 : t.medium ? 0.6 : 0.35 }}
            />
          </div>
        ))}
      </div>
    </div>
  );
});

// --- Hauptseite ---

export default function ScrollTimeline() {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const [selected, setSelected] = useState(null);
  const [ma, setMa] = useState(0);
  const [vh, setVh] = useState(0);

  const onSelect = useCallback((item) => setSelected(item), []);

  // Lineal-Striche (einmal berechnet): alle 10 Ma, 50 medium, 100 major+Label
  const ticks = useMemo(() => {
    const arr = [];
    for (let m = 0; m <= TOTAL_MA; m += 10) {
      arr.push({ ma: m, medium: m % 50 === 0, major: m % 100 === 0 });
    }
    return arr;
  }, []);

  // Spaltenpositionen (Prozent) – Mini-Map-Gutter links, Lineal rechts
  const cols = useMemo(() => ({
    eon: { left: '6%', width: '19%' },
    era: { left: '25%', width: '21%' },
    period: { left: '46%', width: '29%' },
    ruler: { left: '76%', width: '24%' },
  }), []);

  // Scroll → aktuelles Alter, per rAF gedrosselt (kein State-Spam)
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setMa(clamp(el.scrollTop / PX_PER_MA, 0, TOTAL_MA));
        ticking = false;
      });
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  // Viewport-Höhe der Scrollfläche beobachten
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const update = () => setVh(el.clientHeight);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const eon = unitAt(EONS, ma);
  const era = unitAt(ERAS, ma);
  const period = unitAt(PERIODS, ma);

  const progress = (u) => {
    if (!u) return null;
    const span = u.start_ma - u.end_ma;
    const pct = clamp(((ma - u.end_ma) / span) * 100, 0, 100);
    const remaining = Math.max(0, u.start_ma - ma);
    return { pct, remaining };
  };
  const eraP = progress(era);

  const miniH = vh > 0 ? Math.min(vh * 0.62, 520) : 0;
  const jumpTo = (clientY, rect) => {
    const frac = clamp((clientY - rect.top) / rect.height, 0, 1);
    const targetMa = frac * TOTAL_MA;
    if (scrollRef.current) scrollRef.current.scrollTop = targetMa * PX_PER_MA;
  };

  return (
    <div className="flex flex-col bg-background" style={{ height: '100dvh' }}>
      {/* Kopf + Positionsanzeige (fix, scrollt nicht) */}
      <div className="shrink-0 z-30 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="flex items-center gap-3 px-3 py-2">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-sm font-semibold text-foreground">Zeitstrahl · Maßstab</h1>
          <span className="ml-auto text-[10px] text-muted-foreground tabular-nums">
            1 Screen ≈ {vh ? Math.round(vh / PX_PER_MA) : '…'} Mio. J.
          </span>
        </div>

        {/* Positionsanzeige: Äon / Ära (mit Fortschritt) / Periode */}
        <div className="px-3 pb-2 flex items-center gap-2 flex-wrap text-[11px]">
          {eon && (
            <span className="font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: eon.color + '33', color: getContrast(eon.color) === '#ffffff' ? eon.color : eon.color }}>
              {eon.name}
            </span>
          )}
          {era && (
            <span className="font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: era.color + '33' }}>
              {era.name}
            </span>
          )}
          {period && (
            <span className="font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: period.color + '33' }}>
              {period.name}
            </span>
          )}
          {eraP && era && (
            <span className="ml-auto text-muted-foreground tabular-nums">
              {Math.round(eraP.pct)} % · noch {Math.round(eraP.remaining)} Ma
            </span>
          )}
        </div>
        {eraP && (
          <div className="h-1 bg-muted">
            <div className="h-full transition-[width] duration-75" style={{ width: `${eraP.pct}%`, backgroundColor: era.color }} />
          </div>
        )}
      </div>

      {/* Scrollfläche */}
      <div className="relative flex-1 overflow-hidden">
        <div ref={scrollRef} className="absolute inset-0 overflow-y-auto hide-scrollbar">
          {/* Abstand oben/unten = halbe Viewporthöhe, damit Rand-Epochen in die Mitte scrollbar sind */}
          <div style={{ paddingTop: vh / 2, paddingBottom: vh / 2 }}>
            <div className="relative" style={{ height: TOTAL_MA * PX_PER_MA }}>
              <TilesLayer onSelect={onSelect} ticks={ticks} cols={cols} />
            </div>
          </div>
        </div>

        {/* Leselinie in Bildschirmmitte + Live-Alter */}
        <div className="pointer-events-none absolute left-0 right-0 top-1/2 -translate-y-1/2 flex items-center">
          <div className="h-px flex-1 bg-primary/70" />
          <span className="mx-2 rounded-md bg-primary px-2 py-0.5 text-[11px] font-bold text-primary-foreground tabular-nums shadow">
            {ma < 0.5 ? 'heute' : `vor ${fmtMa(ma)}`}
          </span>
          <div className="h-px flex-1 bg-primary/70" />
        </div>

        {/* Mini-Übersicht der 4,6 Ga (links), antippbar zum Springen */}
        {miniH > 0 && (
          <div
            className="absolute left-1.5 top-1/2 -translate-y-1/2 w-2.5 rounded-full overflow-hidden ring-1 ring-border cursor-pointer"
            style={{ height: miniH }}
            onClick={(e) => jumpTo(e.clientY, e.currentTarget.getBoundingClientRect())}
          >
            {EONS.map((e) => (
              <div
                key={e.id}
                className="absolute left-0 right-0"
                style={{ top: (e.end_ma / TOTAL_MA) * miniH, height: ((e.start_ma - e.end_ma) / TOTAL_MA) * miniH, backgroundColor: e.color }}
              />
            ))}
            {/* Sichtfenster */}
            <div
              className="absolute left-0 right-0 bg-foreground/15 border-y border-foreground/50"
              style={{
                top: clamp(((ma - (vh / 2) / PX_PER_MA) / TOTAL_MA) * miniH, 0, miniH),
                height: clamp(((vh / PX_PER_MA) / TOTAL_MA) * miniH, 3, miniH),
              }}
            />
            {/* Du bist hier */}
            <div className="absolute left-0 right-0 h-0.5 bg-primary" style={{ top: (ma / TOTAL_MA) * miniH }} />
          </div>
        )}
      </div>

      {selected && <InfoOverlay item={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
