const dispatcher = require('../dispatchers/DatabaseDispatcher');
const createError = require('http-errors');

class CommentService {
  static async addComment(tenantId, taskId, newCommentData) {
    const [err, comment] = await dispatcher
      .getTenant(tenantId)
      .Comments
      .create({ ...newCommentData, taskId });

    if (err) {
      throw createError(500, 'Failed to add comment');
    }

    return comment;
  }

  static async getComments(tenantId, taskId) {
    const [err, comments] = await dispatcher
      .getTenant(tenantId)
      .Comments
      .findByTaskId(taskId);

    if (err || !comments) {
      throw createError(404, 'No comments found');
    }

    return comments;
  }

  static async getComment(tenantId, taskId, commentId) {
    const [err, comment] = await dispatcher
      .getTenant(tenantId)
      .Comments
      .findById(commentId);

    if (err || !comment) {
      throw createError(404, 'Comment not found');
    }

    if (comment.taskId !== parseInt(taskId)) {
      throw createError(404, 'Comment not found for this task');
    }

    return comment;
  }

  static async deleteComment(tenantId, taskId, commentId) {
    const [err, comment] = await dispatcher
      .getTenant(tenantId)
      .Comments
      .softDelete(commentId);

    if (err || !comment) {
      throw createError(404, 'Comment not found');
    }

    if (comment.taskId !== parseInt(taskId)) {
      throw createError(404, 'Comment not found for this task');
    }
  }
}

module.exports = CommentService;