const dispatcher = require('../dispatchers/DatabaseDispatcher');
const createError = require('http-errors');

class UserService {
  static async createUser(tenantId, newUserData) {
    const [err, newUser] = await dispatcher
      .getTenant(tenantId)
      .Users
      .create(newUserData);

    if (err) {
      throw createError(500, 'Failed to create user');
    }

    return newUser;
  }

  static async getUsers(tenantId, { page, limit }) {
    const [err, users] = await dispatcher
      .getTenant(tenantId)
      .Users
      .findAll(false, limit, (page - 1) * limit);
    
    const [countErr, total] = await dispatcher
      .getTenant(tenantId)
      .Users
      .count();

    if (err || !users) {
      throw createError(404, 'No users found');
    }

    return { users, page, limit, total };
  }

  static async getUser(tenantId, userId) {
    const [err, user] = await dispatcher
      .getTenant(tenantId)
      .Users
      .findById(userId);
    
    if (err || !user) {
      throw createError(404, 'User not found');
    }
    
    return user;
  }

  static async updateUser(tenantId, userId, newUserData) {
    const [err, user] = await dispatcher
      .getTenant(tenantId)
      .Users
      .update(userId, newUserData);
    
    if (err || !user) {
      throw createError(404, 'User not found');
    }
    
    return user;
  }

  static async deleteUser(tenantId, userId) {
    const [err, user] = await dispatcher
      .getTenant(tenantId)
      .Users
      .softDelete(userId);
    
    if (err || !user) {
      throw createError(404, 'User not found');
    }
  }
}

module.exports = UserService;