import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, X as XIcon, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CREATURES } from '@/lib/creaturesData';

function formatMa(start, end) {
  if (start < 1 && end < 1) {
    const sK = Math.round(start * 1000);
    const eK = Math.round(end * 1000);
    return `${sK}.000–${eK}.000 v. Chr.`;
  }
  const fmt = (v) => (v < 1 ? v : Math.round(v));
  return `${fmt(start)}–${fmt(end)} Ma`;
}

function CreatureCard({ creature, index, onSelect }) {
  return (
    <motion.button
      type="button"
      onClick={() => onSelect(creature)}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.03, 0.4) }}
      whileTap={{ scale: 0.97 }}
      className="group relative overflow-hidden rounded-xl border border-border/60 bg-card text-left flex flex-col"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={creature.image}
          alt={creature.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.parentElement.classList.add('flex', 'items-center', 'justify-center');
          }}
        />
        <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
        <span className="absolute bottom-1.5 left-2 text-[10px] font-medium text-white/90 drop-shadow">
          {formatMa(creature.start_ma, creature.end_ma)}
        </span>
      </div>
      <div className="p-2.5">
        <h3 className="text-sm font-semibold text-foreground leading-tight line-clamp-2">
          {creature.name}
        </h3>
        <p className="text-[11px] text-muted-foreground mt-0.5">{creature.periodName}</p>
      </div>
    </motion.button>
  );
}

function CreatureDetail({ creature, onClose }) {
  if (!creature) return null;
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="w-full max-w-lg bg-card rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden"
          initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative h-56 bg-muted">
            <img
              src={creature.image}
              alt={creature.name}
              className="w-full h-full object-cover"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-3 left-4 right-4">
              <h2 className="text-xl font-display font-bold text-white drop-shadow">{creature.name}</h2>
              <p className="text-xs text-white/80 mt-0.5">
                {creature.periodName} · {formatMa(creature.start_ma, creature.end_ma)}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="absolute top-2 right-2 h-8 w-8 bg-black/40 text-white hover:bg-black/60 hover:text-white"
            >
              <XIcon className="h-4 w-4" />
            </Button>
          </div>
          <div className="px-5 py-5">
            <p className="text-sm text-foreground leading-relaxed">{creature.fact}</p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function CreaturesGallery() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState('');
  const [periodFilter, setPeriodFilter] = useState('all');

  const periods = useMemo(() => {
    const set = new Set(CREATURES.map((c) => c.periodName));
    return ['all', ...Array.from(set)];
  }, []);

  const filtered = useMemo(() => {
    return CREATURES.filter((c) => {
      const matchesQuery =
        !query ||
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.fact.toLowerCase().includes(query.toLowerCase());
      const matchesPeriod = periodFilter === 'all' || c.periodName === periodFilter;
      return matchesQuery && matchesPeriod;
    });
  }, [query, periodFilter]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="flex items-center gap-2 px-3 py-2.5">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-base font-display font-bold text-foreground leading-tight">
              Kreaturen-Galerie
            </h1>
            <p className="text-[11px] text-muted-foreground">
              {filtered.length} von {CREATURES.length} Lebewesen
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="px-3 pb-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Lebewesen suchen…"
              className="w-full h-9 pl-9 pr-3 rounded-lg bg-muted text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
        </div>

        {/* Period filter chips */}
        <div className="flex gap-1.5 overflow-x-auto hide-scrollbar px-3 pb-2.5">
          {periods.map((p) => (
            <button
              key={p}
              onClick={() => setPeriodFilter(p)}
              className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                periodFilter === p
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              {p === 'all' ? 'Alle' : p}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto pb-20">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-sm text-muted-foreground">Keine Lebewesen gefunden.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 p-3 max-w-3xl mx-auto">
            {filtered.map((creature, i) => (
              <CreatureCard
                key={creature.id}
                creature={creature}
                index={i}
                onSelect={setSelected}
              />
            ))}
          </div>
        )}
      </div>

      <CreatureDetail creature={selected} onClose={() => setSelected(null)} />
    </div>
  );
}