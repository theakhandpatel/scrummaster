const UserService = require('../services/user.service');
const ResponseFormatter = require('../utils/responseFormatter');

class UserController {
  static async createUser(request, reply) {
    try {
      const { tenantId } = request.params;
      const user = await UserService.createUser(tenantId, request.body);
      reply.code(201).send(ResponseFormatter.success(user, 'User created successfully'));
    } catch (error) {
      reply.code(error.statusCode || 500)
        .send(ResponseFormatter.error(error.message));
    }
  }

  static async getUsers(request, reply) {
    try {
      const { tenantId } = request.params;
      const { page = 1, limit = 10 } = request.query;
      
      const result = await UserService.getUsers(tenantId, {
        page: parseInt(page),
        limit: parseInt(limit)
      });
      
      reply.send(ResponseFormatter.paginate(
        result.users,
        result.page,
        result.limit,
        result.total
      ));
    } catch (error) {
      reply.code(error.statusCode || 500)
        .send(ResponseFormatter.error(error.message));
    }
  }

  static async getUser(request, reply) {
    try {
      const { tenantId, userId } = request.params;
      const user = await UserService.getUser(tenantId, userId);
      
      if (!user) {
        return reply.code(404)
          .send(ResponseFormatter.error('User not found', 404));
      }
      
      reply.send(ResponseFormatter.success(user));
    } catch (error) {
      reply.code(error.statusCode || 500)
        .send(ResponseFormatter.error(error.message));
    }
  }

  static async updateUser(request, reply) {
    try {
      const { tenantId, userId } = request.params;
      const user = await UserService.updateUser(tenantId, userId, request.body);
      
      if (!user) {
        return reply.code(404)
          .send(ResponseFormatter.error('User not found', 404));
      }
      
      reply.send(ResponseFormatter.success(user, 'User updated successfully'));
    } catch (error) {
      reply.code(error.statusCode || 500)
        .send(ResponseFormatter.error(error.message));
    }
  }

  static async deleteUser(request, reply) {
    try {
      const { tenantId, userId } = request.params;
      await UserService.deleteUser(tenantId, userId);
      reply.code(204).send();
    } catch (error) {
      reply.code(error.statusCode || 500)
        .send(ResponseFormatter.error(error.message));
    }
  }
}

module.exports = UserController;