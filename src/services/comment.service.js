const CommentModel = require('../models/comment');
const { getTenantPool } = require('../config/database');

class CommentService {
  static async addComment(tenantId, taskId, commentData) {
    const pool = await getTenantPool(tenantId);
    const commentModel = new CommentModel(pool, {
      prefix: `tenant:${tenantId}:comments`,
      ttl: 1800,
      enabled: true
    });
    return await commentModel.create({ ...commentData, taskId });
  }

  static async getComments(tenantId, taskId) {
    const pool = await getTenantPool(tenantId);
    const commentModel = new CommentModel(pool, {
      prefix: `tenant:${tenantId}:comments`,
      ttl: 1800,
      enabled: true
    });
    return await commentModel.findByTaskId(taskId);
  }

  static async getComment(tenantId, taskId, commentId) {
    const pool = await getTenantPool(tenantId);
    const commentModel = new CommentModel(pool, {
      prefix: `tenant:${tenantId}:comments`,
      ttl: 1800,
      enabled: true
    });
    return await commentModel.findById(commentId, taskId);
  }

  static async deleteComment(tenantId, taskId, commentId) {
    const pool = await getTenantPool(tenantId);
    const commentModel = new CommentModel(pool, {
      prefix: `tenant:${tenantId}:comments`,
      ttl: 1800,
      enabled: true
    });
    await commentModel.softDelete(commentId, taskId);
  }
}

module.exports = CommentService;