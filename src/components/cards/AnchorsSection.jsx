/**
 * AnchorsSection Component
 *
 * Life anchors / core values with add/edit/delete functionality.
 * Collapsible card with weekly reminders.
 *
 * Features:
 * - Collapsible card header with chevron indicator
 * - Add new anchors with inline input
 * - Edit anchors inline with confirm/cancel
 * - Delete anchors
 * - Auto-focus on input fields
 * - Keyboard shortcuts (Enter to save, Escape to cancel)
 * - Empty state messaging
 *
 * Props:
 * @param {Array} anchors - Array of anchor objects [{id, text}]
 * @param {function} onAdd - Callback when adding new anchor (text)
 * @param {function} onEdit - Callback when editing anchor (id, newText)
 * @param {function} onDel - Callback when deleting anchor (id)
 * @param {function} onHelpClick - Help icon click handler
 *
 * State:
 * - expanded: Card drawer open/closed state
 * - editingId: ID of anchor currently being edited
 * - editText: Text value during edit
 * - showAdd: Show/hide add input row
 * - newText: Text value for new anchor
 */

import React, { useState, useRef, useEffect } from 'react';
import * as Icons from '../shared/Icons';

// HelpIcon component
const HelpIcon = ({ id, onHelpClick }) => (
  <button
    type="button"
    className="help-icon-btn"
    aria-label="What is this?"
    onClick={(e) => {
      e.stopPropagation();
      onHelpClick(e, id);
    }}
  >
    <Icons.HelpCircle />
  </button>
);

const AnchorsSection = ({ anchors, onAdd, onEdit, onDel, onHelpClick }) => {
  const [expanded, setExpanded] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [newText, setNewText] = useState("");
  const inputRef = useRef(null);
  const editInputRef = useRef(null);

  // Auto-focus on add input when shown
  useEffect(() => {
    if (showAdd && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [showAdd]);

  // Auto-focus on edit input when editing
  useEffect(() => {
    if (editingId && editInputRef.current) {
      setTimeout(() => editInputRef.current?.focus(), 0);
    }
  }, [editingId]);

  const handleAdd = () => {
    if (newText.trim()) {
      onAdd(newText.trim());
      setNewText("");
      setShowAdd(false);
    }
  };

  const handleEdit = (id, currentText) => {
    setEditingId(id);
    setEditText(currentText);
  };

  const handleSaveEdit = () => {
    if (editText.trim() && editingId) {
      onEdit(editingId, editText.trim());
      setEditingId(null);
      setEditText("");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  const handleKeyDown = (e, isEdit = false) => {
    if (e.key === "Enter") {
      if (isEdit) handleSaveEdit();
      else handleAdd();
    }
    if (e.key === "Escape") {
      if (isEdit) handleCancelEdit();
      else {
        setNewText("");
        setShowAdd(false);
      }
    }
  };

  return (
    <div className="card anchors-card">
      <div
        className="card-header blue"
        onClick={() => setExpanded(!expanded)}
        style={{ cursor: 'pointer' }}
      >
        <h3>
          <span className="card-icon card-icon-terracotta">
            <Icons.AnchorSolid />
          </span>
          Anchors
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <HelpIcon id="anchors" onHelpClick={onHelpClick} />
          {expanded && !showAdd && (
            <button
              className="anchors-add-btn"
              onClick={(e) => {
                e.stopPropagation();
                setShowAdd(true);
              }}
              title="Add anchor"
            >
              <Icons.Plus />
            </button>
          )}
          <span
            style={{
              color: 'var(--text-muted)',
              transform: expanded ? 'rotate(90deg)' : '',
              transition: 'transform 0.2s'
            }}
          >
            <Icons.ChevronRight />
          </span>
        </div>
      </div>

      <div className={`card-content card-drawer${expanded ? ' expanded' : ''}`}>
        {anchors.map(anchor => (
          <div key={anchor.id} className="anchor-item">
            {editingId === anchor.id ? (
              <div className="anchor-edit-row">
                <input
                  ref={editInputRef}
                  className="anchor-edit-input"
                  value={editText}
                  onChange={e => setEditText(e.target.value)}
                  onKeyDown={e => handleKeyDown(e, true)}
                  onBlur={handleSaveEdit}
                />
                <div className="anchor-edit-actions">
                  <button className="anchor-edit-confirm" onClick={handleSaveEdit}>
                    <Icons.Check />
                  </button>
                  <button className="anchor-edit-cancel" onClick={handleCancelEdit}>
                    <Icons.X />
                  </button>
                </div>
              </div>
            ) : (
              <>
                <span className="anchor-bullet">
                  <Icons.Anchor />
                </span>
                <span className="anchor-text">{anchor.text}</span>
                <div className="anchor-actions">
                  <button
                    className="anchor-edit"
                    onClick={() => handleEdit(anchor.id, anchor.text)}
                    title="Edit"
                  >
                    <Icons.Edit />
                  </button>
                  <button
                    className="anchor-delete"
                    onClick={() => onDel(anchor.id)}
                    title="Delete"
                  >
                    <Icons.X />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}

        {showAdd && (
          <div className="anchor-add-row">
            <input
              ref={inputRef}
              className="anchor-add-input"
              placeholder="Add an anchor for this week..."
              value={newText}
              onChange={e => setNewText(e.target.value)}
              onKeyDown={e => handleKeyDown(e, false)}
              onBlur={() => {
                if (!newText.trim()) {
                  setNewText("");
                  setShowAdd(false);
                }
              }}
            />
            <div className="anchor-add-actions">
              <button className="anchor-add-confirm" onClick={handleAdd}>
                <Icons.Check />
              </button>
              <button
                className="anchor-add-cancel"
                onClick={() => {
                  setNewText("");
                  setShowAdd(false);
                }}
              >
                <Icons.X />
              </button>
            </div>
          </div>
        )}

        {anchors.length === 0 && !showAdd && (
          <div className="empty-state">Add an anchor for this week…</div>
        )}
      </div>
    </div>
  );
};

export default AnchorsSection;
