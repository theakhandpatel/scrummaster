const dispatcher = require('../dispatchers/DatabaseDispatcher');
const createError = require('http-errors');

class TaskService {
  static async createTask(tenantId, taskData) {
    const task = await dispatcher
      .getTenant(tenantId)
      .Tasks
      .create(taskData);
    return task;
  }

  static async getTasks(tenantId, filters = {}) {
    const tasks = await dispatcher
      .getTenant(tenantId)
      .Tasks
      .findAll(filters);
    
    if (!tasks) {
      throw createError(404, 'No tasks found');
    }
    
    return tasks;
  }

  static async getTask(tenantId, taskId) {
    const task = await dispatcher
      .getTenant(tenantId)
      .Tasks
      .findById(taskId);
    
    if (!task) {
      throw createError(404, 'Task not found');
    }
    
    return task;
  }

  static async updateTask(tenantId, taskId, taskData) {
    const task = await dispatcher
      .getTenant(tenantId)
      .Tasks
      .update(taskId, taskData);
    
    if (!task) {
      throw createError(404, 'Task not found');
    }
    
    return task;
  }

  static async deleteTask(tenantId, taskId) {
    const task = await dispatcher
      .getTenant(tenantId)
      .Tasks
      .softDelete(taskId);
    
    if (!task) {
      throw createError(404, 'Task not found');
    }
  }
}

module.exports = TaskService;