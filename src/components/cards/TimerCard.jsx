/**
 * SELAH RHYTHM - TimerCard Component
 *
 * Apple-style Pomodoro timer with three modes: Focus, Short Break, and Long Break.
 * Features a circular SVG progress ring, customizable durations, auto-start, and
 * Web Audio API chime sound. Supports task linking to track focus time.
 *
 * @component
 * @example
 * ```jsx
 * <TimerCard
 *   timerOn={true}
 *   preset={{ l: '25m', s: 1500 }}
 *   setPreset={(preset) => console.log('Preset changed:', preset)}
 *   time={1500}
 *   setTime={(time) => console.log('Time changed:', time)}
 *   running={false}
 *   setRunning={(running) => console.log('Running:', running)}
 *   linkedTask={null}
 *   setLinkedTask={(task) => console.log('Task linked:', task)}
 *   allTasks={[]}
 *   onAddFocusTime={(taskId, listType, minutes) => console.log('Focus time added')}
 *   onHelpClick={(e, id) => console.log('Help clicked:', id)}
 *   onModeChange={(mode) => console.log('Mode changed:', mode)}
 *   collapsed={false}
 *   onToggleCollapse={(collapsed) => console.log('Collapsed:', collapsed)}
 * />
 * ```
 *
 * @param {Object} props - Component props
 * @param {boolean} props.timerOn - Whether the timer card is visible
 * @param {Object} props.preset - Current timer preset object with label and seconds
 * @param {string} props.preset.l - Preset label (e.g., "25m")
 * @param {number} props.preset.s - Preset duration in seconds
 * @param {Function} props.setPreset - Function to update the preset
 * @param {number} props.time - Current time in seconds
 * @param {Function} props.setTime - Function to update the time
 * @param {boolean} props.running - Whether the timer is currently running
 * @param {Function} props.setRunning - Function to update the running state
 * @param {Object|null} props.linkedTask - Task linked to the timer for focus time tracking
 * @param {string} props.linkedTask.id - Task ID
 * @param {string} props.linkedTask.list - Task list type ('today', 'week', 'later')
 * @param {Function} props.setLinkedTask - Function to update the linked task
 * @param {Array} props.allTasks - Array of all available tasks for linking
 * @param {Function} props.onAddFocusTime - Callback when focus time is added to a task (taskId, listType, minutes)
 * @param {Function} props.onHelpClick - Callback when help icon is clicked (event, topicId)
 * @param {Function} [props.onModeChange] - Optional callback when timer mode changes (mode)
 * @param {boolean} [props.collapsed=false] - Whether the timer is in collapsed/minimized mode
 * @param {Function} [props.onToggleCollapse] - Optional callback to toggle collapsed state (collapsed)
 *
 * @returns {JSX.Element|null} The TimerCard component or null if timerOn is false
 *
 * @description
 * **Key Features:**
 * - Three timer modes: Focus (default 25m), Short Break (5m), Long Break (15m)
 * - Pomodoro flow: Focus → Short Break (every 4th cycle → Long Break) → Focus
 * - Circular SVG progress ring with smooth animations
 * - Start/Pause/Reset/Skip controls
 * - Customizable durations (1-180 minutes) via settings panel
 * - Auto-start toggle to automatically begin next session
 * - Sound toggle with Web Audio API chime (C5-E5-G5 sequence)
 * - Task linking integration for focus time tracking
 * - Collapsed mobile mode with mode switcher
 * - Settings panel with outside-click-to-close
 * - Cycle tracking (resets after each break)
 *
 * **State Management:**
 * - Uses refs for interval management and timing calculations
 * - Syncs with parent state via props (time, running, preset)
 * - Local state for mode, cycle, durations, and settings
 *
 * **Timer Modes:**
 * - Focus: Productive work session (default 25 minutes)
 * - Short Break: Quick rest (default 5 minutes)
 * - Long Break: Extended rest every 4th cycle (default 15 minutes)
 *
 * **CSS Classes:**
 * All original CSS class names are preserved for styling:
 * - `.apple-timer-container` - Main container
 * - `.apple-timer-glow` - Background glow effect
 * - `.apple-timer-modes` - Mode selection buttons
 * - `.apple-timer-ring` - Circular progress ring container
 * - `.timer-ring-track` - SVG background ring
 * - `.apple-timer-time` - Time display
 * - `.apple-timer-controls` - Button controls
 * - `.apple-timer-settings-*` - Settings panel elements
 * - `.apple-timer-collapsed-*` - Collapsed mode elements
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import * as Icons from '../shared/Icons';
import HelpIcon from '../shared/HelpIcon';

const TimerCard = ({
  timerOn,
  preset,
  setPreset,
  time,
  setTime,
  running,
  setRunning,
  linkedTask,
  setLinkedTask,
  allTasks,
  onAddFocusTime,
  onHelpClick,
  onModeChange,
  collapsed = false,
  onToggleCollapse
}) => {
  // Refs for timer management
  const startTimeRef = useRef(null);
  const endAtRef = useRef(null);
  const intervalRef = useRef(null);
  const settingsPanelRef = useRef(null);
  const settingsBtnRef = useRef(null);
  const pendingAutoStartRef = useRef(false);
  const prevTotalRef = useRef(null);

  // Timer mode state
  const [mode, setMode] = useState("focus"); // "focus" | "short" | "long"
  const [cycle, setCycle] = useState(1);

  // Duration settings (in minutes)
  const [focusMin, setFocusMin] = useState(25);
  const [shortMin, setShortMin] = useState(5);
  const [longMin, setLongMin] = useState(15);

  // UI settings
  const [autoNext, setAutoNext] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Remaining time state (synced with parent time prop)
  const [remaining, setRemaining] = useState(time);

  /**
   * Clamps a number between min and max values
   * @param {number} n - Number to clamp
   * @param {number} a - Minimum value
   * @param {number} b - Maximum value
   * @returns {number} Clamped value
   */
  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));

  /**
   * Pads a number to 2 digits with leading zero
   * @param {number} n - Number to pad
   * @returns {string} Padded string
   */
  const pad2 = (n) => String(n).padStart(2, "0");

  /**
   * Formats seconds as MM:SS
   * @param {number} s - Seconds
   * @returns {string} Formatted time string
   */
  const fmt = (s) => `${pad2(Math.floor(s / 60))}:${pad2(s % 60)}`;

  // Derived state
  const isBreak = mode !== "focus";
  const modeLabel = mode === "focus" ? "Focus" : mode === "short" ? "Short break" : "Long break";

  /**
   * Total seconds for current mode (memoized)
   */
  const totalSeconds = useMemo(() => {
    const m = mode === "focus" ? focusMin : mode === "short" ? shortMin : longMin;
    return clamp(Math.round(m), 1, 180) * 60;
  }, [mode, focusMin, shortMin, longMin]);

  // SVG circle calculations for progress ring
  const r = 92;
  const C = 2 * Math.PI * r;
  const progressRatio = totalSeconds === 0 ? 0 : remaining / totalSeconds;
  const dashOffset = C * (1 - progressRatio);

  // Status label
  const subLabel = running ? (mode === "focus" ? "Focusing…" : "Recovering…") : "Ready";

  /**
   * Sync remaining time when totalSeconds changes (mode/minutes change)
   * Only updates when not running to avoid disrupting active timer
   */
  useEffect(() => {
    if (!running && prevTotalRef.current !== totalSeconds) {
      setRemaining(totalSeconds);
      setTime(totalSeconds);
      prevTotalRef.current = totalSeconds;
    } else {
      prevTotalRef.current = totalSeconds;
    }
  }, [totalSeconds, running, setTime]);

  /**
   * Sync remaining with time prop when time changes externally
   * Only updates when not running
   */
  useEffect(() => {
    if (!running && time !== remaining) {
      setRemaining(time);
    }
  }, [time, running, remaining]);

  /**
   * Outside click handler to close settings panel
   */
  useEffect(() => {
    if (!settingsOpen) return;
    const onDown = (e) => {
      const panel = settingsPanelRef.current;
      const btn = settingsBtnRef.current;
      const target = e.target;
      if (btn && btn.contains(target)) return;
      if (!panel) return;
      if (!panel.contains(target)) setSettingsOpen(false);
    };
    window.addEventListener("mousedown", onDown);
    return () => window.removeEventListener("mousedown", onDown);
  }, [settingsOpen]);

  /**
   * Auto-start next session handler
   * Triggers when mode changes after completing a session with autoNext enabled
   */
  useEffect(() => {
    if (!pendingAutoStartRef.current) return;
    if (running) return;
    const id = window.requestAnimationFrame(() => {
      pendingAutoStartRef.current = false;
      startWith(totalSeconds);
    });
    return () => window.cancelAnimationFrame(id);
  }, [mode, totalSeconds, running]);

  /**
   * Plays a pleasant two-tone chime sound using Web Audio API
   * Creates a C5-E5-G5 chord sequence with a soft repeat
   */
  const playChime = () => {
    if (!soundOn) return;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      const ctx = new AC();

      // Create a pleasant two-tone chime
      const playTone = (freq, startTime, duration) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.value = freq;

        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.15, startTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + duration);
      };

      const now = ctx.currentTime;

      // Soft chime sequence (C5 - E5 - G5)
      playTone(523.25, now, 1.2);        // C5
      playTone(659.25, now + 0.15, 1.0); // E5
      playTone(783.99, now + 0.30, 1.5); // G5

      // Second softer repeat
      playTone(523.25, now + 1.5, 0.8);
      playTone(659.25, now + 1.65, 0.6);
      playTone(783.99, now + 1.80, 1.0);

      setTimeout(() => ctx.close(), 4000);
    } catch (e) {
      console.log('Audio not supported');
    }
  };

  /**
   * Stops the timer and clears interval
   */
  const stop = () => {
    setRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
    endAtRef.current = null;
  };

  /**
   * Completes the current session and transitions to next mode
   * @param {boolean} skipped - Whether the session was skipped vs naturally completed
   */
  const complete = (skipped = false) => {
    stop();
    if (!skipped) playChime();

    // Track focus time if linked to a task
    if (linkedTask && startTimeRef.current) {
      const elapsed = Math.floor((totalSeconds - remaining) / 60);
      if (elapsed > 0) onAddFocusTime(linkedTask.id, linkedTask.list, elapsed);
      startTimeRef.current = null;
    }

    // Pomodoro flow: focus -> short (every 4th -> long), break -> focus
    if (mode === "focus") {
      const nextMode = cycle % 4 === 0 ? "long" : "short";
      setMode(nextMode);
      if (onModeChange) onModeChange(nextMode);
    } else {
      setCycle(c => c + 1);
      setMode("focus");
      if (onModeChange) onModeChange("focus");
    }

    if (autoNext) {
      pendingAutoStartRef.current = true;
    }
  };

  /**
   * Timer tick function - updates remaining time every 250ms
   * Completes session when time reaches 0
   */
  const tick = () => {
    const endAt = endAtRef.current;
    if (!endAt) return;
    const msLeft = endAt - Date.now();
    const next = Math.max(0, Math.round(msLeft / 1000));
    setRemaining(next);
    setTime(next);
    if (next <= 0) complete();
  };

  /**
   * Starts the timer with a specific number of seconds
   * @param {number} seconds - Duration in seconds
   */
  const startWith = (seconds) => {
    if (seconds <= 0) return;
    setRemaining(seconds);
    setTime(seconds);
    setRunning(true);
    if (!startTimeRef.current) startTimeRef.current = Date.now();
    endAtRef.current = Date.now() + seconds * 1000;
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(tick, 250);
  };

  /**
   * Starts the timer with remaining time
   */
  const start = () => {
    if (running) return;
    setRunning(true);
    if (!startTimeRef.current) startTimeRef.current = Date.now();
    endAtRef.current = Date.now() + remaining * 1000;
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(tick, 250);
  };

  /**
   * Toggles between start and pause
   */
  const toggleRun = () => (running ? stop() : start());

  /**
   * Resets the timer to full duration and stops it
   */
  const reset = () => {
    stop();
    setRemaining(totalSeconds);
    setTime(totalSeconds);
    startTimeRef.current = null;
  };

  /**
   * Skips the current session and moves to next mode
   */
  const skip = () => {
    stop();
    setRemaining(0);
    setTime(0);
    complete(true);
  };

  /**
   * Safely changes mode (stops timer and resets start time)
   * @param {string} m - Mode to switch to ("focus" | "short" | "long")
   */
  const setModeSafe = (m) => {
    stop();
    setMode(m);
    if (onModeChange) onModeChange(m);
    startTimeRef.current = null;
  };

  /**
   * Steps a value up or down within bounds
   * @param {number} val - Current value
   * @param {number} delta - Amount to change (+1 or -1)
   * @returns {number} New value clamped between 1 and 180
   */
  const step = (val, delta) => clamp(val + delta, 1, 180);

  /**
   * Initialize mode from preset on mount
   * Matches preset duration to the closest mode
   */
  useEffect(() => {
    const presetMins = preset.s / 60;
    if (Math.abs(presetMins - focusMin) < 1) {
      setMode("focus");
      if (onModeChange) onModeChange("focus");
    } else if (Math.abs(presetMins - shortMin) < 1) {
      setMode("short");
      if (onModeChange) onModeChange("short");
    } else if (Math.abs(presetMins - longMin) < 1) {
      setMode("long");
      if (onModeChange) onModeChange("long");
    }
  }, []); // Only on mount

  /**
   * Notify parent when mode changes
   */
  useEffect(() => {
    if (onModeChange) onModeChange(mode);
  }, [mode, onModeChange]);

  /**
   * Update preset and time when mode changes
   * Only updates when timer is not running
   */
  useEffect(() => {
    if (running) return;
    const mins = mode === "focus" ? focusMin : mode === "short" ? shortMin : longMin;
    const seconds = mins * 60;
    if (preset.s !== seconds) {
      setPreset({l: `${mins}m`, s: seconds});
      setTime(seconds);
      setRemaining(seconds);
      prevTotalRef.current = seconds;
    }
  }, [mode, focusMin, shortMin, longMin, running, preset.s, setPreset, setTime]);

  // Don't render if timer is disabled
  if (!timerOn) return null;

  /**
   * Helper function to switch modes
   */
  const switchMode = (m) => {
    setModeSafe(m);
  };

  // ========== COLLAPSED MODE ==========
  if (collapsed && onToggleCollapse) {
    return (
      <div className="apple-timer-collapsed">
        <div className="apple-timer-collapsed-header">
          <div className="apple-timer-collapsed-left">
            <div className="apple-timer-collapsed-title">Focus Timer</div>
            <div className="apple-timer-collapsed-time">
              {fmt(remaining)}
              <span className={`apple-timer-collapsed-dot ${isBreak ? 'break' : 'focus'}`} />
            </div>
          </div>
          <div className="apple-timer-collapsed-modes">
            <button
              className={`apple-timer-collapsed-mode ${mode === 'focus' ? 'active' : ''}`}
              onClick={() => switchMode('focus')}
              disabled={running}
            >
              Focus
            </button>
            <button
              className={`apple-timer-collapsed-mode ${mode === 'short' ? 'active' : ''}`}
              onClick={() => switchMode('short')}
              disabled={running}
            >
              Short
            </button>
            <button
              className={`apple-timer-collapsed-mode ${mode === 'long' ? 'active' : ''}`}
              onClick={() => switchMode('long')}
              disabled={running}
            >
              Long
            </button>
          </div>
          <button
            className="apple-timer-collapsed-expand"
            onClick={() => onToggleCollapse(false)}
          >
            <Icons.ChevronDown />
          </button>
        </div>
      </div>
    );
  }

  // ========== FULL MODE ==========
  return (
    <div className={`apple-timer-container${settingsOpen ? ' settings-open' : ''}`} style={{position: 'relative'}}>
      {onToggleCollapse && (
        <button
          className="apple-timer-collapse-btn"
          onClick={() => onToggleCollapse(true)}
          title="Minimize timer"
        >
          <Icons.ChevronUp />
        </button>
      )}
      <div className="apple-timer-glow" />

      {/* Floating controls - settings and help icons in top right */}
      <div className="apple-timer-floating-controls">
        <button
          ref={settingsBtnRef}
          className={`apple-timer-settings-btn${settingsOpen ? " active" : ""}`}
          onClick={() => setSettingsOpen(v => !v)}
          aria-expanded={settingsOpen}
          aria-label="Open settings"
          title="Settings"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4 6h16" stroke="rgba(255,255,255,.70)" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M4 12h16" stroke="rgba(255,255,255,.55)" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M4 18h16" stroke="rgba(255,255,255,.55)" strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="9" cy="6" r="2" stroke="rgba(255,255,255,.90)" strokeWidth="1.8" />
            <circle cx="15" cy="12" r="2" stroke="rgba(255,255,255,.85)" strokeWidth="1.8" />
            <circle cx="11" cy="18" r="2" stroke="rgba(255,255,255,.85)" strokeWidth="1.8" />
          </svg>
        </button>
        <HelpIcon id="focusTimer" onHelpClick={onHelpClick} />
      </div>

      {/* Mode selection buttons */}
      <div className="apple-timer-modes">
        {[
          {k: "focus", t: "Focus"},
          {k: "short", t: "Short Break"},
          {k: "long", t: "Long Break"}
        ].map(x => (
          <button
            key={x.k}
            className={`apple-timer-mode-btn${mode === x.k ? " active" : ""}`}
            onClick={() => setModeSafe(x.k)}
            disabled={running}
          >
            {x.t}
          </button>
        ))}
      </div>

      {/* Circular progress ring display */}
      <div className="apple-timer-display">
        <div className={`apple-timer-ring${running ? ' running' : ''}`}>
          <svg viewBox="0 0 240 240" style={{width: '100%', height: '100%', overflow: 'visible'}}>
            <defs>
              <linearGradient id="gradFocus" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="var(--plum)" />
                <stop offset="1" stopColor="var(--plum-deep)" />
              </linearGradient>
              <linearGradient id="gradBreak" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="var(--plum)" />
                <stop offset="1" stopColor="var(--plum-deep)" />
              </linearGradient>
            </defs>
            <circle cx="120" cy="120" r={r} fill="none" className="timer-ring-track" strokeWidth="6" />
            <circle
              cx="120"
              cy="120"
              r={r}
              fill="none"
              strokeWidth="6"
              strokeLinecap="round"
              stroke="white"
              strokeDasharray={C}
              strokeDashoffset={dashOffset}
              transform="rotate(-90 120 120)"
            />
          </svg>
          <div className="apple-timer-time">
            <div className="apple-timer-time-text">{fmt(remaining)}</div>
            <div className="apple-timer-status">{subLabel}</div>
          </div>
        </div>
      </div>

      {/* Control buttons */}
      <div className="apple-timer-controls">
        <button className="apple-timer-btn apple-timer-btn-secondary" onClick={reset}>
          Reset
        </button>
        <button className="apple-timer-btn apple-timer-btn-primary" onClick={toggleRun}>
          {running ? "Pause" : "Start"}
        </button>
        <button className="apple-timer-btn apple-timer-btn-skip" onClick={skip}>
          Skip
        </button>
      </div>

      {/* Settings overlay panel */}
      <div className={`apple-timer-settings-overlay${settingsOpen ? " open" : ""}`} aria-hidden={!settingsOpen}>
        <div className="apple-timer-settings-backdrop" />
        <div className="apple-timer-settings-panel">
          <aside ref={settingsPanelRef} className="apple-timer-settings-content" id="settings-panel">
            <div className="apple-timer-settings-header">
              <div>
                <div className="apple-timer-settings-title">Settings</div>
                <div className="apple-timer-settings-subtitle">Adjust durations and behavior.</div>
              </div>
              <button
                className="apple-timer-settings-close"
                onClick={() => setSettingsOpen(false)}
                aria-label="Close settings"
                title="Close"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M6 6l12 12" stroke="rgba(255,255,255,.85)" strokeWidth="2" strokeLinecap="round" />
                  <path d="M18 6L6 18" stroke="rgba(255,255,255,.85)" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <div className="apple-timer-settings-body">
              {/* Focus duration setting */}
              <div className="apple-timer-setting-row">
                <div className="apple-timer-setting-label">
                  <div className="apple-timer-setting-label-title">Focus (min)</div>
                  <div className="apple-timer-setting-label-subtitle">Default: 25</div>
                </div>
                <div className="apple-timer-setting-controls">
                  <button
                    className="apple-timer-setting-btn"
                    onClick={() => {
                      const newVal = step(focusMin, -1);
                      setFocusMin(newVal);
                      if (!running) reset();
                    }}
                    aria-label="Decrease Focus"
                  >−</button>
                  <input
                    type="number"
                    className="apple-timer-setting-input"
                    value={focusMin}
                    onChange={(e) => {
                      const n = parseInt(e.target.value || "0", 10);
                      setFocusMin(clamp(Number.isFinite(n) ? n : 1, 1, 180));
                    }}
                    onBlur={() => {
                      if (!running) reset();
                    }}
                    inputMode="numeric"
                    aria-label="Focus minutes"
                  />
                  <button
                    className="apple-timer-setting-btn"
                    onClick={() => {
                      const newVal = step(focusMin, 1);
                      setFocusMin(newVal);
                      if (!running) reset();
                    }}
                    aria-label="Increase Focus"
                  >+</button>
                </div>
              </div>

              {/* Short break duration setting */}
              <div className="apple-timer-setting-row">
                <div className="apple-timer-setting-label">
                  <div className="apple-timer-setting-label-title">Short break (min)</div>
                  <div className="apple-timer-setting-label-subtitle">Default: 5</div>
                </div>
                <div className="apple-timer-setting-controls">
                  <button
                    className="apple-timer-setting-btn"
                    onClick={() => {
                      const newVal = step(shortMin, -1);
                      setShortMin(newVal);
                      if (!running) reset();
                    }}
                    aria-label="Decrease Short break"
                  >−</button>
                  <input
                    type="number"
                    className="apple-timer-setting-input"
                    value={shortMin}
                    onChange={(e) => {
                      const n = parseInt(e.target.value || "0", 10);
                      setShortMin(clamp(Number.isFinite(n) ? n : 1, 1, 180));
                    }}
                    onBlur={() => {
                      if (!running) reset();
                    }}
                    inputMode="numeric"
                    aria-label="Short break minutes"
                  />
                  <button
                    className="apple-timer-setting-btn"
                    onClick={() => {
                      const newVal = step(shortMin, 1);
                      setShortMin(newVal);
                      if (!running) reset();
                    }}
                    aria-label="Increase Short break"
                  >+</button>
                </div>
              </div>

              {/* Long break duration setting */}
              <div className="apple-timer-setting-row">
                <div className="apple-timer-setting-label">
                  <div className="apple-timer-setting-label-title">Long break (min)</div>
                  <div className="apple-timer-setting-label-subtitle">Default: 15</div>
                </div>
                <div className="apple-timer-setting-controls">
                  <button
                    className="apple-timer-setting-btn"
                    onClick={() => {
                      const newVal = step(longMin, -1);
                      setLongMin(newVal);
                      if (!running) reset();
                    }}
                    aria-label="Decrease Long break"
                  >−</button>
                  <input
                    type="number"
                    className="apple-timer-setting-input"
                    value={longMin}
                    onChange={(e) => {
                      const n = parseInt(e.target.value || "0", 10);
                      setLongMin(clamp(Number.isFinite(n) ? n : 1, 1, 180));
                    }}
                    onBlur={() => {
                      if (!running) reset();
                    }}
                    inputMode="numeric"
                    aria-label="Long break minutes"
                  />
                  <button
                    className="apple-timer-setting-btn"
                    onClick={() => {
                      const newVal = step(longMin, 1);
                      setLongMin(newVal);
                      if (!running) reset();
                    }}
                    aria-label="Increase Long break"
                  >+</button>
                </div>
              </div>

              {/* Auto-start toggle */}
              <div className="apple-timer-setting-row">
                <div className="apple-timer-setting-label">
                  <div className="apple-timer-setting-label-title">Auto-start next</div>
                  <div className="apple-timer-setting-label-subtitle">Roll directly into the next session</div>
                </div>
                <button
                  className={`apple-timer-toggle${autoNext ? " on" : ""}`}
                  onClick={() => setAutoNext(v => !v)}
                  role="switch"
                  aria-checked={autoNext}
                >
                  <span className="apple-timer-toggle-knob" />
                </button>
              </div>

              {/* Sound toggle */}
              <div className="apple-timer-setting-row">
                <div className="apple-timer-setting-label">
                  <div className="apple-timer-setting-label-title">Sound</div>
                  <div className="apple-timer-setting-label-subtitle">Soft chime on completion</div>
                </div>
                <button
                  className={`apple-timer-toggle${soundOn ? " on" : ""}`}
                  onClick={() => setSoundOn(v => !v)}
                  role="switch"
                  aria-checked={soundOn}
                >
                  <span className="apple-timer-toggle-knob" />
                </button>
              </div>

              {/* Settings tip */}
              <div style={{paddingTop: '8px', fontSize: '12px', lineHeight: '1.6', color: 'var(--textMuted)'}}>
                Tip: durations update instantly when paused. While running, changes apply next session.
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default TimerCard;
