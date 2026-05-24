const express = require('express');
const { startSession, endSession, getSessions, getStats } = require('../controllers/sessionController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/', getSessions);
router.get('/stats', getStats);
router.post('/start', startSession);
router.put('/:id/end', endSession);

module.exports = router;
