const { paginationSchema, paramsWithTenantSchema, headersSchema } = require('./base.schema');

const taskProperties = {
  title: { type: 'string', minLength: 1, maxLength: 255 },
  description: { type: 'string' },
  assignedTo: { type: 'integer' },
  deadline: { type: 'string', format: 'date-time' },
  status: { 
    type: 'string', 
    enum: ['pending', 'in_progress', 'completed', 'blocked']
  },
  priority: {
    type: 'string',
    enum: ['low', 'medium', 'high', 'urgent']
  }
};

const taskResponseProperties = {
  ...taskProperties,
  id: { type: 'integer' },
  createdBy: { type: 'integer' },
  createdAt: { type: 'string', format: 'date-time' },
  updatedAt: { type: 'string', format: 'date-time' },
  deletedAt: { type: 'string', format: 'date-time', nullable: true },
  creatorName: { type: 'string' },
  assigneeName: { type: 'string', nullable: true }
};

const taskSchema = {
  create: {
    headers: headersSchema,
    params: paramsWithTenantSchema,
    body: {
      type: 'object',
      properties: taskProperties,
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
            properties: taskResponseProperties
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
        status: taskProperties.status,
        priority: taskProperties.priority,
        assignedTo: taskProperties.assignedTo
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
              properties: taskResponseProperties
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
              ...taskResponseProperties,
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