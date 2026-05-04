const express = require('express');
const router = express.Router();
const { getAll, getById, create, update, remove } = require('../controllers/productController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', authenticate, getAll);          // All roles
router.get('/:id', authenticate, getById);       // All roles
router.post('/', authenticate, authorize('ADMIN', 'MANAGER'), create);
router.put('/:id', authenticate, authorize('ADMIN', 'MANAGER'), update);
router.delete('/:id', authenticate, authorize('ADMIN'), remove);

module.exports = router;
