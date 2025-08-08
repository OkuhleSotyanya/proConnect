
const express = require('express');
const router = express.Router();
const userController = require('../controllers/authController');

// Authentication routes
router.post('/login', userController.login);
router.post('/signup', userController.signup);

// CRUD
router.get('/', userController.getAll);         
router.get('/:id', userController.getById);   
router.put('/:id', userController.update);  
router.delete('/:id', userController.delete);  

module.exports = router;
