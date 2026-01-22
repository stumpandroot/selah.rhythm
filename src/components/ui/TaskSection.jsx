/**
 * TaskSection Component
 * Reusable task list card (Primary, Today, This Week, Later)
 *
 * Props:
 * - title: string - Section title
 * - tasks: Array - Array of task objects
 * - list: string - List identifier (primary, today, thisWeek, later)
 * - icon: React component - Icon to display in header
 * - color: string - Color class name for header
 * - max: number - Maximum number of tasks allowed (optional)
 * - onToggle: (taskId) => void - Mark task complete/incomplete
 * - onAdd: (text, category, time) => void - Add new task
 * - onDel: (taskId) => void - Delete task
 * - onEdit: (taskId, newText) => void - Update task text
 * - onCat: (taskId, categoryId) => void - Update task category
 * - onTime: (taskId, timeString) => void - Update time estimate
 * - onMove: (taskId, targetList) => void - Move task to different list
 * - empty: string - Empty state message (optional)
 * - collapsed: boolean - Initial collapsed state (optional)
 * - linkedTaskId: string - ID of task currently in focus (optional)
 * - showTimeToComplete: boolean - Whether to show accumulated focus time
 * - onReorder: (taskId, sourceList, targetList, targetIndex) => void - Reorder tasks
 * - scheduledTaskIds: Set - Set of task IDs that have scheduled blocks
 * - onHelpClick: (event, id) => void - Help icon click handler
 * - taskCategories: Array - Custom categories array (optional)
 */

import React, { useState, useRef } from 'react';
import TaskItem from './TaskItem';
import Icons from '../shared/Icons';

// Help Icon Component
const HelpIcon = ({id, onHelpClick}) => (
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

// Task Section with inline add and drag reordering
const TaskSection = ({title, tasks, list, icon, color, max, onToggle, onAdd, onDel, onEdit, onCat, onTime, onMove, empty, collapsed:initCol, linkedTaskId, showTimeToComplete, onReorder, scheduledTaskIds, onHelpClick, taskCategories}) => {
  // Simple collapse state - initialized once, not reset by parent
  const [col, setCol] = useState(initCol || false);
  const [inp, setInp] = useState("");
  const [showInlineAdd, setShowInlineAdd] = useState(false);
  const [dropIndex, setDropIndex] = useState(-1);
  const inputRef = useRef(null);
  const atMax = max && tasks.length>=max;

  const add = () => {
    if(inp.trim()&&!atMax){
      onAdd(inp.trim(),"none","");
      setInp("");
      setShowInlineAdd(false);
    }
  };

  const handleZoneClick = () => {
    if (!atMax) {
      setShowInlineAdd(true);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  const handleBlur = () => {
    if (!inp.trim()) {
      setShowInlineAdd(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') add();
    if (e.key === 'Escape') {
      setInp("");
      setShowInlineAdd(false);
    }
  };

  // Drag reordering handlers
  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDropIndex(index);
  };

  const handleDragLeave = (e) => {
    // Only reset if leaving the section entirely
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDropIndex(-1);
    }
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    setDropIndex(-1);

    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'));
      if (data.type === 'task' && onReorder) {
        onReorder(data.taskId, data.sourceList, list, targetIndex);
      }
    } catch (err) {
      console.log('Drop parse error:', err);
    }
  };

  const handleSectionDrop = (e) => {
    e.preventDefault();
    setDropIndex(-1);

    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'));
      if (data.type === 'task' && onReorder) {
        // Drop at end of list
        onReorder(data.taskId, data.sourceList, list, tasks.length);
      }
    } catch (err) {
      console.log('Section drop parse error:', err);
    }
  };

  return (
    <div className={`card ${list==="primary"?"primary-card":""}${col?" is-collapsed":""}`}>
      <div
        className={`card-header ${color}${col?" is-collapsed":""}`}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setCol(c => !c);
        }}
        style={{cursor: 'pointer'}}
      >
        <h3>
          <span className={`card-icon ${list==="primary"?"card-icon-terracotta":list==="today"?"card-icon-plum":list==="thisWeek"?"card-icon-ochre":list==="later"?"card-icon-sage":"card-icon-neutral"}`}>{icon}</span>
          {title}
        </h3>
        <div style={{display:"flex",alignItems:"center",gap:"6px"}}>
          <HelpIcon id={list === "primary" ? "primary" : list === "today" ? "today" : list === "thisWeek" ? "thisWeek" : "later"} onHelpClick={onHelpClick} />
          {max && <span className={`task-count${atMax?" at-limit":""}`}>{tasks.length}/{max}</span>}
          {!max && tasks.length>0 && <span className="task-count">{tasks.length}</span>}
          <span className={`collapse-icon${col?" collapsed":""}`}><Icons.ChevronDown /></span>
        </div>
      </div>
      <div
        className={`card-content card-drawer${!col ? ' expanded' : ''}`}
        onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; }}
        onDragLeave={handleDragLeave}
        onDrop={handleSectionDrop}
      >
          {tasks.length===0 && !showInlineAdd && <div className="empty-state">{empty||"No tasks"}</div>}
          {tasks.map((t, idx)=>(
            <div
              key={t.id}
              onDragOver={(e) => handleDragOver(e, idx)}
              onDrop={(e) => handleDrop(e, idx)}
            >
              {dropIndex === idx && <div className="task-drop-line visible" />}
              <TaskItem
                task={t}
                onToggle={onToggle}
                onDel={onDel}
                onEdit={onEdit}
                onCat={onCat}
                onTime={onTime}
                onMove={onMove}
                list={list}
                isActiveFocus={linkedTaskId===t.id}
                showTimeToComplete={showTimeToComplete}
                hasScheduledBlock={scheduledTaskIds?.has(t.id)}
                taskCategories={taskCategories}
              />
            </div>
          ))}
          {dropIndex === tasks.length && <div className="task-drop-line visible" />}

          {/* Inline add zone */}
          {!atMax && (
            showInlineAdd ? (
              <div className="inline-add-zone" style={{background:'var(--toggle-bg)'}}>
                <input
                  ref={inputRef}
                  className="inline-add-input"
                  placeholder="Add a task..."
                  value={inp}
                  onChange={e=>setInp(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onBlur={handleBlur}
                />
              </div>
            ) : (
              <div className="inline-add-zone" onClick={handleZoneClick}>
                <span className="inline-add-placeholder">+ Add a task...</span>
              </div>
            )
          )}
        </div>
      </div>
  );
};

export default TaskSection;
