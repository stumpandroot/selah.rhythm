/**
 * SELAH RHYTHM - Mobile Header Component
 * Mobile header with personalized greeting and progress
 * Features:
 * - Personalized greeting (Good morning, etc.)
 * - Current time display with date
 * - Progress ring indicator
 * - Timer status indicator when running
 */

import React from 'react';
import Icons from '../shared/Icons';
import MiniProgressRing from '../ui/MiniProgressRing';

const MobileHeader = ({ profile, running, time, timerMode, onTimerClick, onSettingsClick, tasks, today }) => {
  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  // Get greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    const name = profile?.firstName;
    const timeGreeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
    return name ? `${timeGreeting}, ${name}` : timeGreeting;
  };

  // Calculate progress
  const todayTasks = tasks?.today || [];
  const completedCount = todayTasks.filter(t => t.done).length;
  const totalCount = todayTasks.length;

  return (
    <header className="mobile-header">
      <div className="mobile-header-content">
        <div className="mobile-header-title">
          <span className="mobile-logo-selah">Selah</span>
          <span className="mobile-logo-rhythm"> Rhythm</span>
        </div>
        <div className="mobile-header-subtitle">
          {getGreeting()} · {today?.shortDay}, {today?.shortMonth} {today?.date}
        </div>
      </div>

      <div className="mobile-header-right">
        {/* Timer indicator when running */}
        {running && (
          <button className="mobile-timer-pill" onClick={onTimerClick}>
            <span className={`mobile-timer-dot ${timerMode}`} />
            <span className="mobile-timer-time">{formatTime(time)}</span>
          </button>
        )}

        {/* Progress ring */}
        {totalCount > 0 && (
          <div className="mobile-progress">
            <MiniProgressRing completed={completedCount} total={totalCount} />
            <span className="mobile-progress-text">{completedCount}/{totalCount}</span>
          </div>
        )}

        <button className="mobile-header-btn" onClick={onSettingsClick}>
          <Icons.Settings />
        </button>
      </div>
    </header>
  );
};

export default MobileHeader;
