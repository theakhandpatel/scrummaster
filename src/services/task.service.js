const TaskModel = require('../models/task');
const { getTenantPool } = require('../config/database');

class TaskService {
  static async createTask(tenantId, taskData) {
    const pool = await getTenantPool(tenantId);
    const taskModel = new TaskModel(pool, {
      prefix: `tenant:${tenantId}:tasks`,
      ttl: 1800, // 30 minutes cache
      enabled: true
    });
    return await taskModel.create(taskData);
  }

  static async getTasks(tenantId) {
    const pool = await getTenantPool(tenantId);
    const taskModel = new TaskModel(pool, {
      prefix: `tenant:${tenantId}:tasks`,
      ttl: 1800,
      enabled: true
    });
    return await taskModel.findAll();
  }

  static async getTask(tenantId, taskId) {
    const pool = await getTenantPool(tenantId);
    const taskModel = new TaskModel(pool, {
      prefix: `tenant:${tenantId}:tasks`,
      ttl: 1800,
      enabled: true
    });
    return await taskModel.findById(taskId);
  }

  static async updateTask(tenantId, taskId, taskData) {
    const pool = await getTenantPool(tenantId);
    const taskModel = new TaskModel(pool, {
      prefix: `tenant:${tenantId}:tasks`,
      ttl: 1800,
      enabled: true
    });
    return await taskModel.update(taskId, taskData);
  }

  static async deleteTask(tenantId, taskId) {
    const pool = await getTenantPool(tenantId);
    const taskModel = new TaskModel(pool, {
      prefix: `tenant:${tenantId}:tasks`,
      ttl: 1800,
      enabled: true
    });
    await taskModel.delete(taskId);
  }
}

module.exports = TaskService;