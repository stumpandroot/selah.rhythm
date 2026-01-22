/**
 * TimerTaskSelector Component
 *
 * Custom dropdown styled for plum background to link tasks to timer.
 * Uses React portal for dropdown positioning.
 *
 * Props:
 * @param {array} tasks - Available tasks to link [{id, text, list}]
 * @param {function} onSelect - Task selection handler (task)
 *
 * Features:
 * - Portal-based dropdown menu
 * - Fixed positioning relative to trigger button
 * - Outside click detection
 * - Escape key to close
 * - Window resize handler
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom';

const TimerTaskSelector = ({ tasks, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0, width: 0 });
  const triggerRef = useRef(null);
  const menuRef = useRef(null);

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setMenuPos({
      top: rect.bottom + 4,
      left: rect.left,
      width: rect.width
    });
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    updatePosition();
    const handleClick = (e) => {
      if (triggerRef.current?.contains(e.target)) return;
      if (menuRef.current?.contains(e.target)) return;
      setIsOpen(false);
    };
    const handleKey = (e) => { if (e.key === 'Escape') setIsOpen(false); };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    window.addEventListener('resize', updatePosition);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isOpen, updatePosition]);

  const menu = isOpen && tasks.length > 0 ? ReactDOM.createPortal(
    <div
      ref={menuRef}
      className="timer-task-menu show"
      style={{
        position: 'fixed',
        top: menuPos.top,
        left: menuPos.left,
        width: menuPos.width,
        zIndex: 9999
      }}
    >
      {tasks.map(task => (
        <div
          key={task.id}
          className="timer-task-option"
          onClick={() => { onSelect(task); setIsOpen(false); }}
        >
          {task.text}
        </div>
      ))}
    </div>,
    document.body
  ) : null;

  return (
    <div className="timer-task-selector">
      <button
        ref={triggerRef}
        className={`timer-task-trigger${isOpen ? ' open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        <span className="timer-task-trigger-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </span>
        <span className="timer-task-trigger-text">Link a task to focus on...</span>
        <svg className="timer-task-trigger-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {menu}
    </div>
  );
};

export default TimerTaskSelector;
