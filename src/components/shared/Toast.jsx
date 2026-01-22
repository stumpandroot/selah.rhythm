/**
 * Toast Notification Component
 *
 * Props:
 * @param {boolean} show - Controls toast visibility
 * @param {object} data - Toast content { title: string, msg: string }
 * @param {function} onClose - Callback when toast is dismissed
 *
 * Features:
 * - Auto-dismisses after 6 seconds
 * - Pauses timer on hover
 * - Click anywhere on toast to dismiss
 * - Calculates remaining time when resuming after hover
 */

import { useState, useEffect, useRef } from 'react';
import Icons from './Icons';

const Toast = ({show, data, onClose}) => {
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);
  const remainingRef = useRef(6000); // 6 seconds default
  const startTimeRef = useRef(null);

  useEffect(() => {
    if (!show) {
      remainingRef.current = 6000;
      return;
    }

    const startTimer = () => {
      startTimeRef.current = Date.now();
      timerRef.current = setTimeout(onClose, remainingRef.current);
    };

    if (!isPaused) {
      startTimer();
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [show, isPaused, onClose]);

  const handleMouseEnter = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      const elapsed = Date.now() - startTimeRef.current;
      remainingRef.current = Math.max(remainingRef.current - elapsed, 1000);
    }
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  if(!data) return null;
  return (
    <div
      className={`toast${show?" show":""}`}
      onClick={onClose}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="alert"
      aria-live="polite"
    >
      <Icons.Check />
      <div className="toast-text">
        <div className="toast-title">{data.title}</div>
        <div className="toast-message">{data.msg}</div>
      </div>
      <button className="toast-close" onClick={e => { e.stopPropagation(); onClose(); }} aria-label="Dismiss">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M18 6L6 18M6 6l12 12"/>
        </svg>
      </button>
    </div>
  );
};

export default Toast;
