import { pool } from "../config/db.js";


// query to get all contractors
export const getContractors = async () =>{
    try{
        let [row] = await pool.query('SELECT * FROM contractors');
        return row

    } catch(error) {
         return 'err'
    }
}

// console.log(await getContractors());


// query to get a contractor by id

export const getContractorsByID = async (id) => {
    try {
        let [row] = await pool.query('SELECT * FROM contractors WHERE id = ?', [id]);
        return row;
    } catch (error) {
        return 'err';
    }
}

// query to add a contractor

export const addContractors = async (contractorData) => {
  try {
    const {full_name, email, password_hash, phone_number, certification_pdf, card_photo, hourly_rate, job_experience, description} = contractorData;

    const [result] = await pool.query(
      `INSERT INTO contractors 
        (full_name, email, password_hash, phone_number, certification_pdf, card_photo, hourly_rate, job_experience, description) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [full_name, email, password_hash, phone_number, certification_pdf, card_photo, hourly_rate, job_experience, description] );

   
   return {
      id: result.insertId,
      full_name,
      email,
      phone_number,
      certification_pdf,
      card_photo,
      hourly_rate,
      job_experience,
      description
    };

  } catch (error) {
    console.error("Error inserting contractor:", error);
    throw error; // let controller handle the error response
  }
};

// query to delete a contractor by id

export const deleteContractors = async (id) => {
    try {
        const [result] = await pool.query('DELETE FROM contractors WHERE id = ?', [id]);
        return result.affectedRows > 0 ? { message: 'Contractor deleted successfully' } : { message: 'Contractor not found' };
    } catch (error) {
        console.error("Error deleting contractor:", error);
        throw error; 
    }
}

// console.log(await deleteContractors(3));


// query to update contractor info

export const updateContractorByEmail = async (email, updates) => {
  const fields = Object.keys(updates);
  const values = Object.values(updates);

  const setClause = fields.map(field => `${field} = ?`).join(', ');

  const [result] = await pool.query(
    `UPDATE contractors SET ${setClause} WHERE email = ?`,
    [...values, email]
  );

  return result;
};

