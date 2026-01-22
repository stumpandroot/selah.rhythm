import { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import * as Icons from '../shared/Icons';
import AnchorsSection from '../cards/AnchorsSection';
import HabitsSection from '../cards/HabitsSection';
import DailyWisdomCard from '../cards/DailyWisdomCard';
import TaskSection from '../ui/TaskSection';
import MobileAccordionSection from '../mobile/MobileAccordionSection';
import HelpIcon from '../shared/HelpIcon';
import { HOUR_HEIGHT } from '../../data/constants';
import { genId, fmtHour, fmtTimeSlot, addMinutes, getToday } from '../../utils/helpers';

/**
 * OrderView Component
 *
 * Main planning view with 3-column layout:
 * - Left: Anchors, Habits, Daily Wisdom
 * - Center: Schedule with drag-and-drop time blocking
 * - Right: Task lists (Primary, Today, This Week, Later)
 *
 * Key Features:
 * - Schedule card with hour-based grid and 15-minute snapping
 * - Drag tasks/habits from sidebars onto schedule
 * - Drag-to-reorder schedule blocks
 * - Modal for creating/editing schedule events
 * - Support for event types: event, task, habit
 * - Persistent schedule items that survive daily reset
 * - Mobile accordion system for left column
 *
 * Schedule Grid:
 * - Configurable start hour (5-10 AM) and length (4-12 hours)
 * - 15-minute time slots with visual snapping
 * - Drop preview indicator during drag operations
 * - Floating time label during block repositioning
 *
 * Modal Features:
 * - Type selector: Event / Task / Habit
 * - Task/habit picker for linking schedule items
 * - Time picker with AM/PM toggle
 * - Duration presets (15m to 4h) plus custom input
 * - Persistent toggle to prevent daily reset
 * - Portal rendering for proper z-index
 *
 * Mobile Behavior:
 * - Accordion for Anchors/Habits/Wisdom on small screens
 * - Full task cards visible at all times
 * - Schedule optimized for touch interaction
 *
 * @param {Object} props
 * @param {Object} props.tasks - Task lists: {primary, today, thisWeek, later}
 * @param {Function} props.toggleTask - Toggle task completion: (id, list) => void
 * @param {Function} props.addTask - Add task: (text, list, category, time) => void
 * @param {Function} props.delTask - Delete task: (id, list) => void
 * @param {Function} props.editTask - Edit task: (id, list, text) => void
 * @param {Function} props.updCat - Update category: (id, list, category) => void
 * @param {Function} props.updTime - Update time estimate: (id, list, time) => void
 * @param {Function} props.moveTask - Move to list: (id, sourceList, destList) => void
 * @param {Function} props.reorderTask - Reorder: (id, sourceList, destList, index) => void
 * @param {Array} props.habits - Habit items with {id, name, done, streak}
 * @param {Function} props.togHabit - Toggle habit: (id) => void
 * @param {Function} props.addHabit - Add habit: (name) => void
 * @param {Function} props.delHabit - Delete habit: (id) => void
 * @param {Function} props.resetHabits - Reset all habits for new day
 * @param {Function} props.reorderHabit - Reorder habits: (dragIndex, hoverIndex) => void
 * @param {Array} props.anchors - Life anchors with {id, text, emoji}
 * @param {Function} props.addAnchor - Add anchor: (text, emoji) => void
 * @param {Function} props.editAnchor - Edit anchor: (id, text, emoji) => void
 * @param {Function} props.delAnchor - Delete anchor: (id) => void
 * @param {Array} props.schedEvents - Schedule events with {id, title, hour, minute, duration, type, itemRef, persistent}
 * @param {Function} props.setSchedEvents - Update schedule events
 * @param {boolean} props.showTimeToComplete - Show time estimates on tasks
 * @param {number} props.snapIncrement - Schedule snap increment in minutes (default: 15)
 * @param {Object} props.settings - App settings
 * @param {Function} props.setSettings - Update settings
 * @param {Function} props.onHelpClick - Help icon handler: (helpId) => void
 * @param {Array} props.taskCategories - Available task categories
 * @param {string} props.mobileAccordion - Active mobile accordion panel
 * @param {Function} props.setMobileAccordion - Set active accordion panel
 */
const OrderView = ({
  tasks,
  toggleTask,
  addTask,
  delTask,
  editTask,
  updCat,
  updTime,
  moveTask,
  reorderTask,
  habits,
  togHabit,
  addHabit,
  delHabit,
  resetHabits,
  reorderHabit,
  anchors,
  addAnchor,
  editAnchor,
  delAnchor,
  schedEvents,
  setSchedEvents,
  showTimeToComplete,
  snapIncrement,
  settings,
  setSettings,
  onHelpClick,
  taskCategories,
  mobileAccordion,
  setMobileAccordion
}) => {
  // Schedule configuration state
  const [startH, setStartH] = useState(9);
  const [len, setLen] = useState(8);

  // Modal state
  const [popover, setPopover] = useState(null);
  const [popTitle, setPopTitle] = useState('');
  const [popDuration, setPopDuration] = useState(30);
  const [popHour, setPopHour] = useState(9);
  const [popMinute, setPopMinute] = useState(0);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [customDur, setCustomDur] = useState('');
  const [popType, setPopType] = useState('event'); // 'event' | 'task' | 'habit'
  const [popItemRef, setPopItemRef] = useState(null); // For task/habit reference
  const [popPersistent, setPopPersistent] = useState(false); // For persistent schedule items

  // Drag state
  const [dropPreview, setDropPreview] = useState(null); // {top, height, time}
  const [isDraggingBlock, setIsDraggingBlock] = useState(null);
  const [dragLabel, setDragLabel] = useState(null); // {x, y, time} for floating label

  // Modal animation state
  const [isClosingModal, setIsClosingModal] = useState(false);

  const today = getToday();
  const hours = Array.from({length:len},(_,i)=>startH+i).filter(h=>h<24);
  const gridRef = useRef(null);
  const snap = snapIncrement || 15;
  const GRID_TOP_PADDING = 6; // Must match CSS .schedule-grid padding-top

  // Duration presets for modal
  const DURATION_PRESETS = [
    { value: 15, label: '15m' },
    { value: 30, label: '30m' },
    { value: 45, label: '45m' },
    { value: 60, label: '1h' },
    { value: 90, label: '1.5h' },
    { value: 120, label: '2h' },
    { value: 180, label: '3h' },
    { value: 240, label: '4h' },
  ];

  /**
   * Handle schedule reset button
   */
  const handleScheduleReset = () => {
    if (window.confirm("Reset today's schedule? This will clear all scheduled items.")) {
      setSchedEvents([]);
    }
  };

  /**
   * Combine all tasks for the task picker
   */
  const allTasks = [
    ...tasks.primary.map(t => ({...t, list: 'primary', listLabel: 'Primary'})),
    ...tasks.today.map(t => ({...t, list: 'today', listLabel: 'Today'})),
    ...tasks.thisWeek.map(t => ({...t, list: 'thisWeek', listLabel: 'This Week'})),
    ...tasks.later.map(t => ({...t, list: 'later', listLabel: 'Later'})),
  ].filter(t => !t.done);

  /**
   * Build set of scheduled task IDs to show visual indicator
   */
  const scheduledTaskIds = new Set(
    schedEvents.filter(e => e.itemRef?.type === 'task').map(e => e.itemRef.id)
  );

  /**
   * ESC key handler for modal
   */
  useEffect(() => {
    if (popover) {
      const handleEsc = (e) => { if (e.key === 'Escape') closeModal(); };
      window.addEventListener('keydown', handleEsc);
      return () => {
        window.removeEventListener('keydown', handleEsc);
      };
    }
  }, [popover]);

  /**
   * Convert clientY position to hour/minute time
   */
  const getTimeFromY = (y, rect) => {
    // Calculate position relative to the schedule grid content area
    // Account for GRID_TOP_PADDING to align with getBlockStyle
    const relY = y - rect.top;

    // Subtract padding before calculating time position
    const adjustedY = Math.max(0, relY - GRID_TOP_PADDING);

    // Calculate usable height and clamp to valid range
    const usableHeight = len * HOUR_HEIGHT;
    const clampedY = Math.max(0, Math.min(adjustedY, usableHeight - 1));

    // Calculate hours and minutes from position
    const totalMinutes = (clampedY / HOUR_HEIGHT) * 60;
    const hourOffset = Math.floor(totalMinutes / 60);
    const rawMinute = totalMinutes % 60;

    // Snap to 5-minute increments
    const snappedMinute = Math.round(rawMinute / 5) * 5;

    // Handle rollover if snappedMinute becomes 60
    let finalHour = startH + hourOffset;
    let finalMinute = snappedMinute;
    if (finalMinute >= 60) {
      finalMinute = 0;
      finalHour = Math.min(finalHour + 1, startH + len - 1);
    }

    // Clamp hour to valid range
    finalHour = Math.max(startH, Math.min(finalHour, startH + len - 1));

    return { hour: finalHour, minute: Math.max(0, Math.min(finalMinute, 55)) };
  };

  /**
   * Snap minutes to 5-minute increments
   */
  const snapToIncrement = (minutes) => {
    const snapped = Math.round(minutes / 5) * 5;
    return snapped >= 60 ? 55 : snapped;
  };

  /**
   * Open modal for adding or editing schedule item
   */
  const openPopover = (mode, hour, minute, event, x, y) => {
    if (mode === 'edit' && event) {
      setPopTitle(event.title);
      setPopDuration(event.duration);
      setPopHour(event.hour);
      setPopMinute(event.minute);
      setPopType(event.type || 'event');
      setPopItemRef(event.itemRef || null);
      setPopPersistent(event.persistent || false);
    } else {
      setPopTitle('');
      setPopDuration(30);
      setPopHour(hour);
      setPopMinute(minute);
      setPopType('event');
      setPopItemRef(null);
      setPopPersistent(false);
    }
    setCustomDur('');
    setPopover({ mode, event, x, y });
  };

  /**
   * Handle click on schedule grid to add new item
   */
  const handleGridClick = (e) => {
    if (!gridRef.current || popover) return;
    const rect = gridRef.current.getBoundingClientRect();
    const { hour, minute } = getTimeFromY(e.clientY, rect);
    openPopover('add', hour, minute, null, Math.min(e.clientX - rect.left, 180), e.clientY - rect.top);
  };

  /**
   * Handle click on schedule block to edit
   */
  const handleBlockClick = (e, event) => {
    e.stopPropagation();
    if (!gridRef.current) return;
    const rect = gridRef.current.getBoundingClientRect();
    openPopover('edit', event.hour, event.minute, event, Math.min(e.clientX - rect.left, 180), e.clientY - rect.top);
  };

  /**
   * Schedule grid drag handlers
   */
  const handleScheduleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';

    if (!gridRef.current) return;
    const rect = gridRef.current.getBoundingClientRect();
    const { hour, minute } = getTimeFromY(e.clientY, rect);

    // Determine duration from dragged item
    // Safari-safe: DataTransfer.types can be DOMStringList (no .includes)
    let duration = 60;
    try {
      const types = e.dataTransfer?.types;
      const hasJson = types ? (typeof types.contains === 'function' ? types.contains('application/json') : Array.from(types).includes('application/json')) : false;
      const data = hasJson ? JSON.parse(e.dataTransfer.getData('application/json')) : null;
      if (data?.duration) duration = data.duration;
      if (data?.type === 'habit') duration = 15;
    } catch {}

    // Calculate preview position - pure math with GRID_TOP_PADDING
    const hoursFromStart = (hour - startH) + (minute / 60);
    const top = (hoursFromStart * HOUR_HEIGHT) + GRID_TOP_PADDING;
    const height = Math.max((duration / 60) * HOUR_HEIGHT, 24);
    const maxTop = len * HOUR_HEIGHT - height;

    setDropPreview({
      top: Math.max(0, Math.min(top, maxTop)),
      height,
      time: fmtTimeSlot(hour, minute)
    });

    // Set floating drag label position
    setDragLabel({
      x: e.clientX,
      y: e.clientY,
      time: fmtTimeSlot(hour, minute)
    });
  };

  const handleScheduleDragLeave = (e) => {
    // Only clear if actually leaving the grid
    if (!gridRef.current?.contains(e.relatedTarget)) {
      setDropPreview(null);
      setDragLabel(null);
    }
  };

  const handleScheduleDrop = (e) => {
    e.preventDefault();
    setDropPreview(null);
    setDragLabel(null);

    if (!gridRef.current) return;
    const rect = gridRef.current.getBoundingClientRect();
    const { hour, minute } = getTimeFromY(e.clientY, rect);

    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'));

      if (data.type === 'task') {
        // Create scheduled item for task
        const task = allTasks.find(t => t.id === data.taskId);
        if (task) {
          const duration = parseInt(task.time) || 30;
          setSchedEvents(prev => [...prev, {
            id: genId(),
            title: task.text,
            hour,
            minute,
            duration,
            type: 'task',
            itemRef: { type: 'task', id: task.id, list: task.list }
          }]);
        }
      } else if (data.type === 'habit') {
        // Create scheduled item for habit
        const habit = habits.find(h => h.id === data.habitId);
        if (habit) {
          setSchedEvents(prev => [...prev, {
            id: genId(),
            title: habit.name,
            hour,
            minute,
            duration: 15,
            type: 'habit',
            itemRef: { type: 'habit', id: habit.id }
          }]);
        }
      } else if (data.type === 'scheduleBlock' && data.blockId) {
        // Moving existing block
        const workdayMinutes = len * 60;
        const newTotalMinutes = (hour - startH) * 60 + minute;
        const duration = data.duration || 30;
        const clampedMinutes = Math.max(0, Math.min(newTotalMinutes, workdayMinutes - duration));
        const newHour = startH + Math.floor(clampedMinutes / 60);
        const newMinute = snapToIncrement(clampedMinutes % 60);

        setSchedEvents(prev => prev.map(ev =>
          ev.id === data.blockId
            ? { ...ev, hour: newHour, minute: newMinute }
            : ev
        ));
      }
    } catch (err) {
      console.log('Schedule drop error:', err);
    }
  };

  /**
   * Block drag handlers
   */
  const handleBlockDragStart = (e, event) => {
    e.stopPropagation();
    setIsDraggingBlock(event.id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('application/json', JSON.stringify({
      type: 'scheduleBlock',
      blockId: event.id,
      title: event.title,
      duration: event.duration
    }));
    // Custom drag image
    const ghost = document.createElement('div');
    ghost.className = 'drag-ghost';
    ghost.textContent = event.title.slice(0,25) + (event.title.length > 25 ? '...' : '');
    document.body.appendChild(ghost);
    e.dataTransfer.setDragImage(ghost, ghost.offsetWidth / 2, ghost.offsetHeight / 2);
    setTimeout(() => ghost.remove(), 0);
  };

  const handleBlockDragEnd = () => {
    setIsDraggingBlock(null);
    setDropPreview(null);
    setDragLabel(null);
  };

  /**
   * Save event from modal
   */
  const saveEvent = () => {
    // Determine title based on type
    let title = popTitle.trim();
    let itemRef = null;

    if (popType === 'task' && popItemRef) {
      const task = allTasks.find(t => `${t.list}:${t.id}` === popItemRef);
      if (task) {
        title = task.text;
        itemRef = { type: 'task', id: task.id, list: task.list };
      }
    } else if (popType === 'habit' && popItemRef) {
      const habit = habits.find(h => h.id === popItemRef);
      if (habit) {
        title = habit.name;
        itemRef = { type: 'habit', id: habit.id };
      }
    }

    if (!title) return;

    const finalDuration = customDur ? Math.min(600, Math.max(1, parseInt(customDur) || 30)) : popDuration;
    if (popover.mode === 'add') {
      setSchedEvents(prev => [...prev, {
        id: genId(),
        title,
        hour: popHour,
        minute: popMinute,
        duration: finalDuration,
        type: popType,
        itemRef,
        persistent: popPersistent || false
      }]);
    } else {
      setSchedEvents(prev => prev.map(ev => ev.id === popover.event.id ? {
        ...ev,
        title,
        hour: popHour,
        minute: popMinute,
        duration: finalDuration,
        type: popType,
        itemRef,
        persistent: popPersistent || false
      } : ev));
    }
    setPopover(null);
  };

  /**
   * Delete event from modal
   */
  const deleteEvent = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    if (popover.event) setSchedEvents(prev => prev.filter(e => e.id !== popover.event.id));
    setPopover(null);
    setConfirmDelete(false);
  };

  /**
   * Close modal with animation
   */
  const closeModal = () => {
    // Trigger closing animation
    setIsClosingModal(true);
    // Wait for animation to complete before unmounting
    setTimeout(() => {
      setPopover(null);
      setConfirmDelete(false);
      setIsClosingModal(false);
    }, 180);
  };

  /**
   * Calculate block style for schedule event
   */
  const getBlockStyle = (event) => {
    // Calculate position purely mathematically - no DOM measurements during render
    // Position = (hours from start) * HOUR_HEIGHT + GRID_TOP_PADDING
    // For 11:00 with startH=9: hoursFromStart = 11-9 = 2, plus minute fraction
    const hoursFromStart = (event.hour - startH) + (event.minute / 60);
    const top = (hoursFromStart * HOUR_HEIGHT) + GRID_TOP_PADDING;
    const height = (event.duration / 60) * HOUR_HEIGHT;
    // Return pixel values - no additional offsets needed since events are positioned
    // within the schedule-grid which starts at the first hour row
    return { top: `${top}px`, height: `${Math.max(height, 24)}px` };
  };

  /**
   * Check if event is compact (30 minutes or less)
   */
  const isCompact = (event) => event.duration <= 30;

  /**
   * Handle type change in modal
   */
  const handleTypeChange = (newType) => {
    setPopType(newType);
    setPopItemRef(null);
    if (newType === 'event') {
      setPopTitle('');
    }
  };

  /**
   * Compute end time for preview
   */
  const endTime = addMinutes(popHour, popMinute, customDur ? parseInt(customDur) || 30 : popDuration);

  /**
   * Get display title based on selection
   */
  const getDisplayTitle = () => {
    if (popType === 'task' && popItemRef) {
      const task = allTasks.find(t => `${t.list}:${t.id}` === popItemRef);
      return task ? task.text : '';
    }
    if (popType === 'habit' && popItemRef) {
      const habit = habits.find(h => h.id === popItemRef);
      return habit ? habit.name : '';
    }
    return popTitle;
  };

  /**
   * Mobile detection for accordion
   */
  const isMobileView = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <div className="order-layout">
      <div className="column">
        {isMobileView && setMobileAccordion ? (
          <MobileAccordionSection
            activePanel={mobileAccordion}
            onToggle={setMobileAccordion}
            anchors={anchors}
            habits={habits}
            addAnchor={addAnchor}
            editAnchor={editAnchor}
            delAnchor={delAnchor}
            togHabit={togHabit}
            addHabit={addHabit}
            delHabit={delHabit}
            resetHabits={resetHabits}
            onHelpClick={onHelpClick}
          />
        ) : (
          <>
            <AnchorsSection anchors={anchors} onAdd={addAnchor} onEdit={editAnchor} onDel={delAnchor} onHelpClick={onHelpClick} />
            <HabitsSection habits={habits} onToggle={togHabit} onAdd={addHabit} onDel={delHabit} onReset={resetHabits} onReorder={reorderHabit} onHelpClick={onHelpClick} />
            <DailyWisdomCard onHelpClick={onHelpClick} />
          </>
        )}
      </div>
      <div className="column">
        <div className="card schedule-card">
          <div className="card-header blue has-dots">
            <h3>
              <span className="card-icon card-icon-sage"><Icons.CalendarSolid /></span>
              Schedule
            </h3>
            <div className="schedule-header-date">{today.shortDay}, {today.shortMonth} {today.date}</div>
            <div style={{display: 'flex', alignItems: 'center', gap: '6px'}}>
              <button
                className="schedule-reset-btn"
                onClick={handleScheduleReset}
                title="Reset today's schedule"
              >
                <Icons.Reset />
              </button>
              <HelpIcon id="schedule" onHelpClick={onHelpClick} />
            </div>
          </div>
          <div className="schedule-settings">
            <div className="schedule-setting"><span>Start:</span><select value={startH} onChange={e=>setStartH(+e.target.value)}>{[5,6,7,8,9,10].map(h=><option key={h} value={h}>{h} AM</option>)}</select></div>
            <div className="schedule-setting"><span>Hours:</span><select value={len} onChange={e=>setLen(+e.target.value)}>{[4,6,8,9,10,12].map(n=><option key={n} value={n}>{n}</option>)}</select></div>
          </div>
          <div
            className={`card-content schedule-grid${dropPreview ? ' drag-over' : ''}${isDraggingBlock ? ' dragging' : ''}`}
            data-grid={snap}
            ref={gridRef}
            onClick={handleGridClick}
            onDragOver={handleScheduleDragOver}
            onDragLeave={handleScheduleDragLeave}
            onDrop={handleScheduleDrop}
          >
            {hours.map(h=>(
              <div key={h} className="schedule-hour">
                <div className="hour-label">{fmtHour(h)}</div>
                <div className="hour-slots">
                  {[0,15,30,45].map(q=>(
                    <div
                      key={q}
                      className="quarter-slot"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (popover) return;
                        const slotEl = e.currentTarget;
                        const rect = slotEl.getBoundingClientRect();
                        const gridRect = gridRef.current?.getBoundingClientRect();
                        if (!gridRect) return;
                        const x = Math.min(rect.left - gridRect.left + 10, 180);
                        const y = rect.top - gridRect.top + rect.height / 2;
                        openPopover('add', h, q, null, x, y);
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
            {schedEvents.filter(e => e.hour >= startH && e.hour < startH + len).map(event => (
              <div
                key={event.id}
                className={`schedule-block${event.type === 'task' ? ' type-task' : event.type === 'habit' ? ' type-habit' : ''}${isDraggingBlock === event.id ? ' dragging' : ''}${isCompact(event) ? ' compact' : ''}`}
                style={getBlockStyle(event)}
                onClick={e => handleBlockClick(e, event)}
                draggable
                onDragStart={(e) => handleBlockDragStart(e, event)}
                onDragEnd={handleBlockDragEnd}
              >
                {(() => {
                  const startTime = fmtTimeSlot(event.hour, event.minute);
                  const durationStr = event.duration >= 60
                    ? `${Math.floor(event.duration/60)}h${event.duration%60 ? event.duration%60 : ''}`
                    : `${event.duration}m`;

                  if (isCompact(event)) {
                    return (
                      <>
                        <div className="schedule-block-title">
                          <span className="schedule-block-time">{startTime}</span> {event.title}
                        </div>
                        <div className="schedule-block-meta">{durationStr}</div>
                      </>
                    );
                  }
                  return (
                    <>
                      <div className="schedule-block-time">{startTime}</div>
                      <div className="schedule-block-title">{event.title}</div>
                      <div className="schedule-block-meta">
                        {event.type === 'task' && <><Icons.Target /> Task · </>}
                        {event.type === 'habit' && <><Icons.Heart /> Habit · </>}
                        {durationStr}
                      </div>
                    </>
                  );
                })()}
              </div>
            ))}
            {/* Drop preview */}
            {dropPreview && (
              <div
                className="schedule-drop-preview visible"
                style={{ top: dropPreview.top, height: dropPreview.height }}
              >
                {dropPreview.time}
              </div>
            )}
            {/* Floating drag time label */}
            {dragLabel && (
              <div
                className="schedule-drag-label"
                style={{ left: dragLabel.x, top: dragLabel.y }}
              >
                {dragLabel.time}
              </div>
            )}
            {/* Modal rendered via portal to avoid transform/fixed positioning issues */}
            {popover && ReactDOM.createPortal(
              <div
                className={`schedule-modal-overlay${isClosingModal ? ' closing' : ''}`}
                onClick={closeModal}
                onKeyDown={e => {
                  if (e.key === 'Escape') closeModal();
                }}
              >
                <div
                  className="schedule-modal"
                  onClick={e => e.stopPropagation()}
                  onKeyDown={e => {
                    if (e.key === 'Escape') closeModal();
                    if (e.key === 'Enter' && !confirmDelete && e.target.tagName !== 'BUTTON') saveEvent();
                  }}
                >
                  <div className="schedule-modal-header">
                    <div className="schedule-modal-title">{popover.mode === 'add' ? 'New Item' : 'Edit Item'}</div>
                    <button className="schedule-modal-close" onClick={closeModal}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
                    </button>
                  </div>
                  <div className="schedule-modal-content">
                    {/* Type Selector */}
                    <div className="schedule-modal-type-control">
                      <button
                        className={`schedule-modal-type-btn${popType === 'event' ? ' active type-event' : ''}`}
                        onClick={() => handleTypeChange('event')}
                      >
                        <Icons.Calendar /> Event
                      </button>
                      <button
                        className={`schedule-modal-type-btn${popType === 'task' ? ' active type-task' : ''}`}
                        onClick={() => handleTypeChange('task')}
                      >
                        <Icons.Target /> Task
                      </button>
                      <button
                        className={`schedule-modal-type-btn${popType === 'habit' ? ' active type-habit' : ''}`}
                        onClick={() => handleTypeChange('habit')}
                      >
                        <Icons.Heart /> Habit
                      </button>
                    </div>

                    {/* Title / Item Picker based on type */}
                    {popType === 'event' && (
                      <div className="schedule-modal-field">
                        <label className="schedule-modal-label">Title</label>
                        <input className="schedule-modal-input" placeholder="Event name..." value={popTitle} onChange={e=>setPopTitle(e.target.value)} autoFocus onKeyDown={e=>e.key==='Enter'&&saveEvent()} />
                      </div>
                    )}

                    {popType === 'task' && (
                      <div className="schedule-modal-field">
                        <label className="schedule-modal-label">Select Task</label>
                        <div className="schedule-modal-picker">
                          <select
                            value={popItemRef || ''}
                            onChange={e => setPopItemRef(e.target.value || null)}
                          >
                            <option value="">Choose a task...</option>
                            {allTasks.map(t => (
                              <option key={`${t.list}:${t.id}`} value={`${t.list}:${t.id}`}>
                                [{t.listLabel}] {t.text.slice(0, 30)}{t.text.length > 30 ? '...' : ''}
                              </option>
                            ))}
                          </select>
                        </div>
                        {allTasks.length === 0 && (
                          <div style={{fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px'}}>
                            No tasks available. Add tasks first.
                          </div>
                        )}
                      </div>
                    )}

                    {popType === 'habit' && (
                      <div className="schedule-modal-field">
                        <label className="schedule-modal-label">Select Habit</label>
                        <div className="schedule-modal-picker">
                          <select
                            value={popItemRef || ''}
                            onChange={e => setPopItemRef(e.target.value || null)}
                          >
                            <option value="">Choose a habit...</option>
                            {habits.map(h => (
                              <option key={h.id} value={h.id}>{h.name}</option>
                            ))}
                          </select>
                        </div>
                        {habits.length === 0 && (
                          <div style={{fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px'}}>
                            No habits available. Add habits first.
                          </div>
                        )}
                      </div>
                    )}

                    <div className="time-section">
                      <div className="time-row">
                        <span className="time-row-label">Start</span>
                        <div className="start-time-picker">
                          <select
                            value={popHour % 12 === 0 ? 12 : popHour % 12}
                            onChange={e => {
                              const hour12 = parseInt(e.target.value);
                              const isPM = popHour >= 12;
                              const hour24 = isPM ? (hour12 === 12 ? 12 : hour12 + 12) : (hour12 === 12 ? 0 : hour12);
                              setPopHour(hour24);
                            }}
                          >
                            {[12,1,2,3,4,5,6,7,8,9,10,11].map(h => (
                              <option key={h} value={h}>{h}</option>
                            ))}
                          </select>
                          <span className="time-separator">:</span>
                          <select
                            value={popMinute}
                            onChange={e => setPopMinute(parseInt(e.target.value))}
                          >
                            {[0,5,10,15,20,25,30,35,40,45,50,55].map(m => (
                              <option key={m} value={m}>{m.toString().padStart(2,'0')}</option>
                            ))}
                          </select>
                          <div className="ampm-toggle">
                            <button
                              type="button"
                              className={`ampm-btn${popHour < 12 ? ' active' : ''}`}
                              onClick={() => setPopHour(popHour >= 12 ? popHour - 12 : popHour)}
                            >AM</button>
                            <button
                              type="button"
                              className={`ampm-btn${popHour >= 12 ? ' active' : ''}`}
                              onClick={() => setPopHour(popHour < 12 ? popHour + 12 : popHour)}
                            >PM</button>
                          </div>
                        </div>
                      </div>
                      <div className="time-row-end">
                        Ends at <strong>{fmtTimeSlot(endTime.hour, endTime.minute)}</strong>
                      </div>
                      <div className="duration-section-label">Duration</div>
                      <div className="duration-chips">
                        {DURATION_PRESETS.map(d=>(
                          <button key={d.value} className={`duration-chip${!customDur && popDuration===d.value?' active':''}`} onClick={()=>{setPopDuration(d.value);setCustomDur('');}}>
                            {d.label}
                          </button>
                        ))}
                      </div>
                      <div className="duration-custom">
                        <input type="number" placeholder="Custom minutes" value={customDur} onChange={e=>setCustomDur(e.target.value)} min="5" max="600" step="5" className="duration-custom-input" />
                      </div>
                    </div>
                    <div className="schedule-modal-field schedule-modal-checkbox-field">
                      <label className="schedule-modal-checkbox-label">
                        <input
                          type="checkbox"
                          checked={popPersistent || false}
                          onChange={e => setPopPersistent(e.target.checked)}
                        />
                        <span>Keep daily</span>
                        <span className="checkbox-hint">(won't reset at midnight)</span>
                      </label>
                    </div>
                  </div>
                  <div className="schedule-modal-actions">
                    <button className="schedule-modal-btn secondary" onClick={closeModal}>Cancel</button>
                    {popover.mode === 'edit' && (
                      <button
                        className={`schedule-modal-btn danger${confirmDelete ? ' confirming' : ''}`}
                        onClick={deleteEvent}
                      >
                        {confirmDelete ? 'Confirm Delete' : 'Delete'}
                      </button>
                    )}
                    <button className="schedule-modal-btn primary" onClick={saveEvent}>Save</button>
                  </div>
                </div>
              </div>,
              document.body
            )}
          </div>
        </div>
      </div>
      <div className="column">
        <TaskSection title=" Primary" tasks={tasks.primary} list="primary" icon={<Icons.StarSolid />} color="warm" onToggle={id=>toggleTask(id,"primary")} onAdd={(t,c,tm)=>addTask(t,"primary",c,tm)} onDel={id=>delTask(id,"primary")} onEdit={(id,t)=>editTask(id,"primary",t)} onCat={(id,c)=>updCat(id,"primary",c)} onTime={(id,tm)=>updTime(id,"primary",tm)} onMove={(id,to)=>moveTask(id,"primary",to)} empty="What matters most?" showTimeToComplete={showTimeToComplete} onReorder={reorderTask} scheduledTaskIds={scheduledTaskIds} onHelpClick={onHelpClick} taskCategories={taskCategories} />
        <TaskSection title=" Today" tasks={tasks.today} list="today" icon={<Icons.CircleCheckSolid />} color="blue" onToggle={id=>toggleTask(id,"today")} onAdd={(t,c,tm)=>addTask(t,"today",c,tm)} onDel={id=>delTask(id,"today")} onEdit={(id,t)=>editTask(id,"today",t)} onCat={(id,c)=>updCat(id,"today",c)} onTime={(id,tm)=>updTime(id,"today",tm)} onMove={(id,to)=>moveTask(id,"today",to)} showTimeToComplete={showTimeToComplete} onReorder={reorderTask} scheduledTaskIds={scheduledTaskIds} onHelpClick={onHelpClick} taskCategories={taskCategories} />
        <TaskSection title=" This Week" tasks={tasks.thisWeek} list="thisWeek" icon={<Icons.CalendarSolid />} color="blue" onToggle={id=>toggleTask(id,"thisWeek")} onAdd={(t,c,tm)=>addTask(t,"thisWeek",c,tm)} onDel={id=>delTask(id,"thisWeek")} onEdit={(id,t)=>editTask(id,"thisWeek",t)} onCat={(id,c)=>updCat(id,"thisWeek",c)} onTime={(id,tm)=>updTime(id,"thisWeek",tm)} onMove={(id,to)=>moveTask(id,"thisWeek",to)} collapsed={true} showTimeToComplete={showTimeToComplete} onReorder={reorderTask} scheduledTaskIds={scheduledTaskIds} onHelpClick={onHelpClick} taskCategories={taskCategories} />
        <TaskSection title=" Later" tasks={tasks.later} list="later" icon={<Icons.StarSolid />} color="warm" onToggle={id=>toggleTask(id,"later")} onAdd={(t,c,tm)=>addTask(t,"later",c,tm)} onDel={id=>delTask(id,"later")} onEdit={(id,t)=>editTask(id,"later",t)} onCat={(id,c)=>updCat(id,"later",c)} onTime={(id,tm)=>updTime(id,"later",tm)} onMove={(id,to)=>moveTask(id,"later",to)} collapsed={true} showTimeToComplete={showTimeToComplete} onReorder={reorderTask} scheduledTaskIds={scheduledTaskIds} onHelpClick={onHelpClick} taskCategories={taskCategories} />
      </div>
    </div>
  );
};

export default OrderView;
