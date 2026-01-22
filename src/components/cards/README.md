# Card Components

Modular React components extracted from Selah Rhythm v0.9.45 HTML prototype.

## Components

### 1. ScriptureSection.jsx

**Purpose**: Daily scripture with rotating verses and category selector.

**Location in HTML**: Lines 12604-12630

**Features**:
- Category pills for 7 scripture themes (faithfulness, rest, stewardship, discipline, patience, wisdom, courage)
- Verse rotation with Previous/Next navigation
- Bible.com reference links (opens in new tab)
- Contextual Selah prompts for reflection
- No header/toggle - always visible

**Props**:
```javascript
{
  animationsOn: boolean,      // Enable/disable animations
  onHelpClick: function        // Help icon click handler
}
```

**State**:
- `cat`: Current scripture category (default: "faithfulness")
- `idx`: Current verse index within category

**Data Dependencies**:
- `SCRIPTURE` from `../../data/constants` - Object mapping categories to verse arrays `[{t, r}]`
- `SELAH_PROMPTS` from `../../data/constants` - Object mapping categories to reflection prompts

**Example Usage**:
```jsx
import { ScriptureSection } from './components/cards';

<ScriptureSection
  animationsOn={true}
  onHelpClick={(e, id) => console.log('Help clicked:', id)}
/>
```

---

### 2. DailyWisdomCard.jsx

**Purpose**: Daily wisdom from Proverbs or Psalms with verse rotation.

**Location in HTML**: Lines 12703-12758

**Features**:
- Segmented control to switch between Proverbs and Psalms
- Day-of-year based initial verse selection (cycles through library)
- Manual verse cycling with "Next Verse" button
- Embedded verse library (30+ verses per category)
- Pre-line formatting for multi-line verses
- Card header with gold/ochre styling and book icon

**Props**:
```javascript
{
  onHelpClick: function        // Help icon click handler
}
```

**State**:
- `mode`: 'proverbs' or 'psalms'
- `verseIndex`: Manual offset from day-of-year index

**Embedded Data**:
- `PROVERBS_LIBRARY`: 30 Proverbs verses (NLT)
- `PSALMS_LIBRARY`: 30 Psalms verses (NLT)

**Example Usage**:
```jsx
import { DailyWisdomCard } from './components/cards';

<DailyWisdomCard
  onHelpClick={(e, id) => console.log('Help clicked:', id)}
/>
```

---

### 3. AnchorsSection.jsx

**Purpose**: Life anchors / core values with add/edit/delete functionality.

**Location in HTML**: Lines 12775-12909

**Features**:
- Collapsible card header with chevron indicator
- Add new anchors with inline input
- Edit anchors inline with confirm/cancel
- Delete anchors
- Auto-focus on input fields
- Keyboard shortcuts (Enter to save, Escape to cancel)
- Empty state messaging
- Card header with blue/terracotta styling and anchor icon

**Props**:
```javascript
{
  anchors: Array,              // Array of anchor objects [{id, text}]
  onAdd: function,             // Callback when adding new anchor (text)
  onEdit: function,            // Callback when editing anchor (id, newText)
  onDel: function,             // Callback when deleting anchor (id)
  onHelpClick: function        // Help icon click handler
}
```

**State**:
- `expanded`: Card drawer open/closed state
- `editingId`: ID of anchor currently being edited
- `editText`: Text value during edit
- `showAdd`: Show/hide add input row
- `newText`: Text value for new anchor

**Example Usage**:
```jsx
import { AnchorsSection } from './components/cards';

const [anchors, setAnchors] = useState([
  { id: '1', text: 'Family first' },
  { id: '2', text: 'Serve others' }
]);

<AnchorsSection
  anchors={anchors}
  onAdd={(text) => setAnchors([...anchors, { id: Date.now().toString(), text }])}
  onEdit={(id, newText) => setAnchors(anchors.map(a => a.id === id ? {...a, text: newText} : a))}
  onDel={(id) => setAnchors(anchors.filter(a => a.id !== id))}
  onHelpClick={(e, id) => console.log('Help clicked:', id)}
/>
```

---

### 4. HabitsSection.jsx

**Purpose**: Daily habits tracker with streaks, checkboxes, and drag reordering.

**Location in HTML**: Lines 12912-13099

**Features**:
- Checkbox toggles with visual completion state
- 7-day streak visualization (dot indicators)
- Drag-to-reorder within habits list (grip handle)
- Drag-to-schedule (habits can be dragged to calendar)
- Add new habits with inline input
- Delete habits
- Reset all completed habits
- Auto-focus on add input
- Keyboard shortcuts (Enter to add, Escape to cancel)
- Empty state messaging
- Card header with green/sage styling and heart icon

