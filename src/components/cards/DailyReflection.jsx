/**
 * DailyReflection Component
 *
 * Evening reflection with 3-question gratitude journal flow.
 * Progressive multi-stage interface: start → grace → stepper → export
 *
 * Props:
 * @param {string} gratitude - Current gratitude text
 * @param {function} setGratitude - Update gratitude
 * @param {object} reflections - {mattered, released, wait}
 * @param {function} setReflections - Update reflections
 * @param {object} reflectionHistory - Past reflections by date offset
 * @param {array} completedToday - Tasks completed today
 * @param {boolean} animationsOn - Enable animations
 * @param {function} onExport - Export complete handler
 * @param {function} onClear - Clear reflections handler
 * @param {function} onHelpClick - Help icon handler
 *
 * Features:
 * - 4-stage flow: start prompt, grace acknowledgment, 3-question stepper, export
 * - Shows completed tasks in grace stage
 * - Read-only view for past dates
 * - Export to text file
 * - Dots background texture
 */

import React, { useState, useEffect, useRef } from 'react';
import Icons from '../shared/Icons';
import DotPattern from '../shared/DotPattern';
import HelpIcon from '../shared/HelpIcon';
import { getToday } from '../../utils/helpers';

const DailyReflection = ({
  gratitude,
  setGratitude,
  reflections,
  setReflections,
  reflectionHistory,
  completedToday = [],
  animationsOn,
  onExport,
  onClear,
  onHelpClick
}) => {
  const [stage, setStage] = useState('start'); // start, grace, stepper, export
  const [stepIndex, setStepIndex] = useState(0);
  const [viewingDate, setViewingDate] = useState(0);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  const today = getToday();
  const isToday = viewingDate === 0;
  const viewData = isToday
    ? { ...reflections, gratitude }
    : (reflectionHistory[viewingDate] || { mattered: '', released: '', wait: '', gratitude: '' });

  const REFLECTION_STEPS = [
    { key: 'mattered', prompt: 'What mattered today?', placeholder: 'The moments that counted...' },
    { key: 'released', prompt: 'What needs to be released?', placeholder: 'Let it go...' },
    { key: 'wait', prompt: 'What can wait?', placeholder: 'It will still be there...' },
    { key: 'gratitude', prompt: 'What are you grateful for?', placeholder: "Today I'm thankful for..." },
  ];

  const getDateLabel = (offset) => {
    if (offset === 0) return `Today, ${today.shortMonth} ${today.date}`;
    const d = new Date();
    d.setDate(d.getDate() + offset);
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}`;
  };

  const canGoBack = viewingDate > -7 && reflectionHistory[viewingDate - 1];
  const canGoForward = viewingDate < 0;

  useEffect(() => {
    if (!showMenu) return;
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setShowMenu(false);
    };
    const handleEscape = (e) => { if (e.key === 'Escape') setShowMenu(false); };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [showMenu]);

  const handleBeginReflection = () => {
    setStage('grace');
  };

  const handleContinueToStepper = () => {
    setStage('stepper');
    setStepIndex(0);
  };

  const handleStepNext = () => {
    if (stepIndex < REFLECTION_STEPS.length - 1) {
      setStepIndex(i => i + 1);
    } else {
      setStage('export');
    }
  };

  const handleStepBack = () => {
    if (stepIndex > 0) {
      setStepIndex(i => i - 1);
    } else {
      setStage('grace');
    }
  };

  const handleStepChange = (key, value) => {
    if (key === 'gratitude') {
      setGratitude(value);
    } else {
      setReflections(r => ({ ...r, [key]: value }));
    }
  };

  const handleExport = () => {
    const dateStr = `${today.day}, ${today.shortMonth} ${today.date}, ${new Date().getFullYear()}`;
    let text = `Selah Rhythm - Daily Reflection - ${dateStr}\n${'='.repeat(40)}\n\n`;

    if (completedToday.length > 0) {
      text += `✓ What you gave your attention to today:\n`;
      completedToday.slice(0, 10).forEach(t => { text += `  • ${t.text}\n`; });
      text += '\n';
    }

    REFLECTION_STEPS.forEach(step => {
      const val = step.key === 'gratitude' ? gratitude : reflections[step.key];
      if (val) {
        text += `${step.prompt}\n${val}\n\n`;
      }
    });

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const date = String(today.date).padStart(2, '0');
    a.download = `reflection-${year}-${month}-${date}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    onExport();
  };

  const handleDone = () => {
    setStage('start');
    setStepIndex(0);
  };

  const handleClear = () => {
    onClear();
    setStage('start');
    setStepIndex(0);
  };

  // If viewing past dates, show read-only view
  if (!isToday) {
    return (
      <div className="card reflection-card has-dots">
        <DotPattern visible={true} animated={animationsOn} />
        <div className="card-header green">
          <h3>
            <span className="card-icon card-icon-ochre"><Icons.Sunset /></span>
            Daily Reflection
          </h3>
          <HelpIcon id="reflection" onHelpClick={onHelpClick} />
        </div>
        <div className="reflection-readonly-notice">Viewing past reflection (read-only)</div>
        <div className="card-content">
          {REFLECTION_STEPS.map(step => {
            const val = step.key === 'gratitude' ? viewData.gratitude : viewData[step.key];
            return val ? (
              <div key={step.key} className="reflection-section">
                <div className="reflection-prompt">{step.prompt}</div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', padding: '8px 0', lineHeight: '1.5' }}>{val}</div>
              </div>
            ) : null;
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="card reflection-card has-dots">
      <DotPattern visible={true} animated={animationsOn} />
      <div className="card-header green">
        <h3>
          <span className="card-icon card-icon-ochre"><Icons.Sunset /></span>
          Daily Reflection
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <HelpIcon id="reflection" onHelpClick={onHelpClick} />
          <div className="reflection-menu-wrapper" ref={menuRef}>
            <button
              className="reflection-menu-btn"
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
            >
              <Icons.MoreVertical />
            </button>
            <div className={`reflection-menu${showMenu ? ' open' : ''}`}>
              <div
                className="reflection-menu-item"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(false);
                  handleExport();
                }}
              >
                <Icons.Download /> Export
              </div>
              <div
                className="reflection-menu-item danger"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(false);
                  handleClear();
                }}
              >
                <Icons.Trash /> Clear
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stage 1: Start prompt */}
      {stage === 'start' && (
        <div className="reflection-start">
          <div className="reflection-header">
            <div className="reflection-icon-badge"><Icons.SunriseSolid /></div>
            <div className="reflection-title">Daily Reflection</div>
            <div className="reflection-subtitle">Close the day with intention</div>
          </div>
          <button className="reflection-start-btn" onClick={handleBeginReflection}>Begin Reflection</button>
        </div>
      )}

      {/* Stage 2: Grace affirmation */}
      {stage === 'grace' && (
        <div className="reflection-grace">
          <div className="grace-panel">
            {completedToday.length > 0 ? (
              <>
                <div className="grace-message">Here's what you gave your attention to today.</div>
                <div className="grace-tasks-list">
                  {completedToday.slice(0, 5).map(t => (
                    <div key={t.id} className="grace-task-item"><Icons.Check />{t.text}</div>
                  ))}
                  {completedToday.length > 5 && <div className="grace-more">+{completedToday.length - 5} more</div>}
                </div>
              </>
            ) : (
              <div className="grace-message">It's okay. Tomorrow is not lost.<br />Every day is a new beginning.</div>
            )}
          </div>
          <button className="reflection-start-btn" onClick={handleContinueToStepper}>Continue</button>
        </div>
      )}

      {/* Stage 3: Stepper */}
      {stage === 'stepper' && (
        <div className="reflection-stepper">
          <div className="stepper-step">
            <div className="stepper-label">QUESTION {stepIndex + 1} OF {REFLECTION_STEPS.length}</div>
            <div className="stepper-question">{REFLECTION_STEPS[stepIndex].prompt}</div>
            <textarea
              className="reflection-textarea"
              placeholder={REFLECTION_STEPS[stepIndex].placeholder}
              value={REFLECTION_STEPS[stepIndex].key === 'gratitude' ? gratitude : reflections[REFLECTION_STEPS[stepIndex].key] || ''}
              onChange={e => handleStepChange(REFLECTION_STEPS[stepIndex].key, e.target.value)}
              autoFocus
            />
          </div>
          <div className="stepper-footer">
            <div className="stepper-dots">
              {REFLECTION_STEPS.map((_, i) => (
                <div key={i} className={`stepper-dot${i < stepIndex ? ' done' : i === stepIndex ? ' active' : ''}`} />
              ))}
            </div>
            <div className="stepper-actions">
              <button className="stepper-btn-skip" onClick={handleStepBack}>Skip</button>
              <button className="stepper-btn-continue" onClick={handleStepNext}>
                {stepIndex < REFLECTION_STEPS.length - 1 ? 'Continue' : 'Finish'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stage 4: Export */}
      {stage === 'export' && (
        <div className="reflection-export">
          <div className="export-success">
            <div className="export-success-icon"><Icons.Check /></div>
            <div className="export-success-text">Reflection complete. Well done.</div>
          </div>
          <div className="export-actions">
            <button className="export-btn" onClick={handleExport}><Icons.Download /> Export</button>
            <button className="export-btn primary" onClick={handleDone}>Done</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyReflection;
