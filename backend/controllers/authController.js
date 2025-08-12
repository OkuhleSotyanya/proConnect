// authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/authModel');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = '1h';

// Helper function for password validation
const validatePassword = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (password.length < minLength) {
    return 'Password must be at least 8 characters long.';
  }
  if (!hasUpperCase) {
    return 'Password must contain at least one uppercase letter.';
  }
  if (!hasLowerCase) {
    return 'Password must contain at least one lowercase letter.';
  }
  if (!hasNumber) {
    return 'Password must contain at least one number.';
  }
  if (!hasSpecialChar) {
    return 'Password must contain at least one special character.';
  }
  return null;
};

const authController = {
  signup: async (req, res) => {
    try {
      const {
        email,
        password,
        role,
        fullname,
        phone_number,
        address,
        certification_pdf,
        card_photo,
        hourly_rate,
        job_experience,
        description,
        work_email
      } = req.body;

      if (!email || !password || !role) {
        return res.status(400).json({ message: 'Email, password, and role are required.' });
      }

      // Validate password complexity
      const passwordError = validatePassword(password);
      if (passwordError) {
        return res.status(400).json({ message: passwordError });
      }

      // Role-specific validation
      if (role === 'admin' && !work_email) {
        return res.status(400).json({ message: 'work_email is required for admin.' });
      }
      if (role === 'client' && (!fullname || !phone_number || !address)) {
        return res.status(400).json({ message: 'fullname, phone_number, and address are required for client.' });
      }
      if (role === 'contractor' && (!fullname || !phone_number || !address || !certification_pdf || !card_photo || !hourly_rate || !job_experience || !description)) {
        return res.status(400).json({ message: 'All contractor fields are required.' });
      }
      if (role === 'contractor' && (isNaN(hourly_rate) || hourly_rate < 0)) {
        return res.status(400).json({ message: 'hourly_rate must be a non-negative number.' });
      }

      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({ message: 'Email already in use.' });
      }

      const role_id = await User.findRoleIdByName(role);
      if (!role_id) {
        return res.status(400).json({ message: 'Role not found in database.' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUserId = await User.createUser(email, hashedPassword, role_id);

      // Insert role-specific details
      if (role === 'admin') {
        await User.createAdminDetails(newUserId, work_email);
      } else if (role === 'client') {
        await User.createClientDetails(newUserId, fullname, phone_number, address);
      } else if (role === 'contractor') {
        await User.createContractorDetails(newUserId, fullname, phone_number, address, certification_pdf, card_photo, hourly_rate, job_experience, description);
      }

      res.status(201).json({ message: 'User created successfully', user_id: newUserId });
    } catch (error) {
      console.error('Signup Error:', error);
      if (error.code === 'ER_DBACCESS_DENIED_ERROR' || error.code === 'ER_ACCESS_DENIED_ERROR') {
        return res.status(500).json({ message: 'Database connection error' });
      }
      res.status(500).json({ message: 'Server error' });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
      }

      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }

      if (!user.role_name) {
        return res.status(400).json({ message: 'User role is invalid or missing.' });
      }

      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid password.' });
      }

      if (!JWT_SECRET) {
        return res.status(500).json({ message: 'JWT secret is not configured.' });
      }

      const token = jwt.sign(
        { user_id: user.user_id, role_name: user.role_name },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      res.status(200).json({ message: 'Login successful', token, role_name: user.role_name });
    } catch (error) {
      console.error('Login Error:', error);
      if (error.code === 'ER_DBACCESS_DENIED_ERROR' || error.code === 'ER_ACCESS_DENIED_ERROR') {
        return res.status(500).json({ message: 'Database connection error' });
      }
      res.status(500).json({ message: 'Server error' });
    }
  },

  getAll: async (req, res) => {
    try {
      const users = await User.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      console.error('GetAllUsers Error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  getById: async (req, res) => {
    try {
      const user = await User.getUserById(req.params.id);
      if (!user) return res.status(404).json({ message: 'User not found' });
      res.status(200).json(user);
    } catch (error) {
      console.error('GetUserById Error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  update: async (req, res) => {
    try {
      const userId = req.params.id;
      const { email, password, role, ...roleSpecificFields } = req.body;

      const fields = {};
      if (email) fields.email = email;
      if (password) {
        const passwordError = validatePassword(password);
        if (passwordError) {
          return res.status(400).json({ message: passwordError });
        }
        fields.password_hash = await bcrypt.hash(password, 10);
      }

      if (Object.keys(fields).length > 0) {
        const result = await User.updateUser(userId, fields);
        if (result.affectedRows === 0) {
          return res.status(404).json({ message: 'User not found or no changes' });
        }
      }

      // Update role-specific details if provided
      const user = await User.getUserById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      if (user.role_name === 'admin' && Object.keys(roleSpecificFields).length > 0) {
        await User.updateAdminDetails(userId, roleSpecificFields);
      } else if (user.role_name === 'client' && Object.keys(roleSpecificFields).length > 0) {
        await User.updateClientDetails(userId, roleSpecificFields);
      } else if (user.role_name === 'contractor' && Object.keys(roleSpecificFields).length > 0) {
        if (roleSpecificFields.hourly_rate && (isNaN(roleSpecificFields.hourly_rate) || roleSpecificFields.hourly_rate < 0)) {
          return res.status(400).json({ message: 'hourly_rate must be a non-negative number.' });
        }
        await User.updateContractorDetails(userId, roleSpecificFields);
      }

      res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
      console.error('UpdateUser Error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  delete: async (req, res) => {
    try {
      const result = await User.deleteUser(req.params.id);
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('DeleteUser Error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
};

module.exports = authController;