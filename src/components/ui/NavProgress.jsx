/**
 * SELAH RHYTHM - Navigation Progress Component
 * Progress ring showing task completion percentage
 * Used in the navigation sidebar to display overall progress
 */

import React from 'react';

const NavProgress = ({ tasks }) => {
  const totalPlanned = tasks.primary.length + tasks.today.length;
  const completed = [...tasks.primary, ...tasks.today].filter(t => t.done).length;

  if (totalPlanned === 0) return null;

  const percentage = Math.round((completed / totalPlanned) * 100);
  const radius = 7;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="nav-progress" title={`${completed} of ${totalPlanned} tasks done`}>
      <div className="nav-progress-ring">
        <svg viewBox="0 0 18 18">
          <circle
            className="nav-progress-ring-track"
            cx="9" cy="9" r={radius}
          />
          <circle
            className="nav-progress-ring-fill"
            cx="9" cy="9" r={radius}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
          />
        </svg>
      </div>
      <div>
        <div className="nav-progress-text">{completed}/{totalPlanned}</div>
      </div>
    </div>
  );
};

export default NavProgress;
