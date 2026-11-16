// Paläogeografie & Klima je Periode.
//
// PERIOD_MAPS: je Periode eine Kontinentkarte (Mollweide-Projektion) aus Wikimedia Commons.
//   Quelle: Scotese, Vérard, Burgener, Elling & Kocsis (2025), PALEOMAP – Lizenz CC BY 4.0.
//   ma = Zeitpunkt, den die Karte zeigt (nicht die ganze Periode).
// TEMPERATURE_CURVE: globale Mitteltemperatur im Phanerozoikum als SCHEMATISCHE Kurve.
//   Näherungswerte, angelehnt an Scotese et al. (2021), "Phanerozoic paleotemperatures".
//   Für Zeiten vor dem Kambrium gibt es keine vergleichbar belastbare Kurve → bewusst leer.

export const MAP_CREDIT = 'Karte: Scotese et al., PALEOMAP · CC BY 4.0 · Wikimedia Commons';

export const PERIOD_MAPS = {
  quaternary: { ma: 5, image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f1/Mollweide_Paleographic_Map_of_Earth%2C_5_Ma_%28Zanclean_Age%29.png/500px-Mollweide_Paleographic_Map_of_Earth%2C_5_Ma_%28Zanclean_Age%29.png', source: 'https://commons.wikimedia.org/wiki/File:Mollweide_Paleographic_Map_of_Earth,_5_Ma_(Zanclean_Age).png' },
  neogene: { ma: 15, image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bc/Mollweide_Paleographic_Map_of_Earth%2C_15_Ma_%28Langhian_Age%29.png/500px-Mollweide_Paleographic_Map_of_Earth%2C_15_Ma_%28Langhian_Age%29.png', source: 'https://commons.wikimedia.org/wiki/File:Mollweide_Paleographic_Map_of_Earth,_15_Ma_(Langhian_Age).png' },
  paleogene: { ma: 45, image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/62/Mollweide_Paleographic_Map_of_Earth%2C_45_Ma_%28Lutetian_Age%29.png/500px-Mollweide_Paleographic_Map_of_Earth%2C_45_Ma_%28Lutetian_Age%29.png', source: 'https://commons.wikimedia.org/wiki/File:Mollweide_Paleographic_Map_of_Earth,_45_Ma_(Lutetian_Age).png' },
  cretaceous: { ma: 105, image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f4/Mollweide_Paleographic_Map_of_Earth%2C_105_Ma_%28Albian_Age%29.png/500px-Mollweide_Paleographic_Map_of_Earth%2C_105_Ma_%28Albian_Age%29.png', source: 'https://commons.wikimedia.org/wiki/File:Mollweide_Paleographic_Map_of_Earth,_105_Ma_(Albian_Age).png' },
  jurassic: { ma: 170, image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/df/Mollweide_Paleographic_Map_of_Earth%2C_170_Ma_%28Bajocian_Age%29.png/500px-Mollweide_Paleographic_Map_of_Earth%2C_170_Ma_%28Bajocian_Age%29.png', source: 'https://commons.wikimedia.org/wiki/File:Mollweide_Paleographic_Map_of_Earth,_170_Ma_(Bajocian_Age).png' },
  triassic: { ma: 225, image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/76/Mollweide_Paleographic_Map_of_Earth%2C_225_Ma_%28Norian_Age%29.png/500px-Mollweide_Paleographic_Map_of_Earth%2C_225_Ma_%28Norian_Age%29.png', source: 'https://commons.wikimedia.org/wiki/File:Mollweide_Paleographic_Map_of_Earth,_225_Ma_(Norian_Age).png' },
  permian: { ma: 275, image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/ad/Mollweide_Paleographic_Map_of_Earth%2C_275_Ma_%28Kungurian_Age%29.png/500px-Mollweide_Paleographic_Map_of_Earth%2C_275_Ma_%28Kungurian_Age%29.png', source: 'https://commons.wikimedia.org/wiki/File:Mollweide_Paleographic_Map_of_Earth,_275_Ma_(Kungurian_Age).png' },
  carboniferous: { ma: 330, image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/00/Mollweide_Paleographic_Map_of_Earth%2C_330_Ma_%28Serpukhovian_Age%29.png/500px-Mollweide_Paleographic_Map_of_Earth%2C_330_Ma_%28Serpukhovian_Age%29.png', source: 'https://commons.wikimedia.org/wiki/File:Mollweide_Paleographic_Map_of_Earth,_330_Ma_(Serpukhovian_Age).png' },
  devonian: { ma: 390, image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e0/Mollweide_Paleographic_Map_of_Earth%2C_390_Ma_%28Eifelian_Age%29.png/500px-Mollweide_Paleographic_Map_of_Earth%2C_390_Ma_%28Eifelian_Age%29.png', source: 'https://commons.wikimedia.org/wiki/File:Mollweide_Paleographic_Map_of_Earth,_390_Ma_(Eifelian_Age).png' },
  silurian: { ma: 430, image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b3/Mollweide_Paleographic_Map_of_Earth%2C_430_Ma_%28Homerian_Age%29.png/500px-Mollweide_Paleographic_Map_of_Earth%2C_430_Ma_%28Homerian_Age%29.png', source: 'https://commons.wikimedia.org/wiki/File:Mollweide_Paleographic_Map_of_Earth,_430_Ma_(Homerian_Age).png' },
  ordovician: { ma: 465, image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6c/Mollweide_Paleographic_Map_of_Earth%2C_465_Ma_%28Darriwilian_Age%29.png/500px-Mollweide_Paleographic_Map_of_Earth%2C_465_Ma_%28Darriwilian_Age%29.png', source: 'https://commons.wikimedia.org/wiki/File:Mollweide_Paleographic_Map_of_Earth,_465_Ma_(Darriwilian_Age).png' },
  cambrian: { ma: 510, image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/25/Mollweide_Paleographic_Map_of_Earth%2C_510_Ma.png/500px-Mollweide_Paleographic_Map_of_Earth%2C_510_Ma.png', source: 'https://commons.wikimedia.org/wiki/File:Mollweide_Paleographic_Map_of_Earth,_510_Ma.png' },
  ediacaran: { ma: 600, image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2e/Mollweide_Paleographic_Map_of_Earth%2C_600_Ma_%28Ediacaran_Period%29.png/500px-Mollweide_Paleographic_Map_of_Earth%2C_600_Ma_%28Ediacaran_Period%29.png', source: 'https://commons.wikimedia.org/wiki/File:Mollweide_Paleographic_Map_of_Earth,_600_Ma_(Ediacaran_Period).png' },
  cryogenian: { ma: 690, image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4c/Mollweide_Paleographic_Map_of_Earth%2C_690_Ma_%28Cryogenian_Period%29.png/500px-Mollweide_Paleographic_Map_of_Earth%2C_690_Ma_%28Cryogenian_Period%29.png', source: 'https://commons.wikimedia.org/wiki/File:Mollweide_Paleographic_Map_of_Earth,_690_Ma_(Cryogenian_Period).png' },
  tonian: { ma: 750, image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e4/Mollweide_Paleographic_Map_of_Earth%2C_750_Ma_%28Tonian_Period%29.png/500px-Mollweide_Paleographic_Map_of_Earth%2C_750_Ma_%28Tonian_Period%29.png', source: 'https://commons.wikimedia.org/wiki/File:Mollweide_Paleographic_Map_of_Earth,_750_Ma_(Tonian_Period).png' },
};

export const TODAY_TEMP = 14.5;

// [Alter in Ma, globale Mitteltemperatur in °C]
export const TEMPERATURE_CURVE = [
  [0, 14.5], [3, 16], [15, 18.5], [23, 18], [34, 19], [50, 27], [56, 27.5], [66, 21],
  [90, 28], [120, 23], [145, 20.5], [165, 21], [183, 24], [201, 25], [230, 26],
  [250, 32], [260, 22], [280, 15], [300, 12.5], [320, 14], [340, 19], [359, 20],
  [372, 24], [400, 23], [419, 22], [440, 17], [445, 16.5], [460, 22], [485, 26],
  [500, 25.5], [520, 23], [539, 21],
];

export const CURVE_MAX_MA = 539;

// Linear interpolierte Temperatur zu einem Alter (nur Phanerozoikum), sonst null.
export function tempAt(ma) {
  if (ma < 0 || ma > CURVE_MAX_MA) return null;
  for (let i = 1; i < TEMPERATURE_CURVE.length; i++) {
    const [m0, t0] = TEMPERATURE_CURVE[i - 1];
    const [m1, t1] = TEMPERATURE_CURVE[i];
    if (ma <= m1) return t0 + ((ma - m0) / (m1 - m0)) * (t1 - t0);
  }
  return TEMPERATURE_CURVE[TEMPERATURE_CURVE.length - 1][1];
}

// Durchschnittstemperatur über einen Zeitraum (grobe Mittelung in 2-Ma-Schritten).
export function avgTemp(startMa, endMa) {
  const from = Math.max(0, endMa);
  const to = Math.min(CURVE_MAX_MA, startMa);
  if (to <= from) return null;
  let sum = 0;
  let n = 0;
  for (let m = from; m <= to; m += 2) {
    sum += tempAt(m);
    n++;
  }
  return n ? sum / n : null;
}
