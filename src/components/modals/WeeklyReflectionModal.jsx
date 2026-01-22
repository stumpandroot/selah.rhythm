/**
 * SELAH RHYTHM - Weekly Reflection Modal
 * v0.9.45
 *
 * Sunday evening alignment prompt for weekly reflection
 * Prompts user to reflect on faithfulness (not productivity) from the past week
 */

import React, { useState } from 'react';
import Icons from '../shared/Icons';

/**
 * WeeklyReflectionModal - Sunday evening alignment prompt
 *
 * @param {boolean} show - Whether to display the modal
 * @param {Function} onClose - Callback when modal is closed
 * @param {Object} profile - User profile with optional firstName
 *
 * @example
 * <WeeklyReflectionModal
 *   show={isSundayEvening}
 *   onClose={() => setShowReflection(false)}
 *   profile={{ firstName: 'Sarah' }}
 * />
 *
 * Stores reflections in localStorage under 'selah-weekly-reflections'
 * Keeps last 52 weeks of reflections (1 year)
 */
const WeeklyReflectionModal = ({ show, onClose, profile }) => {
  const [reflection, setReflection] = useState('');

  if (!show) return null;

  const handleSave = () => {
    if (reflection.trim()) {
      // Save to reflection history
      const history = JSON.parse(localStorage.getItem('selah-weekly-reflections') || '[]');
      history.push({
        date: new Date().toISOString(),
        text: reflection.trim(),
        type: 'weekly'
      });
      localStorage.setItem('selah-weekly-reflections', JSON.stringify(history.slice(-52))); // Keep 1 year
    }
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal weekly-reflection-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Weekly Reflection</h2>
          <button className="modal-close" onClick={onClose}>
            <Icons.X />
          </button>
        </div>
        <div className="modal-body">
          <p className="weekly-reflection-prompt">
            {profile?.firstName ? `${profile.firstName}, as` : 'As'} this week closes...
          </p>
          <p className="weekly-reflection-question">What was faithful this week?</p>
          <textarea
            className="weekly-reflection-input"
            placeholder="Take a moment to notice where God was at work..."
            value={reflection}
            onChange={e => setReflection(e.target.value)}
            rows={5}
          />
          <p className="weekly-reflection-hint">
            Not accomplishments. Not productivity. Just faithfulness.
          </p>
        </div>
        <div className="modal-footer">
          <button className="modal-btn secondary" onClick={onClose}>Skip</button>
          <button className="modal-btn primary" onClick={handleSave}>Save & Close</button>
        </div>
      </div>
    </div>
  );
};

export default WeeklyReflectionModal;
