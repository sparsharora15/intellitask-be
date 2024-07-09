const { body , param } = require('express-validator');

const validateTaskCreation = [
  body('taskName').notEmpty().withMessage('Task name is required'),
  body('description').isString().withMessage('Description is required'),
  body('dueDate').optional().isISO8601().toDate().withMessage('Due date must be a valid date'),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Priority must be low, medium, or high'),
  body('projectId').notEmpty().withMessage('Project ID is required').isUUID().withMessage('Project ID must be a valid UUID'),
  body('comments').optional().isArray().withMessage('Comments must be an array'),
];
const validateTaskUpdate = [
  body('taskName').optional().isString().withMessage('Task name must be a string.'),
  body('description').optional().isString().withMessage('Description must be a string.'),
  body('status').optional().isString().withMessage('Status must be a string.'),
  body('dueDate').optional().isISO8601().toDate().withMessage('Due date must be a valid date'),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Priority must be low, medium, or high'),
  body('comments').optional().isArray().withMessage('Comments must be an array'),
  param('taskId').notEmpty().withMessage('Task ID is required').isUUID().withMessage('Task ID must be a valid UUID'),
];

module.exports = { validateTaskCreation , validateTaskUpdate};