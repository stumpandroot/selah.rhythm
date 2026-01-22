# Selah Rhythm v0.9.45 - Modularization Plan

## Overview
This document outlines how to split the 17,331-line monolithic HTML file into a proper modular React + Vite application.

## Current File Structure
- **Lines 1-10,081**: CSS styles (design tokens, components, layouts)
- **Lines 10,082-10,112**: HTML structure and CDN library imports
- **Lines 10,113-17,331**: React application code

## Proposed Directory Structure

```
selah-rhythm-modular/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── shared/
│   │   │   ├── Icons.jsx              # All SVG icons as components
│   │   │   ├── Toast.jsx              # Toast notification system
│   │   │   ├── UndoToast.jsx          # Completion undo toast
│   │   │   ├── CustomSelect.jsx       # Portal-based dropdown
│   │   │   ├── CategoryPortalMenu.jsx # Category color picker
│   │   │   ├── DotPattern.jsx         # Animated background dots
│   │   │   └── SegmentedControl.jsx   # iOS-style segmented control
│   │   ├── ui/
│   │   │   ├── TaskItem.jsx           # Individual task component
│   │   │   ├── SwipeableWrapper.jsx   # Swipe gesture handler
│   │   │   ├── TaskContextMenu.jsx    # Right-click/long-press menu
│   │   │   ├── TaskSection.jsx        # Reusable task list card
│   │   │   ├── TimerCard.jsx          # Focus timer component
│   │   │   ├── TimerTaskSelector.jsx  # Task linking dropdown
│   │   │   ├── NavProgress.jsx        # Progress ring indicator
│   │   │   └── MiniProgressRing.jsx   # Small progress indicator
│   │   ├── cards/
│   │   │   ├── ScriptureSection.jsx   # Daily scripture card
│   │   │   ├── DailyWisdomCard.jsx    # Proverbs/Psalms selector
│   │   │   ├── AnchorsSection.jsx     # Life anchors card
│   │   │   ├── HabitsSection.jsx      # Daily habits tracker
│   │   │   ├── BeStillCard.jsx        # Breathing exercise
│   │   │   ├── PrayerGratitudeCard.jsx # Prayer & gratitude journal
│   │   │   ├── DailyReflection.jsx    # Evening reflection
│   │   │   └── ScheduleCard.jsx       # Daily schedule with drag-drop
│   │   ├── modals/
│   │   │   ├── SettingsModal.jsx      # App settings
│   │   │   ├── GuideModal.jsx         # Help/guide modal
│   │   │   ├── SelahPause.jsx         # Full-screen pause overlay
│   │   │   ├── WeeklyReflectionModal.jsx # Sunday reflection
│   │   │   └── NewDayTransition.jsx   # Morning greeting
│   │   ├── mobile/
│   │   │   ├── MobileTabBar.jsx       # Bottom navigation
│   │   │   ├── MobileHeader.jsx       # Mobile header with greeting
│   │   │   ├── MobileAccordionSection.jsx # Accordion for Order view
│   │   │   └── DailyWisdomContent.jsx # Mobile wisdom display
│   │   └── views/
│   │       ├── OrderView.jsx          # Planning view
│   │       ├── FocusView.jsx          # Timer-focused view
│   │       └── RestView.jsx           # Reflection/spiritual view
│   ├── hooks/
│   │   ├── useLocalStorage.js         # localStorage persistence
│   │   ├── useDailyReset.js           # Daily reset logic
│   │   ├── useKeyboardShortcuts.js    # Keyboard navigation
│   │   ├── useSwipeGestures.js        # Touch gesture handling
│   │   └── useScrollAware.js          # Scroll-aware header
│   ├── utils/
│   │   └── helpers.js                 # Utility functions
│   ├── data/
│   │   └── constants.js               # All constant data
│   ├── styles/
│   │   ├── variables.css              # CSS design tokens
│   │   └── global.css                 # Global styles
│   ├── App.jsx                        # Root component
│   ├── App.css                        # App-specific styles
│   └── main.jsx                       # Entry point
├── index.html
├── package.json
└── vite.config.js
```

