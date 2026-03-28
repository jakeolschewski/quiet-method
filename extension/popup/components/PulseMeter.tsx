/**
 * PulseMeter — Animated circular gauge showing overload score (0-100%).
 * Uses SVG with a gradient arc and smooth animation.
 *
 * © WEDGE METHOD LLC
 */

import React, { useEffect, useRef } from 'react';

interface PulseMeterProps {
  score: number; // 0-1
  isCalibrating?: boolean;
}

export default function PulseMeter({ score, isCalibrating = false }: PulseMeterProps) {
  const percentage = Math.round(score * 100);
  const prevPercentRef = useRef(percentage);

  // Animated value
  const [displayPercent, setDisplayPercent] = React.useState(percentage);

  useEffect(() => {
    const start = prevPercentRef.current;
    const end = percentage;
    const duration = 600;
    const startTime = performance.now();

    function animate(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (end - start) * eased);
      setDisplayPercent(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }

    requestAnimationFrame(animate);
    prevPercentRef.current = end;
  }, [percentage]);

  // SVG arc math
  const size = 160;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const arcLength = circumference * 0.75; // 270 degrees
  const offset = arcLength - (arcLength * (displayPercent / 100));

  // Color based on score
  const getColor = (pct: number) => {
    if (pct < 30) return '#22c55e'; // green — calm
    if (pct < 50) return '#84cc16'; // lime — mild
    if (pct < 70) return '#eab308'; // yellow — moderate
    if (pct < 85) return '#f97316'; // orange — elevated
    return '#ef4444'; // red — overloaded
  };

  const color = getColor(displayPercent);

  const getLabel = (pct: number) => {
    if (pct < 30) return 'Calm';
    if (pct < 50) return 'Focused';
    if (pct < 70) return 'Busy';
    if (pct < 85) return 'Elevated';
    return 'Overloaded';
  };

  return (
    <div className="pulse-meter">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: 'rotate(135deg)' }}
      >
        {/* Background arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${arcLength} ${circumference}`}
        />

        {/* Active arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${arcLength} ${circumference}`}
          strokeDashoffset={offset}
          style={{
            transition: 'stroke 0.6s ease',
            filter: `drop-shadow(0 0 8px ${color}40)`,
          }}
        />

        {/* Glow effect */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth + 4}
          strokeLinecap="round"
          strokeDasharray={`${arcLength} ${circumference}`}
          strokeDashoffset={offset}
          opacity={0.15}
          style={{ filter: 'blur(6px)' }}
        />
      </svg>

      {/* Center text */}
      <div className="pulse-meter-center">
        {isCalibrating ? (
          <>
            <div className="pulse-meter-calibrating">
              <div className="calibrating-dot" />
              <span>Calibrating</span>
            </div>
            <div className="pulse-meter-sublabel">Learning your patterns…</div>
          </>
        ) : (
          <>
            <div className="pulse-meter-value" style={{ color }}>
              {displayPercent}
              <span className="pulse-meter-percent">%</span>
            </div>
            <div className="pulse-meter-label">{getLabel(displayPercent)}</div>
          </>
        )}
      </div>
    </div>
  );
}
