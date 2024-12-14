const BaseModel = require('./baseModel');

class UserModel extends BaseModel {
  constructor(pool, cacheOptions = {}) {
    super(pool, cacheOptions);
  }

  async create(data) {
    const { rows: [user] } = await this.pool.query(
      'INSERT INTO users (email, display_name) VALUES ($1, $2) RETURNING *',
      [data.email, data.displayName]
    );
    
    await this.cache.delPattern('list:*');
    return user;
  }

  async findAll(includeDeleted = false) {
    const cacheKey = this.generateListCacheKey(`deleted:${includeDeleted}`);
    const cachedUsers = await this.cache.get(cacheKey);
    
    if (cachedUsers) {
      return cachedUsers;
    }

    const query = includeDeleted 
      ? 'SELECT * FROM users ORDER BY created_at DESC'
      : 'SELECT * FROM users WHERE deleted_at IS NULL ORDER BY created_at DESC';
    
    const { rows } = await this.pool.query(query);
    await this.cache.set(cacheKey, rows);
    return rows;
  }

  async findById(id, includeDeleted = false) {
    const cacheKey = this.generateCacheKey(`${id}:${includeDeleted}`);
    const cachedUser = await this.cache.get(cacheKey);
    
    if (cachedUser) {
      return cachedUser;
    }

    const query = includeDeleted
      ? 'SELECT * FROM users WHERE id = $1'
      : 'SELECT * FROM users WHERE id = $1 AND deleted_at IS NULL';

    const { rows: [user] } = await this.pool.query(query, [id]);

    if (user) {
      await this.cache.set(cacheKey, user);
    }
    
    return user;
  }

  async update(id, data) {
    const { rows: [user] } = await this.pool.query(
      'UPDATE users SET email = $1, display_name = $2 WHERE id = $3 AND deleted_at IS NULL RETURNING *',
      [data.email, data.displayName, id]
    );

    await this.cache.del(this.generateCacheKey(id));
    await this.cache.delPattern('list:*');
    
    return user;
  }

  async softDelete(id) {
    const { rows: [user] } = await this.pool.query(
      'UPDATE users SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1 AND deleted_at IS NULL RETURNING *',
      [id]
    );
    
    await this.cache.del(this.generateCacheKey(id));
    await this.cache.delPattern('list:*');
    
    return user;
  }
}

module.exports = UserModel;