/**
 * SELAH RHYTHM - "Enough" Indicator
 * v0.9.45
 *
 * Permission to rest when primary tasks complete
 * Gentle reminder that it's okay to stop working after completing what's important
 */

import React from 'react';
import Icons from '../shared/Icons';

/**
 * EnoughIndicator - "Enough" message when all primary tasks complete
 *
 * @param {boolean} show - Whether to display the indicator
 * @param {string} name - Optional user's first name for personalization
 *
 * @example
 * <EnoughIndicator show={allPrimaryTasksComplete} name="Sarah" />
 *
 * Displays: "Sarah, you've done enough today. It's okay to rest."
 */
const EnoughIndicator = ({ show, name }) => {
  if (!show) return null;

  return (
    <div className="enough-indicator">
      <div className="enough-icon">
        <Icons.Check />
      </div>
      <div className="enough-text">
        {name ? `${name}, you've` : "You've"} done enough today.
        <span className="enough-subtext">It's okay to rest.</span>
      </div>
    </div>
  );
};

export default EnoughIndicator;
