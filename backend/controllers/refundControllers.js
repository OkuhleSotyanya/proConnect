const RefundModel = require('../models/refundModels');

const RefundController = {
    async createRefund(req, res) {
        try {
            const { job_id, amount, reason } = req.body;
            const refundId = await RefundModel.createRefund(job_id, amount, reason);
            res.status(201).json({ message: 'Refund request submitted successfully', refundId });
        } catch (error) {
            console.error('Error creating refund request:', error);
            res.status(500).json({ message: 'Failed to submit refund request' });
        }
    },

    async getAllRefunds(req, res) {
        try {
            const refunds = await RefundModel.getAllRefunds();
            res.status(200).json(refunds);
        } catch (error) {
            console.error('Error fetching all refunds:', error);
            res.status(500).json({ message: 'Failed to fetch refunds' });
        }
    },

    async updateRefundStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            
            if (!['approved', 'rejected'].includes(status)) {
                return res.status(400).json({ message: 'Invalid status provided' });
            }

            const success = await RefundModel.updateRefundStatus(id, status);

            if (success) {
                res.status(200).json({ message: 'Refund status updated successfully' });
            } else {
                res.status(404).json({ message: 'Refund not found' });
            }
        } catch (error) {
            console.error('Error updating refund status:', error);
            res.status(500).json({ message: 'Failed to update refund status' });
        }
    }
};

module.exports = RefundController;
