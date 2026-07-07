import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useOrientation } from '@/hooks/useOrientation';
import { getGameItems, shuffle, isClickable } from '@/lib/geoUtils';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TimelineColumn from '@/components/geo/TimelineColumn';
import InfoOverlay from '@/components/geo/InfoOverlay';
import GameHeader from '@/components/geo/GameHeader';
import ResultScreen from '@/components/geo/ResultScreen';
import { saveRun } from './Leaderboard';

const FEEDBACK_DURATION = 1200;

export default function Game() {
  const { modeId, gameType } = useParams(); // gameType: 'training' | 'exam'
  const navigate = useNavigate();
  const isLandscape = useOrientation();

  const [gameItems, setGameItems] = useState([]);
  const [queue, setQueue] = useState([]);
  const [currentItem, setCurrentItem] = useState(null);
  const [solvedSet, setSolvedSet] = useState(new Set());
  const [errors, setErrors] = useState(0);
  const [feedbackMap, setFeedbackMap] = useState({});
  const [revealNames, setRevealNames] = useState({});
  const [finished, setFinished] = useState(false);
  const [failed, setFailed] = useState(false); // exam: game over on first mistake
  const [waitingForConfirm, setWaitingForConfirm] = useState(false);
  const [selectedInfo, setSelectedInfo] = useState(null);
  const startTime = useRef(Date.now());
  const [elapsed, setElapsed] = useState(0);
  const feedbackTimer = useRef(null);

  const initGame = useCallback(() => {
    const items = getGameItems(modeId);
    setGameItems(items);
    const shuffled = shuffle(items);
    setQueue(shuffled.slice(1));
    setCurrentItem(shuffled[0]);
    setSolvedSet(new Set());
    setErrors(0);
    setFeedbackMap({});
    setRevealNames({});
    setFinished(false);
    setFailed(false);
    setWaitingForConfirm(false);
    startTime.current = Date.now();
  }, [modeId]);

  useEffect(() => { initGame(); }, [initGame]);

  const advanceToNext = useCallback((currentQueue) => {
    if (currentQueue.length === 0) {
      const el = Date.now() - startTime.current;
      setCurrentItem(null);
      setElapsed(el);
      setFinished(true);
    } else {
      setCurrentItem(currentQueue[0]);
      setQueue(currentQueue.slice(1));
    }
    setFeedbackMap({});
    setRevealNames({});
  }, []);

  const handleTileClick = useCallback((clickedItem) => {
    // Locked state: all clicks are routed via onInfoClick in TimelineColumn, nothing to do here
    if (waitingForConfirm) return;
    if (!currentItem) return;
    if (solvedSet.has(clickedItem.id)) return;
    if (!isClickable(clickedItem, modeId)) return;
    if (feedbackTimer.current) clearTimeout(feedbackTimer.current);

    if (clickedItem.id === currentItem.id) {
      // CORRECT
      const newSolved = new Set([...solvedSet, clickedItem.id]);
      setFeedbackMap({ [clickedItem.id]: 'correct' });
      setSolvedSet(newSolved);
      feedbackTimer.current = setTimeout(() => {
        advanceToNext(queue);
      }, 600);
    } else {
      // WRONG
      const newErrors = errors + 1;
      setErrors(newErrors);
      setFeedbackMap({ [clickedItem.id]: 'wrong', [currentItem.id]: 'reveal' });
      setRevealNames({ [clickedItem.id]: clickedItem.name, [currentItem.id]: currentItem.name });

      if (gameType === 'exam') {
        // Exam: short flash then game over
        feedbackTimer.current = setTimeout(() => {
          const el = Date.now() - startTime.current;
          setElapsed(el);
          setFailed(true);
          setFinished(true);
        }, FEEDBACK_DURATION);
      } else {
        // Training: keep feedback visible until player confirms
        setWaitingForConfirm(true);
      }
    }
  }, [currentItem, solvedSet, modeId, queue, advanceToNext, errors, gameType]);

  const handleConfirmWrong = useCallback(() => {
    const pos = queue.length === 0 ? 0 : Math.floor(Math.random() * queue.length) + 1;
    const newQueue = [...queue];
    newQueue.splice(pos, 0, currentItem);
    setWaitingForConfirm(false);
    setFeedbackMap({});
    setRevealNames({});
    advanceToNext(newQueue);
  }, [queue, currentItem, advanceToNext]);

  // Save run when finished
  useEffect(() => {
    if (finished) {
      saveRun({ modeId, gameType, errors, total: gameItems.length, elapsed });
    }
  }, [finished]);

  if (finished) {
    return (
      <ResultScreen
        errors={errors}
        total={gameItems.length}
        elapsed={elapsed}
        failed={failed}
        gameType={gameType}
        onReplay={initGame}
        onModeMenu={() => navigate(`/mode/${modeId}`)}
      />
    );
  }

  return (
    <div className="flex flex-col bg-background" style={{ height: '100dvh' }}>
      <GameHeader
        currentItem={currentItem}
        errors={errors}
        solved={solvedSet.size}
        total={gameItems.length}
        gameType={gameType}
        onBack={() => navigate(`/mode/${modeId}`)}
      />
      {/* Portrait: vertical scroll. Landscape: horizontal scroll. */}
      <div
        className="flex-1 hide-scrollbar"
        style={{ overflow: isLandscape ? 'auto' : 'auto' }}
      >
        <TimelineColumn
          mode={modeId}
          feedbackMap={feedbackMap}
          revealNames={revealNames}
          solvedSet={solvedSet}
          onTileClick={handleTileClick}
          onInfoClick={(item) => setSelectedInfo(item)}
          isLandscape={isLandscape}
          locked={waitingForConfirm}
        />
      </div>

      {/* Confirm button after wrong answer */}
      {selectedInfo && (
        <InfoOverlay item={selectedInfo} onClose={() => setSelectedInfo(null)} />
      )}

      {waitingForConfirm && (
        <div className="shrink-0 px-4 py-3 border-t border-border bg-background/95 backdrop-blur-md">
          <Button
            onClick={handleConfirmWrong}
            className="w-full gap-2 bg-destructive/90 hover:bg-destructive text-destructive-foreground"
          >
            Verstanden – Weiter
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}