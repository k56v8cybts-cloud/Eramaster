// Kurze Lern-Zusammenfassungen je Epoche.
// Eigenständige, locker gehaltene Formulierungen auf Basis allgemein bekannter
// wissenschaftlicher Fakten (Wikipedia / ICS / Lehrbücher) – keine Übernahme oder
// Umformulierung geschützter Fremdtexte.
// Keyed nach der id aus geoData.js. Die ausführlicheren Angaben (Klima/Leben/Ereignisse)
// kommen weiterhin aus geoData.js (entry.info).

export const LEARN_SUMMARIES = {
  // === Äonen ===
  hadean: 'Die Erde ist gerade entstanden – und glüht noch. Ein Ozean aus Magma, ständiger Meteoritenhagel. Dann kracht der Protoplanet Theia hinein; aus den Trümmern bildet sich der Mond. Leben gibt es noch keins.',
  archean: 'Die Erde kühlt ab, erste feste Kontinente und Ozeane entstehen. Und dann passiert das Entscheidende: Leben taucht auf. Einfache Einzeller ohne Zellkern, dazu von Bakterien gebaute Stromatolithen.',
  proterozoic: 'Cyanobakterien pumpen Sauerstoff in die Luft – für viele frühe Lebewesen ein Gift (die „Große Sauerstoffkatastrophe"). Erste komplexe Zellen entstehen. Dazwischen friert die Erde mehrmals fast komplett zu: „Schneeball Erde".',
  phanerozoic: 'Das große Finale: sichtbares Leben erobert die Bühne. Vom Kambrium über Fische, Dinosaurier und Säugetiere bis zu uns. Mittendrin fünf gewaltige Massenaussterben.',

  // === Ären ===
  eoarchean: 'Die älteste Ära überhaupt. Hier liegen die ältesten bekannten Gesteine der Erde. Vielleicht gab es schon erste Spuren von Leben – unter Dauerbeschuss aus dem All.',
  paleoarchean: 'Die Erdkruste wird stabiler. Jetzt entstehen die ältesten sicheren Fossilien: Bakterien und Stromatolithen. Sauerstoff gibt es noch keinen.',
  mesoarchean: 'Stromatolithen breiten sich aus, erste größere Kontinentkerne wachsen. Cyanobakterien fangen an, die Welt umzukrempeln.',
  neoarchean: 'Cyanobakterien produzieren immer mehr Sauerstoff. Die große Sauerstoff-Revolution steht kurz bevor.',
  paleoproterozoic: 'Der Sauerstoff verändert die Atmosphäre für immer. Es entstehen erste Eukaryoten – und die erste große Eiszeit der Erdgeschichte (die Huronische Vereisung).',
  mesoproterozoic: 'Eine lange, ruhige Phase – Forscher nennen sie scherzhaft „die langweilige Milliarde". Der Superkontinent Rodinia bildet sich, und die sexuelle Fortpflanzung erscheint.',
  neoproterozoic: 'Erst friert die Erde extrem zu („Schneeball Erde"), dann taut sie wieder auf. Danach tauchen die ersten großen Lebewesen auf: die rätselhafte Ediacara-Fauna.',
  paleozoic: 'Das Leben explodiert förmlich – erst im Meer, dann an Land. Pflanzen, Insekten und Amphibien erobern das Festland. Am Ende: das größte Massenaussterben aller Zeiten.',
  mesozoic: 'Das Zeitalter der Dinosaurier. Der Superkontinent Pangäa zerbricht, erste Vögel, Säugetiere und Blütenpflanzen erscheinen. Dann beendet ein Asteroid vor 66 Mio. Jahren die Show.',
  cenozoic: 'Die Dinos sind weg – jetzt übernehmen Säugetiere und Vögel. Alpen und Himalaya türmen sich auf, Eiszeiten kommen und gehen, und der Mensch betritt die Bühne.',

  // === Perioden ===
  siderian: 'Der Sauerstoff-Anstieg beginnt. Cyanobakterien und Stromatolithen geben den Ton an, die erste große Vereisung setzt ein.',
  rhyacian: 'Die erste große Eiszeit klingt ab. Mächtige Gesteinspakete bilden sich, die frühen Zellen entwickeln sich weiter.',
  orosirian: 'Gebirge türmen sich auf, riesige Meteoriten schlagen ein. Und der Sauerstoff in der Luft steigt kräftig.',
  statherian: 'Nach der Sauerstoff-Krise kehrt Ruhe ein. Erste einfache Eukaryoten setzen sich durch.',
  calymmian: 'Alte Kontinentkerne verschwinden unter Sedimenten. Einfache Eukaryoten und Bakterienmatten prägen das Leben.',
  ectasian: 'Die Sedimentbecken wachsen. Einzellige Eukaryoten werden vielfältiger.',
  stenian: 'Der Superkontinent Rodinia entsteht. Von hier stammen die ältesten Belege für sexuelle Fortpflanzung (bei Rotalgen).',
  tonian: 'Rodinia beginnt zu zerbrechen. Die ersten sicheren vielzelligen Eukaryoten tauchen auf.',
  cryogenian: 'Die heftigste Eiszeit der Erdgeschichte. Die Erde friert bis zum Äquator zu – „Schneeball Erde".',
  ediacaran: 'Nach dem Eis kommen die ersten großen Lebewesen: weich, bizarr, rätselhaft. Das ist die Ediacara-Fauna.',
  cambrian: 'Jetzt geht\'s richtig los. In kurzer Zeit tauchen fast alle heutigen Tierstämme auf – die Kambrische Explosion. Trilobiten krabbeln durchs Meer, die ersten Wirbeltiere erscheinen.',
  ordovician: 'Das Leben im Meer blüht auf. Am Ende kommt eine schwere Eiszeit – und das zweitgrößte Massenaussterben der Geschichte.',
  silurian: 'Warm und stabil. Die ersten Pflanzen erobern das Land, und Fische bekommen Kiefer.',
  devonian: 'Das „Zeitalter der Fische". Pflanzen bilden die ersten Wälder, und die ersten Vierbeiner wagen sich an Land.',
  carboniferous: 'Riesige Sumpfwälder – aus ihnen wird später Steinkohle. Der Sauerstoff ist hoch, Insekten werden riesig, die ersten Reptilien erscheinen.',
  permian: 'Reptilien und Säugetier-Vorfahren geben den Ton an. Dann kommt die größte Katastrophe aller Zeiten: Bis zu 96 % der Meeresarten sterben aus.',
  triassic: 'Das Leben erholt sich von der großen Katastrophe. In einer heißen, trockenen Welt erscheinen die ersten Dinosaurier und Säugetiere.',
  jurassic: 'Die große Zeit der riesigen Sauropoden. Pangäa zerfällt, der Atlantik öffnet sich – und die ersten Vögel heben ab.',
  cretaceous: 'Höhepunkt und Ende der Dinosaurier. Die ersten Blütenpflanzen erscheinen. Dann schlägt ein Asteroid ein und beendet die Dino-Ära (die K-Pg-Grenze).',
  paleogene: 'Die Säugetiere nutzen die freie Bühne und breiten sich rasant aus. Erste Wale und erste Pferde erscheinen.',
  neogene: 'Grasländer breiten sich aus, das Klima wird kühler. Und die ersten Menschenaffen betreten die Szene.',
  quaternary: 'Das Eiszeitalter – mit Mammut und Säbelzahntiger. Und mittendrin breitet sich der moderne Mensch über die ganze Erde aus.',
};
