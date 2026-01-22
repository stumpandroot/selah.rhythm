/**
 * SELAH RHYTHM - Mobile Tab Bar Component
 * Bottom navigation with morphing indicator animation
 * Features:
 * - 3 tabs: Order, Focus, Rest
 * - Mode-colored active states
 * - Morphing indicator animation
 * - Scroll-aware hiding/showing
 */

import React, { useRef, useState, useEffect } from 'react';
import Icons from '../shared/Icons';

const MobileTabBar = ({ mode, setMode, collapsed }) => {
  const containerRef = useRef(null);
  const orderRef = useRef(null);
  const focusRef = useRef(null);
  const restRef = useRef(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ width: 0, transform: 'translateX(0)' });

  // Get ref for current mode
  const getButtonRef = (m) => {
    switch(m) {
      case 'order': return orderRef;
      case 'focus': return focusRef;
      case 'rest': return restRef;
      default: return orderRef;
    }
  };

  // Update indicator position
  useEffect(() => {
    const updateIndicator = () => {
      const btn = getButtonRef(mode).current;
      const container = containerRef.current;
      if (!btn || !container) return;

      // offsetLeft is relative to offsetParent (the container)
      const left = btn.offsetLeft;
      const width = btn.offsetWidth;

      setIndicatorStyle({
        width: `${width}px`,
        transform: `translateX(${left}px)`
      });
    };

    // Run immediately
    updateIndicator();

    // Also run after a tick for layout
    requestAnimationFrame(updateIndicator);

    // And after transition completes
    const timer = setTimeout(updateIndicator, 350);

    return () => clearTimeout(timer);
  }, [mode, collapsed]);

  return (
    <nav className="mobile-tab-bar">
      <div
        ref={containerRef}
        className={`mobile-tab-bar-glass${collapsed ? ' collapsed' : ''}`}
      >
        {/* Indicator positioned via offsetLeft */}
        <div
          className={`mobile-tab-indicator ${mode}`}
          style={indicatorStyle}
        />

        <button
          ref={orderRef}
          className={`mobile-tab-btn${mode === 'order' ? ' active order' : ''}`}
          onClick={() => setMode('order')}
        >
          <div className="mobile-tab-icon"><Icons.Calendar /></div>
          <div className="mobile-tab-label">Order</div>
        </button>
        <button
          ref={focusRef}
          className={`mobile-tab-btn${mode === 'focus' ? ' active focus' : ''}`}
          onClick={() => setMode('focus')}
        >
          <div className="mobile-tab-icon"><Icons.Clock /></div>
          <div className="mobile-tab-label">Focus</div>
        </button>
        <button
          ref={restRef}
          className={`mobile-tab-btn${mode === 'rest' ? ' active rest' : ''}`}
          onClick={() => setMode('rest')}
        >
          <div className="mobile-tab-icon"><Icons.Leaf /></div>
          <div className="mobile-tab-label">Rest</div>
        </button>
      </div>
    </nav>
  );
};

export default MobileTabBar;
