const fp = require('fastify-plugin');
const createError = require('http-errors');

async function errorHandler(fastify) {
  fastify.setErrorHandler((error, request, reply) => {
    // Handle validation errors
    if (error.validation) {
      reply.status(400).send({
        success: false,
        error: {
          message: 'Validation error',
          details: error.validation,
          statusCode: 400
        }
      });
      return;
    }

    // Handle HTTP errors
    if (createError.isHttpError(error)) {
      reply.status(error.statusCode).send({
        success: false,
        error: {
          message: error.message,
          statusCode: error.statusCode
        }
      });
      return;
    }

    // Handle database errors
    if (error.code === '23505') { // Unique violation
      reply.status(409).send({
        success: false,
        error: {
          message: 'Resource already exists',
          statusCode: 409
        }
      });
      return;
    }

    // Handle unknown errors
    request.log.error(error);
    reply.status(500).send({
      success: false,
      error: {
        message: 'Internal server error',
        statusCode: 500
      }
    });
  });
}

module.exports = fp(errorHandler);