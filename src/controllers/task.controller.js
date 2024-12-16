const TaskService = require('../services/task.service');
const ResponseFormatter = require('../utils/responseFormatter');
const { handleServiceError } = require('../utils/errors/errorHandler');

class TaskController {
  static async createTask(request, reply) {
    const { tenantId } = request.params;
    const [error, task] = await TaskService.createTask(tenantId, request.body);

    if (error) {
      return handleServiceError(error, reply);
    }

    reply.code(201).send(ResponseFormatter.success(task, 'Task created successfully'));
  }

  static async getTasks(request, reply) {
    const { tenantId } = request.params;
    const { page = 1, limit = 10, ...filters } = request.query;
    
    const [error, result] = await TaskService.getTasks(tenantId, {
      page: parseInt(page),
      limit: parseInt(limit),
      ...filters
    });

    if (error) {
      return handleServiceError(error, reply);
    }

    reply.send(ResponseFormatter.paginate(
      result.tasks,
      result.page,
      result.limit,
      result.total
    ));
  }

  static async getTask(request, reply) {
    const { tenantId, taskId } = request.params;
    const [error, task] = await TaskService.getTask(tenantId, taskId);

    if (error) {
      return handleServiceError(error, reply);
    }

    reply.send(ResponseFormatter.success(task));
  }

  static async updateTask(request, reply) {
    const { tenantId, taskId } = request.params;
    const [error, task] = await TaskService.updateTask(tenantId, taskId, request.body);

    if (error) {
      return handleServiceError(error, reply);
    }

    reply.send(ResponseFormatter.success(task, 'Task updated successfully'));
  }

  static async deleteTask(request, reply) {
    const { tenantId, taskId } = request.params;
    const [error] = await TaskService.deleteTask(tenantId, taskId);

    if (error) {
      return handleServiceError(error, reply);
    }

    reply.code(204).send();
  }

  static async addComment(request, reply) {
    const { tenantId, taskId } = request.params;
    const [error, comment] = await TaskService.addComment(tenantId, taskId, request.body);

    if (error) {
      return handleServiceError(error, reply);
    }

    reply.code(201).send(ResponseFormatter.success(comment, 'Comment added successfully'));
  }
}

module.exports = TaskController;
