import mongoose from 'mongoose'
import * as taskService from '../services/taskService.js'

const ALLOWED_FIELDS = ['title', 'description', 'status', 'deadline']

export async function getAllTasks(request, response) {
    const tasks = await taskService.listTasks(request.userId)
    return response.status(200).json({ message: "Todos récupérées : ", tasks: tasks })
}

export async function createTask(req, res) {
  try {
    if (!req.user) return res.status(401).json({ error: 'UNAUTHORIZED' })
    const task = await taskService.createTask(req.user.id, req.body)
    res.status(201).json(task)
  } catch (err) {
    if (err.name === 'ValidationError') return res.status(400).json({ error: 'INVALID_INPUT' })
    res.status(500).json({ error: 'SERVER_ERROR' })
  }
}

export async function updateTask(request, response) {
    if (!mongoose.isValidObjectId(request.params.id)) {
        return response.status(400).json({ error: 'INVALID_INPUT' })
    }

    const updates = request.body ?? {}

    if (Object.keys(updates).length === 0) {
        return response.status(400).json({ error: 'INVALID_INPUT' })
    }

    const hasForbiddenField = Object.keys(updates).some(field => !ALLOWED_FIELDS.includes(field))

    if (hasForbiddenField) {
        return response.status(400).json({ error: 'INVALID_INPUT' })
    }

    let task
    try {
        task = await taskService.updateTaskById(request.userId, request.params.id, updates)
    } catch (error) {
        if (error.name === 'ValidationError' || error.name === 'CastError') {
            return response.status(400).json({ error: 'INVALID_INPUT' })
        }
        throw error
    }


    if (!task) {
        return response.status(404).json({ error: 'NOT_FOUND' })
    }

    return response.status(200).json(task)
}

export async function deleteTask(request, response) {
    if (!mongoose.isValidObjectId(request.params.id)) {
        return response.status(400).json({ error: 'INVALID_INPUT' })
    }

    const task = await taskService.deleteTaskById(request.userId, request.params.id)

    if (!task) {
        return response.status(404).json({ error: 'NOT_FOUND' })
    }

    return response.status(204).send()
}


export async function getTask(req, res) {
    try {
        if (!req.user) return res.status(401).json({ error: 'UNAUTHORIZED' })
        if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ error: 'INVALID_INPUT' })
        const task = await taskService.getTaskById(req.user.id, req.params.id)
        if (!task) return res.status(404).json({ error: 'NOT_FOUND' })
        res.status(200).json(task)
    } catch (err) {
        res.status(500).json({ error: 'SERVER_ERROR' })
    }
}

export async function getTasks(req, res) {
    try {
        if (!req.user) return res.status(401).json({ error: 'UNAUTHORIZED' })
        const items = await taskService.listTasks(req.user.id)
        res.status(200).json({ items })
    } catch (err) {
        res.status(500).json({ error: 'SERVER_ERROR' })
    }
}