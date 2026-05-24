const express = require('express');
const { body } = require('express-validator');
const { getTasks, getTask, createTask, updateTask, deleteTask } = require('../controllers/taskController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getTasks)
  .post([
    body('title').trim().notEmpty().withMessage('Task title is required'),
    body('priority').optional().isIn(['low', 'medium', 'high']),
    body('estimatedPomodoros').optional().isInt({ min: 1 }),
  ], createTask);

router.route('/:id')
  .get(getTask)
  .put(updateTask)
  .delete(deleteTask);

module.exports = router;
