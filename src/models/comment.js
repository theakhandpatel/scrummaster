const BaseModel = require('./baseModel');

class CommentModel extends BaseModel {
  constructor(pool) {
    super(pool);
  }

  async create(commentData) {
    try {
      const { rows: [comment] } = await this.pool.query(
        'INSERT INTO comments (task_id, user_id, content) VALUES ($1, $2, $3) RETURNING *',
        [commentData.taskId, commentData.userId, commentData.content]
      );
      return [null, comment];
    } catch (err) {
      return [err, null];
    }
  }

  async update(id, commentData) {
    try {
      const { rows: [comment] } = await this.pool.query(
        `UPDATE comments SET 
          content = $1
        WHERE id = $2 AND deleted_at IS NULL 
        RETURNING *`,
        [commentData.content, id]
      );
      return [null, comment];
    } catch (err) {
      return [err, null];
    }
  }

  async softDelete(id) {
    try {
      const { rows: [comment] } = await this.pool.query(
        'UPDATE comments SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1 AND deleted_at IS NULL RETURNING *',
        [id]
      );
      return [null, comment];
    } catch (err) {
      return [err, null];
    }
  }
}

module.exports = CommentModel;