import GEO_DATA from './geoData';

// Get items by level
export function getByLevel(level) {
  return GEO_DATA.filter(d => d.level === level);
}

// Get children of a parent
export function getChildren(parentId) {
  return GEO_DATA.filter(d => d.parent === parentId);
}

// Get item by id
export function getById(id) {
  return GEO_DATA.find(d => d.id === id);
}

// Calculate tile height using hybrid scaling
// minHeight ensures even short periods are visible
// Additional height proportional to duration
export function calcHeight(item) {
  const duration = item.start_ma - item.end_ma;
  const minHeight = 44;
  const scaleFactor = 0.06; // px per Ma
  return Math.max(minHeight, minHeight + duration * scaleFactor);
}

// Build structured timeline for rendering
export function buildTimeline() {
  const eons = getByLevel('eon').sort((a, b) => a.end_ma - b.end_ma);

  return eons.map(eon => {
    const eras = getChildren(eon.id).sort((a, b) => a.end_ma - b.end_ma);
    return {
      ...eon,
      eras: eras.map(era => {
        const periods = getChildren(era.id).sort((a, b) => a.end_ma - b.end_ma);
        return {
          ...era,
          periods
        };
      })
    };
  });
}

// Get all items relevant for a game mode
export function getGameItems(mode) {
  switch (mode) {
    case 'eons':
      return getByLevel('eon');
    case 'eras':
      return getByLevel('era');
    case 'periods':
      return getByLevel('period');
    case 'combined':
      return [...getByLevel('era'), ...getByLevel('period')];
    case 'expert':
      return [...getByLevel('eon'), ...getByLevel('era'), ...getByLevel('period')];
    default:
      return [];
  }
}

// Shuffle array
export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Determine if a tile is clickable in a given game mode
export function isClickable(item, mode) {
  if (mode === 'eons') return item.level === 'eon';
  if (mode === 'eras') return item.level === 'era';
  if (mode === 'periods') return item.level === 'period';
  if (mode === 'combined') return item.level === 'era' || item.level === 'period';
  if (mode === 'expert') return item.level === 'eon' || item.level === 'era' || item.level === 'period';
  return false;
}

// Format Ma value
export function formatMa(ma) {
  if (ma === 0) return 'heute';
  if (ma >= 1000) return `${(ma / 1000).toFixed(1)} Ga`;
  return `${ma} Ma`;
}