import { useEffect, useMemo, useState } from "react";
import EditModal from "./EditModal";
import ViewModal from "./ViewModal";
import { MdDelete } from "react-icons/md";
import { FaEye, FaPen } from "react-icons/fa";

import "../CSS/TasksPage.css";
import {
  getMyTasks,
  createTask,
  deleteTask,
  updateTask,
} from "../services/tasks.services.js";

export const STATUSES = ["todo", "doing", "done"];

const EMPTY_FORM = {
  title: "",
  description: "",
  status: "todo",
  deadline: "",
};

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("created");

  const doneTasks = tasks.filter((task) => task.status === "done").length;
  const doingTasks = tasks.filter((task) => task.status === "doing").length;

  useEffect(() => {
    getMyTasks()
      .then((data) => {
        // Safely extract items array from backend response
        setTasks(data?.items || data || []);
      })
      .catch((error) => console.error("Failed to load tasks:", error));
  }, []);

  const progress = tasks.length
    ? Math.round((doneTasks / tasks.length) * 100)
    : 0;

  const filteredTasks = useMemo(() => {
    const result = tasks.filter((task) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        task.title?.toLowerCase().includes(searchValue) ||
        task.description?.toLowerCase().includes(searchValue);

      const matchesStatus =
        statusFilter === "All" || task.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

    return [...result].sort((a, b) => {
      if (sortBy === "deadline") {
        return (a.deadline || "9999").localeCompare(b.deadline || "9999");
      }

      if (sortBy === "title") {
        return a.title.localeCompare(b.title);
      }

      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }, [tasks, search, statusFilter, sortBy]);

  const openAddModal = () => {
    setForm(EMPTY_FORM);
    setModal({ type: "add" });
  };

  const openEditModal = (task) => {
    setForm({
      title: task.title,
      description: task.description || "",
      status: task.status,
      deadline: task.deadline ? task.deadline.split("T")[0] : "",
    });

    setModal({
      type: "edit",
      id: task._id || task.id, // Mongoose uses '_id'
    });
  };

  const saveTask = async (event) => {
    event.preventDefault();

    if (!form.title.trim()) return;

    try {
      const payload = {
        title: form.title.trim(),
        description: form.description,
        status: form.status,
        deadline: form.deadline || null,
      };

      if (modal.type === "add") {
        // 1. Backend API Call for New Task
        const newTask = await createTask(payload);
        setTasks((prev) => [newTask, ...prev]);
      } else if (modal.type === "edit") {
        // 2. Backend API Call to Update Task
        const updatedTask = await updateTask(modal.id, payload);

        setTasks((prev) =>
          prev.map((task) =>
            (task._id || task.id) === modal.id ? updatedTask : task,
          ),
        );
      }

      setModal(null);
      setForm(EMPTY_FORM);
    } catch (error) {
      console.error("Failed to save task:", error);
      alert(error.message || "Failed to save task. Please try again.");
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      // 1. Call backend to delete
      await deleteTask(id);

      // 2. Remove task from React state
      setTasks((prev) => prev.filter((task) => (task._id || task.id) !== id));

      // 3. Close modal if open
      setModal(null);
    } catch (error) {
      console.error("Failed to delete task:", error);
      alert(error.message || "Failed to delete task. Please try again.");
    }
  };

  const updateStatus = (id, status) => {
    setTasks((prev) =>
      prev.map((task) =>
        (task._id || task.id) === id ? { ...task, status } : task,
      ),
    );
  };

  const activeTask = modal?.id
    ? tasks.find((t) => (t._id || t.id) === modal.id)
    : null;

  return (
    <div className="dashboard">
      <main className="main">
        <div className="content">
          <section className="page-header">
            <div>
              <span className="eyebrow">MY WORKSPACE</span>
              <h1>Tasks</h1>
              <p>Manage your work, track progress and stay organized.</p>
            </div>

            <button className="primary-button" onClick={openAddModal}>
              <span>+</span> New task
            </button>
          </section>

          <section className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon blue">✓</div>
              <div>
                <span>Total tasks</span>
                <strong>{tasks.length}</strong>
                <small>All your tasks</small>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon purple">◷</div>
              <div>
                <span>Doing</span>
                <strong>{doingTasks}</strong>
                <small>Currently working on</small>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon green">✓</div>
              <div>
                <span>Done</span>
                <strong>{doneTasks}</strong>
                <small>{progress}% completion rate</small>
              </div>
            </div>
          </section>

          <section className="tasks-section">
            <div className="tasks-toolbar">
              <div className="search-wrapper">
                <span>⌕</span>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search tasks..."
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="clear-search"
                  >
                    ×
                  </button>
                )}
              </div>

              <div className="filters">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="All">All statuses</option>
                  {STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="task-table">
              <div className="task-table-header">
                <span>TASK</span>
                <span>STATUS</span>
                <span />
              </div>

              {filteredTasks.map((task) => {
                const taskId = task._id || task.id;
                const isDone = task.status === "done";

                return (
                  <div
                    className={`task-row ${isDone ? "Done" : ""}`}
                    key={taskId}
                  >
                    <div className="task-main">
                      <button
                        className={`task-check ${isDone ? "checked" : ""}`}
                        onClick={() =>
                          updateStatus(taskId, isDone ? "todo" : "done")
                        }
                      >
                        {isDone && "✓"}
                      </button>

                      <div className="task-information">
                        <strong>{task.title}</strong>
                        {task.description && <span>{task.description}</span>}
                      </div>
                    </div>

                    <div>
                      <select
                        className={`status-select status-${task.status}`}
                        value={task.status}
                        onChange={(e) => updateStatus(taskId, e.target.value)}
                      >
                        {STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="row-actions">
                      <button
                        onClick={() => setModal({ type: "view", id: taskId })}
                        title="View task"
                      >
                        <FaEye />
                      </button>

                      <button
                        onClick={() => openEditModal(task)}
                        title="Edit task"
                      >
                        <FaPen />
                      </button>

                      {/* New Delete Button */}
                      <button
                        className="delete-button"
                        onClick={() => handleDeleteTask(taskId)}
                        title="Delete"
                      >
                        <MdDelete />
                      </button>
                    </div>
                  </div>
                );
              })}

              {filteredTasks.length === 0 && (
                <div className="empty-state">
                  <div className="empty-icon">✓</div>
                  <h3>No tasks found</h3>
                  <p>Try changing your filters or create a new task.</p>
                  <button className="primary-button" onClick={openAddModal}>
                    + Create task
                  </button>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="task-modal" onClick={(e) => e.stopPropagation()}>
            {(modal.type === "add" || modal.type === "edit") && (
              <EditModal
                modal={modal}
                form={form}
                setForm={setForm}
                saveTask={saveTask}
                onClose={() => setModal(null)}
              />
            )}

            {modal.type === "view" && activeTask && (
              <ViewModal
                task={activeTask}
                updateStatus={updateStatus}
                deleteTask={deleteTask}
                openEditModal={openEditModal}
                onClose={() => setModal(null)}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
