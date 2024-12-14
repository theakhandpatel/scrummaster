const { validateTenantApiKey } = require('../middleware/tenantAuth');
const TaskController = require('../controllers/task.controller');
const taskSchema = require('../schemas/task.schema');
const commentSchema = require('../schemas/comment.schema');

async function taskRoutes(fastify) {
  const preHandler = [validateTenantApiKey];

  // Task CRUD operations
  fastify.post(
    '/tenants/:tenantId/tasks',
    { schema: taskSchema.create, preHandler },
    TaskController.createTask
  );

  fastify.get(
    '/tenants/:tenantId/tasks',
    { schema: taskSchema.list, preHandler },
    TaskController.getTasks
  );

  fastify.get(
    '/tenants/:tenantId/tasks/:taskId',
    { schema: taskSchema.get, preHandler },
    TaskController.getTask
  );

  fastify.put(
    '/tenants/:tenantId/tasks/:taskId',
    { schema: taskSchema.update, preHandler },
    TaskController.updateTask
  );

  fastify.delete(
    '/tenants/:tenantId/tasks/:taskId',
    { schema: taskSchema.delete, preHandler },
    TaskController.deleteTask
  );

  // Task comments
  fastify.post(
    '/tenants/:tenantId/tasks/:taskId/comments',
    { schema: commentSchema.create, preHandler },
    TaskController.addComment
  );
}

module.exports = taskRoutes;