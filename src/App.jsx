/**
 * SELAH RHYTHM - Main Application Component
 * v0.9.45
 *
 * ARCHITECTURE OVERVIEW:
 * =====================
 * This is the root application component that orchestrates the entire Selah Rhythm app.
 * It manages all global state, handles routing between three main modes (Order, Focus, Rest),
 * and coordinates communication between child components.
 *
 * KEY RESPONSIBILITIES:
 * ---------------------
 * 1. STATE MANAGEMENT: 40+ useState hooks managing:
 *    - Tasks (primary, today, thisWeek, later, completed)
 *    - Habits with weekly history tracking
 *    - Anchors (daily routines)
 *    - Prayers and gratitude entries
 *    - Timer state and presets
 *    - Settings and user profile
 *    - UI state (modals, toasts, mobile navigation)
 *    - Daily reflections
 *
 * 2. DAILY RESET LOGIC:
 *    - Automatic daily reset at midnight (habits, reflections, schedule events)
 *    - Weekly habit reset
 *    - Task archiving system
 *    - Weekly reflection prompts (Sunday evenings)
 *
 * 3. LIFECYCLE EFFECTS (useEffect hooks):
 *    - Daily reset monitoring (checks every minute)
 *    - New day transition detection
 *    - Keyboard shortcuts (1-3 for modes, Space for timer, N for quick-add, S for settings, Esc for modals)
 *    - Theme switching with transition guard to prevent jank
 *    - Timer countdown logic
 *    - Mobile scroll behavior and tab bar collapse
 *    - Background layer crossfade on mode change
 *    - localStorage persistence for all state
 *
 * 4. TASK MANAGEMENT:
 *    - CRUD operations: addTask, delTask, editTask
 *    - Metadata updates: updCat (category), updTime (time estimate)
 *    - List management: moveTask, reorderTask (drag & drop)
 *    - Completion: toggleTask with undo support and celebration
 *    - Focus time tracking: addFocusTime (integrates with timer)
 *
 * 5. OTHER ENTITY MANAGEMENT:
 *    - Habits: addHabit, delHabit, togHabit, reorderHabit, resetHabits
 *    - Anchors: addAnchor, editAnchor, delAnchor
 *    - Prayers & Gratitude: managed through setPrayers, setGratitudeEntries
 *    - Reflections: setReflections, handleExport, handleClearReflections
 *
 * 6. UI COORDINATION:
 *    - Mobile detection and responsive behavior
 *    - Popover help system with positioning logic
 *    - Pull-to-refresh on mobile
 *    - Tab swipe gestures (desktop only)
 *    - Toast notifications for feedback
 *    - Undo system with 5-second timeout
 *
 * COMPONENT STRUCTURE:
 * ====================
 * App (this file)
 * ├── Background Layers (crossfade between modes)
 * ├── DeepWorkBar (ambient timer progress)
 * ├── NewDayTransition (gentle morning greeting)
 * ├── Toast / UndoToast (feedback notifications)
 * ├── Modals
 * │   ├── SelahPause (mindfulness pause)
 * │   ├── SettingsModal (app configuration)
 * │   ├── GuideModal (how to use)
 * │   └── WeeklyReflectionModal (Sunday reflection prompt)
 * ├── Header (Desktop)
 * │   ├── Logo & Date
 * │   ├── Segmented Control (Order/Focus/Rest)
 * │   └── Right Section (Timer indicator, Progress, Greeting, Theme toggle, Settings)
 * ├── MobileHeader (Mobile only)
 * ├── View Container (swipeable on desktop, scrollable on mobile)
 * │   ├── OrderView (task planning, habits, anchors, schedule)
 * │   ├── FocusView (timer, today's tasks)
 * │   └── RestView (scripture, be still, prayer/gratitude, reflection)
 * ├── EncouragementBar (rotating encouragement messages)
 * ├── EnoughIndicator (permission to rest when primary tasks complete)
 * ├── MobileTabBar (Mobile only - bottom navigation)
 * ├── Selah FAB (floating action button for mindfulness pause)
 * └── Footer (branding, help, feedback, version)
 *
 * DATA FLOW:
 * ==========
 * 1. State lives in this component
 * 2. Props flow down to child components
 * 3. Callbacks flow up from children to mutate state
 * 4. All state changes trigger localStorage persistence via useEffect
 * 5. Daily reset logic runs independently via interval
 *
 * KEYBOARD SHORTCUTS:
 * ===================
 * 1, 2, 3    - Switch between Order, Focus, Rest modes
 * Space      - Toggle timer (Focus mode only)
 * N          - Focus quick-add input (Order mode only)
 * S          - Open settings
 * Escape     - Close modals/popovers
 *
 * MOBILE GESTURES:
 * ================
 * Pull down  - Refresh (triggers daily reset check)
 * Scroll down - Auto-collapse tab bar
 * Scroll up  - Expand tab bar
 * Long-press logo - Open settings
 *
 * THEME SYSTEM:
 * =============
 * - Light/Dark mode toggle
 * - Theme switching guard prevents CSS transition jank
 * - data-theme attribute on documentElement
 * - Reduce motion support via CSS class
 *
 * PERSISTENCE:
 * ============
 * All state is persisted to localStorage with 'selah_' prefix:
 * - selah_settings
 * - selah_tasks
 * - selah_habits
 * - selah_anchors
 * - selah_prayers
 * - selah_gratitudeEntries
 * - selah_gratitude (daily)
 * - selah_reflections (daily)
 * - selah_reflectionHistory
 * - selah_schedEvents
 * - selah_profile
 * - selah_taskCategories
 * - selah_timerPreset
 * - selah_timerTime
 * - selah_last_reset_date
 * - selah_last_habit_reset_week
 * - selah_last_visit
 * - selah_weekly-prompt
 * - selah_last_encouragement_idx
 */

