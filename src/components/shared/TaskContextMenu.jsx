/**
 * Task Context Menu Component
 *
 * Props:
 * @param {object} task - The task object being acted upon
 * @param {object} position - Menu position {x, y} in viewport coordinates
 * @param {function} onClose - Callback when menu closes
 * @param {function} onEdit - Callback to edit task
 * @param {function} onToggle - Callback to toggle task completion
 * @param {function} onMove - Callback to move task (taskId, destination)
 * @param {function} onDelete - Callback to delete task
 * @param {string} currentList - Current list ID (filters move options)
 *
 * Features:
 * - Appears on long-press (mobile) or right-click (desktop)
 * - Automatic viewport positioning to prevent clipping
 * - Two-level navigation: main menu → move submenu
 * - Closes on outside click, scroll, or Escape key
 * - Backdrop overlay for mobile UX
 */

import { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import Icons from './Icons';

const TaskContextMenu = ({ task, position, onClose, onEdit, onToggle, onMove, onDelete, currentList }) => {
  const [showReschedule, setShowReschedule] = useState(false);
  const menuRef = useRef(null);

  // Close on click outside or scroll
  useEffect(() => {
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

export default TaskContextMenu;
