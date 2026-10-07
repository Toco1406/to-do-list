import { useState } from "react";
import "../CSS/TasksPage.css";

const PRIORITIES = ["Todo", "Doing", "Done"];

export default function Tasks() {
  const [tasks, setTasks] = useState([
    { id: 1, title: "Buy groceries", details: "Milk, eggs, bread and coffee.", priority: "Todo", done: false },
    { id: 2, title: "Finish the report", details: "Send the final version to the team before Friday.", priority: "Doing", done: false },
    { id: 3, title: "Book dentist appointment", details: "", priority: "Done", done: true },
  ]);
  
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ title: "", details: "", priority: "Todo" });

  const doneCount = tasks.filter((t) => t.done).length;
  const progress = tasks.length ? (doneCount / tasks.length) * 100 : 0;
  const viewed = modal?.type === "view" ? tasks.find((t) => t.id === modal.id) : null;

  const toggle = (id) =>
    setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

  const remove = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
    setModal(null);
  };

  const addTask = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setTasks([{ id: Date.now(), ...form, done: false }, ...tasks]);
    setForm({ title: "", details: "", priority: "Medium" });
    setModal(null);
  };

  return (
    <div className="page">
      <div className="tasks">
        <header className="tasks-header">
          <div>
            <h1>Mes tâches</h1>
            <p>{doneCount} de {tasks.length} complété</p>
          </div>
          <button className="btn btn-primary" onClick={() => setModal({ type: "add" })}>
            + Nouvelle tâche
          </button>
        </header>

        <div className="progress">
          <div className="progress-bar" style={{ width: `${progress}%` }} />
        </div>

        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task.id} className={`task ${task.done ? "is-done" : ""}`}>
              <button
                className="check"
                onClick={() => toggle(task.id)}
                aria-label="Toggle done"
              >
                {task.done && "✓"}
              </button>
              <div className="task-body">
                <span className="task-title">{task.title}</span>
                <span className={`tag tag-${task.priority.toLowerCase()}`}>
                  {task.priority}
                </span>
              </div>
              <button
                className="btn btn-ghost"
                onClick={() => setModal({ type: "view", id: task.id })}
              >
                View
              </button>
            </li>
          ))}
          {tasks.length === 0 && <li className="empty">Nothing to do. Enjoy your day ✨</li>}
        </ul>
      </div>

      {modal && (
        <div className="overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            {modal.type === "add" && (
              <form onSubmit={addTask}>
                <h2>New task</h2>
                <label>
                  Title
                  <input
                    autoFocus
                    placeholder="What needs to be done?"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                  />
                </label>
                <label>
                  Details
                  <textarea
                    rows="3"
                    placeholder="Optional notes"
                    value={form.details}
                    onChange={(e) => setForm({ ...form, details: e.target.value })}
                  />
                </label>
                <label>
                  Priority
                  <div className="segmented">
                    {PRIORITIES.map((p) => (
                      <button
                        type="button"
                        key={p}
                        className={form.priority === p ? "active" : ""}
                        onClick={() => setForm({ ...form, priority: p })}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </label>
                <div className="modal-actions">
                  <button type="button" className="btn btn-ghost" onClick={() => setModal(null)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">Add task</button>
                </div>
              </form>
            )}

            {viewed && (
              <div>
                <span className={`tag tag-${viewed.priority.toLowerCase()}`}>
                  {viewed.priority} priority
                </span>
                <h2 className="view-title">{viewed.title}</h2>
                <p className="view-details">{viewed.details || "No details added."}</p>
                <p className="view-status">
                  Status: <strong>{viewed.done ? "Completed" : "To do"}</strong>
                </p>
                <div className="modal-actions">
                  <button className="btn btn-danger" onClick={() => remove(viewed.id)}>
                    Delete
                  </button>
                  <button className="btn btn-primary" onClick={() => setModal(null)}>
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}