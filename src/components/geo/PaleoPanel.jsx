import React from 'react';
import { Globe2, Thermometer } from 'lucide-react';
import { PERIOD_MAPS, MAP_CREDIT, TEMPERATURE_CURVE, CURVE_MAX_MA, TODAY_TEMP, avgTemp } from '@/lib/paleoData';

// Kontinentkarte + Temperaturkurve zu einer Periode.
// Zeigt nur, wofür es Daten gibt (Karten ab dem Tonium, Kurve nur Phanerozoikum).

const W = 300;
const H = 84;
const T_MIN = 10;
const T_MAX = 34;
const x = (ma) => W - (ma / CURVE_MAX_MA) * W; // heute rechts
const y = (t) => H - ((t - T_MIN) / (T_MAX - T_MIN)) * H;

const CURVE_PATH = TEMPERATURE_CURVE.map(([ma, t], i) => `${i === 0 ? 'M' : 'L'}${x(ma).toFixed(1)},${y(t).toFixed(1)}`).join(' ');

function TemperatureChart({ unit }) {
  const from = Math.min(unit.start_ma, CURVE_MAX_MA);
  const to = Math.max(unit.end_ma, 0);
  const avg = avgTemp(unit.start_ma, unit.end_ma);
  const diff = avg - TODAY_TEMP;
  const bandX = x(from);
  const bandW = Math.max(2, x(to) - x(from));

  return (
    <div>
      <div className="flex items-center gap-1.5 mb-1.5">
        <Thermometer className="h-3.5 w-3.5 text-muted-foreground" />
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Temperatur</p>
        <p className="ml-auto text-xs text-foreground tabular-nums">
          Ø ca. {avg.toLocaleString('de-DE', { maximumFractionDigits: 0 })} °C
          <span className="text-muted-foreground">
            {' '}({diff >= 0 ? '+' : '−'}{Math.abs(diff).toLocaleString('de-DE', { maximumFractionDigits: 0 })} °C zu heute)
          </span>
        </p>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto rounded-lg bg-muted/50" role="img"
        aria-label={`Temperaturverlauf im Phanerozoikum, ${unit.name} hervorgehoben`}>
        {/* Periode hervorgehoben */}
        <rect x={bandX} y={0} width={bandW} height={H} fill={unit.color} opacity={0.45} />
        {/* heutige Temperatur */}
        <line x1={0} x2={W} y1={y(TODAY_TEMP)} y2={y(TODAY_TEMP)} stroke="currentColor" className="text-muted-foreground" strokeWidth={0.6} strokeDasharray="3 3" />
        <path d={CURVE_PATH} fill="none" stroke="currentColor" className="text-foreground" strokeWidth={1.6} strokeLinejoin="round" />
      </svg>
      <div className="flex justify-between text-[10px] text-muted-foreground mt-1 tabular-nums">
        <span>vor 539 Mio. J.</span>
        <span>gestrichelt = heute ({TODAY_TEMP.toLocaleString('de-DE')} °C)</span>
        <span>heute</span>
      </div>
    </div>
  );
}

export default function PaleoPanel({ unit }) {
  if (!unit || unit.level !== 'period') return null;
  const map = PERIOD_MAPS[unit.id];
  const hasTemp = avgTemp(unit.start_ma, unit.end_ma) !== null;
  if (!map && !hasTemp) return null;

  return (
    <div className="flex flex-col gap-4">
      {map && (
        <div>
          <div className="flex items-center gap-1.5 mb-1.5">
            <Globe2 className="h-3.5 w-3.5 text-muted-foreground" />
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Kontinente</p>
            <p className="ml-auto text-xs text-muted-foreground tabular-nums">vor ca. {map.ma} Mio. Jahren</p>
          </div>
          <div className="rounded-lg overflow-hidden bg-muted/50">
            <img
              src={map.image}
              alt={`Lage der Kontinente vor ca. ${map.ma} Millionen Jahren`}
              loading="lazy"
              className="w-full h-auto block"
              style={{ aspectRatio: '2 / 1' }}
              onError={(ev) => { ev.currentTarget.closest('div').parentElement.style.display = 'none'; }}
            />
          </div>
          <p className="text-[9px] text-muted-foreground/80 mt-1">{MAP_CREDIT}</p>
        </div>
      )}
      {hasTemp && <TemperatureChart unit={unit} />}
      {hasTemp && (
        <p className="text-[9px] text-muted-foreground/80 -mt-2">
          Kurve schematisch, Näherungswerte nach Scotese et al. (2021).
        </p>
      )}
    </div>
  );
}
