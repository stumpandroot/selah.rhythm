/**
 * HabitsSection Component
 *
 * Daily habits tracker with streaks, checkboxes, and drag reordering.
 *
 * Features:
 * - Checkbox toggles with visual completion state
 * - 7-day streak visualization (dot indicators)
 * - Drag-to-reorder within habits list
 * - Drag-to-schedule (habits can be dragged to calendar)
 * - Add new habits with inline input
 * - Delete habits
 * - Reset all completed habits
 * - Auto-focus on add input
 * - Keyboard shortcuts (Enter to add, Escape to cancel)
 * - Empty state messaging
 *
 * Props:
 * @param {Array} habits - Array of habit objects [{id, name, desc, done, history}]
 * @param {function} onToggle - Callback when toggling habit completion (id)
 * @param {function} onAdd - Callback when adding new habit (name)
 * @param {function} onDel - Callback when deleting habit (id)
 * @param {function} onReset - Callback to reset all habits
 * @param {function} onReorder - Callback when reordering habits (habitId, targetIndex)
 * @param {function} onHelpClick - Help icon click handler
 *
 * State:
 * - inp: Input value for new habit
 * - showAdd: Show/hide add input row
 * - draggedHabitId: ID of habit being dragged (for reordering)
 * - dragOverIndex: Index of drop target during drag
 *
 * Drag Data Format:
 * {
 *   type: 'habit',
 *   habitId: string,
 *   title: string,
 *   duration: number,
 *   reorder?: boolean  // true for drag-to-reorder
 * }
 *
 * History Format:
 * [{date: 'YYYY-MM-DD', done: boolean}]
 */

import React, { useState, useRef } from 'react';
import * as Icons from '../shared/Icons';

// HelpIcon component
const HelpIcon = ({ id, onHelpClick }) => (
  <button
    type="button"
    className="help-icon-btn"
    aria-label="What is this?"
    onClick={(e) => {
      e.stopPropagation();
      onHelpClick(e, id);
    }}
  >
    <Icons.HelpCircle />
  </button>
);

