const { paginationSchema, paramsWithTenantSchema, headersSchema } = require('./base.schema');

const userProperties = {
  email: { type: 'string', format: 'email', maxLength: 255 },
  displayName: { type: 'string', minLength: 1, maxLength: 255 }
};

const userResponseProperties = {
  ...userProperties,
  id: { type: 'integer' },
  createdAt: { type: 'string', format: 'date-time' },
  updatedAt: { type: 'string', format: 'date-time' },
  deletedAt: { type: 'string', format: 'date-time', nullable: true }
};

const userSchema = {
  create: {
    headers: headersSchema,
    params: paramsWithTenantSchema,
    body: {
      type: 'object',
      properties: userProperties,
      required: ['email', 'displayName'],
      additionalProperties: false
    },
    response: {
      201: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          data: {
            type: 'object',
            properties: userResponseProperties
          },
          message: { type: 'string' }
        }
      }
    }
  },

  list: {
    headers: headersSchema,
    params: paramsWithTenantSchema,
    querystring: paginationSchema,
    response: {
      200: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          data: {
            type: 'array',
            items: {
              type: 'object',
              properties: userResponseProperties
            }
          },
          pagination: {
            type: 'object',
            properties: {
              page: { type: 'integer' },
              limit: { type: 'integer' },
              total: { type: 'integer' },
              totalPages: { type: 'integer' }
            }
          }
        }
      }
    }
  },

  get: {
    headers: headersSchema,
    params: {
      type: 'object',
      properties: {
        ...paramsWithTenantSchema.properties,
        userId: { type: 'string', pattern: '^[1-9][0-9]*$' }
      },
      required: ['tenantId', 'userId']
    },
    response: {
      200: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          data: {
            type: 'object',
            properties: userResponseProperties
          }
        }
      }
    }
  },

  update: {
    headers: headersSchema,
    params: {
      type: 'object',
      properties: {
        ...paramsWithTenantSchema.properties,
        userId: { type: 'string', pattern: '^[1-9][0-9]*$' }
      },
      required: ['tenantId', 'userId']
    },
    body: {
      type: 'object',
      properties: userProperties,
      additionalProperties: false
    },
    response: {
      200: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          data: {
            type: 'object',
            properties: userResponseProperties
          },
          message: { type: 'string' }
        }
      }
    }
  },

  delete: {
    headers: headersSchema,
    params: {
      type: 'object',
      properties: {
        ...paramsWithTenantSchema.properties,
        userId: { type: 'string', pattern: '^[1-9][0-9]*$' }
      },
      required: ['tenantId', 'userId']
    },
    response: {
      204: {
        type: 'null'
      }
    }
  }
};

module.exports = userSchema;