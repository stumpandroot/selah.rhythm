/**
 * Dot Pattern Background Component
 *
 * Props:
 * @param {boolean} visible - Controls visibility of the pattern
 * @param {boolean} animated - Enables animation effects
 *
 * Features:
 * - Animated dot grid background
 * - Used in Selah Pause overlay
 * - Conditional animation based on user settings
 */

const DotPattern = ({visible, animated}) => {
  return (
    <div
      className={`dot-pattern${visible?" visible":""}${animated?" animated":""}`}
    />
  );
};

export default DotPattern;
