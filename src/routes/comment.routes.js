const { validateTenantApiKey } = require('../middleware/tenantAuth');
const CommentController = require('../controllers/comment.controller');
const commentSchema = require('../schemas/comment.schema');

async function commentRoutes(fastify) {
  const preHandler = [validateTenantApiKey];

  // Comment routes
  fastify.post(
    '/tenants/:tenantId/tasks/:taskId/comments',
    { schema: commentSchema.create, preHandler },
    CommentController.addComment
  );

  fastify.get(
    '/tenants/:tenantId/tasks/:taskId/comments',
    { schema: commentSchema.list, preHandler },
    CommentController.getComments
  );

  fastify.get(
    '/tenants/:tenantId/tasks/:taskId/comments/:commentId',
    { schema: commentSchema.get, preHandler },
    CommentController.getComment
  );

  fastify.delete(
    '/tenants/:tenantId/tasks/:taskId/comments/:commentId',
    { schema: commentSchema.delete, preHandler },
    CommentController.deleteComment
  );
}

module.exports = commentRoutes;