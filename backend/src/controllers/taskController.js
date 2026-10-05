import * as taskService from '../services/taskService.js'

export async function getAllTasks(request, response) {
    const tasks = await taskService.listTasks(request.userId)
    return response.status(200).json({ message: "Todos récupérées : ", tasks: tasks })
}

