import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Thermometer, Leaf, Sparkles, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getGameItems, getById } from '@/lib/geoUtils';
import { LEARN_SUMMARIES, BIG_FIVE_LEARN } from '@/lib/learnData';
import { CREATURES } from '@/lib/creaturesData';
import { MILESTONES, CATEGORY_COLORS, CATEGORY_LABELS, getMa, isRange } from '@/lib/milestonesData';
import { BIG_FIVE_ITEMS } from '@/lib/bigFiveData';

// Anzeigename des Modus im Kopf
const MODE_TITLE = {
  eons: 'Äonen', eras: 'Ären', periods: 'Perioden',
  creatures: 'Lebewesen', milestones: 'Meilensteine', bigfive: 'Big Five',
};
// Badge-Text auf der Karte für Epochen-Modi
const EPOCH_BADGE = { eons: 'Äon', eras: 'Ära', periods: 'Periode' };

function fmt(ma) {
  if (ma >= 1000) return `${(ma / 1000).toLocaleString('de-DE', { maximumFractionDigits: 1 })} Mrd. Jahren`;
  return `${Math.round(ma).toLocaleString('de-DE')} Mio. Jahren`;
}
function formatRange(start, end) {
  return `vor ${fmt(start)} bis ${end === 0 ? 'heute' : 'vor ' + fmt(end)}`;
}
function maLabel(m) {
  if (isRange(m)) return `vor ${fmt(m.ma_from)} bis vor ${fmt(m.ma_to)}`;
  return `vor ${fmt(m.ma)}`;
}

const INFO_ROWS = [
  { key: 'climate', label: 'Klima', icon: Thermometer },
  { key: 'life', label: 'Leben', icon: Leaf },
  { key: 'events', label: 'Ereignisse', icon: Sparkles },
];

// Baut eine einheitliche Kartenliste je Modus.
// Karte: { id, badge, title, color, rangeLabel, body, info?, image? }
function buildCards(modeId) {
  if (modeId === 'eons' || modeId === 'eras' || modeId === 'periods') {
    return getGameItems(modeId)
      .slice()
      .sort((a, b) => b.start_ma - a.start_ma)
      .map((e) => ({
        id: e.id,
        badge: EPOCH_BADGE[modeId],
        title: e.name,
        color: e.color,
        rangeLabel: formatRange(e.start_ma, e.end_ma),
        body: LEARN_SUMMARIES[e.id],
        info: e.info,
      }));
  }
  if (modeId === 'creatures') {
    return CREATURES
      .slice()
      .sort((a, b) => b.start_ma - a.start_ma)
      .map((c) => ({
        id: c.id,
        badge: c.periodName,
        title: c.name,
        color: getById(c.period)?.color || '#15803d',
        rangeLabel: formatRange(c.start_ma, c.end_ma),
        body: c.fact,
        image: c.image,
      }));
  }
  if (modeId === 'milestones') {
    return MILESTONES
      .slice()
      .sort((a, b) => getMa(b) - getMa(a))
      .map((m) => ({
        id: m.id,
        badge: CATEGORY_LABELS[m.category] || 'Meilenstein',
        title: m.name,
        color: CATEGORY_COLORS[m.category] || '#7c3aed',
        rangeLabel: maLabel(m),
        body: m.fact,
      }));
  }
  if (modeId === 'bigfive') {
    return BIG_FIVE_ITEMS
      .slice()
      .sort((a, b) => b.ma - a.ma)
      .map((e) => ({
        id: e.id,
        badge: e.label,
        title: e.fullName,
        color: '#C1443B',
        rangeLabel: `vor ${fmt(e.ma)}`,
        body: BIG_FIVE_LEARN[e.id],
      }));
  }
  return [];
}

export default function LearnMode() {
  const { modeId } = useParams();
  const navigate = useNavigate();

  const [cards] = useState(() => buildCards(modeId));
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);

  if (!MODE_TITLE[modeId] || cards.length === 0) {
    navigate('/');
    return null;
  }

  const entry = cards[index];
  const total = cards.length;
  const isLast = index === total - 1;

  const go = (delta) => {
    const next = index + delta;
    if (next < 0) return;
    if (next >= total) {
      navigate(`/mode/${modeId}`);
      return;
    }
    setDir(delta);
    setIndex(next);
  };

  return (
    <div className="flex flex-col bg-background" style={{ height: '100dvh' }}>
      {/* Header */}
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="flex items-center gap-3 px-3 py-2.5 max-w-md mx-auto">
          <Button variant="ghost" size="icon" onClick={() => navigate(`/mode/${modeId}`)} className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-sm font-semibold text-foreground">{MODE_TITLE[modeId]} · Lernen</h1>
          <span className="ml-auto text-xs font-medium text-muted-foreground tabular-nums">{index + 1} / {total}</span>
        </div>
        {/* Fortschrittsbalken */}
        <div className="h-1 bg-muted">
          <motion.div
            className="h-full"
            style={{ backgroundColor: entry.color }}
            animate={{ width: `${((index + 1) / total) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Karte */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-md mx-auto px-4 py-5">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={entry.id}
              custom={dir}
              initial={{ opacity: 0, x: dir * 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: dir * -40 }}
              transition={{ duration: 0.22 }}
              className="rounded-3xl border border-border bg-card overflow-hidden shadow-sm"
            >
              {/* Farbkopf */}
              <div className="h-24 flex items-end p-4" style={{ background: `linear-gradient(135deg, ${entry.color} 0%, ${entry.color}bb 100%)` }}>
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-white/85"
                    style={{ textShadow: '0 1px 2px rgba(0,0,0,0.25)' }}>
                    {entry.badge}
                  </span>
                  <h2 className="text-2xl font-display font-bold text-white leading-tight"
                    style={{ textShadow: '0 1px 3px rgba(0,0,0,0.3)' }}>
                    {entry.title}
                  </h2>
                </div>
              </div>

              <div className="p-5">
                <p className="text-xs font-medium text-muted-foreground mb-3">{entry.rangeLabel}</p>

                {/* Bild (nur Lebewesen) */}
                {entry.image && (
                  <div className="mb-4 rounded-xl overflow-hidden bg-muted flex items-center justify-center" style={{ minHeight: '8rem' }}>
                    <img
                      src={entry.image}
                      alt={entry.title}
                      loading="lazy"
                      className="w-full max-h-56 object-contain"
                      onError={(ev) => { ev.currentTarget.parentElement.style.display = 'none'; }}
                    />
                  </div>
                )}

                {entry.body && <p className="text-[15px] text-foreground leading-relaxed mb-5">{entry.body}</p>}

                {entry.info && (
                  <div className="flex flex-col gap-3">
                    {INFO_ROWS.map(({ key, label, icon: Icon }) => (
                      entry.info?.[key] ? (
                        <div key={key} className="flex gap-3">
                          <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center mt-0.5"
                            style={{ backgroundColor: entry.color + '1A' }}>
                            <Icon className="h-4 w-4" style={{ color: entry.color }} />
                          </div>
                          <div className="flex-1">
                            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
                            <p className="text-sm text-foreground leading-snug">{entry.info[key]}</p>
                          </div>
                        </div>
                      ) : null
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      <div className="shrink-0 border-t border-border bg-background/95 backdrop-blur-md">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => go(-1)}
            disabled={index === 0}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Zurück
          </Button>
          <Button onClick={() => go(1)} className="flex-1 gap-2">
            {isLast ? (<><Check className="h-4 w-4" /> Fertig</>) : (<>Weiter <ArrowRight className="h-4 w-4" /></>)}
          </Button>
        </div>
      </div>
    </div>
  );
}
