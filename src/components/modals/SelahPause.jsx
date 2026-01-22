/**
 * SelahPause Component
 *
 * Full-screen pause overlay displaying a random Bible verse.
 * Provides a moment of rest and reflection during the day.
 *
 * Features:
 * - Full-screen overlay with dot pattern background
 * - Displays random verse from SELAH_VERSES
 * - Blocks body scroll when active
 * - Click anywhere to dismiss
 *
 * Props:
 * @param {boolean} show - Whether the pause overlay is visible
 * @param {Function} onClose - Callback to close the overlay
 * @param {boolean} animationsOn - Whether animations are enabled
 */

import React, { useState, useEffect } from 'react';
import DotPattern from '../shared/DotPattern';
import { SELAH_VERSES } from '../../data/constants';

const SelahPause = ({ show, onClose, animationsOn }) => {
  const [verse] = useState(() => SELAH_VERSES[Math.floor(Math.random() * SELAH_VERSES.length)]);

  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [show]);

  return (
    <div className={`selah-overlay${show ? " show" : ""}`} onClick={onClose}>
      <DotPattern visible={show} animated={animationsOn} />
      <div className="selah-content" onClick={e => e.stopPropagation()}>
        <div className="selah-verse">"{verse.t}"</div>
        <div className="selah-ref">— {verse.r}</div>
        <button className="selah-close" onClick={onClose}>Return</button>
      </div>
    </div>
  );
};

export default SelahPause;
