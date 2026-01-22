# Shared UI Components

This directory contains reusable UI components extracted from the Selah Rhythm app. All components are fully functional and preserve the original implementation logic.

## Components

### 1. Toast.jsx
**Purpose:** General-purpose toast notification with auto-dismiss and pause-on-hover functionality.

**Usage:**
```jsx
import { Toast } from './components/shared';

<Toast
  show={showToast}
  data={{ title: "Success", msg: "Task completed!" }}
  onClose={() => setShowToast(false)}
/>
```

**Features:**
- Auto-dismisses after 6 seconds
- Pauses timer when user hovers
- Click anywhere to dismiss
- Calculates remaining time intelligently

---

### 2. UndoToast.jsx
**Purpose:** Compact toast for task completion with undo button.

**Usage:**
```jsx
import { UndoToast } from './components/shared';

<UndoToast
  show={showUndo}
  task={completedTask}
  onUndo={handleUndo}
  onClose={() => setShowUndo(false)}
/>
```

**Features:**
- Auto-dismisses after 5 seconds
- Quick undo action
- Minimal design for fast interactions

---

### 3. DotPattern.jsx
**Purpose:** Animated dot grid background for overlays.

**Usage:**
```jsx
import { DotPattern } from './components/shared';

<DotPattern visible={isVisible} animated={animationsEnabled} />
```

**Features:**
- Conditional animation based on user settings
- Used in Selah Pause overlay
- Pure presentational component

---

### 4. CustomSelect.jsx
**Purpose:** Portal-based dropdown with automatic flip detection.

**Usage:**
```jsx
import { CustomSelect } from './components/shared';

<CustomSelect
  value={selectedValue}
  options={[
    { value: 'opt1', label: 'Option 1' },
    { value: 'opt2', label: 'Option 2' }
  ]}
  onChange={handleChange}
  placeholder="Choose option..."
  className="my-select"
/>
```

**Features:**
- Portal rendering prevents clipping
- Auto-flips up/down based on viewport space
- Closes on outside click, scroll, or Escape
- Responsive positioning

---

### 5. CategoryPortalMenu.jsx
**Purpose:** Category selector with color dots, portal-based to prevent card clipping.

**Usage:**
```jsx
import { CategoryPortalMenu } from './components/shared';

const triggerRef = useRef(null);

<button ref={triggerRef}>Select Category</button>

<CategoryPortalMenu
  isOpen={menuOpen}
  onClose={() => setMenuOpen(false)}
  triggerRef={triggerRef}
  categories={taskCategories}
  selectedId={selectedCategoryId}
  onSelect={handleCategorySelect}
/>
```

**Features:**
- Portal rendering for proper layering
- Auto-flip based on viewport space
- Color dot indicators
- Keyboard and scroll close handlers

---

### 6. SwipeableWrapper.jsx
**Purpose:** Touch gesture handler for task actions.

**Usage:**
```jsx
import { SwipeableWrapper } from './components/shared';

<SwipeableWrapper
  onSwipeRight={handleComplete}
  onSwipeLeft={handleMoveToLater}
  rightLabel="✓ Done"
  leftLabel="Later →"
  rightColor="var(--rest)"
  leftColor="var(--accent)"
  disabled={false}
>
  <TaskCard task={task} />
</SwipeableWrapper>
```

**Features:**
- Touch-only (auto-disabled on desktop)
- Right swipe: complete action
- Left swipe: move action
- Rubber-band effect with max swipe distance
- Prevents accidental triggers on interactive elements
- Distinguishes horizontal vs vertical swipes

---

### 7. TaskContextMenu.jsx
**Purpose:** Context menu for task actions (long-press on mobile, right-click on desktop).

**Usage:**
```jsx
import { TaskContextMenu } from './components/shared';

<TaskContextMenu
  task={selectedTask}
  position={{ x: menuX, y: menuY }}
  onClose={handleCloseMenu}
  onEdit={handleEdit}
  onToggle={handleToggle}
  onMove={handleMove}
  onDelete={handleDelete}
  currentList="today"
/>
```

**Features:**
- Two-level navigation (main → move submenu)
- Automatic viewport positioning
- Backdrop overlay for mobile
- Closes on outside click or scroll
- Filters move options based on current list

---

## Import Methods

### Individual imports:
```jsx
import Toast from './components/shared/Toast';
import UndoToast from './components/shared/UndoToast';
```

### Named imports from index:
```jsx
import { Toast, UndoToast, DotPattern } from './components/shared';
```

## Dependencies

All components require:
- React (useState, useEffect, useRef hooks)
- ReactDOM (for portal-based components)
- Icons component (Icons.jsx in this directory)

## Notes

- All portal-based components (CustomSelect, CategoryPortalMenu, TaskContextMenu) use `document.body` as the portal target
- Event listeners are properly cleaned up in useEffect return statements
- Components preserve all original functionality including edge cases and accessibility features
- Positioning calculations account for viewport boundaries to prevent clipping
