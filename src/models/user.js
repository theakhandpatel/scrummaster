const BaseModel = require('./baseModel');

class UserModel extends BaseModel {
  constructor(pool) {
    super(pool);
  }

  async create(userData) {
    try {
      const { rows: [user] } = await this.pool.query(
        'INSERT INTO users (email, display_name) VALUES ($1, $2) RETURNING *',
        [userData.email, userData.displayName]
      );
      return [null, user];
    } catch (err) {
      return [err, null];
    }
  }

  async findAll(includeDeleted = false) {
    try {
      const query = includeDeleted 
        ? 'SELECT * FROM users ORDER BY created_at DESC'
        : 'SELECT * FROM users WHERE deleted_at IS NULL ORDER BY created_at DESC';
      
      const { rows } = await this.pool.query(query);
      return [null, rows];
    } catch (err) {
      return [err, null];
    }
  }

  async findById(id, includeDeleted = false) {
    try {
      const query = includeDeleted
        ? 'SELECT * FROM users WHERE id = $1'
        : 'SELECT * FROM users WHERE id = $1 AND deleted_at IS NULL';

      const { rows: [user] } = await this.pool.query(query, [id]);
      return [null, user];
    } catch (err) {
      return [err, null];
    }
  }

  async update(id, userData) {
    try {
      const { rows: [user] } = await this.pool.query(
        'UPDATE users SET email = $1, display_name = $2 WHERE id = $3 AND deleted_at IS NULL RETURNING *',
        [userData.email, userData.displayName, id]
      );
      return [null, user];
    } catch (err) {
      return [err, null];
    }
  }

  async softDelete(id) {
    try {
      const { rows: [user] } = await this.pool.query(
        'UPDATE users SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1 AND deleted_at IS NULL RETURNING *',
        [id]
      );
      return [null, user];
    } catch (err) {
      return [err, null];
    }
  }
}

module.exports = UserModel;
