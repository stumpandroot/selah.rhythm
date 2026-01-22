/**
 * Custom Select Dropdown Component
 *
 * Props:
 * @param {string} value - Currently selected value
 * @param {array} options - Array of {value, label} objects
 * @param {function} onChange - Callback when selection changes
 * @param {string} placeholder - Placeholder text when no selection
 * @param {string} className - Additional CSS classes
 *
 * Features:
 * - Portal-based rendering to prevent clipping
 * - Automatic flip detection (opens up/down based on viewport space)
 * - Closes on outside click, scroll, or Escape key
 * - Dynamic positioning and responsive sizing
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom';
import Icons from './Icons';

const CustomSelect = ({ value, options, onChange, placeholder, className }) => {
  const [open, setOpen] = useState(false);
  const [flipUp, setFlipUp] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0, width: 0 });
  const triggerRef = useRef(null);
  const menuRef = useRef(null);

  // Calculate position and flip direction
  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const menuHeight = 220; // approximate max height
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const shouldFlip = spaceBelow < menuHeight && spaceAbove > spaceBelow;

    setFlipUp(shouldFlip);
    setMenuPos({
      top: shouldFlip ? rect.top - 4 : rect.bottom + 4,
      left: rect.left,
      width: Math.max(rect.width, 120)
    });
  }, []);

  useEffect(() => {
    if (!open) return;
    updatePosition();
    const handleClick = (e) => {
      if (triggerRef.current?.contains(e.target)) return;
      if (menuRef.current?.contains(e.target)) return;
      setOpen(false);
    };
    const handleKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    const handleScroll = () => updatePosition();
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', updatePosition);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [open, updatePosition]);

  const selected = options.find(o => o.value === value);

  const menu = open ? ReactDOM.createPortal(
    <div
      ref={menuRef}
      className={`custom-select-menu show${flipUp ? ' flip-up' : ''}`}
      style={{
        position: 'fixed',
        top: flipUp ? 'auto' : menuPos.top,
        bottom: flipUp ? (window.innerHeight - menuPos.top) : 'auto',
        left: menuPos.left,
        minWidth: menuPos.width,
        zIndex: 9999
      }}
    >
      {options.map(option => (
        <div
          key={option.value}
          className={`custom-select-option${value === option.value ? ' selected' : ''}`}
          onClick={() => { onChange(option.value); setOpen(false); }}
        >
          {option.label}
        </div>
      ))}
    </div>,
    document.body
  ) : null;

  return (
    <div className={`custom-select ${className || ''}`}>
      <button
        ref={triggerRef}
        className={`custom-select-trigger${open ? ' open' : ''}`}
        onClick={() => setOpen(!open)}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="custom-select-value">{selected?.label || placeholder || 'Select...'}</span>
        <Icons.ChevronDown />
      </button>
      {menu}
    </div>
  );
};

export default CustomSelect;
