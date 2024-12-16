const BaseModel = require('./baseModel');

class UserModel extends BaseModel {
  constructor(pool) {
    super(pool);
  }

  async create(data) {
    const { rows: [user] } = await this.pool.query(
      'INSERT INTO users (email, display_name) VALUES ($1, $2) RETURNING *',
      [data.email, data.displayName]
    );
    return user;
  }

  async findAll(includeDeleted = false) {
    const query = includeDeleted 
      ? 'SELECT * FROM users ORDER BY created_at DESC'
      : 'SELECT * FROM users WHERE deleted_at IS NULL ORDER BY created_at DESC';
    
    const { rows } = await this.pool.query(query);
    return rows;
  }

  async findById(id, includeDeleted = false) {

    const query = includeDeleted
      ? 'SELECT * FROM users WHERE id = $1'
      : 'SELECT * FROM users WHERE id = $1 AND deleted_at IS NULL';

    const { rows: [user] } = await this.pool.query(query, [id]);

    return user;
  }

  async update(id, data) {
    const { rows: [user] } = await this.pool.query(
      'UPDATE users SET email = $1, display_name = $2 WHERE id = $3 AND deleted_at IS NULL RETURNING *',
      [data.email, data.displayName, id]
    );
    
    return user;
  }

  async softDelete(id) {
    const { rows: [user] } = await this.pool.query(
      'UPDATE users SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1 AND deleted_at IS NULL RETURNING *',
      [id]
    );
    
    return user;
  }
}

module.exports = UserModel;