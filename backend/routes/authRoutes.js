const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');             
const authController = require('../controllers/authController');
const multer = require('multer');
const path = require('path');

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
  check('fullname').optional().notEmpty(),
  check('phone_number').optional().matches(/^\d{10}$/),
  check('address').optional().notEmpty(),
  check('hourly_rate').optional().isNumeric(),
  check('job_experience').optional().notEmpty(),
  check('description').optional().notEmpty(),
];

// Multer config for profile files
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'Uploads/'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|pdf/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    cb(null, extname && mimetype);
  },
});

// Dynamic middleware for /register/admin
const dynamicAdminAuth = async (req, res, next) => {
  try {
    const [admins] = await pool.query('SELECT user_id FROM users WHERE role_id = 1 LIMIT 1');
    if (admins.length === 0) return next();
    return authenticateMiddleware(req, res, next);
  } catch (error) {
    console.error('Error checking existing admins:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Routes
router.post('/login', validateLogin, handleValidation, authController.login);
router.post('/register/client', validateClientRegistration, handleValidation, authController.registerClient);
router.post('/register/contractor', validateContractorRegistration, handleValidation, authController.registerContractor);
router.post('/register/admin', dynamicAdminAuth, validateAdminRegistration, handleValidation, authController.registerAdmin);

// Profile routes
router.get('/profile', authenticateMiddleware, authController.getUserProfile);
router.put(
  '/profile/update',
  authenticateMiddleware,
  upload.fields([
    { name: 'card_photo', maxCount: 1 },
    { name: 'certification_pdf', maxCount: 1 }
  ]),
  validateProfileUpdate,
  handleValidation,
  authController.updateUserProfile
);
router.delete('/profile/delete', authenticateMiddleware, authController.deleteUser);

module.exports = router;
