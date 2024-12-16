const dispatcher = require('../dispatchers/DatabaseDispatcher');
const createError = require('http-errors');

class TaskService {
  static async createTask(tenantId, newTaskData) {
    const [err, task] = await dispatcher
      .getTenant(tenantId)
      .Tasks
      .create(newTaskData);

    if (err) {
      throw createError(500, 'Failed to create task');
    }

    return task;
  }

  static async getTasks(tenantId, filters = {}) {
    const [err, tasks] = await dispatcher
      .getTenant(tenantId)
      .Tasks
      .findAll(filters);

    if (err || !tasks) {
      throw createError(404, 'No tasks found');
    }

    return tasks;
  }

  static async getTask(tenantId, taskId) {
    const [err, task] = await dispatcher
      .getTenant(tenantId)
      .Tasks
      .findById(taskId);

    if (err || !task) {
      throw createError(404, 'Task not found');
    }

    return task;
  }

  static async updateTask(tenantId, taskId, newTaskData) {
    const [err, task] = await dispatcher
      .getTenant(tenantId)
      .Tasks
      .update(taskId, newTaskData);

    if (err || !task) {
      throw createError(404, 'Task not found');
    }

    return task;
  }

  static async deleteTask(tenantId, taskId) {
    const [err, task] = await dispatcher
      .getTenant(tenantId)
      .Tasks
      .softDelete(taskId);

    if (err || !task) {
      throw createError(404, 'Task not found');
    }
  }
}

module.exports = TaskService;