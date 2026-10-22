import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Spiegelt den lokal gespeicherten Spielfortschritt (localStorage-Keys mit
// Präfix "geozeit_runs_") in die Firestore-Datenbank des angemeldeten Kontos
// und wieder zurück. Beim ersten Login werden lokaler und Cloud-Stand
// zusammengeführt, damit nichts verloren geht.

const RUNS_PREFIX = 'geozeit_runs_';
const MAX_RUNS = 50;

let currentUid = null;
let pushTimer = null;
let patched = false;

function readLocalRuns() {
  const runs = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(RUNS_PREFIX)) {
      try {
        runs[key] = JSON.parse(localStorage.getItem(key) || '[]');
      } catch {
        runs[key] = [];
      }
    }
  }
  return runs;
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

async function writeCloud(uid, runs) {
  try {
    await setDoc(
      doc(db, 'users', uid),
      { runs, updatedAt: Date.now() },
      { merge: true }
    );
  } catch (e) {
    console.error('Cloud-Speichern fehlgeschlagen:', e);
  }
}

// Beim Login: Cloud lesen, mit lokal zusammenführen, beides aktualisieren.
export async function pullAndMerge(uid) {
  const local = readLocalRuns();
  let cloud = {};
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    if (snap.exists()) cloud = snap.data().runs || {};
  } catch (e) {
    console.error('Cloud-Lesen fehlgeschlagen:', e);
  }

  const keys = new Set([...Object.keys(local), ...Object.keys(cloud)]);
  const merged = {};
  for (const key of keys) {
    merged[key] = mergeRunArrays(local[key], cloud[key]);
  }

  for (const key of Object.keys(merged)) {
    try {
      localStorage.setItem(key, JSON.stringify(merged[key]));
    } catch {
      // ignore
    }
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
  pushTimer = setTimeout(() => writeCloud(currentUid, readLocalRuns()), 1500);
}

function flushPush() {
  if (!currentUid) return;
  clearTimeout(pushTimer);
  writeCloud(currentUid, readLocalRuns());
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
      if (typeof key === 'string' && key.startsWith(RUNS_PREFIX)) {
        schedulePush();
      }
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
export async function clearCloud(uid) {
  await writeCloud(uid, {});
}
