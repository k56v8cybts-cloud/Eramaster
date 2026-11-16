// Inhalte, die im Scroll-Zeitstrahl ("Entdecken") an ihrer Stelle auftauchen.
// Alles wird aus den vorhandenen Daten abgeleitet.
//
// Eintrag: { id, topic, ma, badge, title, text, color, when, image?, imageCredit? }
//   ma = Stelle auf dem Zeitstrahl (Mio. Jahre vor heute), an der der Eintrag erscheint.

import GEO_DATA from './geoData';
import { LEARN_SUMMARIES, BIG_FIVE_LEARN } from './learnData';
import { CREATURES } from './creaturesData';
import { MILESTONES, CATEGORY_COLORS, CATEGORY_LABELS, getMa, isRange } from './milestonesData';
import { BIG_FIVE_ITEMS } from './bigFiveData';

export const DISCOVER_TOPICS = [
  { id: 'units', label: 'Epochen', color: '#0E8CA8' },
  { id: 'bigfive', label: 'Aussterben', color: '#C1443B' },
  { id: 'creatures', label: 'Lebewesen', color: '#2A9D8F' },
  { id: 'milestones', label: 'Meilensteine', color: '#7C5CD6' },
];

const LEVEL_BADGE = { eon: 'Äon', era: 'Ära', period: 'Periode' };
// Kleine Versätze, damit Äon → Ära → Periode an einer gemeinsamen Grenze in dieser Reihenfolge erscheinen
const LEVEL_OFFSET = { eon: 0.2, era: 0.4, period: 0.6 };

function fmt(ma) {
  if (ma >= 1000) return `${(ma / 1000).toLocaleString('de-DE', { maximumFractionDigits: 2 })} Mrd. Jahren`;
  if (ma < 1) return `${Math.round(ma * 1000).toLocaleString('de-DE')}.000 Jahren`;
  return `${Math.round(ma).toLocaleString('de-DE')} Mio. Jahren`;
}
const range = (start, end) => `vor ${fmt(start)} bis ${end === 0 ? 'heute' : 'vor ' + fmt(end)}`;

function build() {
  const items = [];

  // Beim Scrollen in die Tiefe betritt man jede Einheit an ihrem jüngeren Ende.
  GEO_DATA.forEach((u) => {
    items.push({
      id: `unit:${u.id}`,
      topic: 'units',
      ma: u.end_ma + LEVEL_OFFSET[u.level],
      badge: LEVEL_BADGE[u.level],
      title: u.name,
      text: LEARN_SUMMARIES[u.id],
      color: u.color,
      when: range(u.start_ma, u.end_ma),
    });
  });

  BIG_FIVE_ITEMS.forEach((e) => {
    items.push({
      id: `bigfive:${e.id}`,
      topic: 'bigfive',
      ma: e.ma,
      badge: e.label,
      title: e.fullName,
      text: BIG_FIVE_LEARN[e.id],
      color: '#C1443B',
      when: `vor ${fmt(e.ma)}`,
    });
  });

  CREATURES.forEach((c) => {
    items.push({
      id: `creature:${c.id}`,
      topic: 'creatures',
      ma: (c.start_ma + c.end_ma) / 2,
      badge: 'Lebewesen',
      title: c.name,
      text: c.fact,
      color: '#2A9D8F',
      when: range(c.start_ma, c.end_ma),
      image: c.image,
      imageCredit: c.imageCredit,
    });
  });

  MILESTONES.forEach((m) => {
    items.push({
      id: `milestone:${m.id}`,
      topic: 'milestones',
      ma: getMa(m),
      badge: CATEGORY_LABELS[m.category] || 'Meilenstein',
      title: m.name,
      text: m.fact,
      color: CATEGORY_COLORS[m.category] || '#7C5CD6',
      when: isRange(m) ? `vor ${fmt(m.ma_from)} bis vor ${fmt(m.ma_to)}` : `vor ${fmt(m.ma)}`,
    });
  });

  return items.sort((a, b) => a.ma - b.ma);
}

export const DISCOVER_ITEMS = build();
