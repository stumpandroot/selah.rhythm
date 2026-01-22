import { useState } from 'react';
import * as Icons from '../shared/Icons';
import DotPattern from '../shared/DotPattern';
import TimerCard from '../cards/TimerCard';
import TaskSection from '../ui/TaskSection';

/**
 * FocusView Component
 *
 * Timer-focused view for deep work sessions. Shows a large timer card (2/3 width)
 * alongside a today's tasks sidebar (1/3 width). Primary tasks are shown with special
 * styling to emphasize them. Includes drag-and-drop support for moving tasks into
 * the today list.
 *
 * Layout:
 * - Left column: TimerCard component (2/3 width)
 * - Right column: Today's Tasks sidebar (1/3 width)
 *   - Shows primary tasks with special styling
 *   - Shows today tasks below primary
 *   - Includes "This Week" and "To Explore" collapsed sections
 *
 * Features:
 * - Deep work progress bar at top
 * - Task completion counter
 * - Currently Working On indicator
 * - Primary tasks emphasized with star badge
 * - Drag-and-drop between sections
 * - Quick add task input
 *
 * @param {Object} props
 * @param {Object} props.tasks - Task lists (primary, today, thisWeek, later)
 * @param {Function} props.toggleTask - Toggle task completion: (id, list) => void
 * @param {Function} props.addTask - Add new task: (text, list, category, timeEstimate) => void
 * @param {Function} props.delTask - Delete task: (id, list) => void
 * @param {Function} props.editTask - Edit task text: (id, list, text) => void
 * @param {Function} props.updCat - Update task category: (id, list, category) => void
 * @param {Function} props.updTime - Update task time estimate: (id, list, time) => void
 * @param {Function} props.moveTask - Move task to different list: (id, sourceList, destList) => void
 * @param {Function} props.reorderTask - Reorder task within or between lists: (taskId, sourceList, destList, destIndex) => void
 * @param {boolean} props.timerOn - Whether timer feature is enabled
 * @param {number} props.preset - Timer preset duration in minutes
 * @param {Function} props.setPreset - Set timer preset: (minutes) => void
 * @param {number} props.time - Current timer value in seconds
 * @param {Function} props.setTime - Set timer time: (seconds) => void
 * @param {boolean} props.running - Whether timer is running
 * @param {Function} props.setRunning - Set timer running state: (running) => void
 * @param {string} props.linkedTask - ID of task linked to timer
 * @param {Function} props.setLinkedTask - Set linked task: (taskId) => void
 * @param {Function} props.onAddFocusTime - Add focus time to task: (taskId, minutes) => void
 * @param {boolean} props.showTimeToComplete - Whether to show time to complete estimates
 * @param {Function} props.onHelpClick - Help icon click handler: (helpId) => void
 * @param {string} props.timerMode - Timer mode: 'focus' | 'shortBreak' | 'longBreak'
 * @param {Function} props.setTimerMode - Set timer mode: (mode) => void
 * @param {Array} props.taskCategories - Available task categories
 * @param {boolean} props.timerCollapsed - Whether timer card is collapsed
 * @param {Function} props.setTimerCollapsed - Set timer collapsed state: (collapsed) => void
 */
