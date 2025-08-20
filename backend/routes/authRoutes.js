// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const authController = require('../controllers/authController');

// JWT Middleware
const authenticateMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access token required' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid or expired token' });
    req.user = user;
    next();
  });
};

// Validation handler
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

// Validators
const validateLogin = [check('email').isEmail(), check('password').notEmpty()];
const validateClientRegistration = [
  check('email').isEmail(),
  check('password').isLength({ min: 6 }),
  check('fullname').notEmpty(),
  check('phone_number').matches(/^\d{10}$/),
  check('address').notEmpty(),
];
const validateContractorRegistration = [
  check('email').isEmail(),
  check('password').isLength({ min: 6 }),
  check('full_name').notEmpty(),
  check('phone_number').matches(/^\d{10}$/),
  check('address').notEmpty(),
  check('certification_pdf').notEmpty(),
  check('card_photo').notEmpty(),
  check('hourly_rate').isNumeric(),
  check('job_experience').notEmpty(),
  check('description').notEmpty(),
];
const validateAdminRegistration = [
  check('email').isEmail(),
  check('password').isLength({ min: 6 }),
  check('address').notEmpty(),
];
const validateProfileUpdate = [
  check('email').optional().isEmail(),
  check('password').optional().isLength({ min: 6 }),
  check('full_name').optional().notEmpty(),
  check('phone_number').optional().matches(/^\d{10}$/),
  check('address').optional().notEmpty(),
  check('certification_pdf').optional().notEmpty(),
  check('card_photo').optional().notEmpty(),
  check('hourly_rate').optional().isNumeric(),
  check('job_experience').optional().notEmpty(),
  check('description').optional().notEmpty(),
];

// Routes
router.post('/login', validateLogin, handleValidation, authController.login);
router.post('/register/client', validateClientRegistration, handleValidation, authController.registerClient);
router.post('/register/contractor', validateContractorRegistration, handleValidation, authController.registerContractor);
router.post('/register/admin', authenticateMiddleware, validateAdminRegistration, handleValidation, authController.registerAdmin);

router.get('/profile', authenticateMiddleware, authController.getUserProfile);
router.put('/profile', authenticateMiddleware, validateProfileUpdate, handleValidation, authController.updateUserProfile);
router.delete('/profile', authenticateMiddleware, authController.deleteUser);

module.exports = router;
