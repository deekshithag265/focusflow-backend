const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters'],
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters'],
  },
  status: {
    type: String,
    enum: ['todo', 'in_progress', 'completed'],
    default: 'todo',
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  },
  estimatedPomodoros: {
    type: Number,
    default: 1,
    min: 1,
  },
  completedPomodoros: {
    type: Number,
    default: 0,
  },
  dueDate: {
    type: Date,
  },
  tags: [{ type: String, trim: true }],
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
