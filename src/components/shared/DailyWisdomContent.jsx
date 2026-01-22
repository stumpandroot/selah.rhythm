/**
 * SELAH RHYTHM - Daily Wisdom Content
 * v0.9.45
 *
 * Mobile-friendly wisdom verse display with segmented control
 * Rotates through Proverbs or Psalms based on day of year
 */

import React, { useState } from 'react';
import Icons from './Icons';
import { PROVERBS_LIBRARY, PSALMS_LIBRARY, PROVERBS_REFERENCES, PSALMS_REFERENCES } from '../../data/constants';

/**
 * DailyWisdomContent - Mobile wisdom verse display for accordion
 *
 * Features:
 * - Segmented control to switch between Proverbs and Psalms
 * - Daily rotation based on day of year
 * - "Next Verse" button to browse forward through library
 * - Matches desktop DailyWisdomCard functionality
 *
 * @example
 * <DailyWisdomContent />
 *
 * Used within mobile accordion views to provide daily scripture wisdom
 */
const DailyWisdomContent = () => {
  const [mode, setMode] = useState('proverbs');
  const [verseIndex, setVerseIndex] = useState(0);
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);

  const references = mode === 'proverbs' ? PROVERBS_REFERENCES : PSALMS_REFERENCES;
  const library = mode === 'proverbs' ? PROVERBS_LIBRARY : PSALMS_LIBRARY;

  const currentIndex = (dayOfYear + verseIndex) % references.length;
  const selectedRef = references[currentIndex];
  const verseText = library[selectedRef] || "";

  const handleNextVerse = () => {
    setVerseIndex(i => i + 1);
  };

  return (
    <div className="wisdom-mobile-content">
      {/* Segmented control - matches desktop */}
      <div className="wisdom-segmented-control">
        <button
          className={`wisdom-segmented-btn${mode === 'proverbs' ? ' active' : ''}`}
          onClick={() => { setMode('proverbs'); setVerseIndex(0); }}
        >
          Proverbs
        </button>
        <button
          className={`wisdom-segmented-btn${mode === 'psalms' ? ' active' : ''}`}
          onClick={() => { setMode('psalms'); setVerseIndex(0); }}
        >
          Psalms
        </button>
      </div>

      {/* Verse block */}
      <div className="wisdom-verse-block">
        <div className="wisdom-reference">{selectedRef} (NLT)</div>
        <div className="wisdom-text">{verseText}</div>
      </div>

      {/* Next Verse button - matches desktop */}
      <button className="wisdom-next-btn" onClick={handleNextVerse}>
        <Icons.Sparkles /> Next Verse
      </button>
    </div>
  );
};

export default DailyWisdomContent;
