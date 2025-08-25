const pool = require("../config/db");

// get all contractors
const getContractors = async () => {
  try {
    const [rows] = await pool.query("SELECT * FROM contractor_details");
    return rows;
  } catch (error) {
    console.error("Error fetching contractors:", error);
    throw error;
  }
};

// get contractor by ID
const getContractorsByID = async (id) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM contractor_details WHERE user_id = ?",
      [id]
    );
    return rows;
  } catch (error) {
    console.error("Error fetching contractor by ID:", error);
    throw error;
  }
};

// add contractor
const addContractors = async (contractorData) => {
  try {
    const {
      full_name,
      phone_number,
      certification_pdf,
      card_photo,
      hourly_rate,
      job_experience,
      description
    } = contractorData;

    const [result] = await pool.query(
      `INSERT INTO contractor_details
      (full_name, phone_number, certification_pdf, card_photo, hourly_rate, job_experience, description)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        full_name,
        phone_number,
        certification_pdf,
        card_photo,
        hourly_rate,
        job_experience,
        description
      ]
    );

    return {
      id: result.insertId,
      full_name,
      phone_number,
      certification_pdf,
      card_photo,
      hourly_rate,
      job_experience,
      description
    };
  } catch (error) {
    console.error("Error inserting contractor:", error);
    throw error;
  }
};

// delete contractor
const deleteContractors = async (id) => {
  try {
    const [result] = await pool.query(
      "DELETE FROM contractor_details WHERE user_id = ?",
      [id]
    );
    return result.affectedRows > 0
      ? { message: "Contractor deleted successfully" }
      : { message: "Contractor not found" };
  } catch (error) {
    console.error("Error deleting contractor:", error);
    throw error;
  }
};

// update contractor
const updateContractorByID = async (id, updates) => {
  try {
    const fields = Object.keys(updates);
    const values = Object.values(updates);

    if (fields.length === 0) throw new Error("No fields to update");

    const setClause = fields.map((field) => `${field} = ?`).join(", ");

    const [result] = await pool.query(
      `UPDATE contractor_details SET ${setClause} WHERE user_id = ?`,
      [...values, id]
    );

    return result;
  } catch (error) {
    console.error("DB update error:", error);
    throw error;
  }
};

module.exports = {
  getContractors,
  getContractorsByID,
  addContractors,
  deleteContractors,
  updateContractorByID
};
