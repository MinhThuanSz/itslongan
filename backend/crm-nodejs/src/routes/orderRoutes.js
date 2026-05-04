const express = require('express');
const router = express.Router();
const { getAll, getById, create, updateStatus, adminCreate } = require('../controllers/orderController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', authenticate, getAll);
router.get('/:id', authenticate, getById);
router.post('/', authenticate, create);  // Customer đặt hàng từ cart
router.post('/admin-create', authenticate, authorize('ADMIN', 'MANAGER'), adminCreate);
router.put('/:id/status', authenticate, authorize('ADMIN', 'MANAGER'), updateStatus);

module.exports = router;
