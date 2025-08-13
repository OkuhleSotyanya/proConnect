// jobController.js
const JobModel = require('../models/jobModel');
const socketManager = require('../utils/socketManager');


const JobController = {
  async createJob(req, res) {
    try {
      if (req.user.role !== 'client') {
        return res.status(403).json({ error: 'Only clients can create jobs' });
      }

      const client_id = req.user.user_id; // Use JWT instead of body
      const { contractor_id, service_type, description, location, job_date } = req.body;

      if (!contractor_id || !service_type || !job_date) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Validate contractor_id
      const isValidContractor = await JobModel.validateUser(contractor_id, 'contractor');
      if (!isValidContractor) {
        return res.status(400).json({ error: 'Invalid contractor ID' });
      }

      // Validate job_date
      const parsedDate = Date.parse(job_date);
      if (isNaN(parsedDate)) {
        return res.status(400).json({ error: 'Invalid job_date format' });
      }
      if (parsedDate < Date.now()) {
        return res.status(400).json({ error: 'job_date cannot be in the past' });
      }

      const jobId = await JobModel.createJob(
        client_id,
        contractor_id,
        service_type,
        description,
        location,
        job_date
      );

      // Notify contractor
      const io = req.app.get('io');
      const contractorSocket = socketManager.getSocketId(contractor_id);
      if (contractorSocket) {
        io.to(contractorSocket).emit('newJobRequest', {
          job_id: jobId,
          client_id,
          service_type,
          description,
          location,
          job_date
        });
      } else {
        console.warn(`Contractor ${contractor_id} is offline; queuing notification`);
      }

      res.status(201).json({ message: 'Job created successfully', job_id: jobId });
    } catch (error) {
      console.error('Error creating job:', { error: error.message, stack: error.stack, input: req.body });
      res.status(500).json({ error: 'Failed to create job', details: error.message });
    }
  },

  async getJobsForContractor(req, res) {
    try {
      const contractorId = req.user.user_id;
      const { status, limit = 10, offset = 0 } = req.query;
      const jobs = await JobModel.getJobsForContractor(contractorId, status, parseInt(limit), parseInt(offset));
      res.json(jobs);
    } catch (error) {
      console.error('Error fetching jobs for contractor:', { error: error.message, stack: error.stack });
      res.status(500).json({ error: 'Server error fetching jobs', details: error.message });
    }
  },

  async getAllJobs(req, res) {
    try {
      const { status, limit = 10, offset = 0 } = req.query;
      const userId = req.user.user_id;
      const role = req.user.role;

      let jobs;
      if (role === 'admin') {
        jobs = await JobModel.getAllJobs(status, parseInt(limit), parseInt(offset));
      } else if (role === 'contractor') {
        jobs = await JobModel.getJobsForContractor(userId, status, parseInt(limit), parseInt(offset));
      } else if (role === 'client') {
        jobs = await JobModel.getJobsForClient(userId, status, parseInt(limit), parseInt(offset));
      } else {
        return res.status(403).json({ error: 'Unauthorized role' });
      }

      res.json(jobs);
    } catch (error) {
      console.error('Error fetching all jobs:', { error: error.message, stack: error.stack });
      res.status(500).json({ error: 'Server error fetching jobs', details: error.message });
    }
  },

  async updateJobStatus(req, res) {
    try {
      const { job_id, status } = req.body;

      if (!['accepted', 'rejected', 'in_progress', 'completed', 'cancelled'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
      }

      // Fetch job and check contractor ownership
      const job = await JobModel.getJobById(job_id);
      if (!job) {
        return res.status(404).json({ error: 'Job not found' });
      }
      if (req.user.role === 'contractor' && job.contractor_id !== req.user.user_id) {
        return res.status(403).json({ error: 'Unauthorized: cannot update this job' });
      }

      const success = await JobModel.updateJobStatus(job_id, status);
      if (!success) {
        return res.status(500).json({ error: 'Failed to update job status' });
      }

      // Notify client
      const client_id = job.client_id;
      const io = req.app.get('io');
      const clientSocket = socketManager.getSocketId(client_id);
      if (clientSocket) {
        io.to(clientSocket).emit('jobStatusUpdate', { job_id, status });
      } else {
        console.warn(`Client ${client_id} is offline; queuing notification`);
      }

      res.json({ message: `Job ${status} successfully` });
    } catch (error) {
      console.error('Error updating job status:', { error: error.message, stack: error.stack, input: req.body });
      res.status(500).json({ error: 'Failed to update job', details: error.message });
    }
  }
};

module.exports = JobController;