import { useState, useEffect, useRef, useCallback } from 'react';

// View Components
import { OrderView, FocusView, RestView } from './components/views';

// Modal Components
import {
  SettingsModal,
  SelahPause,
  NewDayTransition,
  WeeklyReflectionModal,
} from './components/modals';
import GuideModal from './components/modals/GuideModal';

// Mobile Components
import { MobileTabBar, MobileHeader } from './components/mobile';

// Shared Components
import { Toast, UndoToast, Icons } from './components/shared';

// UI Components
import {
  DeepWorkBar,
  EnoughIndicator,
  NavProgress,
  EncouragementBar,
} from './components/ui';

// Data & Constants
import { PRESETS, DEFAULT_CATS, CELEBS } from './data/constants';

// Utilities
import { load, save, genId, getToday, getGreeting } from './utils/helpers';

/**
 * Main App Component
 */
const App = () => {
  // ============================================================================
  // STATE MANAGEMENT (40+ useState hooks)
  // ============================================================================

  // Settings & Profile
  const [settings, setSettings] = useState(() =>
    load('settings', {
      theme: 'light',
      animationsOn: true,
      timerOn: true,
      scriptureOn: true,
      celebOn: true,
      showTimeToComplete: false,
      snapIncrement: 15,
      weeklyReflection: false,
      showProgress: true,
    })
  );
  const [profile, setProfile] = useState(() => load('profile', { firstName: '' }));

  // Navigation & UI State
  const [mode, setMode] = useState('order');
  const [toast, setToast] = useState(null);
  const [showSelah, setShowSelah] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [scrollToVersion, setScrollToVersion] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [showNewDay, setShowNewDay] = useState(false);
  const [yesterdayStats, setYesterdayStats] = useState(null);
  const [showWeeklyReflection, setShowWeeklyReflection] = useState(false);

  // Task Management
  const [undoTask, setUndoTask] = useState(null);
  const [linkedTask, setLinkedTask] = useState(null);
  const [tasks, setTasks] = useState(() =>
    load('tasks', {
      primary: [],
      today: [],
      thisWeek: [],
      later: [],
      completed: [],
    })
  );
  const [taskCategories, setTaskCategories] = useState(() =>
    load('taskCategories', DEFAULT_CATS)
  );

  // Habits & Anchors
  const [habits, setHabits] = useState(() => {
    const loadedHabits = load('habits', [
      {
        id: '1',
        name: 'Morning prayer',
        desc: 'Start the day with gratitude',
        done: false,
      },
      {
        id: '2',
        name: 'Read Scripture',
        desc: 'Let His word guide your steps',
        done: false,
      },
      {
        id: '3',
        name: 'Exercise',
        desc: 'Honor God with your body',
        done: false,
      },
    ]);
    return loadedHabits.map((h) => ({
      ...h,
      history: h.history || [],
    }));
  });
  const [anchors, setAnchors] = useState(() => load('anchors', []));

  // Prayer & Gratitude
  const [prayers, setPrayers] = useState(() => load('prayers', []));
  const [gratitudeEntries, setGratitudeEntries] = useState(() =>
    load('gratitudeEntries', [])
  );
  const [gratitude, setGratitude] = useState(() => load('gratitude', ''));

  // Reflections
  const [reflections, setReflections] = useState(() =>
    load('reflections', { mattered: '', released: '', wait: '' })
  );
  const [reflectionHistory, setReflectionHistory] = useState(() =>
    load('reflectionHistory', {})
  );

  // Schedule
  const [schedEvents, setSchedEvents] = useState(() => load('schedEvents', []));

  // Timer State
  const [preset, setPreset] = useState(() => {
    const savedPreset = load('timerPreset', null);
    if (savedPreset) {
      const found = PRESETS.find((p) => p.l === savedPreset);
      return found || PRESETS[3];
    }
    return PRESETS[3];
  });
  const [time, setTime] = useState(() => {
    const savedTime = load('timerTime', null);
    const savedPreset = load('timerPreset', null);
    if (savedTime !== null && savedTime > 0) return savedTime;
    if (savedPreset) {
      const found = PRESETS.find((p) => p.l === savedPreset);
      return found ? found.s : PRESETS[3].s;
    }
    return PRESETS[3].s;
  });
  const [timerComplete, setTimerComplete] = useState(false);
  const [running, setRunning] = useState(false);
  const [timerMode, setTimerMode] = useState('focus');

  // Popover System
  const [openPopoverId, setOpenPopoverId] = useState(null);
  const [popoverAnchor, setPopoverAnchor] = useState(null);
  const popoverRef = useRef(null);

  // Scroll & Mobile State
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < 768
  );
  const [mobileTabCollapsed, setMobileTabCollapsed] = useState(false);
  const [mobileAccordion, setMobileAccordion] = useState(null);
  const [timerCollapsed, setTimerCollapsed] = useState(false);

  // Mobile Gestures
  const [settingsLongPress, setSettingsLongPress] = useState(null);
  const [tabSwipeOffset, setTabSwipeOffset] = useState(0);
  const [isTabSwiping, setIsTabSwiping] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Refs
  const headerRef = useRef(null);
  const lastScrollY = useRef(0);
  const collapseTimeout = useRef(null);
  const undoTimeoutRef = useRef(null);
  const prevThemeRef = useRef(settings.theme);

  // Derived State
  const today = getToday();
  const primaryComplete =
    tasks.primary.length > 0 && tasks.primary.every((t) => t.done);

  // ============================================================================
  // DAILY RESET LOGIC
  // ============================================================================

  const getTodayISO = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
      d.getDate()
    ).padStart(2, '0')}`;
  };

  const performDailyReset = useCallback(() => {
    const todayISO = getTodayISO();
    const lastReset = load('lastDailyResetISO', '');

    if (lastReset !== todayISO) {
      // Reset habits
      setHabits((prev) => {
        const reset = prev.map((h) => ({ ...h, done: false }));
        save('habits', reset);
        return reset;
      });

      // Reset schedule events
      setSchedEvents((prev) => {
        const persistent = prev.filter((e) => e.persistent);
        save('schedEvents', persistent);
        return persistent;
      });

      // Clear daily reflection
      setGratitude('');
      setReflections({ mattered: '', released: '', wait: '' });
      save('gratitude', '');
      save('reflections', { mattered: '', released: '', wait: '' });

      // Update last reset date
      save('lastDailyResetISO', todayISO);
    }
  }, [setSchedEvents]);

  // Helper to get ISO week number
  const getWeekNumber = (date) => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  };

  // ============================================================================
  // LIFECYCLE EFFECTS
  // ============================================================================

  // Daily reset on mount
  useEffect(() => {
    performDailyReset();
  }, [performDailyReset]);

  // Check for new day on mount
  useEffect(() => {
    const lastVisit = localStorage.getItem('selah-last-visit');
    const todayStr = new Date().toDateString();

    if (lastVisit && lastVisit !== todayStr) {
      const yesterdayCompleted = tasks.completed.filter((t) => {
        const completedDate = t.completedAt
          ? new Date(t.completedAt).toDateString()
          : null;
        return completedDate === lastVisit;
      }).length;

      if (yesterdayCompleted > 0) {
        setYesterdayStats({ completed: yesterdayCompleted });
        setShowNewDay(true);
        setTimeout(() => setShowNewDay(false), 5000);
      }
    }

    localStorage.setItem('selah-last-visit', todayStr);
  }, [tasks.completed]);

  // Weekly reflection prompt (Sunday 6pm+)
  useEffect(() => {
    if (!settings.weeklyReflection) return;

    const now = new Date();
    const isSunday = now.getDay() === 0;
    const isEvening = now.getHours() >= 18;
    const lastWeeklyPrompt = localStorage.getItem('selah-weekly-prompt');
    const thisWeek = getWeekNumber(now);

    if (isSunday && isEvening && lastWeeklyPrompt !== String(thisWeek)) {
      setShowWeeklyReflection(true);
      localStorage.setItem('selah-weekly-prompt', String(thisWeek));
    }
  }, [settings.weeklyReflection]);

  // Check for day change every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      performDailyReset();
    }, 60000);

    return () => clearInterval(interval);
  }, [performDailyReset]);

  // Daily reset with task archiving and weekly habit reset
  useEffect(() => {
    const checkAndResetDaily = () => {
      const today = new Date().toISOString().split('T')[0];
      const lastCheckDate = localStorage.getItem('selah_last_reset_date');
      const lastResetWeek = localStorage.getItem('selah_last_habit_reset_week');
      const currentWeek = getWeekNumber(new Date());

      if (lastCheckDate !== today) {
        console.log('[SelahDaily] New day detected, archiving completed tasks');

        setTasks((prev) => {
          const completedTasks = [
            ...prev.primary.filter((t) => t.done),
            ...prev.today.filter((t) => t.done),
            ...prev.thisWeek.filter((t) => t.done),
            ...prev.later.filter((t) => t.done),
          ].map((t) => ({
            ...t,
            archivedAt: new Date().toISOString(),
            completedAt: t.completedAt || new Date().toISOString(),
          }));

          return {
            primary: prev.primary.filter((t) => !t.done),
            today: prev.today.filter((t) => !t.done),
            thisWeek: prev.thisWeek.filter((t) => !t.done),
            later: prev.later.filter((t) => !t.done),
            completed: [...(prev.completed || []), ...completedTasks].slice(-100),
          };
        });

        setReflections({ mattered: '', released: '', wait: '' });
        setGratitude('');

        localStorage.setItem('selah_last_reset_date', today);
      }

      if (lastResetWeek !== String(currentWeek)) {
        console.log('[SelahDaily] New week detected, resetting habits');
        setHabits((prev) =>
          prev.map((h) => ({
            ...h,
            done: false,
            history: h.history || [],
          }))
        );
        localStorage.setItem('selah_last_habit_reset_week', String(currentWeek));
      }
    };

    checkAndResetDaily();
    const interval = setInterval(checkAndResetDaily, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Mobile detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mobile tab bar collapse on scroll
  const handleMobileScroll = useCallback(
    (e) => {
      if (!isMobile) return;

      const scrollY = e.target.scrollTop;
      const delta = scrollY - lastScrollY.current;

      if (delta > 15 && scrollY > 80) {
        setMobileTabCollapsed(true);
      } else if (delta < -10 || scrollY < 50) {
        setMobileTabCollapsed(false);
      }

      if (collapseTimeout.current) clearTimeout(collapseTimeout.current);
      collapseTimeout.current = setTimeout(() => {
        setMobileTabCollapsed(false);
      }, 2000);

      lastScrollY.current = scrollY;
    },
    [isMobile]
  );

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyboard = (e) => {
      if (
        e.target.tagName === 'INPUT' ||
        e.target.tagName === 'TEXTAREA' ||
        e.target.isContentEditable
      ) {
        return;
      }

      // Number keys 1-3 for mode switching
      if (e.key === '1') {
        e.preventDefault();
        setMode('order');
      } else if (e.key === '2') {
        e.preventDefault();
        setMode('focus');
      } else if (e.key === '3') {
        e.preventDefault();
        setMode('rest');
      }

      // Space to toggle timer (Focus mode only)
      if (e.key === ' ' && mode === 'focus' && settings.timerOn) {
        e.preventDefault();
        setRunning((r) => !r);
      }

      // 'n' to focus quick-add (Order mode only)
      if (e.key === 'n' && mode === 'order') {
        e.preventDefault();
        const quickAddInput = document.querySelector('.quick-add-bar input');
        if (quickAddInput) quickAddInput.focus();
      }

      // 's' to open settings
      if (e.key === 's' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setShowSettings(true);
      }

      // Escape to close modals
      if (e.key === 'Escape') {
        if (showSettings) setShowSettings(false);
        if (showGuide) setShowGuide(false);
        if (showSelah) setShowSelah(false);
      }
    };

    window.addEventListener('keydown', handleKeyboard);
    return () => window.removeEventListener('keydown', handleKeyboard);
  }, [mode, settings.timerOn, showSettings, showGuide, showSelah]);

  // Nav hover spotlight effect
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    const handleMouseMove = (e) => {
      const rect = header.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      header.style.setProperty('--nav-mx', `${x}%`);
      header.style.setProperty('--nav-my', `${y}%`);
    };
    header.addEventListener('mousemove', handleMouseMove);
    return () => header.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Crossfade background layers
  useEffect(() => {
    document.querySelectorAll('.bg-layer').forEach((layer) => {
      layer.classList.remove('active');
    });
    const activeLayer = document.getElementById(`bg-${mode}`);
    if (activeLayer) activeLayer.classList.add('active');
  }, [mode]);

  // Theme switching guard
  useEffect(() => {
    save('settings', settings);

    if (prevThemeRef.current !== settings.theme) {
      document.documentElement.classList.add('is-theme-switching');
      document.documentElement.setAttribute('data-theme', settings.theme);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          document.documentElement.classList.remove('is-theme-switching');
        });
      });
      prevThemeRef.current = settings.theme;
    } else {
      document.documentElement.setAttribute('data-theme', settings.theme);
    }

    if (!settings.animationsOn) document.body.classList.add('reduce-motion');
    else document.body.classList.remove('reduce-motion');
  }, [settings]);

  // Persist state to localStorage
  useEffect(() => {
    save('tasks', tasks);
  }, [tasks]);
  useEffect(() => {
    save('habits', habits);
  }, [habits]);
  useEffect(() => {
    save('schedEvents', schedEvents);
  }, [schedEvents]);
  useEffect(() => {
    save('taskCategories', taskCategories);
  }, [taskCategories]);
  useEffect(() => {
    save('prayers', prayers);
  }, [prayers]);
  useEffect(() => {
    save('gratitudeEntries', gratitudeEntries);
  }, [gratitudeEntries]);
  useEffect(() => {
    save('gratitude', gratitude);
  }, [gratitude]);
  useEffect(() => {
    save('reflections', reflections);
  }, [reflections]);
  useEffect(() => {
    save('reflectionHistory', reflectionHistory);
  }, [reflectionHistory]);
  useEffect(() => {
    save('timerPreset', preset.l);
  }, [preset]);
  useEffect(() => {
    if (!running && time > 0) save('timerTime', time);
  }, [time, running]);

  // Timer countdown
  useEffect(() => {
    let i;
    if (running && time > 0) {
      i = setInterval(() => setTime((t) => t - 1), 1000);
    } else if (time === 0 && running) {
      setRunning(false);
      setTimerComplete(true);
      setTimeout(() => setTimerComplete(false), 5000);
    }
    return () => clearInterval(i);
  }, [running, time]);

  // Scroll-aware header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Popover management
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && openPopoverId) {
        closePopover();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [openPopoverId]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        openPopoverId &&
        popoverRef.current &&
        !popoverRef.current.contains(e.target) &&
        popoverAnchor &&
        !popoverAnchor.contains(e.target)
      ) {
        closePopover();
      }
    };
    if (openPopoverId) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [openPopoverId, popoverAnchor]);

  useEffect(() => {
    if (openPopoverId) {
      closePopover();
    }
  }, [mode]);

  useEffect(() => {
    if (openPopoverId && popoverAnchor && popoverRef.current) {
      const anchorRect = popoverAnchor.getBoundingClientRect();
      const popoverRect = popoverRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let top = anchorRect.bottom + 8;
      let left = anchorRect.right - popoverRect.width;

      if (left < 8) left = 8;
      if (left + popoverRect.width > viewportWidth - 8) {
        left = viewportWidth - popoverRect.width - 8;
      }

      if (top + popoverRect.height > viewportHeight - 8) {
        top = anchorRect.top - popoverRect.height - 8;
      }

      popoverRef.current.style.top = `${top}px`;
      popoverRef.current.style.left = `${left}px`;
    }
  }, [openPopoverId, popoverAnchor]);

  // ============================================================================
  // TASK MANAGEMENT FUNCTIONS
  // ============================================================================

  const celeb = useCallback(() => {
    if (!settings.celebOn) return;
    setToast(CELEBS[Math.floor(Math.random() * CELEBS.length)]);
  }, [settings.celebOn]);

  const addTask = (text, list, cat, tm) => {
    if (list === 'primary' && tasks.primary.length >= 5) list = 'today';
    setTasks((p) => ({
      ...p,
      [list]: [
        ...p[list],
        {
          id: genId(),
          text,
          done: false,
          cat: cat || 'none',
          time: tm || '',
          totalFocusMinutes: 0,
        },
      ],
    }));
  };

  const delTask = (id, list) =>
    setTasks((p) => ({ ...p, [list]: p[list].filter((t) => t.id !== id) }));

  const editTask = (id, list, text) =>
    setTasks((p) => ({
      ...p,
      [list]: p[list].map((t) => (t.id === id ? { ...t, text } : t)),
    }));

  const updCat = (id, list, cat) =>
    setTasks((p) => ({
      ...p,
      [list]: p[list].map((t) => (t.id === id ? { ...t, cat } : t)),
    }));

  const updTime = (id, list, tm) =>
    setTasks((p) => ({
      ...p,
      [list]: p[list].map((t) => (t.id === id ? { ...t, time: tm } : t)),
    }));

  const moveTask = (id, from, to) => {
    const t = tasks[from].find((x) => x.id === id);
    if (t)
      setTasks((p) => ({
        ...p,
        [from]: p[from].filter((x) => x.id !== id),
        [to]: [...p[to], t],
      }));
  };

  const reorderTask = useCallback((taskId, fromList, toList, targetIndex) => {
    setTasks((prev) => {
      const task = prev[fromList].find((t) => t.id === taskId);
      if (!task) return prev;

      const newFrom = prev[fromList].filter((t) => t.id !== taskId);

      if (fromList === toList) {
        const adjustedIndex = Math.min(targetIndex, newFrom.length);
        const newList = [...newFrom];
        newList.splice(adjustedIndex, 0, task);
        return { ...prev, [fromList]: newList };
      } else {
        const newTo = [...prev[toList]];
        const adjustedIndex = Math.min(targetIndex, newTo.length);
        newTo.splice(adjustedIndex, 0, task);
        return { ...prev, [fromList]: newFrom, [toList]: newTo };
      }
    });
  }, []);

  const addFocusTime = useCallback((id, list, minutes) => {
    setTasks((p) => ({
      ...p,
      [list]: p[list].map((t) =>
        t.id === id
          ? { ...t, totalFocusMinutes: (t.totalFocusMinutes || 0) + minutes }
          : t
      ),
    }));
  }, []);

  const toggleTask = (id, list) => {
    const t = tasks[list].find((x) => x.id === id);
    if (!t) return;

    const isCompleting = !t.done;

    setTasks((p) => ({
      ...p,
      [list]: p[list].map((task) =>
        task.id === id
          ? {
              ...task,
              done: !task.done,
              completedAt: !task.done ? new Date().toISOString() : null,
            }
          : task
      ),
    }));

    if (isCompleting) {
      celeb();

      if (list === 'primary') {
        const primaryCard = document.querySelector('.primary-card');
        if (primaryCard) {
          primaryCard.classList.add('just-completed');
          setTimeout(() => primaryCard.classList.remove('just-completed'), 800);
        }
      }

      const completedTask = {
        ...t,
        done: true,
        completedAt: new Date().toISOString(),
        fromList: list,
      };
      setTasks((p) => ({
        ...p,
        completed: [completedTask, ...p.completed],
      }));

      setUndoTask(completedTask);
      if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);
      undoTimeoutRef.current = setTimeout(() => setUndoTask(null), 5000);
    } else {
      setTasks((p) => ({
        ...p,
        completed: p.completed.filter(
          (ct) => !(ct.id === id && ct.fromList === list)
        ),
      }));
      setUndoTask(null);
    }

    if (linkedTask && linkedTask.id === id) setLinkedTask(null);
  };

  const handleUndo = () => {
    if (!undoTask) return;
    const list = undoTask.fromList || 'today';
    const restoredTask = {
      id: undoTask.id,
      text: undoTask.text,
      done: false,
      cat: undoTask.cat,
      time: undoTask.time,
      totalFocusMinutes: undoTask.totalFocusMinutes || 0,
    };
    setTasks((p) => ({
      ...p,
      completed: p.completed.filter((t) => t.id !== undoTask.id),
      [list]: [...p[list], restoredTask],
    }));
    setUndoTask(null);
    if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);
  };

  const clearCompleted = () => setTasks((p) => ({ ...p, completed: [] }));

  // ============================================================================
  // HABIT MANAGEMENT FUNCTIONS
  // ============================================================================

  const addHabit = (n) =>
    setHabits((p) => [...p, { id: genId(), name: n, done: false }]);

  const delHabit = (id) => setHabits((p) => p.filter((h) => h.id !== id));

  const reorderHabit = (habitId, newIndex) => {
    setHabits((p) => {
      const index = p.findIndex((h) => h.id === habitId);
      if (index === -1 || index === newIndex) return p;
      const newHabits = [...p];
      const [removed] = newHabits.splice(index, 1);
      newHabits.splice(newIndex, 0, removed);
      return newHabits;
    });
  };

  const togHabit = (id) => {
    const today = new Date().toISOString().split('T')[0];
    const h = habits.find((x) => x.id === id);
    if (h && !h.done) celeb();
    setHabits((p) => {
      const updated = p.map((x) => {
        if (x.id !== id) return x;
        const newDone = !x.done;
        let newHistory = [...(x.history || [])];
        const todayIndex = newHistory.findIndex((entry) => entry.date === today);
        if (todayIndex >= 0) {
          newHistory[todayIndex].done = newDone;
        } else {
          newHistory.push({ date: today, done: newDone });
        }
        newHistory = newHistory.slice(-7);
        return { ...x, done: newDone, history: newHistory };
      });
      save('habits', updated);
      return updated;
    });
  };

  const resetHabits = () => setHabits((p) => p.map((h) => ({ ...h, done: false })));

  // ============================================================================
  // ANCHOR MANAGEMENT FUNCTIONS
  // ============================================================================

  const addAnchor = (text) => {
    const newAnchors = [...anchors, { id: genId(), text }];
    setAnchors(newAnchors);
    save('anchors', newAnchors);
  };

  const editAnchor = (id, text) => {
    const newAnchors = anchors.map((a) => (a.id === id ? { ...a, text } : a));
    setAnchors(newAnchors);
    save('anchors', newAnchors);
  };

  const delAnchor = (id) => {
    const newAnchors = anchors.filter((a) => a.id !== id);
    setAnchors(newAnchors);
    save('anchors', newAnchors);
  };

  // ============================================================================
  // REFLECTION MANAGEMENT FUNCTIONS
  // ============================================================================

  const handleClearReflections = () => {
    setReflections({ mattered: '', released: '', wait: '' });
    setGratitude('');
  };

  const handleExport = () => {
    const content = `SELAH RHYTHM - Evening Reflections