## File Extraction Map

### 1. Data & Constants (`src/data/constants.js`)
**Lines: 10314-10432**
- PRESETS (timer durations)
- DEFAULT_CATS (task categories)
- TIMES (time estimates)
- LISTS (task list identifiers)
- HOUR_HEIGHT (schedule constant)
- SCRIPTURE (7 categories with verses)
- SELAH_PROMPTS (reflection prompts)
- ENCOURAGEMENTS (20 encouraging messages)
- MERCIES_VERSES, SELAH_VERSES, CELEBS
- VERSION_HISTORY (changelog)

### 2. Utility Functions (`src/utils/helpers.js`)
**Lines: 10415, 11307-11339**
- `genId()` - Generate random IDs
- `fmtTime()` - Format seconds as MM:SS
- `fmtHour()` - Format hour as "3 PM"
- `fmtTimeSlot()` - Format as "3:45 PM"
- `addMinutes()` - Add duration to time
- `fmtDate()` - Format as "Jan 16"
- `fmtDateFull()` - Format as "Monday, Jan 16"
- `getToday()` - Get current date info
- `load()` - Safe localStorage getter
- `save()` - Safe localStorage setter
- `groupByDate()` - Group completed tasks
- `formatEncouragement()` - Replace {name} placeholder

### 3. Icons (`src/components/shared/Icons.jsx`)
**Lines: 10183-10311**
All SVG icons exported as React components:
- Card header icons (CircleCheckSolid, CalendarSolid, StarSolid, etc.)
- UI icons (Check, ChevronDown, Play, Pause, Settings, etc.)
- Aliases for backwards compatibility

### 4. CSS Variables (`src/styles/variables.css`)
**Lines: 151-240 (approximately)**
All CSS custom properties from `:root`:
- Typography tokens
- Spacing tokens
- Color tokens (light & dark themes)
- Animation tokens
- Border radius, shadows, etc.

### 5. Global Styles (`src/styles/global.css`)
**Lines: 1-150, 241-10,081**
- Reset styles
- Layout system
- Component styles
- Responsive breakpoints
- Animations & transitions
- Dark mode overrides

### 6. Component Extraction (Large components)

#### App Component
**Lines: ~16176-17229**
- Root application state
- Mode management (order/focus/rest)
- Daily reset logic
- Keyboard shortcuts
- Scroll-aware behavior

#### OrderView
**Lines: ~14619-15000**
- Task management interface
- Schedule card
- Habits and anchors
- Mobile accordion layout

#### FocusView
**Lines: ~14333-14618**
- Timer-dominant layout
- Today's tasks sidebar
- Deep work progress bar

#### RestView
**Lines: ~15875-15922**
- Scripture card
- Be Still breathing
- Prayer & gratitude
- Daily reflection

#### Additional Component Lines
- **TaskSection**: 12443-12603
- **TaskItem**: 12208-12442
- **SwipeableWrapper**: 11978-12103
- **TaskContextMenu**: 12104-12207
- **TimerCard**: 13704-13900
- **TimerTaskSelector**: 13620-13703
- **ScriptureSection**: 12604-12702
- **DailyWisdomCard**: 12703-12774
- **AnchorsSection**: 12775-12911
- **HabitsSection**: 12912-13102
- **DailyReflection**: 13103-13261
- **BeStillCard**: 13395-13561
- **PrayerGratitudeCard**: 15355-15874
- **CustomSelect**: 11342-11434
- **CategoryPortalMenu**: 11435-11506
- **DotPattern**: 11507-11515
- **Toast**: 11516-11579
- **UndoToast**: 11580-11586
- **SettingsModal**: 11634-12103
- **GuideModal**: 11603-11633
- **SelahPause**: 11587-11602
- **WeeklyReflectionModal**: 15923-15974
- **NewDayTransition**: 15975-16004
- **MobileTabBar**: 16005-16092
- **MobileHeader**: 16093-16150
- **MobileAccordionSection**: 14438-14618
- **MiniProgressRing**: 16151-16175
- **DailyWisdomContent**: 14570-14618
- **NavProgress**: 14298-14332
- **DeepWorkBar**: 15889-15907
- **EnoughIndicator**: 15908-15922

