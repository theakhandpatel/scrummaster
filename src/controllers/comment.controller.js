const CommentService = require('../services/comment.service');
const ResponseFormatter = require('../utils/responseFormatter');

class CommentController {
  static async addComment(request, reply) {
    try {
      const { tenantId, taskId } = request.params;
      const comment = await CommentService.addComment(tenantId, taskId, request.body);
      reply.code(201).send(ResponseFormatter.success(comment, 'Comment added successfully'));
    } catch (error) {
      reply.code(error.statusCode || 500)
        .send(ResponseFormatter.error(error.message));
    }
  }

  static async getComments(request, reply) {
    try {
      const { tenantId, taskId } = request.params;
      const comments = await CommentService.getComments(tenantId, taskId);
      reply.send(ResponseFormatter.success(comments));
    } catch (error) {
      reply.code(error.statusCode || 500)
        .send(ResponseFormatter.error(error.message));
    }
  }

  static async getComment(request, reply) {
    try {
      const { tenantId, taskId, commentId } = request.params;
      const comment = await CommentService.getComment(tenantId, taskId, commentId);
      reply.send(ResponseFormatter.success(comment));
    } catch (error) {
      reply.code(error.statusCode || 500)
        .send(ResponseFormatter.error(error.message));
    }
  }

  static async deleteComment(request, reply) {
    try {
      const { tenantId, taskId, commentId } = request.params;
      await CommentService.deleteComment(tenantId, taskId, commentId);
      reply.code(204).send();
    } catch (error) {
      reply.code(error.statusCode || 500)
        .send(ResponseFormatter.error(error.message));
    }
  }
}

module.exports = CommentController;