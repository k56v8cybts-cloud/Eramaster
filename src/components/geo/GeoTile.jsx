import React from 'react';
import { motion } from 'framer-motion';

export default function GeoTile({
  item,
  height,
  showLabel = true,
  clickable = false,
  feedbackState = null, // 'correct', 'wrong', 'reveal'
  revealName = null,
  solved = false,
  onClick,
}) {
  const isCorrect = feedbackState === 'correct';
  const isWrong = feedbackState === 'wrong';
  const isReveal = feedbackState === 'reveal';

  let bgColor = item.color;
  let borderColor = 'rgba(0,0,0,0.12)';
  let textColor = getContrastColor(item.color);

  if (isCorrect || isReveal) {
    bgColor = '#22c55e';
    borderColor = '#16a34a';
    textColor = '#fff';
  } else if (isWrong) {
    bgColor = '#ef4444';
    borderColor = '#dc2626';
    textColor = '#fff';
  }

  const displayName = isWrong && revealName ? revealName : (isReveal && revealName ? revealName : item.name);

  return (
    <motion.div
      className="relative flex items-center justify-center border-b select-none overflow-hidden"
      style={{
        height: `${height}px`,
        backgroundColor: bgColor,
        borderColor: borderColor,
        color: textColor,
        cursor: clickable ? 'pointer' : 'default',
        opacity: clickable ? 1 : (solved ? 1 : 0.85),
      }}
      whileTap={clickable ? { scale: 0.97 } : {}}
      onClick={clickable ? onClick : undefined}
      layout
    >
      {(showLabel || solved || isCorrect || isWrong || isReveal) && (
        <span
          className="text-xs font-semibold text-center px-1 pointer-events-none break-words hyphens-auto"
          style={{
            color: textColor,
            textShadow: '0 1px 2px rgba(0,0,0,0.15)',
            lineHeight: '1.25',
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
            maxWidth: '100%',
            display: 'block',
          }}
          lang="de"
        >
          {displayName}
        </span>
      )}
    </motion.div>
  );
}

// Determine if text should be white or black based on background
function getContrastColor(hex) {
  const c = hex.replace('#', '');
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.55 ? '#1a1a2e' : '#ffffff';
}