## Implementation Steps

### Phase 1: Foundation (30 minutes)
1. ✅ Create Vite project structure
2. ✅ Update package.json metadata
3. Extract CSS variables to `src/styles/variables.css`
4. Extract global CSS to `src/styles/global.css`
5. Extract constants to `src/data/constants.js`
6. Extract helpers to `src/utils/helpers.js`
7. Extract icons to `src/components/shared/Icons.jsx`

### Phase 2: Shared Components (45 minutes)
8. Create Toast components
9. Create CustomSelect and CategoryPortalMenu
10. Create DotPattern
11. Create SwipeableWrapper
12. Create TaskContextMenu

### Phase 3: Task Components (60 minutes)
13. Create TaskItem component
14. Create TaskSection component
15. Create TimerCard component
16. Create TimerTaskSelector

### Phase 4: Card Components (60 minutes)
17. Create ScriptureSection
18. Create DailyWisdomCard
19. Create AnchorsSection
20. Create HabitsSection
21. Create BeStillCard
22. Create PrayerGratitudeCard
23. Create DailyReflection
24. Create ScheduleCard

### Phase 5: Modal Components (30 minutes)
25. Create SettingsModal
26. Create GuideModal
27. Create SelahPause
28. Create WeeklyReflectionModal
29. Create NewDayTransition

### Phase 6: Mobile Components (30 minutes)
30. Create MobileTabBar
31. Create MobileHeader
32. Create MobileAccordionSection
33. Create progress indicators

### Phase 7: View Components (60 minutes)
34. Create OrderView
35. Create FocusView
36. Create RestView

### Phase 8: App & Integration (45 minutes)
37. Create App component with state management
38. Create main.jsx entry point
39. Update index.html
40. Create custom hooks
41. Test and debug

## Dependencies Required

```json
{
  "dependencies": {
    "react": "^19.2.0",
    "react-dom": "^19.2.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^5.1.1",
    "vite": "^7.2.4"
  }
}
```

## External Resources
The app uses these external resources (loaded via CDN in original):
- **Fonts**:
  - Cormorant Garamond (serif, for scripture/display)
  - DM Sans (sans-serif, for body text)
- **React**: Now managed by npm/Vite

## State Management Pattern
No external state library needed. The app uses:
- React useState for component-local state
- Props drilling for shared state
- localStorage for persistence
- Custom hooks for reusable logic

## Key Features to Preserve
- ✅ Drag-and-drop task reordering
- ✅ Swipe gestures (mobile)
- ✅ localStorage persistence
- ✅ Dark mode support
- ✅ Mobile responsive design
- ✅ Keyboard shortcuts
- ✅ Pomodoro timer with task linking
- ✅ Daily reset logic
- ✅ Scripture rotation
- ✅ Prayer & gratitude tracking
- ✅ Habit streaks
- ✅ Schedule with drag-to-create

## Testing Strategy
1. Test each view mode (Order/Focus/Rest)
2. Test mobile responsive behavior
3. Test localStorage persistence
4. Test dark mode toggle
5. Test timer functionality
6. Test drag-and-drop features
7. Test swipe gestures on mobile
8. Test daily reset logic

## Next Steps
Choose how you'd like to proceed:
1. **Automated extraction**: Let me extract all components automatically
2. **Step-by-step**: Walk through each phase together
3. **Partial split**: Extract only specific components you want to modify
4. **Review & customize**: Modify this plan before executing
