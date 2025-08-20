
const express = require('express');
const router = express.Router();
const contractorController = require('../controllers/contractorController');

// Get all contractors
router.get('/', contractorController.getAll);
// List with search + pagination + sorting
router.get('/list', contractorController.list);

// Get by id
router.get('/:id', contractorController.getById);

// Create contractor
router.post('/', contractorController.create);

// Update contractor details
router.put('/:id', contractorController.update);


// Update contractor email only
router.patch('/:id/email', contractorController.updateEmail);

// Delete contractor
router.delete('/:id', contractorController.remove);

module.exports = router;
