const Session = require('../models/Session');
const Task = require('../models/Task');

// @desc    Start a new pomodoro session
// @route   POST /api/sessions/start
// @access  Private
exports.startSession = async (req, res, next) => {
  try {
    const { taskId, type = 'focus', duration } = req.body;

    // Auto-set duration from user settings if not provided
    const settings = req.user.settings;
    const defaultDurations = {
      focus: settings.focusDuration,
      short_break: settings.shortBreak,
      long_break: settings.longBreak,
    };

    const session = await Session.create({
      user: req.user._id,
      task: taskId || null,
      type,
      duration: duration || defaultDurations[type],
      status: 'active',
      startedAt: new Date(),
    });

    await session.populate('task', 'title');
    res.status(201).json({ success: true, session });
  } catch (err) {
    next(err);
  }
};

// @desc    Complete or abandon a session
// @route   PUT /api/sessions/:id/end
// @access  Private
exports.endSession = async (req, res, next) => {
  try {
    const { status = 'completed', notes } = req.body;

    const session = await Session.findOne({ _id: req.params.id, user: req.user._id });
    if (!session) return res.status(404).json({ success: false, message: 'Session not found' });
    if (session.status !== 'active')
      return res.status(400).json({ success: false, message: 'Session is not active' });

    const endedAt = new Date();
    session.status = status;
    session.endedAt = endedAt;
    session.actualDuration = Math.round((endedAt - session.startedAt) / 1000); // in seconds
    if (notes) session.notes = notes;
    await session.save();

    // If completed focus session with linked task, increment pomodoros
    if (status === 'completed' && session.type === 'focus' && session.task) {
      await Task.findByIdAndUpdate(session.task, { $inc: { completedPomodoros: 1 } });
    }

    res.json({ success: true, session });
  } catch (err) {
    next(err);
  }
};

// @desc    Get session history
// @route   GET /api/sessions
// @access  Private
exports.getSessions = async (req, res, next) => {
  try {
    const { type, status, limit = 20, page = 1 } = req.query;
    const filter = { user: req.user._id };
    if (type) filter.type = type;
    if (status) filter.status = status;

    const sessions = await Session.find(filter)
      .populate('task', 'title')
      .sort('-startedAt')
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Session.countDocuments(filter);
    res.json({ success: true, total, sessions });
  } catch (err) {
    next(err);
  }
};

// @desc    Get focus stats summary
// @route   GET /api/sessions/stats
// @access  Private
exports.getStats = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [totalStats, todayStats, taskBreakdown] = await Promise.all([
      // All-time stats
      Session.aggregate([
        { $match: { user: userId, status: 'completed', type: 'focus' } },
        { $group: {
          _id: null,
          totalSessions: { $sum: 1 },
          totalMinutes: { $sum: { $divide: ['$actualDuration', 60] } },
        }},
      ]),
      // Today's stats
      Session.aggregate([
        { $match: { user: userId, status: 'completed', type: 'focus', startedAt: { $gte: today } } },
        { $group: {
          _id: null,
          todaySessions: { $sum: 1 },
          todayMinutes: { $sum: { $divide: ['$actualDuration', 60] } },
        }},
      ]),
      // Per-task breakdown
      Session.aggregate([
        { $match: { user: userId, status: 'completed', type: 'focus', task: { $ne: null } } },
        { $group: { _id: '$task', sessions: { $sum: 1 } } },
        { $lookup: { from: 'tasks', localField: '_id', foreignField: '_id', as: 'task' } },
        { $unwind: '$task' },
        { $project: { taskTitle: '$task.title', sessions: 1 } },
        { $sort: { sessions: -1 } },
        { $limit: 5 },
      ]),
    ]);

    res.json({
      success: true,
      stats: {
        allTime: totalStats[0] || { totalSessions: 0, totalMinutes: 0 },
        today: todayStats[0] || { todaySessions: 0, todayMinutes: 0 },
        topTasks: taskBreakdown,
      },
    });
  } catch (err) {
    next(err);
  }
};
