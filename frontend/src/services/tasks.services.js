const BASE_URL = "http://localhost:3000/api/tasks"

export async function getMyTasks() {
  const response = await fetch(`${BASE_URL}/my`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Impossible de récupérer les tâches");
  }

  return response.json();
}

export async function getTaskById(taskId) {
  const response = await fetch(`${BASE_URL}/tasks/${taskId}`, {
    method: "GET",
    credentials: "include",
  })
  if (!response.ok) {
    throw new Error()
  }
  return response.json();
}

export async function createTask(task) {
  const response = await fetch(`${BASE_URL}`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  })
  if (!response.ok) {
    throw new Error()
  }
  return response.json();
}

export async function updateTask(taskId, task) {
  const response = await fetch(`${BASE_URL}/${taskId}`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error || `Failed to update task (${response.status})`
    );
  }

  return response.json();
}

export async function deleteTask(id) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error || `Failed to delete task (${response.status})`
    );
  }

  if (response.status === 204) {
    return true;
  }

  return response.json();
}