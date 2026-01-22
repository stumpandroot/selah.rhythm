/**
 * Undo Toast Component
 *
 * Props:
 * @param {boolean} show - Controls toast visibility
 * @param {object} task - The task that was completed
 * @param {function} onUndo - Callback to undo the completion
 * @param {function} onClose - Callback when toast auto-dismisses
 *
 * Features:
 * - Auto-dismisses after 5 seconds
 * - Shows completion confirmation with undo button
 * - Compact design for quick actions
 */

import { useEffect } from 'react';
import Icons from './Icons';

const UndoToast = ({show, task, onUndo, onClose}) => {
  useEffect(() => {
    if(show){
      const t = setTimeout(onClose, 5000);
      return () => clearTimeout(t);
    }
  }, [show, onClose]);

  if(!task) return null;

  return (
    <div className={`undo-toast${show?" show":""}`}>
      <div className="undo-toast-text">
        <Icons.Check />
        Completed
      </div>
      <button className="undo-btn" onClick={onUndo}>Undo</button>
    </div>
  );
};

export default UndoToast;
