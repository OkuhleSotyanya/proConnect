const pool = require("../config/db"); // your existing db.js connection

// Get all clients
const getAllClients = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT u.user_id, cd.fullname, u.email, cd.phone_number AS cellnumber, cd.address AS location
       FROM users u
       JOIN client_details cd ON u.user_id = cd.user_id
       WHERE u.role_id = (SELECT role_id FROM roles WHERE role_name='client')`
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching clients" });
  }
};

// Get all contractors
const getAllContractors = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT u.user_id, ctd.full_name, u.email, ctd.phone_number AS cellnumber, ctd.job_experience, ctd.hourly_rate AS rate
       FROM users u
       JOIN contractor_details ctd ON u.user_id = ctd.user_id
       WHERE u.role_id = (SELECT role_id FROM roles WHERE role_name='contractor')`
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching contractors" });
  }
};

// Get all payments
const getAllPayments = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT j.id, cd.name AS clientName, ctd.name AS contractorName, j.service_type AS jobDescription,
              j.amount, j.status, j.job_date AS date
       FROM jobs j
       JOIN client_details cd ON j.client_id = cd.id
       JOIN contractor_details ctd ON j.contractor_id = ctd.id`
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching payments" });
  }
};

// Delete client
const deleteClientById = async (req, res) => {
  try {
    const clientId = req.params.id;
    await pool.query("DELETE FROM users WHERE id=?", [clientId]);
    res.json({ message: "Client deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error deleting client" });
  }
};

// Delete contractor
const deleteContractorById = async (req, res) => {
  try {
    const contractorId = req.params.id;
    await pool.query("DELETE FROM users WHERE id=?", [contractorId]);
    res.json({ message: "Contractor deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error deleting contractor" });
  }
};

module.exports = {
  getAllClients,
  getAllContractors,
  getAllPayments,
  deleteClientById,
  deleteContractorById
};
