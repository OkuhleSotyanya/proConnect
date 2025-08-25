const express = require('express');
const router = express.Router();
const ClientController = require('../controllers/clientController');
const authenticateToken = require('../middleware/authMiddleware'); // Renamed for clarity

// Logged-in client's own profile routes (accessible only by the 'client' role)
// These routes use the user_id from the token (req.user.user_id)
router.get('/me', authenticateToken(['client']), ClientController.getMyProfile);
router.put('/me', authenticateToken(['client']), ClientController.updateMyProfile);

// Admin-only routes for managing ALL clients
// These routes require an 'admin' role to access
router.get('/', authenticateToken(['admin']), ClientController.getAllClients); // Only admins can get all clients
router.post('/', authenticateToken(['admin']), ClientController.createClient); // Only admins can create clients
router.put('/:id', authenticateToken(['admin']), ClientController.updateClient); // Only admins can update any client
router.delete('/:id', authenticateToken(['admin']), ClientController.deleteClient); // Only admins can delete any client

// No public access to specific client IDs.
// If a non-admin needs to access a specific client's data (e.g., a contractor seeing a client's public profile),
// you'd add a separate route with appropriate permissions, potentially using a different controller method.
// router.get('/:id', authenticateToken(['admin', 'contractor']), ClientController.getClientById); // Example: if contractors can see specific client details

module.exports = router;