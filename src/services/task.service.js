const { TaskProperties, TaskResponseProperties } = require('../types/Task');
const TaskModel = require('../models/task');
const { getTenantPool } = require('../config/database');

/**
 * Service class for managing tasks.
 */
class TaskService {
  /**
   * Create a new task.
   * @param {number} tenantId - ID of the tenant.
   * @param {TaskProperties} taskData - Data for the new task.
   * @returns {Promise<TaskResponseProperties>} The created task.
   */
  static async createTask(tenantId, taskData) {
    const pool = await getTenantPool(tenantId);
    const taskModel = new TaskModel(pool, {
      prefix: `tenant:${tenantId}:tasks`,
      ttl: 1800, // 30 minutes cache
      enabled: true
    });
    return await taskModel.create(taskData);
  }

  /**
   * Get a list of tasks with optional filters.
   * @param {number} tenantId - ID of the tenant.
   * @param {Object} filters - Filters to apply to the task list.
   * @returns {Promise<Array<TaskResponseProperties>>} List of tasks.
   */
  static async getTasks(tenantId, filters) {
    const pool = await getTenantPool(tenantId);
    const taskModel = new TaskModel(pool, {
      prefix: `tenant:${tenantId}:tasks`,
      ttl: 1800,
      enabled: true
    });
    return await taskModel.findAll(filters);
  }

  /**
   * Get a task by its ID.
   * @param {number} tenantId - ID of the tenant.
   * @param {number} taskId - ID of the task.
   * @returns {Promise<TaskResponseProperties>} The task.
   */
  static async getTask(tenantId, taskId) {
    const pool = await getTenantPool(tenantId);
    const taskModel = new TaskModel(pool, {
      prefix: `tenant:${tenantId}:tasks`,
      ttl: 1800,
      enabled: true
    });
    return await taskModel.findById(taskId);
  }

  /**
   * Update a task by its ID.
   * @param {number} tenantId - ID of the tenant.
   * @param {number} taskId - ID of the task.
   * @param {TaskProperties} taskData - Data to update the task with.
   * @returns {Promise<TaskResponseProperties>} The updated task.
   */
  static async updateTask(tenantId, taskId, taskData) {
    const pool = await getTenantPool(tenantId);
    const taskModel = new TaskModel(pool, {
      prefix: `tenant:${tenantId}:tasks`,
      ttl: 1800,
      enabled: true
    });
    return await taskModel.update(taskId, taskData);
  }

  /**
   * Soft delete a task by its ID.
   * @param {number} tenantId - ID of the tenant.
   * @param {number} taskId - ID of the task.
   * @returns {Promise<void>}
   */
  static async deleteTask(tenantId, taskId) {
    const pool = await getTenantPool(tenantId);
    const taskModel = new TaskModel(pool, {
      prefix: `tenant:${tenantId}:tasks`,
      ttl: 1800,
      enabled: true
    });
    await taskModel.softDelete(taskId);
  }
}

module.exports = TaskService;
