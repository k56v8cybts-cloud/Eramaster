import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowDown, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import GEO_DATA from '@/lib/geoData';
import InfoOverlay from '@/components/geo/InfoOverlay';
import { DISCOVER_ITEMS, DISCOVER_TOPICS } from '@/lib/timelineItems';

// Echter linearer Maßstab: 5 CSS-px pro Million Jahre.
const PX_PER_MA = 5;
const THIN_TILE_PX = 26; // darunter: Mini-Beschriftung
const CHIP_H = 24;       // Höhe einer Entdecken-Marke
const CHIP_GAP = 3;
const DISCOVERED_KEY = 'geozeit_discovered';
const TOPICS_KEY = 'geozeit_discover_topics';

const EONS = GEO_DATA.filter((d) => d.level === 'eon');
const ERAS = GEO_DATA.filter((d) => d.level === 'era');
const PERIODS = GEO_DATA.filter((d) => d.level === 'period');
const TOTAL_MA = Math.max(...EONS.map((e) => e.start_ma)); // 4600
const hasChildren = (u) => GEO_DATA.some((c) => c.parent === u.id);

// Spalten über die volle Breite. Einheiten ohne Untergliederung laufen bis zum rechten Rand durch.
const COLS = { eon: { left: 0, width: 22 }, era: { left: 22, width: 26 }, period: { left: 48, width: 52 } };
const tileBox = (u) => {
  const col = COLS[u.level];
  return { left: `${col.left}%`, width: `${hasChildren(u) || u.level === 'period' ? col.width : 100 - col.left}%` };
};

function getContrast(hex) {
  const c = hex.replace('#', '');
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.55 ? '#1a1a2e' : '#ffffff';
}

// "250 Ma", "1,2 Ga"
function fmtMa(ma) {
  if (ma >= 1000) {
    return `${(ma / 1000).toLocaleString('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} Ga`;
  }
  return `${Math.round(ma)} Ma`;
}

function unitAt(units, ma) {
  return units.find((u) => ma <= u.start_ma && ma >= u.end_ma) || null;
}
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

function readJson(key, fallback) {
  try {
    const v = JSON.parse(localStorage.getItem(key) || 'null');
    return v ?? fallback;
  } catch {
    return fallback;
  }
}

// ---------- Statische Ebene: Kacheln + Lineal (rendert einmal) ----------

function Tile({ item, onSelect }) {
  const top = item.end_ma * PX_PER_MA;
  const height = (item.start_ma - item.end_ma) * PX_PER_MA;
  const thin = height < THIN_TILE_PX;
  const textColor = getContrast(item.color);
  const box = tileBox(item);

  return (
    <div
      className="absolute border-b border-r border-black/10 cursor-pointer"
      style={{ top, height, left: box.left, width: box.width, backgroundColor: item.color }}
      onClick={() => onSelect(item)}
    >
      {/* Beschriftung bleibt beim Scrollen oben kleben, solange man in der Einheit ist */}
      <span
        className={`sticky block text-center font-semibold px-1 break-words ${thin ? 'text-[9px] leading-[12px] top-0' : 'text-[11px] leading-tight top-1.5 pt-1.5'}`}
        style={{ color: textColor, textShadow: '0 1px 2px rgba(0,0,0,0.15)' }}
        lang="de"
      >
        {item.name}
      </span>
    </div>
  );
}

