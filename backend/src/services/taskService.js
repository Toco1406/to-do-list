import mongoose from 'mongoose'
import { Task } from '../models/Task.js'

export function listTasks(ownerId, { status } = {}) {
    const filter = { ownerId };
    if (status) filter.status = status;
    return Task.find(filter)
}

export function createTask(ownerId, data) {
    return Task.create({ ...data, ownerId })
}

export function getTaskById(ownerId, id) {
    return Task.findOne({ _id: id, ownerId })
}

export function updateTaskById(ownerId, taskId, updates) {
  const filter = {_id: taskId, ownerId};
  return Task.findOneAndUpdate(filter, updates, { returnDocument: 'after', runValidators: true })
}

export function deleteTaskById(ownerId, taskId) {
  const filter = { _id: taskId, ownerId };
  return Task.findOneAndDelete(filter)
}
