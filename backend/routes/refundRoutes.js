// backend/routes/refundRoutes.js
const express = require('express');
const router = express.Router();
const refundController = require('../controllers/refundController');
const authMiddleware = require('../middleware/authMiddleware');

// Route for clients/admin to request a refund
router.post('/request', authMiddleware(['client', 'admin']), refundController.createRefund);

// Route for admin to get all refund requests
router.get('/', authMiddleware(['admin']), refundController.getAllRefunds);

// Route for admin to update a refund's status
router.put('/:id/status', authMiddleware(['admin']), refundController.updateRefundStatus);

module.exports = router;