const TilesLayer = React.memo(function TilesLayer({ onSelect, ticks }) {
  return (
    <div className="absolute inset-0">
      {EONS.map((e) => <Tile key={e.id} item={e} onSelect={onSelect} />)}
      {ERAS.map((e) => <Tile key={e.id} item={e} onSelect={onSelect} />)}
      {PERIODS.map((p) => <Tile key={p.id} item={p} onSelect={onSelect} />)}

      {/* Lineal: liegt am rechten Rand über den Kacheln */}
      <div className="absolute top-0 bottom-0 right-0 w-16 pointer-events-none">
        {ticks.map((t) => (
          <div key={t.ma} className="absolute right-0 flex items-center" style={{ top: t.ma * PX_PER_MA }}>
            {t.major && (
              <span className="absolute right-[22px] -translate-y-1/2 rounded bg-black/55 px-1 py-px text-[10px] font-semibold text-white tabular-nums whitespace-nowrap">
                {t.ma === 0 ? 'heute' : fmtMa(t.ma)}
              </span>
            )}
            <span
              className="block -translate-y-1/2"
              style={{
                height: t.major ? 2 : 1,
                width: t.major ? 18 : t.medium ? 11 : 6,
                backgroundColor: 'rgba(255,255,255,0.9)',
                boxShadow: '0 0 0 0.5px rgba(0,0,0,0.45)',
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
});

// ---------- Entdecken-Ebene: Marken, die an ihrer Stelle aufploppen ----------

const DiscoverLayer = React.memo(function DiscoverLayer({ chips, activeId, revealedCount, discovered, onJump }) {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {chips.map((chip, i) => {
        const revealed = i < revealedCount;
        const isActive = chip.item.id === activeId;
        const done = discovered.has(chip.item.id);
        return (
          <button
            key={chip.item.id}
            onClick={() => onJump(chip)}
            className="absolute flex items-center gap-1.5 rounded-full border bg-card pl-1.5 pr-2 text-left shadow-sm pointer-events-auto"
            style={{
              top: chip.y,
              left: '5%',
              maxWidth: '42%',
              height: CHIP_H,
              borderColor: chip.item.color,
              borderWidth: isActive ? 2 : 1,
              transform: revealed ? `scale(${isActive ? 1.06 : 1})` : 'scale(0.4)',
              opacity: revealed ? 1 : 0,
              transformOrigin: 'left center',
              transition: 'transform 0.35s cubic-bezier(.34,1.56,.64,1), opacity 0.2s',
              zIndex: isActive ? 2 : 1,
            }}
          >
            <span
              className="flex-shrink-0 w-3.5 h-3.5 rounded-full flex items-center justify-center"
              style={{ backgroundColor: chip.item.color }}
            >
              {done && <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />}
            </span>
            <span className="truncate text-[11px] font-semibold text-foreground">{chip.item.title}</span>
          </button>
        );
      })}
    </div>
  );
});

function DiscoverCard({ item }) {
  return (
    <motion.div
      key={item.id}
      initial={{ opacity: 0, y: 24, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', damping: 22, stiffness: 340 }}
      className="rounded-2xl border bg-card/95 backdrop-blur-md shadow-xl overflow-hidden"
      style={{ borderColor: item.color }}
    >
      <div className="h-1" style={{ backgroundColor: item.color }} />
      <div className="p-3 flex gap-3">
        {item.image && (
          <img
            src={item.image}
            alt=""
            className="w-16 h-16 rounded-lg object-cover bg-muted flex-shrink-0"
            onError={(ev) => { ev.currentTarget.style.display = 'none'; }}
          />
        )}
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: item.color }}>
            {item.badge} <span className="text-muted-foreground normal-case tracking-normal">· {item.when}</span>
          </p>
          <p className="text-sm font-display font-bold text-foreground leading-tight mt-0.5">{item.title}</p>
          <p className="text-xs text-foreground/90 leading-snug mt-1">{item.text}</p>
        </div>
      </div>
    </motion.div>
  );
}

// Marken untereinander anordnen, ohne dass sie sich überlappen (dichte Stellen rücken leicht nach unten).
function layoutChips(items) {
  let prevBottom = -Infinity;
  return items.map((item) => {
    const y = Math.max(item.ma * PX_PER_MA - CHIP_H / 2, prevBottom + CHIP_GAP);
    prevBottom = y + CHIP_H;
    return { item, y };
  });
}

// ---------- Seite ----------

export default function ScrollTimeline() {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const [selected, setSelected] = useState(null);
  const [ma, setMa] = useState(0);
  const [vh, setVh] = useState(0);
  const [mode, setMode] = useState('discover'); // 'plain' | 'discover'
  const [topics, setTopics] = useState(() => readJson(TOPICS_KEY, ['units', 'bigfive', 'creatures']));
  const [discovered, setDiscovered] = useState(() => new Set(readJson(DISCOVERED_KEY, [])));
  const [revealed, setRevealed] = useState({ chips: null, count: 0 });

  const onSelect = useCallback((item) => setSelected(item), []);

  // Lineal-Striche: alle 10 Ma, 50 mittel, 100 groß + beschriftet
  const ticks = useMemo(() => {
    const arr = [];
    for (let m = 0; m <= TOTAL_MA; m += 10) arr.push({ ma: m, medium: m % 50 === 0, major: m % 100 === 0 });
    return arr;
  }, []);

  const chips = useMemo(
    () => (mode === 'discover' ? layoutChips(DISCOVER_ITEMS.filter((i) => topics.includes(i.topic))) : []),
    [mode, topics]
  );

  // Scroll → aktuelles Alter, per rAF gedrosselt
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

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const update = () => setVh(el.clientHeight);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Welche Marke liegt gerade auf der Leselinie?
  const lineY = ma * PX_PER_MA;
  const activeChip = useMemo(() => {
    let best = null;
    let bestDist = CHIP_H / 2 + CHIP_GAP + 6;
    for (const chip of chips) {
      const d = Math.abs(chip.y + CHIP_H / 2 - lineY);
      if (d < bestDist) { best = chip; bestDist = d; }
      if (chip.y > lineY + CHIP_H * 2) break;
    }
    return best;
  }, [chips, lineY]);
  const activeId = activeChip?.item.id || null;

  // Marken ploppen auf, sobald sie in den unteren Bildschirmbereich kommen (und bleiben dann sichtbar)
  useEffect(() => {
    const limit = lineY + vh * 0.3;
    let n = 0;
    while (n < chips.length && chips[n].y <= limit) n++;
    setRevealed((prev) => {
      if (prev.chips !== chips) return { chips, count: n }; // andere Themenauswahl → neu zählen
      return n > prev.count ? { chips, count: n } : prev;
    });
  }, [chips, lineY, vh]);
  const revealedCount = revealed.chips === chips ? revealed.count : 0;

  // Entdeckte Inhalte merken
  useEffect(() => {
    if (!activeId || discovered.has(activeId)) return;
    const next = new Set(discovered).add(activeId);
    setDiscovered(next);
    try {
      localStorage.setItem(DISCOVERED_KEY, JSON.stringify(Array.from(next)));
    } catch {
      // ignore
    }
  }, [activeId, discovered]);

  const toggleTopic = (id) => {
    setTopics((prev) => {
      const next = prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id];
      try {
        localStorage.setItem(TOPICS_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const scrollToY = useCallback((y) => {
    if (scrollRef.current) scrollRef.current.scrollTo({ top: y, behavior: 'smooth' });
  }, []);
  const onJump = useCallback((chip) => scrollToY(chip.y + CHIP_H / 2), [scrollToY]);

  const eon = unitAt(EONS, ma);
  const era = unitAt(ERAS, ma);
  const period = unitAt(PERIODS, ma);
  const progressUnit = era || eon;
  const pct = progressUnit ? clamp(((ma - progressUnit.end_ma) / (progressUnit.start_ma - progressUnit.end_ma)) * 100, 0, 100) : 0;
  const remaining = progressUnit ? Math.max(0, progressUnit.start_ma - ma) : 0;

  const miniH = vh > 0 ? Math.min(vh * 0.5, 420) : 0;
  const jumpTo = (clientY, rect) => {
    const frac = clamp((clientY - rect.top) / rect.height, 0, 1);
    if (scrollRef.current) scrollRef.current.scrollTop = frac * TOTAL_MA * PX_PER_MA;
  };

  const discoveredHere = chips.filter((c) => discovered.has(c.item.id)).length;

  return (
    <div className="flex flex-col bg-background" style={{ height: '100dvh' }}>
      {/* Kopf (fix) */}
      <div className="shrink-0 z-30 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="flex items-center gap-2 px-2 py-2">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-sm font-semibold text-foreground">Zeitstrahl</h1>
          <div className="ml-auto flex rounded-lg bg-muted p-0.5 text-[11px] font-semibold">
            {[['discover', 'Entdecken'], ['plain', 'Nur Zeitstrahl']].map(([id, label]) => (
              <button
                key={id}
                onClick={() => setMode(id)}
                className={`px-2.5 py-1 rounded-md transition-colors ${mode === id ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Wo bin ich? */}
        <div className="px-3 pb-1.5 flex items-center gap-1.5 text-[11px] min-w-0">
          {[eon, era, period].filter(Boolean).map((u) => (
            <span key={u.id} className="font-semibold px-2 py-0.5 rounded-full truncate" style={{ backgroundColor: u.color + '40' }}>
              {u.name}
            </span>
          ))}
          <span className="ml-auto text-muted-foreground tabular-nums whitespace-nowrap">
            {Math.round(pct)} % · noch {fmtMa(remaining)}
          </span>
        </div>
        <div className="h-1 bg-muted">
          <div className="h-full" style={{ width: `${pct}%`, backgroundColor: progressUnit?.color }} />
        </div>

        {/* Themen im Entdecken-Modus */}
        {mode === 'discover' && (
          <div className="px-3 py-1.5 flex items-center gap-1.5 overflow-x-auto hide-scrollbar">
            {DISCOVER_TOPICS.map((t) => {
              const on = topics.includes(t.id);
              return (
                <button
                  key={t.id}
                  onClick={() => toggleTopic(t.id)}
                  className="flex-shrink-0 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold transition-colors"
                  style={on
                    ? { backgroundColor: t.color, borderColor: t.color, color: '#fff' }
                    : { borderColor: 'hsl(var(--border))', color: 'hsl(var(--muted-foreground))' }}
                >
                  {t.label}
                </button>
              );
            })}
            <span className="ml-auto flex-shrink-0 pl-2 text-[11px] text-muted-foreground tabular-nums">
              {discoveredHere}/{chips.length} entdeckt
            </span>
          </div>
        )}
      </div>

      {/* Scrollfläche über die volle Breite */}
      <div className="relative flex-1 overflow-hidden">
        <div ref={scrollRef} className="absolute inset-0 overflow-y-auto hide-scrollbar">
          {/* halbe Viewporthöhe Abstand oben/unten, damit „heute" und der Anfang der Erde auf die Leselinie passen */}
          <div className="relative" style={{ paddingTop: vh / 2, paddingBottom: vh / 2 }}>
            {/* Einstieg im leeren Bereich über „heute" */}
            <div className="absolute left-0 right-0 flex flex-col items-center text-center px-8" style={{ top: Math.max(24, vh / 2 - 150) }}>
              <p className="text-sm font-semibold text-foreground">Scrolle nach unten in die Vergangenheit</p>
              <p className="text-xs text-muted-foreground mt-1 tabular-nums">
                Maßstab: 1 Bildschirm ≈ {vh ? Math.round(vh / PX_PER_MA) : '…'} Mio. Jahre
              </p>
              <ArrowDown className="h-5 w-5 text-muted-foreground mt-3 animate-bounce" />
            </div>
            <div className="relative" style={{ height: TOTAL_MA * PX_PER_MA }}>
              <TilesLayer onSelect={onSelect} ticks={ticks} />
              {mode === 'discover' && (
                <DiscoverLayer chips={chips} activeId={activeId} revealedCount={revealedCount} discovered={discovered} onJump={onJump} />
              )}
            </div>
          </div>
        </div>

        {/* Leselinie in Bildschirmmitte + Live-Alter */}
        <div className="pointer-events-none absolute left-0 right-0 top-1/2 -translate-y-1/2 flex items-center z-10">
          <div className="h-0.5 flex-1 bg-foreground/80" style={{ boxShadow: '0 0 0 0.5px rgba(255,255,255,0.6)' }} />
          <span className="absolute left-1/2 -translate-x-1/2 -translate-y-[130%] rounded-md bg-foreground px-2 py-0.5 text-[11px] font-bold text-background tabular-nums shadow whitespace-nowrap">
            {ma < 0.5 ? 'heute' : `vor ${fmtMa(ma)}`}
          </span>
        </div>

        {/* Mini-Übersicht der 4,6 Ga, antippbar zum Springen */}
        {miniH > 0 && (
          <div
            className="absolute left-1 top-3 z-10 w-2.5 rounded-full overflow-hidden ring-1 ring-white/80 shadow cursor-pointer"
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
            <div className="absolute left-0 right-0 h-1 -translate-y-1/2 bg-white ring-1 ring-black/70" style={{ top: (ma / TOTAL_MA) * miniH }} />
          </div>
        )}

        {/* Lernkarte: ploppt auf, wenn eine Marke die Leselinie erreicht */}
        {mode === 'discover' && (
          <div className="pointer-events-none absolute left-2 right-2 bottom-2 z-20">
            {activeChip && <DiscoverCard key={activeChip.item.id} item={activeChip.item} />}
          </div>
        )}
      </div>

      {selected && <InfoOverlay item={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
