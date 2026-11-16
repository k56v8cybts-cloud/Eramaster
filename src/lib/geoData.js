// Complete geological timescale data based on ICS 2023
// Levels: eon, era, period
// Colors follow ICS convention

const GEO_DATA = [
  // === PHANEROZOIC EON ===
  {
    id: "phanerozoic",
    name: "Phanerozoikum",
    level: "eon",
    start_ma: 538.8,
    end_ma: 0,
    parent: null,
    color: "#9AD9F5",
    info: {
      climate: "Wildes Auf und Ab – von Eiszeiten bis zu tropischer Hitze",
      life: "Das komplexe Leben explodiert: Fische, Reptilien, Säuger, Blütenpflanzen",
      events: "Kambrische Explosion und fünf große Massenaussterben"
    }
  },

  // --- Cenozoic Era ---
  {
    id: "cenozoic",
    name: "Känozoikum",
    level: "era",
    start_ma: 66,
    end_ma: 0,
    parent: "phanerozoic",
    color: "#F2F91D",
    info: {
      climate: "Es wird kühler – vom Treibhaus zum Eiszeitalter",
      life: "Säugetiere und Vögel steigen auf, der Mensch entwickelt sich",
      events: "Alpen und Himalaya türmen sich auf, die Eiszeiten beginnen"
    }
  },
  {
    id: "quaternary",
    name: "Quartär",
    level: "period",
    start_ma: 2.58,
    end_ma: 0,
    parent: "cenozoic",
    color: "#F9F97F",
    info: {
      climate: "Kalt- und Warmzeiten wechseln sich ab (das Eiszeitalter)",
      life: "Mammut und Säbelzahntiger, dazu der moderne Mensch",
      events: "Letzte Eiszeit, Homo sapiens breitet sich aus, Megafauna stirbt"
    }
  },
  {
    id: "neogene",
    name: "Neogen",
    level: "period",
    start_ma: 23.03,
    end_ma: 2.58,
    parent: "cenozoic",
    color: "#FFE619",
    info: {
      climate: "Weiter abkühlend, die Antarktis vereist",
      life: "Grasländer breiten sich aus, erste Menschenaffen",
      events: "Nord- und Südamerika wachsen über eine Landbrücke zusammen"
    }
  },
  {
    id: "paleogene",
    name: "Paläogen",
    level: "period",
    start_ma: 66,
    end_ma: 23.03,
    parent: "cenozoic",
    color: "#FD9A52",
    info: {
      climate: "Erst warm und feucht, dann langsam kühler",
      life: "Säugetiere breiten sich nach dem Dino-Sterben rasant aus",
      events: "Erste Wale und Pferde, Australien löst sich von der Antarktis"
    }
  },

  // --- Mesozoic Era ---
  {
    id: "mesozoic",
    name: "Mesozoikum",
    level: "era",
    start_ma: 251.9,
    end_ma: 66,
    parent: "phanerozoic",
    color: "#67C5CA",
    info: {
      climate: "Meist warm, kein dauerhaftes Eis an den Polen",
      life: "Zeitalter der Dinosaurier, dazu erste Säuger und Blütenpflanzen",
      events: "Pangäa zerbricht, am Ende das große Dino-Sterben"
    }
  },
  {
    id: "cretaceous",
    name: "Kreide",
    level: "period",
    start_ma: 145,
    end_ma: 66,
    parent: "mesozoic",
    color: "#7FC64E",
    info: {
      climate: "Sehr warm, hoher Meeresspiegel, kein Pol-Eis",
      life: "Blütezeit der Dinosaurier, erste Blüten, riesige Meeresreptilien",
      events: "Asteroid schlägt vor 66 Mio. Jahren ein (K-Pg-Grenze)"
    }
  },
  {
    id: "jurassic",
    name: "Jura",
    level: "period",
    start_ma: 201.4,
    end_ma: 145,
    parent: "mesozoic",
    color: "#34B2C9",
    info: {
      climate: "Warm und feucht, oft tropisch",
      life: "Riesige Sauropoden, Stegosaurus, erste Vögel (Archaeopteryx)",
      events: "Pangäa zerbricht, der Atlantik öffnet sich"
    }
  },
  {
    id: "triassic",
    name: "Trias",
    level: "period",
    start_ma: 251.9,
    end_ma: 201.4,
    parent: "mesozoic",
    color: "#812B92",
    info: {
      climate: "Heiß und trocken, vor allem im Inneren von Pangäa",
      life: "Erste Dinosaurier und Säuger, Nadelbäume dominieren",
      events: "Pangäa beginnt zu zerbrechen, Massenaussterben am Ende"
    }
  },

  // --- Paleozoic Era ---
  {
    id: "paleozoic",
    name: "Paläozoikum",
    level: "era",
    start_ma: 538.8,
    end_ma: 251.9,
    parent: "phanerozoic",
    color: "#99C08D",
    info: {
      climate: "Starke Schwankungen – von warm zu Eiszeit und zurück",
      life: "Erstes komplexes Leben: Fische, Amphibien, Reptilien, Landpflanzen",
      events: "Kambrische Explosion, das Land wird besiedelt, Perm-Aussterben"
    }
  },
  {
    id: "permian",
    name: "Perm",
    level: "period",
    start_ma: 298.9,
    end_ma: 251.9,
    parent: "paleozoic",
    color: "#F04028",
    info: {
      climate: "Erst Eiszeit, dann immer heißer und trockener",
      life: "Reptilien dominieren, erste Säugetier-Vorfahren (Synapsiden)",
      events: "Größtes Massenaussterben aller Zeiten (bis zu 96 % der Meeresarten)"
    }
  },
  {
    id: "carboniferous",
    name: "Karbon",
    level: "period",
    start_ma: 358.9,
    end_ma: 298.9,
    parent: "paleozoic",
    color: "#67A599",
    info: {
      climate: "Feucht-warm, später Vergletscherung im Süden",
      life: "Riesige Bärlapp- und Farnwälder, erste Reptilien, Rieseninsekten",
      events: "Die Steinkohle entsteht, der Sauerstoffgehalt ist sehr hoch"
    }
  },
  {
    id: "devonian",
    name: "Devon",
    level: "period",
    start_ma: 419.2,
    end_ma: 358.9,
    parent: "paleozoic",
    color: "#CB8C37",
    info: {
      climate: "Überwiegend warm, viele Landmassen trocken",
      life: "Zeitalter der Fische, erste Amphibien, erste Wälder",
      events: "Pflanzen und Tiere erobern das Land, Kellwasser-Ereignis"
    }
  },
  {
    id: "silurian",
    name: "Silur",
    level: "period",
    start_ma: 443.8,
    end_ma: 419.2,
    parent: "paleozoic",
    color: "#B3E1B6",
    info: {
      climate: "Warm und stabil, der Meeresspiegel steigt",
      life: "Erste Landpflanzen und Kieferfische, Korallen breiten sich aus",
      events: "Kaledonische Gebirgsbildung, erste Böden an Land"
    }
  },
  {
    id: "ordovician",
    name: "Ordovizium",
    level: "period",
    start_ma: 485.4,
    end_ma: 443.8,
    parent: "paleozoic",
    color: "#009270",
    info: {
      climate: "Erst warm, am Ende eine schwere Eiszeit",
      life: "Graptolithen, erste Korallen, die Meeresvielfalt explodiert",
      events: "Zweitgrößtes Massenaussterben, Gondwana vereist"
    }
  },
  {
    id: "cambrian",
    name: "Kambrium",
    level: "period",
    start_ma: 538.8,
    end_ma: 485.4,
    parent: "paleozoic",
    color: "#7FA056",
    info: {
      climate: "Warm, hoher Meeresspiegel, kein Pol-Eis",
      life: "Kambrische Explosion: Trilobiten, Anomalocaris, erste Wirbeltiere",
      events: "Fast alle Tierstämme tauchen in kurzer Zeit auf"
    }
  },

  // === PROTEROZOIC EON ===
  {
    id: "proterozoic",
    name: "Proterozoikum",
    level: "eon",
    start_ma: 2500,
    end_ma: 538.8,
    parent: null,
    color: "#F73563",
    info: {
      climate: "Mehrere Schneeball-Erde-Phasen, der Sauerstoff steigt langsam",
      life: "Erste Eukaryoten, mehrzellige Organismen, Ediacara-Fauna",
      events: "Große Sauerstoffkatastrophe, Schneeball Erde, Rodinia entsteht"
    }
  },

  // --- Neoproterozoic Era ---
  {
    id: "neoproterozoic",
    name: "Neoproterozoikum",
    level: "era",
    start_ma: 1000,
    end_ma: 538.8,
    parent: "proterozoic",
    color: "#FEB343",
    info: {
      climate: "Extreme Vereisungen (Schneeball Erde), dann Erwärmung",
      life: "Erste vielzellige Tiere (Ediacara-Fauna), Schwämme",
      events: "Rodinia zerbricht, mehrere Schneeball-Erde-Phasen"
    }
  },
  {
    id: "ediacaran",
    name: "Ediacarium",
    level: "period",
    start_ma: 635,
    end_ma: 538.8,
    parent: "neoproterozoic",
    color: "#FED96A",
    info: {
      climate: "Nach dem Eis: es wird wärmer und stabiler",
      life: "Ediacara-Fauna: erste große, weichkörprige Lebewesen",
      events: "Die ersten komplexen Vielzeller erscheinen"
    }
  },
  {
    id: "cryogenian",
    name: "Kryogenium",
    level: "period",
    start_ma: 720,
    end_ma: 635,
    parent: "neoproterozoic",
    color: "#FEB75D",
    info: {
      climate: "Schneeball Erde: Eis bis zum Äquator",
      life: "Leben überdauert in Nischen unter dem Eis, einfache Eukaryoten",
      events: "Sturtische und Marinoische Vereisung"
    }
  },
  {
    id: "tonian",
    name: "Tonium",
    level: "period",
    start_ma: 1000,
    end_ma: 720,
    parent: "neoproterozoic",
    color: "#FE9A63",
    info: {
      climate: "Ziemlich stabil, langsam kühler werdend",
      life: "Erste gesicherte vielzellige Eukaryoten",
      events: "Der Superkontinent Rodinia beginnt zu zerbrechen"
    }
  },

  // --- Mesoproterozoic Era ---
  {
    id: "mesoproterozoic",
    name: "Mesoproterozoikum",
    level: "era",
    start_ma: 1600,
    end_ma: 1000,
    parent: "proterozoic",
    color: "#FDB462",
    info: {
      climate: "Ziemlich stabil und warm",
      life: "Erste sexuelle Fortpflanzung, einfache mehrzellige Algen",
      events: "Der Superkontinent Rodinia bildet sich"
    }
  },
  {
    id: "stenian",
    name: "Stenium",
    level: "period",
    start_ma: 1200,
    end_ma: 1000,
    parent: "mesoproterozoic",
    color: "#FDC07A",
    info: {
      climate: "Warm und stabil",
      life: "Älteste Belege für sexuelle Fortpflanzung (Rotalgen)",
      events: "Rodinia bildet sich, Grenville-Gebirgsbildung"
    }
  },
  {
    id: "ectasian",
    name: "Ectasium",
    level: "period",
    start_ma: 1400,
    end_ma: 1200,
    parent: "mesoproterozoic",
    color: "#FDB97A",
    info: {
      climate: "Stabil, mäßig warm",
      life: "Einzellige Eukaryoten werden vielfältiger",
      events: "Bestehende Sedimentbecken dehnen sich aus"
    }
  },
  {
    id: "calymmian",
    name: "Calymmium",
    level: "period",
    start_ma: 1600,
    end_ma: 1400,
    parent: "mesoproterozoic",
    color: "#FDAB60",
    info: {
      climate: "Warm, wenig Sauerstoff in der Luft",
      life: "Einfache Eukaryoten, Matten aus Cyanobakterien",
      events: "Alte Kontinentkerne verschwinden unter Sedimenten"
    }
  },

  // --- Paleoproterozoic Era ---
  {
    id: "paleoproterozoic",
    name: "Paläoproterozoikum",
    level: "era",
    start_ma: 2500,
    end_ma: 1600,
    parent: "proterozoic",
    color: "#F74370",
    info: {
      climate: "Erste große Eiszeit (Huronische Vereisung), dann wärmer",
      life: "Erste Eukaryoten, Cyanobakterien machen Sauerstoff",
      events: "Große Sauerstoffkatastrophe vor rund 2,4 Mrd. Jahren"
    }
  },
  {
    id: "statherian",
    name: "Statherium",
    level: "period",
    start_ma: 1800,
    end_ma: 1600,
    parent: "paleoproterozoic",
    color: "#F76390",
    info: {
      climate: "Stabil nach der Sauerstoffkrise",
      life: "Einfache Eukaryoten setzen sich durch",
      events: "Große Sedimentbecken bilden sich, erste komplexe Zellen"
    }
  },
  {
    id: "orosirian",
    name: "Orosirium",
    level: "period",
    start_ma: 2050,
    end_ma: 1800,
    parent: "paleoproterozoic",
    color: "#F7537F",
    info: {
      climate: "Nach der Eiszeit: Temperaturen steigen",
      life: "Cyanobakterien dominieren, erste Eukaryoten möglich",
      events: "Riesige Einschläge (Vredefort, Sudbury), starke Gebirgsbildung"
    }
  },
  {
    id: "rhyacian",
    name: "Rhyacium",
    level: "period",
    start_ma: 2300,
    end_ma: 2050,
    parent: "paleoproterozoic",
    color: "#F74370",
    info: {
      climate: "Die Huronische Vereisung klingt ab",
      life: "Stromatolithen aus Cyanobakterien",
      events: "Bushveld-Komplex entsteht, die globale Vereisung endet"
    }
  },
  {
    id: "siderian",
    name: "Siderium",
    level: "period",
    start_ma: 2500,
    end_ma: 2300,
    parent: "paleoproterozoic",
    color: "#F73363",
    info: {
      climate: "Beginn der Huronischen Vereisung",
      life: "Cyanobakterien und Stromatolithen",
      events: "Große Sauerstoffkatastrophe: freier Sauerstoff reichert sich an"
    }
  },

  // === ARCHEAN EON ===
  {
    id: "archean",
    name: "Archaikum",
    level: "eon",
    start_ma: 4000,
    end_ma: 2500,
    parent: null,
    color: "#F0047D",
    info: {
      climate: "Heiße Oberfläche, Atmosphäre ganz ohne Sauerstoff",
      life: "Das erste Leben: Prokaryoten, Stromatolithen, Archaeen",
      events: "Erste stabile Kontinente, die ältesten Gesteine der Erde"
    }
  },

  // --- Neoarchean Era ---
  {
    id: "neoarchean",
    name: "Neoarchaikum",
    level: "era",
    start_ma: 2800,
    end_ma: 2500,
    parent: "archean",
    color: "#F99BC1",
    info: {
      climate: "Heiß, kein Sauerstoff, viele Vulkane",
      life: "Cyanobakterien fangen an, Sauerstoff zu produzieren",
      events: "Erste stabile Kratone, Plattentektonik wie heute beginnt"
    }
  },

  // --- Mesoarchean Era ---
  {
    id: "mesoarchean",
    name: "Mesoarchaikum",
    level: "era",
    start_ma: 3200,
    end_ma: 2800,
    parent: "archean",
    color: "#F780AB",
    info: {
      climate: "Sehr heiß, noch kein freier Sauerstoff",
      life: "Stromatolithen überall, älteste gesicherte Fossilien",
      events: "Erste größere Krustenbildung"
    }
  },

  // --- Paleoarchean Era ---
  {
    id: "paleoarchean",
    name: "Paläoarchaikum",
    level: "era",
    start_ma: 3600,
    end_ma: 3200,
    parent: "archean",
    color: "#F76098",
    info: {
      climate: "Extrem heiß, starke UV-Strahlung",
      life: "Älteste mögliche Lebensspuren (Isua, Grönland)",
      events: "Älteste bekannte Gesteine (rund 3,8 Mrd. Jahre)"
    }
  },

  // --- Eoarchean Era ---
  {
    id: "eoarchean",
    name: "Eoarchaikum",
    level: "era",
    start_ma: 4000,
    end_ma: 3600,
    parent: "archean",
    color: "#DA037B",
    info: {
      climate: "Keine stabile Atmosphäre, Dauerbeschuss aus dem All",
      life: "Vielleicht schon erstes Leben (umstritten)",
      events: "Spätes schweres Bombardement, Jack-Hills-Zirkone"
    }
  },

  // === HADEAN EON ===
  {
    id: "hadean",
    name: "Hadaikum",
    level: "eon",
    start_ma: 4600,
    end_ma: 4000,
    parent: null,
    color: "#AE0160",
    info: {
      climate: "Ein Ozean aus Magma, Dauerbeschuss, noch keine feste Kruste",
      life: "Noch kein Leben",
      events: "Die Erde entsteht, der Mond bildet sich (Theia), erste Uratmosphäre"
    }
  }
];

export default GEO_DATA;
