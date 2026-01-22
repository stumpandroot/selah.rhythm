/**
 * Swipeable Wrapper Component
 *
 * Props:
 * @param {ReactNode} children - Content to make swipeable
 * @param {function} onSwipeRight - Callback for right swipe (complete action)
 * @param {function} onSwipeLeft - Callback for left swipe (move action)
 * @param {string} rightLabel - Label for right swipe action (default: "✓ Done")
 * @param {string} leftLabel - Label for left swipe action (default: "Later →")
 * @param {string} rightColor - Background color for right action (default: "var(--rest)")
 * @param {string} leftColor - Background color for left action (default: "var(--accent)")
 * @param {boolean} disabled - Disable swipe gestures
 *
 * Features:
 * - Touch-only gesture handler (automatically disabled on desktop)
 * - Right swipe: complete task
 * - Left swipe: move task to later
 * - Visual feedback with colored backgrounds
 * - Rubber-band effect with max swipe distance
 * - Prevents accidental swipes on interactive elements
 * - Distinguishes horizontal vs vertical swipes
 */

import { useState, useRef } from 'react';
import Icons from './Icons';

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

export default SwipeableWrapper;
