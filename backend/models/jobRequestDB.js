const pool = require("../config/db");

// Fetch jobs for a specific contractor
const getjobRequest = async (contractorId) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
          job_request.job_id,
          job_request.service_type,
          job_request.status,
          job_request.description,
          job_request.location,
          job_request.job_date,
          job_request.amount,
          client_details.fullname AS client_name,
          client_details.phone_number AS client_phone
      FROM job_request
      LEFT JOIN client_details 
          ON job_request.client_id = client_details.user_id
      LEFT JOIN users 
          ON client_details.user_id = users.user_id
      WHERE job_request.status = 'request'
        AND job_request.contractor_id = ?
    `, [contractorId]);

    return rows;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

// Fetch pending jobs for a specific contractor
const getjobPending = async (contractorId) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
          job_request.job_id,
          job_request.service_type,
          job_request.status,
          job_request.description,
          job_request.location,
          job_request.job_date,
          job_request.amount,
          client_details.fullname AS client_name,
          client_details.phone_number AS client_phone
      FROM job_request
      LEFT JOIN client_details 
          ON job_request.client_id = client_details.user_id
      LEFT JOIN users 
          ON client_details.user_id = users.user_id
      WHERE job_request.status = 'pending'
        AND job_request.contractor_id = ?
    `, [contractorId]);

    return rows;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

// Accept a job
const acceptJobById = async (id) => {
  await pool.query(
    `UPDATE job_request SET status = 'pending' WHERE job_id = ?`,
    [id]
  );
};

// Deny a job
const denyJobById = async (id) => {
  await pool.query(
    `UPDATE job_request SET status = 'denied' WHERE job_id = ?`,
    [id]
  );
};

// Delete a job with client ownership check or admin override
const deleteJobRequest = async (jobId, clientId, role) => {
  try {
    const [jobRows] = await pool.query(
      `SELECT client_id FROM job_request WHERE job_id = ?`,
      [jobId]
    );
    if (jobRows.length === 0) {
      throw new Error('Job not found');
    }
    if (role !== 'admin' && jobRows[0].client_id !== Number(clientId)) {
      throw new Error('Unauthorized: Only the client who created the job or an admin can delete it');
    }
    const [result] = await pool.query('DELETE FROM job_request WHERE job_id = ?', [jobId]);
    return result.affectedRows > 0;
  } catch (error) {
    console.error('Database query error (deleteJobRequest):', {
      message: error.message,
      stack: error.stack,
      sqlMessage: error.sqlMessage,
      sqlState: error.sqlState,
      code: error.code
    });
    throw error;
  }
};

// Complete a job
const markJobAsCompleted = async (jobId) => {
  const [jobRows] = await pool.execute(
    `SELECT * FROM job_request WHERE job_id = ?`,
    [jobId]
  );

  if (jobRows.length === 0) return null;

  const job = jobRows[0];

  if (String(job.status).trim().toLowerCase() !== 'pending') {
    return { error: 'Only jobs with status Pending can be completed' };
  }

  await pool.execute(
    `UPDATE job_request SET status = 'completed' WHERE job_id = ?`,
    [jobId]
  );

  return { ...job, status: 'completed' };
};

// Create new job request
const createJobRequest = async (jobData) => {
  const {
    client_id,
    contractor_id,
    service_type,
    description,
    location,
    job_date,
    amount,
    hours_to_work,
    status
  } = jobData;

  const [result] = await pool.query(
    `INSERT INTO job_request 
      (client_id, contractor_id, service_type, description, location, job_date, amount, hours_to_work, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [client_id, contractor_id, service_type, description, location, job_date, Number(amount), hours_to_work, status || 'request']
  );

  return result.insertId;
};

// Update a job request with client ownership check
const updateJobRequest = async (jobId, clientId, jobData) => {
  try {
    const [jobRows] = await pool.query(
      `SELECT client_id, status FROM job_request WHERE job_id = ?`,
      [jobId]
    );
    if (jobRows.length === 0) {
      throw new Error('Job not found');
    }
    if (jobRows[0].client_id !== Number(clientId)) {
      throw new Error('Unauthorized: Only the client who created the job can update it');
    }
    if (jobRows[0].status !== 'request') {
      throw new Error('Only jobs in "request" status can be updated');
    }

    const {
      contractor_id,
      service_type,
      description,
      location,
      job_date,
      amount,
      hours_to_work
    } = jobData;

    const [result] = await pool.query(
      `UPDATE job_request 
       SET contractor_id = ?, service_type = ?, description = ?, location = ?, job_date = ?, amount = ?, hours_to_work = ?
       WHERE job_id = ?`,
      [contractor_id, service_type, description, location, job_date, Number(amount), hours_to_work, jobId]
    );

    return result.affectedRows > 0;
  } catch (error) {
    console.error('Database query error (updateJobRequest):', {
      message: error.message,
      stack: error.stack,
      sqlMessage: error.sqlMessage,
      sqlState: error.sqlState,
      code: error.code
    });
    throw error;
  }
};

// Fetch jobs created by a specific client (with contractor info)
const getJobsByClient = async (clientId) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        jr.job_id,
        jr.client_id,
        jr.contractor_id,
        jr.service_type,
        jr.description,
        jr.location,
        jr.job_date,
        jr.amount,
        jr.hours_to_work,
        jr.status,
        cd.full_name AS contractor_name,
        cd.phone_number AS contractor_phone
      FROM job_request jr
      LEFT JOIN contractor_details cd
        ON jr.contractor_id = cd.user_id
      WHERE jr.client_id = ?
      ORDER BY jr.job_date DESC, jr.job_id DESC
    `, [Number(clientId)]);

    return rows;
  } catch (error) {
    console.error('Database query error (getJobsByClient):', {
      message: error.message,
      stack: error.stack,
      sqlMessage: error.sqlMessage,
      sqlState: error.sqlState,
      code: error.code
    });
    throw error;
  }
};

module.exports = {
  getjobRequest,
  getjobPending,
  acceptJobById,
  denyJobById,
  deleteJobRequest,
  markJobAsCompleted,
  createJobRequest,
  updateJobRequest,
  getJobsByClient
};