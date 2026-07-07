# Äramaster

Ein Lernspiel rund um die geologische Erdgeschichte und Evolution.
Läuft komplett im Browser – **kein Server, kein Login, kein Abo nötig.**
Alle Spielstände werden lokal im Browser gespeichert.

## Lokal starten (zum Weiterentwickeln)

Voraussetzung: Node.js installiert (https://nodejs.org).

```
npm install      # einmalig, installiert Bausteine
npm run dev      # startet die App unter http://localhost:5173
```

## Veröffentlichen

```
npm run build    # erzeugt den Ordner "dist" – das ist die fertige Website
```

Den Inhalt des `dist`-Ordners kann man bei jedem statischen Web-Hoster
hochladen (z. B. Netlify, Vercel, GitHub Pages).
