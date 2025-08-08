import { addClient, deleteClient, getClients, getClientsByID } from "../model/clientsDB.js"


// controller to get clients
export const getClientsCon = async (req, res) =>{
    res.json({
        data: await getClients()
    })
}

// controller to get clients by ID

export const getClientsByIDCon = async (req, res) => {
  try {
    const { id } = req.params;

    const client = await getClientsByID(id);

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    res.status(200).json({ data: client });

  } catch (error) {
    console.error("Error getting client by ID:", error);
    res.status(500).json({ error: "Server error" });
  }
};


// controller to add clients

export const addClientCon = async (req, res) => {
  try {
    const clientData = req.body;  // Get data from request body

    if (!clientData) {
      return res.status(400).json({ error: 'Client data is missing' });
    }

    const result = await addClient(clientData); // Pass clientData here

    res.status(201).json({
      success: true,
      message: 'Client added successfully',
      data: result,
    });

  } catch (error) {
    console.error("Error adding client:", error);
    res.status(500).json({ error: 'Server error' });
  }
};

// controller to delete clients

export const deleteClientCon = async (req, res) => {
  const { id } = req.params;
  const result = await deleteClient(id);

  res.json({ data: result });
};



// controller to update clients info

import { updateClientByEmail } from '../model/clientsDB.js';

export const updateClientsInfoCon = async (req, res) => {
  try {
    const { email } = req.params;
    const updateData = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required in the path' });
    }

    const result = await updateClientByEmail(email, updateData);

    res.status(200).json({
      message: result ? 'Client updated successfully' : 'Client not found',
      data: result,
    });
  } catch (error) {
    console.error('Error updating client:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
};
