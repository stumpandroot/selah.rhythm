/**
 * SettingsModal Component
 *
 * Comprehensive settings panel for the application.
 *
 * Features:
 * - Theme toggle (light/dark)
 * - Animation preferences
 * - Timer duration settings
 * - Personalization (first name)
 * - Task categories customization
 * - History/archive management
 * - Version history/changelog display
 * - Daily reset functionality
 *
 * Props:
 * @param {boolean} show - Whether the modal is visible
 * @param {Function} onClose - Callback to close the modal
 * @param {Object} settings - Settings object with theme, animationsOn, timerOn, etc.
 * @param {Function} setSettings - Function to update settings state
 * @param {Object} profile - Profile object with firstName
 * @param {Function} setProfile - Function to update profile state
 * @param {Array} completed - Array of completed tasks
 * @param {Function} clearCompleted - Function to clear completed tasks
 * @param {boolean} scrollToVersion - Whether to scroll to version history on open
 * @param {Function} onManualReset - Callback for manual daily reset
 * @param {Array} taskCategories - Array of task category objects
 * @param {Function} setTaskCategories - Function to update task categories
 */

import React, { useState, useEffect, useRef } from 'react';
import * as Icons from '../shared/Icons';
import { VERSION_HISTORY } from '../../data/constants';
import { groupByDate, genId, save } from '../../utils/helpers';

