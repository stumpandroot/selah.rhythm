/**
 * GuideModal Component
 *
 * Help modal explaining the Order/Focus/Rest philosophy of Selah Rhythm.
 *
 * Displays a simple guide with three steps:
 * - Order: Planning and organizing your day
 * - Focus: Working on one task at a time
 * - Rest: Reflecting on your day
 *
 * Props:
 * @param {boolean} show - Whether the modal is visible
 * @param {Function} onClose - Callback to close the modal
 */

import React from 'react';
import * as Icons from '../shared/Icons';

const GuideModal = ({ show, onClose }) => {
  if (!show) return null;

  return (
    <>
      <div className={`settings-overlay${show ? " show" : ""}`} onClick={onClose} />
      <div className={`guide-modal${show ? " show" : ""}`}>
        <div className="guide-header">
          <h2><Icons.HelpCircle /> How to use Selah Rhythm</h2>
          <button className="settings-close" onClick={onClose}><Icons.X /></button>
        </div>
        <div className="guide-content">
          <div className="guide-step">
            <div className="guide-step-title"><span className="dot order" /> Order</div>
            <div className="guide-step-text">Plan your day. Add tasks to Primary (most important), Today, or Later. Set up your schedule and habits.</div>
          </div>
          <div className="guide-step">
            <div className="guide-step-title"><span className="dot focus" /> Focus</div>
            <div className="guide-step-text">Work on one task at a time. Link a task to the timer, start a session, give it your full attention. When done, take a break.</div>
          </div>
          <div className="guide-step">
            <div className="guide-step-title"><span className="dot rest" /> Rest</div>
            <div className="guide-step-text">Reflect on your day. Write what mattered, what to release, and what you're grateful for.</div>
          </div>
          <div className="guide-philosophy">The goal isn't doing everything—it's doing <strong>enough</strong>.</div>
        </div>
      </div>
    </>
  );
};

export default GuideModal;
