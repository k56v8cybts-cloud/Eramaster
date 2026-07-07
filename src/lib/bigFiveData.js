// The Big Five mass extinctions data
// Periods of the Phanerozoic eon displayed in order (oldest first = bottom to top visually)

export const PHANEROZOIC_PERIODS = [
  { id: 'cambrian',      name: 'Kambrium',    start_ma: 538.8, end_ma: 485.4, color: '#7FA056' },
  { id: 'ordovician',    name: 'Ordovizium',  start_ma: 485.4, end_ma: 443.8, color: '#009270' },
  { id: 'silurian',      name: 'Silur',       start_ma: 443.8, end_ma: 419.2, color: '#B3E1B6' },
  { id: 'devonian',      name: 'Devon',       start_ma: 419.2, end_ma: 358.9, color: '#CB8C37' },
  { id: 'carboniferous', name: 'Karbon',      start_ma: 358.9, end_ma: 298.9, color: '#67A599' },
  { id: 'permian',       name: 'Perm',        start_ma: 298.9, end_ma: 251.9, color: '#F04028' },
  { id: 'triassic',      name: 'Trias',       start_ma: 251.9, end_ma: 201.4, color: '#812B92' },
  { id: 'jurassic',      name: 'Jura',        start_ma: 201.4, end_ma: 145,   color: '#34B2C9' },
  { id: 'cretaceous',    name: 'Kreide',      start_ma: 145,   end_ma: 66,    color: '#7FC64E' },
  { id: 'paleogene',     name: 'Paläogen',    start_ma: 66,    end_ma: 23.03, color: '#FD9A52' },
  { id: 'neogene',       name: 'Neogen',      start_ma: 23.03, end_ma: 2.58,  color: '#FFE619' },
  { id: 'quaternary',    name: 'Quartär',     start_ma: 2.58,  end_ma: 0,     color: '#F9F97F' },
];

// Boundaries between periods. 
// "extinction" marks it as a Big Five event (shown highlighted in knowledge view).
// Devon is special: the Kellwasser event is INSIDE Devon, so the period tile itself is the target.
export const BOUNDARIES = [
  { id: 'b_cambrian_ordovician',   label: 'Grenze Kambrium/Ordovizium', lower: 'cambrian',      upper: 'ordovician'    },
  { id: 'b_ordovician_silurian',   label: 'Grenze Ordovizium/Silur',    lower: 'ordovician',    upper: 'silurian'      },
  { id: 'b_silurian_devonian',     label: 'Grenze Silur/Devon',         lower: 'silurian',      upper: 'devonian'      },
  { id: 'b_devonian_carboniferous',label: 'Grenze Devon/Karbon',        lower: 'devonian',      upper: 'carboniferous' },
  { id: 'b_carboniferous_permian', label: 'Grenze Karbon/Perm',         lower: 'carboniferous', upper: 'permian'       },
  { id: 'b_permian_triassic',      label: 'Grenze Perm/Trias',          lower: 'permian',       upper: 'triassic'      },
  { id: 'b_triassic_jurassic',     label: 'Grenze Trias/Jura',          lower: 'triassic',      upper: 'jurassic'      },
  { id: 'b_jurassic_cretaceous',   label: 'Grenze Jura/Kreide',         lower: 'jurassic',      upper: 'cretaceous'    },
  { id: 'b_cretaceous_paleogene',  label: 'Grenze Kreide/Paläogen',     lower: 'cretaceous',    upper: 'paleogene'     },
  { id: 'b_paleogene_neogene',     label: 'Grenze Paläogen/Neogen',     lower: 'paleogene',     upper: 'neogene'       },
  { id: 'b_neogene_quaternary',    label: 'Grenze Neogen/Quartär',      lower: 'neogene',       upper: 'quaternary'    },
];

// The five mass extinction game items.
// For ordovician, permian, triassic, cretaceous: the target is a BOUNDARY tile (type: 'boundary').
// For devonian (Kellwasser): the target is the PERIOD tile itself (type: 'period').
export const BIG_FIVE_ITEMS = [
  {
    id: 'b_ordovician_silurian',
    type: 'boundary',
    number: 1,
    label: '1. Massenaussterben',
    fullName: 'Ordovizisches Massenaussterben',
    ma: 443.8,
  },
  {
    id: 'devonian',
    type: 'period',
    number: 2,
    label: '2. Massenaussterben',
    fullName: 'Kellwasser-Ereignis (Oberdevon)',
    ma: 372,
  },
  {
    id: 'b_permian_triassic',
    type: 'boundary',
    number: 3,
    label: '3. Massenaussterben',
    fullName: 'Perm-Trias-Massenaussterben',
    ma: 251.9,
  },
  {
    id: 'b_triassic_jurassic',
    type: 'boundary',
    number: 4,
    label: '4. Massenaussterben',
    fullName: 'Trias-Jura-Massenaussterben',
    ma: 201.4,
  },
  {
    id: 'b_cretaceous_paleogene',
    type: 'boundary',
    number: 5,
    label: '5. Massenaussterben',
    fullName: 'Kreide-Paläogen-Massenaussterben (K-Pg)',
    ma: 66,
  },
];

// Quick lookup maps
export const EXTINCTION_BY_ID = Object.fromEntries(BIG_FIVE_ITEMS.map(e => [e.id, e]));

export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const PERIOD_MIN_HEIGHT = 44;
const PERIOD_SCALE = 0.06;

export function calcPeriodHeight(period) {
  const duration = period.start_ma - period.end_ma;
  return Math.max(PERIOD_MIN_HEIGHT, PERIOD_MIN_HEIGHT + duration * PERIOD_SCALE);
}

export const BOUNDARY_HEIGHT = 20; // px