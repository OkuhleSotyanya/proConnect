// controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const User = require('../models/authModel');

const authController = {
  // User Login
  async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findByEmail(email);

      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const token = jwt.sign(
        { user_id: user.user_id, email: user.email, role_id: user.role_id },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      res.json({
        token,
        user: { user_id: user.user_id, email: user.email, role_id: user.role_id },
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Register Client
  async registerClient(req, res) {
    try {
      const { email, password, fullname, phone_number, address } = req.body;

      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'Email already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const roleId = 2; // Client
      const userId = await User.createUser(email, hashedPassword, roleId);

      await User.createClientDetails(userId, fullname, phone_number, address);

      const token = jwt.sign(
        { user_id: userId, email, role_id: roleId },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      res.status(201).json({ token, user: { user_id: userId, email, role_id: roleId } });
    } catch (error) {
      console.error('Client registration error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Register Contractor
  async registerContractor(req, res) {
    try {
      const {
        email,
        password,
        full_name,
        phone_number,
        address,
        card_photo,
        certification_pdf,
        hourly_rate,
        job_experience,
        description,
      } = req.body;

      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'Email already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const roleId = 3; // Contractor
      const userId = await User.createUser(email, hashedPassword, roleId);

      await User.createContractorDetails(userId, {
        full_name,
        phone_number,
        address,
        certification_pdf,
        card_photo,
        hourly_rate,
        job_experience,
        description,
      });

      const token = jwt.sign(
        { user_id: userId, email, role_id: roleId },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      res.status(201).json({ token, user: { user_id: userId, email, role_id: roleId } });
    } catch (error) {
      console.error('Contractor registration error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Register Admin
  async registerAdmin(req, res) {
    try {
      if (!req.user || req.user.role_id !== 1) {
        return res.status(403).json({ message: 'Only admins can register new admins' });
      }

      const { email, password, address } = req.body;

      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'Email already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const roleId = 1; // Admin
      const userId = await User.createUser(email, hashedPassword, roleId);

      await User.createAdminDetails(userId, address);

      const token = jwt.sign(
        { user_id: userId, email, role_id: roleId },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      res.status(201).json({ token, user: { user_id: userId, email, role_id: roleId } });
    } catch (error) {
      console.error('Admin registration error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Get User Profile
  async getUserProfile(req, res) {
    try {
      const userId = req.user.user_id;
      const user = await User.getUserById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      let details = null;
      if (user.role_id === 1) {
        [details] = await pool.query('SELECT * FROM admin_details WHERE user_id = ?', [userId]);
      } else if (user.role_id === 2) {
        [details] = await pool.query('SELECT * FROM client_details WHERE user_id = ?', [userId]);
      } else if (user.role_id === 3) {
        [details] = await pool.query('SELECT * FROM contractor_details WHERE user_id = ?', [userId]);
      }

      res.json({ user, details: details[0] });
    } catch (error) {
      console.error('Get user profile error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Update User Profile
  async updateUserProfile(req, res) {
    try {
      const userId = req.user.user_id;
      const {
        email,
        password,
        full_name,
        phone_number,
        address,
        certification_pdf,
        card_photo,
        hourly_rate,
        job_experience,
        description,
      } = req.body;

      // Update users table
      const userFields = {};
      if (email) userFields.email = email;
      if (password) userFields.password_hash = await bcrypt.hash(password, 10);

      if (Object.keys(userFields).length > 0) {
        await User.updateUser(userId, userFields);
      }

      // Update role-specific details
      const user = await User.getUserById(userId);
      if (user.role_id === 1) {
        await User.updateAdminDetails(userId, { address });
      } else if (user.role_id === 2) {
        await User.updateClientDetails(userId, { full_name, phone_number, address });
      } else if (user.role_id === 3) {
        await User.updateContractorDetails(userId, {
          full_name,
          phone_number,
          address,
          certification_pdf,
          card_photo,
          hourly_rate,
          job_experience,
          description,
        });
      }

      res.json({ message: 'Profile updated successfully' });
    } catch (error) {
      console.error('Update user profile error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Delete User
  async deleteUser(req, res) {
    try {
      const userId = req.user.user_id;

      const user = await User.getUserById(userId);
      if (user.role_id === 1 && !req.body.allowAdminDelete) {
        return res.status(403).json({
          message: 'Admins cannot delete themselves without explicit permission',
        });
      }

      const deleted = await User.deleteUser(userId);
      if (!deleted) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Delete user error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },
};

module.exports = authController;
