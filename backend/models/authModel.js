const db = require('../config/db');

const User = {
  // Create user
  createUser: async (email, password_hash, role_id) => {
    const sql = `INSERT INTO users (email, password_hash, role_id) VALUES (?, ?, ?)`;
    const [result] = await db.query(sql, [email, password_hash, role_id]);
    return result.insertId;
  },

  // Read all users
  getAllUsers: async () => {
    const sql = `
      SELECT u.user_id, u.email, r.role_name, u.created_at
      FROM users u
      JOIN roles r ON u.role_id = r.role_id
    `;
    const [rows] = await db.query(sql);
    return rows;
  },

  // Read one user by ID
  getUserById: async (user_id) => {
    const sql = `
      SELECT u.user_id, u.email, r.role_name, u.created_at
      FROM users u
      JOIN roles r ON u.role_id = r.role_id
      WHERE u.user_id = ?
    `;
    const [rows] = await db.query(sql, [user_id]);
    return rows[0];
  },

  // Update user email/password
  updateUser: async (user_id, fields) => {
    const updates = [];
    const values = [];

    if (fields.email) {
      updates.push('email = ?');
      values.push(fields.email);
    }
    if (fields.password_hash) {
      updates.push('password_hash = ?');
      values.push(fields.password_hash);
    }

    if (updates.length === 0) {
      throw new Error('No fields to update');
    }

    values.push(user_id);

    const sql = `UPDATE users SET ${updates.join(', ')} WHERE user_id = ?`;
    const [result] = await db.query(sql, values);
    return result;
  },

  // Delete user
  deleteUser: async (user_id) => {
    const sql = `DELETE FROM users WHERE user_id = ?`;
    const [result] = await db.query(sql, [user_id]);
    return result;
  },

  // Find user by email
  findByEmail: async (email) => {
    const sql = `
      SELECT u.user_id, u.email, u.password_hash, r.role_name
      FROM users u
      JOIN roles r ON u.role_id = r.role_id
      WHERE u.email = ?
    `;
    const [rows] = await db.query(sql, [email]);
    return rows[0]; // return first match
  },

  // Find role_id by role_name
  findRoleIdByName: async (role_name) => {
    const sql = `SELECT role_id FROM roles WHERE role_name = ?`;
    const [rows] = await db.query(sql, [role_name]);
    return rows[0]?.role_id; // Return role_id or undefined if not found
  }
};

module.exports = User;