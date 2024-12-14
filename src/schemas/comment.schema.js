const { paramsWithTenantSchema, headersSchema } = require('./base.schema');

const commentSchema = {
  create: {
    headers: headersSchema,
    params: {
      type: 'object',
      properties: {
        ...paramsWithTenantSchema.properties,
        taskId: { type: 'string', pattern: '^[1-9][0-9]*$' }
      },
      required: ['tenantId', 'taskId']
    },
    body: {
      type: 'object',
      properties: {
        content: { type: 'string', minLength: 1 }
      },
      required: ['content'],
      additionalProperties: false
    }
  },

  list: {
    headers: headersSchema,
    params: {
      type: 'object',
      properties: {
        ...paramsWithTenantSchema.properties,
        taskId: { type: 'string', pattern: '^[1-9][0-9]*$' }
      },
      required: ['tenantId', 'taskId']
    }
  },

  get: {
    headers: headersSchema,
    params: {
      type: 'object',
      properties: {
        ...paramsWithTenantSchema.properties,
        taskId: { type: 'string', pattern: '^[1-9][0-9]*$' },
        commentId: { type: 'string', pattern: '^[1-9][0-9]*$' }
      },
      required: ['tenantId', 'taskId', 'commentId']
    }
  },

  delete: {
    headers: headersSchema,
    params: {
      type: 'object',
      properties: {
        ...paramsWithTenantSchema.properties,
        taskId: { type: 'string', pattern: '^[1-9][0-9]*$' },
        commentId: { type: 'string', pattern: '^[1-9][0-9]*$' }
      },
      required: ['tenantId', 'taskId', 'commentId']
    }
  }
};

module.exports = commentSchema;