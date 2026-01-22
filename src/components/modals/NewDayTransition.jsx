/**
 * SELAH RHYTHM - New Day Transition
 * v0.9.45
 *
 * Morning greeting overlay with yesterday's summary
 * Gentle transition into a new day with encouraging message and optional stats
 */

import React from 'react';

/**
 * NewDayTransition - Morning greeting with yesterday's summary
 *
 * @param {boolean} show - Whether to display the transition overlay
 * @param {Object} stats - Optional stats object with completed task count
 * @param {number} stats.completed - Number of tasks completed yesterday
 * @param {string} name - Optional user's first name for personalization
 * @param {Function} onDismiss - Callback when user taps to dismiss
 *
 * @example
 * <NewDayTransition
 *   show={isNewDay}
 *   stats={{ completed: 5 }}
 *   name="Sarah"
 *   onDismiss={() => setShowNewDay(false)}
 * />
 *
 * Displays one of four random encouraging messages:
 * - "His mercies are new this morning."
 * - "A fresh day awaits."
 * - "Begin again, with grace."
 * - "Today is gift. Receive it."
 */
const NewDayTransition = ({ show, stats, name, onDismiss }) => {
  if (!show) return null;

  const messages = [
    "His mercies are new this morning.",
    "A fresh day awaits.",
    "Begin again, with grace.",
    "Today is gift. Receive it."
  ];
  const message = messages[Math.floor(Math.random() * messages.length)];

  return (
    <div className="new-day-overlay" onClick={onDismiss}>
      <div className="new-day-card">
        <div className="new-day-greeting">Good morning{name ? `, ${name}` : ''}</div>
        <div className="new-day-message">{message}</div>
        {stats && stats.completed > 0 && (
          <div className="new-day-stats">
            Yesterday you completed {stats.completed} task{stats.completed !== 1 ? 's' : ''}.
          </div>
        )}
        <div className="new-day-hint">tap anywhere to begin</div>
      </div>
    </div>
  );
};

export default NewDayTransition;
