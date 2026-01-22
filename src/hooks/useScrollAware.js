/**
 * useScrollAware Hook
 *
 * Manages scroll-aware UI behavior for mobile
 * Automatically collapses/expands mobile tab bar based on scroll direction
 *
 * Features:
 * - Collapses tab bar on significant downward scroll
 * - Expands tab bar on upward scroll or near top
 * - Auto-expands after 2 seconds of no scrolling
 * - Only active on mobile (< 768px width)
 *
 * @param {Object} options
 * @param {boolean} options.isMobile - Whether device is mobile
 * @param {function} options.setMobileTabCollapsed - Tab bar collapsed state setter
 * @returns {function} - handleScroll function to attach to scrollable element
 *
 * @example
 * const handleScroll = useScrollAware({ isMobile, setMobileTabCollapsed });
 * <div onScroll={handleScroll}>...</div>
 */

import { useCallback, useRef, useEffect } from 'react';

export const useScrollAware = ({ isMobile, setMobileTabCollapsed }) => {
  const lastScrollY = useRef(0);
  const collapseTimeout = useRef(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (collapseTimeout.current) {
        clearTimeout(collapseTimeout.current);
      }
    };
  }, []);

  const handleScroll = useCallback((e) => {
    if (!isMobile) return;

    const scrollY = e.target.scrollTop;
    const delta = scrollY - lastScrollY.current;

    // Collapse when scrolling down significantly and past threshold
    if (delta > 15 && scrollY > 80) {
      setMobileTabCollapsed(true);
    }
    // Expand when scrolling up or near top
    else if (delta < -10 || scrollY < 50) {
      setMobileTabCollapsed(false);
    }

    // Auto-expand after scroll stops (2 second delay)
    if (collapseTimeout.current) {
      clearTimeout(collapseTimeout.current);
    }
    collapseTimeout.current = setTimeout(() => {
      setMobileTabCollapsed(false);
    }, 2000);

    lastScrollY.current = scrollY;
  }, [isMobile, setMobileTabCollapsed]);

  return handleScroll;
};

export default useScrollAware;
