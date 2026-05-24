const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    default: null,
  },
  type: {
    type: String,
    enum: ['focus', 'short_break', 'long_break'],
    default: 'focus',
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'abandoned'],
    default: 'active',
  },
  duration: {
    type: Number,   // planned duration in minutes
    required: true,
  },
  actualDuration: {
    type: Number,   // actual time spent in seconds
    default: 0,
  },
  startedAt: {
    type: Date,
    default: Date.now,
  },
  endedAt: {
    type: Date,
  },
  notes: {
    type: String,
    maxlength: [300, 'Notes cannot exceed 300 characters'],
  },
}, { timestamps: true });

module.exports = mongoose.model('Session', sessionSchema);
