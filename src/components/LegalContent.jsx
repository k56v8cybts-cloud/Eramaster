import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

// =====================================================================
//  IMPRESSUMS-DATEN  –  hier die Platzhalter durch die echten Angaben
//  ersetzen. Nur diese Werte müssen angepasst werden.
// =====================================================================
export const IMPRINT = {
  name: '[DEIN VOLLER NAME]',
  street: '[STRASSE UND HAUSNUMMER]',
  city: '[PLZ UND ORT]',
  country: 'Deutschland',
  email: 'elias@team-ritter.de',
  phone: '', // optional, z. B. '+49 …' – leer lassen, wenn nicht gewünscht
};

// Stand der Rechtstexte (bei Änderungen aktualisieren)
const STAND = 'November 2026';

function Section({ title, children }) {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-semibold text-foreground mb-1.5">{title}</h3>
      <div className="text-sm text-muted-foreground leading-relaxed space-y-2">{children}</div>
    </div>
  );
}

function Impressum() {
  return (
    <div>
      <p className="text-sm text-muted-foreground leading-relaxed mb-5">
        Angaben gemäß § 5 Digitale-Dienste-Gesetz (DDG).
      </p>

      <Section title="Diensteanbieter">
        <p>
          {IMPRINT.name}<br />
          {IMPRINT.street}<br />
          {IMPRINT.city}<br />
          {IMPRINT.country}
        </p>
      </Section>

      <Section title="Kontakt">
        <p>
          E-Mail: <a href={`mailto:${IMPRINT.email}`} className="text-primary underline underline-offset-2">{IMPRINT.email}</a>
          {IMPRINT.phone ? <><br />Telefon: {IMPRINT.phone}</> : null}
        </p>
      </Section>

      <Section title="Verantwortlich für den Inhalt">
        <p>{IMPRINT.name}, Anschrift wie oben.</p>
      </Section>

      <Section title="Art des Angebots">
        <p>
          Äramaster ist ein privates, nicht-kommerzielles Lernprojekt zur
          Erdgeschichte. Es dient ausschließlich Bildungs- und Hobbyzwecken.
        </p>
      </Section>

      <Section title="Haftung für Inhalte">
        <p>
          Die Inhalte dieser Seite wurden mit Sorgfalt und nach bestem Wissen
          erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der
          (insbesondere erdgeschichtlichen) Inhalte wird jedoch keine Gewähr
          übernommen.
        </p>
      </Section>

      <Section title="Haftung für Links">
        <p>
          Diese Seite kann Links zu externen Websites Dritter enthalten, auf
          deren Inhalte kein Einfluss besteht. Für diese fremden Inhalte ist
          stets der jeweilige Anbieter verantwortlich.
        </p>
      </Section>

      <Section title="Urheberrecht">
        <p>
          Die auf dieser Seite veröffentlichten eigenen Inhalte unterliegen dem
          deutschen Urheberrecht. Beiträge Dritter sind als solche gekennzeichnet.
        </p>
      </Section>

      <p className="text-xs text-muted-foreground/70 mt-8">Stand: {STAND}</p>
    </div>
  );
}

