/**
 * SELAH RHYTHM - Deep Work Progress Bar
 * v0.9.45
 *
 * Ambient timer visualization that appears at the top of the screen
 * Shows timer progress as a growing bar (focus sessions in primary color, breaks in rest color)
 */

import React from 'react';

/**
 * DeepWorkBar - Top-of-screen progress bar showing timer status
 *
 * @param {boolean} running - Whether timer is currently running
 * @param {number} time - Remaining time in seconds
 * @param {number} preset - Initial timer duration in minutes
 * @param {string} timerMode - Type of timer session ('focus', 'shortBreak', 'longBreak')
 *
 * @example
 * <DeepWorkBar
 *   running={true}
 *   time={900}
 *   preset={25}
 *   timerMode="focus"
 * />
 */
const DeepWorkBar = ({ running, time, preset, timerMode }) => {
  if (!running) return null;

  const totalSeconds = preset * 60;
  const elapsed = totalSeconds - time;
  const progress = Math.min((elapsed / totalSeconds) * 100, 100);
  const isComplete = time <= 0;

  return (
    <div className="deep-work-bar">
      <div
        className={`deep-work-bar-fill${timerMode !== 'focus' ? ' break' : ''}${isComplete ? ' complete' : ''}`}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default DeepWorkBar;
