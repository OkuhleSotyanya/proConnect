const db = require('../config/db'); // MySQL connection

// GET client profile
exports.getProfile = async (req, res) => {
  const userId = req.user.user_id; // Matches JWT payload
  try {
    const [rows] = await db.query(
      `SELECT u.user_id, u.email, c.fullname, c.phone_number, c.address, r.role_name 
       FROM users u 
       JOIN client_details c ON u.user_id = c.user_id 
       JOIN roles r ON u.role_id = r.role_id 
       WHERE u.user_id = ? AND r.role_name = 'client'`,
      [userId]
    );
    if (rows.length === 0) return res.status(404).json({ message: "Client not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE client profile
exports.updateProfile = async (req, res) => {
  const userId = req.user.user_id; // Matches JWT payload
  const { email, fullname, phone_number, address } = req.body;
  try {
    // Update users table
    await db.query(
      "UPDATE users SET email = ? WHERE user_id = ?",
      [email, userId]
    );
    // Update client_details table
    await db.query(
      "UPDATE client_details SET fullname = ?, phone_number = ?, address = ? WHERE user_id = ?",
      [fullname, phone_number, address, userId]
    );
    // Return updated client profile
    const [rows] = await db.query(
      `SELECT u.user_id, u.email, c.fullname, c.phone_number, c.address, r.role_name 
       FROM users u 
       JOIN client_details c ON u.user_id = c.user_id 
       JOIN roles r ON u.role_id = r.role_id 
       WHERE u.user_id = ? AND r.role_name = 'client'`,
      [userId]
    );
    if (rows.length === 0) return res.status(404).json({ message: "Client not found" });
    res.json({ message: "Profile updated", user: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET client job requests and completed jobs
exports.getJobs = async (req, res) => {
  const userId = req.user.user_id; // Matches JWT payload
  try {
    const [jobRequests] = await db.query(
      `SELECT jr.job_id, jr.service_type, jr.description, jr.location, jr.job_date, jr.status, jr.amount, jr.hours_to_work, u.email AS contractor_email
       FROM job_request jr
       JOIN users u ON jr.contractor_id = u.user_id
       WHERE jr.client_id = ?`,
      [userId]
    );
    const [completedJobs] = await db.query(
      `SELECT jc.completed_id, jc.job_id, jc.service_type, jc.description, jc.location, jc.job_date, jc.rating, jc.review, u.email AS contractor_email
       FROM job_completed jc
       JOIN users u ON jc.contractor_id = u.user_id
       WHERE jc.client_id = ?`,
      [userId]
    );
    res.json({ jobRequests, completedJobs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch jobs" });
  }
};

// REQUEST REFUND (basic implementation for completed jobs)
exports.requestRefund = async (req, res) => {
  const userId = req.user.user_id; // Matches JWT payload
  const { completed_id } = req.body;
  try {
    // Verify the completed job exists and belongs to the client
    const [job] = await db.query(
      `SELECT completed_id FROM job_completed WHERE completed_id = ? AND client_id = ?`,
      [completed_id, userId]
    );
    if (job.length === 0) return res.status(404).json({ message: "Completed job not found or not associated with this client" });

    // Insert refund request (assuming a refunds table exists or needs to be created)
    // For now, return success as per original implementation
    res.json({ message: "Refund request submitted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};