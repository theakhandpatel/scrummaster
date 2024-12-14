/**
 * Task properties.
 * @typedef {Object} TaskProperties
 * @property {string} title - Title of the task.
 * @property {string} description - Description of the task.
 * @property {number} assignedTo - ID of the user assigned to the task.
 * @property {string} deadline - Deadline of the task in ISO 8601 format.
 * @property {string} status - Status of the task. One of 'pending', 'in_progress', 'completed', 'blocked'.
 * @property {string} priority - Priority of the task. One of 'low', 'medium', 'high', 'urgent'.
 */

/**
 * Task response properties.
 * @typedef {Object} TaskResponseProperties
 * @property {number} id - ID of the task.
 * @property {number} createdBy - ID of the user who created the task.
 * @property {string} createdAt - Timestamp when the task was created in ISO 8601 format.
 * @property {string} updatedAt - Timestamp when the task was last updated in ISO 8601 format.
 * @property {string} deletedAt - Timestamp when the task was deleted in ISO 8601 format, nullable.
 * @property {string} creatorName - Name of the user who created the task.
 * @property {string} assigneeName - Name of the user assigned to the task, nullable.
 * @property {string} title - Title of the task.
 * @property {string} description - Description of the task.
 * @property {number} assignedTo - ID of the user assigned to the task.
 * @property {string} deadline - Deadline of the task in ISO 8601 format.
 * @property {string} status - Status of the task. One of 'pending', 'in_progress', 'completed', 'blocked'.
 * @property {string} priority - Priority of the task. One of 'low', 'medium', 'high', 'urgent'.
 */

module.exports = {
  TaskProperties,
  TaskResponseProperties
};
