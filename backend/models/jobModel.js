// jobModel.js
const pool = require('../config/db');

const validStatuses = ['pending', 'accepted', 'rejected', 'in_progress', 'completed', 'cancelled'];

const JobModel = {
  async validateUser(userId, roleName) {
    const [rows] = await pool.execute(
      'SELECT 1 FROM users u JOIN roles r ON u.role_id = r.role_id WHERE u.user_id = ? AND r.role_name = ?',
      [userId, roleName]
    );
    return rows.length > 0;
  },

  async createJob(clientId, contractorId, serviceType, description, location, jobDate) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      const [result] = await connection.execute(
        `INSERT INTO jobs (client_id, contractor_id, service_type, description, location, job_date, status)
         VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
        [clientId, contractorId, serviceType, description, location, jobDate]
      );
      await connection.commit();
      return result.insertId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  async getJobsForContractor(contractorId, statusFilter = null, limit = 10, offset = 0) {
    if (statusFilter && !validStatuses.includes(statusFilter)) {
      throw new Error('Invalid status filter');
    }
    limit = Math.max(0, parseInt(limit));
    offset = Math.max(0, parseInt(offset));

    let query = `
      SELECT j.*, c.fullname AS client_name, ctr.fullname AS contractor_name
      FROM jobs j
      JOIN client_details c ON j.client_id = c.user_id
      JOIN contractor_details ctr ON j.contractor_id = ctr.user_id
      WHERE j.contractor_id = ?
    `;
    const params = [contractorId];
    if (statusFilter) {
      query += ' AND j.status = ?';
      params.push(statusFilter);
    }
    query += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);
    const [rows] = await pool.execute(query, params);
    return rows;
  },

  async getJobsForClient(clientId, statusFilter = null, limit = 10, offset = 0) {
    if (statusFilter && !validStatuses.includes(statusFilter)) {
      throw new Error('Invalid status filter');
    }
    limit = Math.max(0, parseInt(limit));
    offset = Math.max(0, parseInt(offset));

    let query = `
      SELECT j.*, c.fullname AS client_name, ctr.fullname AS contractor_name
      FROM jobs j
      JOIN client_details c ON j.client_id = c.user_id
      JOIN contractor_details ctr ON j.contractor_id = ctr.user_id
      WHERE j.client_id = ?
    `;
    const params = [clientId];
    if (statusFilter) {
      query += ' AND j.status = ?';
      params.push(statusFilter);
    }
    query += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);
    const [rows] = await pool.execute(query, params);
    return rows;
  },

  async getAllJobs(statusFilter = null, limit = 10, offset = 0) {
    if (statusFilter && !validStatuses.includes(statusFilter)) {
      throw new Error('Invalid status filter');
    }
    limit = Math.max(0, parseInt(limit));
    offset = Math.max(0, parseInt(offset));

    let query = `
      SELECT j.*, c.fullname AS client_name, ctr.fullname AS contractor_name
      FROM jobs j
      JOIN client_details c ON j.client_id = c.user_id
      JOIN contractor_details ctr ON j.contractor_id = ctr.user_id
      WHERE 1=1
    `;
    const params = [];
    if (statusFilter) {
      query += ' AND j.status = ?';
      params.push(statusFilter);
    }
    query += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);
    const [rows] = await pool.execute(query, params);
    return rows;
  },

  async updateJobStatus(jobId, status) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      const [result] = await connection.execute(
        `UPDATE jobs SET status = ? WHERE job_id = ?`,
        [status, jobId]
      );
      await connection.commit();
      return result.affectedRows > 0;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  async getClientIdByJobId(jobId) {
    const [rows] = await pool.execute(
      `SELECT client_id FROM jobs WHERE job_id = ? LIMIT 1`,
      [jobId]
    );
    return rows.length > 0 ? rows[0].client_id : null;
  },

  async getJobById(jobId) {
    const [rows] = await pool.execute(
      `SELECT * FROM jobs WHERE job_id = ? LIMIT 1`,
      [jobId]
    );
    return rows[0] || null;
  }
};

module.exports = JobModel;
