// Unified dataset for "Was ist älter?" mode
// Pulls from all time-based content in the app

import GEO_DATA from './geoData.js';
import { CREATURES } from './creaturesData.js';
import { MILESTONES, getMa } from './milestonesData.js';
import { BIG_FIVE_ITEMS } from './bigFiveData.js';

function buildItems() {
  const items = [];

  // --- Geological units (eons, eras, periods) ---
  GEO_DATA.forEach(entry => {
    items.push({
      id: `geo_${entry.id}`,
      name: entry.name,
      start_ma: entry.start_ma,
      end_ma: entry.end_ma,
      type: entry.level === 'eon' ? 'Äon' : entry.level === 'era' ? 'Ära' : 'Periode',
      color: entry.color,
      image: null,
    });
  });

  // --- Prehistoric creatures ---
  CREATURES.forEach(c => {
    items.push({
      id: `creature_${c.id}`,
      name: c.name,
      start_ma: c.start_ma,
      end_ma: c.end_ma,
      type: 'Lebewesen',
      color: '#15803d',
      image: c.image,
    });
  });

  // --- Evolutionary milestones ---
  MILESTONES.forEach(m => {
    const ma = getMa(m);
    items.push({
      id: `milestone_${m.id}`,
      name: m.name,
      start_ma: ma,
      end_ma: m.ma_to ?? ma,
      type: 'Ereignis',
      color: '#7c3aed',
      image: null,
    });
  });

  // --- Big Five mass extinctions ---
  BIG_FIVE_ITEMS.forEach(e => {
    items.push({
      id: `bigfive_${e.id}`,
      name: e.fullName,
      start_ma: e.ma,
      end_ma: e.ma,
      type: 'Massenaussterben',
      color: '#7f1d1d',
      image: null,
    });
  });

  return items;
}

export const ALL_ITEMS = buildItems();

// Temporal distance window between the two shown items (in Ma):
// not too close (ambiguous) and not more than 2000 Ma apart.
const MIN_DIFF_MA = 150;
const MAX_DIFF_MA = 2000;

export function pickPair(usedIds = new Set()) {
  // Filter out items that have been used if possible
  let pool = ALL_ITEMS.filter(i => !usedIds.has(i.id));
  if (pool.length < 2) pool = ALL_ITEMS;

  // Try to find a pair within the desired distance window
  for (let attempt = 0; attempt < 80; attempt++) {
    const i1 = Math.floor(Math.random() * pool.length);
    let i2 = Math.floor(Math.random() * (pool.length - 1));
    if (i2 >= i1) i2++;

    const a = pool[i1];
    const b = pool[i2];
    const diff = Math.abs(a.start_ma - b.start_ma);

    if (diff >= MIN_DIFF_MA && diff <= MAX_DIFF_MA) {
      return [a, b];
    }
  }

  // Fallback: closest-to-window pair from a random sample
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  const a = shuffled[0];
  const candidates = shuffled
    .slice(1)
    .map((b) => ({ b, diff: Math.abs(a.start_ma - b.start_ma) }))
    .filter((c) => c.diff <= MAX_DIFF_MA);
  if (candidates.length > 0) {
    candidates.sort((x, y) => y.diff - x.diff);
    return [a, candidates[0].b];
  }
  return [shuffled[0], shuffled[1]];
}

export function isOlder(item) {
  // Higher Ma = older
  return item.start_ma;
}