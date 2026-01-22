/**
 * useDailyReset Hook
 *
 * Manages daily reset logic for habits, reflections, and schedule events
 * Automatically resets data at midnight and on new week
 *
 * Features:
 * - Resets habits daily (unchecks all)
 * - Clears non-persistent schedule events
 * - Resets gratitude and reflections
 * - Archives completed tasks
 * - Resets habits weekly
 * - Checks every minute for day/week change
 *
 * @param {Object} options
 * @param {function} options.setHabits - Habits state setter
 * @param {function} options.setSchedEvents - Schedule events state setter
 * @param {function} options.setGratitude - Gratitude state setter
 * @param {function} options.setReflections - Reflections state setter
 * @param {function} options.setTasks - Tasks state setter
 *
 * @example
 * useDailyReset({
 *   setHabits,
 *   setSchedEvents,
 *   setGratitude,
 *   setReflections,
 *   setTasks
 * });
 */

import { useEffect, useCallback } from 'react';

// Helper to get ISO date string (YYYY-MM-DD)
const getTodayISO = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

// Helper to get ISO week number
const getWeekNumber = (d) => {
  const date = new Date(d.getTime());
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
  const week1 = new Date(date.getFullYear(), 0, 4);
  return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
};

export const useDailyReset = ({
  setHabits,
  setSchedEvents,
  setGratitude,
  setReflections,
  setTasks
}) => {
  const performDailyReset = useCallback(() => {
    const todayISO = getTodayISO();
    const lastReset = localStorage.getItem('selah_lastDailyResetISO') || '';

    if (lastReset !== todayISO) {
      console.log('[Selah] New day detected, performing daily reset');

      // Reset habits (clear checked states)
      setHabits(prev => {
        const reset = prev.map(h => ({ ...h, done: false }));
        localStorage.setItem('selah_habits', JSON.stringify(reset));
        return reset;
      });

      // Reset schedule events (keep only persistent)
      setSchedEvents(prev => {
        const persistent = prev.filter(e => e.persistent);
        localStorage.setItem('selah_schedEvents', JSON.stringify(persistent));
        return persistent;
      });

      // Archive completed tasks
      setTasks(prev => {
        const completedTasks = [
          ...prev.primary.filter(t => t.done),
          ...prev.today.filter(t => t.done),
          ...prev.thisWeek.filter(t => t.done),
          ...prev.later.filter(t => t.done)
        ].map(t => ({
          ...t,
          archivedAt: new Date().toISOString(),
          completedAt: t.completedAt || new Date().toISOString()
        }));

        const newTasks = {
          primary: prev.primary.filter(t => !t.done),
          today: prev.today.filter(t => !t.done),
          thisWeek: prev.thisWeek.filter(t => !t.done),
          later: prev.later.filter(t => !t.done),
          completed: [...(prev.completed || []), ...completedTasks].slice(-100) // Keep last 100
        };

        localStorage.setItem('selah_tasks', JSON.stringify(newTasks));
        return newTasks;
      });

      // Clear today's gratitude and reflection
      setGratitude('');
      setReflections({ mattered: '', released: '', wait: '' });
      localStorage.setItem('selah_gratitude', '""');
      localStorage.setItem('selah_reflections', JSON.stringify({ mattered: '', released: '', wait: '' }));

      // Update last reset date
      localStorage.setItem('selah_lastDailyResetISO', todayISO);
    }

    // Check for weekly habit reset
    const currentWeek = getWeekNumber(new Date());
    const lastResetWeek = localStorage.getItem('selah_last_habit_reset_week') || '';

    if (lastResetWeek !== String(currentWeek)) {
      console.log('[Selah] New week detected, resetting habit history');
      setHabits(prev => {
        const reset = prev.map(h => ({
          ...h,
          done: false,
          history: h.history || []
        }));
        localStorage.setItem('selah_habits', JSON.stringify(reset));
        return reset;
      });
      localStorage.setItem('selah_last_habit_reset_week', String(currentWeek));
    }
  }, [setHabits, setSchedEvents, setGratitude, setReflections, setTasks]);

  // Run on mount
  useEffect(() => {
    performDailyReset();
  }, [performDailyReset]);

  // Check every minute for day change
  useEffect(() => {
    const interval = setInterval(() => {
      performDailyReset();
    }, 60000); // 1 minute

    return () => clearInterval(interval);
  }, [performDailyReset]);
};

export default useDailyReset;
