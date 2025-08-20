const pool = require('../config/db');

const ClientModel = {
    async getAll() {
        const [rows] = await pool.query(`
            SELECT u.user_id, u.email, cd.fullname, cd.phone_number, cd.address
            FROM users u
            JOIN client_details cd ON u.user_id = cd.user_id
            WHERE u.role_id = 2
        `);
        return rows;
    },

    async getById(userId) {
        const [rows] = await pool.query(`
            SELECT u.user_id, u.email, cd.fullname, cd.phone_number, cd.address
            FROM users u
            JOIN client_details cd ON u.user_id = cd.user_id
            WHERE u.role_id = 2 AND u.user_id = ?
        `, [userId]);
        return rows[0];
    },

    async create(email, passwordHash, fullname, phone_number, address) {
        const conn = await pool.getConnection();
        try {
            await conn.beginTransaction();
            const [userResult] = await conn.query(
                `INSERT INTO users (email, password_hash, role_id) VALUES (?, ?, 2)`,
                [email, passwordHash]
            );

            await conn.query(
                `INSERT INTO client_details (user_id, fullname, phone_number, address) VALUES (?, ?, ?, ?)`,
                [userResult.insertId, fullname, phone_number, address]
            );

            await conn.commit();
            return { user_id: userResult.insertId, email, fullname, phone_number, address };
        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    },

    async update(userId, fullname, phone_number, address) {
        const [result] = await pool.query(
            `UPDATE client_details SET fullname=?, phone_number=?, address=? WHERE user_id=?`,
            [fullname, phone_number, address, userId]
        );
        return result.affectedRows;
    },

    async updateEmail(userId, email) {
        const [result] = await pool.query(`UPDATE users SET email=? WHERE user_id=?`, [email, userId]);
        return result.affectedRows;
    },

    async delete(userId) {
        const [result] = await pool.query(`DELETE FROM users WHERE user_id=? AND role_id=2`, [userId]);
        return result.affectedRows;
    }
};

module.exports = ClientModel;
