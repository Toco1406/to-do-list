import { STATUSES } from "./TasksPage";

export default function ViewModal({
  task,
  updateStatus,
  deleteTask,
  openEditModal,
  onClose,
}) {
  const formatDate = (date) => {
    if (!date) return "No due date";

    return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div>
      <div className="modal-header">
        <div className="view-header">
          <h2>{task.title}</h2>
        </div>

        <button className="modal-close" onClick={onClose}>
          ×
        </button>
      </div>

      <div className="view-content">
        <div className="view-status-row">
          <span>Status</span>

          <select
            value={task.status}
            onChange={(event) => updateStatus(task.id, event.target.value)}
          >
            {STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div className="view-section">
          <span>Description</span>
          <p>{task.details || "No description provided."}</p>
        </div>

        <div className="view-meta">
          <div>
            <span>Due date</span>
            <strong>{formatDate(task.dueDate)}</strong>
          </div>

          <div>
            <span>Created</span>
            <strong>{formatDate(task.createdAt)}</strong>
          </div>
        </div>
      </div>

      <div className="modal-footer">
        <button className="danger-button" onClick={() => deleteTask(task.id)}>
          Delete task
        </button>

        <div>
          <button className="secondary-button" onClick={() => openEditModal(task)}>
            Edit
          </button>

          <button className="primary-button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}