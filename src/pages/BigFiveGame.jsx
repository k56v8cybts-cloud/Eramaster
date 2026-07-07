import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Trophy, X as XIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BigFiveTimeline from '@/components/geo/BigFiveTimeline';
import ResultScreen from '@/components/geo/ResultScreen';
import { BIG_FIVE_ITEMS, shuffle } from '@/lib/bigFiveData';
import { saveRun } from './Leaderboard';

const FEEDBACK_DURATION = 1200;

export default function BigFiveGame() {
  const { gameType } = useParams();
  const navigate = useNavigate();

  const [queue, setQueue] = useState([]);
  const [currentItem, setCurrentItem] = useState(null);
  const [solvedSet, setSolvedSet] = useState(new Set());
  const [errors, setErrors] = useState(0);
  const [feedbackMap, setFeedbackMap] = useState({});
  const [finished, setFinished] = useState(false);
  const [failed, setFailed] = useState(false);
  const startTime = useRef(Date.now());
  const [elapsed, setElapsed] = useState(0);
  const feedbackTimer = useRef(null);

  const initGame = useCallback(() => {
    const shuffled = shuffle(BIG_FIVE_ITEMS);
    setQueue(shuffled.slice(1));
    setCurrentItem(shuffled[0]);
    setSolvedSet(new Set());
    setErrors(0);
    setFeedbackMap({});
    setFinished(false);
    setFailed(false);
    startTime.current = Date.now();
  }, []);

  useEffect(() => { initGame(); }, [initGame]);

  const advanceToNext = useCallback((currentQueue) => {
    if (currentQueue.length === 0) {
      setCurrentItem(null);
      setElapsed(Date.now() - startTime.current);
      setFinished(true);
    } else {
      setCurrentItem(currentQueue[0]);
      setQueue(currentQueue.slice(1));
    }
    setFeedbackMap({});
  }, []);

  // clicked = { id, type }
  const handleClick = useCallback((clicked) => {
    if (!currentItem) return;
    if (solvedSet.has(clicked.id)) return;
    if (feedbackTimer.current) clearTimeout(feedbackTimer.current);

    const isCorrect = clicked.id === currentItem.id;

    if (isCorrect) {
      setSolvedSet(prev => new Set([...prev, clicked.id]));
      setFeedbackMap({ [clicked.id]: 'correct' });
      feedbackTimer.current = setTimeout(() => advanceToNext(queue), 600);
    } else {
      setErrors(e => e + 1);
      setFeedbackMap({ [clicked.id]: 'wrong', [currentItem.id]: 'reveal' });

      if (gameType === 'exam') {
        feedbackTimer.current = setTimeout(() => {
          setElapsed(Date.now() - startTime.current);
          setFailed(true);
          setFinished(true);
        }, FEEDBACK_DURATION);
      } else {
        feedbackTimer.current = setTimeout(() => {
          // Put currentItem back at a random position in the remaining queue
          const pos = queue.length === 0 ? 0 : Math.floor(Math.random() * queue.length) + 1;
          const newQueue = [...queue];
          newQueue.splice(pos, 0, currentItem);
          advanceToNext(newQueue);
        }, FEEDBACK_DURATION);
      }
    }
  }, [currentItem, solvedSet, queue, advanceToNext, gameType]);

  useEffect(() => {
    if (finished) {
      saveRun({ modeId: 'bigfive', gameType, errors, total: BIG_FIVE_ITEMS.length, elapsed });
    }
  }, [finished]);

  if (finished) {
    return (
      <ResultScreen
        errors={errors}
        total={BIG_FIVE_ITEMS.length}
        elapsed={elapsed}
        failed={failed}
        gameType={gameType}
        onReplay={initGame}
        onModeMenu={() => navigate('/mode/bigfive')}
      />
    );
  }

  return (
    <div className="flex flex-col bg-background" style={{ height: '100dvh' }}>
      {/* Header */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="flex items-center justify-between px-3 py-2">
          <Button variant="ghost" size="icon" onClick={() => navigate('/mode/bigfive')} className="h-8 w-8">
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
              {solvedSet.size}/{BIG_FIVE_ITEMS.length}
            </span>
            <span className="flex items-center gap-1 text-destructive">
              <XIcon className="h-3.5 w-3.5" />
              {errors}
            </span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {currentItem && (
            <motion.div
              key={currentItem.id}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="px-4 pb-3 text-center"
            >
              <p className="text-xs text-muted-foreground mb-0.5">{currentItem.label} – Finde:</p>
              <p className="text-lg font-display font-bold text-foreground">{currentItem.fullName}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex border-t border-border bg-muted/50">
          <div className="flex-1 text-[10px] font-semibold text-muted-foreground text-center py-1.5">Periode</div>
          <div className="text-[10px] font-semibold text-muted-foreground text-center py-1.5" style={{ width: '22%', minWidth: 52 }}>Ma</div>
        </div>
      </div>

      <div className="flex-1 overflow-auto hide-scrollbar">
        <BigFiveTimeline
          feedbackMap={feedbackMap}
          solvedSet={solvedSet}
          onBoundaryClick={handleClick}
        />
      </div>
    </div>
  );
}