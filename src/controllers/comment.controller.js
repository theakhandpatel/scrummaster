import CommentService from '../services/comment.service';
import ResponseFormatter from '../utils/responseFormatter';
import { handleServiceError } from '../utils/errors/errorHandler.js';

class CommentController {
  static async createComment(req, res) {
    const { tenantId, taskId } = req.params;
    const [error, comment] = await CommentService.addComment(tenantId, taskId, req.body);

    if (error) {
      return handleServiceError(error, res);
    }

    return res.status(201).json(ResponseFormatter.success(comment, 'Comment created successfully'));
  }

  static async getComments(req, res) {
    const { tenantId, taskId } = req.params;
    const [error, comments] = await CommentService.getComments(tenantId, taskId);

    if (error) {
      return handleServiceError(error, res);
    }

    return res.json(ResponseFormatter.success(comments));
  }

  static async getComment(req, res) {
    const { tenantId, taskId, commentId } = req.params;
    const [error, comment] = await CommentService.getComment(tenantId, taskId, commentId);

    if (error) {
      return handleServiceError(error, res);
    }

    return res.json(ResponseFormatter.success(comment));
  }

  static async deleteComment(req, res) {
    const { tenantId, taskId, commentId } = req.params;
    const [error, result] = await CommentService.deleteComment(tenantId, taskId, commentId);

    if (error) {
      return handleServiceError(error, res);
    }

    return res.json(ResponseFormatter.success(null, 'Comment deleted successfully'));
  }
}

export default CommentController;