function Datenschutz() {
  return (
    <div>
      <p className="text-sm text-muted-foreground leading-relaxed mb-5">
        Der Schutz deiner Daten ist uns wichtig. Nachfolgend informieren wir dich
        darüber, welche Daten bei der Nutzung von Äramaster verarbeitet werden.
      </p>

      <Section title="1. Verantwortlicher">
        <p>
          Verantwortlich im Sinne der Datenschutz-Grundverordnung (DSGVO) ist der
          im Impressum genannte Diensteanbieter ({IMPRINT.name}, Kontakt:{' '}
          <a href={`mailto:${IMPRINT.email}`} className="text-primary underline underline-offset-2">{IMPRINT.email}</a>).
        </p>
      </Section>

      <Section title="2. Nutzung ohne Anmeldung">
        <p>
          Äramaster lässt sich vollständig ohne Benutzerkonto nutzen. In diesem
          Fall werden deine Spielstände und Einstellungen ausschließlich lokal in
          deinem Browser gespeichert (über die Technik „localStorage"). Diese Daten
          verlassen dein Gerät nicht und sind für uns nicht einsehbar. Es handelt
          sich um technisch notwendige Speicherung; eine Einwilligung ist dafür
          nicht erforderlich.
        </p>
      </Section>

      <Section title="3. Hosting (GitHub Pages)">
        <p>
          Die Website wird bei GitHub Pages gehostet, einem Dienst der GitHub, Inc.
          (88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, USA). Beim Aufruf
          der Seite verarbeitet GitHub technisch notwendige Zugriffsdaten (z. B.
          IP-Adresse, Datum und Uhrzeit, aufgerufene Datei), um die Auslieferung der
          Website zu ermöglichen und ihre Sicherheit zu gewährleisten.
        </p>
        <p>
          Rechtsgrundlage ist das berechtigte Interesse an einem sicheren und
          effizienten Betrieb der Website (Art. 6 Abs. 1 lit. f DSGVO). Dabei können
          Daten in die USA übermittelt werden.
        </p>
      </Section>

      <Section title="4. Anmeldung mit Google (Firebase Authentication)">
        <p>
          Du kannst dich freiwillig mit deinem Google-Konto anmelden, um deinen
          Spielfortschritt zu sichern und geräteübergreifend zu nutzen. Erst mit der
          Anmeldung werden folgende Daten verarbeitet: dein Name, deine
          E-Mail-Adresse, deine Profilbild-URL sowie eine von Firebase vergebene
          Nutzerkennung (UID).
        </p>
        <p>
          Die Anmeldung erfolgt über Firebase Authentication, einen Dienst der
          Google Ireland Limited (Gordon House, Barrow Street, Dublin 4, Irland).
          Rechtsgrundlage ist deine Einwilligung (Art. 6 Abs. 1 lit. a DSGVO), die du
          durch die Anmeldung erteilst und jederzeit durch Abmelden widerrufen kannst.
          Dabei können Daten an Google LLC in den USA übermittelt werden.
        </p>
      </Section>

      <Section title="5. Cloud-Speicherung des Fortschritts (Firestore)">
        <p>
          Bist du angemeldet, wird dein Spielfortschritt (z. B. Ergebnisse und
          Erfolge) in der Datenbank Cloud Firestore gespeichert und mit deiner
          Nutzerkennung verknüpft. So steht dein Fortschritt auf allen deinen
          Geräten zur Verfügung. Anbieter ist ebenfalls Google (siehe oben).
          Rechtsgrundlage ist deine Einwilligung (Art. 6 Abs. 1 lit. a DSGVO).
        </p>
      </Section>

      <Section title="6. Keine Analyse, keine Werbung">
        <p>
          Äramaster nutzt keine Analyse- oder Tracking-Dienste, keine Werbung und
          keine Cookies zu Werbe- oder Statistikzwecken. Es findet kein Profiling statt.
        </p>
      </Section>

      <Section title="7. Speicherdauer und Löschung">
        <p>
          Lokale Daten bleiben gespeichert, bis du sie löschst (z. B. über
          „Alle Daten zurücksetzen" in den Einstellungen oder durch Leeren des
          Browserspeichers). Mit dieser Funktion werden – sofern du angemeldet bist –
          auch die in der Cloud gespeicherten Fortschrittsdaten zurückgesetzt.
        </p>
        <p>
          Möchtest du dein Konto und die damit verbundenen Daten vollständig löschen,
          genügt eine kurze Nachricht an die oben genannte E-Mail-Adresse.
        </p>
      </Section>

      <Section title="8. Deine Rechte">
        <p>
          Dir stehen gegenüber uns die folgenden Rechte hinsichtlich deiner
          personenbezogenen Daten zu: Auskunft (Art. 15), Berichtigung (Art. 16),
          Löschung (Art. 17), Einschränkung der Verarbeitung (Art. 18),
          Datenübertragbarkeit (Art. 20) sowie Widerspruch gegen die Verarbeitung
          (Art. 21 DSGVO). Eine erteilte Einwilligung kannst du jederzeit mit Wirkung
          für die Zukunft widerrufen.
        </p>
        <p>
          Zudem hast du das Recht, dich bei einer Datenschutz-Aufsichtsbehörde über
          die Verarbeitung deiner personenbezogenen Daten zu beschweren.
        </p>
      </Section>

      <p className="text-xs text-muted-foreground/70 mt-8">Stand: {STAND}</p>
    </div>
  );
}

const TITLES = { impressum: 'Impressum', datenschutz: 'Datenschutzerklärung' };

export default function LegalContent({ page, onClose }) {
  // Scrollen des Hintergrunds verhindern, solange das Overlay offen ist
  useEffect(() => {
    if (page) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [page]);

  return (
    <AnimatePresence>
      {page && (
        <motion.div
          key="legal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-50 bg-background flex flex-col"
          style={{ height: '100dvh' }}
        >
          {/* Header */}
          <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-md border-b border-border">
            <div className="flex items-center gap-3 px-3 py-2.5 max-w-md mx-auto">
              <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-sm font-semibold text-foreground">{TITLES[page]}</h1>
            </div>
          </div>

          {/* Inhalt */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-md mx-auto px-5 py-6 pb-24">
              {page === 'impressum' ? <Impressum /> : <Datenschutz />}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
