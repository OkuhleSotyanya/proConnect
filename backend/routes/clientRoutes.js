const express = require('express');
const router = express.Router();
const ClientController = require('../controllers/clientController');
const authenticateToken = require('../middleware/authMiddleware');

// Client Routes
router.get('/', ClientController.getAllClients);

// Logged-in client profile routes
router.get('/me', authenticateToken, ClientController.getMyProfile);
router.put('/me', authenticateToken, ClientController.updateMyProfile);

// Client-specific routes
router.get('/:id', ClientController.getClientById);
router.post('/', ClientController.createClient);
router.put('/:id', ClientController.updateClient);
router.delete('/:id', ClientController.deleteClient);



module.exports = router;
