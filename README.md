# Selah Rhythm - Modular React Application

**Version**: 0.9.45
**Original File**: 17,331 lines of HTML/CSS/JS
**Status**: 🚧 In Progress - Being split into modular components

## What is This?

This is a modular React + Vite version of Selah Rhythm, a contemplative productivity planner that helps you:
- **Order** your day with tasks, habits, and anchors
- **Focus** with a Pomodoro-style timer
- **Rest** with scripture, prayer, and reflection

## Project Structure

The monolithic 17,331-line HTML file is being split into:
- **60+ React components** organized by feature
- **Modular CSS** with design tokens
- **Utility functions** and constants in separate files
- **Custom hooks** for reusable logic

See [SPLITTING_PLAN.md](./SPLITTING_PLAN.md) for the complete component map and implementation plan.

## Getting Started

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

## Current Status

### ✅ Complete
- Vite React project scaffolding
- Directory structure created
- Package.json configured
- Splitting plan documented

### 🚧 In Progress
- Extracting CSS into modular files
- Extracting constants and utilities
- Extracting icon components

### 📋 To Do
- Extract all 60+ React components
- Set up state management
- Create custom hooks
- Test all features
- Ensure mobile responsiveness
- Verify localStorage persistence

## Key Features

- 📱 **Mobile-first responsive design** with bottom tab bar
- 🎨 **Dark mode support** with warm, thoughtful color palette
- 💾 **localStorage persistence** for all data
- ⌨️ **Keyboard shortcuts** for power users
- 👆 **Touch gestures** (swipe to complete/move tasks)
- 🎯 **Drag-and-drop** task reordering and scheduling
- ⏱️ **Pomodoro timer** with task linking
- 📖 **Daily scripture** with 7 rotating categories
- 🙏 **Prayer & gratitude journal** with streak tracking
- ✅ **Habit tracker** with visual streaks
- 📅 **Daily schedule** with drag-to-create events

## Design System

### Colors
- **Terracotta** (#C4704B): Primary actions, scripture
- **Plum** (#6B4A6B): Timer, focus mode
- **Sage** (#7A9A7E): Habits, completion states
- **Ochre** (#C9A227): Gratitude, highlights
- **Warm neutrals**: Background and text

### Typography
- **Display**: Cormorant Garamond (serif) for scripture/quotes
- **Body**: DM Sans (sans-serif) for UI and content

### Philosophy
Apple-inspired • Calm • Contemplative • System-first

## Original vs Modular

### Before
```
selah-rhythm-v0_9_45.html (17,331 lines)
├── CSS (10,081 lines)
├── HTML structure (31 lines)
└── React code (7,219 lines)
```

### After
```
selah-rhythm-modular/
├── 60+ component files
├── Modular CSS with design tokens
├── Separate utils, constants, hooks
└── Modern build system (Vite)
```

## Benefits of Modular Structure

1. **Maintainability**: Easy to find and update specific features
2. **Reusability**: Components can be reused across views
3. **Collaboration**: Multiple developers can work on different files
4. **Testing**: Individual components can be tested in isolation
5. **Performance**: Tree-shaking removes unused code
6. **Hot Reload**: Vite's instant HMR for fast development

## Tech Stack

- **React 19.2** - UI library
- **Vite 7.2** - Build tool & dev server
- **CSS Variables** - Theming system
- **localStorage** - Data persistence
- **No additional dependencies** - Lightweight and fast

## Documentation

- [SPLITTING_PLAN.md](./SPLITTING_PLAN.md) - Complete extraction plan with line numbers
- Component docs (coming soon)

## Next Steps

Choose how you'd like to proceed:
1. **Automated extraction**: Extract all components automatically
2. **Step-by-step**: Walk through each phase together
3. **Partial split**: Extract only specific components you want to modify
4. **Review & customize**: Modify the plan before executing
