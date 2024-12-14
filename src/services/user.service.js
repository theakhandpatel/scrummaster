const UserModel = require('../models/user');
const { getTenantPool } = require('../config/database');

class UserService {
  static async createUser(tenantId, userData) {
    const pool = await getTenantPool(tenantId);
    const userModel = new UserModel(pool, {
      prefix: `tenant:${tenantId}:users`,
      ttl: 3600,
      enabled: true
    });
    return await userModel.create(userData);
  }

  static async getUsers(tenantId, { page, limit }) {
    const pool = await getTenantPool(tenantId);
    const userModel = new UserModel(pool, {
      prefix: `tenant:${tenantId}:users`,
      ttl: 3600,
      enabled: true
    });
    
    const offset = (page - 1) * limit;
    const users = await userModel.findAll(false, limit, offset);
    const total = await userModel.count();

    return {
      users,
      page,
      limit,
      total
    };
  }

  static async getUser(tenantId, userId) {
    const pool = await getTenantPool(tenantId);
    const userModel = new UserModel(pool, {
      prefix: `tenant:${tenantId}:users`,
      ttl: 3600,
      enabled: true
    });
    return await userModel.findById(userId);
  }

  static async updateUser(tenantId, userId, userData) {
    const pool = await getTenantPool(tenantId);
    const userModel = new UserModel(pool, {
      prefix: `tenant:${tenantId}:users`,
      ttl: 3600,
      enabled: true
    });
    return await userModel.update(userId, userData);
  }

  static async deleteUser(tenantId, userId) {
    const pool = await getTenantPool(tenantId);
    const userModel = new UserModel(pool, {
      prefix: `tenant:${tenantId}:users`,
      ttl: 3600,
      enabled: true
    });
    await userModel.softDelete(userId);
  }
}

module.exports = UserService;