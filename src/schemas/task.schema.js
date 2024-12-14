const { paginationSchema, paramsWithTenantSchema, headersSchema } = require('./base.schema');
const { TaskProperties, TaskResponseProperties } = require('../types/Task');

const taskSchema = {
  create: {
    headers: headersSchema,
    params: paramsWithTenantSchema,
    body: {
      type: 'object',
      properties: TaskProperties,
      required: ['title'],
      additionalProperties: false
    },
    response: {
      201: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          data: {
            type: 'object',
            properties: TaskResponseProperties
          },
          message: { type: 'string' }
        }
      }
    }
  },

  list: {
    headers: headersSchema,
    params: paramsWithTenantSchema,
    querystring: {
      type: 'object',
      properties: {
        ...paginationSchema.properties,
        status: TaskProperties.status,
        priority: TaskProperties.priority,
        assignedTo: TaskProperties.assignedTo
      }
    },
    response: {
      200: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          data: {
            type: 'array',
            items: {
              type: 'object',
              properties: TaskResponseProperties
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
        taskId: { type: 'string', pattern: '^[1-9][0-9]*$' }
      },
      required: ['tenantId', 'taskId']
    },
    response: {
      200: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          data: {
            type: 'object',
            properties: {
              ...TaskResponseProperties,
              comments: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'integer' },
                    content: { type: 'string' },
                    userId: { type: 'integer' },
                    userName: { type: 'string' },
                    createdAt: { type: 'string', format: 'date-time' }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};

module.exports = taskSchema;
