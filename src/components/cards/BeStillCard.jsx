/**
 * BeStillCard Component
 *
 * Breathing exercise with animated SVG ring, 6-6-6 timing (inhale-hold-exhale).
 * Progressive flow: collapsed → breathing → encouragement → prayer
 *
 * Props:
 * @param {boolean} animationsOn - Enable animations
 * @param {object} profile - User profile with firstName
 * @param {function} onHelpClick - Help icon handler
 *
 * Features:
 * - 6-6-6 breathing cycle (inhale, hold, exhale)
 * - Animated SVG progress ring
 * - Random scripture encouragements
 * - Prayer prompts
 * - Personalized with first name
 * - Reduced motion fallback
 * - Dot pattern background
 */

import React, { useState, useEffect } from 'react';
import Icons from '../shared/Icons';
import DotPattern from '../shared/DotPattern';

const BE_STILL_ENCOURAGEMENTS = [
  { message: "Be still, and know that I am God.", ref: "Psalm 46:10" },
  { message: "The Lord is my shepherd; I shall not want.", ref: "Psalm 23:1" },
  { message: "Cast all your anxiety on him because he cares for you.", ref: "1 Peter 5:7" },
  { message: "Come to me, all you who are weary and burdened, and I will give you rest.", ref: "Matthew 11:28" },
  { message: "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.", ref: "Philippians 4:6" },
  { message: "Peace I leave with you; my peace I give you.", ref: "John 14:27" },
  { message: "The Lord will fight for you; you need only to be still.", ref: "Exodus 14:14" },
  { message: "Trust in the Lord with all your heart and lean not on your own understanding.", ref: "Proverbs 3:5" },
  { message: "He gives strength to the weary and increases the power of the weak.", ref: "Isaiah 40:29" },
  { message: "I can do all this through him who gives me strength.", ref: "Philippians 4:13" }
];

const BE_STILL_PRAYERS = [
  "Lord, I release my anxieties to You. Help me trust that You are in control, even when I can't see the path ahead. Give me Your peace.",
  "Father, quiet my racing thoughts. Remind me that You are God and I am not. Help me rest in Your sovereignty today.",
  "Jesus, thank You for interceding for me right now. I don't have to carry this alone. Help me lean into Your grace.",
  "Holy Spirit, fill me with power, love, and a sound mind. Replace my fear with faith. I trust You.",
  "Lord, You are my shepherd. I choose to believe I have everything I need. Help my unbelief.",
];

