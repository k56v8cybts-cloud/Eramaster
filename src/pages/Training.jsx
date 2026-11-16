import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, X as XIcon, Brain, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TOPICS, cardsForTopics, buildOptions } from '@/lib/trainingData';
import { pickSession, recordAnswer, topicStats, hardestCards } from '@/lib/srs';

const TOPICS_KEY = 'geozeit_training_topics';
const SESSION_LENGTHS = [10, 20];
const REPEAT_GAP = 3; // falsch beantwortete Karte kommt nach so vielen Karten nochmal

function loadTopics() {
  try {
    const saved = JSON.parse(localStorage.getItem(TOPICS_KEY) || 'null');
    if (Array.isArray(saved) && saved.length > 0) return saved;
  } catch {
    // ignore
  }
  return ['periods'];
}

// ---------- Themenauswahl ----------

function Setup({ topics, setTopics, length, setLength, onStart }) {
  const selectedCards = useMemo(() => cardsForTopics(topics), [topics]);
  const hardest = useMemo(() => hardestCards(selectedCards, 4), [selectedCards]);

  const toggle = (id) => {
    setTopics((prev) => (prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]));
  };

  return (
    <div className="px-4 pt-5 pb-10 max-w-md mx-auto">
      <div className="rounded-2xl border border-border bg-card p-4 flex gap-3 mb-5">
        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Brain className="h-5 w-5 text-primary" />
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Wähle, was du üben willst. Die App merkt sich, was du oft falsch beantwortest,
          und fragt genau das häufiger – bis es sitzt.
        </p>
      </div>

      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Themen</p>
      <div className="flex flex-col gap-2 mb-5">
        {TOPICS.map((topic) => {
          const active = topics.includes(topic.id);
          const stats = topicStats(cardsForTopics([topic.id]));
          const solidPct = (stats.solid / stats.total) * 100;
          const learningPct = (stats.learning / stats.total) * 100;
          return (
            <button
              key={topic.id}
              onClick={() => toggle(topic.id)}
              className={`text-left rounded-2xl border-2 p-3.5 transition-colors ${active ? 'bg-card' : 'border-border bg-card/50'}`}
              style={active ? { borderColor: topic.color } : undefined}
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex-shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center"
                  style={{ borderColor: active ? topic.color : 'hsl(var(--border))', backgroundColor: active ? topic.color : 'transparent' }}
                >
                  {active && <Check className="h-3.5 w-3.5 text-white" />}
                </div>
                <span className="font-semibold text-sm text-foreground">{topic.label}</span>
                <span className="ml-auto text-xs text-muted-foreground tabular-nums">
                  {stats.solid} / {stats.total} sitzen
                </span>
              </div>
              <div className="mt-2.5 h-1.5 rounded-full bg-muted overflow-hidden flex">
                <div style={{ width: `${solidPct}%`, backgroundColor: topic.color }} />
                <div style={{ width: `${learningPct}%`, backgroundColor: topic.color, opacity: 0.35 }} />
              </div>
            </button>
          );
        })}
      </div>

      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Fragen pro Runde</p>
      <div className="grid grid-cols-2 gap-2 mb-5">
        {SESSION_LENGTHS.map((n) => (
          <button
            key={n}
            onClick={() => setLength(n)}
            className={`py-2.5 rounded-xl border-2 text-sm font-semibold transition-colors ${
              length === n ? 'border-primary bg-primary/5 text-primary' : 'border-border text-muted-foreground'
            }`}
          >
            {n} Fragen
          </button>
        ))}
      </div>

      {hardest.length > 0 && (
        <div className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Deine Wackelkandidaten</p>
          <div className="rounded-2xl border border-border bg-card divide-y divide-border">
            {hardest.map(({ card, entry }) => (
              <div key={card.id} className="px-3.5 py-2.5 flex items-center gap-3">
                <span className="text-xs text-foreground leading-snug flex-1">{card.question}</span>
                <span className="text-[11px] font-semibold text-destructive tabular-nums whitespace-nowrap">{entry.w}× falsch</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <Button onClick={onStart} disabled={selectedCards.length === 0} className="w-full h-11 gap-2">
        Training starten <ArrowRight className="h-4 w-4" />
      </Button>
      {selectedCards.length === 0 && (
        <p className="text-xs text-muted-foreground text-center mt-2">Wähle mindestens ein Thema.</p>
      )}
    </div>
  );
}

// ---------- Abfrage ----------

function Quiz({ queue, onFinish }) {
  // Liste wächst, wenn falsche Karten erneut eingereiht werden (repeat = Wiederholung)
  const [items, setItems] = useState(() => queue.map((card) => ({ card, repeat: false })));
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState(null);
  const [results, setResults] = useState([]); // { card, correct } – nur der erste Versuch je Karte zählt

  const { card, repeat: isRepeat } = items[index];
  const options = useMemo(() => buildOptions(card), [card, index]);
  const answered = picked !== null;
  const wasCorrect = picked === card.correct;

  const choose = (option) => {
    if (answered) return;
    setPicked(option);
    const correct = option === card.correct;
    recordAnswer(card.id, correct);
    if (!isRepeat) {
      setResults((prev) => [...prev, { card, correct }]);
      if (!correct) {
        // einmal in derselben Runde wiederholen
        setItems((prev) => {
          const next = [...prev];
          next.splice(Math.min(next.length, index + 1 + REPEAT_GAP), 0, { card, repeat: true });
          return next;
        });
      }
    }
  };

  const next = () => {
    if (index + 1 >= items.length) {
      onFinish(results);
      return;
    }
    setPicked(null);
    setIndex((i) => i + 1);
  };

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="h-1 bg-muted">
        <motion.div className="h-full bg-primary" animate={{ width: `${(index / items.length) * 100}%` }} transition={{ duration: 0.3 }} />
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-md mx-auto px-4 py-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${card.id}-${index}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.18 }}
            >
              <p className="text-xs font-medium text-muted-foreground mb-2 tabular-nums">
                Frage {index + 1} von {items.length}{isRepeat ? ' · Wiederholung' : ''}
              </p>

              {card.image && (
                <div className="mb-3 rounded-xl overflow-hidden bg-muted">
                  <img
                    src={card.image}
                    alt=""
                    className="w-full max-h-44 object-contain"
                    onError={(ev) => { ev.currentTarget.parentElement.style.display = 'none'; }}
                  />
                </div>
              )}

              <h2 className="text-xl font-display font-bold text-foreground leading-snug mb-4">{card.question}</h2>

              <div className="flex flex-col gap-2">
                {options.map((option) => {
                  const isCorrect = option === card.correct;
                  const isPicked = option === picked;
                  let cls = 'border-border bg-card text-foreground';
                  if (answered && isCorrect) cls = 'border-green-500 bg-green-500/15 text-foreground';
                  else if (answered && isPicked) cls = 'border-red-500 bg-red-500/15 text-foreground';
                  else if (answered) cls = 'border-border bg-card text-muted-foreground';
                  return (
                    <button
                      key={option}
                      onClick={() => choose(option)}
                      disabled={answered}
                      className={`w-full text-left rounded-xl border-2 px-4 py-3 text-sm font-medium transition-colors flex items-center gap-2 ${cls}`}
                    >
                      <span className="flex-1">{option}</span>
                      {answered && isCorrect && <Check className="h-4 w-4 text-green-600 flex-shrink-0" />}
                      {answered && isPicked && !isCorrect && <XIcon className="h-4 w-4 text-red-600 flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {answered && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 rounded-xl border border-border bg-muted/50 p-3.5"
                >
                  <p className={`text-sm font-semibold mb-1 ${wasCorrect ? 'text-green-600' : 'text-red-600'}`}>
                    {wasCorrect ? 'Richtig!' : isRepeat ? 'Noch nicht – diese Karte kommt in den nächsten Runden öfter.' : 'Leider falsch – kommt gleich nochmal dran.'}
                  </p>
                  {card.explain && <p className="text-sm text-foreground leading-relaxed">{card.explain}</p>}
                  {card.image && card.imageCredit && (
                    <p className="text-[9px] text-muted-foreground/80 mt-2">Bild: {card.imageCredit}</p>
                  )}
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="shrink-0 border-t border-border bg-background/95 backdrop-blur-md">
        <div className="max-w-md mx-auto px-4 py-3">
          <Button onClick={next} disabled={!answered} className="w-full gap-2">
            {index + 1 >= items.length ? 'Auswertung' : 'Weiter'} <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// ---------- Auswertung ----------

function Result({ results, onAgain, onSetup, onHome }) {
  const correct = results.filter((r) => r.correct).length;
  const wrong = results.filter((r) => !r.correct);
  const pct = results.length ? Math.round((correct / results.length) * 100) : 0;

  return (
    <div className="px-4 pt-8 pb-10 max-w-md mx-auto">
      <div className="text-center mb-6">
        <p className="text-5xl font-display font-bold text-foreground tabular-nums">{correct}<span className="text-2xl text-muted-foreground"> / {results.length}</span></p>
        <p className="text-sm text-muted-foreground mt-1">{pct} % beim ersten Versuch richtig</p>
      </div>

      {wrong.length > 0 ? (
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Das üben wir nochmal</p>
          <div className="rounded-2xl border border-border bg-card divide-y divide-border">
            {wrong.map(({ card }) => (
              <div key={card.id} className="px-3.5 py-2.5">
                <p className="text-xs text-muted-foreground leading-snug">{card.question}</p>
                <p className="text-sm font-semibold text-foreground mt-0.5">{card.correct}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2">Diese Karten kommen in den nächsten Runden häufiger dran.</p>
        </div>
      ) : (
        <p className="text-sm text-center text-foreground mb-6">Alles richtig – stark! 🎉</p>
      )}

      <div className="flex flex-col gap-2.5">
        <Button onClick={onAgain} className="w-full gap-2"><RotateCcw className="h-4 w-4" /> Nächste Runde</Button>
        <Button variant="outline" onClick={onSetup} className="w-full gap-2"><SlidersHorizontal className="h-4 w-4" /> Themen ändern</Button>
        <Button variant="ghost" onClick={onHome} className="w-full gap-2"><ArrowLeft className="h-4 w-4" /> Zum Hauptmenü</Button>
      </div>
    </div>
  );
}

// ---------- Seite ----------

export default function Training() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState('setup'); // setup | quiz | result
  const [topics, setTopics] = useState(loadTopics);
  const [length, setLength] = useState(10);
  const [queue, setQueue] = useState([]);
  const [results, setResults] = useState([]);
  const [round, setRound] = useState(0);

  const start = () => {
    try {
      localStorage.setItem(TOPICS_KEY, JSON.stringify(topics));
    } catch {
      // ignore
    }
    const cards = cardsForTopics(topics);
    setQueue(pickSession(cards, Math.min(length, cards.length)));
    setRound((r) => r + 1);
    setPhase('quiz');
  };

  const back = () => {
    if (phase === 'setup') navigate('/');
    else setPhase('setup');
  };

  return (
    <div className="flex flex-col bg-background" style={{ height: '100dvh' }}>
      <div className="shrink-0 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="flex items-center gap-3 px-3 py-2.5 max-w-md mx-auto">
          <Button variant="ghost" size="icon" onClick={back} className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-sm font-semibold text-foreground">Training</h1>
        </div>
      </div>

      {phase === 'quiz' ? (
        <Quiz key={round} queue={queue} onFinish={(r) => { setResults(r); setPhase('result'); }} />
      ) : (
        <div className="flex-1 overflow-y-auto">
          {phase === 'setup' && (
            <Setup topics={topics} setTopics={setTopics} length={length} setLength={setLength} onStart={start} />
          )}
          {phase === 'result' && (
            <Result results={results} onAgain={start} onSetup={() => setPhase('setup')} onHome={() => navigate('/')} />
          )}
        </div>
      )}
    </div>
  );
}
