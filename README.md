# ScrumMaster - Multi-Tenant Task Management API

A production-ready, multi-tenant task management API built with Fastify, PostgreSQL, and Redis. The API provides a secure and scalable solution for managing tasks, users, and comments across multiple organizations (tenants) with complete data isolation.

## 🚀 Features

### Multi-Tenant Architecture
- **Tenant Isolation**: Each tenant gets their own PostgreSQL database
- **Secure Authentication**: API key-based authentication at both admin and tenant levels
- **Dynamic Tenant Creation**: Runtime tenant onboarding with automatic database provisioning

### Core Functionality
- **Task Management**
  - Full CRUD operations with soft delete
  - Task assignment and status tracking
  - Priority levels and deadlines
  - Rich commenting system
- **User Management**
  - User profiles with display names and emails
  - Soft delete support with data integrity
- **Comment System**
  - Task-specific comments
  - User attribution
  - Soft delete capability

### Technical Features
- **Caching with Redis**
  - Configurable caching at model level
  - Customizable TTL per model
  - Cache invalidation strategies
- **Clean Architecture**
  - Controller-Service-Model pattern
  - Separation of concerns
  - Modular and maintainable codebase
- **Request Validation**
  - JSON Schema validation for all endpoints
  - Comprehensive error handling
  - Standardized response formats

## 🛠 Tech Stack

- **Framework**: Fastify
- **Database**: PostgreSQL
- **Caching**: Redis
- **Libraries**:
  - node-postgres (pg)
  - ioredis
  - fastify-plugin
  - http-errors

## 📋 Prerequisites

- Node.js (v14+)
- PostgreSQL (v12+)
- Redis (v6+)

## 🔧 Installation

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/theakhandpatel/scrummaster.git
   cd scrummaster
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Set up environment variables:
   \`\`\`bash
   cp .env.example .env
   # Edit .env with your configuration
   \`\`\`

4. Initialize the database:
   \`\`\`bash
   # Run the admin database initialization script
   psql -U postgres -f src/migrations/init.sql
   \`\`\`

5. Start the server:
   \`\`\`bash
   npm run dev
   \`\`\`

## 🔑 API Authentication

The API uses two types of authentication:

1. **Admin API Key**
   - Required for tenant management operations
   - Set via environment variable \`ADMIN_API_KEY\`
   - Include in headers as \`X-API-Key\`

2. **Tenant API Key**
   - Required for tenant-specific operations
   - Generated during tenant creation
   - Include in headers as \`X-Tenant-API-Key\`

## 📚 API Documentation

### Admin Routes
- \`POST /api/v1/tenants\` - Create new tenant
- \`GET /api/v1/tenants\` - List all tenants

### Tenant Routes
#### Tasks
- \`POST /api/v1/tenants/:tenantId/tasks\` - Create task
- \`GET /api/v1/tenants/:tenantId/tasks\` - List tasks
- \`GET /api/v1/tenants/:tenantId/tasks/:taskId\` - Get task details
- \`PUT /api/v1/tenants/:tenantId/tasks/:taskId\` - Update task
- \`DELETE /api/v1/tenants/:tenantId/tasks/:taskId\` - Delete task

#### Users
- \`POST /api/v1/tenants/:tenantId/users\` - Create user
- \`GET /api/v1/tenants/:tenantId/users\` - List users
- \`GET /api/v1/tenants/:tenantId/users/:userId\` - Get user details
- \`PUT /api/v1/tenants/:tenantId/users/:userId\` - Update user
- \`DELETE /api/v1/tenants/:tenantId/users/:userId\` - Delete user

#### Comments
- \`POST /api/v1/tenants/:tenantId/tasks/:taskId/comments\` - Add comment
- \`GET /api/v1/tenants/:tenantId/tasks/:taskId/comments\` - List comments
- \`GET /api/v1/tenants/:tenantId/tasks/:taskId/comments/:commentId\` - Get comment
- \`DELETE /api/v1/tenants/:tenantId/tasks/:taskId/comments/:commentId\` - Delete comment

## 🔧 Configuration

### Cache Configuration
Configure caching behavior in \`src/config/cache.js\`:

\`\`\`javascript
{
  enabled: true,
  ttl: 3600, // Default TTL in seconds
  prefix: 'cache',
  models: {
    TaskModel: {
      ttl: 1800,
      prefix: 'tasks'
    }
    // ... other model configurations
  }
}
\`\`\`

### Database Configuration
Configure database connections in \`src/config/database.js\`:

\`\`\`javascript
{
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME
}
\`\`\`

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (\`git checkout -b feature/AmazingFeature\`)
3. Commit your changes (\`git commit -m 'Add some AmazingFeature'\`)
4. Push to the branch (\`git push origin feature/AmazingFeature\`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Akhand Patel**
- GitHub: [@theakhandpatel](https://github.com/theakhandpatel)

## 🙏 Acknowledgments

- Fastify team for the excellent framework
- PostgreSQL community
- Redis community