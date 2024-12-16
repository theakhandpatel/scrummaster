const UserService = require('../services/user.service');
const ResponseFormatter = require('../utils/responseFormatter');
const { handleServiceError } = require('../utils/errors/errorHandler');

class UserController {
  static async createUser(request, reply) {
    const { tenantId } = request.params;
    const [error, user] = await UserService.createUser(tenantId, request.body);

    if (error) {
      return handleServiceError(error, reply);
    }

    reply.code(201).send(ResponseFormatter.success(user, 'User created successfully'));
  }

  static async getUsers(request, reply) {
    const { tenantId } = request.params;
    const { page = 1, limit = 10 } = request.query;
    
    const [error, result] = await UserService.getUsers(tenantId, {
      page: parseInt(page),
      limit: parseInt(limit)
    });

    if (error) {
      return handleServiceError(error, reply);
    }

    reply.send(ResponseFormatter.paginate(
      result.users,
      result.page,
      result.limit,
      result.total
    ));
  }

  static async getUser(request, reply) {
    const { tenantId, userId } = request.params;
    const [error, user] = await UserService.getUser(tenantId, userId);

    if (error) {
      return handleServiceError(error, reply);
    }

    reply.send(ResponseFormatter.success(user));
  }

  static async updateUser(request, reply) {
    const { tenantId, userId } = request.params;
    const [error, user] = await UserService.updateUser(tenantId, userId, request.body);

    if (error) {
      return handleServiceError(error, reply);
    }

    reply.send(ResponseFormatter.success(user, 'User updated successfully'));
  }

  static async deleteUser(request, reply) {
    const { tenantId, userId } = request.params;
    const [error] = await UserService.deleteUser(tenantId, userId);

    if (error) {
      return handleServiceError(error, reply);
    }

    reply.code(204).send();
  }
}

module.exports = UserController;
