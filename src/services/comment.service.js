import Dispatcher from '../dispatchers/DatabaseDispatcher';
import { adaptDatabaseError } from '../utils/errors/errorHandler';

class CommentService {
  static async addComment(tenantId, taskId, newCommentData) {
    const [err, comment] = await Dispatcher.getTenant(tenantId)
      .Comments
      .create({ ...newCommentData, taskId });

    if (err) {
      return [adaptDatabaseError(err, { operation: 'create', resource: 'Comment' }), null];
    }

    return [null, comment];
  }

  static async getComments(tenantId, taskId) {
    const [err, comments] = await Dispatcher.getTenant(tenantId)
      .Comments
      .findByTaskId(taskId);

    if (err || !comments) {
      return [adaptDatabaseError(err, { operation: 'read', resource: 'Comments' }), null];
    }

    return [null, comments];
  }

  static async getComment(tenantId, taskId, commentId) {
    const [err, comment] = await Dispatcher.getTenant(tenantId)
      .Comments
      .findById(commentId);

    if (err || !comment) {
      return [adaptDatabaseError(err, { operation: 'read', resource: 'Comment' }), null];
    }

    if (comment.taskId !== parseInt(taskId)) {
      return [adaptDatabaseError(new Error('Comment does not belong to this task'), 
        { operation: 'read', resource: 'Comment' }), null];
    }

    return [null, comment];
  }

  static async deleteComment(tenantId, taskId, commentId) {
    const [err, comment] = await Dispatcher.getTenant(tenantId)
      .Comments
      .findById(commentId);

    if (err || !comment) {
      return [adaptDatabaseError(err, { operation: 'read', resource: 'Comment' }), null];
    }

    if (comment.taskId !== parseInt(taskId)) {
      return [adaptDatabaseError(new Error('Comment does not belong to this task'), 
        { operation: 'read', resource: 'Comment' }), null];
    }

    const [deleteErr] = await Dispatcher.getTenant(tenantId)
      .Comments
      .softDelete(commentId);

    if (deleteErr) {
      return [adaptDatabaseError(deleteErr, { operation: 'delete', resource: 'Comment' }), null];
    }

    return [null, true];
  }
}

export default CommentService;