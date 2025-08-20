// models/authModel.js
const pool = require('../config/db');

const User = {
  async createUser(email, hashedPassword, roleId) {
    const [result] = await pool.query(
      'INSERT INTO users (email, password_hash, role_id) VALUES (?, ?, ?)',
      [email, hashedPassword, roleId]
    );
    return result.insertId;
  },

  async findByEmail(email) {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  },

  async createClientDetails(userId, fullname, phone_number, address) {
    const [result] = await pool.query(
      `INSERT INTO client_details (user_id, fullname, phone_number, address) 
       VALUES (?, ?, ?, ?)`,
      [userId, fullname, phone_number, address]
    );
    return result.insertId;
  },

  async createContractorDetails(userId, details) {
    const {
      full_name,
      phone_number,
      address,
      certification_pdf,
      card_photo,
      hourly_rate,
      job_experience,
      description
    } = details;
    const [result] = await pool.query(
      `INSERT INTO contractor_details 
       (user_id, full_name, phone_number, address, certification_pdf, card_photo, hourly_rate, job_experience, description) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, full_name, phone_number, address, certification_pdf, card_photo, hourly_rate, job_experience, description]
    );
    return result.insertId;
  },

  async createAdminDetails(userId, address) {
    const [result] = await pool.query(
      `INSERT INTO admin_details (user_id, address) VALUES (?, ?)`,
      [userId, address]
    );
    return result.insertId;
  },

  async getAllUsers() {
    const [rows] = await pool.query('SELECT * FROM users');
    return rows;
  },

  async getUserById(userId) {
    const [rows] = await pool.query('SELECT * FROM users WHERE user_id = ?', [userId]);
    return rows[0];
  },

  async updateUser(userId, fields) {
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
    if (fields.role_id) {
      updates.push('role_id = ?');
      values.push(fields.role_id);
    }

    if (updates.length === 0) return false;

    values.push(userId);

    const [result] = await pool.query(
      `UPDATE users SET ${updates.join(', ')} WHERE user_id = ?`,
      values
    );
    return result.affectedRows > 0;
  },

  async updateClientDetails(userId, fields) {
    const updates = [];
    const values = [];

    if (fields.full_name) updates.push('full_name = ?'), values.push(fields.full_name);
    if (fields.phone_number) updates.push('phone_number = ?'), values.push(fields.phone_number);
    if (fields.address) updates.push('address = ?'), values.push(fields.address);

    if (updates.length === 0) return false;

    values.push(userId);

    const [result] = await pool.query(
      `UPDATE client_details SET ${updates.join(', ')} WHERE user_id = ?`,
      values
    );
    return result.affectedRows > 0;
  },

  async updateContractorDetails(userId, fields) {
    const updates = [];
    const values = [];

    if (fields.full_name) updates.push('full_name = ?'), values.push(fields.full_name);
    if (fields.phone_number) updates.push('phone_number = ?'), values.push(fields.phone_number);
    if (fields.address) updates.push('address = ?'), values.push(fields.address);
    if (fields.certification_pdf) updates.push('certification_pdf = ?'), values.push(fields.certification_pdf);
    if (fields.card_photo) updates.push('card_photo = ?'), values.push(fields.card_photo);
    if (fields.hourly_rate) updates.push('hourly_rate = ?'), values.push(fields.hourly_rate);
    if (fields.job_experience) updates.push('job_experience = ?'), values.push(fields.job_experience);
    if (fields.description) updates.push('description = ?'), values.push(fields.description);

    if (updates.length === 0) return false;

    values.push(userId);

    const [result] = await pool.query(
      `UPDATE contractor_details SET ${updates.join(', ')} WHERE user_id = ?`,
      values
    );
    return result.affectedRows > 0;
  },

  async updateAdminDetails(userId, fields) {
    const updates = [];
    const values = [];

    if (fields.address) updates.push('address = ?'), values.push(fields.address);

    if (updates.length === 0) return false;

    values.push(userId);

    const [result] = await pool.query(
      `UPDATE admin_details SET ${updates.join(', ')} WHERE user_id = ?`,
      values
    );
    return result.affectedRows > 0;
  },

  async deleteUser(userId) {
    const [result] = await pool.query('DELETE FROM users WHERE user_id = ?', [userId]);
    return result.affectedRows > 0;
  },
};

module.exports = User;
