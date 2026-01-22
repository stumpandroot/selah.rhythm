/**
 * PrayerGratitudeCard Component
 *
 * Combined prayer list and gratitude journal for the Rest tab.
 *
 * Features:
 * - Toggle between Prayer and Gratitude modes
 * - Prayer statuses: Active, Answered, Releasing
 * - Prayer categories: Personal, Family, Work, Others
 * - Gratitude entries with streak tracking
 * - localStorage persistence (handled by parent)
 *
 * Props:
 * @param {Array} prayers - Array of prayer objects with { id, text, category, status, createdAt, answeredAt, gratitudeNote }
 * @param {Function} setPrayers - Function to update prayers state
 * @param {Array} gratitudeEntries - Array of gratitude objects with { id, text, createdAt }
 * @param {Function} setGratitudeEntries - Function to update gratitude entries state
 * @param {Function} onHelpClick - Callback for help icon clicks
 */

import React, { useState, useEffect, useRef } from 'react';
import DotPattern from '../shared/DotPattern';
import HelpIcon from '../shared/HelpIcon';

const PrayerGratitudeCard = ({ prayers, setPrayers, gratitudeEntries, setGratitudeEntries, onHelpClick }) => {
  const [mode, setMode] = useState('prayer'); // 'prayer' or 'gratitude'
  const [prayerTab, setPrayerTab] = useState('active'); // 'active', 'answered', 'releasing'
  const [inputText, setInputText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('personal');
  const [editingGratitudeId, setEditingGratitudeId] = useState(null);
  const [gratitudeNoteInputs, setGratitudeNoteInputs] = useState({});
  const [menuOpenId, setMenuOpenId] = useState(null);
  const menuRef = useRef(null);

  const CATEGORIES = ['personal', 'family', 'work', 'others'];

  // Close menu on outside click
  useEffect(() => {
    if (!menuOpenId) return;
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpenId(null);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [menuOpenId]);

  // Calculate streak
  const calculateStreak = () => {
    if (!gratitudeEntries || gratitudeEntries.length === 0) return 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Group entries by date
    const entriesByDate = {};
    gratitudeEntries.forEach(e => {
      const d = new Date(e.createdAt);
      d.setHours(0, 0, 0, 0);
      const key = d.toISOString().split('T')[0];
      entriesByDate[key] = true;
    });

    let streak = 0;
    let checkDate = new Date(today);

    while (true) {
      const key = checkDate.toISOString().split('T')[0];
      if (entriesByDate[key]) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  };

  const streak = calculateStreak();

  // Get today's date string
  const getTodayStr = () => {
    const d = new Date();
    return d.toISOString().split('T')[0];
  };

  // Get prayers by status
  const activePrayers = prayers.filter(p => p.status === 'active');
  const answeredPrayers = prayers.filter(p => p.status === 'answered');
  const releasingPrayers = prayers.filter(p => p.status === 'releasing');

  // Get today's gratitude entries
  const todayStr = getTodayStr();
  const todayGratitude = gratitudeEntries.filter(e => e.createdAt && e.createdAt.startsWith(todayStr));

  // Add prayer
  const handleAddPrayer = () => {
    if (!inputText.trim()) return;
    const newPrayer = {
      id: Date.now().toString(),
      text: inputText.trim(),
      category: selectedCategory,
      status: 'active',
      createdAt: new Date().toISOString(),
      answeredAt: null,
      gratitudeNote: ''
    };
    setPrayers([newPrayer, ...prayers]);
    setInputText('');
  };

  // Add gratitude
  const handleAddGratitude = () => {
    if (!inputText.trim()) return;
    const newEntry = {
      id: Date.now().toString(),
      text: inputText.trim(),
      createdAt: new Date().toISOString()
    };
    setGratitudeEntries([newEntry, ...gratitudeEntries]);
    setInputText('');
  };

  // Handle key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (mode === 'prayer') {
        handleAddPrayer();
      } else {
        handleAddGratitude();
      }
    }
  };

  // Mark prayer as answered
  const markAnswered = (id) => {
    setPrayers(prayers.map(p =>
      p.id === id
        ? { ...p, status: 'answered', answeredAt: new Date().toISOString() }
        : p
    ));
    setMenuOpenId(null);
    setEditingGratitudeId(id);
  };

  // Mark prayer as releasing
  const markReleasing = (id) => {
    setPrayers(prayers.map(p =>
      p.id === id
        ? { ...p, status: 'releasing' }
        : p
    ));
    setMenuOpenId(null);
  };

  // Move back to active
  const markActive = (id) => {
    setPrayers(prayers.map(p =>
      p.id === id
        ? { ...p, status: 'active', answeredAt: null }
        : p
    ));
    setMenuOpenId(null);
  };

  // Delete prayer
  const deletePrayer = (id) => {
    setPrayers(prayers.filter(p => p.id !== id));
    setMenuOpenId(null);
  };

  // Delete gratitude
  const deleteGratitude = (id) => {
    setGratitudeEntries(gratitudeEntries.filter(e => e.id !== id));
  };

  // Save gratitude note for answered prayer
  const saveGratitudeNote = (id) => {
    const note = gratitudeNoteInputs[id] || '';
    setPrayers(prayers.map(p =>
      p.id === id
        ? { ...p, gratitudeNote: note }
        : p
    ));
    setEditingGratitudeId(null);
    setGratitudeNoteInputs(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  // Format date
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now - d) / (1000 * 60 * 60 * 24));

    if (diff === 0) return 'Today';
    if (diff === 1) return 'Yesterday';
    if (diff < 7) return `${diff} days ago`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Get filtered prayers based on tab
  const getFilteredPrayers = () => {
    switch (prayerTab) {
      case 'answered': return answeredPrayers;
      case 'releasing': return releasingPrayers;
      default: return activePrayers;
    }
  };

  return (
    <div className="card prayer-gratitude-card has-dots">
      <DotPattern visible={true} animated={true} />
      <div className="card-header">
        <div className="card-icon-group">
          <div className="card-icon-primary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <div className="card-icon-secondary">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </div>
        </div>
        <div className="card-header-text">
          <div className="card-title">Prayer & Gratitude</div>
          <div className="card-subtitle">Where faith meets thankfulness</div>
        </div>
        <HelpIcon id="prayer-gratitude" onHelpClick={onHelpClick} />
      </div>

      <div className="pg-content">
        {/* Mode Toggle */}
        <div className="pg-mode-toggle">
          <button
            className={`pg-mode-btn${mode === 'prayer' ? ' active prayer' : ''}`}
            onClick={() => setMode('prayer')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 19c-4-2.5-7-5.5-7-9a5 5 0 0 1 10 0c0 3.5-3 6.5-7 9z"/>
            </svg>
            Prayers
          </button>
          <button
            className={`pg-mode-btn${mode === 'gratitude' ? ' active gratitude' : ''}`}
            onClick={() => setMode('gratitude')}
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            Gratitude
            {streak > 0 && <span className="pg-streak">✦ {streak}</span>}
          </button>
        </div>

        {/* Quick Entry */}
        <div className="pg-quick-entry">
          <input
            type="text"
            className={`pg-input${mode === 'gratitude' ? ' gratitude-mode' : ''}`}
            placeholder={mode === 'prayer' ? "What's on your heart?" : "What are you thankful for?"}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button
            className={`pg-add-btn${mode === 'gratitude' ? ' gratitude-mode' : ''}`}
            onClick={mode === 'prayer' ? handleAddPrayer : handleAddGratitude}
          >
            Add
          </button>
        </div>

        {/* Category selector for prayer mode */}
        {mode === 'prayer' && inputText && (
          <div className="pg-category-selector">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`pg-category-btn ${cat}${selectedCategory === cat ? ' active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        )}

        {/* PRAYER MODE */}
        {mode === 'prayer' && (
          <>
            {/* Tabs */}
            <div className="pg-tabs">
              <button
                className={`pg-tab${prayerTab === 'active' ? ' active' : ''}`}
                onClick={() => setPrayerTab('active')}
              >
                Active
                <span className="pg-tab-count">{activePrayers.length}</span>
              </button>
              <button
                className={`pg-tab${prayerTab === 'answered' ? ' active' : ''}`}
                onClick={() => setPrayerTab('answered')}
              >
                Answered
                <span className="pg-tab-count">{answeredPrayers.length}</span>
              </button>
              <button
                className={`pg-tab${prayerTab === 'releasing' ? ' active' : ''}`}
                onClick={() => setPrayerTab('releasing')}
              >
                Releasing
                <span className="pg-tab-count">{releasingPrayers.length}</span>
              </button>
            </div>

            {/* Prayer List */}
            <div className="pg-list">
              {getFilteredPrayers().length === 0 ? (
                <div className="pg-empty">
                  <div className="pg-empty-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 19c-4-2.5-7-5.5-7-9a5 5 0 0 1 10 0c0 3.5-3 6.5-7 9z"/>
                      <path d="M12 19c4-2.5 7-5.5 7-9a5 5 0 0 0-10 0"/>
                    </svg>
                  </div>
                  <div className="pg-empty-title">
                    {prayerTab === 'active' && 'No active prayers'}
                    {prayerTab === 'answered' && 'No answered prayers yet'}
                    {prayerTab === 'releasing' && 'Nothing releasing'}
                  </div>
                  <div className="pg-empty-text">
                    {prayerTab === 'active' && 'Cast your cares on Him'}
                    {prayerTab === 'answered' && 'Your answered prayers appear here'}
                    {prayerTab === 'releasing' && 'Prayers you\'re letting go'}
                  </div>
                </div>
              ) : (
                getFilteredPrayers().map(prayer => (
                  <div key={prayer.id} className={`pg-item ${prayer.status}`}>
                    <div className="pg-item-header">
                      <div
                        className={`pg-checkbox${prayer.status === 'answered' ? ' checked' : ''}${prayer.status === 'releasing' ? ' releasing' : ''}`}
                        onClick={() => {
                          if (prayer.status === 'active') markAnswered(prayer.id);
                          else markActive(prayer.id);
                        }}
                      >
                        {(prayer.status === 'answered' || prayer.status === 'releasing') && (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <path d="M5 12l5 5L19 7"/>
                          </svg>
                        )}
                      </div>
                      <div className="pg-item-text">{prayer.text}</div>
                      <div className="pg-item-actions" style={{ position: 'relative' }}>
                        <button
                          className="pg-item-action"
                          onClick={() => setMenuOpenId(menuOpenId === prayer.id ? null : prayer.id)}
                        >
                          <svg viewBox="0 0 24 24" fill="currentColor">
                            <circle cx="12" cy="6" r="2"/>
                            <circle cx="12" cy="12" r="2"/>
                            <circle cx="12" cy="18" r="2"/>
                          </svg>
                        </button>
                        {menuOpenId === prayer.id && (
                          <div className="pg-action-menu" ref={menuRef}>
                            {prayer.status === 'active' && (
                              <>
                                <button className="pg-action-menu-item answered" onClick={() => markAnswered(prayer.id)}>
                                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12l5 5L19 7"/></svg>
                                  Mark Answered
                                </button>
                                <button className="pg-action-menu-item releasing" onClick={() => markReleasing(prayer.id)}>
                                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                                  Release
                                </button>
                              </>
                            )}
                            {prayer.status !== 'active' && (
                              <button className="pg-action-menu-item" onClick={() => markActive(prayer.id)}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                                Move to Active
                              </button>
                            )}
                            <button className="pg-action-menu-item delete" onClick={() => deletePrayer(prayer.id)}>
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="pg-item-meta">
                      <div className="pg-item-date">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="4" width="18" height="18" rx="2"/>
                          <line x1="16" y1="2" x2="16" y2="6"/>
                          <line x1="8" y1="2" x2="8" y2="6"/>
                          <line x1="3" y1="10" x2="21" y2="10"/>
                        </svg>
                        {prayer.status === 'answered' && prayer.answeredAt
                          ? `Answered ${formatDate(prayer.answeredAt)}`
                          : formatDate(prayer.createdAt)
                        }
                      </div>
                      <span className={`pg-category ${prayer.category}`}>
                        {prayer.category}
                      </span>
                      {prayer.status === 'answered' && (
                        <span className="pg-answered-badge">
                          <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2L9 9H2l6 4.5L5.5 22 12 17l6.5 5-2.5-8.5L22 9h-7L12 2z"/>
                          </svg>
                          Answered
                        </span>
                      )}
                    </div>

                    {/* Gratitude note for answered prayers */}
                    {prayer.status === 'answered' && (
                      editingGratitudeId === prayer.id ? (
                        <div className="pg-gratitude-note">
                          <div className="pg-gratitude-note-label">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                            </svg>
                            Add a note of gratitude
                          </div>
                          <input
                            type="text"
                            className="pg-gratitude-note-input"
                            placeholder="Thank you for..."
                            value={gratitudeNoteInputs[prayer.id] || ''}
                            onChange={(e) => setGratitudeNoteInputs(prev => ({ ...prev, [prayer.id]: e.target.value }))}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') saveGratitudeNote(prayer.id);
                            }}
                            onBlur={() => saveGratitudeNote(prayer.id)}
                            autoFocus
                          />
                        </div>
                      ) : prayer.gratitudeNote ? (
                        <div className="pg-gratitude-note" onClick={() => setEditingGratitudeId(prayer.id)} style={{ cursor: 'pointer' }}>
                          <div className="pg-gratitude-note-label">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                            </svg>
                            Gratitude
                          </div>
                          <div className="pg-gratitude-note-text">"{prayer.gratitudeNote}"</div>
                        </div>
                      ) : (
                        <div
                          className="pg-gratitude-note"
                          style={{ cursor: 'pointer', opacity: 0.6 }}
                          onClick={() => setEditingGratitudeId(prayer.id)}
                        >
                          <div className="pg-gratitude-note-label">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                            </svg>
                            Add a note of gratitude...
                          </div>
                        </div>
                      )
                    )}
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {/* GRATITUDE MODE */}
        {mode === 'gratitude' && (
          <>
            <div className="pg-section-header">
              <div className="pg-section-title gratitude">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
                Today's Gratitude
              </div>
              {streak > 0 && (
                <span className="pg-streak">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L9 9H2l6 4.5L5.5 22 12 17l6.5 5-2.5-8.5L22 9h-7L12 2z"/>
                  </svg>
                  {streak} day streak
                </span>
              )}
            </div>

            <div className="pg-list">
              {todayGratitude.length === 0 ? (
                <div className="pg-empty">
                  <div className="pg-empty-icon gratitude">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                  </div>
                  <div className="pg-empty-title">What are you thankful for?</div>
                  <div className="pg-empty-text">Start your gratitude practice today</div>
                </div>
              ) : (
                todayGratitude.map(entry => (
                  <div key={entry.id} className="pg-gratitude-item">
                    <div className="pg-gratitude-bullet"></div>
                    <div className="pg-gratitude-text">{entry.text}</div>
                    <button
                      className="pg-gratitude-remove"
                      onClick={() => deleteGratitude(entry.id)}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                    </button>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PrayerGratitudeCard;
