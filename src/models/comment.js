const BaseModel = require('./baseModel');

class CommentModel extends BaseModel {
  constructor(pool, cacheOptions = {}) {
    super(pool, cacheOptions);
  }

  async create(data) {
    const { rows: [comment] } = await this.pool.query(
      'INSERT INTO comments (task_id, user_id, content) VALUES ($1, $2, $3) RETURNING *',
      [data.taskId, data.userId, data.content]
    );
    
    // Invalidate task cache since comments are included in task details
    await this.cache.del(`TaskModel:${data.taskId}`);
    return comment;
  }

  async update(id, data) {
    const { rows: [comment] } = await this.pool.query(
      `UPDATE comments SET 
        content = $1
      WHERE id = $2 AND deleted_at IS NULL 
      RETURNING *`,
      [data.content, id]
    );

    if (comment) {
      // Invalidate task cache
      const { rows: [task] } = await this.pool.query(
        'SELECT task_id FROM comments WHERE id = $1',
        [id]
      );
      if (task) {
        await this.cache.del(`TaskModel:${task.task_id}`);
      }
    }
    
    return comment;
  }

  async softDelete(id) {
    const { rows: [comment] } = await this.pool.query(
      'UPDATE comments SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1 AND deleted_at IS NULL RETURNING *',
      [id]
    );
    
    if (comment) {
      // Invalidate task cache
      const { rows: [task] } = await this.pool.query(
        'SELECT task_id FROM comments WHERE id = $1',
        [id]
      );
      if (task) {
        await this.cache.del(`TaskModel:${task.task_id}`);
      }
    }
    
    return comment;
  }
}

module.exports = CommentModel;