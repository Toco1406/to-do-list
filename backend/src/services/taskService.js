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