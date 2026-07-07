// Evolutionary milestones data
// ma: single point in Ma (millions of years ago)
// ma_from / ma_to: for range events (displayed as bars)
// category: thematic grouping for color

export const MILESTONES = [
  // Origin of Life
  { id: 'luca', name: 'LUCA', shortName: 'LUCA', ma_from: 3800, ma_to: 3500, category: 'origin', fact: 'Der Letzte Universale Gemeinsame Vorfahre – der hypothetische Ausgangspunkt allen Lebens auf der Erde.' },
  { id: 'prokaryoten', name: 'Erste Prokaryoten', shortName: 'Prokaryoten', ma: 3500, category: 'origin', fact: 'Einfachste Zellen ohne Zellkern – die ersten nachweisbaren Lebensformen der Erde.' },
  { id: 'zellmembranen', name: 'Erste Zellmembranen', shortName: 'Zellmembranen', ma: 3600, category: 'origin', fact: 'Lipiddoppelschichten ermöglichten erstmals die Abgrenzung eines Innenraums – eine Grundvoraussetzung für Leben.' },

  // Photosynthesis
  { id: 'anoxy_photo', name: 'Anoxygenische Photosynthese', shortName: 'Anox. Photosynthese', ma: 3500, category: 'photosynthesis', fact: 'Die erste Form der Photosynthese – ohne Sauerstoffproduktion, genutzt von frühen Bakterien.' },
  { id: 'oxy_photo', name: 'Oxygenische Photosynthese', shortName: 'Oxy. Photosynthese', ma: 2700, category: 'photosynthesis', fact: 'Cyanobakterien begannen Sauerstoff zu produzieren – ein revolutionärer Schritt für die Erdatmosphäre.' },
  { id: 'goe', name: 'Great Oxidation Event', shortName: 'Great Oxidation Event', ma: 2400, category: 'photosynthesis', fact: 'Sauerstoff reicherte sich erstmals in der Atmosphäre an – für viele anaerobe Organismen war es eine Katastrophe.' },

  // Eukaryotes
  { id: 'eukaryoten', name: 'Erste Eukaryoten', shortName: 'Eukaryoten', ma_from: 2100, ma_to: 1800, category: 'eukaryotes', fact: 'Zellen mit echtem Zellkern entstanden – ein entscheidender Schritt zu komplexerem Leben.' },
  { id: 'mitochondrien', name: 'Mitochondrien-Endosymbiose', shortName: 'Mitochondrien', ma: 2000, category: 'eukaryotes', fact: 'Ein Alphaproteobakterium wurde in eine Wirtszelle aufgenommen – heute sind Mitochondrien unsere Energiekraftwerke.' },
  { id: 'chloroplasten', name: 'Chloroplasten-Endosymbiose', shortName: 'Chloroplasten', ma: 1500, category: 'eukaryotes', fact: 'Ein Cyanobakterium wurde zum Chloroplast – der Ursprung der Photosynthese in Pflanzenzellen.' },

  // Reproduction
  { id: 'sex_repro', name: 'Sexuelle Fortpflanzung', shortName: 'Sex. Fortpflanzung', ma: 1200, category: 'reproduction', fact: 'Genetische Rekombination ermöglichte schnellere Evolution und Anpassung an veränderte Umweltbedingungen.' },
  { id: 'meiose', name: 'Meiose', shortName: 'Meiose', ma: 1200, category: 'reproduction', fact: 'Zellteilung zur Bildung von Gameten – Grundlage der sexuellen Fortpflanzung.' },
  { id: 'genregulation', name: 'Komplexe Genregulation', shortName: 'Genregulation', ma: 1000, category: 'reproduction', fact: 'Komplexe Kontrollmechanismen der Genexpression ermöglichten differenzierte Zelltypen.' },

  // Multicellularity
  { id: 'vielzeller', name: 'Erste Vielzeller', shortName: 'Vielzeller', ma_from: 1000, ma_to: 800, category: 'multicellular', fact: 'Zellen begannen zusammenzuarbeiten – der Beginn der Komplexität des makroskopischen Lebens.' },
  { id: 'zelltypen', name: 'Differenzierte Zelltypen', shortName: 'Zelltypen', ma: 800, category: 'multicellular', fact: 'Spezialisierung von Zellen für unterschiedliche Funktionen – ein Merkmal komplexer Organismen.' },
  { id: 'erste_tiere', name: 'Erste Tiere', shortName: 'Erste Tiere', ma_from: 700, ma_to: 600, category: 'multicellular', fact: 'Die frühesten tierischen Organismen entstanden – wahrscheinlich schwammartige Lebewesen.' },

  // Nervous systems
  { id: 'photorezeptoren', name: 'Photorezeptoren', shortName: 'Photorezeptoren', ma_from: 600, ma_to: 550, category: 'nerves', fact: 'Lichtempfindliche Zellen entstanden – der erste Schritt zum Sehen.' },
  { id: 'nervensysteme', name: 'Nervensysteme', shortName: 'Nervensysteme', ma_from: 600, ma_to: 550, category: 'nerves', fact: 'Erste Nervennetze ermöglichten koordinierte Reaktionen auf Umweltreize.' },
  { id: 'fortbewegung', name: 'Aktive Fortbewegung', shortName: 'Fortbewegung', ma_from: 550, ma_to: 540, category: 'nerves', fact: 'Gerichtete, aktive Bewegung entstand – Tiere konnten gezielt Nahrung suchen.' },

  // Cambrian
  { id: 'augen', name: 'Komplexe Augen', shortName: 'Komplexe Augen', ma: 540, category: 'cambrian', fact: 'Facettenaugen und Linsenaugen entstanden – sehen wurde zum evolutionären Wettbewerbsvorteil.' },
  { id: 'kambrexp', name: 'Kambrische Explosion', shortName: 'Kambrische Explosion', ma: 541, category: 'cambrian', fact: 'In kurzer Zeit entstanden fast alle bekannten Tierstämme – einer der bedeutendsten Einschnitte der Evolutionsgeschichte.' },
  { id: 'bilaterie', name: 'Bilaterale Symmetrie', shortName: 'Bilat. Symmetrie', ma: 540, category: 'cambrian', fact: 'Körper mit Vorder- und Rückseite entstanden – Grundlage aller komplexen Tiere einschließlich des Menschen.' },
  { id: 'exoskelette', name: 'Exoskelette', shortName: 'Exoskelette', ma: 540, category: 'cambrian', fact: 'Außenskelette aus Chitin oder Kalk boten Schutz und Ansatzpunkte für Muskeln.' },

  // Vertebrates
  { id: 'wirbeltiere', name: 'Erste Wirbeltiere', shortName: 'Wirbeltiere', ma: 520, category: 'vertebrates', fact: 'Tiere mit Wirbelsäule entstanden – die Grundlage für alle Fische, Amphibien, Reptilien, Vögel und Säuger.' },
  { id: 'flossen', name: 'Paarige Flossen', shortName: 'Paarige Flossen', ma_from: 450, ma_to: 430, category: 'vertebrates', fact: 'Paarige Flossen verbesserten Steuerung und Manövrierfähigkeit – Vorläufer der Gliedmaßen.' },
  { id: 'kiefer', name: 'Kiefer', shortName: 'Kiefer', ma: 430, category: 'vertebrates', fact: 'Kiefer entstanden aus umgewandelten Kiemenbögen – und revolutionierten die Ernährungsstrategien.' },

  // Plants on land
  { id: 'landpflanzen', name: 'Landpflanzen', shortName: 'Landpflanzen', ma: 470, category: 'plants', fact: 'Algen besiedelten das Land – und veränderten das Klima, den Boden und die Atmosphäre grundlegend.' },
  { id: 'cuticula', name: 'Cuticula & Spaltöffnungen', shortName: 'Cuticula/Stomata', ma: 470, category: 'plants', fact: 'Wasserschutzschicht und steuerbare Poren ermöglichten das Leben an Land ohne Austrocknung.' },
  { id: 'gefaesspflanzen', name: 'Gefäßpflanzen', shortName: 'Gefäßpflanzen', ma: 430, category: 'plants', fact: 'Leitgewebe für Wasser und Nährstoffe ermöglichten größere und komplexere Pflanzen.' },

  // Land animals
  { id: 'landgang_arthro', name: 'Landgang Arthropoden', shortName: 'Landgang Arthrop.', ma_from: 450, ma_to: 430, category: 'land', fact: 'Erste Gliederfüßer besiedelten das Land – Vorläufer der heutigen Insekten und Spinnen.' },
  { id: 'erste_boeden', name: 'Erste Böden', shortName: 'Erste Böden', ma_from: 450, ma_to: 400, category: 'land', fact: 'Verwitterung durch Pflanzen und Tiere bildete erste echte Böden – ein Ökosystem entstand.' },
  { id: 'tetrapoden', name: 'Tetrapoden', shortName: 'Tetrapoden', ma: 370, category: 'land', fact: 'Vierbeiner entstanden – der Übergang vom Wasser zum Land war vollzogen.' },
  { id: 'gliedmassen', name: 'Gliedmaßen mit Zehen', shortName: 'Zehen', ma: 370, category: 'land', fact: 'Finger und Zehen entstanden aus Flossen – ursprünglich für aquatisches Leben, dann für die Fortbewegung an Land.' },
  { id: 'lungenatmung', name: 'Lungenatmung', shortName: 'Lungenatmung', ma_from: 419, ma_to: 359, category: 'land', fact: 'Lungen entwickelten sich aus Schwimmblasen – und ermöglichten das Überleben außerhalb des Wassers.' },

  // Amniotes
  { id: 'amniot_ei', name: 'Amniotisches Ei', shortName: 'Amniotisches Ei', ma: 320, category: 'amniotes', fact: 'Das wasserundurchlässige Ei ermöglichte Fortpflanzung vollständig an Land – ein Befreiungsschlag vom Wasser.' },
  { id: 'innere_bef', name: 'Innere Befruchtung', shortName: 'Inn. Befruchtung', ma: 320, category: 'amniotes', fact: 'Innere Befruchtung sicherte die Entwicklung des Embryos auch in trockener Umgebung.' },

  // Forests
  { id: 'erste_waelder', name: 'Erste Wälder', shortName: 'Erste Wälder', ma_from: 385, ma_to: 360, category: 'forests', fact: 'Baumgroße Pflanzen formten erste Wälder – sie veränderten das Klima und entzogen der Atmosphäre CO₂.' },
  { id: 'kohlesuempfe', name: 'Große Kohlesümpfe', shortName: 'Kohlesümpfe', ma_from: 358, ma_to: 299, category: 'forests', fact: 'Karbonische Sumpfwälder bildeten die Grundlage der heutigen Kohlevorkommen.' },

  // Insects & Seed plants
  { id: 'insekten_flug', name: 'Flug bei Insekten', shortName: 'Insektenflug', ma: 320, category: 'insects', fact: 'Insekten waren die ersten fliegenden Tiere – Flügel eröffneten völlig neue ökologische Nischen.' },
  { id: 'samenpflanzen', name: 'Samenpflanzen', shortName: 'Samenpflanzen', ma: 320, category: 'plants', fact: 'Samen ermöglichten die Ausbreitung über große Distanzen und Überdauern ungünstiger Bedingungen.' },
  { id: 'nacktsamer', name: 'Nacktsamer (Gymnospermen)', shortName: 'Nacktsamer', ma: 300, category: 'plants', fact: 'Nadelbäume und Verwandte – dominierten die Landvegetation durch das Mesozoikum.' },

  // Endothermy & Flight
  { id: 'endothermie', name: 'Endothermie', shortName: 'Endothermie', ma_from: 250, ma_to: 200, category: 'mammals', fact: 'Warmblütigkeit erlaubte Aktivität unabhängig von der Außentemperatur – ein massiver Wettbewerbsvorteil.' },
  { id: 'pterosaurier_flug', name: 'Flug bei Wirbeltieren (Pterosaurier)', shortName: 'Pterosaurier-Flug', ma: 230, category: 'reptiles', fact: 'Pterosaurier waren die ersten fliegenden Wirbeltiere – mit Spannweiten von 30 cm bis 12 m.' },

  // Birds
  { id: 'federn', name: 'Federn', shortName: 'Federn', ma_from: 170, ma_to: 150, category: 'birds', fact: 'Federn entstanden zunächst für Thermoregulation oder Balz – erst später für den Flug.' },
  { id: 'vogelflug', name: 'Flug bei Vögeln', shortName: 'Vogelflug', ma: 150, category: 'birds', fact: 'Archaeopteryx und Verwandte entwickelten aktiven Vogelflug – aus theropoden Dinosauriern wurden Vögel.' },

  // Flowering plants
  { id: 'bluetenpflanzen', name: 'Blütenpflanzen', shortName: 'Blütenpflanzen', ma: 140, category: 'plants', fact: 'Angiospermen entstanden und dominierten rasch die Landvegetation – heute über 300.000 Arten.' },
  { id: 'bestaeubung', name: 'Bestäuber-Koevolution', shortName: 'Bestäuber-Koevol.', ma_from: 130, ma_to: 100, category: 'plants', fact: 'Blüten und Insekten evolvierten gemeinsam – eine der erfolgreichsten Symbiosen der Evolution.' },

  // Mammals
  { id: 'erste_saeuger', name: 'Erste Säuger', shortName: 'Erste Säuger', ma: 220, category: 'mammals', fact: 'Kleine, nachtaktive Säugetiere entstanden – zunächst im Schatten der Dinosaurier.' },
  { id: 'saeuger_radiation', name: 'Säuger-Radiation', shortName: 'Säuger-Radiation', ma: 66, category: 'mammals', fact: 'Nach dem K-Pg-Massenaussterben besetzten Säugetiere alle frei gewordenen Nischen.' },
  { id: 'vogelgruppen', name: 'Moderne Vogelgruppen', shortName: 'Mod. Vogelgruppen', ma_from: 66, ma_to: 50, category: 'birds', fact: 'Nach dem Ende der Dinosaurier diversifizierten sich die modernen Vogelgruppen explosionsartig.' },
];

