import { useEffect, useMemo, useState } from "react";
import EditModal from "./EditModal";
import ViewModal from "./ViewModal";
import "../CSS/TasksPage.css";
import { getMyTasks } from "../services/tasks.services.js";

export const STATUSES = ["Todo", "Doing", "Done"];
export const PRIORITIES = ["Low", "Medium", "High", "Urgent"];

const INITIAL_TASKS = [
  {
    id: 1,
    title: "Buy groceries",
    details: "Milk, eggs, bread and coffee.",
    status: "Todo",
  },
  {
    id: 2,
    title: "Finish the report",
    details: "Send the final version to the team before Friday.",
    status: "Doing",
  },
  {
    id: 3,
    title: "Book dentist appointment",
    details: "Call the clinic and choose an available time.",
    status: "Done",
  },
  {
    id: 4,
    title: "Review project architecture",
    details:
      "Review the backend structure and identify potential improvements.",
    status: "Doing",
  },
  {
    id: 5,
    title: "Update documentation",
    details: "Add API documentation and setup instructions.",
    status: "Todo",
  },
  {
    id: 6,
    title: "Deploy staging environment",
    details: "Deploy the latest version to the staging server.",
    status: "Todo",
  },
];

const EMPTY_FORM = {
  title: "",
  details: "",
  status: "Todo",
  dueDate: "",
};

export default function Tasks() {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("created");

  const DoneTasks = tasks.filter((task) => task.status === "Done").length;
  const doingTasks = tasks.filter((task) => task.status === "Doing").length;
  const todoTasks = tasks.filter((task) => task.status === "Todo").length;

  useEffect(() => {
    getMyTasks().then((data) => {
      setTasks(data.items);
    });
  }, []);

  const progress = tasks.length
    ? Math.round((DoneTasks / tasks.length) * 100)
    : 0;

  const filteredTasks = useMemo(() => {
    const result = tasks.filter((task) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        task.title.toLowerCase().includes(searchValue) ||
        (task.details && task.details.toLowerCase().includes(searchValue));

      const matchesStatus =
        statusFilter === "All" || task.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

    return [...result].sort((a, b) => {
      if (sortBy === "dueDate") {
        return (a.dueDate || "9999").localeCompare(b.dueDate || "9999");
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
      details: task.details || "",
      status: task.status,
      dueDate: task.dueDate || "",
    });

    setModal({
      type: "edit",
      id: task.id,
    });
  };

  const saveTask = (event) => {
    event.preventDefault();

    if (!form.title.trim()) return;

    if (modal.type === "add") {
      const newTask = {
        id: Date.now(),
        ...form,
        title: form.title.trim(),
        createdAt: new Date().toISOString().slice(0, 10),
      };

      setTasks((previous) => [newTask, ...previous]);
    }

    if (modal.type === "edit") {
      setTasks((previous) =>
        previous.map((task) =>
          task.id === modal.id
            ? {
                ...task,
                ...form,
                title: form.title.trim(),
              }
            : task,
        ),
      );
    }

    setModal(null);
    setForm(EMPTY_FORM);
  };

  const deleteTask = (id) => {
    setTasks((previous) => previous.filter((task) => task.id !== id));
    setModal(null);
  };

  const updateStatus = (id, status) => {
    setTasks((previous) =>
      previous.map((task) =>
        task.id === id
          ? {
              ...task,
              status,
            }
          : task,
      ),
    );
  };

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("All");
  };

  const activeTask = modal?.id ? tasks.find((t) => t.id === modal.id) : null;

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
                <strong>{DoneTasks}</strong>
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
                  onChange={(event) => setSearch(event.target.value)}
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
                  onChange={(event) => setStatusFilter(event.target.value)}
                >
                  <option value="All">All statuses</option>
                  {STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
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

              {filteredTasks.map((task) => (
                <div
                  className={`task-row ${task.status === "Done" ? "Done" : ""}`}
                  key={task.id}
                >
                  <div className="task-main">
                    <button
                      className={`task-check ${
                        task.status === "Done" ? "checked" : ""
                      }`}
                      onClick={() =>
                        updateStatus(
                          task.id,
                          task.status === "Done" ? "Todo" : "Done",
                        )
                      }
                    >
                      {task.status === "Done" && "✓"}
                    </button>

                    <div className="task-information">
                      <strong>{task.title}</strong>
                      {task.details && <span>{task.details}</span>}
                    </div>
                  </div>

                  <div>
                    <select
                      className={`status-select status-${task.status.toLowerCase()}`}
                      value={task.status}
                      onChange={(event) =>
                        updateStatus(task.id, event.target.value)
                      }
                    >
                      {STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="row-actions">
                    <button
                      onClick={() =>
                        setModal({
                          type: "view",
                          id: task.id,
                        })
                      }
                      title="View task"
                    >
                      View
                    </button>

                    <button
                      onClick={() => openEditModal(task)}
                      title="Edit task"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ))}

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
          <div
            className="task-modal"
            onClick={(event) => event.stopPropagation()}
          >
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