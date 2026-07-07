import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Trophy, X as XIcon, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { buildTimeline, calcHeight } from '@/lib/geoUtils';
import ResultScreen from '@/components/geo/ResultScreen';
import { CREATURES, creatureOverlapsPeriod, shuffle } from '@/lib/creaturesData';
import { saveRun } from './Leaderboard';

const FEEDBACK_DURATION = 1400;
const CORRECT_DURATION = 700;

function getContrastColor(hex) {
  const c = hex.replace('#', '');
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.55 ? '#1a1a2e' : '#ffffff';
}

function PeriodTile({ period, feedbackState, solvedCreatures, onClick }) {
  const isCorrect = feedbackState === 'correct';
  const isWrong = feedbackState === 'wrong';
  const isReveal = feedbackState === 'reveal';
  const hasSolved = solvedCreatures?.length > 0;

  let bg = period.color;
  let textColor = getContrastColor(period.color);
  let border = 'rgba(0,0,0,0.12)';

  if (isCorrect || isReveal) { bg = '#16a34a'; textColor = '#fff'; border = '#15803d'; }
  else if (isWrong) { bg = '#ef4444'; textColor = '#fff'; border = '#dc2626'; }

  const h = Math.max(52, calcHeight(period));

  return (
    <motion.div
      className="relative flex flex-col items-center justify-center border-b select-none cursor-pointer"
      style={{ height: `${h}px`, backgroundColor: bg, color: textColor, borderColor: border }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
    >
      <span className="text-xs font-semibold text-center px-1 break-words"
        style={{ textShadow: '0 1px 2px rgba(0,0,0,0.15)', lineHeight: 1.25 }} lang="de">
        {period.name}
      </span>
      {/* Show solved creatures with their Ma range */}
      {hasSolved && (
        <span className="text-[8px] mt-0.5 opacity-80 text-center px-1 leading-tight">
          {solvedCreatures.map(c => `${c.name} (${c.start_ma}–${c.end_ma} Ma)`).join(', ')}
        </span>
      )}
    </motion.div>
  );
}

// Build a flat list of all periods from the timeline
function getAllPeriods() {
  const timeline = buildTimeline();
  const periods = [];
  timeline.forEach(eon => {
    eon.eras.forEach(era => {
      if (era.periods.length > 0) {
        era.periods.forEach(p => periods.push(p));
      } else {
        // eras with no periods (e.g. Archean sub-eras) – skip for simplicity
      }
    });
  });
  return periods;
}

function CreatureInfoModal({ creature, onClose }) {
  if (!creature) return null;
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="w-full max-w-lg bg-card rounded-t-2xl shadow-2xl overflow-hidden"
          initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          onClick={e => e.stopPropagation()}
        >
          <div className="h-2 bg-primary" />
          <div className="flex gap-4 px-5 pt-4 pb-2">
            <img src={creature.image} alt={creature.name}
              className="w-20 h-20 object-cover rounded-xl border border-border flex-shrink-0 bg-muted"
              onError={(e) => { e.target.style.display = 'none'; }} />
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <h2 className="text-lg font-display font-bold text-foreground">{creature.name}</h2>
                <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 -mr-2 -mt-1">
                  <XIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          <div className="px-5 pb-6">
            <p className="text-sm text-foreground leading-relaxed">{creature.fact}</p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function CreaturesGame() {
  const { gameType } = useParams();
  const navigate = useNavigate();

  const [allPeriods] = useState(() => getAllPeriods());
  const [infoCreature, setInfoCreature] = useState(null);
  const [queue, setQueue] = useState([]);
  const [currentCreature, setCurrentCreature] = useState(null);
  const [solvedMap, setSolvedMap] = useState({}); // periodId → [creatures]
  const [errors, setErrors] = useState(0);
  const [feedbackMap, setFeedbackMap] = useState({}); // periodId → 'correct'|'wrong'|'reveal'
  const [finished, setFinished] = useState(false);
  const [failed, setFailed] = useState(false);
  const [solvedCount, setSolvedCount] = useState(0);
  const startTime = useRef(Date.now());
  const [elapsed, setElapsed] = useState(0);
  const feedbackTimer = useRef(null);

  const initGame = useCallback(() => {
    const shuffled = shuffle(CREATURES);
    setQueue(shuffled.slice(1));
    setCurrentCreature(shuffled[0]);
    setSolvedMap({});
    setErrors(0);
    setFeedbackMap({});
    setFinished(false);
    setFailed(false);
    setSolvedCount(0);
    startTime.current = Date.now();
  }, []);

  useEffect(() => { initGame(); }, [initGame]);

  const advanceToNext = useCallback((nextQueue) => {
    if (nextQueue.length === 0) {
      setCurrentCreature(null);
      setElapsed(Date.now() - startTime.current);
      setFinished(true);
    } else {
      setCurrentCreature(nextQueue[0]);
      setQueue(nextQueue.slice(1));
    }
    setFeedbackMap({});
  }, []);

  const handlePeriodClick = useCallback((period) => {
    if (!currentCreature) return;
    if (feedbackTimer.current) clearTimeout(feedbackTimer.current);

    const isCorrect = creatureOverlapsPeriod(currentCreature, period);
    const correctPeriod = allPeriods.find(p => p.id === currentCreature.period);

    if (isCorrect) {
      setSolvedMap(prev => ({
        ...prev,
        [period.id]: [...(prev[period.id] || []), currentCreature],
      }));
      setSolvedCount(c => c + 1);
      setFeedbackMap({ [period.id]: 'correct' });
      feedbackTimer.current = setTimeout(() => advanceToNext(queue), CORRECT_DURATION);
    } else {
      setErrors(e => e + 1);
      const newFb = { [period.id]: 'wrong' };
      if (correctPeriod) newFb[correctPeriod.id] = 'reveal';
      setFeedbackMap(newFb);

      if (gameType === 'exam') {
        feedbackTimer.current = setTimeout(() => {
          setElapsed(Date.now() - startTime.current);
          setFailed(true);
          setFinished(true);
        }, FEEDBACK_DURATION);
      } else {
        feedbackTimer.current = setTimeout(() => {
          // Put currentCreature back at a random position in the remaining queue
          const pos = queue.length === 0 ? 0 : Math.floor(Math.random() * queue.length) + 1;
          const newQueue = [...queue];
          newQueue.splice(pos, 0, currentCreature);
          advanceToNext(newQueue);
        }, FEEDBACK_DURATION);
      }
    }
  }, [currentCreature, allPeriods, queue, advanceToNext, gameType]);

  useEffect(() => {
    if (finished) {
      saveRun({ modeId: 'creatures', gameType, errors, total: CREATURES.length, elapsed });
    }
  }, [finished]);

  if (finished) {
    return (
      <ResultScreen
        errors={errors}
        total={CREATURES.length}
        elapsed={elapsed}
        failed={failed}
        gameType={gameType}
        onReplay={initGame}
        onModeMenu={() => navigate('/mode/creatures')}
      />
    );
  }

  const timeline = buildTimeline();

  return (
    <div className="flex flex-col bg-background" style={{ height: '100dvh' }}>
      {/* Header */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="flex items-center justify-between px-3 py-2">
          <Button variant="ghost" size="icon" onClick={() => navigate('/mode/creatures')} className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-3 text-sm">
            {gameType === 'exam' && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-destructive/10 text-destructive uppercase tracking-wide">
                Prüfung
              </span>
            )}
            <span className="flex items-center gap-1 text-muted-foreground">
              <Trophy className="h-3.5 w-3.5" />
              {solvedCount}/{CREATURES.length}
            </span>
            <span className="flex items-center gap-1 text-destructive">
              <XIcon className="h-3.5 w-3.5" />
              {errors}
            </span>
          </div>
        </div>

        {/* Current creature card */}
        <AnimatePresence mode="wait">
          {currentCreature && (
            <motion.div
              key={currentCreature.id}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="px-3 pb-3 flex items-center gap-3"
            >
              <img
                src={currentCreature.image}
                alt={currentCreature.name}
                className="w-14 h-14 object-cover rounded-lg border border-border flex-shrink-0 bg-muted"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">In welcher Periode lebte:</p>
                <div className="flex items-center gap-1.5">
                  <p className="text-base font-display font-bold text-foreground leading-tight">{currentCreature.name}</p>
                  <button
                    className="flex-shrink-0 text-muted-foreground hover:text-primary transition-colors"
                    onClick={(e) => { e.stopPropagation(); setInfoCreature(currentCreature); }}
                  >
                    <Info className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Column headers */}
        <div className="flex border-t border-border bg-muted/50">
          <div className="flex-1 text-[10px] font-semibold text-muted-foreground text-center py-1.5">Periode</div>
          <div className="text-[10px] font-semibold text-muted-foreground text-center py-1.5" style={{ width: '22%', minWidth: 52 }}>Ma</div>
        </div>
      </div>

      {/* Timeline */}
      <div className="flex-1 overflow-auto hide-scrollbar">
        <CreaturesTimeline
          timeline={timeline}
          feedbackMap={feedbackMap}
          solvedMap={solvedMap}
          onPeriodClick={handlePeriodClick}
        />
      </div>

      {/* Info modal */}
      <CreatureInfoModal creature={infoCreature} onClose={() => setInfoCreature(null)} />
    </div>
  );
}

// Flat list of periods from the timeline, limited to those where creatures
// actually occur (deepest is Ediacarium/Kambrium) — no empty deep-time tiles.
function flatPeriods(timeline) {
  const result = [];
  timeline.forEach(eon => eon.eras.forEach(era => {
    if (era.periods.length > 0) era.periods.forEach(p => result.push(p));
    else result.push(era); // fallback: use era as period-level
  }));
  return result.filter(p => CREATURES.some(c => creatureOverlapsPeriod(c, p)));
}

// Inline timeline: only Periode + Ma columns
function CreaturesTimeline({ timeline, feedbackMap, solvedMap, onPeriodClick }) {
  const periods = flatPeriods(timeline);

  return (
    <div className="flex w-full">
      {/* Period column – CLICKABLE */}
      <div className="flex flex-col flex-1">
        {periods.map(period => (
          <PeriodTile
            key={period.id}
            period={period}
            feedbackState={feedbackMap[period.id]}
            solvedCreatures={solvedMap[period.id] || []}
            onClick={() => onPeriodClick(period)}
          />
        ))}
      </div>

      {/* Ma column */}
      <div className="flex flex-col" style={{ width: '22%', minWidth: 52 }}>
        {periods.map(period => {
          const h = Math.max(52, calcHeight(period));
          return (
            <div key={period.id + '-ma'}
              className="flex items-start justify-center border-b border-border/30 bg-muted/30"
              style={{ height: `${h}px` }}>
              <span className="text-[10px] font-medium text-muted-foreground mt-1">{period.start_ma}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}