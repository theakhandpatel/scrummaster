const BaseModel = require('./baseModel');
const { TaskProperties, TaskResponseProperties } = require('../types/Task');

/**
 * Model class for managing tasks.
 * @extends BaseModel
 */
class TaskModel extends BaseModel {
  /**
   * Create an instance of TaskModel.
   * @param {Object} pool - Database connection pool.
   * @param {Object} cacheOptions - Cache options.
   */
  constructor(pool, cacheOptions = {}) {
    super(pool, cacheOptions);
  }

  /**
   * Create a new task.
   * @param {TaskProperties} data - Task data.
   * @returns {Promise<TaskResponseProperties>} The created task.
   */
  async create(data) {
    const { rows: [task] } = await this.pool.query(
      `INSERT INTO tasks (
        title, description, created_by, assigned_to, 
        deadline, status, priority
      ) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [
        data.title,
        data.description,
        data.createdBy,
        data.assignedTo,
        data.deadline,
        data.status || 'pending',
        data.priority || 'medium'
      ]
    );
    
    await this.cache.delPattern('list:*');
    return task;
  }

  /**
   * Find all tasks with optional filters.
   * @param {Object} filters - Filters to apply to the task list.
   * @param {boolean} [includeDeleted=false] - Whether to include deleted tasks.
   * @returns {Promise<Array<TaskResponseProperties>>} List of tasks.
   */
  async findAll(filters = {}, includeDeleted = false) {
    const cacheKey = this.generateListCacheKey(
      `filters:${JSON.stringify(filters)}:deleted:${includeDeleted}`
    );
    
    const cachedTasks = await this.cache.get(cacheKey);
    if (cachedTasks) {
      return cachedTasks;
    }

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
    await this.cache.set(cacheKey, rows);
    return rows;
  }

  /**
   * Find a task by its ID.
   * @param {number} id - ID of the task.
   * @param {boolean} [includeDeleted=false] - Whether to include deleted tasks.
   * @returns {Promise<TaskResponseProperties>} The task.
   */
  async findById(id, includeDeleted = false) {
    const cacheKey = this.generateCacheKey(`${id}:${includeDeleted}`);
    const cachedTask = await this.cache.get(cacheKey);
    
    if (cachedTask) {
      return cachedTask;
    }

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

    if (task) {
      await this.cache.set(cacheKey, task);
    }
    
    return task;
  }

  /**
   * Update a task by its ID.
   * @param {number} id - ID of the task.
   * @param {TaskProperties} data - Data to update the task with.
   * @returns {Promise<TaskResponseProperties>} The updated task.
   */
  async update(id, data) {
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
        data.title,
        data.description,
        data.assignedTo,
        data.deadline,
        data.status,
        data.priority,
        id
      ]
    );

    await this.cache.del(this.generateCacheKey(id));
    await this.cache.delPattern('list:*');
    
    return task;
  }

  /**
   * Soft delete a task by its ID.
   * @param {number} id - ID of the task.
   * @returns {Promise<TaskResponseProperties>} The soft deleted task.
   */
  async softDelete(id) {
    const { rows: [task] } = await this.pool.query(
      'UPDATE tasks SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1 AND deleted_at IS NULL RETURNING *',
      [id]
    );
    
    await this.cache.del(this.generateCacheKey(id));
    await this.cache.delPattern('list:*');
    
    return task;
  }
}

module.exports = TaskModel;
