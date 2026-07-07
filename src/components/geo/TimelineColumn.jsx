import React from 'react';
import { buildTimeline, calcHeight } from '@/lib/geoUtils';
import GeoTile from './GeoTile';

export default function TimelineColumn({
  mode = 'knowledge',
  feedbackMap = {},
  revealNames = {},
  solvedSet = new Set(),
  onTileClick,
  onInfoClick,
  isLandscape = false,
  locked = false,
}) {
  const timeline = buildTimeline();
  const isExpert = mode === 'expert';
  const isKnowledge = mode === 'knowledge';
  const isEons = mode === 'eons';

  // Whether a level's labels are naturally visible (without considering solved state)
  const eonLabelNatural    = !isExpert && mode !== 'eons';
  const eraLabelNatural    = isKnowledge || mode === 'eons' || mode === 'periods' || mode === 'combined';
  const periodLabelNatural = isKnowledge || mode === 'eons' || mode === 'eras' || mode === 'combined';

  // Whether a level is the "game target" (tiles on this level can be clicked as answers)
  const eonIsTarget    = isEons || isExpert;
  const eraIsTarget    = mode === 'eras' || mode === 'combined' || isExpert;
  const periodIsTarget = mode === 'periods' || mode === 'combined' || isExpert;

  /**
   * Returns { clickable, onClick } for a tile.
   *
   * Rules:
   * - Locked state: only highlighted (feedbackMap) tiles are clickable → open info
   * - Normal, unsolved game target: → game click (onTileClick)
   * - Label visible (naturally OR solved): → info click (onInfoClick)
   * - Otherwise: not clickable
   */
  const getTileProps = (item, isGameTarget, naturalLabel) => {
    const labelVisible = naturalLabel || solvedSet.has(item.id);

    if (locked) {
      const highlighted = item.id in feedbackMap;
      return {
        clickable: highlighted,
        onClick: highlighted ? () => onInfoClick?.(item) : undefined,
      };
    }

    if (isKnowledge) {
      return { clickable: true, onClick: () => onInfoClick?.(item) };
    }

    if (isGameTarget && !solvedSet.has(item.id)) {
      return { clickable: true, onClick: () => onTileClick?.(item) };
    }

    if (labelVisible) {
      return { clickable: true, onClick: () => onInfoClick?.(item) };
    }

    return { clickable: false, onClick: undefined };
  };

  const containerStyle = isLandscape
    ? { minWidth: '340px', width: '100%' }
    : { width: '100%' };

  return (
    <div className="flex" style={containerStyle}>
      {/* Eon column */}
      <div className="flex flex-col" style={{ width: '22%', minWidth: 56 }}>
        {timeline.map(eon => {
          const { clickable, onClick } = getTileProps(eon, eonIsTarget, eonLabelNatural);
          return (
            <GeoTile
              key={eon.id}
              item={eon}
              height={calcEonHeight(eon)}
              showLabel={eonLabelNatural || solvedSet.has(eon.id)}
              clickable={clickable}
              onClick={onClick}
              solved={solvedSet.has(eon.id)}
              feedbackState={feedbackMap[eon.id]}
              revealName={revealNames[eon.id]}
            />
          );
        })}
      </div>

      {/* Era column */}
      <div className="flex flex-col" style={{ width: '26%', minWidth: 64 }}>
        {timeline.map(eon =>
          eon.eras.length > 0 ? (
            eon.eras.map(era => {
              const { clickable, onClick } = getTileProps(era, eraIsTarget, eraLabelNatural);
              return (
                <GeoTile
                  key={era.id}
                  item={era}
                  height={calcEraHeight(era)}
                  showLabel={eraLabelNatural || solvedSet.has(era.id)}
                  clickable={clickable}
                  onClick={onClick}
                  solved={solvedSet.has(era.id)}
                  feedbackState={feedbackMap[era.id]}
                  revealName={revealNames[era.id]}
                />
              );
            })
          ) : (
            <GeoTile
              key={eon.id + '-era-empty'}
              item={eon}
              height={calcHeight(eon)}
              showLabel={false}
              clickable={false}
            />
          )
        )}
      </div>

      {/* Period column */}
      <div className="flex flex-col" style={{ width: '32%', minWidth: 72 }}>
        {timeline.map(eon =>
          eon.eras.length > 0 ? (
            eon.eras.map(era =>
              era.periods.length > 0 ? (
                era.periods.map(period => {
                  const { clickable, onClick } = getTileProps(period, periodIsTarget, periodLabelNatural);
                  return (
                    <GeoTile
                      key={period.id}
                      item={period}
                      height={calcHeight(period)}
                      showLabel={periodLabelNatural || solvedSet.has(period.id)}
                      clickable={clickable}
                      onClick={onClick}
                      solved={solvedSet.has(period.id)}
                      feedbackState={feedbackMap[period.id]}
                      revealName={revealNames[period.id]}
                    />
                  );
                })
              ) : (
                <GeoTile
                  key={era.id + '-period-empty'}
                  item={era}
                  height={calcEraHeight(era)}
                  showLabel={false}
                  clickable={false}
                />
              )
            )
          ) : (
            <GeoTile
              key={eon.id + '-period-empty'}
              item={eon}
              height={calcHeight(eon)}
              showLabel={false}
              clickable={false}
            />
          )
        )}
      </div>

      {/* Age (Ma) column — numbers sit exactly on the period transitions */}
      <div className="relative flex flex-col" style={{ width: '20%', minWidth: 48 }}>
        {/* 0 Ma at the very top (present day) */}
        <span className="absolute left-0 right-0 top-0 text-center text-[10px] font-semibold text-muted-foreground">
          0
        </span>
        {timeline.map(eon =>
          eon.eras.length > 0 ? (
            eon.eras.map(era =>
              era.periods.length > 0 ? (
                era.periods.map(period => (
                  <div
                    key={period.id + '-ma'}
                    className="relative"
                    style={{ height: `${calcHeight(period)}px` }}
                  >
                    <span className="absolute left-0 right-0 bottom-0 translate-y-1/2 text-center text-[10px] font-medium text-muted-foreground">
                      {period.start_ma}
                    </span>
                  </div>
                ))
              ) : (
                <div
                  key={era.id + '-ma'}
                  className="relative"
                  style={{ height: `${calcEraHeight(era)}px` }}
                >
                  <span className="absolute left-0 right-0 bottom-0 translate-y-1/2 text-center text-[10px] font-medium text-muted-foreground">
                    {era.start_ma}
                  </span>
                </div>
              )
            )
          ) : (
            <div
              key={eon.id + '-ma'}
              className="relative"
              style={{ height: `${calcHeight(eon)}px` }}
            >
              <span className="absolute left-0 right-0 bottom-0 translate-y-1/2 text-center text-[10px] font-medium text-muted-foreground">
                {eon.start_ma}
              </span>
            </div>
          )
        )}
      </div>
    </div>
  );
}

function calcEraHeight(era) {
  if (era.periods && era.periods.length > 0) {
    return era.periods.reduce((sum, p) => sum + calcHeight(p), 0);
  }
  return calcHeight(era);
}

function calcEonHeight(eon) {
  if (eon.eras && eon.eras.length > 0) {
    return eon.eras.reduce((sum, era) => sum + calcEraHeight(era), 0);
  }
  return calcHeight(eon);
}