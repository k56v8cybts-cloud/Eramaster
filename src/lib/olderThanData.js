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

// Minimum temporal difference as fraction of total scale (4600 Ma)
// Items closer than this are considered "too similar" and avoided
const MIN_DIFF_FRACTION = 0.04; // ~184 Ma
const TOTAL_MA = 4600;

export function pickPair(usedIds = new Set()) {
  // Filter out items that have been used if possible
  let pool = ALL_ITEMS.filter(i => !usedIds.has(i.id));
  if (pool.length < 2) pool = ALL_ITEMS;

  // Try up to 50 times to find a well-separated pair
  for (let attempt = 0; attempt < 50; attempt++) {
    const i1 = Math.floor(Math.random() * pool.length);
    let i2 = Math.floor(Math.random() * (pool.length - 1));
    if (i2 >= i1) i2++;

    const a = pool[i1];
    const b = pool[i2];
    const diff = Math.abs(a.start_ma - b.start_ma) / TOTAL_MA;

    if (diff >= MIN_DIFF_FRACTION) {
      return [a, b];
    }
  }

  // Fallback: just pick any two different items
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return [shuffled[0], shuffled[1]];
}

export function isOlder(item) {
  // Higher Ma = older
  return item.start_ma;
}