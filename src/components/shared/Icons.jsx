/**
 * SELAH RHYTHM - Icon Components
 * SVG icon library for card headers and UI elements
 * Card header icons render WHITE on colored backgrounds
 */

import React from 'react';

// === CARD HEADER ICONS (white fill, designed for colored backgrounds) ===

// Today's Tasks - White circle with checkmark
export const CircleCheckSolid = () => (
  <svg viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" fill="white"/>
    <path d="M8 12l3 3 5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
  </svg>
);

// This Week - White calendar with date squares
export const CalendarSolid = () => (
  <svg viewBox="0 0 24 24" fill="none">
    <rect x="3" y="4" width="18" height="18" rx="3" fill="white"/>
    <rect x="7" y="11" width="3" height="3" rx="0.5" fill="currentColor"/>
    <rect x="14" y="11" width="3" height="3" rx="0.5" fill="currentColor"/>
    <rect x="7" y="16" width="3" height="3" rx="0.5" fill="currentColor"/>
  </svg>
);

// To Explore / Later - White solid star
export const StarSolid = () => (
  <svg viewBox="0 0 24 24" fill="none">
    <path d="M12 2L9 9H2l6 4.5L5.5 22 12 17l6.5 5-2.5-8.5L22 9h-7L12 2z" fill="white"/>
  </svg>
);

// Habits - White solid heart
export const HeartSolid = () => (
  <svg viewBox="0 0 24 24" fill="none">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="white"/>
  </svg>
);

// Anchors - White anchor shape
export const AnchorSolid = () => (
  <svg viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="5" r="2.5" fill="white"/>
    <rect x="11" y="7" width="2" height="11" fill="white"/>
    <path d="M5 13h3c0 2.2 1.8 4 4 4s4-1.8 4-4h3" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
    <rect x="9" y="9" width="6" height="2" rx="1" fill="white"/>
  </svg>
);

// Focus Timer - White stopwatch
export const TimerSolid = () => (
  <svg viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="13" r="9" fill="white"/>
    <path d="M12 9v4l2.5 2.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
    <rect x="10" y="2" width="4" height="3" rx="1" fill="white"/>
  </svg>
);

// Daily Wisdom - White open book
export const BookSolid = () => (
  <svg viewBox="0 0 24 24" fill="none">
    <path d="M2 4h7c1.1 0 2 .9 2 2v13c0-.55-.45-1-1-1H2V4z" fill="white"/>
    <path d="M22 4h-7c-1.1 0-2 .9-2 2v13c0-.55.45-1 1-1h8V4z" fill="white"/>
    <path d="M11 6v13M13 6v13" stroke="currentColor" strokeWidth="1" fill="none"/>
  </svg>
);

// Daily Reflection - White sunrise icon
export const SunriseSolid = () => (
  <svg viewBox="0 0 24 24" fill="none">
    <path d="M12 8c-2.2 0-4 1.8-4 4h8c0-2.2-1.8-4-4-4z" fill="white"/>
    <rect x="11" y="2" width="2" height="4" fill="white"/>
    <rect x="18" y="11" width="4" height="2" fill="white"/>
    <rect x="2" y="11" width="4" height="2" fill="white"/>
    <path d="M5.64 5.64l2.83 2.83" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    <path d="M15.54 8.46l2.83-2.83" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    <rect x="2" y="17" width="20" height="2" fill="white"/>
  </svg>
);

// === BACKWARDS COMPATIBLE ALIASES ===
export const CircleCheck = CircleCheckSolid;
export const CalendarFilled = CalendarSolid;
export const StarFilled = StarSolid;
export const HeartFilled = HeartSolid;
export const AnchorFilled = AnchorSolid;
export const TimerFilled = TimerSolid;
export const BookFilled = BookSolid;
export const ReflectionFilled = SunriseSolid;

// === STANDARD UI ICONS (stroke-based) ===

export const Book = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" opacity="0.15"/>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" opacity="0.15"/>
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" fill="none" stroke="currentColor" strokeWidth="2"/>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" fill="none" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

export const Sun = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="4"/>
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
  </svg>
);

export const Moon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
  </svg>
);

export const Calendar = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <rect width="18" height="18" x="3" y="4" rx="2" opacity="0.15"/>
    <rect width="18" height="18" x="3" y="4" rx="2" fill="none" stroke="currentColor" strokeWidth="2"/>
    <line x1="16" x2="16" y1="2" y2="6" stroke="currentColor" strokeWidth="2"/>
    <line x1="8" x2="8" y1="2" y2="6" stroke="currentColor" strokeWidth="2"/>
    <line x1="3" x2="21" y1="10" y2="10" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

export const Check = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
    <path d="M20 6 9 17l-5-5"/>
  </svg>
);

export const ChevronDown = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="m6 9 6 6 6-6"/>
  </svg>
);

export const ChevronUp = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="m18 15-6-6-6 6"/>
  </svg>
);

export const ChevronRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="m9 18 6-6-6-6"/>
  </svg>
);

export const ChevronLeft = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="m15 18-6-6 6-6"/>
  </svg>
);

