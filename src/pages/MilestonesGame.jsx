import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Trophy, X as XIcon, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { buildTimeline, calcHeight } from '@/lib/geoUtils';
import ResultScreen from '@/components/geo/ResultScreen';
import { MILESTONES, CATEGORY_COLORS, CATEGORY_LABELS, getMa, isRange, shuffle } from '@/lib/milestonesData';
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

// Check if milestone overlaps with a geo tile (period or era)
function milestoneOverlapsTile(milestone, tile) {
  const mStart = milestone.ma !== undefined ? milestone.ma : milestone.ma_from;
  const mEnd = milestone.ma !== undefined ? milestone.ma : milestone.ma_to;
  return mStart >= tile.end_ma && mEnd <= tile.start_ma;
}

// Build filtered timeline: only eons/eras/periods that contain milestones
function buildFilteredTimeline() {
  const timeline = buildTimeline();
  return timeline
    .map(eon => ({
      ...eon,
      eras: eon.eras
        .map(era => ({
          ...era,
          periods: (era.periods || []).filter(p => MILESTONES.some(m => milestoneOverlapsTile(m, p)))
        }))
        .filter(era => MILESTONES.some(m => milestoneOverlapsTile(m, era)))
    }))
    .filter(eon => MILESTONES.some(m => milestoneOverlapsTile(m, eon)));
}

// Flat list of target tiles: periods (with milestones) + eras without periods (with milestones)
function getTargetTiles(filteredTimeline) {
  const tiles = [];
  filteredTimeline.forEach(eon => {
    eon.eras.forEach(era => {
      if (era.periods.length > 0) {
        era.periods.forEach(p => tiles.push(p));
      } else {
        tiles.push(era);
      }
    });
  });
  return tiles;
}

function calcEraHeight(era) {
  if (era.periods?.length > 0) return era.periods.reduce((s, p) => s + Math.max(52, calcHeight(p)), 0);
  return Math.max(52, calcHeight(era));
}
function calcEonHeight(eon) {
  if (eon.eras?.length > 0) return eon.eras.reduce((s, era) => s + calcEraHeight(era), 0);
  return Math.max(52, calcHeight(eon));
}

// Non-clickable reference tile (eon / era columns)
function RefTile({ item, height }) {
  const textColor = getContrastColor(item.color);
  return (
    <div className="flex items-center justify-center border-b border-black/10 select-none"
      style={{ height: `${height}px`, backgroundColor: item.color, color: textColor }}>
      <span className="text-xs font-semibold text-center px-1 break-words"
        style={{ textShadow: '0 1px 2px rgba(0,0,0,0.15)', lineHeight: 1.25 }} lang="de">
        {item.name}
      </span>
    </div>
  );
}

