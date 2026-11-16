// Karteikasten (Leitner-Prinzip) für das Training.
//
// Gespeichert in localStorage "geozeit_cards" als  { [cardId]: { b, w, r, t } }
//   b = Fach 0–4 (0 = neu/falsch, 4 = sitzt)   w = wie oft falsch   r = wie oft richtig
//   t = Zeitstempel der letzten Antwort (für die Cloud-Zusammenführung)
// Richtig → ein Fach weiter. Falsch → zurück in Fach 0.
// Karten in niedrigen Fächern und mit vielen Fehlern werden deutlich häufiger gefragt.

const KEY = 'geozeit_cards';
const MAX_BOX = 4;
const BOX_WEIGHT = [9, 5, 3, 1.5, 0.6];
const NEW_CARD_WEIGHT = 4;

export function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '{}') || {};
  } catch {
    return {};
  }
}

export function recordAnswer(cardId, correct) {
  const all = loadProgress();
  const prev = all[cardId] || { b: 0, w: 0, r: 0 };
  all[cardId] = {
    b: correct ? Math.min(MAX_BOX, prev.b + 1) : 0,
    w: prev.w + (correct ? 0 : 1),
    r: prev.r + (correct ? 1 : 0),
    t: Date.now(),
  };
  localStorage.setItem(KEY, JSON.stringify(all));
  return all[cardId];
}

// Wie dringend sollte eine Karte drankommen?
export function cardWeight(entry) {
  if (!entry) return NEW_CARD_WEIGHT;
  const errorBoost = 1 + Math.min(entry.w, 6) * 0.5; // häufig falsch → häufiger fragen
  return BOX_WEIGHT[entry.b] * errorBoost;
}

// Wählt n Karten per gewichteter Zufallsauswahl (ohne Wiederholung).
export function pickSession(cards, n) {
  const progress = loadProgress();
  const pool = cards.map((c) => ({ card: c, weight: cardWeight(progress[c.id]) }));
  const picked = [];
  while (picked.length < n && pool.length > 0) {
    const total = pool.reduce((s, p) => s + p.weight, 0);
    let roll = Math.random() * total;
    let idx = 0;
    for (; idx < pool.length - 1; idx++) {
      roll -= pool[idx].weight;
      if (roll <= 0) break;
    }
    picked.push(pool[idx].card);
    pool.splice(idx, 1);
  }
  return picked;
}

// Übersicht für die Themenauswahl: neu / in Arbeit / sitzt
export function topicStats(cards) {
  const progress = loadProgress();
  const stats = { total: cards.length, fresh: 0, learning: 0, solid: 0 };
  for (const c of cards) {
    const e = progress[c.id];
    if (!e) stats.fresh++;
    else if (e.b >= 3) stats.solid++;
    else stats.learning++;
  }
  return stats;
}

// Die Karten mit den meisten Fehlern (für die Anzeige "Deine Wackelkandidaten").
export function hardestCards(cards, limit = 5) {
  const progress = loadProgress();
  return cards
    .map((c) => ({ card: c, entry: progress[c.id] }))
    .filter((x) => x.entry && x.entry.w > 0 && x.entry.b < 3)
    .sort((a, b) => b.entry.w - a.entry.w || a.entry.b - b.entry.b)
    .slice(0, limit);
}
