# Selah Rhythm Foundation Files

This directory contains the extracted foundation files from `selah-rhythm-v0_9_45.html`.

## Files Created

### 1. `styles/variables.css`
**Source:** Lines 151-466 from the HTML file  
**Contents:**
- All CSS custom properties (:root and [data-theme="dark"])
- Typography tokens (fonts, sizes, weights, line-heights, letter-spacing)
- Spacing scale (space-0 through space-16)
- Border radius values
- Color system (backgrounds, accents, text, borders)
- Shadow definitions
- Card system tokens
- Hover states
- Animation timing functions
- Layout constraints
- Mobile safe area insets

### 2. `styles/global.css`
**Source:** Lines 1-150 (reset/base) and 468-10081 (components) from HTML  
**Status:** ⚠️ Stub created - needs full extraction  
**Contents:**
- @import for variables.css
- CSS reset (* selector)
- Global typography settings
- Body styles

**Note:** The full component styles (lines 468-10081) should be extracted and organized into separate component CSS files:
- `styles/components/card.css`
- `styles/components/tasks.css`
- `styles/components/timer.css`
- `styles/components/schedule.css`
- `styles/components/habits.css`
- `styles/layout/header.css`
- `styles/layout/nav.css`
- etc.

### 3. `data/constants.js`
**Source:** Lines 10314-10432 from the HTML file  
**Contents:**
- `PRESETS` - Timer duration presets
- `DEFAULT_CATS` - Default task categories with colors
- `TIMES` - Time estimate options
- `LISTS` - Task list types
- `HOUR_HEIGHT` - Schedule grid constant
- `SCRIPTURE` - 7 categories of scripture verses (faithfulness, rest, stewardship, discipline, patience, wisdom, courage)
- `SELAH_PROMPTS` - Reflection prompts for each scripture category
- `ENCOURAGEMENTS` - 20 personalized encouragement messages with {name} placeholder
- `MERCIES_VERSES` - Rotating Lamentations verses
- `SELAH_VERSES` - Rest tab verses
- `CELEBS` - Celebration messages
- `VERSION_HISTORY` - Changelog array (partial extraction)

### 4. `utils/helpers.js`
**Source:** Lines 11307-11421 from the HTML file  
**Contents:**
- `genId()` - Random ID generator
- `fmtTime(s)` - Format seconds to MM:SS
- `fmtHour(h)` - Format hour to 12-hour time
- `fmtTimeSlot(h, m)` - Format hour and minute to time slot
- `addMinutes(h, m, dur)` - Add duration to time
- `fmtDate(d)` - Format date to "MMM DD"
- `fmtDateFull(d)` - Format date to "Day, MMM DD"
- `getToday()` - Get current day/date info
- `load(k, d)` - Safe localStorage getter with error handling
- `save(k, v)` - Safe localStorage setter with error handling
- `groupByDate(tasks)` - Group tasks by completion date
- `formatEncouragement(message, firstName)` - Replace {name} placeholder in messages

### 5. `components/shared/Icons.jsx`
**Source:** Lines 10183-10311 from the HTML file  
**Contents:**
- All SVG icons as React components
- Card header icons (solid, designed for colored backgrounds):
  - CircleCheckSolid, CalendarSolid, StarSolid, HeartSolid, AnchorSolid, TimerSolid, BookSolid, SunriseSolid
- Standard UI icons (stroke-based):
  - Book, Sun, Moon, Calendar, Check, Chevrons, Arrows, Loader, Play, Pause, Reset, etc.
- Backwards compatible aliases for migration
- Each icon accepts props for styling
- Default export with all icons as object

## Usage

### Importing Variables
```javascript
// In your main CSS or component CSS files
@import '../styles/variables.css';

// Now you can use all CSS custom properties
.my-component {
  color: var(--text-primary);
  background: var(--card-bg);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
}
```

### Importing Constants
```javascript
import { PRESETS, SCRIPTURE, ENCOURAGEMENTS } from '../data/constants.js';

// Use the data
const timerPreset = PRESETS[2]; // 15 minutes
const verse = SCRIPTURE.rest[0];
const message = ENCOURAGEMENTS[0];
```

### Importing Helpers
```javascript
import { fmtTime, load, save, formatEncouragement } from '../utils/helpers.js';

// Use the helpers
const formattedTime = fmtTime(300); // "05:00"
const tasks = load('tasks', []);
save('tasks', updatedTasks);
const personalMessage = formatEncouragement(ENCOURAGEMENTS[0], "John");
```

### Importing Icons
```javascript
// Named imports
import { CircleCheckSolid, CalendarSolid, Check } from '../components/shared/Icons.jsx';

function MyComponent() {
  return (
    <div>
      <CircleCheckSolid style={{ width: 24, height: 24, color: 'var(--terracotta)' }} />
      <Check className="my-icon-class" />
    </div>
  );
}

// Or default import
import Icons from '../components/shared/Icons.jsx';

function MyComponent() {
  return <Icons.CircleCheckSolid />;
}
```

## Next Steps

1. **Extract Full Component CSS** - The global.css file is a stub. Extract the full component styles from lines 468-10081 of the source HTML and organize into separate files.

2. **Create Component Structure** - Build React components that use these foundations:
   - Header with navigation
   - Task cards and lists
   - Timer component
   - Schedule grid
   - Habits tracker
   - Rest/reflection components

3. **Add State Management** - Implement React hooks or state management for:
   - Tasks and lists
   - Timer state
   - Schedule events
   - Habits tracking
   - Settings and preferences

4. **Integrate localStorage** - Use the helper functions to persist data

5. **Apply Styles** - Import variables.css in component CSS files and use the design tokens

## Design System

The extracted variables follow the Selah Rhythm design system:
- **Primary Accent:** Terracotta (#C4704B) - Order mode, primary tasks
- **Secondary Accent:** Sage (#7A9A7E) - Rest mode, habits, completion
- **Tertiary Accent:** Ochre (#C9A227) - Highlights, this week tasks
- **Focus Mode:** Deep Plum (#6B4A6B) - Focus mode, timer
- **Typography:** Cormorant Garamond (display), DM Sans (body)
- **Spacing:** 4px base unit scale
- **Radius:** 4px (sm) to 9999px (full)
- **Shadows:** Warm-tinted elevation system

Refer to `variables.css` for the complete design token reference.
