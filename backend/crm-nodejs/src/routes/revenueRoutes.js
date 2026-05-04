const express = require('express');
const router = express.Router();
const { daily, monthly, summary } = require('../controllers/revenueController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/summary', authenticate, authorize('ADMIN', 'MANAGER'), summary);
router.get('/daily', authenticate, authorize('ADMIN', 'MANAGER'), daily);
router.get('/monthly', authenticate, authorize('ADMIN', 'MANAGER'), monthly);

module.exports = router;
