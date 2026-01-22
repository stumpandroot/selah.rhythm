/**
 * SELAH RHYTHM - Mini Progress Ring Component
 * Small circular progress indicator for mobile header
 * Displays completion ratio as a circular ring
 */

import React from 'react';

const MiniProgressRing = ({ completed, total }) => {
  const radius = 9;
  const circumference = 2 * Math.PI * radius;
  const progress = total > 0 ? (completed / total) : 0;
  const offset = circumference - (progress * circumference);

  return (
    <svg className="mobile-progress-ring" width="22" height="22" viewBox="0 0 22 22">
      <circle
        className="mobile-progress-track"
        cx="11" cy="11" r={radius}
        fill="none" strokeWidth="2.5"
      />
      <circle
        className="mobile-progress-fill"
        cx="11" cy="11" r={radius}
        fill="none" strokeWidth="2.5"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform="rotate(-90 11 11)"
      />
    </svg>
  );
};

export default MiniProgressRing;
