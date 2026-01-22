/**
 * SELAH RHYTHM - Time Helper Functions
 * v0.9.45
 *
 * Time-aware utilities for greetings and time formatting
 */

/**
 * Returns a time-appropriate greeting with optional personalization
 *
 * @param {Object} profile - User profile object with optional firstName
 * @returns {string} Time-aware greeting (e.g., "Good morning, Sarah" or "Good evening")
 *
 * @example
 * getGreeting({ firstName: 'Sarah' }) // => "Good morning, Sarah" (if before noon)
 * getGreeting({}) // => "Good afternoon" (if between noon and 5pm)
 * getGreeting(null) // => "Good evening" (if after 5pm)
 */
export const getGreeting = (profile) => {
  const hour = new Date().getHours();
  const timeGreeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const name = profile?.firstName?.trim();
  return name ? `${timeGreeting}, ${name}` : timeGreeting;
};
