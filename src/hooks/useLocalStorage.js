/**
 * useLocalStorage Hook
 *
 * Custom hook for syncing state with localStorage
 *
 * @param {string} key - localStorage key (will be prefixed with 'selah_')
 * @param {*} defaultValue - default value if key doesn't exist
 * @returns {[*, function]} - [value, setValue] tuple like useState
 *
 * @example
 * const [theme, setTheme] = useLocalStorage('theme', 'light');
 */

import { useState, useEffect } from 'react';

export const useLocalStorage = (key, defaultValue) => {
  // Initialize state with value from localStorage or default
  const [value, setValue] = useState(() => {
    try {
      const item = localStorage.getItem(`selah_${key}`);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return defaultValue;
    }
  });

  // Update localStorage when value changes
  useEffect(() => {
    try {
      localStorage.setItem(`selah_${key}`, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, value]);

  return [value, setValue];
};

export default useLocalStorage;