export const ArrowRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14"/>
    <path d="m12 5 7 7-7 7"/>
  </svg>
);

export const ArrowDown = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5v14"/>
    <path d="m19 12-7 7-7-7"/>
  </svg>
);

export const Loader = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
  </svg>
);

export const MoreVertical = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="1"/>
    <circle cx="12" cy="5" r="1"/>
    <circle cx="12" cy="19" r="1"/>
  </svg>
);

export const Play = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="5 3 19 12 5 21 5 3"/>
  </svg>
);

export const Pause = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect width="4" height="16" x="6" y="4"/>
    <rect width="4" height="16" x="14" y="4"/>
  </svg>
);

export const Reset = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
    <path d="M3 3v5h5"/>
  </svg>
);

export const Sparkles = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3Z"/>
  </svg>
);

export const Star = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="currentColor">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

export const Clock = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="12" r="10" opacity="0.15"/>
    <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2"/>
    <polyline points="12 6 12 12 16 14" fill="none" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

export const Heart = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
  </svg>
);

export const Target = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <circle cx="12" cy="12" r="6"/>
    <circle cx="12" cy="12" r="2"/>
  </svg>
);

export const Bulb = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" opacity="0.15"/>
    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" fill="none" stroke="currentColor" strokeWidth="2"/>
    <path d="M9 18h6" stroke="currentColor" strokeWidth="2"/>
    <path d="M10 22h4" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

export const Timer = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="10" x2="14" y1="2" y2="2"/>
    <line x1="12" x2="15" y1="14" y2="11"/>
    <circle cx="12" cy="14" r="8"/>
  </svg>
);

export const Eye = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

export const EyeOff = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/>
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/>
    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/>
    <line x1="2" x2="22" y1="2" y2="22"/>
  </svg>
);

export const Trash = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
  </svg>
);

export const X = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 6 6 18M6 6l12 12"/>
  </svg>
);

export const Edit = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
  </svg>
);

export const Move = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3M2 12h20M12 2v20"/>
  </svg>
);

export const Plus = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M5 12h14M12 5v14"/>
  </svg>
);

export const Archive = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <rect width="20" height="5" x="2" y="3" rx="1" opacity="0.15"/>
    <path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" opacity="0.15"/>
    <rect width="20" height="5" x="2" y="3" rx="1" fill="none" stroke="currentColor" strokeWidth="2"/>
    <path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" fill="none" stroke="currentColor" strokeWidth="2"/>
    <path d="M10 12h4" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

export const Sunset = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 10V2M4.93 10.93l1.41 1.41M2 18h2M20 18h2M19.07 10.93l-1.41 1.41M22 22H2M16 6l-4 4-4-4M16 18a4 4 0 0 0-8 0"/>
  </svg>
);

export const Settings = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="3"/>
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
  </svg>
);

export const PauseCircle = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <line x1="10" x2="10" y1="15" y2="9"/>
    <line x1="14" x2="14" y1="15" y2="9"/>
  </svg>
);

export const Link = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
  </svg>
);

export const HelpCircle = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
    <path d="M12 17h.01"/>
  </svg>
);

export const Mail = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect width="20" height="16" x="2" y="4" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);

export const Download = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" x2="12" y1="15" y2="3"/>
  </svg>
);

export const GripVertical = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="9" cy="6" r="1" fill="currentColor"/>
    <circle cx="15" cy="6" r="1" fill="currentColor"/>
    <circle cx="9" cy="12" r="1" fill="currentColor"/>
    <circle cx="15" cy="12" r="1" fill="currentColor"/>
    <circle cx="9" cy="18" r="1" fill="currentColor"/>
    <circle cx="15" cy="18" r="1" fill="currentColor"/>
  </svg>
);

export const Anchor = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="5" r="3"/>
    <line x1="12" x2="12" y1="22" y2="8"/>
    <path d="M5 12H2a10 10 0 0 0 20 0h-3"/>
  </svg>
);

export const Leaf = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 7 0 5.5-4.78 10-10 10Z"/>
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
  </svg>
);

// Legacy default export for backwards compatibility
export default {
  CircleCheckSolid,
  CalendarSolid,
  StarSolid,
  HeartSolid,
  AnchorSolid,
  TimerSolid,
  BookSolid,
  SunriseSolid,
  CircleCheck,
  CalendarFilled,
  StarFilled,
  HeartFilled,
  AnchorFilled,
  TimerFilled,
  BookFilled,
  ReflectionFilled,
  Book,
  Sun,
  Moon,
  Calendar,
  Check,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  ArrowDown,
  Loader,
  MoreVertical,
  Play,
  Pause,
  Reset,
  Sparkles,
  Star,
  Clock,
  Heart,
  Target,
  Bulb,
  Timer,
  Eye,
  EyeOff,
  Trash,
  X,
  Edit,
  Move,
  Plus,
  Archive,
  Sunset,
  Settings,
  PauseCircle,
  Link,
  HelpCircle,
  Mail,
  Download,
  GripVertical,
  Anchor,
  Leaf
};