// Clickable target tile (period column)
function TargetTile({ tile, feedbackState, solvedMilestones, onClick }) {
  const isCorrect = feedbackState === 'correct';
  const isWrong = feedbackState === 'wrong';
  const isReveal = feedbackState === 'reveal';

  let bg = tile.color;
  let textColor = getContrastColor(tile.color);
  let border = 'rgba(0,0,0,0.12)';

  if (isCorrect || isReveal) { bg = '#16a34a'; textColor = '#fff'; border = '#15803d'; }
  else if (isWrong) { bg = '#ef4444'; textColor = '#fff'; border = '#dc2626'; }

  const h = Math.max(52, calcHeight(tile));

  return (
    <motion.div
      className="relative flex flex-col items-center justify-start border-b select-none cursor-pointer px-1 py-1"
      style={{ height: `${h}px`, backgroundColor: bg, color: textColor, borderColor: border, overflow: 'hidden' }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
    >
      <span className="text-xs font-semibold text-center break-words w-full"
        style={{ textShadow: '0 1px 2px rgba(0,0,0,0.15)', lineHeight: 1.25 }} lang="de">
        {tile.name}
      </span>
      {/* Solved milestone chips */}
      {solvedMilestones?.length > 0 && (
        <div className="flex flex-wrap gap-0.5 justify-center mt-0.5">
          {solvedMilestones.map(m => (
            <span key={m.id} className="text-[8px] font-semibold px-1 py-0.5 rounded leading-tight"
              style={{ backgroundColor: 'rgba(255,255,255,0.25)' }}>
              {m.shortName}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
}

export default function MilestonesGame() {
  const { gameType } = useParams();
  const navigate = useNavigate();

  const [filteredTimeline] = useState(() => buildFilteredTimeline());
  const [targetTiles] = useState(() => getTargetTiles(buildFilteredTimeline()));
  const [infoItem, setInfoItem] = useState(null);
  const [queue, setQueue] = useState([]);
  const [current, setCurrent] = useState(null);
  const [solvedMap, setSolvedMap] = useState({}); // tileId → [milestones]
  const [errors, setErrors] = useState(0);
  const [solvedCount, setSolvedCount] = useState(0);
  const [feedbackMap, setFeedbackMap] = useState({}); // tileId → 'correct'|'wrong'|'reveal'
  const [finished, setFinished] = useState(false);
  const [failed, setFailed] = useState(false);
  const startTime = useRef(Date.now());
  const [elapsed, setElapsed] = useState(0);
  const feedbackTimer = useRef(null);

  const initGame = useCallback(() => {
    const shuffled = shuffle(MILESTONES);
    setQueue(shuffled.slice(1));
    setCurrent(shuffled[0]);
    setSolvedMap({});
    setErrors(0);
    setSolvedCount(0);
    setFeedbackMap({});
    setFinished(false);
    setFailed(false);
    startTime.current = Date.now();
  }, []);

  useEffect(() => { initGame(); }, [initGame]);

  const advanceToNext = useCallback((nextQueue) => {
    setFeedbackMap({});
    if (nextQueue.length === 0) {
      setCurrent(null);
      setElapsed(Date.now() - startTime.current);
      setFinished(true);
    } else {
      setCurrent(nextQueue[0]);
      setQueue(nextQueue.slice(1));
    }
  }, []);

  const handleTileClick = useCallback((tile) => {
    if (!current) return;
    if (feedbackTimer.current) clearTimeout(feedbackTimer.current);

    const correctTileIds = targetTiles
      .filter(t => milestoneOverlapsTile(current, t))
      .map(t => t.id);

    const isCorrect = correctTileIds.includes(tile.id);

    if (isCorrect) {
      setSolvedMap(prev => ({
        ...prev,
        [tile.id]: [...(prev[tile.id] || []), current],
      }));
      setSolvedCount(c => c + 1);
      setFeedbackMap({ [tile.id]: 'correct' });
      feedbackTimer.current = setTimeout(() => advanceToNext(queue), CORRECT_DURATION);
    } else {
      setErrors(e => e + 1);
      const newFb = { [tile.id]: 'wrong' };
      correctTileIds.forEach(id => { newFb[id] = 'reveal'; });
      setFeedbackMap(newFb);

      if (gameType === 'exam') {
        feedbackTimer.current = setTimeout(() => {
          setElapsed(Date.now() - startTime.current);
          setFailed(true);
          setFinished(true);
        }, FEEDBACK_DURATION);
      } else {
        feedbackTimer.current = setTimeout(() => {
          const pos = queue.length === 0 ? 0 : Math.floor(Math.random() * queue.length) + 1;
          const newQueue = [...queue];
          newQueue.splice(pos, 0, current);
          advanceToNext(newQueue);
        }, FEEDBACK_DURATION);
      }
    }
  }, [current, targetTiles, queue, advanceToNext, gameType]);

  useEffect(() => {
    if (finished) {
      saveRun({ modeId: 'milestones', gameType, errors, total: MILESTONES.length, elapsed });
    }
  }, [finished]);

  if (finished) {
    return (
      <ResultScreen
        errors={errors}
        total={MILESTONES.length}
        elapsed={elapsed}
        failed={failed}
        gameType={gameType}
        onReplay={initGame}
        onModeMenu={() => navigate('/mode/milestones')}
      />
    );
  }

  return (
    <div className="flex flex-col bg-background" style={{ height: '100dvh' }}>
      {/* Header */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="flex items-center justify-between px-3 py-2">
          <Button variant="ghost" size="icon" onClick={() => navigate('/mode/milestones')} className="h-8 w-8">
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
              {solvedCount}/{MILESTONES.length}
            </span>
            <span className="flex items-center gap-1 text-destructive">
              <XIcon className="h-3.5 w-3.5" />
              {errors}
            </span>
          </div>
        </div>

        {/* Current milestone */}
        <AnimatePresence mode="wait">
          {current && (
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="px-4 pb-3"
            >
              <div className="flex items-start gap-2">
                <div
                  className="flex-shrink-0 w-2.5 h-2.5 rounded-full mt-1.5"
                  style={{ backgroundColor: CATEGORY_COLORS[current.category] || '#6366f1' }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">{CATEGORY_LABELS[current.category]}</p>
                  <div className="flex items-center gap-1.5">
                    <p className="text-base font-display font-bold text-foreground leading-tight">{current.name}</p>
                    <button
                      className="flex-shrink-0 text-muted-foreground hover:text-primary transition-colors"
                      onClick={() => setInfoItem(current)}
                    >
                      <Info className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Tippe auf die Periode, in der dieses Ereignis stattfand</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Column headers */}
        <div className="flex border-t border-border bg-muted/50">
          <div className="text-[10px] font-semibold text-muted-foreground text-center py-1.5" style={{ width: '22%' }}>Äon</div>
          <div className="text-[10px] font-semibold text-muted-foreground text-center py-1.5" style={{ width: '26%' }}>Ära</div>
          <div className="text-[10px] font-semibold text-muted-foreground text-center py-1.5" style={{ width: '32%' }}>Periode</div>
          <div className="text-[10px] font-semibold text-muted-foreground text-center py-1.5" style={{ width: '20%' }}>Ma</div>
        </div>
      </div>

      {/* Timeline */}
      <div className="flex-1 overflow-auto hide-scrollbar">
        <div className="flex w-full">
          {/* Eon column */}
          <div className="flex flex-col" style={{ width: '22%', minWidth: 56 }}>
            {filteredTimeline.map(eon => <RefTile key={eon.id} item={eon} height={calcEonHeight(eon)} />)}
          </div>
          {/* Era column */}
          <div className="flex flex-col" style={{ width: '26%', minWidth: 64 }}>
            {filteredTimeline.map(eon =>
              eon.eras.map(era => <RefTile key={era.id} item={era} height={calcEraHeight(era)} />)
            )}
          </div>
          {/* Period column – CLICKABLE */}
          <div className="flex flex-col" style={{ width: '32%', minWidth: 72 }}>
            {filteredTimeline.map(eon =>
              eon.eras.map(era =>
                era.periods.length > 0
                  ? era.periods.map(period => (
                      <TargetTile
                        key={period.id}
                        tile={period}
                        feedbackState={feedbackMap[period.id]}
                        solvedMilestones={solvedMap[period.id]}
                        onClick={() => handleTileClick(period)}
                      />
                    ))
                  : (
                      <TargetTile
                        key={era.id + '-as-period'}
                        tile={era}
                        feedbackState={feedbackMap[era.id]}
                        solvedMilestones={solvedMap[era.id]}
                        onClick={() => handleTileClick(era)}
                      />
                    )
              )
            )}
          </div>
          {/* Ma column */}
          <div className="relative flex flex-col" style={{ width: '20%', minWidth: 48 }}>
            <span className="absolute left-0 right-0 top-0 text-center text-[10px] font-semibold text-muted-foreground">0</span>
            {filteredTimeline.map(eon =>
              eon.eras.map(era =>
                era.periods.length > 0
                  ? era.periods.map(period => (
                      <div key={period.id + '-ma'} className="relative" style={{ height: `${Math.max(52, calcHeight(period))}px` }}>
                        <span className="absolute left-0 right-0 bottom-0 translate-y-1/2 text-center text-[10px] font-medium text-muted-foreground">
                          {period.start_ma}
                        </span>
                      </div>
                    ))
                  : (
                      <div key={era.id + '-ma'} className="relative" style={{ height: `${calcEraHeight(era)}px` }}>
                        <span className="absolute left-0 right-0 bottom-0 translate-y-1/2 text-center text-[10px] font-medium text-muted-foreground">
                          {era.start_ma}
                        </span>
                      </div>
                    )
              )
            )}
          </div>
        </div>
      </div>

      {/* Info modal */}
      <AnimatePresence>
        {infoItem && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setInfoItem(null)}
          >
            <motion.div
              className="w-full max-w-lg bg-card rounded-t-2xl shadow-2xl overflow-hidden"
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="h-2" style={{ backgroundColor: CATEGORY_COLORS[infoItem.category] || '#6366f1' }} />
              <div className="px-5 pt-4 pb-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider"
                      style={{ color: CATEGORY_COLORS[infoItem.category] || '#6366f1' }}>
                      {CATEGORY_LABELS[infoItem.category]}
                    </span>
                    <h2 className="text-lg font-display font-bold text-foreground mt-0.5">{infoItem.name}</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {isRange(infoItem)
                        ? `${infoItem.ma_from}–${infoItem.ma_to} Ma`
                        : `~${infoItem.ma} Ma`}
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setInfoItem(null)} className="h-8 w-8 -mr-2 -mt-1">
                    <XIcon className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-foreground leading-relaxed">{infoItem.fact}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}