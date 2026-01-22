/**
 * SELAH RHYTHM - Mobile Accordion Section Component
 * Accordion for Anchors/Habits/Wisdom on mobile Order view
 * Features:
 * - Three panels: Anchors, Habits, Daily Wisdom
 * - Single expandable panel at a time
 * - Smooth expand/collapse animations
 * - Integrated scripture reading
 */

import React, { useState } from 'react';
import Icons from '../shared/Icons';
import { PROVERBS_LIBRARY, PSALMS_LIBRARY } from '../../data/scripture';

// HelpIcon component - accepts onHelpClick handler
const HelpIcon = ({ id, onHelpClick }) => (
  <button
    type="button"
    className="help-icon-btn"
    aria-label="What is this?"
    onClick={(e) => {
      e.preventDefault();
      if (onHelpClick) onHelpClick(id);
    }}
  >
    <Icons.HelpCircle />
  </button>
);

// DailyWisdomContent for accordion - matches desktop features
const DailyWisdomContent = () => {
  const [mode, setMode] = useState('proverbs');
  const [verseIndex, setVerseIndex] = useState(0);
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);

  const PROVERBS_REFERENCES = Object.keys(PROVERBS_LIBRARY);
  const PSALMS_REFERENCES = Object.keys(PSALMS_LIBRARY);

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

const MobileAccordionSection = ({
  activePanel,
  onToggle,
  anchors,
  habits,
  onHelpClick,
  // Pass through content props
  addAnchor, editAnchor, delAnchor,
  togHabit, addHabit, delHabit, resetHabits
}) => {
  const habitsComplete = habits.filter(h => h.done).length;
  const habitsBadge = `${habitsComplete}/${habits.length}`;

  return (
    <div className="mobile-accordion-container">
      {/* Button Row */}
      <div className="mobile-accordion-buttons">
        <button
          className={`mobile-accordion-btn anchors ${activePanel === 'anchors' ? 'active' : ''}`}
          onClick={() => onToggle(activePanel === 'anchors' ? null : 'anchors')}
        >
          <div className="mobile-accordion-btn-icon"><Icons.AnchorSolid /></div>
          <span className="mobile-accordion-btn-label">Anchors</span>
          <div className="mobile-accordion-btn-chevron"><Icons.ChevronDown /></div>
        </button>

        <button
          className={`mobile-accordion-btn habits ${activePanel === 'habits' ? 'active' : ''}`}
          onClick={() => onToggle(activePanel === 'habits' ? null : 'habits')}
        >
          <div className="mobile-accordion-btn-icon"><Icons.HeartSolid /></div>
          <span className="mobile-accordion-btn-label">Habits</span>
          <span className="mobile-accordion-btn-badge">{habitsBadge}</span>
          <div className="mobile-accordion-btn-chevron"><Icons.ChevronDown /></div>
        </button>

        <button
          className={`mobile-accordion-btn wisdom ${activePanel === 'wisdom' ? 'active' : ''}`}
          onClick={() => onToggle(activePanel === 'wisdom' ? null : 'wisdom')}
        >
          <div className="mobile-accordion-btn-icon"><Icons.BookSolid /></div>
          <span className="mobile-accordion-btn-label">Wisdom</span>
          <div className="mobile-accordion-btn-chevron"><Icons.ChevronDown /></div>
        </button>
      </div>

      {/* Shared Expandable Panel */}
      <div className={`mobile-accordion-panel ${activePanel ? 'open' : ''}`}>
        {activePanel === 'anchors' && (
          <>
            <div className="mobile-accordion-panel-header anchors">
              <div className="mobile-accordion-panel-title">
                <Icons.AnchorSolid /> Anchors
              </div>
              <HelpIcon id="anchors" onHelpClick={onHelpClick} />
            </div>
            <div className="mobile-accordion-panel-content">
              {anchors.length === 0 ? (
                <div className="empty-state">No anchors yet. Add your first anchor point.</div>
              ) : (
                anchors.map((a, i) => (
                  <div key={a.id || i} className="anchor-item">
                    <span className="anchor-bullet"><Icons.AnchorSolid /></span>
                    <span className="anchor-text">{a.text}</span>
                    <button className="anchor-edit" onClick={() => editAnchor(a.id || i)}><Icons.Edit /></button>
                    <button className="anchor-delete" onClick={() => delAnchor(a.id || i)}><Icons.X /></button>
                  </div>
                ))
              )}
              <button className="add-anchor-btn" onClick={addAnchor} style={{marginTop: 'var(--space-3)'}}>
                <Icons.Plus /> Add Anchor
              </button>
            </div>
          </>
        )}

        {activePanel === 'habits' && (
          <>
            <div className="mobile-accordion-panel-header habits">
              <div className="mobile-accordion-panel-title">
                <Icons.HeartSolid /> Daily Habits
              </div>
              <div style={{display: 'flex', gap: '8px', alignItems: 'center'}}>
                <HelpIcon id="habits" onHelpClick={onHelpClick} />
                <button className="icon-btn" onClick={addHabit}><Icons.Plus /></button>
              </div>
            </div>
            <div className="mobile-accordion-panel-content">
              {habits.map(h => (
                <div key={h.id} className="habit-item">
                  <button className={`habit-check${h.done?" done":""}`} onClick={()=>togHabit(h.id)}>{h.done&&<Icons.Check />}</button>
                  <div className="habit-info">
                    <span className={`habit-name${h.done?" done":""}`}>{h.name}</span>
                    {h.desc && <span className="habit-desc">{h.desc}</span>}
                  </div>
                </div>
              ))}
              <button className="add-habit-btn" onClick={addHabit} style={{marginTop: 'var(--space-3)'}}>
                <Icons.Plus /> Add Habit
              </button>
            </div>
          </>
        )}

        {activePanel === 'wisdom' && (
          <>
            <div className="mobile-accordion-panel-header wisdom">
              <div className="mobile-accordion-panel-title">
                <Icons.BookSolid /> Daily Wisdom
              </div>
              <HelpIcon id="wisdom" onHelpClick={onHelpClick} />
            </div>
            <div className="mobile-accordion-panel-content">
              <DailyWisdomContent />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MobileAccordionSection;
