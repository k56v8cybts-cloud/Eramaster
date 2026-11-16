// Fragekarten für das Training (Karteikasten). Alle Karten werden aus den
// vorhandenen Inhaltsdaten abgeleitet – es gibt keine zweite Datenquelle.
//
// Karte: { id, topic, question, correct, distractors[], explain, image?, imageCredit? }
//   id ist stabil (z. B. "when:jurassic") – daran hängt der Lernstand in srs.js.

import GEO_DATA from './geoData';
import { LEARN_SUMMARIES, BIG_FIVE_LEARN } from './learnData';
import { CREATURES } from './creaturesData';
import { MILESTONES, getMa } from './milestonesData';
import { BIG_FIVE_ITEMS } from './bigFiveData';

export const TOPICS = [
  { id: 'eons', label: 'Äonen', color: '#0EA5B7' },
  { id: 'eras', label: 'Ären', color: '#2A9D8F' },
  { id: 'periods', label: 'Perioden', color: '#4FA64E' },
  { id: 'creatures', label: 'Lebewesen', color: '#2A9D8F' },
  { id: 'milestones', label: 'Meilensteine', color: '#7C5CD6' },
  { id: 'bigfive', label: 'Massenaussterben', color: '#C1443B' },
];

const LEVEL_TOPIC = { eon: 'eons', era: 'eras', period: 'periods' };
const LEVEL_NOUN = { eon: 'Äon', era: 'Ära', period: 'Periode' };

const byLevel = (level) => GEO_DATA.filter((d) => d.level === level).sort((a, b) => b.start_ma - a.start_ma);
const byId = Object.fromEntries(GEO_DATA.map((d) => [d.id, d]));

function fmtPoint(ma) {
  if (ma >= 1000) return `${(ma / 1000).toLocaleString('de-DE', { maximumFractionDigits: 1 })} Mrd.`;
  return `${Math.round(ma).toLocaleString('de-DE')} Mio.`;
}
function rangeLabel(u) {
  if (u.end_ma === 0) return `vor ${fmtPoint(u.start_ma)} Jahren bis heute`;
  return `vor ${fmtPoint(u.start_ma)} bis ${fmtPoint(u.end_ma)} Jahren`;
}

// Feinste Einheit, die es an einer Stelle gibt (Periode, sonst Ära, sonst Äon)
const FINEST_UNITS = GEO_DATA
  .filter((u) => !GEO_DATA.some((c) => c.parent === u.id))
  .sort((a, b) => b.start_ma - a.start_ma);

function finestUnitAt(ma) {
  return FINEST_UNITS.find((u) => ma <= u.start_ma && ma >= u.end_ma);
}

function unitCards() {
  const cards = [];
  for (const level of ['eon', 'era', 'period']) {
    const units = byLevel(level);
    const topic = LEVEL_TOPIC[level];
    units.forEach((u) => {
      const explain = LEARN_SUMMARIES[u.id];
      // Zeitraum
      cards.push({
        id: `when:${u.id}`,
        topic,
        question: `Welcher Zeitraum gehört zu „${u.name}"?`,
        correct: rangeLabel(u),
        distractors: units.filter((x) => x.id !== u.id).map(rangeLabel),
        explain,
      });
      // Zugehörigkeit zur übergeordneten Einheit
      if (u.parent) {
        const parent = byId[u.parent];
        cards.push({
          id: `parent:${u.id}`,
          topic,
          question: level === 'era'
            ? `Zu welchem Äon gehört die Ära „${u.name}"?`
            : `Zu welcher Ära gehört die Periode „${u.name}"?`,
          correct: parent.name,
          distractors: byLevel(parent.level).filter((x) => x.id !== parent.id).map((x) => x.name),
          explain,
        });
      }
      // Reihenfolge: was kam direkt danach?
      const next = units.find((x) => x.start_ma === u.end_ma);
      if (next) {
        cards.push({
          id: `next:${u.id}`,
          topic,
          question: `Welche${level === 'eon' ? 's' : ''} ${LEVEL_NOUN[level]} folgte direkt auf „${u.name}"?`,
          correct: next.name,
          distractors: units.filter((x) => x.id !== next.id && x.id !== u.id).map((x) => x.name),
          explain: LEARN_SUMMARIES[next.id],
        });
      }
    });
  }
  return cards;
}

function creatureCards() {
  const periodNames = Array.from(new Set(CREATURES.map((c) => c.periodName)));
  return CREATURES.map((c) => ({
    id: `creature:${c.id}`,
    topic: 'creatures',
    question: `In welcher Periode lebte ${c.name}?`,
    correct: c.periodName,
    distractors: periodNames.filter((n) => n !== c.periodName),
    explain: c.fact,
    image: c.image,
    imageCredit: c.imageCredit,
  }));
}

function milestoneCards() {
  return MILESTONES.map((m) => {
    const unit = finestUnitAt(getMa(m));
    if (!unit) return null;
    const idx = FINEST_UNITS.indexOf(unit);
    // Nachbarn in der Zeit als Antwortalternativen (macht die Frage anspruchsvoller)
    const neighbours = FINEST_UNITS
      .map((u, i) => ({ u, dist: Math.abs(i - idx) }))
      .filter((x) => x.dist > 0 && x.dist <= 4)
      .map((x) => x.u.name);
    return {
      id: `ms:${m.id}`,
      topic: 'milestones',
      question: `In welche Zeit fällt: ${m.name}?`,
      correct: unit.name,
      distractors: neighbours,
      explain: m.fact,
    };
  }).filter(Boolean);
}

function bigFiveCards() {
  const when = (e) => `vor ca. ${Math.round(e.ma)} Mio. Jahren`;
  const cards = [];
  BIG_FIVE_ITEMS.forEach((e) => {
    cards.push({
      id: `bf:${e.id}`,
      topic: 'bigfive',
      question: `Wann geschah: ${e.fullName}?`,
      correct: when(e),
      distractors: BIG_FIVE_ITEMS.filter((x) => x.id !== e.id).map(when),
      explain: BIG_FIVE_LEARN[e.id],
    });
    cards.push({
      id: `bfn:${e.id}`,
      topic: 'bigfive',
      question: `Welches war das ${e.number}. der fünf großen Massenaussterben?`,
      correct: e.fullName,
      distractors: BIG_FIVE_ITEMS.filter((x) => x.id !== e.id).map((x) => x.fullName),
      explain: BIG_FIVE_LEARN[e.id],
    });
  });
  return cards;
}

export const ALL_CARDS = [...unitCards(), ...creatureCards(), ...milestoneCards(), ...bigFiveCards()];

export function cardsForTopics(topicIds) {
  return ALL_CARDS.filter((c) => topicIds.includes(c.topic));
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Vier Antwortmöglichkeiten: die richtige plus drei zufällige Alternativen.
export function buildOptions(card) {
  const wrong = shuffle(Array.from(new Set(card.distractors)).filter((d) => d !== card.correct)).slice(0, 3);
  return shuffle([card.correct, ...wrong]);
}
