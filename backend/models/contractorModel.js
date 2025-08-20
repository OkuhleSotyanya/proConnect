
const pool = require('../config/db');

// Whitelist for sorting to prevent SQL injection.
const SORTABLE_COLUMNS = {
  full_name: 'c.full_name',
  email: 'u.email',
  hourly_rate: 'c.hourly_rate',
  created_at: 'u.created_at'
};

/**
 * Fetch contractors with optional search, pagination, and sorting.
 * @param {Object} opts
 * @param {string} opts.search
 * @param {number} opts.page
 * @param {number} opts.limit
 * @param {string} opts.sortBy - one of: full_name, email, hourly_rate, created_at
 * @param {string} opts.sortDir - 'asc' | 'desc'
 */

// Fetch contractors with optional search, pagination, and sorting.
async function listContractors({
  search = '',
  page = 1,
  limit = 10,
  sortBy = 'full_name',
  sortDir = 'asc'
}) {
  const offset = (page - 1) * limit;

  const sortColumn = SORTABLE_COLUMNS[sortBy] || SORTABLE_COLUMNS.full_name;
  const direction = String(sortDir).toLowerCase() === 'desc' ? 'DESC' : 'ASC';

  const like = `%${search}%`;
  const whereSearch = `
    (c.full_name LIKE ? OR u.email LIKE ? OR c.phone_number LIKE ? OR
     IFNULL(c.address,'') LIKE ? OR IFNULL(c.job_experience,'') LIKE ? OR
     IFNULL(c.description,'') LIKE ?)
  `;

  const baseJoin = `
    FROM users u
    INNER JOIN roles r ON u.role_id = r.role_id
    INNER JOIN contractor_details c ON u.user_id = c.user_id
    WHERE r.role_name = 'contractor'
  `;

  const where = search
    ? `${baseJoin} AND ${whereSearch}`
    : baseJoin;

  // Count
  const [countRows] = await pool.query(
    `SELECT COUNT(*) AS total ${where}`,
    search ? [like, like, like, like, like, like] : []
  );

  // Data
  const [rows] = await pool.query(
    `
    SELECT 
      u.user_id,
      u.email,
      u.created_at,
      c.full_name,
      c.phone_number,
      c.address,
      c.certification_pdf,
      c.card_photo,
      c.hourly_rate,
      c.job_experience,
      c.description
    ${where}
    ORDER BY ${sortColumn} ${direction}
    LIMIT ? OFFSET ?
    `,
    search
      ? [like, like, like, like, like, like, Number(limit), Number(offset)]
      : [Number(limit), Number(offset)]
  );

  return {
    data: rows,
    total: countRows[0]?.total || 0
  };
}


// Get all contractors with user details
async function getAllContractors() {
    const [rows] = await pool.query(`
        SELECT u.user_id, u.email, r.role_name, 
               c.full_name, c.phone_number, c.address, 
               c.certification_pdf, c.card_photo, c.hourly_rate, 
               c.job_experience, c.description
        FROM users u
        INNER JOIN roles r ON u.role_id = r.role_id
        INNER JOIN contractor_details c ON u.user_id = c.user_id
        WHERE r.role_name = 'contractor'
    `);
    return rows;
}

// Get a single contractor by user_id
async function getContractorById(userId) {
  const [rows] = await pool.query(
    `
    SELECT 
      u.user_id,
      u.email,
      u.created_at,
      c.full_name,
      c.phone_number,
      c.address,
      c.certification_pdf,
      c.card_photo,
      c.hourly_rate,
      c.job_experience,
      c.description
    FROM users u
    INNER JOIN roles r ON u.role_id = r.role_id
    INNER JOIN contractor_details c ON u.user_id = c.user_id
    WHERE r.role_name = 'contractor' AND u.user_id = ?
    `,
    [userId]
  );
  return rows[0] || null;
}

// Create a new contractor user and update their contractor_details.
async function createContractor({
  email,
  passwordHash,
  full_name,
  phone_number,
  address,
  certification_pdf,
  card_photo,
  hourly_rate,
  job_experience,
  description
}) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Create user with contractor role
    const [userResult] = await conn.query(
      `
      INSERT INTO users (email, password_hash, role_id)
      VALUES (?, ?, (SELECT role_id FROM roles WHERE role_name = 'contractor'))
      `,
      [email, passwordHash]
    );
    const userId = userResult.insertId;

    // Update contractor_details inserted by trigger
    await conn.query(
      `
      UPDATE contractor_details
      SET full_name = ?, phone_number = ?, address = ?,
          certification_pdf = ?, card_photo = ?, hourly_rate = ?,
          job_experience = ?, description = ?
      WHERE user_id = ?
      `,
      [
        full_name || null,
        phone_number || null,
        address || null,
        certification_pdf || '',
        card_photo || '',
        Number(hourly_rate ?? 0),
        job_experience || '',
        description || '',
        userId
      ]
    );

    await conn.commit();
    return { user_id: userId };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

// Update contractor details
async function updateContractor(userId, {
  full_name,
  phone_number,
  address,
  certification_pdf,
  card_photo,
  hourly_rate,
  job_experience,
  description
}) {
  const [result] = await pool.query(
    `
    UPDATE contractor_details
    SET full_name = ?, phone_number = ?, address = ?,
        certification_pdf = ?, card_photo = ?, hourly_rate = ?,
        job_experience = ?, description = ?
    WHERE user_id = ?
    `,
    [
      full_name || null,
      phone_number || null,
      address || null,
      certification_pdf || '',
      card_photo || '',
      Number(hourly_rate ?? 0),
      job_experience || '',
      description || '',
      userId
    ]
  );
  return result.affectedRows;
}

// Update contractor email only
async function updateContractorEmail(userId, email) {
  const [result] = await pool.query(
    `UPDATE users SET email = ? WHERE user_id = ?`,
    [email, userId]
  );
  return result.affectedRows;
}

// Delete contractor
async function deleteContractor(userId) {
  const [result] = await pool.query(
    `
    DELETE FROM users 
    WHERE user_id = ? 
      AND role_id = (SELECT role_id FROM roles WHERE role_name = 'contractor')
    `,
    [userId]
  );
  return result.affectedRows;
}

module.exports = {
  listContractors,
  getAllContractors,
  getContractorById,
  createContractor,
  updateContractor,
  updateContractorEmail,
  deleteContractor
};