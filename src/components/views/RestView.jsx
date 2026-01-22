import ScriptureSection from '../cards/ScriptureSection';
import BeStillCard from '../cards/BeStillCard';
import PrayerGratitudeCard from '../cards/PrayerGratitudeCard';
import DailyReflection from '../cards/DailyReflection';

/**
 * RestView Component
 *
 * Spiritual reflection and rest view with 3-column layout:
 * - Left: Scripture verses with category selector and rotation
 * - Center: Be Still breathing exercise card
 * - Right: Prayer & Gratitude card stacked with Daily Reflection
 *
 * This view provides space for spiritual practices:
 * - Reading and meditating on scripture
 * - Practicing breathing and stillness
 * - Recording prayers and gratitude
 * - Evening reflection prompts
 *
 * Layout Strategy:
 * - Desktop: 3 equal columns with stacked cards in right column
 * - Mobile: Single column with cards stacked vertically
 * - All cards are always visible (no accordion)
 *
 * Key Features:
 * - Scripture rotation with 7 categories (faithfulness, rest, stewardship, discipline, patience, wisdom, courage)
 * - Breathing exercise with 6-6-6 second timing (inhale-hold-exhale)
 * - Prayer list with statuses: Active, Answered, Releasing
 * - Gratitude journal with streak tracking
 * - Daily reflection with 3-step guided prompts
 * - Export and clear functionality for reflections
 *
 * State Management:
 * - All state is passed down from parent App component
 * - This view is a pure orchestrator with no local state
 * - Child components manage their own internal UI state
 *
 * @param {Object} props
 * @param {string} props.gratitude - Daily gratitude entry text
 * @param {Function} props.setGratitude - Update gratitude: (text) => void
 * @param {Object} props.reflections - Daily reflection answers: {learned, proud, improving}
 * @param {Function} props.setReflections - Update reflections: (reflections) => void
 * @param {Array} props.reflectionHistory - Past reflection entries with timestamps
 * @param {boolean} props.completedToday - Whether reflection completed for current day
 * @param {boolean} props.animationsOn - Global animation toggle for performance
 * @param {Object} props.profile - User profile with {firstName} for personalization
 * @param {Function} props.onExport - Export reflection history handler
 * @param {Function} props.onClear - Clear reflection history handler
 * @param {Function} props.onHelpClick - Help icon click handler: (helpId) => void
 * @param {Array} props.prayers - Prayer requests: [{id, text, category, status, answeredNote, date}]
 * @param {Function} props.setPrayers - Update prayers array
 * @param {Array} props.gratitudeEntries - Gratitude entries: [{id, text, date}]
 * @param {Function} props.setGratitudeEntries - Update gratitude entries array
 */
const RestView = ({
  gratitude,
  setGratitude,
  reflections,
  setReflections,
  reflectionHistory,
  completedToday,
  animationsOn,
  profile,
  onExport,
  onClear,
  onHelpClick,
  prayers,
  setPrayers,
  gratitudeEntries,
  setGratitudeEntries
}) => {
  return (
    <div className="rest-layout">
      <div className="column">
        <ScriptureSection animationsOn={animationsOn} onHelpClick={onHelpClick} />
      </div>
      <div className="column">
        <BeStillCard animationsOn={animationsOn} profile={profile} onHelpClick={onHelpClick} />
      </div>
      <div className="column">
        <PrayerGratitudeCard
          prayers={prayers}
          setPrayers={setPrayers}
          gratitudeEntries={gratitudeEntries}
          setGratitudeEntries={setGratitudeEntries}
          onHelpClick={onHelpClick}
        />
        <DailyReflection
          gratitude={gratitude}
          setGratitude={setGratitude}
          reflections={reflections}
          setReflections={setReflections}
          reflectionHistory={reflectionHistory}
          completedToday={completedToday}
          animationsOn={animationsOn}
          onExport={onExport}
          onClear={onClear}
          onHelpClick={onHelpClick}
        />
      </div>
    </div>
  );
};

export default RestView;
