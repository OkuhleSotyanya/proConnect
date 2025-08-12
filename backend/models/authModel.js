// authModel.js
const db = require('../config/db');

const User = {
  createUser: async (email, password_hash, role_id) => {
    const sql = `INSERT INTO users (email, password_hash, role_id) VALUES (?, ?, ?)`;
    const [result] = await db.query(sql, [email, password_hash, role_id]);
    return result.insertId;
  },

  createClientDetails: async (user_id, fullname, phone_number, address) => {
    const sql = `INSERT INTO client_details (user_id, fullname, phone_number, address) VALUES (?, ?, ?, ?)`;
    await db.query(sql, [user_id, fullname, phone_number, address]);
  },

  createContractorDetails: async (user_id, full_name, phone_number, address, certification_pdf, card_photo, hourly_rate, job_experience, description) => {
    const sql = `INSERT INTO contractor_details (user_id, full_name, phone_number, address, certification_pdf, card_photo, hourly_rate, job_experience, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    await db.query(sql, [user_id, full_name, phone_number, address, certification_pdf, card_photo, hourly_rate, job_experience, description]);
  },

  createAdminDetails: async (userId, work_email) => {
    const sql = 'INSERT INTO admin_details (user_id, work_email) VALUES (?, ?)';
    const [result] = await db.query(sql, [userId, work_email]);
    return result;
  },

  getAllUsers: async () => {
    const sql = `
      SELECT u.user_id, u.email, r.role_name, u.created_at
      FROM users u
      JOIN roles r ON u.role_id = r.role_id
    `;
    const [rows] = await db.query(sql);
    return rows;
  },

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
      return { affectedRows: 0 };
    }

    values.push(user_id);

    const sql = `UPDATE users SET ${updates.join(', ')} WHERE user_id = ?`;
    const [result] = await db.query(sql, values);
    return result;
  },

  updateAdminDetails: async (user_id, fields) => {
    const updates = [];
    const values = [];

    if (fields.work_email) {
      updates.push('work_email = ?');
      values.push(fields.work_email);
    }

    if (updates.length === 0) {
      throw new Error('No fields to update for admin details');
    }

    values.push(user_id);

    const sql = `UPDATE admin_details SET ${updates.join(', ')} WHERE user_id = ?`;
    const [result] = await db.query(sql, values);
    return result;
  },

  updateClientDetails: async (user_id, fields) => {
    const updates = [];
    const values = [];

    if (fields.fullname) {
      updates.push('fullname = ?');
      values.push(fields.fullname);
    }
    if (fields.phone_number) {
      updates.push('phone_number = ?');
      values.push(fields.phone_number);
    }
    if (fields.address) {
      updates.push('address = ?');
      values.push(fields.address);
    }

    if (updates.length === 0) {
      throw new Error('No fields to update for client details');
    }

    values.push(user_id);

    const sql = `UPDATE client_details SET ${updates.join(', ')} WHERE user_id = ?`;
    const [result] = await db.query(sql, values);
    return result;
  },

  updateContractorDetails: async (user_id, fields) => {
    const updates = [];
    const values = [];

    if (fields.full_name) {
      updates.push('full_name = ?');
      values.push(fields.full_name);
    }
    if (fields.phone_number) {
      updates.push('phone_number = ?');
      values.push(fields.phone_number);
    }
    if (fields.address) {
      updates.push('address = ?');
      values.push(fields.address);
    }
    if (fields.certification_pdf) {
      updates.push('certification_pdf = ?');
      values.push(fields.certification_pdf);
    }
    if (fields.card_photo) {
      updates.push('card_photo = ?');
      values.push(fields.card_photo);
    }
    if (fields.hourly_rate !== undefined) {
      updates.push('hourly_rate = ?');
      values.push(fields.hourly_rate);
    }
    if (fields.job_experience) {
      updates.push('job_experience = ?');
      values.push(fields.job_experience);
    }
    if (fields.description) {
      updates.push('description = ?');
      values.push(fields.description);
    }

    if (updates.length === 0) {
      throw new Error('No fields to update for contractor details');
    }

    values.push(user_id);

    const sql = `UPDATE contractor_details SET ${updates.join(', ')} WHERE user_id = ?`;
    const [result] = await db.query(sql, values);
    return result;
  },

  deleteUser: async (user_id) => {
    const sql = `DELETE FROM users WHERE user_id = ?`;
    const [result] = await db.query(sql, [user_id]);
    return result;
  },

  findByEmail: async (email) => {
    const sql = `
      SELECT u.user_id, u.email, u.password_hash, r.role_name
      FROM users u
      JOIN roles r ON u.role_id = r.role_id
      WHERE u.email = ?
    `;
    const [rows] = await db.query(sql, [email]);
    return rows[0];
  },

  findRoleIdByName: async (role_name) => {
    const sql = `SELECT role_id FROM roles WHERE role_name = ?`;
    const [rows] = await db.query(sql, [role_name]);
    return rows[0]?.role_id;
  }
};

module.exports = User;