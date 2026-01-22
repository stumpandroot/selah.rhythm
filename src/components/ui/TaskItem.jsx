/**
 * TaskItem Component
 * Individual task with checkbox, category dot, time estimate, and drag handle
 *
 * Props:
 * - task: Task object {id, text, done, cat, time, completedAt, totalFocusMinutes}
 * - onToggle: (taskId) => void - Mark task complete/incomplete
 * - onDel: (taskId) => void - Delete task
 * - onEdit: (taskId, newText) => void - Update task text
 * - onCat: (taskId, categoryId) => void - Update task category
 * - onTime: (taskId, timeString) => void - Update time estimate
 * - onMove: (taskId, targetList) => void - Move task to different list
 * - list: string - Current list name (primary, today, thisWeek, later)
 * - showDone: boolean - Whether showing completed tasks view
 * - isActiveFocus: boolean - Whether this task is currently in focus
 * - showTimeToComplete: boolean - Whether to show accumulated focus time
 * - onDragStart: (task, list) => void - Callback when drag starts
 * - onDragEnd: () => void - Callback when drag ends
 * - hasScheduledBlock: boolean - Whether task has scheduled time block
 * - taskCategories: Array - Custom categories array (optional)
 */

import React, { useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import Icons from '../shared/Icons';
import { fmtDate } from '../../utils/helpers';

// Default categories
const DEFAULT_CATS = [
  {id: "none", n: "None", color: "#8A8078"},
  {id: "admin", n: "Admin", color: "#C4704B"},
  {id: "meetings", n: "Meetings", color: "#7A9A7E"},
  {id: "personal", n: "Personal", color: "#C9A227"},
  {id: "creative", n: "Creative Work", color: "#6B4A6B"},
  {id: "communication", n: "Communication", color: "#D4846A"},
  {id: "research", n: "Research", color: "#8FAD93"}
];

const LISTS = ["primary","today","thisWeek","later"];

// Category Portal Menu - Positioned near trigger element
const CategoryPortalMenu = ({ isOpen, onClose, triggerRef, categories, selectedId, onSelect }) => {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [flipUp, setFlipUp] = useState(false);
  const menuRef = useRef(null);

  // Calculate position
  React.useEffect(() => {
    if (!isOpen || !triggerRef?.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const menuHeight = 200;
    const spaceBelow = window.innerHeight - rect.bottom;
    const shouldFlip = spaceBelow < menuHeight && rect.top > spaceBelow;

    setFlipUp(shouldFlip);
    setPosition({
      top: shouldFlip ? rect.top - 4 : rect.bottom + 4,
      left: rect.left,
      width: Math.max(rect.width, 130)
    });
  }, [isOpen, triggerRef]);

  // Close handlers
  React.useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target) &&
          triggerRef?.current && !triggerRef.current.contains(e.target)) {
        onClose();
      }
    };
    const handleEscape = (e) => { if (e.key === 'Escape') onClose(); };
    const handleScroll = () => onClose();

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    window.addEventListener('scroll', handleScroll, true);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [isOpen, onClose, triggerRef]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div
      ref={menuRef}
      className={`category-portal-menu show${flipUp ? ' flip-up' : ''}`}
      style={{
        top: flipUp ? 'auto' : position.top,
        bottom: flipUp ? (window.innerHeight - position.top) : 'auto',
        left: position.left,
        minWidth: position.width
      }}
    >
      {categories.map(cat => (
        <div
          key={cat.id}
          className={`category-portal-item${selectedId === cat.id ? ' selected' : ''}`}
          onClick={(e) => { e.stopPropagation(); onSelect(cat.id); onClose(); }}
        >
          <span className={`cat-dot cat-${cat.id}`} style={{background: cat.color || '#6b7280'}} />
          {cat.n}
        </div>
      ))}
    </div>,
    document.body
  );
};

