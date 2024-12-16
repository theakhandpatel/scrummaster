import BaseModel from './baseModel';

class TaskModel extends BaseModel {
  constructor(pool) {
    super(pool);
  }

  async create(taskData) {
    try {
      const { rows: [task] } = await this.pool.query(
        `INSERT INTO tasks (
          title, description, created_by, assigned_to, 
          deadline, status, priority
        ) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [
          taskData.title,
          taskData.description,
          taskData.createdBy,
          taskData.assignedTo,
          taskData.deadline,
          taskData.status || 'pending',
          taskData.priority || 'medium'
        ]
      );
      return [null, task];
    } catch (err) {
      return this.handleError(err);
    }
  }

  async findAll(filters = {}, includeDeleted = false) {
    try {
      let query = 'SELECT t.*, u1.display_name as creator_name, u2.display_name as assignee_name FROM tasks t';
      query += ' LEFT JOIN users u1 ON t.created_by = u1.id';
      query += ' LEFT JOIN users u2 ON t.assigned_to = u2.id';
      
      const conditions = [];
      const params = [];
      let paramCount = 1;
  
      if (!includeDeleted) {
        conditions.push('t.deleted_at IS NULL');
      }
  
      if (filters.status) {
        conditions.push(`t.status = $${paramCount}`);
        params.push(filters.status);
        paramCount++;
      }
  
      if (filters.priority) {
        conditions.push(`t.priority = $${paramCount}`);
        params.push(filters.priority);
        paramCount++;
      }
  
      if (filters.assignedTo) {
        conditions.push(`t.assigned_to = $${paramCount}`);
        params.push(filters.assignedTo);
        paramCount++;
      }
  
      if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
      }
  
      query += ' ORDER BY t.created_at DESC';
  
      const { rows } = await this.pool.query(query, params);
  
      return [null, rows];
    } catch (err) {
      return this.handleError(err);
    }
  }

  async findById(id, includeDeleted = false) {
    try {
      let query = `
        SELECT t.*, 
               u1.display_name as creator_name, 
               u2.display_name as assignee_name,
               COALESCE(json_agg(
                 DISTINCT jsonb_build_object(
                   'id', c.id,
                   'content', c.content,
                   'created_at', c.created_at,
                   'user_id', c.user_id,
                   'user_name', u3.display_name
                 )
               ) FILTER (WHERE c.id IS NOT NULL), '[]') as comments
        FROM tasks t
        LEFT JOIN users u1 ON t.created_by = u1.id
        LEFT JOIN users u2 ON t.assigned_to = u2.id
        LEFT JOIN comments c ON c.task_id = t.id AND c.deleted_at IS NULL
        LEFT JOIN users u3 ON c.user_id = u3.id
      `;
  
      const conditions = ['t.id = $1'];
      if (!includeDeleted) {
        conditions.push('t.deleted_at IS NULL');
      }
  
      query += ` WHERE ${conditions.join(' AND ')}`;
      query += ' GROUP BY t.id, u1.display_name, u2.display_name';
  
      const { rows: [task] } = await this.pool.query(query, [id]);
      if (!task) {
        return this.handleNotFound('Task');
      }
      return [null, task];
    } catch (err) {
      return this.handleError(err);
    }
  }

  async update(id, taskData) {
    try {
      const { rows: [task] } = await this.pool.query(
        `UPDATE tasks SET 
          title = COALESCE($1, title),
          description = COALESCE($2, description),
          assigned_to = COALESCE($3, assigned_to),
          deadline = COALESCE($4, deadline),
          status = COALESCE($5, status),
          priority = COALESCE($6, priority)
        WHERE id = $7 AND deleted_at IS NULL 
        RETURNING *`,
        [
          taskData.title,
          taskData.description,
          taskData.assignedTo,
          taskData.deadline,
          taskData.status,
          taskData.priority,
          id
        ]
      );
  
      return [null, task];
    } catch (err) {
      return this.handleError(err);
    }
  }

  async softDelete(id) {
    try {
      const { rows: [task] } = await this.pool.query(
        'UPDATE tasks SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1 AND deleted_at IS NULL RETURNING *',
        [id]
      );
      
      return [null, task];
    } catch (err) {
      return this.handleError(err);
    }
  }
}

export default TaskModel;
