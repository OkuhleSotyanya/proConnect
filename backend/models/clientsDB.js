import { pool } from "../config/db.js";

// query to get all clients

export const getClients = async () => {
    try {
        let [rows] = await pool.query('SELECT * FROM clients');
        return rows;
    } catch (error) {
        console.error("Error fetching clients:", error);
        throw error; 
    }
};

// console.log(await getClients());


// query to get a client by id

export const getClientsByID = async (id) => {
  try {
    const [rows] = await pool.query('SELECT * FROM clients WHERE client_id = ?', [id]);
    return rows[0]; 
  } catch (error) {
    console.error("Error fetching client by ID:", error);
    throw error;
  }
};

// console.log(await getClientsByID(1));

// query to add a client

export const addClient = async (clientData) => {
  try {
    const { fullname, email, password, phone_number } = clientData;

    const [result] = await pool.query(
      `INSERT INTO clients (fullname, email, password, phone_number) 
       VALUES (?, ?, ?, ?)`,
      [fullname, email, password, phone_number]
    );

    return {client_id: result.insertId, fullname, email, phone_number};

  } catch (error) {
    console.error("Error inserting client:", error);
    throw error; 
  }
}

// query to delete a client by id

export const deleteClient = async (id) => {
  try {
    const [result] = await pool.query('DELETE FROM clients WHERE client_id = ?', [id]);
    return result.affectedRows > 0; 
  } catch (error) {
    console.error("Error deleting client:", error);
    throw error; 
  }
}

// query to update client info by email

export const updateClientByEmail = async (email, updateData) => {
  try {
    const [result] = await pool.query(
      `UPDATE clients SET ? WHERE email = ?`,
      [updateData, email]
    );
    return result.affectedRows > 0;
  } catch (error) {
    console.error('Error updating client by email:', error.message);
    throw error;
  }
};
