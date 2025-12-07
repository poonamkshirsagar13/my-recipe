import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env['DB_HOST'] || 'localhost',
  user: process.env['DB_USER'] || 'cook',
  password: process.env['DB_PASSWORD'] || 'cook1234',
  database: process.env['DB_NAME'] || 'recipes',
  port: parseInt(process.env['DB_PORT'] || '3306'),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;
