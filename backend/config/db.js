const mysql = require('mysql2/promise');
require('dotenv').config();

// Create a pool for the db
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'Bheka10@',
  database: process.env.DB_NAME || 'pro_connect'
});

// Test connection
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Connected successfully');
    connection.release(); // release the connection back to the pool
  } catch (error) {
    console.error('Connection failed:', error.message);
  }
})();

module.exports = pool;
