const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/authModel');

// Environment config
const JWT_SECRET = process.env.JWT_SECRET || 'proConnect4People';
const JWT_EXPIRES_IN = '1h';

const authController = {
  // Register new user
  signup: async (req, res) => {
    try {
      const { email, password, role } = req.body;

      if (!email || !password || !role) {
        return res.status(400).json({ message: 'All fields are required.' });
      }

      const validRoles = ['admin', 'client', 'contractor'];
      if (!validRoles.includes(role)) {
        return res.status(400).json({ message: 'Invalid role specified.' });
      }

      // Check if user already exists
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({ message: 'Email already in use.' });
      }

      // Fetch role_id from roles table
      const role_id = await User.findRoleIdByName(role);
      if (!role_id) {
        return res.status(400).json({ message: 'Invalid role specified.' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUserId = await User.createUser(email, hashedPassword, role_id);

      res.status(201).json({ message: 'User created successfully', user_id: newUserId });
    } catch (error) {
      console.error('Signup Error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Login user
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
      }

      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(404).json({ message: 'Invalid credentials.' });
      }

      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials.' });
      }

      const token = jwt.sign(
        { user_id: user.user_id, role: user.role_name },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
      console.error('Login Error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Get all users
  getAll: async (req, res) => {
    try {
      const users = await User.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      console.error('GetAllUsers Error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Get one user
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

  // Update user
  update: async (req, res) => {
    try {
      const userId = req.params.id;
      const { email, password } = req.body;

      const fields = {};
      if (email) fields.email = email;
      if (password) {
        fields.password_hash = await bcrypt.hash(password, 10);
      }

      const result = await User.updateUser(userId, fields);
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'User not found or no changes' });
      }

      res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
      console.error('UpdateUser Error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Delete user
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