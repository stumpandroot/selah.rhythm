/**
 * ScriptureSection Component
 *
 * Daily scripture with rotating verses and category selector.
 * Always visible - no toggle/header.
 *
 * Features:
 * - Category pills for faithfulness, rest, stewardship, discipline, patience, wisdom, courage
 * - Verse rotation with Previous/Next navigation
 * - Bible.com reference links
 * - Contextual Selah prompts for reflection
 *
 * Props:
 * @param {boolean} animationsOn - Enable/disable animations
 * @param {function} onHelpClick - Help icon click handler
 *
 * State:
 * - cat: Current scripture category (default: "faithfulness")
 * - idx: Current verse index within category
 *
 * Data Dependencies:
 * - SCRIPTURE: Object mapping categories to verse arrays [{t, r}]
 * - SELAH_PROMPTS: Object mapping categories to reflection prompts
 */

import React, { useState } from 'react';
import { SCRIPTURE, SELAH_PROMPTS } from '../../data/constants';

const ScriptureSection = ({ animationsOn, onHelpClick }) => {
  const [cat, setCat] = useState("faithfulness");
  const [idx, setIdx] = useState(0);

  const verses = SCRIPTURE[cat];
  const verse = verses[idx % verses.length];
  const prompt = SELAH_PROMPTS[cat];

  return (
    <div className="card scripture-card">
      <div className="scripture-body">
        <div className="scripture-categories">
          {Object.keys(SCRIPTURE).map(c => (
            <button
              key={c}
              className={`category-pill scripture-category${cat === c ? " active" : ""}`}
              onClick={() => {
                setCat(c);
                setIdx(0);
              }}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="scripture-verse-section">
          <div className="scripture-verse">"{verse.t}"</div>
          <a
            className="scripture-reference scripture-ref-link"
            href={`https://www.bible.com/search/bible?q=${encodeURIComponent(verse.r)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {verse.r}
          </a>
        </div>

        <div className="scripture-prompt-area">
          <div className="scripture-prompt">{prompt}</div>
          <div className="scripture-nav">
            <button
              className="scripture-nav-btn"
              onClick={() => setIdx(i => (i - 1 + verses.length) % verses.length)}
            >
              ← Previous
            </button>
            <button
              className="scripture-nav-btn"
              onClick={() => setIdx(i => i + 1)}
            >
              Next Verse →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScriptureSection;
