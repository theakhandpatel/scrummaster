const dispatcher = require('../dispatchers/DatabaseDispatcher');
const createError = require('http-errors');

class UserService {
  static async createUser(tenantId, userData) {
    const user = await dispatcher
      .getTenant(tenantId)
      .Users
      .create(userData);
    return user;
  }

  static async getUsers(tenantId, { page, limit }) {
    const users = await dispatcher
      .getTenant(tenantId)
      .Users
      .findAll(false, limit, (page - 1) * limit);
    
    const total = await dispatcher
      .getTenant(tenantId)
      .Users
      .count();

    if (!users) {
      throw createError(404, 'No users found');
    }

    return { users, page, limit, total };
  }

  static async getUser(tenantId, userId) {
    const user = await dispatcher
      .getTenant(tenantId)
      .Users
      .findById(userId);
    
    if (!user) {
      throw createError(404, 'User not found');
    }
    
    return user;
  }

  static async updateUser(tenantId, userId, userData) {
    const user = await dispatcher
      .getTenant(tenantId)
      .Users
      .update(userId, userData);
    
    if (!user) {
      throw createError(404, 'User not found');
    }
    
    return user;
  }

  static async deleteUser(tenantId, userId) {
    const user = await dispatcher
      .getTenant(tenantId)
      .Users
      .softDelete(userId);
    
    if (!user) {
      throw createError(404, 'User not found');
    }
  }
}

module.exports = UserService;