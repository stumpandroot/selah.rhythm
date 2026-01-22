/**
 * useKeyboardShortcuts Hook
 *
 * Sets up global keyboard shortcuts for the application
 *
 * Shortcuts:
 * - 1, 2, 3: Switch between Order, Focus, and Rest modes
 * - Space: Toggle timer (Focus mode only)
 * - N: Focus quick-add input (Order mode only)
 * - S: Open settings
 * - Escape: Close modals
 *
 * @param {Object} options
 * @param {string} options.mode - Current app mode ('order'|'focus'|'rest')
 * @param {function} options.setMode - Mode setter function
 * @param {boolean} options.timerOn - Whether timer is enabled
 * @param {function} options.setRunning - Timer running state setter
 * @param {boolean} options.showSettings - Settings modal visibility
 * @param {function} options.setShowSettings - Settings modal visibility setter
 * @param {boolean} options.showGuide - Guide modal visibility
 * @param {function} options.setShowGuide - Guide modal visibility setter
 * @param {boolean} options.showSelah - Selah pause visibility
 * @param {function} options.setShowSelah - Selah pause visibility setter
 *
 * @example
 * useKeyboardShortcuts({
 *   mode,
 *   setMode,
 *   timerOn: settings.timerOn,
 *   setRunning,
 *   showSettings,
 *   setShowSettings,
 *   showGuide,
 *   setShowGuide,
 *   showSelah,
 *   setShowSelah
 * });
 */

import { useEffect } from 'react';

export const useKeyboardShortcuts = ({
  mode,
  setMode,
  timerOn,
  setRunning,
  showSettings,
  setShowSettings,
  showGuide,
  setShowGuide,
  showSelah,
  setShowSelah
}) => {
  useEffect(() => {
    const handleKeyboard = (e) => {
      // Don't trigger if user is typing in an input
      if (
        e.target.tagName === 'INPUT' ||
        e.target.tagName === 'TEXTAREA' ||
        e.target.isContentEditable
      ) {
        return;
      }

      // Number keys 1-3 for mode switching
      if (e.key === '1') {
        e.preventDefault();
        setMode('order');
      } else if (e.key === '2') {
        e.preventDefault();
        setMode('focus');
      } else if (e.key === '3') {
        e.preventDefault();
        setMode('rest');
      }

      // Space to toggle timer (only in Focus mode)
      if (e.key === ' ' && mode === 'focus' && timerOn) {
        e.preventDefault();
        setRunning(r => !r);
      }

      // 'n' to focus quick-add (only in Order mode)
      if (e.key === 'n' && mode === 'order') {
        e.preventDefault();
        const quickAddInput = document.querySelector('.quick-add-bar input');
        if (quickAddInput) quickAddInput.focus();
      }

      // 's' to open settings
      if (e.key === 's' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setShowSettings(true);
      }

      // Escape to close modals
      if (e.key === 'Escape') {
        if (showSettings) setShowSettings(false);
        if (showGuide) setShowGuide(false);
        if (showSelah) setShowSelah(false);
      }
    };

    window.addEventListener('keydown', handleKeyboard);
    return () => window.removeEventListener('keydown', handleKeyboard);
  }, [
    mode,
    setMode,
    timerOn,
    setRunning,
    showSettings,
    setShowSettings,
    showGuide,
    setShowGuide,
    showSelah,
    setShowSelah
  ]);
};

export default useKeyboardShortcuts;
