const { validateTenantApiKey } = require('../middleware/tenantAuth');
const TaskController = require('../controllers/task.controller');
const taskSchema = require('../schemas/task.schema');
const commentSchema = require('../schemas/comment.schema');

/**
 * Registers task routes with the Fastify instance.
 * @param {import('fastify').FastifyInstance} fastify - The Fastify instance.
 */
async function taskRoutes(fastify) {
  const preHandler = [validateTenantApiKey];

  /**
   * Route to create a new task.
   */
  fastify.post(
    '/tenants/:tenantId/tasks',
    { schema: taskSchema.create, preHandler },
    TaskController.createTask
  );

  /**
   * Route to get a list of tasks with optional filters.
   */
  fastify.get(
    '/tenants/:tenantId/tasks',
    { schema: taskSchema.list, preHandler },
    TaskController.getTasks
  );

  /**
   * Route to get a task by its ID.
   */
  fastify.get(
    '/tenants/:tenantId/tasks/:taskId',
    { schema: taskSchema.get, preHandler },
    TaskController.getTask
  );

  /**
   * Route to update a task by its ID.
   */
  fastify.put(
    '/tenants/:tenantId/tasks/:taskId',
    { schema: taskSchema.update, preHandler },
    TaskController.updateTask
  );

  /**
   * Route to soft delete a task by its ID.
   */
  fastify.delete(
    '/tenants/:tenantId/tasks/:taskId',
    { schema: taskSchema.delete, preHandler },
    TaskController.deleteTask
  );

  /**
   * Route to add a comment to a task.
   */
  fastify.post(
    '/tenants/:tenantId/tasks/:taskId/comments',
    { schema: commentSchema.create, preHandler },
    TaskController.addComment
  );
}

module.exports = taskRoutes;
