const db = require('../config/db');

const RefundModel = {
    async createRefund(job_id, amount, reason) {
        const [result] = await db.query(
            `INSERT INTO refunds (job_id, amount, reason, status) VALUES (?, ?, ?, 'pending')`,
            [job_id, amount, reason]
        );
        return result.insertId;
    },

    async getAllRefunds() {
        const [rows] = await db.query(
            `SELECT * FROM refunds ORDER BY created_at DESC`
        );
        return rows;
    },

    async updateRefundStatus(id, status) {
        const [result] = await db.query(
            `UPDATE refunds SET status = ? WHERE id = ?`,
            [status, id]
        );
        return result.affectedRows > 0;
    }
};

module.exports = RefundModel;