const HabitsSection = ({ habits, onToggle, onAdd, onDel, onReset, onReorder, onHelpClick }) => {
  const [inp, setInp] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const inputRef = useRef(null);

  // Drag state for reordering
  const [draggedHabitId, setDraggedHabitId] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(-1);

  const add = () => {
    if (inp.trim()) {
      onAdd(inp.trim());
      setInp("");
      setShowAdd(false);
    }
  };

  const handleAddClick = () => {
    setShowAdd(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleCancel = () => {
    setInp("");
    setShowAdd(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") add();
    if (e.key === "Escape") handleCancel();
  };

  // Habit drag handlers - distinguish between drag-to-schedule and drag-to-reorder
  const handleHabitDragStart = (e, habit, isReorderHandle = false) => {
    e.dataTransfer.effectAllowed = 'move';

    // Always use type: 'habit', with reorder flag for reordering within habits list
    const payload = {
      type: 'habit',
      habitId: habit.id,
      title: habit.name,
      duration: 15
    };

    if (isReorderHandle && onReorder) {
      payload.reorder = true;
      setDraggedHabitId(habit.id);

      // Visual feedback for reorder drag
      e.currentTarget.classList.add('dragging');
      if (e.currentTarget.parentElement) {
        e.currentTarget.parentElement.style.opacity = '0.5';
      }
    }

    e.dataTransfer.setData('application/json', JSON.stringify(payload));

    // Custom drag image
    const ghost = document.createElement('div');
    ghost.className = 'drag-ghost';
    ghost.textContent = habit.name.slice(0, 30) + (habit.name.length > 30 ? '...' : '');
    document.body.appendChild(ghost);
    e.dataTransfer.setDragImage(ghost, ghost.offsetWidth / 2, ghost.offsetHeight / 2);
    setTimeout(() => ghost.remove(), 0);
  };

  const handleHabitDragEnd = (e) => {
    e.currentTarget.classList.remove('dragging');
    if (e.currentTarget.parentElement) {
      e.currentTarget.parentElement.style.opacity = '';
    }
    setDraggedHabitId(null);
    setDragOverIndex(-1);
  };

  const handleHabitDragOver = (e, index) => {
    if (!onReorder || draggedHabitId === null) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleHabitDrop = (e, targetIndex) => {
    e.preventDefault();
    e.stopPropagation();
    if (!onReorder || draggedHabitId === null) return;

    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'));
      if (data.type === 'habit' && data.reorder === true && data.habitId === draggedHabitId) {
        const currentIndex = habits.findIndex(h => h.id === draggedHabitId);
        if (currentIndex !== -1 && currentIndex !== targetIndex) {
          onReorder(draggedHabitId, targetIndex);
        }
      }
    } catch (err) {
      console.log('Drop parse error:', err);
    }

    setDraggedHabitId(null);
    setDragOverIndex(-1);
  };

  return (
    <div className="card habits-card">
      <div className="card-header green">
        <h3>
          <span className="card-icon card-icon-sage">
            <Icons.HeartSolid />
          </span>
          Daily Habits
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <HelpIcon id="habits" onHelpClick={onHelpClick} />
          {!showAdd && (
            <button className="habits-add-btn" onClick={handleAddClick} title="Add habit">
              <Icons.Plus />
            </button>
          )}
        </div>
      </div>

      <div className="card-content">
        {habits.map((h, index) => (
          <div
            key={h.id}
            className={`habit-item${dragOverIndex === index ? ' drag-over' : ''}${draggedHabitId === h.id ? ' dragging' : ''}`}
            onDragOver={(e) => {
              if (draggedHabitId !== null && draggedHabitId !== h.id) {
                handleHabitDragOver(e, index);
              }
            }}
            onDrop={(e) => handleHabitDrop(e, index)}
            onDragLeave={(e) => {
              // Only clear if we're actually leaving the item (not entering a child)
              if (!e.currentTarget.contains(e.relatedTarget)) {
                setDragOverIndex(-1);
              }
            }}
          >
            {!h.done && (
              <div
                className="habit-reorder-handle"
                draggable={true}
                onDragStart={(e) => {
                  e.stopPropagation();
                  handleHabitDragStart(e, h, true);
                }}
                onDragEnd={handleHabitDragEnd}
                title="Drag to reorder or schedule"
              >
                <Icons.GripVertical />
              </div>
            )}

            <button
              className={`habit-check${h.done ? " done" : ""}`}
              onClick={() => onToggle(h.id)}
            >
              {h.done && <Icons.Check />}
            </button>

            <div className="habit-info">
              <span className={`habit-name${h.done ? " done" : ""}`}>{h.name}</span>
              {h.desc && <span className="habit-desc">{h.desc}</span>}
            </div>

            <div className="habit-streak">
              {(() => {
                const history = h.history || [];
                const last7 = [];
                for (let i = 6; i >= 0; i--) {
                  const date = new Date();
                  date.setDate(date.getDate() - i);
                  const dateStr = date.toISOString().split('T')[0];
                  const entry = history.find(h => h.date === dateStr);
                  last7.push(entry?.done || false);
                }
                return last7.map((done, i) => (
                  <span key={i} className={`habit-streak-dot${done ? ' done' : ''}`} />
                ));
              })()}
            </div>

            <button className="habit-delete" onClick={() => onDel(h.id)}>
              <Icons.X />
            </button>
          </div>
        ))}

        {showAdd && (
          <div className="habit-add-row">
            <input
              ref={inputRef}
              className="habit-add-input"
              placeholder="New habit..."
              value={inp}
              onChange={e => setInp(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={() => {
                if (!inp.trim()) handleCancel();
              }}
            />
            <div className="habit-add-actions">
              <button className="habit-add-confirm" onClick={add}>
                <Icons.Check />
              </button>
              <button className="habit-add-cancel" onClick={handleCancel}>
                <Icons.X />
              </button>
            </div>
          </div>
        )}

        {habits.length === 0 && !showAdd && (
          <div className="empty-state">Click + to add your first habit</div>
        )}

        {habits.some(h => h.done) && (
          <div className="habits-reset">
            <button className="habits-reset-btn" onClick={onReset}>
              <Icons.Reset /> Reset all
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HabitsSection;