const SettingsModal = ({
  show,
  onClose,
  settings,
  setSettings,
  profile,
  setProfile,
  completed,
  clearCompleted,
  scrollToVersion,
  onManualReset,
  taskCategories,
  setTaskCategories
}) => {
  const [showArchive, setShowArchive] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [showPastVersions, setShowPastVersions] = useState(false);
  const [nameSaved, setNameSaved] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const [showCatSettings, setShowCatSettings] = useState(false);
  const nameDebounceRef = useRef(null);
  const versionHistoryRef = useRef(null);
  const grouped = groupByDate(completed);
  const dates = Object.keys(grouped);

  const updateCategory = (id, field, value) => {
    setTaskCategories(prev => prev.map(c =>
      c.id === id ? {...c, [field]: value} : c
    ));
  };

  const deleteCategory = (id) => {
    if (id === 'none') return;
    setTaskCategories(prev => prev.filter(c => c.id !== id));
  };

  const addCategory = () => {
    const newId = 'cat_' + genId();
    setTaskCategories(prev => [...prev, {
      id: newId,
      n: 'New Category',
      color: '#6b7280'
    }]);
  };

  // Keep mounted during animation transitions
  useEffect(() => {
    if (show) {
      setShouldRender(true);
      // Delay adding .show class to trigger CSS transition
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setAnimateIn(true);
        });
      });
    } else {
      setAnimateIn(false);
      // Delay unmount until animation completes
      const timer = setTimeout(() => setShouldRender(false), 250);
      return () => clearTimeout(timer);
    }
  }, [show]);

  // Get preview message
  const getPreviewMessage = () => {
    if (!profile?.firstName || !profile.firstName.trim()) return null;
    const sampleMsg = "keep going. You're doing great.";
    return `${profile.firstName}, ${sampleMsg}`;
  };

  // Scroll to version history when triggered
  useEffect(() => {
    if (show && scrollToVersion && versionHistoryRef.current) {
      setTimeout(() => {
        setShowVersionHistory(true);
        versionHistoryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 200);
    }
  }, [show, scrollToVersion]);

  if (!shouldRender) return null;

  const currentVersion = VERSION_HISTORY[0];
  const pastVersions = VERSION_HISTORY.slice(1);

  return (
    <>
      <div className={`settings-overlay${animateIn ? " show" : ""}`} onClick={onClose} />
      <div className={`settings-modal${animateIn ? " show" : ""}`}>
        <div className="settings-header">
          <h2><Icons.Settings /> Settings</h2>
          <button className="settings-close" onClick={onClose}><Icons.X /></button>
        </div>
        <div className="settings-content">
          <div className="settings-philosophy">
            <div className="settings-philosophy-title"><Icons.Book /> The Selah Way</div>
            <div className="settings-philosophy-text">Selah Rhythm helps you slow down, focus on what matters most, and end your day with reflection instead of exhaustion. Use Order to plan, Focus to work, and Rest to reflect.</div>
          </div>

          <div className="settings-section">
            <div className="settings-section-title">Appearance</div>
            <div className="settings-row">
              <div><div className="settings-label">Dark mode</div><div className="settings-desc">Switch between light and dark</div></div>
              <div className={`setting-switch${settings.theme === "dark" ? " on" : ""}`} onClick={() => setSettings(s => ({...s, theme: s.theme === "dark" ? "light" : "dark"}))} />
            </div>
            <div className="settings-row">
              <div><div className="settings-label">Animations</div><div className="settings-desc">Enable subtle motion effects</div></div>
              <div className={`setting-switch${settings.animationsOn ? " on" : ""}`} onClick={() => setSettings(s => ({...s, animationsOn: !s.animationsOn}))} />
            </div>
            <div className="settings-row">
              <div><div className="settings-label">Progress indicator</div><div className="settings-desc">Show task completion count in nav bar</div></div>
              <div className={`setting-switch${settings.showProgress !== false ? " on" : ""}`} onClick={() => setSettings(s => ({...s, showProgress: s.showProgress === false ? true : false}))} />
            </div>
          </div>

          <div className="settings-section">
            <div className="settings-section-title">Focus</div>
            <div className="settings-row">
              <div><div className="settings-label">Focus timer</div><div className="settings-desc">Show timer in Focus mode</div></div>
              <div className={`setting-switch${settings.timerOn ? " on" : ""}`} onClick={() => setSettings(s => ({...s, timerOn: !s.timerOn}))} />
            </div>
            <div className="settings-row">
              <div><div className="settings-label">Show time-to-complete</div><div className="settings-desc">Display focus time on completed tasks</div></div>
              <div className={`setting-switch${settings.showTimeToComplete ? " on" : ""}`} onClick={() => setSettings(s => ({...s, showTimeToComplete: !s.showTimeToComplete}))} />
            </div>
          </div>

          <div className="settings-section">
            <div className="settings-section-title">Personalization</div>
            <div className="settings-row" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px'}}>
              <div style={{flex: 1, minWidth: 0}}>
                <div className="settings-label">First name</div>
                <div className="settings-desc">Used in supportive messages</div>
              </div>
              <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px', flexShrink: 0}}>
                <input
                  type="text"
                  className="settings-input"
                  placeholder="Your name"
                  value={profile?.firstName || ""}
                  onBlur={e => {
                    // On blur, immediately save and show confirmation
                    if (nameDebounceRef.current) clearTimeout(nameDebounceRef.current);
                    const newProfile = {...profile, firstName: e.target.value};
                    save("profile", newProfile);
                    setNameSaved(true);
                    setTimeout(() => setNameSaved(false), 1250);
                  }}
                  onChange={e => {
                    // Update state immediately for responsive typing
                    const newProfile = {...profile, firstName: e.target.value};
                    setProfile(newProfile);
                    // Clear any pending debounce - don't save or show indicator while typing
                    if (nameDebounceRef.current) clearTimeout(nameDebounceRef.current);
                    // Debounce the save - only save after user stops typing
                    nameDebounceRef.current = setTimeout(() => {
                      save("profile", newProfile);
                      // Don't show "Saved" during typing - only on blur
                    }, 350);
                  }}
                />
                {nameSaved && (
                  <div className="saved-indicator">
                    <Icons.Check />
                    <span>Saved</span>
                  </div>
                )}
              </div>
            </div>
            {getPreviewMessage() && (
              <div style={{marginTop: '12px', padding: '8px 12px', background: 'var(--toggle-bg)', borderRadius: '6px', fontSize: '11px', color: 'var(--text-muted)'}}>
                <div style={{fontWeight: 600, marginBottom: '4px'}}>Preview:</div>
                <div style={{fontStyle: 'italic', color: 'var(--text)'}}>"{getPreviewMessage()}"</div>
              </div>
            )}
          </div>

          <div className="settings-section">
            <div
              className="settings-section-title collapsible"
              onClick={() => setShowCatSettings(!showCatSettings)}
              style={{cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}
            >
              <span style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                Task Categories
                <span style={{
                  fontSize: '10px',
                  color: 'var(--text-muted)',
                  background: 'var(--toggle-bg)',
                  padding: '2px 6px',
                  borderRadius: '4px'
                }}>
                  {taskCategories.filter(c => c.id !== 'none').length}
                </span>
              </span>
              <span style={{
                transform: showCatSettings ? 'rotate(90deg)' : '',
                transition: 'transform 0.2s',
                color: 'var(--text-muted)'
              }}>
                <Icons.ChevronRight />
              </span>
            </div>

            <div className={`card-drawer${showCatSettings ? ' expanded' : ''}`}>
              {taskCategories.filter(c => c.id !== 'none').map((cat, idx) => (
                <div key={cat.id} className="category-edit-row">
                  <input
                    type="color"
                    value={cat.color || '#6b7280'}
                    onChange={e => updateCategory(cat.id, 'color', e.target.value)}
                    className="category-color-picker"
                  />
                  <input
                    type="text"
                    value={cat.n}
                    onChange={e => updateCategory(cat.id, 'n', e.target.value)}
                    className="category-name-input"
                    placeholder="Category name"
                  />
                  <button
                    className="category-delete-btn"
                    onClick={() => deleteCategory(cat.id)}
                  >
                    <Icons.X />
                  </button>
                </div>
              ))}
              <button className="category-add-btn" onClick={addCategory}>
                <Icons.Plus /> Add Category
              </button>
            </div>
          </div>


          <div className="settings-section">
            <div className="settings-section-title">Rest</div>
            <div className="settings-row">
              <div><div className="settings-label">Celebrations</div><div className="settings-desc">Show celebration on task complete</div></div>
              <div className={`setting-switch${settings.celebOn ? " on" : ""}`} onClick={() => setSettings(s => ({...s, celebOn: !s.celebOn}))} />
            </div>
          </div>

          <div className="settings-section">
            <div className="settings-section-title">Daily Reset</div>
            <div className="settings-row">
              <div style={{flex: 1}}>
                <div className="settings-label">Reset today</div>
                <div className="settings-desc">Manually reset habits and reflection for today</div>
              </div>
              <button
                onClick={onManualReset}
                style={{
                  padding: '6px 12px',
                  border: '1px solid var(--border-strong)',
                  borderRadius: '6px',
                  fontSize: '11px',
                  background: 'transparent',
                  color: 'var(--text-muted)',
                  cursor: 'pointer'
                }}
              >Reset Today</button>
            </div>
          </div>

          <div className="settings-section">
            <div className="settings-section-title">Weekly Rhythm</div>
            <div className="settings-row">
              <div style={{flex: 1}}>
                <div className="settings-label">Weekly reflection</div>
                <div className="settings-desc">Prompt for end-of-week reflection (Sunday evening)</div>
              </div>
              <div
                className={`setting-switch${settings.weeklyReflection ? " on" : ""}`}
                onClick={() => setSettings(s => ({...s, weeklyReflection: !s.weeklyReflection}))}
              />
            </div>
          </div>

          <div className="archive-section">
            <div className="archive-toggle" onClick={() => setShowArchive(!showArchive)}>
              <div className="archive-toggle-text"><Icons.Archive /> Completed Tasks</div>
              <div style={{display: "flex", alignItems: "center", gap: "8px"}}>
                <span className="archive-count">{completed.length}</span>
                <span style={{color: "var(--text-muted)", transform: showArchive ? "rotate(90deg)" : "", transition: "transform 0.2s"}}><Icons.ChevronRight /></span>
              </div>
            </div>
            {showArchive && (
              <div className="archive-list">
                {dates.length === 0 && <div className="empty-state">No completed tasks yet</div>}
                {dates.map(date => (
                  <div key={date} className="archive-day">
                    <div className="archive-day-label">{date}</div>
                    {grouped[date].map(t => (
                      <div key={t.id} className="archive-item">
                        <Icons.Check />
                        <span>{t.text}</span>
                        {settings.showTimeToComplete && t.totalFocusMinutes > 0 && (
                          <span className="archive-item-time">{t.totalFocusMinutes}m</span>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
                {completed.length > 0 && <button style={{marginTop: "12px", padding: "8px 12px", border: "1px solid var(--border-strong)", background: "transparent", color: "var(--text-muted)", fontSize: "11px", borderRadius: "6px", cursor: "pointer", width: "100%"}} onClick={clearCompleted}>Clear all completed</button>}
              </div>
            )}
          </div>

          {/* Version History Section */}
          <div className="version-history-section" ref={versionHistoryRef}>
            <div className="version-history-toggle" onClick={() => setShowVersionHistory(!showVersionHistory)}>
              <div className="version-history-toggle-text"><Icons.Sparkles /> What's New</div>
              <div style={{display: "flex", alignItems: "center", gap: "8px"}}>
                <span className="version-current">{currentVersion.version}</span>
                <span style={{color: "var(--text-muted)", transform: showVersionHistory ? "rotate(90deg)" : "", transition: "transform 0.2s"}}><Icons.ChevronRight /></span>
              </div>
            </div>
            <div className={`version-history-content card-drawer${showVersionHistory ? ' expanded' : ''}`}>
              <div className="version-history-latest">
                <div className="version-history-label">Latest changes ({currentVersion.date})</div>
                <ul className="version-history-list">
                  {currentVersion.changes.map((change, i) => (
                    <li key={i}>{change}</li>
                  ))}
                </ul>
              </div>

              <button
                className={`version-history-expand${showPastVersions ? ' expanded' : ''}`}
                onClick={() => setShowPastVersions(!showPastVersions)}
              >
                <Icons.ChevronRight /> View full history
              </button>

              <div className={`version-history-past card-drawer${showPastVersions ? ' expanded' : ''}`}>
                {pastVersions.map((v, idx) => (
                  <div key={idx} className="version-history-past-item">
                    <div className="version-history-past-version">{v.version} — {v.date}</div>
                    <ul className="version-history-list">
                      {v.changes.map((change, i) => (
                        <li key={i}>{change}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsModal;
