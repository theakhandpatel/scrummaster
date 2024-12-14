// Common schema definitions
const paginationSchema = {
  type: 'object',
  properties: {
    page: { type: 'integer', minimum: 1, default: 1 },
    limit: { type: 'integer', minimum: 1, maximum: 100, default: 10 }
  }
};

const paramsWithTenantSchema = {
  type: 'object',
  properties: {
    tenantId: { type: 'string', pattern: '^[1-9][0-9]*$' }
  },
  required: ['tenantId']
};

const headersSchema = {
  type: 'object',
  properties: {
    'x-api-key': { type: 'string', minLength: 32 }
  },
  required: ['x-api-key']
};

module.exports = {
  paginationSchema,
  paramsWithTenantSchema,
  headersSchema
};