const FocusView = ({
  tasks,
  toggleTask,
  addTask,
  delTask,
  editTask,
  updCat,
  updTime,
  moveTask,
  reorderTask,
  timerOn,
  preset,
  setPreset,
  time,
  setTime,
  running,
  setRunning,
  linkedTask,
  setLinkedTask,
  onAddFocusTime,
  showTimeToComplete,
  onHelpClick,
  timerMode,
  setTimerMode,
  taskCategories,
  timerCollapsed,
  setTimerCollapsed
}) => {
  const [todayInp, setTodayInp] = useState("");
  const [dropTarget, setDropTarget] = useState(null); // 'today' | null

  // Primary tasks first, then today
  const primaryTasks = tasks.primary.map(t => ({ ...t, list: "primary", isPrimary: true }));
  const todayTasks = tasks.today.map(t => ({ ...t, list: "today", isPrimary: false }));
  const allToday = [...primaryTasks, ...todayTasks];

  // Handle drop on Today's Tasks card
  const handleTodayDrop = (e) => {
    e.preventDefault();
    setDropTarget(null);

    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'));
      if (data.type === 'task' && reorderTask) {
        // Move to end of today list
        reorderTask(data.taskId, data.sourceList, 'today', tasks.today.length);
      }
    } catch (err) {
      console.log('Drop parse error:', err);
    }
  };

  const handleTodayDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDropTarget('today');
  };

  const handleTodayDragLeave = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDropTarget(null);
    }
  };

  return (
    <div className="focus-layout">
      {/* Left column: Timer card (2/3 width) */}
      <div className="column">
        <TimerCard
          timerOn={timerOn}
          preset={preset}
          setPreset={setPreset}
          time={time}
          setTime={setTime}
          running={running}
          setRunning={setRunning}
          linkedTask={linkedTask}
          setLinkedTask={setLinkedTask}
          allTasks={allToday}
          onAddFocusTime={onAddFocusTime}
          onHelpClick={onHelpClick}
          onModeChange={setTimerMode}
          collapsed={timerCollapsed}
          onToggleCollapse={setTimerCollapsed}
        />
      </div>

      {/* Right column: Today's Tasks, This Week, To Explore (1/3 width) */}
      <div className="column">
        <div className={`card today-card has-dots${dropTarget ? ' drag-over' : ''}`}>
          <DotPattern visible={true} animated={true} />
          <div className="card-header purple has-dots">
            <h3>
              <span className="card-icon card-icon-plum">
                <Icons.CircleCheckSolid />
              </span>
              Today's Tasks
            </h3>
            <span className="card-count">
              {allToday.filter(t => t.done).length}/{allToday.length}
            </span>
            {/* HelpIcon component will be imported once available */}
            {/* <HelpIcon id="todayTasks" onHelpClick={onHelpClick} /> */}
          </div>
          <div
            className="card-content focus-tasks-content"
            onDragOver={handleTodayDragOver}
            onDragLeave={handleTodayDragLeave}
            onDrop={handleTodayDrop}
          >
            <div className="focus-task-list">
              {allToday.length === 0 && (
                <div className="empty-state">What will you focus on?</div>
              )}
              {allToday.map(t => (
                <div
                  key={t.id}
                  className={`focus-task-item${t.isPrimary ? ' is-primary' : ''}${t.done ? ' is-done' : ''}`}
                >
                  {t.isPrimary && (
                    <div className="focus-primary-label">
                      <span className="focus-primary-dot" />
                      <Icons.Star /> <span>PRIMARY</span>
                    </div>
                  )}
                  <div className="focus-task-row">
                    <div
                      className={`task-checkbox${t.done ? ' checked' : ''}`}
                      onClick={() => toggleTask(t.id, t.list)}
                    >
                      {t.done && <Icons.Check />}
                    </div>
                    <div className="focus-task-content">
                      <div className={`focus-task-text${t.done ? ' completed' : ''}`}>
                        {t.text}
                      </div>
                      {(t.category || t.timeEstimate) && (
                        <div className="focus-task-meta">
                          {t.category && t.category !== 'none' && (
                            <span className="focus-task-category">
                              <span
                                className="focus-task-category-dot"
                                style={{
                                  background: taskCategories?.find(c => c.name === t.category)?.color || 'var(--text-muted)'
                                }}
                              />
                              {t.category}
                            </span>
                          )}
                          {t.timeEstimate && (
                            <span className="focus-task-time">{t.timeEstimate}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Drop indicator */}
            {dropTarget === 'today' && (
              <div className="focus-drop-indicator">Drop here to add to Today</div>
            )}

            {/* Quick add task input */}
            <input
              className="add-input-inline"
              placeholder="Add a task..."
              value={todayInp}
              onChange={e => setTodayInp(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter" && todayInp.trim()) {
                  addTask(todayInp.trim(), "today", "none", "");
                  setTodayInp("");
                }
              }}
            />
          </div>
        </div>

        <TaskSection
          title="This Week"
          tasks={tasks.thisWeek}
          list="thisWeek"
          icon={<Icons.CalendarSolid />}
          color="blue"
          onToggle={id => toggleTask(id, "thisWeek")}
          onAdd={(t, c, tm) => addTask(t, "thisWeek", c, tm)}
          onDel={id => delTask(id, "thisWeek")}
          onEdit={(id, t) => editTask(id, "thisWeek", t)}
          onCat={(id, c) => updCat(id, "thisWeek", c)}
          onTime={(id, tm) => updTime(id, "thisWeek", tm)}
          onMove={(id, to) => moveTask(id, "thisWeek", to)}
          collapsed={true}
          showTimeToComplete={showTimeToComplete}
          onReorder={reorderTask}
          onHelpClick={onHelpClick}
          taskCategories={taskCategories}
        />

        <TaskSection
          title="To Explore"
          tasks={tasks.later}
          list="later"
          icon={<Icons.StarSolid />}
          color="warm"
          onToggle={id => toggleTask(id, "later")}
          onAdd={(t, c, tm) => addTask(t, "later", c, tm)}
          onDel={id => delTask(id, "later")}
          onEdit={(id, t) => editTask(id, "later", t)}
          onCat={(id, c) => updCat(id, "later", c)}
          onTime={(id, tm) => updTime(id, "later", tm)}
          onMove={(id, to) => moveTask(id, "later", to)}
          collapsed={true}
          showTimeToComplete={showTimeToComplete}
          onReorder={reorderTask}
          onHelpClick={onHelpClick}
          taskCategories={taskCategories}
        />
      </div>
    </div>
  );
};

export default FocusView;
