/**
 * HelpIcon Component
 *
 * Small help button for card headers
 *
 * Props:
 * @param {string} id - Help topic identifier
 * @param {function} onHelpClick - Click handler function (e, id)
 */

import React from 'react';
import Icons from './Icons';

const HelpIcon = ({ id, onHelpClick }) => (
  <button
    type="button"
    className="help-icon-btn"
    aria-label="What is this?"
    onClick={(e) => {
      e.stopPropagation();
      onHelpClick(e, id);
    }}
  >
    <Icons.HelpCircle />
  </button>
);

export default HelpIcon;
