const dispatcher = require('../dispatchers/DatabaseDispatcher');
const createError = require('http-errors');

class CommentService {
  static async addComment(tenantId, taskId, commentData) {
    const comment = await dispatcher
      .getTenant(tenantId)
      .Comments
      .create({ ...commentData, taskId });
    return comment;
  }

  static async getComments(tenantId, taskId) {
    const comments = await dispatcher
      .getTenant(tenantId)
      .Comments
      .findByTaskId(taskId);
    
    if (!comments) {
      throw createError(404, 'No comments found');
    }
    
    return comments;
  }

  static async getComment(tenantId, taskId, commentId) {
    const comment = await dispatcher
      .getTenant(tenantId)
      .Comments
      .findById(commentId);
    
    if (!comment) {
      throw createError(404, 'Comment not found');
    }
    
    if (comment.taskId !== parseInt(taskId)) {
      throw createError(404, 'Comment not found for this task');
    }
    
    return comment;
  }

  static async deleteComment(tenantId, taskId, commentId) {
    const comment = await dispatcher
      .getTenant(tenantId)
      .Comments
      .softDelete(commentId);
    
    if (!comment) {
      throw createError(404, 'Comment not found');
    }
    
    if (comment.taskId !== parseInt(taskId)) {
      throw createError(404, 'Comment not found for this task');
    }
  }
}

module.exports = CommentService;