import { STATUSES } from "./TasksPage";

export default function EditModal({ modal, form, setForm, saveTask, onClose }) {
  const isAdd = modal.type === "add";

  return (
    <form onSubmit={saveTask}>
      <div className="modal-header">
        <div>
          <span className="eyebrow">{isAdd ? "NEW TASK" : "EDIT TASK"}</span>
          <h2>{isAdd ? "Create a new task" : "Edit task"}</h2>
        </div>

        <button type="button" className="modal-close" onClick={onClose}>
          ×
        </button>
      </div>

      <div className="modal-body">
        <label>
          Task title
          <input
            autoFocus
            value={form.title}
            onChange={(event) =>
              setForm({
                ...form,
                title: event.target.value,
              })
            }
            placeholder="What needs to be done?"
          />
        </label>

        <label>
          Description
          <textarea
            rows="4"
            value={form.details}
            onChange={(event) =>
              setForm({
                ...form,
                details: event.target.value,
              })
            }
            placeholder="Add some details..."
          />
        </label>

        <div className="form-grid">
          <label>
            Status
            <select
              value={form.status}
              onChange={(event) =>
                setForm({
                  ...form,
                  status: event.target.value,
                })
              }
            >
              {STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label>
          Due date
          <input
            type="date"
            value={form.dueDate}
            onChange={(event) =>
              setForm({
                ...form,
                dueDate: event.target.value,
              })
            }
          />
        </label>
      </div>

      <div className="modal-footer">
        <button type="button" className="secondary-button" onClick={onClose}>
          Cancel
        </button>

        <button type="submit" className="primary-button">
          {isAdd ? "Create task" : "Save changes"}
        </button>
      </div>
    </form>
  );
}