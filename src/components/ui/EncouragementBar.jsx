/**
 * SELAH RHYTHM - Encouragement Bar Component
 * v0.9.45
 *
 * Displays rotating encouragement messages at the bottom of the app.
 * Messages change when the user switches modes and avoid repeating
 * the same message consecutively by storing the last shown index in localStorage.
 */

import { useState, useEffect } from 'react';
import { ENCOURAGEMENTS } from '../../data/constants';
import { formatEncouragement } from '../../utils/helpers';

/**
 * Get a random encouragement index that's different from the last one shown
 * @returns {number} Random index from ENCOURAGEMENTS array
 */
const getRandomIndex = () => {
  const lastIndex = parseInt(localStorage.getItem('selah_last_encouragement_idx') || '-1', 10);
  let newIndex;
  do {
    newIndex = Math.floor(Math.random() * ENCOURAGEMENTS.length);
  } while (newIndex === lastIndex && ENCOURAGEMENTS.length > 1);
  localStorage.setItem('selah_last_encouragement_idx', newIndex.toString());
  return newIndex;
};

/**
 * EncouragementBar Component
 *
 * @param {Object} props
 * @param {Object} props.profile - User profile with firstName
 * @param {string} props.mode - Current app mode (order/focus/rest)
 * @returns {JSX.Element}
 */
const EncouragementBar = ({ profile, mode }) => {
  const [msgIndex, setMsgIndex] = useState(() => getRandomIndex());

  // Rotate encouragement when mode changes
  useEffect(() => {
    setMsgIndex(getRandomIndex());
  }, [mode]);

  const firstName = profile?.firstName || '';
  const message = formatEncouragement(ENCOURAGEMENTS[msgIndex], firstName);

  return (
    <div className="encouragement-bar">
      <span className="encouragement-text">"{message}"</span>
    </div>
  );
};

export default EncouragementBar;
