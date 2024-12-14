const TaskService = require('../services/task.service');
const ResponseFormatter = require('../utils/responseFormatter');

class TaskController {
  static async createTask(request, reply) {
    try {
      const { tenantId } = request.params;
      const task = await TaskService.createTask(tenantId, request.body);
      reply.code(201).send(ResponseFormatter.success(task, 'Task created successfully'));
    } catch (error) {
      reply.code(error.statusCode || 500)
        .send(ResponseFormatter.error(error.message));
    }
  }

  static async getTasks(request, reply) {
    try {
      const { tenantId } = request.params;
      const { page = 1, limit = 10, ...filters } = request.query;
      
      const result = await TaskService.getTasks(tenantId, {
        page: parseInt(page),
        limit: parseInt(limit),
        ...filters
      });
      
      reply.send(ResponseFormatter.paginate(
        result.tasks,
        result.page,
        result.limit,
        result.total
      ));
    } catch (error) {
      reply.code(error.statusCode || 500)
        .send(ResponseFormatter.error(error.message));
    }
  }

  static async getTask(request, reply) {
    try {
      const { tenantId, taskId } = request.params;
      const task = await TaskService.getTask(tenantId, taskId);
      
      if (!task) {
        return reply.code(404)
          .send(ResponseFormatter.error('Task not found', 404));
      }
      
      reply.send(ResponseFormatter.success(task));
    } catch (error) {
      reply.code(error.statusCode || 500)
        .send(ResponseFormatter.error(error.message));
    }
  }

  static async updateTask(request, reply) {
    try {
      const { tenantId, taskId } = request.params;
      const task = await TaskService.updateTask(tenantId, taskId, request.body);
      
      if (!task) {
        return reply.code(404)
          .send(ResponseFormatter.error('Task not found', 404));
      }
      
      reply.send(ResponseFormatter.success(task, 'Task updated successfully'));
    } catch (error) {
      reply.code(error.statusCode || 500)
        .send(ResponseFormatter.error(error.message));
    }
  }

  static async deleteTask(request, reply) {
    try {
      const { tenantId, taskId } = request.params;
      await TaskService.deleteTask(tenantId, taskId);
      reply.code(204).send();
    } catch (error) {
      reply.code(error.statusCode || 500)
        .send(ResponseFormatter.error(error.message));
    }
  }

  static async addComment(request, reply) {
    try {
      const { tenantId, taskId } = request.params;
      const comment = await TaskService.addComment(tenantId, taskId, request.body);
      reply.code(201).send(ResponseFormatter.success(comment, 'Comment added successfully'));
    } catch (error) {
      reply.code(error.statusCode || 500)
        .send(ResponseFormatter.error(error.message));
    }
  }
}

module.exports = TaskController;