/**
 * Category Portal Menu Component
 *
 * Props:
 * @param {boolean} isOpen - Controls menu visibility
 * @param {function} onClose - Callback when menu closes
 * @param {object} triggerRef - Ref to the trigger element for positioning
 * @param {array} categories - Array of category objects {id, n, color}
 * @param {string} selectedId - Currently selected category ID
 * @param {function} onSelect - Callback when category is selected
 *
 * Features:
 * - Portal-based rendering to prevent card clipping
 * - Automatic flip detection (opens up/down based on space)
 * - Color dot indicators for each category
 * - Closes on outside click, scroll, or Escape key
 */

import { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

const CategoryPortalMenu = ({ isOpen, onClose, triggerRef, categories, selectedId, onSelect }) => {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [flipUp, setFlipUp] = useState(false);
  const menuRef = useRef(null);

  // Calculate position
  useEffect(() => {
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
  useEffect(() => {
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

export default CategoryPortalMenu;