${today.day}, ${today.shortMonth} ${today.date}
${'═'.repeat(40)}

WHAT MATTERED TODAY
${reflections.mattered || '(not filled)'}

WHAT NEEDS TO BE RELEASED
${reflections.released || '(not filled)'}

WHAT CAN WAIT
${reflections.wait || '(not filled)'}

GRATEFUL FOR
${gratitude || '(not filled)'}

${'═'.repeat(40)}
Exported from Selah Rhythm`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `selah-reflections-${today.shortMonth}-${today.date}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ============================================================================
  // MANUAL RESET FUNCTION
  // ============================================================================

  const handleManualReset = () => {
    if (
      window.confirm(
        "Reset today's habits and reflection? This cannot be undone."
      )
    ) {
      const todayISO = getTodayISO();
      setHabits((prev) => {
        const reset = prev.map((h) => ({ ...h, done: false }));
        save('habits', reset);
        return reset;
      });
      setGratitude('');
      setReflections({ mattered: '', released: '', wait: '' });
      save('gratitude', '');
      save('reflections', { mattered: '', released: '', wait: '' });
      save('lastDailyResetISO', todayISO);
      setToast({
        title: 'Reset',
        msg: "Today's habits and reflection have been reset.",
      });
    }
  };

  // ============================================================================
  // POPOVER SYSTEM
  // ============================================================================

  const popoverContent = {
    anchors:
      'Fixed habits you want to keep consistent each day, even when the schedule changes.',
    wisdom:
      'A short Scripture reading to set perspective before planning or reflecting.',
    habits: 'Simple repeatable habits you want to track consistently over time.',
    schedule:
      'Use this to block time intentionally instead of reacting to tasks as they come up.',
    primary:
      'The single most important task for today. If only one thing gets done, this is it.',
    today:
      'Tasks you plan to work on today. Keep this list realistic to stay focused.',
    thisWeek:
      'Tasks you want to handle soon, but not today. Helps you plan ahead without crowding today.',
    later:
      "A place to store tasks or ideas you don't want to forget, but don't need to act on now.",
    focusTimer:
      'A distraction-free timer to help you work for a set amount of time.',
    todayTasks:
      'The tasks you intend to focus on during this session. Keep it short and specific.',
    selah: 'A built-in pause to slow down, reset, and reflect.',
    beStill: 'A quick pause prompt for when you feel overwhelmed or scattered.',
    reflection:
      'A simple way to review your day and capture notes, patterns, or lessons learned.',
    'prayer-gratitude':
      'Track prayers and practice gratitude. Answered prayers can be linked to thankfulness notes.',
  };

  const handleHelpClick = (e, id) => {
    e.stopPropagation();
    if (openPopoverId === id) {
      setOpenPopoverId(null);
      setPopoverAnchor(null);
    } else {
      setOpenPopoverId(id);
      setPopoverAnchor(e.currentTarget);
    }
  };

  const closePopover = () => {
    setOpenPopoverId(null);
    setPopoverAnchor(null);
  };

  // ============================================================================
  // MOBILE GESTURE HANDLERS
  // ============================================================================

  const formatNavTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleLogoLongPressStart = () => {
    const timer = setTimeout(() => {
      setShowSettings(true);
    }, 500);
    setSettingsLongPress(timer);
  };

  const handleLogoLongPressEnd = () => {
    if (settingsLongPress) {
      clearTimeout(settingsLongPress);
      setSettingsLongPress(null);
    }
  };

  // Tab swipe handlers (desktop only)
  const tabSwipeStart = useRef({ x: 0, y: 0 });
  const isHorizontalTabSwipe = useRef(null);
  const MODES_ORDER = ['order', 'focus', 'rest'];
  const currentModeIndex = MODES_ORDER.indexOf(mode);

  const handleTabSwipeStart = (e) => {
    if (isMobile) return;
    if (!e.touches) return;

    tabSwipeStart.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
    isHorizontalTabSwipe.current = null;
    setIsTabSwiping(true);
  };

  const handleTabSwipeMove = (e) => {
    if (!isTabSwiping || !e.touches) return;

    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const diffX = currentX - tabSwipeStart.current.x;
    const diffY = currentY - tabSwipeStart.current.y;

    if (
      isHorizontalTabSwipe.current === null &&
      (Math.abs(diffX) > 20 || Math.abs(diffY) > 20)
    ) {
      isHorizontalTabSwipe.current = Math.abs(diffX) > Math.abs(diffY) * 2.5;
    }

    if (!isHorizontalTabSwipe.current) {
      setTabSwipeOffset(0);
      return;
    }

    e.preventDefault();

    let clampedDiff = diffX;
    const canGoLeft = currentModeIndex < MODES_ORDER.length - 1;
    const canGoRight = currentModeIndex > 0;

    if (diffX > 0 && !canGoRight) clampedDiff = diffX * 0.2;
    if (diffX < 0 && !canGoLeft) clampedDiff = diffX * 0.2;

    setTabSwipeOffset(clampedDiff);
  };

  const handleTabSwipeEnd = () => {
    setIsTabSwiping(false);

    const threshold = window.innerWidth * 0.2;

    if (tabSwipeOffset > threshold && currentModeIndex > 0) {
      setMode(MODES_ORDER[currentModeIndex - 1]);
    } else if (
      tabSwipeOffset < -threshold &&
      currentModeIndex < MODES_ORDER.length - 1
    ) {
      setMode(MODES_ORDER[currentModeIndex + 1]);
    }

    setTabSwipeOffset(0);
    isHorizontalTabSwipe.current = null;
  };

  // Pull-to-refresh handlers (mobile only)
  const pullStartY = useRef(0);
  const PULL_THRESHOLD = 80;

  const handlePullStart = (e) => {
    if (!e.touches || window.scrollY > 0) return;
    pullStartY.current = e.touches[0].clientY;
    setIsPulling(true);
  };

  const handlePullMove = (e) => {
    if (isHorizontalTabSwipe.current === true) {
      setPullDistance(0);
      return;
    }

    if (!isPulling || !e.touches || isRefreshing) return;

    const currentY = e.touches[0].clientY;
    const diff = currentY - pullStartY.current;

    if (diff > 0 && window.scrollY <= 0) {
      const resistance = Math.min(diff * 0.4, PULL_THRESHOLD * 1.5);
      setPullDistance(resistance);
    }
  };

  const handlePullEnd = async () => {
    setIsPulling(false);

    if (pullDistance >= PULL_THRESHOLD && !isRefreshing) {
      setIsRefreshing(true);
      setPullDistance(PULL_THRESHOLD);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      performDailyReset();

      setIsRefreshing(false);
    }

    setPullDistance(0);
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div
      className={`app mode-${mode} ${settings.theme === 'dark' ? 'dark' : ''}`}
      data-mobile={isMobile}
    >
      <DeepWorkBar
        running={running}
        time={time}
        preset={preset}
        timerMode={timerMode}
      />
      <NewDayTransition
        show={showNewDay}
        stats={yesterdayStats}
        name={profile?.firstName}
        onDismiss={() => setShowNewDay(false)}
      />
      <Toast show={toast !== null} data={toast} onClose={() => setToast(null)} />
      <UndoToast
        show={undoTask !== null}
        task={undoTask}
        onUndo={handleUndo}
        onClose={() => setUndoTask(null)}
      />
      <SelahPause
        show={showSelah}
        onClose={() => setShowSelah(false)}
        animationsOn={settings.animationsOn}
      />
      <SettingsModal
        show={showSettings}
        onClose={() => {
          setShowSettings(false);
          setScrollToVersion(false);
        }}
        settings={settings}
        setSettings={setSettings}
        profile={profile}
        setProfile={setProfile}
        completed={tasks.completed}
        clearCompleted={clearCompleted}
        scrollToVersion={scrollToVersion}
        onManualReset={handleManualReset}
        taskCategories={taskCategories}
        setTaskCategories={setTaskCategories}
      />
      <GuideModal show={showGuide} onClose={() => setShowGuide(false)} />
      <WeeklyReflectionModal
        show={showWeeklyReflection}
        onClose={() => setShowWeeklyReflection(false)}
        profile={profile}
      />

      {/* Desktop Header - hidden on mobile via CSS */}
      <div className={`header${scrolled ? ' scrolled' : ''}`} ref={headerRef}>
        <div className="header-left" onClick={() => setMode('order')}>
          <div className="logo-wrapper">
            <Icons.Book />
          </div>
          <div className="title-block">
            <div
              className="title sr-logo-text"
              onTouchStart={handleLogoLongPressStart}
              onTouchEnd={handleLogoLongPressEnd}
              onTouchMove={handleLogoLongPressEnd}
              onContextMenu={(e) => {
                e.preventDefault();
                setShowSettings(true);
              }}
              style={{ cursor: 'pointer' }}
              title="Long-press or right-click for settings"
            >
              <span className="sr-word-selah">Selah</span>
              <span className="sr-word-rhythm">Rhythm</span>
            </div>
            <div className="tagline">Order. Focus. Rest.</div>
          </div>
          <div className="header-date">
            <span className="header-date-text">
              {today.shortDay}, {today.shortMonth} {today.date}
            </span>
          </div>
        </div>

        {/* iOS-style Segmented Control */}
        <div className="nav-segmented-control">
          <div className={`nav-segment-pill mode-${mode}`} />
          <button
            className={`nav-segment-btn${
              mode === 'order' ? ' active mode-order' : ''
            }`}
            onClick={() => setMode('order')}
          >
            Order
          </button>
          <button
            className={`nav-segment-btn${
              mode === 'focus' ? ' active mode-focus' : ''
            }`}
            onClick={() => setMode('focus')}
          >
            Focus
          </button>
          <button
            className={`nav-segment-btn${
              mode === 'rest' ? ' active mode-rest' : ''
            }`}
            onClick={() => setMode('rest')}
          >
            Rest
          </button>
        </div>

        <div className="header-right">
          {/* Timer indicator (when running) */}
          {running && (
            <div
              className="nav-timer-indicator"
              onClick={() => setMode('focus')}
              title="Go to Focus"
            >
              <span
                className={`nav-timer-dot ${
                  timerMode === 'focus' ? 'focus' : 'break'
                }`}
              />
              <span className="nav-timer-time">{formatNavTime(time)}</span>
            </div>
          )}

          {/* Progress indicator */}
          {settings.showProgress !== false && <NavProgress tasks={tasks} />}

          {/* Personalized greeting */}
          <div className="nav-greeting">
            <span className="nav-greeting-text">{getGreeting(profile)}</span>
          </div>

          <button
            className="header-btn"
            onClick={() =>
              setSettings((s) => ({
                ...s,
                theme: s.theme === 'dark' ? 'light' : 'dark',
              }))
            }
            title={settings.theme === 'light' ? 'Dark mode' : 'Light mode'}
          >
            {settings.theme === 'light' ? <Icons.Moon /> : <Icons.Sun />}
          </button>
          <button
            className="header-btn"
            onClick={() => setShowSettings(true)}
            title="Settings"
          >
            <Icons.Settings />
          </button>
        </div>
      </div>

      {/* Mobile Header */}
      {isMobile && (
        <MobileHeader
          profile={profile}
          running={running}
          time={time}
          timerMode={timerMode}
          onTimerClick={() => setMode('focus')}
          onSettingsClick={() => setShowSettings((prev) => !prev)}
          tasks={tasks}
          today={today}
        />
      )}

      {/* Shared Feature Popover */}
      {openPopoverId && popoverContent[openPopoverId] && (
        <div
          ref={popoverRef}
          className={`feature-popover${openPopoverId ? ' open' : ''}`}
          role="tooltip"
          aria-hidden={!openPopoverId}
        >
          {popoverContent[openPopoverId]}
        </div>
      )}

      {/* Pull to refresh indicator - mobile only */}
      {(pullDistance > 0 || isRefreshing) && (
        <div
          className="pull-indicator"
          style={{
            transform: `translateY(${pullDistance - 60}px)`,
            opacity: Math.min(1, pullDistance / PULL_THRESHOLD),
          }}
        >
          <div className={`pull-spinner${isRefreshing ? ' spinning' : ''}`}>
            {isRefreshing ? <Icons.Loader /> : <Icons.ArrowDown />}
          </div>
          <span>{isRefreshing ? 'Refreshing...' : 'Pull to refresh'}</span>
        </div>
      )}

      <div
        className="view-container"
        onTouchStart={(e) => {
          if (!isMobile) handleTabSwipeStart(e);
          handlePullStart(e);
        }}
        onTouchMove={(e) => {
          if (!isMobile) handleTabSwipeMove(e);
          handlePullMove(e);
        }}
        onTouchEnd={(e) => {
          if (!isMobile) handleTabSwipeEnd();
          handlePullEnd();
        }}
        onScroll={isMobile ? handleMobileScroll : undefined}
        style={{
          transform:
            !isMobile && tabSwipeOffset !== 0
              ? `translateX(${tabSwipeOffset}px)`
              : undefined,
          transition:
            !isMobile && isTabSwiping
              ? 'none'
              : 'transform 0.35s var(--spring-bounce)',
        }}
      >
        <div className={`view-wrapper${mode === 'order' ? ' active' : ''}`}>
          <OrderView
            tasks={tasks}
            toggleTask={toggleTask}
            addTask={addTask}
            delTask={delTask}
            editTask={editTask}
            updCat={updCat}
            updTime={updTime}
            moveTask={moveTask}
            habits={habits}
            togHabit={togHabit}
            addHabit={addHabit}
            delHabit={delHabit}
            resetHabits={resetHabits}
            reorderHabit={reorderHabit}
            anchors={anchors}
            addAnchor={addAnchor}
            editAnchor={editAnchor}
            delAnchor={delAnchor}
            schedEvents={schedEvents}
            setSchedEvents={setSchedEvents}
            showTimeToComplete={settings.showTimeToComplete}
            reorderTask={reorderTask}
            snapIncrement={settings.snapIncrement}
            settings={settings}
            setSettings={setSettings}
            onHelpClick={handleHelpClick}
            taskCategories={taskCategories}
            mobileAccordion={mobileAccordion}
            setMobileAccordion={setMobileAccordion}
          />
        </div>
        <div className={`view-wrapper${mode === 'focus' ? ' active' : ''}`}>
          <FocusView
            tasks={tasks}
            toggleTask={toggleTask}
            addTask={addTask}
            delTask={delTask}
            editTask={editTask}
            updCat={updCat}
            updTime={updTime}
            moveTask={moveTask}
            reorderTask={reorderTask}
            timerOn={settings.timerOn}
            preset={preset}
            setPreset={setPreset}
            time={time}
            setTime={setTime}
            running={running}
            setRunning={setRunning}
            linkedTask={linkedTask}
            setLinkedTask={setLinkedTask}
            onAddFocusTime={addFocusTime}
            showTimeToComplete={settings.showTimeToComplete}
            onHelpClick={handleHelpClick}
            timerMode={timerMode}
            setTimerMode={setTimerMode}
            taskCategories={taskCategories}
            timerCollapsed={timerCollapsed}
            setTimerCollapsed={setTimerCollapsed}
          />
        </div>
        <div className={`view-wrapper${mode === 'rest' ? ' active' : ''}`}>
          <RestView
            gratitude={gratitude}
            setGratitude={setGratitude}
            reflections={reflections}
            setReflections={setReflections}
            reflectionHistory={reflectionHistory}
            completedToday={tasks.completed.filter(
              (t) =>
                t.completedAt &&
                new Date(t.completedAt).toDateString() === new Date().toDateString()
            )}
            animationsOn={settings.animationsOn}
            profile={profile}
            onExport={handleExport}
            onClear={handleClearReflections}
            onHelpClick={handleHelpClick}
            prayers={prayers}
            setPrayers={setPrayers}
            gratitudeEntries={gratitudeEntries}
            setGratitudeEntries={setGratitudeEntries}
          />
        </div>
      </div>

      {/* Desktop elements that are hidden on mobile */}
      <EncouragementBar profile={profile} mode={mode} />
      <EnoughIndicator
        show={primaryComplete && mode === 'order' && !isMobile}
        name={profile?.firstName}
      />

      {/* Mobile Bottom Tab Bar */}
      {isMobile && (
        <MobileTabBar
          mode={mode}
          setMode={setMode}
          collapsed={mobileTabCollapsed}
        />
      )}

      {/* FAB with mobile positioning */}
      <button
        className={`selah-trigger ${mobileTabCollapsed ? 'shifted' : ''}`}
        onClick={() => setShowSelah(true)}
        title="Selah — take a breath"
      >
        <Icons.PauseCircle />
      </button>
      <div className="footer">
        <div className="footer-brand">Calm · Rhythmic · Intentional</div>
        <div className="footer-row">
          <div className="footer-credit">
            Made with <span>♥</span> by Tim Medina
          </div>
          <a className="footer-link" onClick={() => setShowGuide(true)}>
            <Icons.HelpCircle /> How to use
          </a>
          <a className="footer-link" href="mailto:hello@stumpandroot.co">
            <Icons.Mail /> Suggest a feature
          </a>
          <button
            className="footer-version"
            onClick={() => {
              setScrollToVersion(true);
              setShowSettings(true);
            }}
            title="View what's new"
          >
            v0.9.44 · Jan 20, 2026
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