export const CATEGORY_COLORS = {
  origin:        '#7c3aed',
  photosynthesis:'#16a34a',
  eukaryotes:    '#0891b2',
  reproduction:  '#db2777',
  multicellular: '#ea580c',
  nerves:        '#d97706',
  cambrian:      '#65a30d',
  vertebrates:   '#2563eb',
  plants:        '#15803d',
  land:          '#b45309',
  amniotes:      '#7c2d12',
  forests:       '#166534',
  insects:       '#854d0e',
  reptiles:      '#4338ca',
  birds:         '#0369a1',
  mammals:       '#9f1239',
};

export const CATEGORY_LABELS = {
  origin:        'Ursprung des Lebens',
  photosynthesis:'Photosynthese',
  eukaryotes:    'Eukaryoten',
  reproduction:  'Fortpflanzung',
  multicellular: 'Vielzelligkeit',
  nerves:        'Sinnesorgane & Nerven',
  cambrian:      'Kambrische Explosion',
  vertebrates:   'Wirbeltiere',
  plants:        'Pflanzen',
  land:          'Landleben',
  amniotes:      'Amnioten',
  forests:       'Wälder',
  insects:       'Insekten',
  reptiles:      'Reptilien',
  birds:         'Vögel',
  mammals:       'Säugetiere',
};

export function getMa(m) {
  // Returns the "center" Ma of a milestone for calculations
  if (m.ma !== undefined) return m.ma;
  return (m.ma_from + m.ma_to) / 2;
}

export function isRange(m) {
  return m.ma_from !== undefined;
}

export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Score based on how close the guess is (Ma)
// Max score per milestone: 100
export function calcScore(guessedMa, milestone) {
  const realMa = getMa(milestone);
  const diff = Math.abs(guessedMa - realMa);
  const total = 4600;
  // Tolerance bands
  if (diff <= 10) return 100;
  if (diff <= 50) return 80;
  if (diff <= 100) return 60;
  if (diff <= 200) return 40;
  if (diff <= 500) return 20;
  return 0;
}