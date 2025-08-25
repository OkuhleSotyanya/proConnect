// controllers/clientController.js
const bcrypt = require('bcrypt');
const ClientModel = require('../models/clientModel');

const ClientController = {
    // Admin functions to manage all clients
    async getAllClients(req, res) {
        try {
            const clients = await ClientModel.getAll();
            res.status(200).json(clients);
        } catch (error) {
            console.error('Error fetching clients:', error);
            res.status(500).json({ message: 'Failed to fetch clients' });
        }
    },

    async getClientById(req, res) {
        try {
            const { id } = req.params;
            const client = await ClientModel.getById(id);
            if (!client) {
                return res.status(404).json({ message: 'Client not found' });
            }
            res.status(200).json(client);
        } catch (error) {
            console.error('Error fetching client:', error);
            res.status(500).json({ message: 'Failed to fetch client' });
        }
    },

    async createClient(req, res) {
        try {
            const { email, password, fullname, phone_number, address } = req.body;
            if (!email || !password || !fullname) {
                return res.status(400).json({ message: 'Required fields missing' });
            }

            const passwordHash = await bcrypt.hash(password, 12);
            const newClient = await ClientModel.create(email, passwordHash, fullname, phone_number, address);
            res.status(201).json({ message: 'Client created successfully', client: newClient });
        } catch (error) {
            console.error('Error creating client:', error);
            res.status(500).json({ message: 'Failed to create client' });
        }
    },

    async updateClient(req, res) {
        try {
            const { id } = req.params;
            const { fullname, phone_number, address } = req.body;
            const affectedRows = await ClientModel.update(id, fullname, phone_number, address);
            if (affectedRows === 0) {
                return res.status(404).json({ message: 'Client not found or no changes made' });
            }
            res.status(200).json({ message: 'Client updated successfully' });
        } catch (error) {
            console.error('Error updating client:', error);
            res.status(500).json({ message: 'Failed to update client' });
        }
    },

    async deleteClient(req, res) {
        try {
            const { id } = req.params;
            const affectedRows = await ClientModel.delete(id);
            if (affectedRows === 0) {
                return res.status(404).json({ message: 'Client not found' });
            }
            res.status(200).json({ message: 'Client deleted successfully' });
        } catch (error) {
            console.error('Error deleting client:', error);
            res.status(500).json({ message: 'Failed to delete client' });
        }
    },

    // Logged-in client's own profile management
    async getMyProfile(req, res) {
        try {
            const userId = req.user.user_id;
            const client = await ClientModel.getById(userId);
            if (!client) {
                return res.status(404).json({ message: 'Client profile not found' });
            }
            res.status(200).json(client);
        } catch (err) {
            console.error('Error fetching client profile:', err);
            res.status(500).json({ message: 'Failed to fetch client profile' });
        }
    },

    async updateMyProfile(req, res) {
        try {
            const userId = req.user.user_id;
            const { fullname, email, phone_number, address } = req.body;

            // Only update if fields are provided
            if (email) {
                await ClientModel.updateEmail(userId, email);
            }
            await ClientModel.update(userId, fullname, phone_number, address);

            const updatedClient = await ClientModel.getById(userId);
            res.status(200).json(updatedClient);
        } catch (err) {
            console.error('Error updating client profile:', err);
            res.status(500).json({ message: 'Failed to update client profile' });
        }
    },
};

module.exports = ClientController;