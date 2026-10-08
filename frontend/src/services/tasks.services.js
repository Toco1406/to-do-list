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
  const response = await fetch(`${BASE_URL}/tasks`, {
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
  const response = await fetch(`${BASE_URL}/tasks/${taskId}`, {
    method: "PATCH",
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

export async function deleteTask(taskId) {
  const response = await fetch(`${BASE_URL}/tasks/${taskId}`, {
    method: "DELETE",
    credentials: "include",
  })
  if (!response.ok) {
    throw new Error()
  }
  return response.json();
}