**Props**:
```javascript
{
  habits: Array,               // Array of habit objects (see below)
  onToggle: function,          // Callback when toggling habit completion (id)
  onAdd: function,             // Callback when adding new habit (name)
  onDel: function,             // Callback when deleting habit (id)
  onReset: function,           // Callback to reset all habits
  onReorder: function,         // Callback when reordering habits (habitId, targetIndex)
  onHelpClick: function        // Help icon click handler
}
```

**Habit Object Structure**:
```javascript
{
  id: string,
  name: string,
  desc?: string,               // Optional description
  done: boolean,
  history: [                   // 7-day history for streak visualization
    {
      date: 'YYYY-MM-DD',
      done: boolean
    }
  ]
}
```

**State**:
- `inp`: Input value for new habit
- `showAdd`: Show/hide add input row
- `draggedHabitId`: ID of habit being dragged (for reordering)
- `dragOverIndex`: Index of drop target during drag

**Drag Data Format**:
```javascript
{
  type: 'habit',
  habitId: string,
  title: string,
  duration: number,            // Default 15 minutes
  reorder?: boolean            // true for drag-to-reorder, false/undefined for drag-to-schedule
}
```

**Example Usage**:
```jsx
import { HabitsSection } from './components/cards';

const [habits, setHabits] = useState([
  {
    id: '1',
    name: 'Morning prayer',
    done: false,
    history: [
      { date: '2026-01-15', done: true },
      { date: '2026-01-16', done: true },
      { date: '2026-01-17', done: false }
    ]
  }
]);

<HabitsSection
  habits={habits}
  onToggle={(id) => setHabits(habits.map(h => h.id === id ? {...h, done: !h.done} : h))}
  onAdd={(name) => setHabits([...habits, { id: Date.now().toString(), name, done: false, history: [] }])}
  onDel={(id) => setHabits(habits.filter(h => h.id !== id))}
  onReset={() => setHabits(habits.map(h => ({...h, done: false})))}
  onReorder={(habitId, targetIndex) => {
    const currentIndex = habits.findIndex(h => h.id === habitId);
    const reordered = [...habits];
    const [moved] = reordered.splice(currentIndex, 1);
    reordered.splice(targetIndex, 0, moved);
    setHabits(reordered);
  }}
  onHelpClick={(e, id) => console.log('Help clicked:', id)}
/>
```

---

## Shared Dependencies

All components require:

1. **Icons**: `import * as Icons from '../shared/Icons'`
   - Located at `/src/components/shared/Icons.jsx`
   - Used icons: BookSolid, AnchorSolid, HeartSolid, HelpCircle, Plus, Check, X, Edit, Anchor, GripVertical, Reset, Sparkles, ChevronRight

2. **Constants** (where applicable):
   - Located at `/src/data/constants.js`
   - `SCRIPTURE`: Scripture verses by category
   - `SELAH_PROMPTS`: Reflection prompts by category

## Styling

All components use CSS classes from the main application stylesheet. Key class patterns:

- `.card` - Base card container
- `.card-header` - Header with icon and title
- `.card-content` - Content area with padding
- `.card-icon` - Icon badge in header
- `.card-drawer` - Collapsible content area
- `.help-icon-btn` - Help icon button
- Component-specific classes (e.g., `.scripture-verse`, `.habit-item`, `.anchor-item`, `.wisdom-segmented-control`)

## Mobile Responsiveness

All components include responsive design considerations:
- Touch-friendly hit areas (48px minimum)
- Mobile-optimized spacing and typography
- Collapsible/accordion patterns for space efficiency
- Keyboard and touch event handling

## Accessibility

Components include:
- Semantic HTML structure
- ARIA labels on icon buttons
- Keyboard navigation support
- Focus management for inputs
- Screen reader friendly text

## Data Persistence

These components are presentational and do not handle localStorage directly. Parent components should:
1. Load initial state from localStorage
2. Pass data as props
3. Handle callbacks to update state
4. Persist state changes to localStorage

Example persistence pattern:
```javascript
// Parent component
const [habits, setHabits] = useState(() => {
  const saved = localStorage.getItem('habits');
  return saved ? JSON.parse(saved) : [];
});

useEffect(() => {
  localStorage.setItem('habits', JSON.stringify(habits));
}, [habits]);
```

## Testing Considerations

When testing these components:
1. Test keyboard interactions (Enter, Escape)
2. Test drag-and-drop functionality
3. Test empty states
4. Test edit/add/delete flows
5. Test auto-focus behavior
6. Test streak calculation logic (HabitsSection)
7. Test day-of-year verse rotation (DailyWisdomCard)

## Future Enhancements

Potential improvements:
- Add animation prop support for transitions
- Add loading states for async operations
- Add undo/redo for deletions
- Add batch operations (multi-select)
- Add search/filter for large lists
- Add export/import functionality
- Add keyboard shortcuts documentation