const BeStillCard = ({ animationsOn, profile, onHelpClick }) => {
  const [phase, setPhase] = useState('collapsed'); // collapsed, breathing, encouragement, prayer
  const [breathStep, setBreathStep] = useState(0); // 0=inhale, 1=hold, 2=exhale
  const [breathCount, setBreathCount] = useState(1);
  const [encouragementIndex, setEncouragementIndex] = useState(0);
  const [prayerIndex, setPrayerIndex] = useState(0);

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || !animationsOn;

  // Breathing cycle durations
  const BREATH_DURATIONS = [6, 6, 6]; // inhale, hold, exhale - all 6 seconds
  const BREATH_LABELS = ['Inhale', 'Hold', 'Exhale'];

  // Auto-advance breathing
  useEffect(() => {
    if (phase !== 'breathing' || prefersReducedMotion) return;

    const duration = BREATH_DURATIONS[breathStep];
    if (breathCount < duration) {
      const timer = setTimeout(() => setBreathCount(c => c + 1), 1000);
      return () => clearTimeout(timer);
    } else {
      // Move to next step or phase
      if (breathStep < 2) {
        setBreathStep(s => s + 1);
        setBreathCount(1);
      } else {
        // Completed one full cycle, move to encouragement
        setPhase('encouragement');
        setEncouragementIndex(Math.floor(Math.random() * BE_STILL_ENCOURAGEMENTS.length));
      }
    }
  }, [phase, breathStep, breathCount, prefersReducedMotion]);

  const startFlow = () => {
    if (prefersReducedMotion) {
      setPhase('breathing-reduced');
    } else {
      setPhase('breathing');
      setBreathStep(0);
      setBreathCount(1);
    }
  };

  const skipToEncouragement = () => {
    setPhase('encouragement');
    setEncouragementIndex(Math.floor(Math.random() * BE_STILL_ENCOURAGEMENTS.length));
  };

  const nextEncouragement = () => {
    setEncouragementIndex((i) => (i + 1) % BE_STILL_ENCOURAGEMENTS.length);
  };

  const openPrayer = () => {
    setPrayerIndex(Math.floor(Math.random() * BE_STILL_PRAYERS.length));
    setPhase('prayer');
  };

  const reset = () => {
    setPhase('collapsed');
    setBreathStep(0);
    setBreathCount(1);
  };

  return (
    <div className="card bestill-card has-dots">
      <DotPattern visible={true} animated={animationsOn} />

      {phase === 'collapsed' && (
        <div className="bestill-content">
          <div className="bestill-icon">☽</div>
          <div className="bestill-title">Be Still</div>
          <div className="bestill-subtitle">
            Pause. Wait on the Lord.<br />Remember who He is.
          </div>
          <div className="bestill-prompt">Feeling overwhelmed?</div>
          <button className="bestill-btn" onClick={startFlow}>Begin Stillness</button>
        </div>
      )}

      {phase === 'breathing' && (
        <div className="bestill-breathing">
          <div className="breathing-ring">
            <svg viewBox="0 0 200 200" className="breathing-ring-svg">
              <circle className="breathing-ring-track" cx="100" cy="100" r="90" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="4" />
              <circle
                className="breathing-ring-progress"
                cx="100" cy="100" r="90"
                fill="none"
                stroke="white"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray="565.5"
                strokeDashoffset={565.5 - (565.5 * (breathCount / BREATH_DURATIONS[breathStep]))}
                style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
              />
            </svg>
            <div className="breathing-count-inner">{BREATH_DURATIONS[breathStep] - breathCount + 1}</div>
          </div>
          <div className="breathing-instruction">{BREATH_LABELS[breathStep]}</div>
          <div className="breathing-duration">{BREATH_DURATIONS[breathStep]} seconds</div>
          <div className="breathing-skip" onClick={skipToEncouragement}>Skip →</div>
        </div>
      )}

      {phase === 'breathing-reduced' && (
        <div className="breathing-reduced">
          <div className="breathing-reduced-steps">
            <span className="breathing-reduced-step">Inhale (6)</span>
            <span className="breathing-reduced-arrow">→</span>
            <span className="breathing-reduced-step">Hold (6)</span>
            <span className="breathing-reduced-arrow">→</span>
            <span className="breathing-reduced-step">Exhale (6)</span>
          </div>
          <button className="bestill-btn" onClick={skipToEncouragement}>Continue</button>
        </div>
      )}

      {phase === 'encouragement' && (
        <div className="bestill-encouragement">
          <div className="encouragement-panel">
            <div className="encouragement-message">
              {(() => {
                const msg = BE_STILL_ENCOURAGEMENTS[encouragementIndex].message;
                // Add personalization if first name is available
                // Keep it subtle - only for messages that naturally benefit from direct address
                // Skip for messages starting with "The Lord", "He", "His", or questions
                if (profile?.firstName && profile.firstName.trim()) {
                  const lowerMsg = msg.toLowerCase();
                  const skipPatterns = ['the lord', 'he ', 'his ', 'you have', 'you were', 'you are'];
                  const shouldPersonalize = !skipPatterns.some(pattern => lowerMsg.startsWith(pattern));

                  if (shouldPersonalize) {
                    // Natural personalization: "Tim, [rest of message]"
                    return `${profile.firstName}, ${msg.charAt(0).toLowerCase() + msg.slice(1)}`;
                  }
                }
                return msg;
              })()}
            </div>
            <div className="encouragement-reference">
              — {BE_STILL_ENCOURAGEMENTS[encouragementIndex].ref}
            </div>
          </div>
          <div className="bestill-actions">
            <button className="bestill-btn secondary" onClick={nextEncouragement}>Another</button>
            <button className="bestill-btn" onClick={openPrayer}>Pray</button>
            <button className="bestill-btn text-only" onClick={reset}>Done</button>
          </div>
        </div>
      )}

      {phase === 'prayer' && (
        <div className="bestill-prayer">
          <div className="prayer-panel">
            <div className="prayer-label">A Prayer</div>
            <div className="prayer-text">{BE_STILL_PRAYERS[prayerIndex]}</div>
          </div>
          <button className="bestill-btn" onClick={reset}>Amen</button>
        </div>
      )}
    </div>
  );
};

export default BeStillCard;
