import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Spiegelt den lokal gespeicherten Fortschritt in die Firestore-Datenbank des
// angemeldeten Kontos und wieder zurück. Beim Login werden lokaler und
// Cloud-Stand zusammengeführt, damit nichts verloren geht.
//
// Synchronisierte Daten (Dokument users/{uid}):
//   runs        ← localStorage "geozeit_runs_*"    Spielläufe je Modus (Listen)
//   cards       ← localStorage "geozeit_cards"      Karteikasten des Trainings (Karte → Stand)
//   discovered  ← localStorage "geozeit_discovered" im Zeitstrahl entdeckte Inhalte (Liste von ids)

const RUNS_PREFIX = 'geozeit_runs_';
const CARDS_KEY = 'geozeit_cards';
const DISCOVERED_KEY = 'geozeit_discovered';
const MAX_RUNS = 50;

let currentUid = null;
let pushTimer = null;
let patched = false;

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function readLocalRuns() {
  const runs = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(RUNS_PREFIX)) runs[key] = readJson(key, []);
  }
  return runs;
}

function readLocal() {
  return {
    runs: readLocalRuns(),
    cards: readJson(CARDS_KEY, {}),
    discovered: readJson(DISCOVERED_KEY, []),
  };
}

// Stabile Signatur unabhängig von der Schlüssel-Reihenfolge
function runSignature(run) {
  if (!run || typeof run !== 'object') return JSON.stringify(run);
  return JSON.stringify(Object.keys(run).sort().reduce((o, k) => { o[k] = run[k]; return o; }, {}));
}

// Vereinigt zwei Listen von Spielläufen ohne Duplikate, neueste zuerst.
function mergeRunArrays(a = [], b = []) {
  const seen = new Set();
  const out = [];
  for (const run of [...(a || []), ...(b || [])]) {
    const id = runSignature(run);
    if (!seen.has(id)) {
      seen.add(id);
      out.push(run);
    }
  }
  out.sort((x, y) => (y.date || 0) - (x.date || 0));
  return out.slice(0, MAX_RUNS);
}

// Karteikasten: je Karte gewinnt der zuletzt geänderte Stand (Feld t = Zeitstempel).
function mergeCards(a = {}, b = {}) {
  const out = { ...(a || {}) };
  for (const [id, entry] of Object.entries(b || {})) {
    if (!out[id] || (entry?.t || 0) > (out[id]?.t || 0)) out[id] = entry;
  }
  return out;
}

function mergeLists(a = [], b = []) {
  return Array.from(new Set([...(a || []), ...(b || [])]));
}

async function writeCloud(uid, data, { overwrite = false } = {}) {
  try {
    await setDoc(
      doc(db, 'users', uid),
      { ...data, updatedAt: Date.now() },
      overwrite ? {} : { merge: true }
    );
  } catch (e) {
    console.error('Cloud-Speichern fehlgeschlagen:', e);
  }
}

// Beim Login: Cloud lesen, mit lokal zusammenführen, beides aktualisieren.
export async function pullAndMerge(uid) {
  const local = readLocal();
  let cloud = {};
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    if (snap.exists()) cloud = snap.data() || {};
  } catch (e) {
    console.error('Cloud-Lesen fehlgeschlagen:', e);
  }

  const cloudRuns = cloud.runs || {};
  const runKeys = new Set([...Object.keys(local.runs), ...Object.keys(cloudRuns)]);
  const runs = {};
  for (const key of runKeys) runs[key] = mergeRunArrays(local.runs[key], cloudRuns[key]);

  const merged = {
    runs,
    cards: mergeCards(local.cards, cloud.cards),
    discovered: mergeLists(local.discovered, cloud.discovered),
  };

  try {
    for (const key of Object.keys(runs)) localStorage.setItem(key, JSON.stringify(runs[key]));
    localStorage.setItem(CARDS_KEY, JSON.stringify(merged.cards));
    localStorage.setItem(DISCOVERED_KEY, JSON.stringify(merged.discovered));
  } catch {
    // ignore
  }
  await writeCloud(uid, merged);
  try {
    window.dispatchEvent(new Event('geozeit-synced'));
  } catch {
    // ignore
  }
}

function schedulePush() {
  if (!currentUid) return;
  clearTimeout(pushTimer);
  pushTimer = setTimeout(() => writeCloud(currentUid, readLocal()), 1500);
}

function flushPush() {
  if (!currentUid) return;
  clearTimeout(pushTimer);
  writeCloud(currentUid, readLocal());
}

function isSyncedKey(key) {
  return typeof key === 'string'
    && (key.startsWith(RUNS_PREFIX) || key === CARDS_KEY || key === DISCOVERED_KEY);
}

// Startet die laufende Synchronisation nach dem Login.
export function startSync(uid) {
  currentUid = uid;

  // localStorage.setItem einmalig umschließen, um Fortschritts-Änderungen
  // automatisch in die Cloud zu übernehmen – ohne jede Spielseite anzufassen.
  if (!patched) {
    const original = window.localStorage.setItem.bind(window.localStorage);
    window.localStorage.setItem = function (key, value) {
      original(key, value);
      if (isSyncedKey(key)) schedulePush();
    };
    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') flushPush();
    });
    window.addEventListener('pagehide', flushPush);
    patched = true;
  }
}

export function stopSync() {
  currentUid = null;
  clearTimeout(pushTimer);
}

// Setzt den Fortschritt auch in der Cloud zurück (für "Alle Daten zurücksetzen").
// Überschreibt das Dokument komplett – ein Zusammenführen würde nichts löschen.
export async function clearCloud(uid) {
  clearTimeout(pushTimer);
  await writeCloud(uid, { runs: {}, cards: {}, discovered: [] }, { overwrite: true });
}