// Swipeable wrapper for touch gestures
const SwipeableWrapper = ({ children, onSwipeRight, onSwipeLeft, rightLabel = "✓ Done", leftLabel = "Later →", rightColor = "var(--rest)", leftColor = "var(--accent)", disabled = false }) => {
  const [offsetX, setOffsetX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const isHorizontalSwipe = useRef(null);

  const THRESHOLD = 80;
  const MAX_SWIPE = 120;

  // Only enable on touch devices
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  if (!isTouchDevice || disabled) {
    return <>{children}</>;
  }

  const handleTouchStart = (e) => {
    // Don't start swipe if it's on an interactive element
    if (e.target.closest('button, input, select, textarea, a, [role="button"]')) {
      return;
    }

    startX.current = e.touches[0].clientX;
    startY.current = e.touches[0].clientY;
    isHorizontalSwipe.current = null;
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;

    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const diffX = currentX - startX.current;
    const diffY = currentY - startY.current;

    // Determine swipe direction on first significant movement
    if (isHorizontalSwipe.current === null && (Math.abs(diffX) > 10 || Math.abs(diffY) > 10)) {
      isHorizontalSwipe.current = Math.abs(diffX) > Math.abs(diffY);
    }

    // Only handle horizontal swipes
    if (!isHorizontalSwipe.current) {
      setOffsetX(0);
      return;
    }

    // Prevent vertical scroll during horizontal swipe
    e.preventDefault();

    // Clamp and apply rubber-band effect
    const clampedDiff = Math.max(-MAX_SWIPE, Math.min(MAX_SWIPE, diffX));
    setOffsetX(clampedDiff);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);

    if (offsetX > THRESHOLD && onSwipeRight) {
      // Animate out then trigger action
      setOffsetX(200);
      setTimeout(() => {
        onSwipeRight();
        setOffsetX(0);
      }, 200);
    } else if (offsetX < -THRESHOLD && onSwipeLeft) {
      setOffsetX(-200);
      setTimeout(() => {
        onSwipeLeft();
        setOffsetX(0);
      }, 200);
    } else {
      setOffsetX(0);
    }

    isHorizontalSwipe.current = null;
  };

  const rightOpacity = Math.min(1, Math.max(0, offsetX / THRESHOLD));
  const leftOpacity = Math.min(1, Math.max(0, -offsetX / THRESHOLD));

  return (
    <div className="swipeable-container">
      {/* Right swipe action (complete) */}
      <div
        className="swipe-action swipe-action-right"
        style={{
          opacity: rightOpacity,
          background: rightColor
        }}
      >
        <span className="swipe-action-icon"><Icons.Check /></span>
        <span className="swipe-action-label">{rightLabel}</span>
      </div>

      {/* Left swipe action (move to later) */}
      <div
        className="swipe-action swipe-action-left"
        style={{
          opacity: leftOpacity,
          background: leftColor
        }}
      >
        <span className="swipe-action-label">{leftLabel}</span>
        <span className="swipe-action-icon"><Icons.ArrowRight /></span>
      </div>

      {/* Swipeable content */}
      <div
        className={`swipeable-content${isDragging ? ' dragging' : ''}`}
        style={{
          transform: `translateX(${offsetX}px)`,
          transition: isDragging ? 'none' : 'transform 0.3s var(--spring-bounce)'
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {children}
      </div>
    </div>
  );
};

// Task Context Menu - appears on long-press (mobile) or right-click (desktop)
const TaskContextMenu = ({ task, position, onClose, onEdit, onToggle, onMove, onDelete, currentList }) => {
  const [showReschedule, setShowReschedule] = useState(false);
  const menuRef = useRef(null);

  // Close on click outside or scroll
  React.useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };

    const handleScroll = () => {
      onClose();
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    window.addEventListener('scroll', handleScroll, true); // Use capture to catch all scroll events

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [onClose]);

  // Position menu within viewport
  const menuStyle = {
    position: 'fixed',
    top: Math.min(position.y, window.innerHeight - 280),
    left: Math.min(Math.max(position.x - 100, 10), window.innerWidth - 210),
    zIndex: 10000
  };

  const rescheduleOptions = [
    { label: 'Primary', value: 'primary' },
    { label: 'Today', value: 'today' },
    { label: 'This Week', value: 'thisWeek' },
    { label: 'Later', value: 'later' }
  ].filter(opt => opt.value !== currentList);

  return ReactDOM.createPortal(
    <>
      <div className="context-menu-backdrop" onClick={onClose} />
      <div ref={menuRef} className="context-menu" style={menuStyle}>
        {!showReschedule ? (
          <>
            <div className="context-menu-header">
              <span className="context-menu-title">{task.text.slice(0, 30)}{task.text.length > 30 ? '...' : ''}</span>
            </div>
            <div className="context-menu-items">
              <button className="context-menu-item" onClick={onToggle}>
                <Icons.Check />
                <span>{task.done ? 'Mark Incomplete' : 'Mark Complete'}</span>
              </button>
              <button className="context-menu-item" onClick={onEdit}>
                <Icons.Edit />
                <span>Edit</span>
              </button>
              <button className="context-menu-item" onClick={() => setShowReschedule(true)}>
                <Icons.Calendar />
                <span>Move to...</span>
                <Icons.ChevronRight className="context-menu-arrow" />
              </button>
              <div className="context-menu-divider" />
              <button className="context-menu-item danger" onClick={onDelete}>
                <Icons.Trash />
                <span>Delete</span>
              </button>
            </div>
          </>
        ) : (
          <>
            <button className="context-menu-back" onClick={() => setShowReschedule(false)}>
              <Icons.ChevronLeft />
              <span>Back</span>
            </button>
            <div className="context-menu-header">
              <span className="context-menu-title">Move to...</span>
            </div>
            <div className="context-menu-items">
              {rescheduleOptions.map(opt => (
                <button
                  key={opt.value}
                  className="context-menu-item"
                  onClick={() => {
                    onMove(task.id, opt.value);
                    onClose();
                  }}
                >
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </>,
    document.body
  );
};

// Task Item with active focus indicator and drag support
const TaskItem = ({task, onToggle, onDel, onEdit, onCat, onTime, onMove, list, showDone, isActiveFocus, showTimeToComplete, onDragStart, onDragEnd, hasScheduledBlock, taskCategories}) => {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(task.text);
  const [showMoveMenu, setShowMoveMenu] = useState(false);
  const [showCatMenu, setShowCatMenu] = useState(false);
  const [editingTime, setEditingTime] = useState(false);
  const [timeInput, setTimeInput] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPos, setContextMenuPos] = useState({ x: 0, y: 0 });
  const longPressTimer = useRef(null);
  const taskRef = useRef(null);
  const catTriggerRef = useRef(null);
  const dragHandleRef = useRef(null);
  const cats = taskCategories || DEFAULT_CATS;
  const cat = cats.find(c=>c.id===task.cat)||cats[0];

  // Long-press handler for mobile context menu
  const handleTouchStart = (e) => {
    // Don't trigger on interactive elements
    if (e.target.closest('button, input, select, textarea, a')) return;

    const touch = e.touches[0];
    longPressTimer.current = setTimeout(() => {
      setContextMenuPos({ x: touch.clientX, y: touch.clientY });
      setShowContextMenu(true);
      // Haptic feedback visual cue
      if (taskRef.current) {
        taskRef.current.style.transform = 'scale(0.98)';
        setTimeout(() => {
          if (taskRef.current) taskRef.current.style.transform = '';
        }, 150);
      }
    }, 500);
  };

  const handleTouchEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const handleTouchMove = () => {
    // Cancel long-press if user moves finger
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  // Right-click handler for desktop context menu
  const handleContextMenu = (e) => {
    e.preventDefault();
    setContextMenuPos({ x: e.clientX, y: e.clientY });
    setShowContextMenu(true);
  };

  // Handle move to later (from swipe)
  const handleMoveToLater = () => {
    if (onMove) {
      // Move to "later" list, or "thisWeek" if already in today
      const targetList = list === 'today' ? 'thisWeek' : 'later';
      onMove(task.id, targetList);
    }
  };

  const handleTimeClick = () => {
    setTimeInput(task.time ? task.time.replace(/\D/g, '') : '');
    setEditingTime(true);
  };

  const saveTime = () => {
    const minutes = parseInt(timeInput, 10);
    if (isNaN(minutes) || minutes < 1) {
      onTime(task.id, '');
    } else if (minutes > 600) {
      onTime(task.id, '600m');
    } else {
      onTime(task.id, `${minutes}m`);
    }
    setEditingTime(false);
  };

  const saveEdit = () => {if(text.trim()&&text!==task.text)onEdit(task.id,text.trim());setEditing(false);};

  // Drag handlers - allow whole row except interactive controls
  const handleDragStart = (e) => {
    // Check if drag started on an interactive element - if so, don't drag
    const interactiveSelector = 'button, input, select, textarea, a, [role="button"]';
    if (e.target.closest(interactiveSelector)) {
      e.preventDefault();
      return;
    }
    setIsDragging(true);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('application/json', JSON.stringify({
      type: 'task',
      taskId: task.id,
      title: task.text,
      sourceList: list,
      duration: parseInt(task.time) || 30
    }));
    // Custom drag image
    const ghost = document.createElement('div');
    ghost.className = 'drag-ghost';
    ghost.textContent = task.text.slice(0,30) + (task.text.length > 30 ? '...' : '');
    document.body.appendChild(ghost);
    e.dataTransfer.setDragImage(ghost, ghost.offsetWidth / 2, ghost.offsetHeight / 2);
    setTimeout(() => ghost.remove(), 0);
    if (onDragStart) onDragStart(task, list);
  };

  const handleDragEnd = (e) => {
    setIsDragging(false);
    if (onDragEnd) onDragEnd();
  };

  if(editing) return <div className="task-item"><input className="task-edit-input" value={text} onChange={e=>setText(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")saveEdit();if(e.key==="Escape")setEditing(false);}} autoFocus onBlur={saveEdit} /></div>;

  // Determine if swipe should be disabled
  const swipeDisabled = showDone || isDragging;

  return (
    <>
      <SwipeableWrapper
        onSwipeRight={() => onToggle(task.id)}
        onSwipeLeft={handleMoveToLater}
        rightLabel="Done"
        leftLabel={list === 'today' ? 'This Week' : 'Later'}
        disabled={swipeDisabled}
      >
        <div
          ref={taskRef}
          className={`task-item${isActiveFocus?" active-focus":""}${isDragging?" dragging":""}`}
          draggable={!showDone}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onTouchMove={handleTouchMove}
          onContextMenu={handleContextMenu}
        >
      {!showDone && (
        <div ref={dragHandleRef} className="drag-handle" title="Drag to reorder or schedule">
          <Icons.GripVertical />
        </div>
      )}
      {!showDone && <button className={`task-check${task.done?" done":""}`} onClick={()=>onToggle(task.id)}>{task.done&&<Icons.Check />}</button>}
      {showDone && <div style={{width:"18px",height:"18px",borderRadius:"50%",background:"var(--sage)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,color:"#fff"}}><Icons.Check /></div>}
      <div className="task-content">
        <span className={`task-text${task.done?" done":""}`}>{task.text}</span>
        <div className="task-meta">
          {!showDone && (
            <span
              ref={catTriggerRef}
              className="task-category"
              onClick={(e)=>{e.stopPropagation();setShowCatMenu(!showCatMenu);}}
            >
              <span
                className="task-category-dot"
                style={{background: cat.color || 'var(--text-muted)', opacity: task.cat === 'none' || !task.cat ? 0.3 : 1}}
              />{cat.n}
            </span>
          )}
          {/* Portal-based category menu */}
          <CategoryPortalMenu
            isOpen={showCatMenu}
            onClose={() => setShowCatMenu(false)}
            triggerRef={catTriggerRef}
            categories={cats}
            selectedId={task.cat}
            onSelect={(catId) => onCat(task.id, catId)}
          />
          {!showDone && (
            editingTime ? (
              <input
                className="task-time-input"
                type="text"
                inputMode="numeric"
                value={timeInput}
                onChange={e => setTimeInput(e.target.value.replace(/\D/g, ''))}
                onKeyDown={e => {
                  if (e.key === 'Enter') saveTime();
                  if (e.key === 'Escape') { setEditingTime(false); setTimeInput(''); }
                }}
                onBlur={saveTime}
                autoFocus
                placeholder="min"
              />
            ) : (
              <span className="task-time" onClick={handleTimeClick}>{task.time||"—"}</span>
            )
          )}
          {!showDone && task.totalFocusMinutes > 0 && showTimeToComplete && <span className="task-focus-time">{task.totalFocusMinutes}m</span>}
          {!showDone && hasScheduledBlock && <span className="task-scheduled-indicator" title="Scheduled"><Icons.Clock /></span>}
          {showDone && task.completedAt && <span style={{fontSize:"10px",color:"var(--text-muted)"}}>{fmtDate(task.completedAt)}</span>}
        </div>
      </div>
      {!showDone && (
        <div className="task-actions">
          <button className="task-action-btn" onClick={()=>setEditing(true)} title="Edit"><Icons.Edit /></button>
          {onMove && <button className="task-action-btn" onClick={()=>setShowMoveMenu(!showMoveMenu)} title="Move"><Icons.Move /></button>}
          <button className="task-action-btn delete" onClick={()=>onDel(task.id)} title="Delete"><Icons.Trash /></button>
        </div>
      )}
      {showMoveMenu && (
        <div className="dropdown-menu">
          {LISTS.filter(l=>l!==list).map(l=>{
            const labels={primary:"Primary",today:"Today",thisWeek:"This Week",later:"Later"};
            return <div key={l} className="dropdown-item" onClick={()=>{onMove(task.id,l);setShowMoveMenu(false);}}>{labels[l]}</div>;
          })}
        </div>
      )}
        </div>
      </SwipeableWrapper>

      {/* Context Menu Portal */}
      {showContextMenu && (
        <TaskContextMenu
          task={task}
          position={contextMenuPos}
          onClose={() => setShowContextMenu(false)}
          onEdit={() => { setEditing(true); setShowContextMenu(false); }}
          onToggle={() => { onToggle(task.id); setShowContextMenu(false); }}
          onMove={onMove}
          onDelete={() => { onDel(task.id); setShowContextMenu(false); }}
          currentList={list}
        />
      )}
    </>
  );
};

export default TaskItem;
