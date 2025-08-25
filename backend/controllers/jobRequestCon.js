const {
  getjobRequest,
  getjobPending,
  acceptJobById,
  denyJobById,
  deleteJobRequest,
  markJobAsCompleted,
  createJobRequest,
  updateJobRequest,
  getJobsByClient
} = require("../models/jobRequestDB");
const pool = require("../config/db"); // Add this import to fix the error

// Get jobs for contractor
const getJobRequestCon = async (req, res) => {
  const contractorId = req.query.contractorId;
  try {
    const jobs = await getjobRequest(contractorId);
    res.json({ success: true, data: jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Database error', error });
  }
};

// Get pending jobs for contractor
const getJobPendingCon = async (req, res) => {
  const contractorId = req.query.contractorId;
  try {
    const jobs = await getjobPending(contractorId);
    res.json({ success: true, data: jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Database error', error });
  }
};

// Get all jobs (admin)
const getAllJobsCon = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        jr.job_id,
        jr.service_type,
        jr.status,
        jr.description,
        jr.location,
        jr.job_date,
        jr.amount,
        c.fullname AS clientName,
        cd.full_name AS contractorName,
        jr.client_id
      FROM job_request jr
      LEFT JOIN client_details c ON jr.client_id = c.user_id
      LEFT JOIN contractor_details cd ON jr.contractor_id = cd.user_id
      ORDER BY jr.job_date DESC, jr.job_id DESC
    `);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching all jobs:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch jobs', error });
  }
};

// Accept job
const acceptJobRequest = async (req, res) => {
  const { id } = req.params;
  try {
    await acceptJobById(id);
    res.json({ success: true, message: 'Job accepted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating job', error });
  }
};

// Deny job
const denyJobRequest = async (req, res) => {
  const { id } = req.params;
  try {
    await denyJobById(id);
    res.json({ success: true, message: 'Job denied successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating job', error });
  }
};

// Delete job
const deleteJobRequestCon = async (req, res) => {
  const { job_id } = req.params;
  const client_id = req.body?.client_id; // Safely access client_id
  const role = req.user?.role_name; // Get role from JWT token
  try {
    if (!client_id) {
      return res.status(400).json({ success: false, message: 'client_id is required' });
    }
    const success = await deleteJobRequest(job_id, client_id, role);
    if (!success) {
      return res.status(404).json({ success: false, message: 'Job not found or unauthorized' });
    }
    res.json({ success: true, message: 'Job request deleted successfully' });
  } catch (error) {
    console.error('Error deleting job:', {
      message: error.message,
      stack: error.stack,
      sqlMessage: error.sqlMessage,
      sqlState: error.sqlState,
      code: error.code
    });
    res.status(403).json({ success: false, message: error.message || 'Error deleting job' });
  }
};

// Complete job
const completeJob = async (req, res) => {
  const { job_id } = req.params;

  try {
    const result = await markJobAsCompleted(job_id);

    if (!result) return res.status(404).json({ success: false, message: 'Job not found' });
    if (result.error) return res.status(400).json({ success: false, message: result.error });

    res.status(200).json({ success: true, message: 'Job marked as completed', job: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error completing job' });
  }
};

// Create new job request
const createJobRequestCon = async (req, res) => {
  const { client_id, contractor_id, service_type, description, location, job_date, amount, hours_to_work, status } = req.body;

  if (!client_id || !contractor_id || !service_type || !job_date || !amount) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  try {
    const jobId = await createJobRequest({
      client_id,
      contractor_id,
      service_type,
      description,
      location,
      job_date,
      amount,
      hours_to_work,
      status
    });

    res.status(201).json({
      success: true,
      message: 'Job request created successfully',
      job_id: jobId
    });
  } catch (error) {
    console.error("Error creating job request:", error);
    res.status(500).json({ success: false, message: "Database error", error });
  }
};

// Update job request
const updateJobRequestCon = async (req, res) => {
  const { job_id } = req.params;
  const { client_id, contractor_id, service_type, description, location, job_date, amount, hours_to_work } = req.body;

  if (!client_id || !contractor_id || !service_type || !job_date || !amount || !hours_to_work) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  try {
    const success = await updateJobRequest(job_id, client_id, {
      contractor_id,
      service_type,
      description,
      location,
      job_date,
      amount,
      hours_to_work
    });

    if (!success) {
      return res.status(404).json({ success: false, message: 'Job not found or unauthorized' });
    }

    res.status(200).json({ success: true, message: 'Job request updated successfully' });
  } catch (error) {
    console.error("Error updating job request:", {
      message: error.message,
      stack: error.stack,
      sqlMessage: error.sqlMessage,
      sqlState: error.sqlState,
      code: error.code
    });
    res.status(403).json({ success: false, message: error.message || 'Error updating job' });
  }
};

// Get all jobs created by a specific client
const getJobsByClientCon = async (req, res) => {
  try {
    const { client_id } = req.params;
    if (!client_id) {
      return res.status(400).json({ success: false, message: "client_id is required" });
    }
    const jobs = await getJobsByClient(client_id);
    res.status(200).json({ success: true, data: jobs });
  } catch (error) {
    console.error("Error fetching client jobs:", {
      message: error.message,
      stack: error.stack,
      sqlMessage: error.sqlMessage,
      sqlState: error.sqlState,
      code: error.code
    });
    res.status(500).json({ success: false, message: "Failed to fetch client jobs", error: error.message });
  }
};

module.exports = {
  getJobRequestCon,
  getAllJobsCon,
  getJobPendingCon,
  acceptJobRequest,
  denyJobRequest,
  deleteJobRequestCon,
  completeJob,
  createJobRequestCon,
  updateJobRequestCon,
  getJobsByClientCon
};