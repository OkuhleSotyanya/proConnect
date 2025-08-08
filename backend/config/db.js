<<<<<<< HEAD
import mysql from 'mysql2/promise'
import { config } from 'dotenv'

config()

export const pool = mysql.createPool({
    database: process.env.DATABASE,
    user: process.env.USER,
    password: process.env.PASSWORD,
    host: process.env.HOST,
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306
})
=======
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
>>>>>>> 2b90f146ae77632134381d6369473229daa13d2d
