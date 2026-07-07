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
      climate: "Starke Klimaschwankungen, von Eiszeiten bis zu tropischen Phasen",
      life: "Explosion komplexen Lebens: Fische, Reptilien, Säugetiere, Blütenpflanzen",
      events: "Kambrische Explosion, fünf große Massenaussterben"
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
      climate: "Abkühlung vom Treibhausklima zu Eiszeitaltern",
      life: "Aufstieg der Säugetiere und Vögel, Evolution des Menschen",
      events: "Entstehung der Alpen und des Himalayas, Eiszeitalter"
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
      climate: "Wechsel von Kalt- und Warmzeiten (Eiszeitalter)",
      life: "Megafauna (Mammut, Säbelzahntiger), Evolution des modernen Menschen",
      events: "Letzte Eiszeit, Ausbreitung des Homo sapiens, Aussterben der Megafauna"
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
      climate: "Fortschreitende Abkühlung, Bildung der antarktischen Eiskappe",
      life: "Ausbreitung der Grasländer, erste Menschenaffen",
      events: "Entstehung der Landbrücke zwischen Nord- und Südamerika"
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
      climate: "Zunächst warm und feucht, dann langsame Abkühlung",
      life: "Schnelle Radiation der Säugetiere nach dem Dinosaurieraussterben",
      events: "Erste Wale und Pferde, Trennung Australiens von der Antarktis"
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
      climate: "Überwiegend warm, kein permanentes Eis an den Polen",
      life: "Zeitalter der Dinosaurier, erste Säugetiere und Blütenpflanzen",
      events: "Zerfall von Pangäa, Kreide-Paläogen-Massenaussterben"
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
      climate: "Sehr warm, hoher Meeresspiegel, kein polares Eis",
      life: "Blütezeit der Dinosaurier, erste Blütenpflanzen, große Meeresreptilien",
      events: "Asteroideneinschlag vor 66 Ma → Massenaussterben (K-Pg-Grenze)"
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
      climate: "Warm und feucht, tropische Bedingungen weit verbreitet",
      life: "Große Sauropoden, Stegosaurus, erste Vögel (Archaeopteryx)",
      events: "Zerfall von Pangäa beginnt, Atlantik öffnet sich"
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
      climate: "Heiß und trocken, besonders im Inneren von Pangäa",
      life: "Erste Dinosaurier und Säugetiere, Nadelbäume dominieren",
      events: "Massenaussterben am Ende der Trias, Zerfall von Pangäa beginnt"
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
      climate: "Von warm zu Eiszeiten und zurück, starke Schwankungen",
      life: "Erstes komplexes Leben, Fische, Amphibien, erste Reptilien, erste Landpflanzen",
      events: "Kambrische Explosion, Besiedlung des Landes, Perm-Massenaussterben"
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
      climate: "Zunächst Eiszeit, dann zunehmend heiß und trocken",
      life: "Reptilien dominieren, erste Säugetier-Vorfahren (Synapsiden)",
      events: "Größtes Massenaussterben der Erdgeschichte (~96% aller Arten)"
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
      climate: "Feucht-warm, dann Vergletscherung auf der Südhalbkugel",
      life: "Riesige Wälder aus Bärlapp und Farn, erste Reptilien, Rieseninsekten",
      events: "Bildung der Steinkohle, hoher Sauerstoffgehalt der Atmosphäre"
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
      climate: "Überwiegend warm, arides Klima auf vielen Landmassen",
      life: "Zeitalter der Fische, erste Amphibien, erste Wälder",
      events: "Besiedlung des Landes durch Pflanzen und Tiere, Kellwasser-Ereignis"
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
      climate: "Warm und stabil, Meeresspiegel steigt",
      life: "Erste Landpflanzen und Kieferfische, Korallen verbreiten sich",
      events: "Kaledonische Gebirgsbildung, erste Bodenbildung an Land"
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
      climate: "Zunächst warm, endet mit schwerer Eiszeit",
      life: "Graptolithen, erste Korallen, marine Vielfalt explodiert",
      events: "Ordovizisches Massenaussterben (zweitgrößtes), Gondwana-Vereisung"
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
      climate: "Warm, hoher Meeresspiegel, kein Eis an den Polen",
      life: "Kambrische Explosion: Trilobiten, Anomalocaris, erste Wirbeltiere",
      events: "Plötzliches Auftreten fast aller Tierstämme in kurzer Zeit"
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
      climate: "Mehrere Schneeball-Erde-Phasen, langsamer Sauerstoffanstieg",
      life: "Erste Eukaryoten, mehrzellige Organismen, Ediacara-Fauna",
      events: "Große Sauerstoffkatastrophe, Snowball Earth, Rodinia bildet sich"
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
      climate: "Extreme Vergletscherungen (Schneeball-Erde), dann Erwärmung",
      life: "Erste vielzellige Tiere (Ediacara-Fauna), Schwämme",
      events: "Zerfall von Rodinia, Schneeball-Erde-Episoden"
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
      climate: "Nach Schneeball-Erde: Erwärmung, Stabilisierung",
      life: "Ediacara-Fauna: erste große, weichkörpige Organismen",
      events: "Erste komplexe mehrzellige Lebensformen erscheinen"
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
      climate: "Schneeball-Erde: globale Vergletscherung bis zum Äquator",
      life: "Überleben in Oasen unter dem Eis, einfache Eukaryoten",
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
      climate: "Relativ stabil, langsame Abkühlung",
      life: "Erste gesicherte vielzellige Eukaryoten",
      events: "Zerfall des Superkontinents Rodinia beginnt"
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
      climate: "Relativ stabil und warm",
      life: "Erste sexuelle Fortpflanzung, einfache mehrzellige Algen",
      events: "Bildung des Superkontinents Rodinia"
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
      life: "Älteste gesicherte sexuelle Fortpflanzung (Rotalgen)",
      events: "Bildung von Rodinia, Grenville-Orogenese"
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
      life: "Einzellige Eukaryoten diversifizieren sich",
      events: "Ausdehnung bestehender Sedimentbecken"
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
      climate: "Warm, wenig Sauerstoff in der Atmosphäre",
      life: "Einfache Eukaryoten, Cyanobakterien-Matten",
      events: "Überdeckung alter Kratone mit Sedimenten"
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
      climate: "Erste große Eiszeit (Huronische Vereisung), dann Erwärmung",
      life: "Erste Eukaryoten, Cyanobakterien produzieren Sauerstoff",
      events: "Große Sauerstoffkatastrophe vor ~2,4 Ga"
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
      life: "Einfache Eukaryoten etablieren sich",
      events: "Bildung großer Sedimentbecken, erste komplexe Zellen"
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
      climate: "Nach Eiszeit: steigende Temperaturen",
      life: "Cyanobakterien dominieren, erste Eukaryoten möglich",
      events: "Vredefort- und Sudbury-Impakte, intensive Gebirgsbildung"
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
      climate: "Huronische Vereisung klingt ab",
      life: "Cyanobakterien-Stromatolithen",
      events: "Bushveld-Komplex bildet sich, globale Vergletscherung endet"
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
      life: "Cyanobakterien, Stromatolithen",
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
      climate: "Heiße Oberfläche, reduzierende Atmosphäre ohne Sauerstoff",
      life: "Erstes Leben: Prokaryoten, Stromatolithen, Archaea",
      events: "Bildung erster stabiler Kontinente, älteste Gesteine der Erde"
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
      climate: "Heiß, kein Sauerstoff, starke vulkanische Aktivität",
      life: "Cyanobakterien beginnen Sauerstoff zu produzieren",
      events: "Erste stabile Kratone, Beginn der Plattentektonik im modernen Sinne"
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
      climate: "Sehr heiß, keine freie Sauerstoffatmosphäre",
      life: "Stromatolithen weit verbreitet, älteste gesicherte Fossilien",
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
      climate: "Extrem heiß, intensive UV-Strahlung",
      life: "Älteste mögliche Lebensspuren (Isua-Grönland)",
      events: "Älteste bekannte Gesteine (Isua-Gneis, ~3,8 Ga)"
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
      climate: "Keine stabile Atmosphäre, ständiges Bombardement",
      life: "Möglicherweise erstes Leben (umstritten)",
      events: "Spätes schweres Bombardement, Jack Hills-Zirkone"
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
      climate: "Magmaozean, ständige Meteoriteneinschläge, keine stabile Kruste",
      life: "Kein bekanntes Leben",
      events: "Entstehung der Erde, Mondbildung durch Theia-Einschlag, Bildung der Uratmosphäre"
    }
  }
];

export default GEO_DATA;